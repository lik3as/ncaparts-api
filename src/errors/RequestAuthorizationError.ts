export default class RequestAuthorizationError extends Error {
  static msg: "The client is not authorized to make this request";

  constructor(msg?: string) {
    super(msg? msg : RequestAuthorizationError.msg);
  }
}