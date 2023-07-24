import { useMsal } from "@azure/msal-react";
// import { useAuth0 } from "@auth0/auth0-react";
import { AuthProvider } from "./authProvider";
import {
  AccountInfo,
  AuthError,
  RedirectRequest,
  SilentRequest,
} from "@azure/msal-browser";

/**
 * Helper function for the main hook
 * @template U - The type of the payload to be attached to the request body, can be undefined if no payload will be attached
 * @template T - The type of response expected
 * @param {string} accessToken - The access token to be used in the request
 * @param {string} apiEndpoint - The URL string of the API to request from
 * @param {"GET" | "POST"} method - The type of HTTP request to be sent
 * @param {U} payload - Any payload to be attached to the request body
 * @returns {Promise<T>} The response from the server as a JSON object
 */
async function accessApiWithToken<U, T>(
  accessToken: string,
  apiEndpoint: string,
  method: "GET" | "POST",
  payload?: U
): Promise<T> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options: RequestInit = {
    method: method,
    headers: headers,
    body: JSON.stringify(payload),
  };

  const response = await fetch(apiEndpoint, options);
  return response.json() as Promise<T>;
}

/**
 * A hook that helps perform authenticated GET or POST requests
 * @param {AuthProvider} provider - The identity provider used in this app
 * @param {AccountInfo} account - The account to send the request from
 * @param {Partial<RedirectRequest>} loginRequest - Any additional login details required for token retrieval
 * @returns A function that can be used to perform a GET or POST request
 */
export function useRequestApi(
  provider: AuthProvider,
  account: AccountInfo | null,
  loginRequest?: Partial<RedirectRequest>
) {
  const { instance } = useMsal();
  // const { loginWithRedirect, getAccessTokenSilently, logout } = useAuth0();

  /**
   * A function that can be used to perform a GET or POST request
   * @template U - The type of the payload to be attached to the request body, can be undefined if no payload will be attached
   * @template T - The type of response expected
   * @param {string} apiEndpoint - The URL string of the API to request from
   * @param {string} method - Whether this is a GET or POST request
   * @param {function(T): void} responseHandler - The function used to handle the response
   * @param {U} payload - Any payload to be attached to the request body
   */
  function requestApi<U, T>(
    apiEndpoint: string,
    method: "GET" | "POST",
    responseHandler: (response: T) => void,
    payload?: U
  ) {
    if (provider === AuthProvider.AZURE) {
      if (!account) {
        throw Error("Trying to access API without active account being set.");
      }
      if (
        account.localAccountId !== instance.getActiveAccount()?.localAccountId
      ) {
        throw Error(
          "The session associated with this account is no longer active, please log in again."
        );
      }

      // Get token silently and use it to access API
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: account,
        } as SilentRequest)
        .then(async (tokenEndpointResponse) => {
          try {
            const apiResponse = await accessApiWithToken<U, T>(
              tokenEndpointResponse.accessToken,
              apiEndpoint,
              method,
              payload
            );
            responseHandler(apiResponse);
          } catch (err) {
            console.log(err);
            throw err;
          }
        })
        .catch(async (err) => {
          console.log(err);
          // Fallback to normal login if silent token retrieval fails
          if (err instanceof AuthError) {
            try {
              await instance.acquireTokenRedirect({
                ...loginRequest,
                prompt: "select_account",
              } as RedirectRequest);
            } catch (e) {
              console.log(e);
              throw e;
            }
          } else {
            throw err;
          }
        });
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
