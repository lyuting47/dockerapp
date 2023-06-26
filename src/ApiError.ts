export class ApiError {
  name: string;
  message: string;

  public constructor() {
    this.name = "Generic ApiError";
    this.message = "Default ApiError Message";
  }
}
