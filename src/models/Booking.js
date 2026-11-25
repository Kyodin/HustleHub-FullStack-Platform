const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        gig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gig",
            required: true
        },

        // Keeps booking history even if the original gig is deleted
        gigTitle: {
            type: String,
            required: true,
            trim: true
        },

        gigCategory: {
            type: String,
            required: true,
            trim: true
        },

        agreedPrice: {
            type: Number,
            required: true,
            min: 0
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "confirmed",
                "completed",
                "cancelled"
            ],
            default: "confirmed"
        },

        cancelledBy: {
            type: String,
            enum: [
                "client",
                "freelancer",
                "admin"
            ],
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        cancellationReason: {
            type: String,
            trim: true,
            maxlength: 250,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);