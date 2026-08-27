const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

module.exports.getSignUp = (req, res) => {
    res.render("./user/signup.ejs");
};

module.exports.postSignUp = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        const user1 = new User({ username, email });
        let registeredUser = await User.register(user1, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/user/signup");
    }
};

module.exports.getLogin = (req, res) => {
    res.render("./user/login.ejs");
};

module.exports.postLogin = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl2 = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl2);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You logged out successfully");
        res.redirect("/listings");
    });
};

// User Profile Dashboard
module.exports.getProfile = async (req, res) => {
    const userId = req.user._id;
    
    // 1. Fetch User with populated wishlist
    const user = await User.findById(userId).populate("wishlist");
    
    // 2. Fetch User's bookings
    const bookings = await Booking.find({ user: userId }).populate("listing").sort({ createdAt: -1 });
    
    // 3. Fetch User's hosted listings
    const hostedListings = await Listing.find({ owner: userId });

    res.render("./user/profile.ejs", { user, bookings, hostedListings });
};

// Wishlist Toggle API
module.exports.toggleWishlist = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Please log in to save to wishlist" });
    }
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(id);
    let saved = false;
    if (index === -1) {
        user.wishlist.push(id);
        saved = true;
    } else {
        user.wishlist.splice(index, 1);
        saved = false;
    }
    await user.save();
    res.json({ success: true, saved, count: user.wishlist.length });
};

// Booking Creation API
module.exports.createBooking = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Please log in to make a reservation" });
    }
    const { id } = req.params;
    const { checkIn, checkOut, guests, totalPrice } = req.body;
    
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: checkIn || "2026-09-01",
        checkOut: checkOut || "2026-09-04",
        guests: guests || "2 Guests",
        totalPrice: Number(totalPrice) || (listing.price * 3 + 2050)
    });

    await newBooking.save();
    res.json({ 
        success: true, 
        message: "Booking confirmed successfully!", 
        bookingId: newBooking.bookingId 
    });
};

// Cancel Booking API
module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id, user: req.user._id });
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/user/profile");
    }
    booking.status = "Cancelled";
    await booking.save();
    req.flash("success", "Reservation cancelled successfully");
    res.redirect("/user/profile");
};
