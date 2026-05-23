const mongoose=require("mongoose");

main().then(()=>console.log("connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const reviewSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    created_At:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

})
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review; 