import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { apiConfig, loginRequest } from "../authConfig";
import Profile from "./profile";
import { useRequestApi } from "../CustomHooks/useRequestAPI";
import { Provider } from "../CustomHooks/provider";
import { UserModel } from "../UserModel";

const EmptyUser: UserModel = {
  username: "",
  fullname: "",
  timezone: "",
};

const AccessPrivateUncopedApiButton = (props: { provider: Provider }) => {
  const { instance, inProgress } = useMsal();
  const [data, setData] = useState<UserModel>(EmptyUser);
  const [retrieving, setRetrieving] = useState(false);
  const requestApi = useRequestApi<UserModel>(
    props.provider,
    apiConfig.apiEndpoint,
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
        <button
          onClick={() => {
            setRetrieving(true);
            requestApi();
          }}
        >
          Send Request
        </button>
      ) : (
        <h5 className="card-title">Loading...</h5>
      )}

      {data !== EmptyUser && !retrieving && <Profile data={data} />}
    </>
  );
};

export default AccessPrivateUncopedApiButton;
