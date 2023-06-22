export class UserModel {
  username!: string;
  fullname!: string;
  timezone!: string;

  public static EmptyUser: UserModel = {
    username: "",
    fullname: "",
    timezone: "",
  };
}
