import React, { useState } from "react";
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
  const requestApi = useRequestApi(
    props.provider,
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
            requestApi<void, UserModel | ApiError>(
              apiConfig.apiEndpoint + searchId,
              "GET",
              (response: UserModel | ApiError) => {
                console.log(response);
                setData(response);
                setRetrieving(false);
              }
            );
          }}
        >
          <label>
            Search for ID:{" "}
            <input
              aria-label="search_id"
              defaultValue={searchId}
              onChange={(e) => setSearchId(e.target.value)}
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
