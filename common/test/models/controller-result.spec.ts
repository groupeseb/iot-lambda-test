import {ControllerResult} from '../../src/models/controller-result';

describe('ControllerResult', () => {
  describe('toAwsResponse', () => {
    describe('given text body', () => {
      it('should generate a valid aws response object', () => {
        const headerKey = 'ket_68541';
        const headerVal = 'header_21304';
        const status = 35142;
        const body = 'body_36521';

        const controllerResult = new ControllerResult<string>({
          status,
          body,
          headers: {[headerKey]: headerVal}
        });

        controllerResult.toAwsResponse(undefined).should.deep.equal({
          statusCode: status,
          headers: {
            [headerKey]: headerVal,
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Headers': 'ket_68541,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id',
            'Access-Control-Allow-Methods': 'OPTIONS',
            'Access-Control-Allow-Origin': ''
          },
          body
        });
      });
    });
    describe('given object body', () => {
      it('should generate a valid aws response object', () => {
        const headerKey = 'ket_68541';
        const headerVal = 'header_21304';
        const status = 35142;
        const bodyFieldKey = 'key_69851';

        interface SomeType {
          [bodyFieldKey]: string;
        }

        const body: SomeType = {
          [bodyFieldKey]: 'body_value_69841'
        };

        const controllerResult = new ControllerResult<SomeType>({
          status,
          body,
          headers: {[headerKey]: headerVal}
        });

        controllerResult.toAwsResponse(undefined).should.deep.equal({
          statusCode: status,
          headers: {
            [headerKey]: headerVal,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'ket_68541,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id',
            'Access-Control-Allow-Methods': 'OPTIONS',
            'Access-Control-Allow-Origin': ''
          },
          body: JSON.stringify(body)
        });
      });
    });
  });
});
