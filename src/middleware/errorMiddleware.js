const logger = require("../utils/logger");


// =========================================================
// CENTRAL ERROR HANDLER
// =========================================================

const errorHandler = (
    err,
    req,
    res,
    _next
) => {

    // Log every unexpected application error
    logger.error(
        "Central error handler",
        {
            event:
                "APPLICATION_ERROR",

            method:
                req.method,

            route:
                req.originalUrl,

            message:
                err.message,

            statusCode:
                err.statusCode ||
                err.status ||
                500,

            userId:
                req.user?.userId ||
                null,

            ip:
                req.ip,

            stack:
                err.stack
        }
    );


    // =====================================================
    // MALFORMED JSON
    // =====================================================

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res
            .status(400)
            .json({
                success: false,

                message:
                    "Malformed JSON request body."
            });
    }


    // =====================================================
    // DUPLICATE DATABASE VALUE
    // =====================================================

    if (
        err.code === 11000
    ) {
        return res
            .status(409)
            .json({
                success: false,

                message:
                    "A record with that value already exists."
            });
    }


    // =====================================================
    // INVALID MONGOOSE OBJECT ID
    // =====================================================

    if (
        err.name ===
        "CastError"
    ) {
        return res
            .status(400)
            .json({
                success: false,

                message:
                    "Invalid resource identifier."
            });
    }


    // =====================================================
    // MONGOOSE VALIDATION ERROR
    // =====================================================

    if (
        err.name ===
        "ValidationError"
    ) {
        return res
            .status(400)
            .json({
                success: false,

                message:
                    "Database validation failed."
            });
    }


    // =====================================================
    // CORS ERROR
    // =====================================================

    if (
        err.message ===
        "CORS policy does not allow this origin."
    ) {
        return res
            .status(403)
            .json({
                success: false,

                message:
                    "This origin is not allowed to access the API."
            });
    }


    // =====================================================
    // GENERAL APPLICATION ERRORS
    // =====================================================

    const statusCode =
        err.statusCode ||
        err.status ||
        500;


    const message =
        statusCode >= 500
            ? "Internal server error."
            : err.message ||
              "An unexpected error occurred.";


    return res
        .status(statusCode)
        .json({
            success: false,

            message
        });
};


module.exports =
    errorHandler;