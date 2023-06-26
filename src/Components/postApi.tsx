import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { apiConfig, loginRequest } from "../authConfig";
import Profile from "./profile";
import { useRequestApi } from "../CustomHooks/useRequestAPI";
import { Provider } from "../CustomHooks/provider";
import { UserModel } from "../UserModel";
import { ApiError } from "../ApiError";
import ApiErrorProfile from "./apiErrorProfile";

const PostApiButton = (props: { provider: Provider }) => {
  const { instance } = useMsal();
  const [data, setData] = useState<UserModel | ApiError>(UserModel.EmptyUser);
  const [retrieving, setRetrieving] = useState(false);
  const [newUser, setNewUser] = useState(new UserModel());
  const requestApi = useRequestApi<UserModel | ApiError>(
    props.provider,
    (response: UserModel | ApiError) => {
      console.log(response);
      setData(response);
      setRetrieving(false);
    },
    instance.getActiveAccount(),
    loginRequest
  );

  return (
    <>
      {!retrieving ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setRetrieving(true);
            requestApi<UserModel>(apiConfig.apiEndpoint, "POST", newUser);
          }}
        >
          <label>
            Username:{" "}
            <input
              name="username"
              onChange={(e) =>
                setNewUser((user) => {
                  user.username = e.target.value;
                  return user;
                })
              }
              size={23}
              style={{ verticalAlign: 2.5 }}
            />
          </label>
          <hr />
          <label>
            Full Name:{" "}
            <input
              name="fullName"
              onChange={(e) =>
                setNewUser((user) => {
                  user.fullName = e.target.value;
                  return user;
                })
              }
              size={23}
              style={{ verticalAlign: 2.5 }}
            />
          </label>
          <hr />
          <label>
            Timezone:{" "}
            <input
              name="timezone"
              onChange={(e) =>
                setNewUser((user) => {
                  user.timezone = e.target.value;
                  return user;
                })
              }
              size={23}
              style={{ verticalAlign: 2.5 }}
            />
          </label>
          <hr />
          <button type="submit">Send Request</button>
        </form>
      ) : (
        <h5 className="card-title">Loading...</h5>
      )}

      {(data as UserModel).id !== undefined && !retrieving && (
        <Profile data={data as UserModel} />
      )}
      {(data as ApiError).name !== undefined && !retrieving && (
        <ApiErrorProfile data={data as ApiError} />
      )}
    </>
  );
};

export default PostApiButton;
