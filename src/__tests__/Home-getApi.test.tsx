import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { AuthProvider } from "../CustomHooks/authProvider";
import { MsalReactTester } from "../MsalReactTester";
import { MsalProvider } from "@azure/msal-react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { apiConfig } from "../authConfig";

let msalTester: MsalReactTester;

const server = setupServer(
  rest.get(
    apiConfig.apiEndpoint + "111111111111111111111111",
    (req, res, ctx) => {
      return res(
        ctx.json({
          id: "111111111111111111111111",
          username: "user1",
          fullName: "fullName1",
          timezone: "SG",
        })
      );
    }
  ),
  rest.get(apiConfig.apiEndpoint + "invalid_format_id", (req, res, ctx) => {
    return res(
      ctx.json({
        name: "BSONError",
        message:
          "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
      })
    );
  })
);

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

  // Start the mock server
  server.listen();
});

afterEach(() => {
  // Reset msal-react-tester
  msalTester.resetSpyMsal();

  server.resetHandlers();
});

afterAll(() => server.close());

test("Renders user info on successful GET request", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();

  // Get input element using aria-label (refer to getUserButton component), and mock user input
  const inputBox = screen.getByLabelText(/user_input_search_id/i);
  userEvent.clear(inputBox);
  userEvent.type(inputBox, "111111111111111111111111");
  const requestButton = screen.getByText(/Send Request/i);
  userEvent.click(requestButton);

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i));

  const textElement1 = screen.getByText(/user1/i);
  expect(textElement1).toBeInTheDocument();
  const textElement2 = screen.getByText(/fullName1/i);
  expect(textElement2).toBeInTheDocument();
  const textElement3 = screen.getByText(/SG/);
  expect(textElement3).toBeInTheDocument();
});

test("Renders error info on invalid request id", async () => {
  await msalTester.isLogged();

  render(
    <MsalProvider instance={msalTester.client}>
      <MemoryRouter>
        <Home provider={AuthProvider.AZURE} />
      </MemoryRouter>
    </MsalProvider>
  );

  await msalTester.waitForRedirect();
  const inputBox = screen.getByLabelText(/search_id/i);
  userEvent.clear(inputBox);
  userEvent.type(inputBox, "invalid_format_id");
  const requestButton = screen.getByText(/Send Request/i);
  userEvent.click(requestButton);

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i));

  const textElement1 = screen.getByText(/BSONError/i);
  expect(textElement1).toBeInTheDocument();
  const textElement2 = screen.getByText(
    /Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer/i
  );
  expect(textElement2).toBeInTheDocument();
});
