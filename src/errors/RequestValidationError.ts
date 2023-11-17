export default class RequestValidationError extends Error {
  static msg: string;

  constructor(msg?: string) {
    RequestValidationError.msg = "The request you made is invalid. ";
    super(msg? msg : RequestValidationError.msg);
  }
}