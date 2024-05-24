import {CommonEvents} from './common-events';
import {APIGatewayEvent} from 'aws-lambda';
import {AwsConfig} from '../models/aws-config';

export abstract class AbstractEventsHandler {
  commonEvents: CommonEvents;
  awsConfig: AwsConfig;

  constructor(event: APIGatewayEvent, commonHandler?: CommonEvents) {
    this.commonEvents = commonHandler ?? new CommonEvents();

    this.awsConfig = this.commonEvents.initAwsConfig(event);
  }
}
