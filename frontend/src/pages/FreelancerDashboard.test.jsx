import {
  beforeEach,
  describe,
  expect,
  test,
  vi
} from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";

import {
  MemoryRouter
} from "react-router-dom";

import FreelancerDashboard from "./FreelancerDashboard";

import api from "../services/api";


vi.mock(
  "../services/api",
  () => ({
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn()
    }
  })
);


const mockGig = {
  _id: "gig-1",

  title:
    "Professional Logo Design",

  description:
    "Modern brand identity and logo design.",

  category:
    "Graphic Design",

  price: 1500
};


const mockBooking = {
  _id: "booking-1",

  gig: {
    _id: "gig-1",
    title:
      "Professional Logo Design"
  },

  gigTitle:
    "Professional Logo Design",

  client: {
    _id: "client-1",
    name: "Test Client"
  },

  freelancer: {
    _id: "freelancer-1",
    name: "Test Freelancer"
  },

  agreedPrice: 1500,

  status: "confirmed",

  createdAt:
    "2026-11-09T10:00:00.000Z"
};


const mockIncome = {
  totalIncome: 12500,

  currentMonthIncome: 4500,

  completedTransactionCount: 4,

  refundedTransactionCount: 1,

  refundedAmount: 500,

  estimatedTaxRate: 0.15,

  estimatedTax: 1875,

  estimatedAfterTaxIncome: 10625,

  monthlyIncome: [
    {
      month: "Oct",
      year: 2026,
      income: 8000
    },
    {
      month: "Nov",
      year: 2026,
      income: 4500
    }
  ],

  transactions: [
    {
      _id: "transaction-1",

      gigTitle:
        "Professional Logo Design",

      gigCategory:
        "Graphic Design",

      client: {
        name: "Test Client"
      },

      amount: 1500,

      status: "completed",

      createdAt:
        "2026-11-09T10:00:00.000Z"
    }
  ]
};


const configureGetRequests = ({
  gigs = [mockGig],
  bookings = [mockBooking],
  income = mockIncome
} = {}) => {

  api.get.mockImplementation(
    (url) => {

      if (
        url === "/gigs/mine"
      ) {
        return Promise.resolve({
          data: {
            gigs
          }
        });
      }


      if (
        url ===
        "/bookings/received"
      ) {
        return Promise.resolve({
          data: {
            bookings
          }
        });
      }


      if (
        url ===
        "/transactions/income"
      ) {
        return Promise.resolve({
          data: income
        });
      }


      return Promise.reject(
        new Error(
          `Unexpected GET request: ${url}`
        )
      );
    }
  );
};


const renderDashboard = () => {

  return render(
    <MemoryRouter>
      <FreelancerDashboard />
    </MemoryRouter>
  );

};


