import React from "react";
import { UserModel } from "../UserModel";

const Profile = (props: { data: UserModel }) => {
  return (
    <form>
      <hr style={{ width: "100%" }} />
      <div>
        <p>
          <strong>ID: </strong> {props.data.id}
        </p>
        <p>
          <strong>Username: </strong> {props.data.username}
        </p>
        <p>
          <strong>Full Name: </strong> {props.data.fullName}
        </p>
        <p>
          <strong>Timezone: </strong> {props.data.timezone}
        </p>
      </div>
    </form>
  );
};

export default Profile;
