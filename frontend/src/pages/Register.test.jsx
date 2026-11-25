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

import Register from "./Register";
import api from "../services/api";


vi.mock("../services/api", () => ({
  default: {
    post: vi.fn()
  }
}));


describe("Register page", () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });


  test("renders the registration form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(
      screen.getByRole(
        "heading",
        {
          name: "Start your journey."
        }
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Your full name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("you@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Create a strong password"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "button",
        {
          name: /create account/i
        }
      )
    ).toBeInTheDocument();
  });


  test("registers a client account successfully", async () => {
    const user = userEvent.setup();

    api.post.mockResolvedValueOnce({
      data: {
        message: "Account created successfully"
      }
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByPlaceholderText("Your full name"),
      "Test Client"
    );

    await user.type(
      screen.getByPlaceholderText("you@example.com"),
      "newclient@example.com"
    );

    await user.type(
      screen.getByPlaceholderText(
        "Create a strong password"
      ),
      "Password123!"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /create account/i
        }
      )
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/auth/register",
        {
          name: "Test Client",
          email: "newclient@example.com",
          password: "Password123!",
          role: "client"
        }
      );
    });

    expect(
      await screen.findByText(
        "Account created successfully. Redirecting to login..."
      )
    ).toBeInTheDocument();
  });


  test("registers a freelancer account with the selected role", async () => {
    const user = userEvent.setup();

    api.post.mockResolvedValueOnce({
      data: {
        message: "Account created successfully"
      }
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByPlaceholderText("Your full name"),
      "Test Freelancer"
    );

    await user.type(
      screen.getByPlaceholderText("you@example.com"),
      "freelancer@example.com"
    );

    await user.type(
      screen.getByPlaceholderText(
        "Create a strong password"
      ),
      "Password123!"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /FreelancerCreate gigs and earn/i
        }
      )
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /create account/i
        }
      )
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/auth/register",
        {
          name: "Test Freelancer",
          email: "freelancer@example.com",
          password: "Password123!",
          role: "freelancer"
        }
      );
    });
  });


  test("shows a controlled error when registration fails", async () => {
    const user = userEvent.setup();

    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Email already exists."
        }
      }
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(
      screen.getByPlaceholderText("Your full name"),
      "Existing User"
    );

    await user.type(
      screen.getByPlaceholderText("you@example.com"),
      "existing@example.com"
    );

    await user.type(
      screen.getByPlaceholderText(
        "Create a strong password"
      ),
      "Password123!"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name: /create account/i
        }
      )
    );

    expect(
      await screen.findByText(
        "Email already exists."
      )
    ).toBeInTheDocument();
  });

});