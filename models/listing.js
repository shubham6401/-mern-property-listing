const mongoose = require("mongoose");
const Review = require("./review");
let listingSchema = new mongoose.Schema({
    title: {
        type: String,
        requred:true,
    },
    description: {
        type: String,
    },
    image: {
        filename:String,
        url:String
        
    },
    price: {
        type: Number,
    }, location: {
        type: String,
    }, country: {
        type: String,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
             ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }

});
// middleware for deleting all reviews if any listing is deleted
listingSchema.post("findOneAndDelete",async (data)=>{
    if(data.reviews.length){
        await Review.deleteMany({_id:{$in:data.reviews}});
    }
})
let Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;