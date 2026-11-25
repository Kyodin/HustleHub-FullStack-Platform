const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true
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

        gig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gig",
            required: true
        },

        // Historical snapshot of the gig.
        // These values remain available even if the original
        // gig is deleted later.
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

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "completed",
                "refunded"
            ],
            default: "completed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);