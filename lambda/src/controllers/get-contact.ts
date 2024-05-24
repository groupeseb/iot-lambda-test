import { Controller } from "@common/controller";
import { ControllerError } from "@common/errors/ControllerError";
import { ControllerResult } from "@common/models/controller-result";
import { DynamodbService } from '../services/dynamodb.service';

export class GetAllIdsController extends Controller<null, null, never, number[]> {

  private db = new DynamodbService(this.awsConfig);

  validateInputs(body: string | null, queryParams: { id: string } | null, pathParams: never): void {
    if (!queryParams?.id?.length) {
      throw new ControllerError(400, 'input id is required in query parameters', queryParams);
    }
  }

  async handle(body: null, queryParams: null, pathParams: never): Promise<ControllerResult<number[]>> {

  }
}
