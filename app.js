const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");

const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");

mongoose.connect('mongodb://127.0.0.1:27017/wanderLust')
    .then(() => console.log('Connected!'));

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

let methodOverride = require('method-override');
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
})

// show all listing route index route
app.get("/listings", async (req, res) => {
    let data = await Listing.find();
    res.render("./listings/index.ejs", { data });
})



// add new listing route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
})
app.post("/listings", wrapAsync(async (req, res) => {
    console.log(req.body);
    let newListing = new Listing(req.body);
    await newListing.save();

    res.redirect("/listings");
}));

// show individual route 
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("./listings/show.ejs", { data });
})

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    // res.send("working goof");
    res.render("./listings/edit.ejs", { data });
})

app.put("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    // console.log(data);
    await Listing.findByIdAndUpdate(id, data);
    res.redirect(`/listings/${id}`);
})
// delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//review route
app.post("/listings/:id/reviews",async (req,res)=>{
    let {id}=req.params;
    console.log(id);

    let listing= await Listing.findById(id);
    
    let review1=new Review(req.body.review);
    await review1.save();

    listing.reviews.push(review1);
    await listing.save();
    res.redirect(`/listings/${id}`);
})
app.use((req,res,next)=>{
    next( new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).send(message);
})
app.listen(8080, () => {
    console.log("app is unning on port 8080");
})