const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userContoller=require("../controllers/user.js");


// signup route
router.route("/signup")
    .get(userContoller.getSignUp)
    .post(wrapAsync(userContoller.postSignUp));

// login route
router.route("/login")
    .get(userContoller.getLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/user/login", failureFlash: true }), userContoller.postLogin);

// logout
router.get("/logout",userContoller.logout);


module.exports = router;