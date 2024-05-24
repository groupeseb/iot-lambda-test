import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';
import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {Controller} from '../controller';
import {ControllerError} from '../errors/ControllerError';
import {AwsConfig} from '../models/aws-config';
import {ControllerResult} from '../models/controller-result';

export class CommonEvents {

  cognitoUserPoolId = process.env['cognitoUserPoolId'] as string;
  cognitoIdentityPoolId = process.env['cognitoIdentityPoolId'] as string;

  initAwsConfig(event: APIGatewayEvent): AwsConfig {
    const region = process.env['region'] as string;
    const authorization = event.headers.Authorization as string;

    let credentials;

    if (authorization) {
      credentials = fromCognitoIdentityPool({
        clientConfig: {region},
        identityPoolId: this.cognitoIdentityPoolId,
        logins: {
          [`cognito-idp.${region}.amazonaws.com/${this.cognitoUserPoolId}`]: authorization
        }
      });
    }

    return {
      region,
      credentials,
    };
  }

  /**
   * Common method to be used in index events handler functions.
   * @param event Event received from lambda framework
   * @param context Context received from lambda framework
   * @param controllers Map containing Controller objects with keys at format 'method-path' e.g {}'get-/some-path': new SomePathGetController()}
   */
  async index(
    event: APIGatewayEvent,
    context: Context,
    controllers: { [methodDashPath: string]: Controller<unknown, unknown, unknown, unknown> }
  ): Promise<APIGatewayProxyResult> {

    console.log(event);

    const controller = controllers[`${event.httpMethod.toLowerCase()}-${event.resource}`];
    const originHeader = event.headers?.Origin ?? event.headers?.origin;

    if (!controller) {
      console.error('unhandled method/path');
      return Promise.resolve(new ControllerResult({
        status: 400,
        body: 'Unhandled path/method received'
      }).toAwsResponse(originHeader));
    }

    let result: ControllerResult<unknown>;
    let requestBody;

    const contentTypeHeader = event.headers?.['Content-Type'] ?? event.headers?.['content-type'];

    if (contentTypeHeader === 'application/json'){
      if (!event.body){
        return Promise.resolve(new ControllerResult({
          status: 400,
          body: 'Missing input body'
        }).toAwsResponse(originHeader));
      }
      try {
        requestBody = JSON.parse(event.body);
      } catch(e) {
        return Promise.resolve(new ControllerResult({
          status: 400,
          body: `JSON body can't be parsed : \r ${e instanceof Error ? e.message : e}`
        }).toAwsResponse(originHeader));
      }
    } else {
      requestBody = event.body;
    }

    const pathParameters = event.pathParameters;
    if(pathParameters != null) {
      Object?.keys(pathParameters).forEach(
        key => {
          if(pathParameters[key] && typeof pathParameters[key] === 'string') {
            pathParameters[key] = decodeURIComponent(pathParameters[key]!);
          }
        }
      );
    }

    try {
      await controller.validateInputs(requestBody, event.queryStringParameters, event.pathParameters);
      await controller.init(requestBody, event.queryStringParameters, event.pathParameters);
      result = await controller.handle(requestBody, event.queryStringParameters, event.pathParameters);
    } catch (err) {
      return Promise.resolve(this.convertErrorToAwsResponse(err, originHeader));
    }

    return result.toAwsResponse(originHeader);
  }

  private convertErrorToAwsResponse(err: unknown, requestOrigin: string|undefined): APIGatewayProxyResult {
    console.log(err);

    let status = 500;

    if(err instanceof ControllerError){
      status = err.status;
    }

    /* eslint-disable */
    if((err as any).$metadata?.httpStatusCode){
      status = (err as any).$metadata.httpStatusCode;
    }
    /* eslint-enable */

    return new ControllerResult({
      status: status,
      body: err instanceof ControllerError && err.details ? { message: err.message, details : err.details }
        : err instanceof Error ? { message: err.message, details: err } : err
    }).toAwsResponse(requestOrigin);
  }
}
