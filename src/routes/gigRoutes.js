const express = require("express");

const {
    createGig,
    getGigs,
    getMyGigs,
    getGigById,
    updateGig,
    deleteGig
} = require("../controllers/gigController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    validateGig
} = require("../validators/gigValidator");

const {
    validateObjectId
} = require("../middleware/validateObjectId");

const router = express.Router();


// =========================================================
// BROWSE GIGS
// =========================================================

router.get(
    "/",
    protect,
    getGigs
);


// =========================================================
// FREELANCER'S OWN GIGS
// =========================================================

router.get(
    "/mine",
    protect,
    authorizeRoles("freelancer"),
    getMyGigs
);


// =========================================================
// CREATE GIG
// =========================================================

router.post(
    "/",
    protect,
    authorizeRoles("freelancer"),
    validateGig,
    createGig
);


// =========================================================
// GET ONE GIG
// =========================================================

router.get(
    "/:id",
    protect,
    validateObjectId("id"),
    getGigById
);


// =========================================================
// UPDATE OWN GIG
// =========================================================

router.put(
    "/:id",
    protect,
    authorizeRoles("freelancer"),
    validateObjectId("id"),
    validateGig,
    updateGig
);


// =========================================================
// DELETE OWN GIG
// =========================================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("freelancer"),
    validateObjectId("id"),
    deleteGig
);


module.exports = router;