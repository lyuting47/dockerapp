import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { apiConfig, loginRequest } from "../authConfig";
import Profile from "./profile";
import { useRequestApi } from "../CustomHooks/useRequestAPI";
import { Provider } from "../CustomHooks/provider";
import { UserModel, EmptyUser } from "../UserModel";

const AccessPrivateUncopedApiButton = (props: { provider: Provider }) => {
  const { instance, inProgress } = useMsal();
  const [data, setData] = useState(EmptyUser);
  const [retrieving, setRetrieving] = useState(false);
  const [requestId, setRequestId] = useState("6476b6c5ca2931de7dd4badc");
  const requestApi = useRequestApi<UserModel>(
    props.provider,
    (response: UserModel) => {
      setData(response);
      setRetrieving(false);
    },
    instance.getActiveAccount(),
    loginRequest
  );

  return (
    <>
      {inProgress === InteractionStatus.None ? (
        <h5 className="card-title">
          Welcome {instance.getActiveAccount()?.name}
        </h5>
      ) : (
        <h5 className="card-title">Loading...</h5>
      )}

      {!retrieving ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setRetrieving(true);
            requestApi(apiConfig.apiEndpoint + requestId);
          }}
        >
          <label>
            Search for ID:{" "}
            <input
              name="id"
              defaultValue={requestId}
              onChange={(e) => setRequestId(e.target.value)}
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

      {data !== EmptyUser && !retrieving && <Profile data={data} />}
    </>
  );
};

export default AccessPrivateUncopedApiButton;
