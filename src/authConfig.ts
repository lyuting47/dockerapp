/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
  Configuration,
  EndSessionRequest,
  LogLevel,
  RedirectRequest,
} from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const providerConfig: Configuration = {
  auth: {
    clientId: "89b2a641-5c75-4977-8daa-8431c9ae6f9e",
    authority:
      "https://login.microsoftonline.com/15831736-f1b2-4d90-91a9-a6fdc57a28cd/",
    redirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 *
 * Additional scopes can be requested when obtaining an access token. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const loginRequest: Partial<RedirectRequest> = {
  scopes: [
    "offline_access",
    "api://781310c6-4afa-46d4-be01-170cae901a6a/Files.Read",
    "api://781310c6-4afa-46d4-be01-170cae901a6a/Files.Write",
  ],
};

export const logoutRequest: Partial<EndSessionRequest> = {
  postLogoutRedirectUri: "http://localhost:3000/",
};

/**
 * URL of the API this app will call
 */
export const apiConfig = {
  apiEndpoint: "http://localhost:3001/api/users/6476b6c5ca2931de7dd4badc",
};
