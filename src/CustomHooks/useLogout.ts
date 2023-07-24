// import { useAuth0 } from "@auth0/auth0-react";
import { useMsal } from "@azure/msal-react";
import { AuthProvider } from "./authProvider";
import { EndSessionRequest } from "@azure/msal-browser";

export function useLogout(
  provider: AuthProvider,
  logoutRequest: Partial<EndSessionRequest>
) {
  const { instance } = useMsal();
  // const { logout } = useAuth0();

  function handleLogout() {
    if (provider === AuthProvider.AZURE) {
      instance
        .logoutRedirect({
          ...logoutRequest,
          account: instance.getActiveAccount(),
        })
        .catch((err) => {
          throw err;
        });
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
