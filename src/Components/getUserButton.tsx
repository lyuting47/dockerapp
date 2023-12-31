import React, { useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { apiConfig, loginRequest } from "../authConfig";
import UserProfile from "./userProfile";
import { useRequestApi } from "../CustomHooks/useRequestAPI";
import { AuthProvider } from "../CustomHooks/authProvider";
import { User } from "../User";
import { ApiError } from "../ApiError";
import ApiErrorProfile from "./apiErrorProfile";

const GetUserButton = (props: { provider: AuthProvider }) => {
  const { instance } = useMsal();
  const [displayData, setDisplayData] = useState<User | ApiError>(
    User.EmptyUser
  );
  const [retrieving, setRetrieving] = useState(false);
  const [searchId, setSearchId] = useState("6476b6c5ca2931de7dd4badc");
  const searchIdRef = useRef<HTMLInputElement>(null);
  const requestApi = useRequestApi(
    props.provider,
    instance.getActiveAccount(),
    loginRequest
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchIdRef.current === null) {
      throw Error("Cannot find reference to input element");
    }
    setSearchId(searchIdRef.current.value);
    setRetrieving(true);
    requestApi<undefined, User | ApiError>(
      apiConfig.apiEndpoint + searchIdRef.current.value,
      "GET",
      (response: User | ApiError) => {
        setDisplayData(response);
        setRetrieving(false);
      }
    );
  };

  return (
    <>
      {!retrieving ? (
        <form onSubmit={handleSubmit}>
          <label>
            ID:{" "}
            <input
              aria-label="user_input_search_id"
              defaultValue={searchId}
              ref={searchIdRef}
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

export default GetUserButton;
