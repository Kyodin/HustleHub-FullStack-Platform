const {
    body,
    validationResult
} = require("express-validator");


// =========================================================
// TEXT SANITIZER
// =========================================================

const sanitizeText = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    return value
        .replace(/\0/g, "")
        .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .trim();
};


// =========================================================
// GIG VALIDATION
// =========================================================

const validateGig = [

    // -----------------------------------------------------
    // REJECT UNEXPECTED FIELDS
    // -----------------------------------------------------

    body().custom((value, { req }) => {
        const allowedFields = [
            "title",
            "description",
            "category",
            "price",
            "isAvailable"
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
    // TITLE
    // -----------------------------------------------------

    body("title")
        .exists({ values: "falsy" })
        .withMessage("Title is required.")
        .bail()

        .isString()
        .withMessage("Title must be text.")
        .bail()

        .customSanitizer(sanitizeText)

        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Title must be between 2 and 100 characters."
        ),


    // -----------------------------------------------------
    // DESCRIPTION
    // -----------------------------------------------------

    body("description")
        .exists({ values: "falsy" })
        .withMessage("Description is required.")
        .bail()

        .isString()
        .withMessage("Description must be text.")
        .bail()

        .customSanitizer(sanitizeText)

        .isLength({
            min: 5,
            max: 1000
        })
        .withMessage(
            "Description must be between 5 and 1000 characters."
        ),


    // -----------------------------------------------------
    // CATEGORY
    // -----------------------------------------------------

    body("category")
        .exists({ values: "falsy" })
        .withMessage("Category is required.")
        .bail()

        .isString()
        .withMessage("Category must be text.")
        .bail()

        .customSanitizer(sanitizeText)

        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Category must be between 2 and 100 characters."
        ),


    // -----------------------------------------------------
    // PRICE
    // -----------------------------------------------------

    body("price")
        .exists()
        .withMessage("Price is required.")
        .bail()

        .isFloat({
            min: 0
        })
        .withMessage(
            "Price must be a number greater than or equal to 0."
        )

        .toFloat(),


    // -----------------------------------------------------
    // AVAILABILITY
    // -----------------------------------------------------

    body("isAvailable")
        .optional()

        .isBoolean()
        .withMessage(
            "isAvailable must be true or false."
        )

        .toBoolean(),


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

                errors:
                    errors.array().map(
                        (error) => ({
                            field:
                                error.path ||
                                "body",

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
    validateGig
};