import { AbstractEventsHandler } from '@common/handlers/events-handler';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { GetContactController } from '../controllers/get-all-ids-controller';

// Force webpack into keeping some raw files
// eslint-disable-next-line unused-imports/no-unused-vars
function rawFilesToIncludeInBundle(): void {
  require('../../events.yml');
}

export class EventsHandler extends AbstractEventsHandler {
  index(
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    return this.commonEvents.index(event, context, {
      'get-/get-all-ids': new GetContactController(this.awsConfig), // J'imagine qu'il faut changer le path à ce niveau pour lier la route au controller
    });
  }
}

export function index(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  return new EventsHandler(event).index(event, context);
}
