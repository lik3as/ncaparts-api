export default class RequestAuthorizationError extends Error {
  static msg: string;

  constructor(msg?: string) {
    RequestAuthorizationError.msg = "You're unauthorized to make this request.";
    super(msg? msg : RequestAuthorizationError.msg);
  }
}