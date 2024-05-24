import {APIGatewayProxyResult} from 'aws-lambda';
import events from './events';

export class ControllerResult<T> {
  status: number;
  headers?: { [header: string]: boolean | number | string };
  body: T;

  constructor(params: {
    status?: number,
    headers?: { [header: string]: boolean | number | string },
    body: T
  }) {
    this.status = params?.status ?? 200;
    this.headers = params.headers ?? {};
    this.body = params.body;
  }

  public toAwsResponse(requestOrigin: string | undefined): APIGatewayProxyResult {
    const allowedOrigins = new Set<string>(
      process.env.allowedOrigins?.split(',')
    );

    const methods = new Set<string>(events.map(ev => ev.http.method.toUpperCase()));
    methods.add('OPTIONS');

    const headers = new Set<string>(Object.keys(this.headers ?? {}));
    headers.add('Content-Type');
    headers.add('X-Amz-Date');
    headers.add('Authorization');
    headers.add('X-Api-Key');
    headers.add('X-Amz-Security-Token');
    headers.add('X-Amz-User-Agent');
    headers.add('X-Amzn-Trace-Id');

    const result = {
      statusCode: this.status,
      headers: {
        ...this.headers,
        'Content-Type': typeof (this.body) === 'string' ? 'text/plain' : 'application/json',
        'Access-Control-Allow-Headers': [...headers].join(','),
        'Access-Control-Allow-Origin': allowedOrigins.size && requestOrigin && allowedOrigins.has(requestOrigin) ? requestOrigin : '',
        'Access-Control-Allow-Methods': [...methods].join(','),
      },
      body: typeof (this.body) === 'string' ? this.body : JSON.stringify(this.body)
    };

    console.log(result);
    return result;
  }
}
