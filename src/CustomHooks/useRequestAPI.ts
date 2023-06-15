import { useMsal } from "@azure/msal-react";
// import { useAuth0 } from "@auth0/auth0-react";
import { Provider } from "./provider";
import {
  AccountInfo,
  AuthError,
  EndSessionRequest,
  RedirectRequest,
  SilentRequest,
} from "@azure/msal-browser";

async function callApi<T>(
  accessToken: string,
  apiEndpoint: string
): Promise<T> {
  const headers: Headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(apiEndpoint, options);
  return response.json() as Promise<T>;
}

export function useRequestApi<T>(
  provider: Provider,
  fn: (response: T) => void,
  account: AccountInfo | null,
  loginRequest?: Partial<RedirectRequest>
) {
  const { instance } = useMsal();
  // const { loginWithRedirect, getAccessTokenSilently, logout } = useAuth0();

  function requestApi(apiEndpoint: string) {
    if (provider === Provider.AZURE) {
      if (!account) {
        throw Error("No active account set");
      }
      if (
        account.localAccountId !== instance.getActiveAccount()?.localAccountId
      ) {
        console.log("Error: another account is currently active.");
        if (instance.getAllAccounts().length > 1) {
          instance
            .logoutRedirect({
              postLogoutRedirectUri: window.location.origin,
              account: account,
            } as EndSessionRequest)
            .catch((e) => {
              console.log(e);
            });
        } else {
          instance
            .loginRedirect({
              ...loginRequest,
              prompt: "select_account",
            } as RedirectRequest)
            .catch((e) => {
              console.log(e);
            });
        }
      } else {
        instance
          .acquireTokenSilent({
            ...loginRequest,
            account: account,
          } as SilentRequest)
          .then((response) => {
            console.log(response);
            callApi<T>(response.accessToken, apiEndpoint)
              .then((response) => fn(response))
              .catch((err) => console.log(err));
          })
          .catch((err) => {
            console.log(err);
            if (err instanceof AuthError) {
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
    }

    // Auth0

    /*
    else if (provider === Provider.AUTH0) {
      getAccessTokenSilently()
        .then((token) => {
          console.log(token);
          callApi<T>(token, apiEndpoint)
            .then((response) => fn(response))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          if (err.message === "Unknown or invalid refresh token.") {
            logout({ logoutParams: { returnTo: window.location.origin } });
            loginWithRedirect({
              authorizationParams: {
                prompt: "login",
              },
            });
          }
        });
    } 
    */
    else {
      throw Error("Unknown Provider");
    }
  }

  return requestApi;
}
