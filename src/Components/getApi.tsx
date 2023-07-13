import React, { useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { apiConfig, loginRequest } from "../authConfig";
import Profile from "./profile";
import { useRequestApi } from "../CustomHooks/useRequestAPI";
import { Provider } from "../CustomHooks/provider";
import { UserModel } from "../UserModel";
import { ApiError } from "../ApiError";
import ApiErrorProfile from "./apiErrorProfile";

const GetApiButton = (props: { provider: Provider }) => {
  const { instance } = useMsal();
  const [data, setData] = useState<UserModel | ApiError>(UserModel.EmptyUser);
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
    requestApi<void, UserModel | ApiError>(
      apiConfig.apiEndpoint + searchIdRef.current.value,
      "GET",
      (response: UserModel | ApiError) => {
        setData(response);
        setRetrieving(false);
      }
    );
  };

  return (
    <>
      {!retrieving ? (
        <form onSubmit={handleSubmit}>
          <label>
            Search for ID:{" "}
            <input
              aria-label="search_id"
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
      {(data as UserModel).id !== undefined && !retrieving && (
        <Profile data={data as UserModel} />
      )}
      {(data as ApiError).name !== undefined && !retrieving && (
        <ApiErrorProfile data={data as ApiError} />
      )}
    </>
  );
};

export default GetApiButton;
