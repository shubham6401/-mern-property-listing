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
        // default:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set:(v)=> v==""?"https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :v,
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
    ]
});
let Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;