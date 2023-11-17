export default class ResourceNotFound extends Error {
  static msg: string;

  constructor(msg?: string) {
    ResourceNotFound.msg = "The resource you requested was not found.";
    super(msg ? msg : ResourceNotFound.msg);
  }
}