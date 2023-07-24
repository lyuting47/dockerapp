// import { useAuth0 } from "@auth0/auth0-react";
import { useMsal } from "@azure/msal-react";
import { AuthProvider } from "./authProvider";
import {
  InteractionRequiredAuthError,
  RedirectRequest,
  SsoSilentRequest,
} from "@azure/msal-browser";

export function useLogin(
  provider: AuthProvider,
  loginRequest: Partial<RedirectRequest>
) {
  const { instance } = useMsal();
  // const { loginWithRedirect } = useAuth0();

  function handleLogin() {
    if (provider === AuthProvider.AZURE) {
      instance.ssoSilent(loginRequest as SsoSilentRequest).catch((e) => {
        // Try normal redirect login if SSO fails
        if (e instanceof InteractionRequiredAuthError) {
          instance
            .loginRedirect({
              ...loginRequest,
              prompt: "select_account",
            } as RedirectRequest)
            .catch((e) => {
              console.log(e);
              throw e;
            });
        } else {
          throw e;
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
