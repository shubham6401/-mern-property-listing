require('dotenv').config(); 
console.log(process.env.SECRET); 


const mongoose = require("mongoose");
const express = require("express");

const app = express();

const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});


const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
let session = require('express-session');
// const MongoStore = require('connect-mongo');
const MongoStore = require("connect-mongo").default;

let flash = require('connect-flash');
let methodOverride = require('method-override');
app.use(methodOverride("_method"));
const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const { resourceUsage } = require("process");
const User=require("./models/user.js")




const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecreat",
    },
    touchAfter: 24 * 3600,
});

const sessionOption={
    store,
    secret:"mysupersecreat",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    }
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings/:id/reviews",reviewsRouter);
app.use("/listings",listingsRouter);
app.use("/user",userRouter);

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