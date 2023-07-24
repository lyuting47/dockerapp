import React, { useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { apiConfig, loginRequest } from "../authConfig";
import UserProfile from "./userProfile";
import { useRequestApi } from "../CustomHooks/useRequestAPI";
import { AuthProvider } from "../CustomHooks/authProvider";
import { User } from "../User";
import { ApiError } from "../ApiError";
import ApiErrorProfile from "./apiErrorProfile";

const PostUserButton = (props: { provider: AuthProvider }) => {
  const { instance } = useMsal();
  const [displayData, setDisplayData] = useState<User | ApiError>(
    User.EmptyUser
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
    requestApi<User, User | ApiError>(
      apiConfig.apiEndpoint,
      "POST",
      (response: User | ApiError) => {
        setDisplayData(response);
        setRetrieving(false);
      },
      new User(
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

      {(displayData as User).id !== undefined && !retrieving && (
        <UserProfile data={displayData as User} />
      )}
      {(displayData as ApiError).name !== undefined && !retrieving && (
        <ApiErrorProfile data={displayData as ApiError} />
      )}
    </>
  );
};

export default PostUserButton;
