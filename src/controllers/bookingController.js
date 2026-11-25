const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Gig = require("../models/Gig");
const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");

const {
    validationResult
} = require("express-validator");


// =========================================================
// CLIENT CREATES A BOOKING
// =========================================================

const createBooking = async (
    req,
    res,
    next
) => {
    const session =
        await mongoose.startSession();

    try {
        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            await session.endSession();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: errors.array()
            });
        }

        const {
            gigId
        } = req.body;

        let createdBookingId;


        // Booking and transaction are created together
        await session.withTransaction(
            async () => {
                const gig =
                    await Gig.findById(
                        gigId
                    ).session(session);


                if (!gig) {
                    const error =
                        new Error(
                            "Gig not found."
                        );

                    error.statusCode = 404;

                    throw error;
                }


                if (!gig.isAvailable) {
                    const error =
                        new Error(
                            "This gig is currently unavailable."
                        );

                    error.statusCode = 400;

                    throw error;
                }


                const existingBooking =
                    await Booking.findOne({
                        gig:
                            gig._id,

                        client:
                            req.user.userId,

                        status: {
                            $ne: "cancelled"
                        }
                    }).session(session);


                if (existingBooking) {
                    const error =
                        new Error(
                            "You have already booked this gig."
                        );

                    error.statusCode = 409;

                    throw error;
                }


                const bookings =
                    await Booking.create(
                        [
                            {
                                gig:
                                    gig._id,

                                gigTitle:
                                    gig.title,

                                gigCategory:
                                    gig.category,

                                agreedPrice:
                                    gig.price,

                                client:
                                    req.user.userId,

                                freelancer:
                                    gig.freelancer,

                                amount:
                                    gig.price,

                                status:
                                    "confirmed"
                            }
                        ],
                        {
                            session
                        }
                    );


                const booking =
                    bookings[0];


                createdBookingId =
                    booking._id;


                await Transaction.create(
                    [
                        {
                            booking:
                                booking._id,

                            client:
                                req.user.userId,

                            freelancer:
                                gig.freelancer,

                            gig:
                                gig._id,

                            gigTitle:
                                gig.title,

                            gigCategory:
                                gig.category,

                            amount:
                                gig.price,

                            status:
                                "completed"
                        }
                    ],
                    {
                        session
                    }
                );
            }
        );


        const populatedBooking =
            await Booking.findById(
                createdBookingId
            )
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
                );


        await session.endSession();


        logger.info(
            "Booking created",
            {
                event:
                    "BOOKING_CREATED",

                bookingId:
                    populatedBooking._id.toString(),

                clientId:
                    req.user.userId,

                freelancerId:
                    populatedBooking
                        .freelancer?._id
                        ?.toString() ||
                    populatedBooking
                        .freelancer
                        ?.toString(),

                gigId:
                    populatedBooking
                        .gig?._id
                        ?.toString() ||
                    populatedBooking
                        .gig
                        ?.toString(),

                amount:
                    populatedBooking.amount,

                ip:
                    req.ip
            }
        );


        return res.status(201).json({
            success: true,

            message:
                "Booking created successfully.",

            booking:
                populatedBooking
        });

    } catch (error) {
        await session.endSession();


        if (error.statusCode) {
            return res
                .status(
                    error.statusCode
                )
                .json({
                    success: false,

                    message:
                        error.message
                });
        }


        logger.error(
            "Booking creation failed",
            {
                event:
                    "BOOKING_CREATE_ERROR",

                clientId:
                    req.user?.userId ||
                    null,

                message:
                    error.message,

                ip:
                    req.ip
            }
        );


        next(error);
    }
};


// =========================================================
// CLIENT VIEWS OWN BOOKINGS
// =========================================================

const getMyBookings = async (
    req,
    res,
    next
) => {
    try {
        const bookings =
            await Booking.find({
                client:
                    req.user.userId
            })
                .populate(
                    "gig",
                    "title category price"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            success: true,

            count:
                bookings.length,

            bookings
        });

    } catch (error) {
        logger.error(
            "Failed to retrieve client bookings",
            {
                event:
                    "CLIENT_BOOKINGS_ERROR",

                clientId:
                    req.user?.userId ||
                    null,

                message:
                    error.message,

                ip:
                    req.ip
            }
        );


        next(error);
    }
};


// =========================================================
// FREELANCER VIEWS RECEIVED BOOKINGS
// =========================================================

