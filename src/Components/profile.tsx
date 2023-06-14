import React from "react";
import { UserModel } from "../UserModel";

const Profile = (props: { data: UserModel }) => {
  return (
    <div>
      <p>
        <strong>Username: </strong> {props.data.username}
      </p>
      <p>
        <strong>Full Name: </strong> {props.data.fullname}
      </p>
      <p>
        <strong>Timezone: </strong> {props.data.timezone}
      </p>
    </div>
  );
};

export default Profile;