describe(
  "FreelancerDashboard",
  () => {

    beforeEach(() => {

      localStorage.setItem(
        "token",
        "mock-jwt-token"
      );


      localStorage.setItem(
        "user",
        JSON.stringify({
          _id:
            "freelancer-1",

          name:
            "Test Freelancer",

          role:
            "freelancer"
        })
      );


      configureGetRequests();


      api.post.mockResolvedValue({
        data: {
          message:
            "Gig created successfully"
        }
      });


      api.put.mockResolvedValue({
        data: {}
      });


      api.delete.mockResolvedValue({
        data: {}
      });


      api.patch.mockResolvedValue({
        data: {
          message:
            "Booking cancelled successfully"
        }
      });

    });


    /* =================================================
       INCOME DASHBOARD
       ================================================= */

    test(
      "displays freelancer income and tax information",
      async () => {

        renderDashboard();


        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                /your business.*at a glance/i
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "THIS MONTH"
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "ESTIMATED TAX"
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "AFTER-TAX ESTIMATE"
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "REFUNDED"
          )
        ).toBeInTheDocument();


        const monthCard =
          screen
            .getByText(
              "THIS MONTH"
            )
            .closest(
              ".financial-card"
            );


        expect(
          monthCard
        ).toHaveTextContent(
          /4\s*500[,.]00/
        );


        const taxCard =
          screen
            .getByText(
              "ESTIMATED TAX"
            )
            .closest(
              ".financial-card"
            );


        expect(
          taxCard
        ).toHaveTextContent(
          /1\s*875[,.]00/
        );


        const afterTaxCard =
          screen
            .getByText(
              "AFTER-TAX ESTIMATE"
            )
            .closest(
              ".financial-card"
            );


        expect(
          afterTaxCard
        ).toHaveTextContent(
          /10\s*625[,.]00/
        );


        expect(
          screen.getByRole(
            "heading",
            {
              name:
                /monthly earnings/i
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getAllByText(
            "Professional Logo Design"
          ).length
        ).toBeGreaterThan(0);


        expect(
          api.get
        ).toHaveBeenCalledWith(
          "/transactions/income"
        );

      }
    );


    /* =================================================
       CREATE GIG
       ================================================= */

    test(
      "allows a freelancer to create a new gig",
      async () => {

        renderDashboard();


        await screen.findByRole(
          "heading",
          {
            name:
              /your business.*at a glance/i
          }
        );


        const createButtons =
          screen.getAllByRole(
            "button",
            {
              name:
                /create service/i
            }
          );


        fireEvent.click(
          createButtons[0]
        );


        const modalHeading =
          screen.getByRole(
            "heading",
            {
              name:
                /create service/i
            }
          );


        expect(
          modalHeading
        ).toBeInTheDocument();


        const modal =
          modalHeading.closest(
            ".freelancer-modal"
          );


        const titleInput =
          within(modal)
            .getByPlaceholderText(
              "e.g. Professional Logo Design"
            );


        const categoryInput =
          within(modal)
            .getByPlaceholderText(
              "e.g. Graphic Design"
            );


        const descriptionInput =
          within(modal)
            .getByPlaceholderText(
              "Describe what you offer..."
            );


        const priceInput =
          within(modal)
            .getByPlaceholderText(
              "750"
            );


        fireEvent.change(
          titleInput,
          {
            target: {
              value:
                "Website Development"
            }
          }
        );


        fireEvent.change(
          categoryInput,
          {
            target: {
              value:
                "Web Development"
            }
          }
        );


        fireEvent.change(
          descriptionInput,
          {
            target: {
              value:
                "Responsive business website development."
            }
          }
        );


        fireEvent.change(
          priceInput,
          {
            target: {
              value:
                "2500"
            }
          }
        );


        const submitButton =
          within(modal)
            .getByRole(
              "button",
              {
                name:
                  /^create service$/i
              }
            );


        fireEvent.click(
          submitButton
        );


        await waitFor(() => {

          expect(
            api.post
          ).toHaveBeenCalledWith(
            "/gigs",
            {
              title:
                "Website Development",

              category:
                "Web Development",

              description:
                "Responsive business website development.",

              price: 2500
            }
          );

        });

      },
      10000
    );


    /* =================================================
       CANCEL BOOKING
       ================================================= */

    test(
      "allows a freelancer to cancel a confirmed booking with a reason",
      async () => {

        renderDashboard();


        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                /recent.*bookings/i
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getAllByText(
            "Test Client"
          ).length
        ).toBeGreaterThan(0);


        const cancelButton =
          screen.getByRole(
            "button",
            {
              name:
                /^cancel$/i
            }
          );


        fireEvent.click(
          cancelButton
        );


        expect(
          screen.getByRole(
            "heading",
            {
              name:
                /cancel client booking/i
            }
          )
        ).toBeInTheDocument();


        const reasonInput =
          screen.getByPlaceholderText(
            "Explain why you are cancelling this booking..."
          );


        fireEvent.change(
          reasonInput,
          {
            target: {
              value:
                "Unable to complete the project within the required timeframe."
            }
          }
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /confirm cancellation/i
            }
          )
        );


        await waitFor(() => {

          expect(
            api.patch
          ).toHaveBeenCalledWith(
            "/bookings/booking-1/cancel",
            {
              reason:
                "Unable to complete the project within the required timeframe."
            }
          );

        });

      }
    );


    /* =================================================
       EMPTY SERVICES
       ================================================= */

    test(
      "shows an empty service state when the freelancer has no gigs",
      async () => {

        configureGetRequests({
          gigs: []
        });


        renderDashboard();


        expect(
          await screen.findByText(
            "No services yet."
          )
        ).toBeInTheDocument();


        expect(
          screen.getByRole(
            "button",
            {
              name:
                /create first service/i
            }
          )
        ).toBeInTheDocument();

      }
    );

  }
);