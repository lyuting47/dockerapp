import React from "react";
import { EmptyUser, UserModel } from "../UserModel";

const Profile = (props: { data: UserModel }) => {
  console.log(props.data);
  return (
    <form>
      <hr style={{ width: "100%" }} />
      {props.data.username === undefined ? (
        <strong>User Not Found</strong>
      ) : (
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
      )}
    </form>
  );
};

export default Profile;
