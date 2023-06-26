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

async function getApi<T>(accessToken: string, apiEndpoint: string): Promise<T> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(apiEndpoint, options);
  return response.json() as Promise<T>;
}

async function postApi<U, T>(
  accessToken: string,
  apiEndpoint: string,
  payload?: U
): Promise<T> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options: RequestInit = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  };

  console.log(options.body);
  const response = await fetch(apiEndpoint, options);
  return response.json() as Promise<T>;
}

/**
 * @template T - The type of response expected
 * @param {Provider} provider - The identity provider used in this app
 * @param {(response: T) => void} fn - The function to perform on the response
 * @param {AccountInfo} account - The account to send the request from
 * @param {Partial<RedirectRequest>} loginRequest - Any additional login details required for token retrieval
 * @returns A hook that can be used to perform a GET or POST request
 */
export function useRequestApi<T>(
  provider: Provider,
  fn: (response: T) => void,
  account: AccountInfo | null,
  loginRequest?: Partial<RedirectRequest>
) {
  const { instance } = useMsal();
  // const { loginWithRedirect, getAccessTokenSilently, logout } = useAuth0();

  /**
   * @template U - The type of the payload to be attached to the request body
   * @param {string} apiEndpoint - The URL string of the API to request from
   * @param {string} method - Whether this is a GET or POST request
   * @param {U} payload - Any payload to be attached to the request body
   * @returns
   */
  function requestApi<U>(
    apiEndpoint: string,
    method: "GET" | "POST",
    payload?: U
  ) {
    if (provider === Provider.AZURE) {
      if (!account) {
        throw Error("No active account set");
      }

      if (
        account.localAccountId !== instance.getActiveAccount()?.localAccountId
      ) {
        //TODO: handle this case better?
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
        return;
      }

      if (method === "GET") {
        instance
          .acquireTokenSilent({
            ...loginRequest,
            account: account,
          } as SilentRequest)
          .then((response) => {
            console.log(response);
            getApi<T>(response.accessToken, apiEndpoint)
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
        return;
      }

      if (method === "POST") {
        instance
          .acquireTokenSilent({
            ...loginRequest,
            account: account,
          } as SilentRequest)
          .then((response) => {
            console.log(response);
            postApi<U, T>(response.accessToken, apiEndpoint, payload)
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
        return;
      }
    }

    // Auth0

    /*
    else if (provider === Provider.AUTH0) {
      getAccessTokenSilently()
        .then((token) => {
          console.log(token);
          getApi<T>(token, apiEndpoint)
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
