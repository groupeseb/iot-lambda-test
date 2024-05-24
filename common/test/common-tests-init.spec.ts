import chai from 'chai';
import sinonChai from 'sinon-chai';
import {createSandbox, SinonFakeTimers, SinonSandbox} from 'sinon';
import {beforeEach} from 'mocha';
import DeepEqualInAnyOrder from 'deep-equal-in-any-order';

const sinon: SinonSandbox = createSandbox();
let clock: SinonFakeTimers;

// Global 'before' to initialize the test framework with libs
before(() => {
  console.log('Init test dependencies');
  chai.use(sinonChai);
  chai.should();
  chai.use(DeepEqualInAnyOrder);
});

beforeEach(() => {
  clock = sinon.useFakeTimers(new Date());
});

afterEach(() => {
  sinon.reset();
  sinon.restore();
});

after(() => {
  clock.reset();
});

export default sinon;
