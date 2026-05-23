const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log("originalUrl",req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Login first..");
        return res.redirect("/user/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}
// middleware for  validation of listing onwer
module.exports.isOwner=async (req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission...");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
// middleware for  validation of review onwer
module.exports.isReviewOwner=async (req,res,next)=>{
    let {id,id2}=req.params;
    let review=await Review.findById(id2);
    if(res.locals.currUser && !res.locals.currUser._id.equals(review.author._id)){
        req.flash("error","You don't have axcess");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



// middleware for listing validation
module.exports.validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(404,result.error);
    }else next()
}

// middleware for review validation
module.exports.validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error) throw new ExpressError(404,result.error);
    else next();

}