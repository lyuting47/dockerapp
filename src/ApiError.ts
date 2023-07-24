export class ApiError extends Error {
  name: string;
  message: string;

  public constructor() {
    super();
    this.name = "Generic ApiError";
    this.message = "Default ApiError Message";
  }
}
