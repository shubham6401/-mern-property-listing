const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postReview=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    
    let review1=new Review(req.body.review);
    review1.author=res.locals.currUser._id;
    await review1.save();

    listing.reviews.push(review1);
    await listing.save();
    req.flash("success","Review Added Successfully");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let {id,id2}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:id2}});
    await Review.findByIdAndDelete(id2);
    req.flash("success","Review deleted Successfully");
    res.redirect(`/listings/${id}`);
};