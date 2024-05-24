export class ControllerError<DETAILS = unknown> extends Error {
  status: number;
  details: DETAILS|undefined;

  constructor(status: number, message: string, details?: DETAILS) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
