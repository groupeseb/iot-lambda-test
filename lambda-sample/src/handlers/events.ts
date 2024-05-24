import {AbstractEventsHandler} from "@common/handlers/events-handler";
import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {SomePathGetController} from '../controllers/some-path-get-controller';

// Force webpack into keeping some raw files
// eslint-disable-next-line unused-imports/no-unused-vars
function rawFilesToIncludeInBundle(): void {
    require('../../events.yml');
}

export class EventsHandler extends AbstractEventsHandler{

    index(
      event: APIGatewayEvent,
      context: Context,
    ): Promise<APIGatewayProxyResult> {
        return this.commonEvents.index(event, context, {
            'get-/some-path/{id}': new SomePathGetController(this.awsConfig)
        });
    }
}

export function index(
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
    return new EventsHandler(event).index(event, context);
}
