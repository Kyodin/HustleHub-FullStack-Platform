import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  Ban,
  BriefcaseBusiness,
  Calculator,
  CalendarCheck2,
  CircleDollarSign,
  LogOut,
  Pencil,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Trash2,
  TrendingUp,
  WalletCards,
  X
} from "lucide-react";

import api from "../services/api";
import "./FreelancerDashboard.css";


function FreelancerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  /* =====================================================
     STATE
     ===================================================== */

  const [gigs, setGigs] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [income, setIncome] = useState({
    totalIncome: 0,
    currentMonthIncome: 0,
    completedTransactionCount: 0,
    refundedTransactionCount: 0,
    refundedAmount: 0,
    estimatedTaxRate: 0.15,
    estimatedTax: 0,
    estimatedAfterTaxIncome: 0,
    monthlyIncome: [],
    transactions: []
  });

  const [loading, setLoading] = useState(true);

  const [showGigModal, setShowGigModal] =
    useState(false);

  const [editingGig, setEditingGig] =
    useState(null);

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [
    cancellationReason,
    setCancellationReason
  ] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: ""
  });


  /* =====================================================
     HELPERS
     ===================================================== */

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString(
      "en-ZA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
  };


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


  /* =====================================================
     LOAD DASHBOARD
     ===================================================== */

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [
        gigResponse,
        bookingResponse,
        incomeResponse
      ] = await Promise.all([
        api.get("/gigs/mine"),
        api.get("/bookings/received"),
        api.get("/transactions/income")
      ]);


      /* GIGS */

      const gigData = gigResponse.data;

      if (Array.isArray(gigData)) {
        setGigs(gigData);

      } else if (
        Array.isArray(gigData?.gigs)
      ) {
        setGigs(gigData.gigs);

      } else if (
        Array.isArray(gigData?.data)
      ) {
        setGigs(gigData.data);

      } else {
        setGigs([]);
      }


      /* BOOKINGS */

      const bookingData =
        bookingResponse.data;

      if (Array.isArray(bookingData)) {
        setBookings(bookingData);

      } else if (
        Array.isArray(
          bookingData?.bookings
        )
      ) {
        setBookings(
          bookingData.bookings
        );

      } else if (
        Array.isArray(
          bookingData?.data
        )
      ) {
        setBookings(
          bookingData.data
        );

      } else {
        setBookings([]);
      }


      /* FINANCIAL DATA */

      const financialData =
        incomeResponse.data;

      setIncome({
        totalIncome:
          Number(
            financialData?.totalIncome
          ) || 0,

        currentMonthIncome:
          Number(
            financialData?.currentMonthIncome
          ) || 0,

        completedTransactionCount:
          Number(
            financialData
              ?.completedTransactionCount
          ) || 0,

        refundedTransactionCount:
          Number(
            financialData
              ?.refundedTransactionCount
          ) || 0,

        refundedAmount:
          Number(
            financialData?.refundedAmount
          ) || 0,

        estimatedTaxRate:
          Number(
            financialData?.estimatedTaxRate
          ) || 0.15,

        estimatedTax:
          Number(
            financialData?.estimatedTax
          ) || 0,

        estimatedAfterTaxIncome:
          Number(
            financialData
              ?.estimatedAfterTaxIncome
          ) || 0,

        monthlyIncome:
          Array.isArray(
            financialData?.monthlyIncome
          )
            ? financialData.monthlyIncome
            : [],

        transactions:
          Array.isArray(
            financialData?.transactions
          )
            ? financialData.transactions
            : []
      });

      setError("");

    } catch (err) {
      console.error(
        "Unable to load freelancer dashboard:",
        err.response?.data ||
        err.message
      );

      setError(
        err.response?.data?.message ||
        "Unable to load freelancer dashboard."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  /* =====================================================
     LOGOUT
     ===================================================== */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  /* =====================================================
     GIG FORM
     ===================================================== */

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const openCreateGig = () => {
    setEditingGig(null);

    setFormData({
      title: "",
      description: "",
      category: "",
      price: ""
    });

    setMessage("");
    setError("");

    setShowGigModal(true);
  };


  const openEditGig = (gig) => {
    setEditingGig(gig);

    setFormData({
      title: gig.title || "",
      description:
        gig.description || "",
      category:
        gig.category || "",
      price:
        gig.price || ""
    });

    setMessage("");
    setError("");

    setShowGigModal(true);
  };


  const closeGigModal = () => {
    setShowGigModal(false);
    setEditingGig(null);

    setMessage("");
    setError("");
  };


  const handleGigSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const payload = {
        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        category:
          formData.category.trim(),

        price:
          Number(formData.price)
      };


      if (editingGig) {
        await api.put(
          `/gigs/${editingGig._id}`,
          payload
        );

        setMessage(
          "Gig updated successfully."
        );

      } else {
        await api.post(
          "/gigs",
          payload
        );

        setMessage(
          "Gig created successfully."
        );
      }


      await loadDashboard();


      setTimeout(() => {
        closeGigModal();
      }, 800);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save this gig."
      );
    }
  };


  /* =====================================================
     DELETE GIG
     ===================================================== */

  const handleDeleteGig = async (
    gig
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${gig.title}"?`
      );

    if (!confirmed) {
      return;
    }


    try {
      await api.delete(
        `/gigs/${gig._id}`
      );

      await loadDashboard();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete this gig."
      );
    }
  };


  /* =====================================================
     BOOKING CANCELLATION
     ===================================================== */

  const openCancelBooking = (
    booking
  ) => {
    setSelectedBooking(booking);

    setCancellationReason("");

    setMessage("");
    setError("");

    setShowCancelModal(true);
  };


  const closeCancelBooking = () => {
    setShowCancelModal(false);

    setSelectedBooking(null);

    setCancellationReason("");

    setMessage("");
    setError("");
  };


  const handleCancelBooking =
    async (event) => {
      event.preventDefault();

      if (!selectedBooking) {
        return;
      }

      setMessage("");
      setError("");


      try {
        await api.patch(
          `/bookings/${selectedBooking._id}/cancel`,
          {
            reason:
              cancellationReason.trim()
          }
        );


        setMessage(
          "Booking cancelled successfully."
        );


        await loadDashboard();


        setTimeout(() => {
          closeCancelBooking();
        }, 800);

      } catch (err) {
        console.error(
          "Unable to cancel booking:",
          err.response?.data ||
          err.message
        );

        setError(
          err.response?.data?.message ||
          "Unable to cancel this booking."
        );
      }
    };


  /* =====================================================
     CHART
     ===================================================== */

  const maximumMonthlyIncome =
    income.monthlyIncome.length > 0
      ? Math.max(
          ...income.monthlyIncome.map(
            (item) =>
              Number(
                item.income || 0
              )
          ),
          1
        )
      : 1;


  /* =====================================================
     DASHBOARD
     ===================================================== */

  return (
    <div className="freelancer-dashboard">

      {/* NAVIGATION */}

      <nav className="freelancer-nav">

        <button
          type="button"
          className="freelancer-brand"
        >

          <span className="freelancer-brand-mark">
            H
          </span>

          <span>
            HUSTLEHUB
          </span>

        </button>


        <div className="freelancer-nav-centre">

          <button
            type="button"
            className="freelancer-nav-link active"
          >
            Overview
          </button>


          <a
            className="freelancer-nav-link"
            href="#services"
          >
            Services
          </a>


          <a
            className="freelancer-nav-link"
            href="#bookings"
          >
            Bookings
          </a>

        </div>


        <div className="freelancer-nav-actions">

          <button
            type="button"
            className="freelancer-nav-create"
            onClick={openCreateGig}
          >
            <Plus size={17} />

            Create service
          </button>


          <div className="freelancer-profile">

            <span className="freelancer-profile-avatar">
              {getInitials(user.name)}
            </span>

            <div>
              <strong>
                {user.name ||
                  "Freelancer"}
              </strong>

              <span>
                Freelancer
              </span>
            </div>

          </div>


          <button
            type="button"
            className="freelancer-logout"
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>

        </div>

      </nav>


      {/* HERO */}

      <main className="freelancer-shell">

        <motion.section
          className="freelancer-hero"

          initial={{
            opacity: 0,
            y: 24
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

          <div className="freelancer-hero-main">

            <div className="freelancer-hero-label">

              <span />

              FREELANCER / PERFORMANCE

            </div>


            <h1>
              Your business.

              <span>
                At a glance.
              </span>
            </h1>


            <p>
              Welcome back,{" "}
              {user.name ||
                "Freelancer"}.
              Manage your services,
              bookings and financial
              performance from one focused
              workspace.
            </p>

          </div>


          <div className="freelancer-hero-side">

            <div className="freelancer-live-status">

              <span />

              Business active

            </div>


            <button
              type="button"
              className="freelancer-create-main"
              onClick={openCreateGig}
            >
              <Plus size={18} />

              Create service
            </button>

          </div>

        </motion.section>


        {/* PERFORMANCE STRIP */}

        <section className="freelancer-performance-strip">

          <div className="freelancer-performance-item">

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
                Active services
              </p>
            </div>

          </div>


          <div className="freelancer-performance-item">

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
                Client bookings
              </p>
            </div>

          </div>


          <div className="freelancer-performance-item freelancer-performance-income">

            <span>
              03
            </span>


            <div>
              <strong>
                R
                {formatCurrency(
                  income.totalIncome
                )}
              </strong>

              <p>
                Total earnings
              </p>
            </div>

          </div>

        </section>


        {/* FINANCIAL OVERVIEW */}

        <section className="freelancer-section financial-section">

          <div className="freelancer-section-heading">

            <div>

              <p className="freelancer-eyebrow">
                FINANCIAL OVERVIEW
              </p>


              <h2>
                Your business.
                <span>
                  In numbers.
                </span>
              </h2>

            </div>


            <span>
              Estimated financial summary
            </span>

          </div>


          <div className="financial-card-grid">

            <motion.div
              className="financial-card"
              whileHover={{
                y: -3
              }}
            >

              <div className="financial-icon">
                <TrendingUp size={20} />
              </div>


              <span>
                THIS MONTH
              </span>


              <strong>
                R
                {formatCurrency(
                  income.currentMonthIncome
                )}
              </strong>


              <small>
                Income earned this month
              </small>

            </motion.div>


            <motion.div
              className="financial-card"
              whileHover={{
                y: -3
              }}
            >

              <div className="financial-icon">
                <Calculator size={20} />
              </div>


              <span>
                ESTIMATED TAX
              </span>


              <strong>
                R
                {formatCurrency(
                  income.estimatedTax
                )}
              </strong>


              <small>
                {Math.round(
                  income.estimatedTaxRate *
                  100
                )}
                % planning estimate
              </small>

            </motion.div>


            <motion.div
              className="financial-card financial-card-highlight"
              whileHover={{
                y: -3
              }}
            >

              <div className="financial-icon">
                <WalletCards size={20} />
              </div>


              <span>
                AFTER-TAX ESTIMATE
              </span>


              <strong>
                R
                {formatCurrency(
                  income
                    .estimatedAfterTaxIncome
                )}
              </strong>


              <small>
                Estimated retained income
              </small>

            </motion.div>


            <motion.div
              className="financial-card"
              whileHover={{
                y: -3
              }}
            >

              <div className="financial-icon">
                <RotateCcw size={20} />
              </div>


              <span>
                REFUNDED
              </span>


              <strong>
                R
                {formatCurrency(
                  income.refundedAmount
                )}
              </strong>


              <small>
                {
                  income
                    .refundedTransactionCount
                }{" "}
                refunded transaction
                {income
                  .refundedTransactionCount ===
                1
                  ? ""
                  : "s"}
              </small>

            </motion.div>

          </div>


          {/* PERFORMANCE PANELS */}

          <div className="finance-content-grid">

            {/* MONTHLY EARNINGS */}

            <div className="finance-panel finance-chart-panel">

              <div className="finance-panel-header">

                <div>

                  <p className="freelancer-eyebrow">
                    PERFORMANCE
                  </p>

                  <h3>
                    Monthly earnings
                  </h3>

                </div>


                <TrendingUp size={20} />

              </div>


              {income.monthlyIncome.length ===
              0 ? (

                <div className="finance-empty">

                  <TrendingUp size={28} />

                  <p>
                    No monthly income data yet.
                  </p>

                </div>

              ) : (

                <div className="earnings-chart">

                  {income.monthlyIncome.map(
                    (
                      month,
                      index
                    ) => {

                      const percentage =
                        Math.max(
                          (
                            Number(
                              month.income ||
                              0
                            ) /
                            maximumMonthlyIncome
                          ) *
                            100,
                          4
                        );


                      return (

                        <div
                          className="earnings-bar-item"
                          key={`${month.month}-${month.year}-${index}`}
                        >

                          <div className="earnings-value">
                            R
                            {Number(
                              month.income ||
                              0
                            ).toLocaleString()}
                          </div>


                          <div className="earnings-bar-track">

                            <motion.div
                              className="earnings-bar-fill"

                              initial={{
                                height: 0
                              }}

                              animate={{
                                height:
                                  `${percentage}%`
                              }}

                              transition={{
                                duration: 0.7,
                                delay:
                                  index * 0.08
                              }}
                            />

                          </div>


                          <span>
                            {month.month}
                          </span>

                          <small>
                            {month.year}
                          </small>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

            </div>


            {/* ACCOUNT ACTIVITY */}

            <div className="finance-panel">

              <div className="finance-panel-header">

                <div>

                  <p className="freelancer-eyebrow">
                    SUMMARY
                  </p>

                  <h3>
                    Account activity
                  </h3>

                </div>


                <ReceiptText size={20} />

              </div>


              <div className="finance-summary-list">

                <div>
                  <span>
                    Completed transactions
                  </span>

                  <strong>
                    {
                      income
                        .completedTransactionCount
                    }
                  </strong>
                </div>


                <div>
                  <span>
                    Refunded transactions
                  </span>

                  <strong>
                    {
                      income
                        .refundedTransactionCount
                    }
                  </strong>
                </div>


                <div>
                  <span>
                    Gross income
                  </span>

                  <strong>
                    R
                    {formatCurrency(
                      income.totalIncome
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Estimated tax
                  </span>

                  <strong>
                    - R
                    {formatCurrency(
                      income.estimatedTax
                    )}
                  </strong>
                </div>


                <div className="finance-summary-total">

                  <span>
                    Estimated after tax
                  </span>

                  <strong>
                    R
                    {formatCurrency(
                      income
                        .estimatedAfterTaxIncome
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* TRANSACTIONS */}

        <section className="freelancer-section">

          <div className="freelancer-section-heading">

            <div>

              <p className="freelancer-eyebrow">
                FINANCIAL ACTIVITY
              </p>


              <h2>
                Transaction
                <span>
                  history.
                </span>
              </h2>

            </div>


            <span>
              {
                income.transactions.length
              }{" "}
              transaction
              {income.transactions.length ===
              1
                ? ""
                : "s"}
            </span>

          </div>


          {income.transactions.length ===
          0 ? (

            <div className="freelancer-empty small">

              <ReceiptText size={30} />

              <h3>
                No transactions yet.
              </h3>

              <p>
                Your completed bookings and
                refunds will appear here.
              </p>

            </div>

          ) : (

            <div className="transaction-table-wrapper">

              <table className="transaction-table">

                <thead>

                  <tr>
                    <th>
                      Service
                    </th>

                    <th>
                      Client
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Amount
                    </th>
                  </tr>

                </thead>


                <tbody>

                  {income.transactions.map(
                    (transaction) => (

                      <tr
                        key={
                          transaction._id
                        }
                      >

                        <td>

                          <strong>
                            {transaction
                              .gig?.title ||
                              transaction
                                .gigTitle ||
                              "Booked service"}
                          </strong>

                          <span>
                            {transaction
                              .gig?.category ||
                              transaction
                                .gigCategory ||
                              "Service"}
                          </span>

                        </td>


                        <td>
                          {transaction
                            .client?.name ||
                            "Client"}
                        </td>


                        <td>
                          {new Date(
                            transaction.createdAt
                          ).toLocaleDateString(
                            "en-ZA"
                          )}
                        </td>


                        <td>

                          <span
                            className={
                              transaction.status ===
                              "refunded"
                                ? "transaction-status refunded"
                                : "transaction-status completed"
                            }
                          >
                            {
                              transaction.status
                            }
                          </span>

                        </td>


                        <td className="transaction-amount">
                          R
                          {formatCurrency(
                            transaction.amount
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* MY SERVICES */}

        <section
          className="freelancer-section"
          id="services"
        >

          <div className="freelancer-section-heading">

            <div>

              <p className="freelancer-eyebrow">
                YOUR SERVICES
              </p>

              <h2>
                Built by
                <span>
                  you.
                </span>
              </h2>

            </div>


            <span>
              {gigs.length}{" "}
              {gigs.length === 1
                ? "service"
                : "services"}
            </span>

          </div>


          {loading ? (

            <div className="freelancer-loading">
              Loading your services...
            </div>

          ) : gigs.length === 0 ? (

            <div className="freelancer-empty">

              <BriefcaseBusiness
                size={34}
              />

              <h3>
                No services yet.
              </h3>

              <p>
                Create your first service
                and start getting discovered
                by clients.
              </p>


              <button
                type="button"
                className="freelancer-empty-button"
                onClick={openCreateGig}
              >
                <Plus size={17} />

                Create first service
              </button>

            </div>

          ) : (

            <div className="freelancer-gig-grid">

              {gigs.map(
                (
                  gig,
                  index
                ) => (

                  <motion.article
                    key={gig._id}
                    className="freelancer-gig-card"

                    initial={{
                      opacity: 0,
                      y: 20
                    }}

                    animate={{
                      opacity: 1,
                      y: 0
                    }}

                    transition={{
                      duration: 0.4,
                      delay:
                        Math.min(
                          index * 0.07,
                          0.3
                        )
                    }}
                  >

                    <div className="freelancer-gig-number">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>


                    <div className="freelancer-gig-top">

                      <span className="freelancer-gig-category">
                        {gig.category}
                      </span>


                      <span className="freelancer-gig-price">
                        R
                        {Number(
                          gig.price
                        ).toLocaleString()}
                      </span>

                    </div>


                    <div className="freelancer-gig-body">

                      <h3>
                        {gig.title}
                      </h3>


                      <p>
                        {gig.description}
                      </p>

                    </div>


                    <div className="freelancer-gig-actions">

                      <button
                        type="button"
                        onClick={() =>
                          openEditGig(
                            gig
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />

                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-gig"
                        onClick={() =>
                          handleDeleteGig(
                            gig
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />

                        Delete
                      </button>

                    </div>

                  </motion.article>

                )
              )}

            </div>

          )}

        </section>


        {/* BOOKINGS */}

        <section
          className="freelancer-section"
          id="bookings"
        >

          <div className="freelancer-section-heading">

            <div>

              <p className="freelancer-eyebrow">
                CLIENT ACTIVITY
              </p>

              <h2>
                Recent
                <span>
                  bookings.
                </span>
              </h2>

            </div>


            <span>
              {bookings.length}{" "}
              {bookings.length === 1
                ? "booking"
                : "bookings"}
            </span>

          </div>


          {loading ? (

            <div className="freelancer-loading">
              Loading bookings...
            </div>

          ) : bookings.length === 0 ? (

            <div className="freelancer-empty small">

              <CalendarCheck2
                size={30}
              />

              <h3>
                No bookings yet.
              </h3>

              <p>
                New client bookings
                will appear here.
              </p>

            </div>

          ) : (

            <div className="freelancer-bookings-list">

              {bookings.map(
                (booking) => (

                  <div
                    key={booking._id}
                    className="freelancer-booking-row"
                  >

                    <div className="freelancer-booking-main">

                      <strong>
                        {booking.gig
                          ?.title ||
                          booking.gigTitle ||
                          "Booked service"}
                      </strong>


                      <span>
                        {booking.client
                          ?.name ||
                          "Client"}
                      </span>


                      {booking.status ===
                        "cancelled" && (

                        <span className="booking-cancelled-text">
                          Cancelled by{" "}
                          {booking.cancelledBy ||
                            "freelancer"}
                        </span>

                      )}


                      {booking.status ===
                        "cancelled" &&
                        booking
                          .cancellationReason && (

                        <span className="booking-cancellation-reason">
                          {
                            booking
                              .cancellationReason
                          }
                        </span>

                      )}

                    </div>


                    <div className="freelancer-booking-meta">

                      <span
                        className={
                          booking.status ===
                          "cancelled"
                            ? "booking-status booking-status-cancelled"
                            : "booking-status booking-status-active"
                        }
                      >
                        {booking.status}
                      </span>


                      <strong>
                        R
                        {Number(
                          booking
                            .agreedPrice ||
                          booking.amount ||
                          0
                        ).toLocaleString()}
                      </strong>


                      {booking.status ===
                        "confirmed" && (

                        <button
                          type="button"
                          className="cancel-booking-button"
                          onClick={() =>
                            openCancelBooking(
                              booking
                            )
                          }
                        >
                          <Ban
                            size={14}
                          />

                          Cancel
                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* ===================================================
          CREATE / EDIT GIG MODAL
          =================================================== */}

      <AnimatePresence>

        {showGigModal && (

          <motion.div
            className="freelancer-modal-backdrop"

            initial={{
              opacity: 0
            }}

            animate={{
              opacity: 1
            }}

            exit={{
              opacity: 0
            }}
          >

            <motion.div
              className="freelancer-modal"

              initial={{
                opacity: 0,
                y: 25,
                scale: 0.97
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}

              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97
              }}
            >

              <div className="freelancer-modal-header">

                <div>

                  <p className="freelancer-eyebrow">
                    {editingGig
                      ? "UPDATE SERVICE"
                      : "NEW SERVICE"}
                  </p>


                  <h2>
                    {editingGig
                      ? "Edit service"
                      : "Create service"}
                  </h2>

                </div>


                <button
                  type="button"
                  className="modal-close-button"
                  onClick={
                    closeGigModal
                  }
                >
                  <X size={19} />
                </button>

              </div>


              <form
                className="freelancer-gig-form"
                onSubmit={
                  handleGigSubmit
                }
              >

                <div className="form-group">

                  <label className="form-label">
                    Service title
                  </label>


                  <input
                    className="form-input"
                    type="text"
                    name="title"
                    placeholder="e.g. Professional Logo Design"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Category
                  </label>


                  <input
                    className="form-input"
                    type="text"
                    name="category"
                    placeholder="e.g. Graphic Design"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Description
                  </label>


                  <textarea
                    className="form-input freelancer-textarea"
                    name="description"
                    placeholder="Describe what you offer..."
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label className="form-label">
                    Price
                  </label>


                  <input
                    className="form-input"
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    placeholder="750"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                {error && (

                  <div className="login-error">
                    {error}
                  </div>

                )}


                {message && (

                  <div className="login-success">
                    {message}
                  </div>

                )}


                <button
                  type="submit"
                  className="freelancer-save-gig"
                >

                  {editingGig ? (

                    <>
                      <Save size={17} />

                      Save changes
                    </>

                  ) : (

                    <>
                      <Plus size={17} />

                      Create service
                    </>

                  )}

                </button>

              </form>

            </motion.div>

          </motion.div>

        )}


        {/* =================================================
            CANCELLATION MODAL
            ================================================= */}

        {showCancelModal && (

          <motion.div
            className="freelancer-modal-backdrop"

            initial={{
              opacity: 0
            }}

            animate={{
              opacity: 1
            }}

            exit={{
              opacity: 0
            }}
          >

            <motion.div
              className="freelancer-modal"

              initial={{
                opacity: 0,
                y: 25,
                scale: 0.97
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}

              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97
              }}
            >

              <div className="freelancer-modal-header">

                <div>

                  <p className="freelancer-eyebrow danger">
                    CANCEL BOOKING
                  </p>


                  <h2>
                    Cancel client booking
                  </h2>

                </div>


                <button
                  type="button"
                  className="modal-close-button"
                  onClick={
                    closeCancelBooking
                  }
                >
                  <X size={19} />
                </button>

              </div>


              {selectedBooking && (

                <div className="cancel-booking-summary">

                  <strong>
                    {selectedBooking
                      .gig?.title ||
                      selectedBooking
                        .gigTitle ||
                      "Booked service"}
                  </strong>


                  <span>
                    Client:{" "}
                    {selectedBooking
                      .client?.name ||
                      "Client"}
                  </span>


                  <span>
                    Value: R
                    {Number(
                      selectedBooking
                        .agreedPrice ||
                      selectedBooking
                        .amount ||
                      0
                    ).toLocaleString()}
                  </span>

                </div>

              )}


              <form
                className="freelancer-gig-form"
                onSubmit={
                  handleCancelBooking
                }
              >

                <div className="form-group">

                  <label className="form-label">
                    Reason for cancellation
                  </label>


                  <textarea
                    className="form-input freelancer-textarea"
                    value={
                      cancellationReason
                    }
                    onChange={(event) =>
                      setCancellationReason(
                        event.target.value
                      )
                    }
                    maxLength={250}
                    placeholder="Explain why you are cancelling this booking..."
                    required
                  />


                  <span className="cancel-character-count">
                    {
                      cancellationReason.length
                    }
                    /250
                  </span>

                </div>


                {error && (

                  <div className="login-error">
                    {error}
                  </div>

                )}


                {message && (

                  <div className="login-success">
                    {message}
                  </div>

                )}


                <button
                  type="submit"
                  className="cancel-booking-confirm"
                >
                  <Ban size={17} />

                  Confirm cancellation
                </button>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}


export default FreelancerDashboard;