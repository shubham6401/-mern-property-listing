const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {validateReview}=require("../middleware.js");
const {isLoggedIn,isReviewOwner}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.postReview));

// delete review route
router.delete("/:id2",isLoggedIn,isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports=router;