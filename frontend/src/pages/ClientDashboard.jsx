import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarCheck2,
  ChevronRight,
  Grid2X2,
  LogOut,
  Search,
  Sparkles,
  UserRound
} from "lucide-react";

import api from "../services/api";
import GigModal from "../components/GigModal";

import "./ClientDashboard.css";


function ClientDashboard() {
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [selectedGig, setSelectedGig] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookingMessage, setBookingMessage] =
    useState("");


  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  /* ============================================
     LOAD DATA
     ============================================ */

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        const [gigResponse, bookingResponse] =
          await Promise.all([
            api.get("/gigs"),
            api.get("/bookings/mine")
          ]);


        const gigData = gigResponse.data;
        const bookingData = bookingResponse.data;


        let returnedGigs = [];

        if (Array.isArray(gigData)) {
          returnedGigs = gigData;

        } else if (Array.isArray(gigData?.gigs)) {
          returnedGigs = gigData.gigs;

        } else if (Array.isArray(gigData?.data)) {
          returnedGigs = gigData.data;
        }


        let returnedBookings = [];

        if (Array.isArray(bookingData)) {
          returnedBookings = bookingData;

        } else if (
          Array.isArray(bookingData?.bookings)
        ) {
          returnedBookings = bookingData.bookings;

        } else if (
          Array.isArray(bookingData?.data)
        ) {
          returnedBookings = bookingData.data;
        }


        setGigs(returnedGigs);
        setBookings(returnedBookings);

      } catch (error) {
        console.error(
          "Unable to load client dashboard:",
          error.response?.data || error.message
        );

        setGigs([]);
        setBookings([]);

      } finally {
        setLoading(false);
      }
    };


    loadDashboard();
  }, []);


  /* ============================================
     NAVIGATION
     ============================================ */

  const goToBookings = () => {
    navigate("/client/bookings");
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  /* ============================================
     BOOKING
     ============================================ */

  const handleBookGig = async (gig) => {
    try {
      setBooking(true);
      setBookingMessage("");


      await api.post("/bookings", {
        gigId: gig._id
      });


      setBookingMessage(
        "Booking confirmed successfully."
      );


      const response =
        await api.get("/bookings/mine");

      const bookingData = response.data;

      let updatedBookings = [];


      if (Array.isArray(bookingData)) {
        updatedBookings = bookingData;

      } else if (
        Array.isArray(bookingData?.bookings)
      ) {
        updatedBookings = bookingData.bookings;

      } else if (
        Array.isArray(bookingData?.data)
      ) {
        updatedBookings = bookingData.data;
      }


      setBookings(updatedBookings);

    } catch (error) {
      setBookingMessage(
        error.response?.data?.message ||
        "Unable to complete this booking."
      );

    } finally {
      setBooking(false);
    }
  };


  /* ============================================
     FILTERS
     ============================================ */

  const categories = useMemo(() => {
    const uniqueCategories =
      gigs
        .map((gig) => gig.category)
        .filter(Boolean);

    return [
      "All",
      ...new Set(uniqueCategories)
    ];
  }, [gigs]);


  const filteredGigs = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();


    return gigs.filter((gig) => {

      const matchesSearch =
        !search ||
        (gig.title || "")
          .toLowerCase()
          .includes(search) ||
        (gig.category || "")
          .toLowerCase()
          .includes(search) ||
        (gig.description || "")
          .toLowerCase()
          .includes(search) ||
        (gig.freelancer?.name || "")
          .toLowerCase()
          .includes(search);


      const matchesCategory =
        selectedCategory === "All" ||
        gig.category === selectedCategory;


      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    gigs,
    searchTerm,
    selectedCategory
  ]);


  const activeBookings =
    bookings.filter(
      (item) =>
        item.status !== "cancelled"
    ).length;


  const getInitials = (name) => {
    if (!name) {
      return "HH";
    }

    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };


  return (
    <div className="client-premium-page">

      {/* ========================================
          NAVIGATION
          ======================================== */}

      <nav className="client-premium-nav">

        <button
          className="client-premium-brand"
          onClick={() =>
            navigate("/client")
          }
        >
          <span className="client-brand-mark">
            H
          </span>

          <span>
            HUSTLEHUB
          </span>
        </button>


        <div className="client-nav-center">

          <button className="client-nav-item active">
            Discover
          </button>


          <button
            className="client-nav-item"
            onClick={goToBookings}
          >
            My Bookings
          </button>

        </div>


        <div className="client-nav-account">

          <div className="client-nav-profile">

            <div className="client-avatar">
              {getInitials(user.name)}
            </div>


            <div>
              <strong>
                {user.name || "Client"}
              </strong>

              <span>
                Client
              </span>
            </div>

          </div>


          <button
            className="client-logout-button"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>

        </div>

      </nav>


      {/* ========================================
          HERO
          ======================================== */}

      <main>

        <section className="client-premium-hero">

          <div className="client-hero-grid" />
          <div className="client-red-glow" />


          <div className="client-premium-container">

            <motion.div
              className="client-hero-content"
              initial={{
                opacity: 0,
                y: 28
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
            >

              <div className="client-hero-label">

                <span />

                CLIENT / DISCOVER

              </div>


              <h1>
                What will you
                <span>
                  build next?
                </span>
              </h1>


              <p>
                Welcome back, {user.name || "Client"}.
                Discover specialist talent and turn
                your next idea into something real.
              </p>

            </motion.div>


            <motion.div
              className="client-hero-status"
              initial={{
                opacity: 0,
                x: 25
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.7,
                delay: 0.15
              }}
            >

              <Sparkles size={17} />

              Marketplace active

            </motion.div>

          </div>


          {/* LARGE METRICS */}

          <div className="client-metric-row">

            <div className="client-metric">

              <span>
                01
              </span>


              <div>

                <strong>
                  {gigs.length
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <p>
                  Available services
                </p>

              </div>

            </div>


            <button
              className="client-metric client-metric-action"
              onClick={goToBookings}
            >

              <span>
                02
              </span>


              <div>

                <strong>
                  {bookings.length
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <p>
                  Total bookings
                </p>

              </div>


              <ChevronRight size={20} />

            </button>


            <div className="client-metric">

              <span>
                03
              </span>


              <div>

                <strong>
                  {activeBookings
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <p>
                  Active bookings
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================
            MARKETPLACE
            ======================================== */}

        <section className="client-marketplace">

          <div className="client-premium-container client-marketplace-container">

            {/* HEADING */}

            <div className="client-marketplace-heading">

              <div>

                <p className="client-section-label">
                  DISCOVER
                </p>


                <h2>
                  Exceptional talent.
                  <span>
                    Ready when you are.
                  </span>
                </h2>

              </div>


              <div className="client-marketplace-count">

                <Grid2X2 size={17} />

                {filteredGigs.length} services

              </div>

            </div>


            {/* TOOLBAR */}

            <div className="client-discovery-toolbar">

              <div className="client-category-list">

                {categories.map(
                  (category) => (

                    <button
                      key={category}
                      className={
                        selectedCategory === category
                          ? "client-category active"
                          : "client-category"
                      }
                      onClick={() =>
                        setSelectedCategory(category)
                      }
                    >
                      {category}
                    </button>

                  )
                )}

              </div>


              <div className="client-premium-search">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search talent or services"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* GIGS */}

            {loading ? (

              <div className="client-loading-state">

                <div className="client-loading-line" />
                <div className="client-loading-line" />
                <div className="client-loading-line" />

                <p>
                  Curating the marketplace...
                </p>

              </div>

            ) : filteredGigs.length === 0 ? (

              <motion.div
                className="client-empty-state"
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
              >

                <Search size={26} />


                <h3>
                  Nothing found.
                </h3>


                <p>
                  Try a different search or explore
                  another category.
                </p>


                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                >
                  Reset discovery
                </button>

              </motion.div>

            ) : (

              <div className="client-premium-gig-grid">

                {filteredGigs.map(
                  (gig, index) => {

                    const freelancerName =
                      gig.freelancer?.name ||
                      "HustleHub Freelancer";


                    return (

                      <motion.article
                        className="client-premium-gig"
                        key={gig._id}
                        initial={{
                          opacity: 0,
                          y: 24
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

                        <div className="client-gig-number">

                          {String(index + 1)
                            .padStart(2, "0")}

                        </div>


                        <div className="client-gig-top">

                          <span className="client-gig-category">
                            {gig.category}
                          </span>


                          <span className="client-gig-price">
                            R
                            {Number(
                              gig.price || 0
                            ).toLocaleString()}
                          </span>

                        </div>


                        <div className="client-gig-body">

                          <h3>
                            {gig.title}
                          </h3>


                          <p>
                            {gig.description}
                          </p>

                        </div>


                        <div className="client-gig-footer">

                          <div className="client-freelancer">

                            <span className="client-freelancer-avatar">
                              {getInitials(
                                freelancerName
                              )}
                            </span>


                            <div>

                              <small>
                                FREELANCER
                              </small>

                              <strong>
                                {freelancerName}
                              </strong>

                            </div>

                          </div>


                          <button
                            className="client-view-gig"
                            onClick={() => {
                              setSelectedGig(gig);
                              setBookingMessage("");
                            }}
                          >
                            View service

                            <ArrowRight size={17} />
                          </button>

                        </div>

                      </motion.article>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </section>


        {/* ========================================
            CLIENT CTA
            ======================================== */}

        <section className="client-bookings-banner">

          <div className="client-premium-container">

            <div className="client-bookings-banner-inner">

              <div>

                <CalendarCheck2 size={23} />


                <p>
                  YOUR PROJECTS
                </p>


                <h2>
                  Keep every booking
                  within reach.
                </h2>

              </div>


              <button
                onClick={goToBookings}
              >
                View my bookings

                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </section>

      </main>


      {/* ========================================
          GIG MODAL
          ======================================== */}

      <GigModal
        gig={selectedGig}
        isOpen={Boolean(selectedGig)}
        onClose={() => {
          setSelectedGig(null);
          setBookingMessage("");
        }}
        onBook={handleBookGig}
        booking={booking}
        message={bookingMessage}
      />

    </div>
  );
}


export default ClientDashboard;