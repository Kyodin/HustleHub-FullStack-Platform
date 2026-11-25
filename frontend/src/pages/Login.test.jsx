import {
  beforeEach,
  describe,
  expect,
  test,
  vi
} from "vitest";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Login from "./Login";
import api from "../services/api";


vi.mock("../services/api", () => ({
  default: {
    post: vi.fn()
  }
}));


describe("Login page", () => {

  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.clear();
  });


  test("renders the login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Sign in to continue.")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email address")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "button",
        {
          name: /sign in/i
        }
      )
    ).toBeInTheDocument();
  });


  test("submits valid login credentials", async () => {
    const user = userEvent.setup();

    api.post.mockResolvedValueOnce({
      data: {
        token: "test-token",

        user: {
          name: "Test Client",
          email: "client@example.com",
          role: "client"
        }
      }
    });


    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    await user.type(
      screen.getByLabelText("Email address"),
      "client@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "Password123!"
    );


    await user.click(
      screen.getByRole(
        "button",
        {
          name: /sign in/i
        }
      )
    );


    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/auth/login",
        {
          email: "client@example.com",
          password: "Password123!"
        }
      );
    });


    expect(
      localStorage.getItem("token")
    ).toBe("test-token");


    expect(
      JSON.parse(
        localStorage.getItem("user")
      )
    ).toEqual({
      name: "Test Client",
      email: "client@example.com",
      role: "client"
    });


    expect(
      await screen.findByText("Test Client.")
    ).toBeInTheDocument();
  });


  test("shows a controlled error when login fails", async () => {
    const user = userEvent.setup();


    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message:
            "Invalid email or password."
        }
      }
    });


    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    await user.type(
      screen.getByLabelText("Email address"),
      "wrong@example.com"
    );

    await user.type(
      screen.getByLabelText("Password"),
      "WrongPassword123!"
    );


    await user.click(
      screen.getByRole(
        "button",
        {
          name: /sign in/i
        }
      )
    );


    expect(
      await screen.findByText(
        "Invalid email or password."
      )
    ).toBeInTheDocument();


    expect(
      localStorage.getItem("token")
    ).toBeNull();
  });

});