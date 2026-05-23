const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema}=require("../schema.js");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })


 
router.route("/")
    // show all listing route index route.
    .get(wrapAsync(listingController.index))
    // post new listing route
    .post(isLoggedIn,validateListing,upload.single('listing[image][url]'), wrapAsync(listingController.postNewform));
    
// add new listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);
// post route in router.route


router.route("/:id")
    // show individual route 
    .get( wrapAsync(listingController.showListing))
    // delete route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



// edit route
router.route("/:id/edit")
    .get(isLoggedIn,isOwner, wrapAsync(listingController.getEditForm))
    .put(isLoggedIn,isOwner,validateListing,upload.single('listing[image][url]') , wrapAsync(listingController.postEditForm));

module.exports=router;