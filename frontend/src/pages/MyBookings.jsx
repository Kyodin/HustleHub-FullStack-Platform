import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  motion
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Ban,
  BriefcaseBusiness,
  CalendarCheck2,
  CircleDollarSign
} from "lucide-react";

import api from "../services/api";
import "./MyBookings.css";


function MyBookings() {
  const navigate =
    useNavigate();

  const [
    bookings,
    setBookings
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);


  /* =====================================================
     CURRENT USER
     ===================================================== */

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  /* =====================================================
     LOAD BOOKINGS
     ===================================================== */

  useEffect(() => {
    const loadBookings =
      async () => {
        try {
          const response =
            await api.get(
              "/bookings/mine"
            );


          const bookingData =
            response.data;

          let returnedBookings = [];


          if (
            Array.isArray(
              bookingData
            )
          ) {
            returnedBookings =
              bookingData;

          } else if (
            Array.isArray(
              bookingData?.bookings
            )
          ) {
            returnedBookings =
              bookingData.bookings;

          } else if (
            Array.isArray(
              bookingData?.data
            )
          ) {
            returnedBookings =
              bookingData.data;
          }


          setBookings(
            returnedBookings
          );

        } catch (error) {
          console.error(
            "Unable to load bookings:",
            error.response?.data ||
            error.message
          );

          setBookings([]);

        } finally {
          setLoading(false);
        }
      };


    loadBookings();
  }, []);


  /* =====================================================
     HELPERS
     ===================================================== */

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "Date unavailable";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return "";
    }

    return new Date(
      value
    ).toLocaleString(
      "en-ZA",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };


  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status !==
        "cancelled"
    ).length;


  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "cancelled"
    ).length;


  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="bookings-page">

      {/* =================================================
          NAVIGATION
          ================================================= */}

      <nav className="bookings-nav">

        <button
          type="button"
          className="bookings-brand"
          onClick={() =>
            navigate("/client")
          }
        >
          <span className="bookings-brand-mark">
            H
          </span>

          <span>
            HUSTLEHUB
          </span>
        </button>


        <div className="bookings-nav-centre">

          <button
            type="button"
            className="bookings-nav-link"
            onClick={() =>
              navigate("/client")
            }
          >
            Discover
          </button>


          <button
            type="button"
            className="bookings-nav-link active"
          >
            My Bookings
          </button>

        </div>


        <button
          type="button"
          className="bookings-back-button"
          onClick={() =>
            navigate("/client")
          }
        >
          <ArrowLeft size={17} />

          Marketplace
        </button>

      </nav>


      {/* =================================================
          HERO
          ================================================= */}

      <main>

        <section className="bookings-premium-hero">

          <div className="bookings-hero-grid" />

          <div className="bookings-red-glow" />


          <div className="bookings-container">

            <motion.div
              className="bookings-hero-content"

              initial={{
                opacity: 0,
                y: 25
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.7,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1
                ]
              }}
            >

              <div className="bookings-hero-label">

                <span />

                CLIENT / BOOKINGS

              </div>


              <h1>
                Your projects.
                <span>
                  All in one place.
                </span>
              </h1>


              <p>
                Keep track of every HustleHub
                booking, service and cancellation
                from one focused workspace.
                Welcome back,{" "}
                {user.name || "Client"}.
              </p>

            </motion.div>

          </div>


          {/* METRICS */}

          <div className="bookings-metric-row">

            <div className="bookings-metric">

              <span>
                01
              </span>


              <div>

                <strong>
                  {bookings.length
                    .toString()
                    .padStart(
                      2,
                      "0"
                    )}
                </strong>

                <p>
                  Total bookings
                </p>

              </div>

            </div>


            <div className="bookings-metric">

              <span>
                02
              </span>


              <div>

                <strong>
                  {activeBookings
                    .toString()
                    .padStart(
                      2,
                      "0"
                    )}
                </strong>

                <p>
                  Active bookings
                </p>

              </div>

            </div>


            <div className="bookings-metric">

              <span>
                03
              </span>


              <div>

                <strong>
                  {cancelledBookings
                    .toString()
                    .padStart(
                      2,
                      "0"
                    )}
                </strong>

                <p>
                  Cancelled
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            BOOKINGS
            ================================================= */}

        <section className="bookings-content-section">

          <div className="bookings-container">

            <div className="bookings-section-heading">

              <div>

                <p className="bookings-section-label">
                  YOUR ACTIVITY
                </p>


                <h2>
                  Every booking.
                  <span>
                    Easy to track.
                  </span>
                </h2>

              </div>


              <span>
                {bookings.length}{" "}
                {bookings.length ===
                1
                  ? "booking"
                  : "bookings"}
              </span>

            </div>


            {loading ? (

              <div className="bookings-loading">

                <div className="bookings-loading-line" />
                <div className="bookings-loading-line" />
                <div className="bookings-loading-line" />

                <p>
                  Loading your bookings...
                </p>

              </div>

            ) : bookings.length ===
            0 ? (

              <motion.div
                className="bookings-empty"

                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}
              >

                <CalendarCheck2
                  size={32}
                />


                <h3>
                  Nothing booked yet.
                </h3>


                <p>
                  Discover specialist
                  freelancers and book your
                  first HustleHub service.
                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/client")
                  }
                >
                  Explore marketplace

                  <ArrowRight
                    size={17}
                  />
                </button>

              </motion.div>

            ) : (

              <div className="bookings-list">

                {bookings.map(
                  (
                    booking,
                    index
                  ) => {

                    const title =
                      booking.gig?.title ||
                      booking.gigTitle ||
                      "Booked Service";


                    const freelancer =
                      booking.freelancer
                        ?.name ||
                      "HustleHub Freelancer";


                    const value =
                      Number(
                        booking
                          .agreedPrice ||
                        booking.amount ||
                        0
                      );


                    const cancelled =
                      booking.status ===
                      "cancelled";


                    return (

                      <motion.article
                        className={
                          cancelled
                            ? "booking-premium-card booking-premium-card-cancelled"
                            : "booking-premium-card"
                        }

                        key={
                          booking._id
                        }

                        initial={{
                          opacity: 0,
                          y: 22
                        }}

                        animate={{
                          opacity: 1,
                          y: 0
                        }}

                        transition={{
                          duration: 0.45,
                          delay:
                            Math.min(
                              index * 0.06,
                              0.3
                            )
                        }}
                      >

                        {/* LEFT INDEX */}

                        <div className="booking-index">

                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </div>


                        {/* MAIN CONTENT */}

                        <div className="booking-main">

                          <div className="booking-top-row">

                            <span
                              className={
                                cancelled
                                  ? "booking-premium-status cancelled"
                                  : "booking-premium-status active"
                              }
                            >
                              {
                                booking.status
                              }
                            </span>


                            <span className="booking-created-date">
                              {formatDate(
                                booking.createdAt
                              )}
                            </span>

                          </div>


                          <h3>
                            {title}
                          </h3>


                          <div className="booking-information-grid">

                            <div className="booking-information-item">

                              <BriefcaseBusiness
                                size={17}
                              />


                              <div>

                                <span>
                                  FREELANCER
                                </span>

                                <strong>
                                  {freelancer}
                                </strong>

                              </div>

                            </div>


                            <div className="booking-information-item">

                              <CircleDollarSign
                                size={17}
                              />


                              <div>

                                <span>
                                  BOOKING VALUE
                                </span>

                                <strong>
                                  R
                                  {value
                                    .toLocaleString(
                                      "en-ZA"
                                    )}
                                </strong>

                              </div>

                            </div>


                            <div className="booking-information-item">

                              <CalendarCheck2
                                size={17}
                              />


                              <div>

                                <span>
                                  BOOKED
                                </span>

                                <strong>
                                  {formatDate(
                                    booking.createdAt
                                  )}
                                </strong>

                              </div>

                            </div>

                          </div>


                          {/* CANCELLATION */}

                          {cancelled && (

                            <div className="booking-cancellation-notice">

                              <Ban size={18} />


                              <div>

                                <strong>
                                  Booking cancelled
                                </strong>


                                <span>
                                  Cancelled by{" "}
                                  {booking
                                    .cancelledBy ||
                                    "freelancer"}
                                </span>


                                {booking
                                  .cancellationReason && (

                                  <p>
                                    {
                                      booking
                                        .cancellationReason
                                    }
                                  </p>

                                )}


                                {booking
                                  .cancelledAt && (

                                  <small>
                                    {formatDateTime(
                                      booking
                                        .cancelledAt
                                    )}
                                  </small>

                                )}

                              </div>

                            </div>

                          )}

                        </div>

                      </motion.article>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            MARKETPLACE CTA
            ================================================= */}

        <section className="bookings-marketplace-cta">

          <div className="bookings-container">

            <div className="bookings-cta-inner">

              <div>

                <p className="bookings-section-label">
                  WHAT'S NEXT?
                </p>


                <h2>
                  Find your next
                  specialist.
                </h2>


                <p>
                  Explore available services
                  and keep your next project
                  moving.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate("/client")
                }
              >
                Discover services

                <ArrowRight
                  size={18}
                />
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


export default MyBookings;