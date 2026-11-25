const User =
    require("../models/User");

const Gig =
    require("../models/Gig");

const Booking =
    require("../models/Booking");

const Transaction =
    require("../models/Transaction");

const logger =
    require("../utils/logger");


// Admin dashboard summary
const getAdminSummary = async (
    req,
    res,
    next
) => {
    try {
        const [
            users,
            clients,
            freelancers,
            gigs,
            bookings,
            transactions
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                role: "client"
            }),

            User.countDocuments({
                role: "freelancer"
            }),

            Gig.countDocuments(),

            Booking.countDocuments(),

            Transaction.countDocuments()
        ]);


        logger.info(
            "Admin viewed dashboard summary",
            {
                event:
                    "ADMIN_VIEW_SUMMARY",

                adminId:
                    req.user.userId,

                ip:
                    req.ip
            }
        );


        return res.status(200).json({
            success: true,

            summary: {
                users,
                clients,
                freelancers,
                gigs,
                bookings,
                transactions
            }
        });

    } catch (error) {

        logger.error(
            "Admin summary operation failed",
            {
                event:
                    "ADMIN_OPERATION_ERROR",

                adminId:
                    req.user?.userId || null,

                operation:
                    "summary",

                message:
                    error.message,

                ip:
                    req.ip
            }
        );

        next(error);
    }
};


// Admin views all users
const getAllUsers = async (
    req,
    res,
    next
) => {
    try {
        const users =
            await User.find()
                .select(
                    "-password -failedLoginAttempts -lockUntil"
                )
                .sort({
                    createdAt: -1
                });


        logger.info(
            "Admin viewed users",
            {
                event:
                    "ADMIN_VIEW_USERS",

                adminId:
                    req.user.userId,

                resultCount:
                    users.length,

                ip:
                    req.ip
            }
        );


        return res.status(200).json({
            success: true,

            count:
                users.length,

            users
        });

    } catch (error) {

        logger.error(
            "Admin users operation failed",
            {
                event:
                    "ADMIN_OPERATION_ERROR",

                adminId:
                    req.user?.userId || null,

                operation:
                    "users",

                message:
                    error.message,

                ip:
                    req.ip
            }
        );

        next(error);
    }
};


// Admin views all gigs
const getAllGigs = async (
    req,
    res,
    next
) => {
    try {
        const gigs =
            await Gig.find()
                .populate(
                    "freelancer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


        logger.info(
            "Admin viewed gigs",
            {
                event:
                    "ADMIN_VIEW_GIGS",

                adminId:
                    req.user.userId,

                resultCount:
                    gigs.length,

                ip:
                    req.ip
            }
        );


        return res.status(200).json({
            success: true,

            count:
                gigs.length,

            gigs
        });

    } catch (error) {

        logger.error(
            "Admin gigs operation failed",
            {
                event:
                    "ADMIN_OPERATION_ERROR",

                adminId:
                    req.user?.userId || null,

                operation:
                    "gigs",

                message:
                    error.message,

                ip:
                    req.ip
            }
        );

        next(error);
    }
};


// Admin views all bookings
const getAllBookings = async (
    req,
    res,
    next
) => {
    try {
        const bookings =
            await Booking.find()
                .populate(
                    "gig",
                    "title category price"
                )
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


        logger.info(
            "Admin viewed bookings",
            {
                event:
                    "ADMIN_VIEW_BOOKINGS",

                adminId:
                    req.user.userId,

                resultCount:
                    bookings.length,

                ip:
                    req.ip
            }
        );


        return res.status(200).json({
            success: true,

            count:
                bookings.length,

            bookings
        });

    } catch (error) {

        logger.error(
            "Admin bookings operation failed",
            {
                event:
                    "ADMIN_OPERATION_ERROR",

                adminId:
                    req.user?.userId || null,

                operation:
                    "bookings",

                message:
                    error.message,

                ip:
                    req.ip
            }
        );

        next(error);
    }
};


// Admin views all transactions
const getAllTransactions = async (
    req,
    res,
    next
) => {
    try {
        const transactions =
            await Transaction.find()
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .populate(
                    "gig",
                    "title category"
                )
                .sort({
                    createdAt: -1
                });


        const completedTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.status ===
                    "completed"
            );


        const refundedTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.status ===
                    "refunded"
            );


        const completedValue =
            completedTransactions.reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount ||
                        0
                    ),
                0
            );


        const refundedValue =
            refundedTransactions.reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount ||
                        0
                    ),
                0
            );


        logger.info(
            "Admin viewed transactions",
            {
                event:
                    "ADMIN_VIEW_TRANSACTIONS",

                adminId:
                    req.user.userId,

                resultCount:
                    transactions.length,

                completedValue,

                refundedValue,

                ip:
                    req.ip
            }
        );


        return res.status(200).json({
            success: true,

            count:
                transactions.length,

            completedCount:
                completedTransactions.length,

            refundedCount:
                refundedTransactions.length,

            completedValue,

            refundedValue,

            transactions
        });

    } catch (error) {

        logger.error(
            "Admin transactions operation failed",
            {
                event:
                    "ADMIN_OPERATION_ERROR",

                adminId:
                    req.user?.userId || null,

                operation:
                    "transactions",

                message:
                    error.message,

                ip:
                    req.ip
            }
        );

        next(error);
    }
};


module.exports = {
    getAdminSummary,
    getAllUsers,
    getAllGigs,
    getAllBookings,
    getAllTransactions
};