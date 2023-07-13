import React, { useRef, useState } from "react";
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
  const [displayData, setDisplayData] = useState<UserModel | ApiError>(
    UserModel.EmptyUser
  );
  const [retrieving, setRetrieving] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const timezoneRef = useRef<HTMLInputElement>(null);
  const requestApi = useRequestApi(
    props.provider,
    instance.getActiveAccount(),
    loginRequest
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      usernameRef.current === null ||
      fullNameRef.current === null ||
      timezoneRef.current === null
    ) {
      throw Error("Cannot find reference to input element(s)");
    }
    setRetrieving(true);
    requestApi<UserModel, UserModel | ApiError>(
      apiConfig.apiEndpoint,
      "POST",
      (response: UserModel | ApiError) => {
        setDisplayData(response);
        setRetrieving(false);
      },
      new UserModel(
        usernameRef.current.value,
        fullNameRef.current.value,
        timezoneRef.current.value
      )
    );
  };

  return (
    <>
      {!retrieving ? (
        <form onSubmit={handleSubmit}>
          <label>
            Username:{" "}
            <input
              aria-label="username"
              ref={usernameRef}
              size={23}
              style={{ verticalAlign: 2.5 }}
            />
          </label>
          <hr />
          <label>
            Full Name:{" "}
            <input
              aria-label="fullName"
              ref={fullNameRef}
              size={23}
              style={{ verticalAlign: 2.5 }}
            />
          </label>
          <hr />
          <label>
            Timezone:{" "}
            <input
              aria-label="timezone"
              ref={timezoneRef}
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

      {(displayData as UserModel).id !== undefined && !retrieving && (
        <Profile data={displayData as UserModel} />
      )}
      {(displayData as ApiError).name !== undefined && !retrieving && (
        <ApiErrorProfile data={displayData as ApiError} />
      )}
    </>
  );
};

export default PostApiButton;
