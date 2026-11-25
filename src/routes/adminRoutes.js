const express =
    require("express");

const {
    getAdminSummary,
    getAllUsers,
    getAllGigs,
    getAllBookings,
    getAllTransactions
} = require(
    "../controllers/adminController"
);

const {
    protect
} = require(
    "../middleware/authMiddleware"
);

const {
    authorizeRoles
} = require(
    "../middleware/roleMiddleware"
);


const router =
    express.Router();


// All admin routes require authentication and admin role
router.use(
    protect,
    authorizeRoles("admin")
);


// Dashboard summary
router.get(
    "/summary",
    getAdminSummary
);


// User management data
router.get(
    "/users",
    getAllUsers
);


// Gig management data
router.get(
    "/gigs",
    getAllGigs
);


// Booking management data
router.get(
    "/bookings",
    getAllBookings
);


// Transaction management data
router.get(
    "/transactions",
    getAllTransactions
);


module.exports =
    router;