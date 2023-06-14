// import { useAuth0 } from "@auth0/auth0-react";
import { useMsal } from "@azure/msal-react";
import { Provider } from "./provider";
import {
  InteractionRequiredAuthError,
  RedirectRequest,
  SsoSilentRequest,
} from "@azure/msal-browser";

export function useLogin(
  provider: Provider,
  loginRequest: Partial<RedirectRequest>
) {
  const { instance } = useMsal();
  // const { loginWithRedirect } = useAuth0();

  function handleLogin() {
    if (provider === Provider.AZURE) {
      instance.ssoSilent(loginRequest as SsoSilentRequest).catch((e) => {
        console.log(e);
        if (e instanceof InteractionRequiredAuthError) {
          instance
            .loginRedirect({
              ...loginRequest,
              prompt: "select_account",
            } as RedirectRequest)
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }

    // Auth0
    /*
    else if (provider === Provider.AUTH0) {
      loginWithRedirect({ authorizationParams: { ...loginRequest } });
    }
    */
    else {
      throw Error("Unknown Provider");
    }
  }

  return handleLogin;
}
