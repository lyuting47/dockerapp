import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "../CustomHooks/provider";
import { MsalReactTester } from "../MsalReactTester";
import { MsalProvider } from "@azure/msal-react";
import { MemoryRouter } from "react-router-dom";
import { Secret } from "../Pages/Secret";
import userEvent from "@testing-library/user-event";

let msalTester: MsalReactTester;

beforeEach(() => {
  // new instance of msal tester for each test:
  msalTester = new MsalReactTester("Redirect", {
    homeAccountId: "dummy_homeAccountId",
    environment: "dummy_environment",
    tenantId: "dummy_tenantId",
    username: "dummy_username",
    localAccountId: "dummy_localAccountId",
    name: "dummy_name",
  });

  // Ask msal-react-tester to handle and mock all msal-react processes:
  msalTester.spyMsal();
});

afterEach(() => {
  // reset msal-react-tester
  msalTester.resetSpyMsal();
});

test("Renders secret when logged in", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Secret provider={Provider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const textElement = screen.getByText(/SECRET IMAGE/i);
  expect(textElement).toBeInTheDocument();
  const imgElement = screen.getByAltText(/secret/);
  expect(imgElement).toBeInTheDocument();
});

// Test log out button
test("Secret page renders correctly when user clicks log out button", async () => {
  // Mock a guest user, authenticated:
  await msalTester.isLogged();

  // Render the <Secret /> component using a <MsalProvider />
  // with the mock IPublicClientApplication instance:
  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Secret provider={Provider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  // Getting the log out button.
  // Mock a user click to launch the log out process:
  const signout = screen.getByText(/Log Out/i);
  userEvent.click(signout);

  await msalTester.waitForLogout();

  // From here, your user is supposed to be logged out of the component:
  const textElement = screen.queryByText(/SECRET IMAGE/i);
  expect(textElement).not.toBeInTheDocument();
  const imgElement = screen.queryByAltText(/secret/);
  expect(imgElement).not.toBeInTheDocument();
});
