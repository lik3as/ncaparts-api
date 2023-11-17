export default class ResourceNotFoundError extends Error {
  static msg: string;

  constructor(msg?: string) {
    ResourceNotFoundError.msg = "The resource you requested was not found.";
    super(msg ? msg : ResourceNotFoundError.msg);
  }
}