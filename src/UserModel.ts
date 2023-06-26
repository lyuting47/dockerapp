export class UserModel {
  id?: string;
  username: string;
  fullName: string;
  timezone: string;

  public static EmptyUser: UserModel = {
    username: "",
    fullName: "",
    timezone: "",
  };

  public constructor() {
    this.username = "";
    this.fullName = "";
    this.timezone = "";
  }
}
