import { Controller } from "@common/controller";
import { ControllerError } from "@common/errors/ControllerError";
import { ControllerResult } from "@common/models/controller-result";
import { DynamodbService } from '../services/dynamodb.service';

export class GetContactController extends Controller<null, null, never, number[]> {

  private db = new DynamodbService(this.awsConfig);

  validateInputs(body: string | null, queryParams: { id: string } | null, pathParams: never): void {
    if (!queryParams?.id?.length) {
      throw new ControllerError(400, 'input id is required in query parameters', queryParams);
    }
  }

  async handle(body: null, queryParams: null, pathParams: never): Promise<ControllerResult<number[]>> {
    try {
      const contactsList = await this.db.getContactsList();
      return new ControllerResult<number[]>({
        status: 200,
        body: contactsList // Pas sur du type de retour, si il vaut mieux renvoyer une string il faut changer le type
        // passé à la classe Controller : Controller<null, null, never, string> et 
        // utiliser stringify sur contactsList: body: JSON.stringify(contactsList)
        // et changer le type de retour de handle(): Promise<ControllerResult<string>>
      });
    } catch (error) {
      throw new ControllerError(500, 'failed to retrieve contacts list', error);
    }
  }
}
