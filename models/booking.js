const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: String,
        required: true
    },
    checkOut: {
        type: String,
        required: true
    },
    guests: {
        type: String,
        default: "2 Guests"
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingId: {
        type: String,
        default: () => "WL-" + Math.floor(100000 + Math.random() * 900000)
    },
    status: {
        type: String,
        enum: ["Confirmed", "Cancelled"],
        default: "Confirmed"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
