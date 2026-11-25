const {
    body,
    validationResult
} = require("express-validator");


// =========================================================
// BOOKING VALIDATION
// =========================================================

const validateBooking = [

    // -----------------------------------------------------
    // REJECT UNEXPECTED FIELDS
    // A client only needs to submit the gig ID.
    // Price, freelancer and client details are determined
    // securely by the backend.
    // -----------------------------------------------------
    body().custom((value, { req }) => {
        const allowedFields = [
            "gigId"
        ];

        const unexpectedFields =
            Object.keys(req.body).filter(
                (field) =>
                    !allowedFields.includes(field)
            );

        if (unexpectedFields.length > 0) {
            throw new Error(
                `Unexpected field(s): ${unexpectedFields.join(", ")}`
            );
        }

        return true;
    }),


    // -----------------------------------------------------
    // GIG ID
    // -----------------------------------------------------
    body("gigId")
        .exists({ values: "falsy" })
        .withMessage("Gig ID is required.")
        .bail()

        .isString()
        .withMessage("Gig ID must be text.")
        .bail()

        .isMongoId()
        .withMessage(
            "Gig ID must be a valid MongoDB ID."
        ),


    // -----------------------------------------------------
    // RETURN VALIDATION ERRORS
    // -----------------------------------------------------
    (req, res, next) => {
        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",

                errors: errors.array().map(
                    (error) => ({
                        field:
                            error.path || "body",

                        message:
                            error.msg
                    })
                )
            });
        }

        next();
    }
];


module.exports = {
    validateBooking
};