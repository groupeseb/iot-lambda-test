import {Controller} from '@common/controller';
import {ControllerError} from '@common/errors/ControllerError';
import {CommonEvents} from '@common/handlers/common-events';
import {ControllerResult} from '@common/models/controller-result';
import {APIGatewayEvent} from 'aws-lambda';
import {SinonStub, SinonStubbedInstance} from 'sinon';
import sinon from '../common-tests-init.spec';

describe('common index', () => {
  const commonEvents = new CommonEvents();

  class FakeController extends Controller<any,any,any,any> {
    handle(): Promise<ControllerResult<any>> | ControllerResult<any> {
      return undefined as any;
    }
    validateInputs(): void {return;}
  }

  let controllerStub: SinonStubbedInstance<FakeController>;

  beforeEach(() => {
    controllerStub = sinon.createStubInstance(FakeController);
  });

  const bodyStr = 'body_6841';
  const queryParams = {
    someParam: 'someValue_6841'
  };

  describe('given method or path not mapped to any controller', () => {
    it('should return a 400 error', async () => {
      const res = await commonEvents.index(
       {
         httpMethod: 'GET',
         resource: '/whatever'
       } as APIGatewayEvent,
       undefined as any,
       {}
      );

      res.statusCode.should.equal(400);
    });
  });
  describe('given method or path correctly mapped to a controller', () => {
    describe('when inputs validation throws an error', () => {
      it('should convert the error and return it', async () => {

        controllerStub.validateInputs.throws(new ControllerError(400, 'invalid input'));

        const res = await commonEvents.index(
         {
           httpMethod: 'GET',
           resource: '/whatever',
           body: bodyStr,
           queryStringParameters: queryParams
         } as any,
         undefined as any,
         {
           'get-/whatever': controllerStub
         }
        );

        res.statusCode.should.equal(400);
        res.body.should.be.equal(JSON.stringify({message: 'invalid input', details: {status: 400}}));
        controllerStub.validateInputs.should.have.been.calledOnceWith(bodyStr, queryParams);
        controllerStub.handle.should.not.have.been.called;
      });
    });
    describe('when inputs validation returns a rejecting promise', () => {
      it('should convert the error and return it', async () => {

        controllerStub.validateInputs.rejects(new ControllerError(400, 'invalid input'));

        const res = await commonEvents.index(
         {
           httpMethod: 'GET',
           resource: '/whatever',
           body: bodyStr,
           queryStringParameters: queryParams
         } as any,
         undefined as any,
         {
           'get-/whatever': controllerStub
         }
        );

        res.statusCode.should.equal(400);
        res.body.should.be.equal(JSON.stringify({message: 'invalid input', details: {status: 400}}));
        controllerStub.validateInputs.should.have.been.calledOnceWith(bodyStr, queryParams);
        controllerStub.handle.should.not.have.been.called;
      });
    });

    describe('when handling throws an error', () => {
      it('should convert the error and return it', async () => {

        controllerStub.handle.throws(new Error('An error occurred ;('));

        const res = await commonEvents.index(
         {
           httpMethod: 'GET',
           resource: '/whatever',
           body: bodyStr,
           queryStringParameters: queryParams
         } as any,
         undefined as any,
         {
           'get-/whatever': controllerStub
         }
        );

        res.statusCode.should.equal(500);
        res.body.should.be.equal(JSON.stringify({message: 'An error occurred ;(', details: {}}));
        controllerStub.validateInputs.should.have.been.calledOnceWith(bodyStr, queryParams);
        controllerStub.handle.should.have.been.calledOnceWith(bodyStr, queryParams);
      });
    });
    describe('when handling returns a result', () => {
      it('should convert the response and return it', async () => {

        controllerStub.handle.returns(new ControllerResult({
          status: 201,
          body: bodyStr
        }));

        const res = await commonEvents.index(
         {
           httpMethod: 'POST',
           resource: '/whatever',
           body: bodyStr,
           queryStringParameters: queryParams
         } as any,
         undefined as any,
         {
           'post-/whatever': controllerStub
         }
        );

        res.statusCode.should.equal(201);
        res.body.should.equal(bodyStr);
        controllerStub.validateInputs.should.have.been.calledOnceWith(bodyStr, queryParams);
        controllerStub.handle.should.have.been.calledOnceWith(bodyStr, queryParams);
      });
    });
    describe('when handling returns a rejecting promise', () => {
      it('should convert the error and return it', async () => {

        controllerStub.handle.rejects({whatever: 'error message'});

        const res = await commonEvents.index(
         {
           httpMethod: 'POST',
           resource: '/whatever',
           body: bodyStr,
           queryStringParameters: queryParams
         } as any,
         undefined as any,
         {
           'post-/whatever': controllerStub
         }
        );

        res.statusCode.should.equal(500);
        res.body.should.equal(JSON.stringify({whatever: 'error message'}));
        controllerStub.validateInputs.should.have.been.calledOnceWith(bodyStr, queryParams);
        controllerStub.handle.should.have.been.calledOnceWith(bodyStr, queryParams);
      });
    });
  });
});
