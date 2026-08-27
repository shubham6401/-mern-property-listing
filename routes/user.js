const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/user.js");

// signup route
router.route("/signup")
    .get(userController.getSignUp)
    .post(wrapAsync(userController.postSignUp));

// login route
router.route("/login")
    .get(userController.getLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), userController.postLogin);

// logout
router.get("/logout", userController.logout);

// User Profile (Protected)
router.get("/profile", isLoggedIn, wrapAsync(userController.getProfile));

// Wishlist toggle endpoint
router.post("/wishlist/:id", wrapAsync(userController.toggleWishlist));

// Booking creation endpoint
router.post("/book/:id", wrapAsync(userController.createBooking));

// Booking cancel endpoint
router.delete("/booking/:id", isLoggedIn, wrapAsync(userController.cancelBooking));

module.exports = router;
