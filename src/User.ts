export class User {
  id?: string;
  username: string;
  fullName: string;
  timezone: string;

  public static EmptyUser: User = {
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
