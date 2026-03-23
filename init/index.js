const initData=require("./data");
const Listing=require("../models/listing");
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/wanderLust')
  .then(() => console.log('Connected!'));
const initDb= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
};
initDb();
