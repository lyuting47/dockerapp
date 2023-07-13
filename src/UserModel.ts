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

  public constructor(username: string, fullName: string, timezone: string) {
    this.username = username;
    this.fullName = fullName;
    this.timezone = timezone;
  }
}
