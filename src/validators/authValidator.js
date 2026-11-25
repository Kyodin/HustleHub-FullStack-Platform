const {
    body,
    validationResult
} = require("express-validator");


// =========================================================
// TEXT SANITIZER
// Removes null/control characters while preserving normal
// names and readable text.
// =========================================================

const sanitizeText = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    return value
        .replace(/\0/g, "")
        .replace(
            /[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
            ""
        )
        .trim();
};


// =========================================================
// BCRYPT PASSWORD LENGTH VALIDATION
// =========================================================
//
// bcrypt only uses the first 72 bytes of a password.
//
// This check prevents passwords longer than 72 UTF-8 bytes
// from being accepted.
//
// Byte length is used instead of character length because
// some characters may require more than one byte.
// =========================================================

const isWithinBcryptLimit = (value) => {
    if (typeof value !== "string") {
        return false;
    }

    return Buffer.byteLength(
        value,
        "utf8"
    ) <= 72;
};


// =========================================================
// SHARED VALIDATION RESULT HANDLER
// =========================================================

const handleValidationErrors = (
    req,
    res,
    next
) => {
    const errors =
        validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array().map(
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
};


// =========================================================
// REGISTER VALIDATION
// =========================================================

const registerValidation = [

    // Reject fields that do not belong in registration
    body().custom(
        (value, { req }) => {

            const allowedFields = [
                "name",
                "email",
                "password",
                "role"
            ];

            const unexpectedFields =
                Object.keys(
                    req.body
                ).filter(
                    (field) =>
                        !allowedFields.includes(
                            field
                        )
                );

            if (
                unexpectedFields.length >
                0
            ) {
                throw new Error(
                    `Unexpected field(s): ${unexpectedFields.join(", ")}`
                );
            }

            return true;
        }
    ),


    // -----------------------------------------------------
    // NAME
    // -----------------------------------------------------

    body("name")
        .exists({
            values: "falsy"
        })
        .withMessage(
            "Name is required."
        )
        .bail()

        .isString()
        .withMessage(
            "Name must be text."
        )
        .bail()

        .customSanitizer(
            sanitizeText
        )

        .isLength({
            min: 2,
            max: 50
        })
        .withMessage(
            "Name must be between 2 and 50 characters."
        ),


    // -----------------------------------------------------
    // EMAIL
    // -----------------------------------------------------

    body("email")
        .exists({
            values: "falsy"
        })
        .withMessage(
            "Email is required."
        )
        .bail()

        .isString()
        .withMessage(
            "Email must be text."
        )
        .bail()

        .trim()

        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        )
        .bail()

        .normalizeEmail(),


    // -----------------------------------------------------
    // PASSWORD
    //
    // Passwords are NOT trimmed or sanitised because doing
    // so would modify the password entered by the user.
    //
    // bcrypt only safely processes the first 72 UTF-8 bytes.
    // -----------------------------------------------------

    body("password")
        .exists({
            values: "falsy"
        })
        .withMessage(
            "Password is required."
        )
        .bail()

        .isString()
        .withMessage(
            "Password must be text."
        )
        .bail()

        .isLength({
            min: 8
        })
        .withMessage(
            "Password must be at least 8 characters long."
        )
        .bail()

        .custom(
            isWithinBcryptLimit
        )
        .withMessage(
            "Password must not exceed 72 bytes."
        )
        .bail()

        .matches(/[A-Z]/)
        .withMessage(
            "Password must contain at least one uppercase letter."
        )
        .bail()

        .matches(/[a-z]/)
        .withMessage(
            "Password must contain at least one lowercase letter."
        )
        .bail()

        .matches(/[0-9]/)
        .withMessage(
            "Password must contain at least one number."
        ),


    // -----------------------------------------------------
    // ROLE
    // -----------------------------------------------------

    body("role")
        .optional()

        .isString()
        .withMessage(
            "Role must be text."
        )
        .bail()

        .customSanitizer(
            sanitizeText
        )

        .isIn([
            "client",
            "freelancer"
        ])
        .withMessage(
            "Role must be either client or freelancer."
        ),


    handleValidationErrors
];


// =========================================================
// LOGIN VALIDATION
// =========================================================

const loginValidation = [

    // Login should contain only email and password
    body().custom(
        (value, { req }) => {

            const allowedFields = [
                "email",
                "password"
            ];

            const unexpectedFields =
                Object.keys(
                    req.body
                ).filter(
                    (field) =>
                        !allowedFields.includes(
                            field
                        )
                );

            if (
                unexpectedFields.length >
                0
            ) {
                throw new Error(
                    `Unexpected field(s): ${unexpectedFields.join(", ")}`
                );
            }

            return true;
        }
    ),


    // -----------------------------------------------------
    // EMAIL
    // -----------------------------------------------------

    body("email")
        .exists({
            values: "falsy"
        })
        .withMessage(
            "Email is required."
        )
        .bail()

        .isString()
        .withMessage(
            "Email must be text."
        )
        .bail()

        .trim()

        .isEmail()
        .withMessage(
            "Please provide a valid email address."
        )
        .bail()

        .normalizeEmail(),


    // -----------------------------------------------------
    // PASSWORD
    //
    // The same bcrypt byte limit is also enforced during
    // login so oversized passwords never reach bcrypt.
    // -----------------------------------------------------

    body("password")
        .exists({
            values: "falsy"
        })
        .withMessage(
            "Password is required."
        )
        .bail()

        .isString()
        .withMessage(
            "Password must be text."
        )
        .bail()

        .custom(
            isWithinBcryptLimit
        )
        .withMessage(
            "Password must not exceed 72 bytes."
        ),


    handleValidationErrors
];


module.exports = {
    registerValidation,
    loginValidation
};
