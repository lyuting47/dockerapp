import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { MsalReactTester } from "../MsalReactTester";
import { MsalProvider } from "@azure/msal-react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import userEvent from "@testing-library/user-event";

let msalTester: MsalReactTester;

beforeEach(() => {
  // New instance of msal tester for each test:
  msalTester = new MsalReactTester("Silent", {
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
  // Reset msal-react-tester
  msalTester.resetSpyMsal();
});

test("Renders Login button and prompt when logged out", async () => {
  await msalTester.isNotLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const textElement = screen.getByText(/Please sign in to access the API./i);
  expect(textElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/Log In/i);
  expect(buttonElement).toBeInTheDocument();
});

test("Does not renders Logout or Request button when logged out", async () => {
  await msalTester.isNotLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const buttonElement1 = screen.queryByText(/Log Out/i);
  expect(buttonElement1).not.toBeInTheDocument();
  const buttonElement2 = screen.queryByText(/Send Request/i);
  expect(buttonElement2).not.toBeInTheDocument();
});

test("Renders Logout and Request button when logged in", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const buttonElement1 = screen.getByText(/Log Out/i);
  expect(buttonElement1).toBeInTheDocument();
  const buttonElement2 = screen.getByText(/Send Request/i);
  expect(buttonElement2).toBeInTheDocument();
});

test("Renders welcome message when logged in", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const textElement = screen.getByText(/Welcome, dummy_name/i);
  expect(textElement).toBeInTheDocument();
});

test("Home page renders correctly when user clicks log in button", async () => {
  await msalTester.isNotLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  // Getting the log out button.
  // Mock a user click to launch the log in process:
  const signin = screen.getByText(/Log In/i);
  userEvent.click(signin);

  await msalTester.waitForLogin();

  // From here, your user is supposed to be logged in:
  const textElement = screen.queryByText(/Please sign in to access the API./i);
  expect(textElement).not.toBeInTheDocument();
  const buttonElement = screen.queryByText(/Log In/i);
  expect(buttonElement).not.toBeInTheDocument();
});

test("Home page renders correctly when user clicks log out button", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
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
  const textElement = screen.getByText(/Please sign in to access the API./i);
  expect(textElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/Log In/i);
  expect(buttonElement).toBeInTheDocument();
});
