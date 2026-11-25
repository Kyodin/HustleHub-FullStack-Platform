const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/authRoutes");
const gigRoutes = require("./src/routes/gigRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const errorHandler = require("./src/middleware/errorMiddleware");

const app = express();



// BODY PARSING

app.use(
    express.json({
        limit: "1mb"
    })
);

// SECURITY HEADERS

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: [
                    "'self'",
                    "data:"
                ],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"]
            }
        },

        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);


// CORS BODY

const allowedOrigins = [
    process.env.FRONTEND_ORIGIN ||
    "http://localhost:5173"
];


app.use(
    cors({
        origin: (origin, callback) => {

            // Postman and other non-browser clients
           
            if (!origin) {
                return callback(
                    null,
                    true
                );
            }


            if (
                allowedOrigins.includes(origin)
            ) {
                return callback(
                    null,
                    true
                );
            }


            return callback(
                new Error(
                    "CORS policy does not allow this origin."
                )
            );
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// AUTHENTICATION RATE LIMITER

const authLimiter = rateLimit({
    windowMs:
        15 * 60 * 1000,

    max:
        20,

    standardHeaders:
        true,

    legacyHeaders:
        false,

    message: {
        success: false,

        message:
            "Too many authentication attempts. Please try again later."
    }
});



// ROUTES

// Authentication
app.use(
    "/api/auth",
    authLimiter,
    authRoutes
);


// Gigs
app.use(
    "/api/gigs",
    gigRoutes
);


// Bookings
app.use(
    "/api/bookings",
    bookingRoutes
);


// Transactions
app.use(
    "/api/transactions",
    transactionRoutes
);


// Administration
app.use(
    "/api/admin",
    adminRoutes
);

// API ROOT

app.get(
    "/",
    (req, res) => {
        return res
            .status(200)
            .json({
                success: true,
                message:
                    "Welcome to HustleHub API"
            });
    }
);


// UNKNOWN ROUTES

app.use(
    (req, res, next) => {
        const error =
            new Error(
                `Route not found: ${req.method} ${req.originalUrl}`
            );

        error.statusCode = 404;

        next(error);
    }
);


// CENTRAL ERROR HANDLER

app.use(errorHandler);


// EXPORT EXPRESS APP
// Server startup now happens in server.js. not node server

module.exports = app;