const getFreelancerBookings =
    async (
        req,
        res,
        next
    ) => {
        try {
            const bookings =
                await Booking.find({
                    freelancer:
                        req.user.userId
                })
                    .populate(
                        "gig",
                        "title category price"
                    )
                    .populate(
                        "client",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({
                success: true,

                count:
                    bookings.length,

                bookings
            });

        } catch (error) {
            logger.error(
                "Failed to retrieve freelancer bookings",
                {
                    event:
                        "FREELANCER_BOOKINGS_ERROR",

                    freelancerId:
                        req.user?.userId ||
                        null,

                    message:
                        error.message,

                    ip:
                        req.ip
                }
            );


            next(error);
        }
    };


// =========================================================
// FREELANCER CANCELS BOOKING
// =========================================================

const cancelFreelancerBooking =
    async (
        req,
        res,
        next
    ) => {
        const session =
            await mongoose.startSession();

        try {
            const {
                reason
            } = req.body;


            if (
                reason &&
                (
                    typeof reason !==
                        "string" ||
                    reason.trim().length >
                        250
                )
            ) {
                await session.endSession();


                return res.status(400).json({
                    success: false,

                    message:
                        "Cancellation reason must be 250 characters or less."
                });
            }


            let cancelledBookingId;


            await session.withTransaction(
                async () => {

                    const booking =
                        await Booking.findOne({
                            _id:
                                req.params.id,

                            freelancer:
                                req.user.userId
                        }).session(session);


                    if (!booking) {
                        const error =
                            new Error(
                                "Booking not found."
                            );

                        error.statusCode = 404;

                        throw error;
                    }


                    if (
                        booking.status ===
                        "cancelled"
                    ) {
                        const error =
                            new Error(
                                "Booking is already cancelled."
                            );

                        error.statusCode = 400;

                        throw error;
                    }


                    if (
                        booking.status ===
                        "completed"
                    ) {
                        const error =
                            new Error(
                                "A completed booking cannot be cancelled."
                            );

                        error.statusCode = 400;

                        throw error;
                    }


                    /*
                     * IMPORTANT:
                     *
                     * We use updateOne instead of booking.save().
                     *
                     * Some older booking records were created
                     * before gigTitle, gigCategory and agreedPrice
                     * became required fields.
                     *
                     * booking.save() validates the entire old
                     * document and therefore fails.
                     *
                     * updateOne only updates the cancellation
                     * fields and safely supports those legacy
                     * bookings.
                     */

                    await Booking.updateOne(
                        {
                            _id:
                                booking._id
                        },
                        {
                            $set: {
                                status:
                                    "cancelled",

                                cancelledBy:
                                    "freelancer",

                                cancelledAt:
                                    new Date(),

                                cancellationReason:
                                    reason
                                        ? reason.trim()
                                        : "Cancelled by freelancer."
                            }
                        },
                        {
                            session,
                            runValidators: true
                        }
                    );


                    // Mark related payment as refunded
                    await Transaction.findOneAndUpdate(
                        {
                            booking:
                                booking._id
                        },
                        {
                            $set: {
                                status:
                                    "refunded"
                            }
                        },
                        {
                            session,
                            runValidators: true
                        }
                    );


                    cancelledBookingId =
                        booking._id;
                }
            );


            const cancelledBooking =
                await Booking.findById(
                    cancelledBookingId
                )
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
                    );


            await session.endSession();


            logger.warn(
                "Booking cancelled by freelancer",
                {
                    event:
                        "BOOKING_CANCELLED",

                    bookingId:
                        cancelledBooking
                            ._id
                            .toString(),

                    freelancerId:
                        req.user.userId,

                    clientId:
                        cancelledBooking
                            .client?._id
                            ?.toString() ||
                        cancelledBooking
                            .client
                            ?.toString(),

                    amount:
                        cancelledBooking.amount,

                    cancellationReason:
                        cancelledBooking
                            .cancellationReason,

                    ip:
                        req.ip
                }
            );


            logger.info(
                "Transaction refunded",
                {
                    event:
                        "TRANSACTION_REFUNDED",

                    bookingId:
                        cancelledBooking
                            ._id
                            .toString(),

                    amount:
                        cancelledBooking.amount,

                    freelancerId:
                        req.user.userId
                }
            );


            return res.status(200).json({
                success: true,

                message:
                    "Booking cancelled successfully.",

                booking:
                    cancelledBooking
            });

        } catch (error) {
            await session.endSession();


            if (error.statusCode) {
                return res
                    .status(
                        error.statusCode
                    )
                    .json({
                        success: false,

                        message:
                            error.message
                    });
            }


            logger.error(
                "Booking cancellation failed",
                {
                    event:
                        "BOOKING_CANCEL_ERROR",

                    bookingId:
                        req.params.id,

                    freelancerId:
                        req.user?.userId ||
                        null,

                    message:
                        error.message,

                    ip:
                        req.ip
                }
            );


            next(error);
        }
    };


// =========================================================
// ADMIN VIEWS ALL BOOKINGS
// =========================================================

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


        return res.status(200).json({
            success: true,

            count:
                bookings.length,

            bookings
        });

    } catch (error) {
        logger.error(
            "Failed to retrieve all bookings",
            {
                event:
                    "ALL_BOOKINGS_ERROR",

                adminId:
                    req.user?.userId ||
                    null,

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
    createBooking,
    getMyBookings,
    getFreelancerBookings,
    cancelFreelancerBooking,
    getAllBookings
};