export default class RequestValidationError extends Error {
  static msg: "The client sent an invalid request";

  constructor(msg?: string) {
    super(msg? msg : RequestValidationError.msg);
  }
}