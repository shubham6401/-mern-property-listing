const express=require("express");
const app=express();
const session = require('express-session');
const sessionOption={secret:"mysupersecreat",resave:false,saveUninitialized:true};
app.use(session(sessionOption));


app.get("/register",(req,res)=>{
    let {name="unnonymouse"}=req.query;
    req.session.name=name;
    res.send(name);
})
app.get("/hello",(req,res)=>{
    console.log(req.session);
    res.send(`hello ${req.session.name}`);
})
// app.get("/test",(req,res)=>{
//     res.send("working test");
// })
app.listen(3000,()=>{
    console.log("app is runnning");
})