import {Controller} from "@common/controller";
import {ControllerResult} from "@common/models/controller-result";
import {ControllerError} from "@common/errors/ControllerError";

export class SomePathGetController extends Controller<string, {id: string}, never, string> {

  validateInputs(body: string | null, queryParams: {id: string} | null, pathParams: never): void {
    if(!queryParams?.id?.length){
      throw new ControllerError(400, 'input id is required in query parameters', queryParams);
    }
  }

  handle(body: string, queryParams: {id: string}, pathParams: never): ControllerResult<string> {
    return new ControllerResult<string>({
      status: 200,
      body: "Hello world !"
    });
  }

}
