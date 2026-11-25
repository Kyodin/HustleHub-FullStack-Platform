import {
  beforeEach,
  describe,
  expect,
  test,
  vi
} from "vitest";

import {
  render,
  screen
} from "@testing-library/react";

import {
  MemoryRouter
} from "react-router-dom";

import MyBookings from "./MyBookings";

import api from "../services/api";


vi.mock(
  "../services/api",
  () => ({
    default: {
      get: vi.fn()
    }
  })
);


const renderPage = () => {

  return render(
    <MemoryRouter>
      <MyBookings />
    </MemoryRouter>
  );

};


describe(
  "MyBookings",
  () => {

    beforeEach(() => {

      localStorage.setItem(
        "token",
        "mock-client-token"
      );


      localStorage.setItem(
        "user",
        JSON.stringify({
          _id:
            "client-1",

          name:
            "Test Client",

          role:
            "client"
        })
      );

    });


    test(
      "displays a client's booking history",
      async () => {

        api.get.mockResolvedValue({
          data: {
            bookings: [
              {
                _id:
                  "booking-1",

                gig: {
                  title:
                    "Website Development"
                },

                freelancer: {
                  name:
                    "Freelancer One"
                },

                agreedPrice:
                  3500,

                status:
                  "confirmed",

                createdAt:
                  "2026-11-09T09:00:00.000Z"
              }
            ]
          }
        });


        renderPage();


        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "Website Development"
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Freelancer One"
          )
        ).toBeInTheDocument();


        /*
         * en-ZA formatting normally produces
         * "3 500", so allow whitespace between
         * the thousands.
         */

        const bookingValueLabel =
          screen.getByText(
            "BOOKING VALUE"
          );


        const bookingValueRow =
          bookingValueLabel.closest(
            ".booking-information-item"
          );


        expect(
          bookingValueRow
        ).toHaveTextContent(
          /R\s*3\s*500/
        );


        expect(
          screen.getByText(
            "confirmed"
          )
        ).toBeInTheDocument();


        expect(
          api.get
        ).toHaveBeenCalledWith(
          "/bookings/mine"
        );

      }
    );


    test(
      "keeps the saved gig title visible when the original gig has been deleted",
      async () => {

        api.get.mockResolvedValue({
          data: {
            bookings: [
              {
                _id:
                  "booking-2",

                gig: null,

                gigTitle:
                  "Deleted Logo Design Gig",

                freelancer: {
                  name:
                    "Designer One"
                },

                agreedPrice:
                  1200,

                status:
                  "confirmed",

                createdAt:
                  "2026-11-08T09:00:00.000Z"
              }
            ]
          }
        });


        renderPage();


        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "Deleted Logo Design Gig"
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Designer One"
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "displays cancellation information for a cancelled booking",
      async () => {

        api.get.mockResolvedValue({
          data: {
            bookings: [
              {
                _id:
                  "booking-3",

                gigTitle:
                  "Mobile App Design",

                freelancer: {
                  name:
                    "Designer Two"
                },

                agreedPrice:
                  2000,

                status:
                  "cancelled",

                cancelledBy:
                  "freelancer",

                cancellationReason:
                  "Unable to complete the service within the required timeframe.",

                cancelledAt:
                  "2026-11-09T10:30:00.000Z",

                createdAt:
                  "2026-11-08T08:00:00.000Z"
              }
            ]
          }
        });


        renderPage();


        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "Mobile App Design"
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Booking cancelled"
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /cancelled by freelancer/i
          )
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Unable to complete the service within the required timeframe."
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "shows the empty booking state when the client has no bookings",
      async () => {

        api.get.mockResolvedValue({
          data: {
            bookings: []
          }
        });


        renderPage();


        expect(
          await screen.findByRole(
            "heading",
            {
              name:
                "Nothing booked yet."
            }
          )
        ).toBeInTheDocument();


        expect(
          screen.getByRole(
            "button",
            {
              name:
                /explore marketplace/i
            }
          )
        ).toBeInTheDocument();

      }
    );

  }
);