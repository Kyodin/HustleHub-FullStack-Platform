import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  motion
} from "framer-motion";

import {
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  Users
} from "lucide-react";

import api from "../services/api";
import "./AdminDashboard.css";


function AdminDashboard() {
  const navigate = useNavigate();


  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  /* =====================================================
     STATE
     ===================================================== */

  const [
    activeTab,
    setActiveTab
  ] = useState("overview");


  const [
    searchTerm,
    setSearchTerm
  ] = useState("");


  const [
    summary,
    setSummary
  ] = useState({
    users: 0,
    clients: 0,
    freelancers: 0,
    gigs: 0,
    bookings: 0,
    transactions: 0
  });


  const [
    users,
    setUsers
  ] = useState([]);


  const [
    gigs,
    setGigs
  ] = useState([]);


  const [
    bookings,
    setBookings
  ] = useState([]);


  const [
    transactions,
    setTransactions
  ] = useState([]);


  const [
    transactionSummary,
    setTransactionSummary
  ] = useState({
    completedCount: 0,
    refundedCount: 0,
    completedValue: 0,
    refundedValue: 0
  });


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  /* =====================================================
     HELPERS
     ===================================================== */

  const formatCurrency = (
    value
  ) => {
    return Number(
      value || 0
    ).toLocaleString(
      "en-ZA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
  };


  const formatDate = (
    value
  ) => {
    if (!value) {
      return "—";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "en-ZA"
    );
  };


  const getInitials = (
    name
  ) => {
    if (!name) {
      return "AD";
    }

    return name
      .split(" ")
      .slice(0, 2)
      .map((part) =>
        part[0]
      )
      .join("")
      .toUpperCase();
  };


  /* =====================================================
     LOAD ADMIN DATA
     ===================================================== */

  const loadAdminDashboard =
    async () => {
      setLoading(true);
      setError("");


      try {
        const [
          summaryResponse,
          usersResponse,
          gigsResponse,
          bookingsResponse,
          transactionsResponse
        ] = await Promise.all([
          api.get(
            "/admin/summary"
          ),
          api.get(
            "/admin/users"
          ),
          api.get(
            "/admin/gigs"
          ),
          api.get(
            "/admin/bookings"
          ),
          api.get(
            "/admin/transactions"
          )
        ]);


        /* SUMMARY */

        const summaryData =
          summaryResponse
            .data?.summary ||
          summaryResponse
            .data?.data ||
          summaryResponse.data;


        setSummary({
          users:
            Number(
              summaryData?.users
            ) || 0,

          clients:
            Number(
              summaryData?.clients
            ) || 0,

          freelancers:
            Number(
              summaryData
                ?.freelancers
            ) || 0,

          gigs:
            Number(
              summaryData?.gigs
            ) || 0,

          bookings:
            Number(
              summaryData?.bookings
            ) || 0,

          transactions:
            Number(
              summaryData
                ?.transactions
            ) || 0
        });


        /* USERS */

        setUsers(
          Array.isArray(
            usersResponse
              .data?.users
          )
            ? usersResponse
                .data.users
            : []
        );


        /* GIGS */

        setGigs(
          Array.isArray(
            gigsResponse
              .data?.gigs
          )
            ? gigsResponse
                .data.gigs
            : []
        );


        /* BOOKINGS */

        setBookings(
          Array.isArray(
            bookingsResponse
              .data?.bookings
          )
            ? bookingsResponse
                .data.bookings
            : []
        );


        /* TRANSACTIONS */

        const transactionData =
          transactionsResponse.data;


        setTransactions(
          Array.isArray(
            transactionData
              ?.transactions
          )
            ? transactionData
                .transactions
            : []
        );


        setTransactionSummary({
          completedCount:
            Number(
              transactionData
                ?.completedCount
            ) || 0,

          refundedCount:
            Number(
              transactionData
                ?.refundedCount
            ) || 0,

          completedValue:
            Number(
              transactionData
                ?.completedValue
            ) || 0,

          refundedValue:
            Number(
              transactionData
                ?.refundedValue
            ) || 0
        });

      } catch (err) {
        console.error(
          "Unable to load admin dashboard:",
          err.response?.data ||
          err.message
        );


        setError(
          err.response?.data?.message ||
          "Unable to load admin dashboard."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadAdminDashboard();
  }, []);


  /* =====================================================
     LOGOUT
     ===================================================== */

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };


  /* =====================================================
     TABS
     ===================================================== */

  const changeTab = (
    tab
  ) => {
    setActiveTab(tab);
    setSearchTerm("");
  };


  /* =====================================================
     SEARCH
     ===================================================== */

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();


  const filteredUsers =
    useMemo(() => {
      if (!normalizedSearch) {
        return users;
      }

      return users.filter(
        (item) => {
          return [
            item.name,
            item.email,
            item.role
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
            );
        }
      );
    }, [
      users,
      normalizedSearch
    ]);


  const filteredGigs =
    useMemo(() => {
      if (!normalizedSearch) {
        return gigs;
      }

      return gigs.filter(
        (gig) => {
          return [
            gig.title,
            gig.category,
            gig.freelancer
              ?.name,
            gig.freelancer
              ?.email
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
            );
        }
      );
    }, [
      gigs,
      normalizedSearch
    ]);


  const filteredBookings =
    useMemo(() => {
      if (!normalizedSearch) {
        return bookings;
      }

      return bookings.filter(
        (booking) => {
          return [
            booking.gig
              ?.title,
            booking.gigTitle,
            booking.client
              ?.name,
            booking.client
              ?.email,
            booking.freelancer
              ?.name,
            booking.freelancer
              ?.email,
            booking.status,
            booking.cancelledBy
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
            );
        }
      );
    }, [
      bookings,
      normalizedSearch
    ]);


  const filteredTransactions =
    useMemo(() => {
      if (!normalizedSearch) {
        return transactions;
      }

      return transactions.filter(
        (transaction) => {
          return [
            transaction.gig
              ?.title,
            transaction.gigTitle,
            transaction.client
              ?.name,
            transaction.client
              ?.email,
            transaction
              .freelancer
              ?.name,
            transaction
              .freelancer
              ?.email,
            transaction.status
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
            );
        }
      );
    }, [
      transactions,
      normalizedSearch
    ]);


  /* =====================================================
     DERIVED VALUES
     ===================================================== */

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "confirmed"
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
    <div className="admin-dashboard">

      {/* =================================================
          NAVIGATION
          ================================================= */}

      <nav className="admin-nav">

        <button
          type="button"
          className="admin-brand"
        >

          <span className="admin-brand-mark">
            H
          </span>


          <span>
            HUSTLEHUB
          </span>

        </button>


        <div className="admin-nav-centre">

          <button
            type="button"
            className={
              activeTab ===
              "overview"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              changeTab(
                "overview"
              )
            }
          >
            Overview
          </button>


          <button
            type="button"
            className={
              activeTab ===
              "users"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              changeTab(
                "users"
              )
            }
          >
            Users
          </button>


          <button
            type="button"
            className={
              activeTab ===
              "gigs"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              changeTab(
                "gigs"
              )
            }
          >
            Services
          </button>


          <button
            type="button"
            className={
              activeTab ===
              "bookings"
                ? "admin-nav-link active"
                : "admin-nav-link"
            }
            onClick={() =>
              changeTab(
                "bookings"
              )
            }
          >
            Bookings
          </button>

        </div>


        <div className="admin-nav-right">

          <span className="admin-role-badge">

            <ShieldCheck
              size={14}
            />

            Administrator

          </span>


          <div className="admin-profile">

            <span className="admin-profile-avatar">
              {getInitials(
                user.name
              )}
            </span>


            <div>

              <strong>
                {user.name ||
                  "Admin"}
              </strong>

              <span>
                Platform admin
              </span>

            </div>

          </div>


          <button
            type="button"
            className="admin-logout"
            onClick={
              logout
            }
            aria-label="Logout"
          >
            <LogOut
              size={17}
            />
          </button>

        </div>

      </nav>


      {/* =================================================
          MAIN
          ================================================= */}

      <main className="admin-shell">

        {/* HERO */}

        <motion.section
          className="admin-hero"

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

          <div className="admin-hero-main">

            <div className="admin-hero-label">

              <span />

              ADMIN / CONTROL CENTRE

            </div>


            <h1>
              See the platform.

              <span>
                Control the details.
              </span>
            </h1>


            <p>
              Welcome back,{" "}
              {user.name || "Admin"}.
              Monitor users, marketplace activity,
              bookings and financial transactions
              from one secure administrative view.
            </p>

          </div>


          <div className="admin-hero-side">

            <div className="admin-system-status">

              <span />

              Platform operational

            </div>


            <div className="admin-security-card">

              <ShieldCheck
                size={19}
              />

              <div>
                <span>
                  ACCESS LEVEL
                </span>

                <strong>
                  Administrator
                </strong>
              </div>

            </div>

          </div>

        </motion.section>


        {/* ERROR */}

        {error && (

          <div className="login-error admin-error">
            {error}
          </div>

        )}


        {/* =================================================
            PLATFORM METRICS
            ================================================= */}

        {loading ? (

          <div className="admin-loading">

            <div />
            <div />
            <div />

            <p>
              Loading platform data...
            </p>

          </div>

        ) : (

          <>

            <section className="admin-performance-strip">

              <div className="admin-performance-item">

                <span>
                  01
                </span>

                <div>
                  <strong>
                    {summary.users
                      .toString()
                      .padStart(
                        2,
                        "0"
                      )}
                  </strong>

                  <p>
                    Platform users
                  </p>
                </div>

              </div>


              <div className="admin-performance-item">

                <span>
                  02
                </span>

                <div>
                  <strong>
                    {summary.gigs
                      .toString()
                      .padStart(
                        2,
                        "0"
                      )}
                  </strong>

                  <p>
                    Marketplace services
                  </p>
                </div>

              </div>


              <div className="admin-performance-item">

                <span>
                  03
                </span>

                <div>
                  <strong>
                    {summary.bookings
                      .toString()
                      .padStart(
                        2,
                        "0"
                      )}
                  </strong>

                  <p>
                    Platform bookings
                  </p>
                </div>

              </div>


              <div className="admin-performance-item admin-performance-money">

                <span>
                  04
                </span>

                <div>
                  <strong>
                    R
                    {formatCurrency(
                      transactionSummary
                        .completedValue
                    )}
                  </strong>

                  <p>
                    Completed value
                  </p>
                </div>

              </div>

            </section>


            {/* =============================================
                MANAGEMENT
                ============================================= */}

            <section className="admin-management">

              <div className="admin-section-heading">

                <div>

                  <p className="admin-eyebrow">
                    PLATFORM MANAGEMENT
                  </p>


                  <h2>
                    Control centre.
                    <span>
                      Everything connected.
                    </span>
                  </h2>

                </div>


                <span>
                  Secure administrative view
                </span>

              </div>


              {/* TABS */}

              <div className="admin-tabs">

                <button
                  type="button"
                  className={
                    activeTab ===
                    "overview"
                      ? "admin-tab active"
                      : "admin-tab"
                  }
                  onClick={() =>
                    changeTab(
                      "overview"
                    )
                  }
                >
                  <LayoutDashboard
                    size={16}
                  />

                  Overview
                </button>


                <button
                  type="button"
                  className={
                    activeTab ===
                    "users"
                      ? "admin-tab active"
                      : "admin-tab"
                  }
                  onClick={() =>
                    changeTab(
                      "users"
                    )
                  }
                >
                  <Users size={16} />

                  Users
                </button>


                <button
                  type="button"
                  className={
                    activeTab ===
                    "gigs"
                      ? "admin-tab active"
                      : "admin-tab"
                  }
                  onClick={() =>
                    changeTab(
                      "gigs"
                    )
                  }
                >
                  <BriefcaseBusiness
                    size={16}
                  />

                  Services
                </button>


                <button
                  type="button"
                  className={
                    activeTab ===
                    "bookings"
                      ? "admin-tab active"
                      : "admin-tab"
                  }
                  onClick={() =>
                    changeTab(
                      "bookings"
                    )
                  }
                >
                  <CalendarCheck2
                    size={16}
                  />

                  Bookings
                </button>


                <button
                  type="button"
                  className={
                    activeTab ===
                    "transactions"
                      ? "admin-tab active"
                      : "admin-tab"
                  }
                  onClick={() =>
                    changeTab(
                      "transactions"
                    )
                  }
                >
                  <ReceiptText
                    size={16}
                  />

                  Transactions
                </button>

              </div>


              {/* ===========================================
                  OVERVIEW
                  =========================================== */}

              {activeTab ===
                "overview" && (

                <div className="admin-overview">

                  <div className="admin-overview-grid">

                    <article className="admin-overview-card">

                      <span>
                        01 / USERS
                      </span>


                      <strong>
                        {summary.clients}
                      </strong>


                      <h3>
                        Clients
                      </h3>


                      <p>
                        {
                          summary
                            .freelancers
                        }{" "}
                        registered freelancers
                        support the current
                        marketplace.
                      </p>

                    </article>


                    <article className="admin-overview-card">

                      <span>
                        02 / MARKETPLACE
                      </span>


                      <strong>
                        {summary.gigs}
                      </strong>


                      <h3>
                        Services
                      </h3>


                      <p>
                        {
                          summary.bookings
                        }{" "}
                        bookings have been
                        recorded across
                        HustleHub.
                      </p>

                    </article>


                    <article className="admin-overview-card admin-overview-highlight">

                      <span>
                        03 / VALUE
                      </span>


                      <strong>
                        R
                        {formatCurrency(
                          transactionSummary
                            .completedValue
                        )}
                      </strong>


                      <h3>
                        Completed value
                      </h3>


                      <p>
                        {
                          transactionSummary
                            .completedCount
                        }{" "}
                        completed marketplace
                        transactions.
                      </p>

                    </article>


                    <article className="admin-overview-card">

                      <span>
                        04 / REFUNDS
                      </span>


                      <strong>
                        R
                        {formatCurrency(
                          transactionSummary
                            .refundedValue
                        )}
                      </strong>


                      <h3>
                        Refunded value
                      </h3>


                      <p>
                        {
                          transactionSummary
                            .refundedCount
                        }{" "}
                        transactions have been
                        refunded.
                      </p>

                    </article>


                    <article className="admin-overview-card">

                      <span>
                        05 / ACTIVE
                      </span>


                      <strong>
                        {
                          confirmedBookings
                        }
                      </strong>


                      <h3>
                        Active bookings
                      </h3>


                      <p>
                        Confirmed bookings
                        currently active on
                        the platform.
                      </p>

                    </article>


                    <article className="admin-overview-card">

                      <span>
                        06 / CANCELLED
                      </span>


                      <strong>
                        {
                          cancelledBookings
                        }
                      </strong>


                      <h3>
                        Cancelled bookings
                      </h3>


                      <p>
                        Cancellation history
                        remains available for
                        auditing and platform
                        transparency.
                      </p>

                    </article>

                  </div>


                  {/* PLATFORM DISTRIBUTION */}

                  <div className="admin-platform-breakdown">

                    <div>

                      <p className="admin-eyebrow">
                        USER DISTRIBUTION
                      </p>


                      <h3>
                        Platform community
                      </h3>

                    </div>


                    <div className="admin-distribution-bars">

                      <div className="admin-distribution-row">

                        <span>
                          Clients
                        </span>


                        <div>
                          <span
                            style={{
                              width:
                                summary.users > 0
                                  ? `${Math.max(
                                      (
                                        summary.clients /
                                        summary.users
                                      ) *
                                        100,
                                      4
                                    )}%`
                                  : "4%"
                            }}
                          />
                        </div>


                        <strong>
                          {summary.clients}
                        </strong>

                      </div>


                      <div className="admin-distribution-row">

                        <span>
                          Freelancers
                        </span>


                        <div>
                          <span
                            style={{
                              width:
                                summary.users > 0
                                  ? `${Math.max(
                                      (
                                        summary.freelancers /
                                        summary.users
                                      ) *
                                        100,
                                      4
                                    )}%`
                                  : "4%"
                            }}
                          />
                        </div>


                        <strong>
                          {
                            summary
                              .freelancers
                          }
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              )}


              {/* ===========================================
                  SEARCH TOOLBAR
                  =========================================== */}

              {activeTab !==
                "overview" && (

                <div className="admin-table-toolbar">

                  <div>

                    <span className="admin-table-label">
                      {activeTab
                        .toUpperCase()}
                    </span>

                  </div>


                  <div className="admin-search">

                    <Search
                      size={17}
                    />

                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={
                        searchTerm
                      }
                      onChange={(
                        event
                      ) =>
                        setSearchTerm(
                          event
                            .target
                            .value
                        )
                      }
                    />

                  </div>

                </div>

              )}


              {/* ===========================================
                  USERS
                  =========================================== */}

              {activeTab ===
                "users" && (

                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>

                      <tr>
                        <th>
                          Name
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Role
                        </th>

                        <th>
                          Joined
                        </th>
                      </tr>

                    </thead>


                    <tbody>

                      {filteredUsers.map(
                        (
                          account
                        ) => (

                          <tr
                            key={
                              account._id
                            }
                          >

                            <td>

                              <div className="admin-user-cell">

                                <span className="admin-user-avatar">
                                  {getInitials(
                                    account.name
                                  )}
                                </span>


                                <strong>
                                  {
                                    account.name
                                  }
                                </strong>

                              </div>

                            </td>


                            <td>
                              {
                                account.email
                              }
                            </td>


                            <td>

                              <span
                                className={`admin-role-tag ${account.role}`}
                              >
                                {
                                  account.role
                                }
                              </span>

                            </td>


                            <td>
                              {formatDate(
                                account
                                  .createdAt
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>


                  {filteredUsers.length ===
                    0 && (

                    <div className="admin-empty-table">

                      <Users
                        size={25}
                      />

                      <strong>
                        No users found.
                      </strong>

                      <span>
                        Try another search.
                      </span>

                    </div>

                  )}

                </div>

              )}


              {/* ===========================================
                  GIGS
                  =========================================== */}

              {activeTab ===
                "gigs" && (

                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>

                      <tr>
                        <th>
                          Service
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Freelancer
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Available
                        </th>
                      </tr>

                    </thead>


                    <tbody>

                      {filteredGigs.map(
                        (gig) => (

                          <tr
                            key={
                              gig._id
                            }
                          >

                            <td>

                              <strong>
                                {
                                  gig.title
                                }
                              </strong>

                            </td>


                            <td>
                              {
                                gig.category
                              }
                            </td>


                            <td>

                              <strong>
                                {gig
                                  .freelancer
                                  ?.name ||
                                  "Freelancer"}
                              </strong>

                              <small>
                                {gig
                                  .freelancer
                                  ?.email ||
                                  ""}
                              </small>

                            </td>


                            <td className="admin-money">
                              R
                              {formatCurrency(
                                gig.price
                              )}
                            </td>


                            <td>

                              <span
                                className={
                                  gig.isAvailable
                                    ? "admin-status active"
                                    : "admin-status inactive"
                                }
                              >
                                {gig.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>


                  {filteredGigs.length ===
                    0 && (

                    <div className="admin-empty-table">

                      <BriefcaseBusiness
                        size={25}
                      />

                      <strong>
                        No services found.
                      </strong>

                      <span>
                        Try another search.
                      </span>

                    </div>

                  )}

                </div>

              )}


              {/* ===========================================
                  BOOKINGS
                  =========================================== */}

              {activeTab ===
                "bookings" && (

                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>

                      <tr>
                        <th>
                          Service
                        </th>

                        <th>
                          Client
                        </th>

                        <th>
                          Freelancer
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Date
                        </th>
                      </tr>

                    </thead>


                    <tbody>

                      {filteredBookings.map(
                        (
                          booking
                        ) => (

                          <tr
                            key={
                              booking._id
                            }
                          >

                            <td>

                              <strong>
                                {booking
                                  .gig
                                  ?.title ||
                                  booking
                                    .gigTitle ||
                                  "Deleted gig"}
                              </strong>


                              <small>
                                {booking
                                  .gig
                                  ?.category ||
                                  booking
                                    .gigCategory ||
                                  ""}
                              </small>

                            </td>


                            <td>
                              {booking
                                .client
                                ?.name ||
                                "Client"}
                            </td>


                            <td>
                              {booking
                                .freelancer
                                ?.name ||
                                "Freelancer"}
                            </td>


                            <td>

                              <span
                                className={`admin-status ${booking.status}`}
                              >
                                {
                                  booking.status
                                }
                              </span>


                              {booking.status ===
                                "cancelled" &&
                                booking
                                  .cancelledBy && (

                                <small className="admin-cancel-info">
                                  by{" "}
                                  {
                                    booking
                                      .cancelledBy
                                  }
                                </small>

                              )}

                            </td>


                            <td className="admin-money">
                              R
                              {formatCurrency(
                                booking
                                  .agreedPrice ||
                                booking.amount
                              )}
                            </td>


                            <td>
                              {formatDate(
                                booking
                                  .createdAt
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>


                  {filteredBookings.length ===
                    0 && (

                    <div className="admin-empty-table">

                      <CalendarCheck2
                        size={25}
                      />

                      <strong>
                        No bookings found.
                      </strong>

                      <span>
                        Try another search.
                      </span>

                    </div>

                  )}

                </div>

              )}


              {/* ===========================================
                  TRANSACTIONS
                  =========================================== */}

              {activeTab ===
                "transactions" && (

                <div>

                  <div className="admin-transaction-summary">

                    <div>

                      <CheckCircle2
                        size={19}
                      />

                      <span>
                        Completed
                      </span>

                      <strong>
                        {
                          transactionSummary
                            .completedCount
                        }
                      </strong>

                    </div>


                    <div>

                      <CircleDollarSign
                        size={19}
                      />

                      <span>
                        Completed value
                      </span>

                      <strong>
                        R
                        {formatCurrency(
                          transactionSummary
                            .completedValue
                        )}
                      </strong>

                    </div>


                    <div>

                      <RotateCcw
                        size={19}
                      />

                      <span>
                        Refunds
                      </span>

                      <strong>
                        {
                          transactionSummary
                            .refundedCount
                        }
                      </strong>

                    </div>


                    <div>

                      <RotateCcw
                        size={19}
                      />

                      <span>
                        Refunded value
                      </span>

                      <strong>
                        R
                        {formatCurrency(
                          transactionSummary
                            .refundedValue
                        )}
                      </strong>

                    </div>

                  </div>


                  <div className="admin-table-wrapper">

                    <table className="admin-table">

                      <thead>

                        <tr>
                          <th>
                            Service
                          </th>

                          <th>
                            Client
                          </th>

                          <th>
                            Freelancer
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Amount
                          </th>

                          <th>
                            Date
                          </th>
                        </tr>

                      </thead>


                      <tbody>

                        {filteredTransactions.map(
                          (
                            transaction
                          ) => (

                            <tr
                              key={
                                transaction._id
                              }
                            >

                              <td>

                                <strong>
                                  {transaction
                                    .gig
                                    ?.title ||
                                    transaction
                                      .gigTitle ||
                                    "Deleted gig"}
                                </strong>


                                <small>
                                  {transaction
                                    .gig
                                    ?.category ||
                                    transaction
                                      .gigCategory ||
                                    ""}
                                </small>

                              </td>


                              <td>
                                {transaction
                                  .client
                                  ?.name ||
                                  "Client"}
                              </td>


                              <td>
                                {transaction
                                  .freelancer
                                  ?.name ||
                                  "Freelancer"}
                              </td>


                              <td>

                                <span
                                  className={`admin-status ${transaction.status}`}
                                >
                                  {
                                    transaction
                                      .status
                                  }
                                </span>

                              </td>


                              <td className="admin-money">
                                R
                                {formatCurrency(
                                  transaction
                                    .amount
                                )}
                              </td>


                              <td>
                                {formatDate(
                                  transaction
                                    .createdAt
                                )}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>


                    {filteredTransactions
                      .length === 0 && (

                      <div className="admin-empty-table">

                        <ReceiptText
                          size={25}
                        />

                        <strong>
                          No transactions found.
                        </strong>

                        <span>
                          Try another search.
                        </span>

                      </div>

                    )}

                  </div>

                </div>

              )}

            </section>

          </>

        )}

      </main>

    </div>
  );
}


export default AdminDashboard;