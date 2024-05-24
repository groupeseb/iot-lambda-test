import {AwsConfig} from './models/aws-config';
import {ControllerResult} from './models/controller-result';

export abstract class Controller <B, P, PP, R> {

  awsConfig: AwsConfig;

  constructor(awsConfig: AwsConfig) {
    this.awsConfig = awsConfig;
  }

  /**
   * Validates inputs.
   * Throws a ControllerError if any input is invalid.
   * @param body
   * @param params
   * @param pathParameters
   */
  abstract validateInputs(body: Partial<B>|null, params: Partial<P>|null, pathParameters: Partial<PP>|null): void|Promise<void>;

  init(_body: B, _params: P | null, _pathParameters: PP): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Handles the request.
   * @param body
   * @param params
   * @param pathParameters
   */
  abstract handle(body: B, params: P, pathParameters: PP):
   Promise<ControllerResult<R>>
   | ControllerResult<R>;

}
