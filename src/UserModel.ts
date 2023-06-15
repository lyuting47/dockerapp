class UserModel {
  username!: string;
  fullname!: string;
  timezone!: string;
}

const EmptyUser: UserModel = {
  username: "",
  fullname: "",
  timezone: "",
};

export { UserModel, EmptyUser };
