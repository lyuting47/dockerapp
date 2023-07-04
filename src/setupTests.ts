import "@testing-library/jest-dom";
import { MsalReactTesterPlugin } from "./MsalReactTester";
import { vi, expect } from "vitest";
import { waitFor } from "@testing-library/react";

MsalReactTesterPlugin.init({
  spyOn: vi.spyOn,
  expect: expect,
  resetAllMocks: vi.resetAllMocks,
  waitingFor: waitFor,
});
