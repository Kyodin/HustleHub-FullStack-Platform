const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    registerValidation,
    loginValidation
} = require("../validators/authValidator");

const router = express.Router();


// =========================================================
// REGISTER
// =========================================================

router.post(
    "/register",
    registerValidation,
    registerUser
);


// =========================================================
// LOGIN
// =========================================================

router.post(
    "/login",
    loginValidation,
    loginUser
);


// =========================================================
// PROFILE
// =========================================================

router.get(
    "/profile",
    protect,
    getProfile
);


module.exports = router;
