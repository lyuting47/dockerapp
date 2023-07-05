// import { useAuth0 } from "@auth0/auth0-react";
import { useMsal } from "@azure/msal-react";
import { Provider } from "./provider";
import { EndSessionRequest } from "@azure/msal-browser";

export function useLogout(
  provider: Provider,
  logoutRequest: Partial<EndSessionRequest>
) {
  const { instance } = useMsal();
  // const { logout } = useAuth0();

  function handleLogout() {
    if (provider === Provider.AZURE) {
      instance
        .logoutRedirect({
          ...logoutRequest,
          account: instance.getActiveAccount(),
        })
        .catch((err) => console.log(err));
    }

    // Auth0
    /*
    else if (provider === Provider.AUTH0) {
      logout({ logoutParams: { returnTo: logoutRequest.redirectUri } });
    }
    */
    else {
      throw Error("Unknown Provider");
    }
  }

  return handleLogout;
}
