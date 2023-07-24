import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { MsalReactTester } from "../MsalReactTester";
import App from "../App";
import { MsalProvider } from "@azure/msal-react";
import { MemoryRouter } from "react-router-dom";

let msalTester: MsalReactTester;

beforeEach(() => {
  // New instance of msal tester for each test:
  msalTester = new MsalReactTester();

  // Ask msal-react-tester to handle and mock all msal-react processes:
  msalTester.spyMsal();
});

afterEach(() => {
  // Reset msal-react-tester
  msalTester.resetSpyMsal();
});

test("Renders links when logged out", async () => {
  await msalTester.isNotLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <App provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const linkElement1 = screen.getByText(/Home/i);
  expect(linkElement1).toBeInTheDocument();
  const linkElement2 = screen.getByText(/Secret/i);
  expect(linkElement2).toBeInTheDocument();
});

test("Renders links when logged in", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <App provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  const linkElement1 = screen.getByText(/Home/i);
  expect(linkElement1).toBeInTheDocument();
  const linkElement2 = screen.getByText(/Secret/i);
  expect(linkElement2).toBeInTheDocument();
});
