const express = require("express");

const {
    getFreelancerIncome
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Freelancer views own income
router.get(
    "/income",
    protect,
    authorizeRoles("freelancer"),
    getFreelancerIncome
);

module.exports = router;