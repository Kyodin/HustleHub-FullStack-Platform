const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    createBooking,
    getMyBookings,
    getFreelancerBookings,
    cancelFreelancerBooking,
    getAllBookings
} = require("../controllers/bookingController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    validateBooking
} = require("../validators/bookingValidator");

const router = express.Router();


// Limit repeated booking attempts
const bookingCreationLimiter =
    rateLimit({
        windowMs:
            15 * 60 * 1000,

        max: 10,

        standardHeaders: true,
        legacyHeaders: false,

        message: {
            success: false,
            message:
                "Too many booking attempts. Please try again later."
        }
    });


// Client creates booking
router.post(
    "/",
    bookingCreationLimiter,
    protect,
    authorizeRoles("client"),
    validateBooking,
    createBooking
);


// Client views their bookings
router.get(
    "/mine",
    protect,
    authorizeRoles("client"),
    getMyBookings
);


// Freelancer views received bookings
router.get(
    "/received",
    protect,
    authorizeRoles("freelancer"),
    getFreelancerBookings
);


// Admin views all bookings
router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    getAllBookings
);


// Freelancer cancels a booking
router.patch(
    "/:id/cancel",
    protect,
    authorizeRoles("freelancer"),
    cancelFreelancerBooking
);


module.exports = router;