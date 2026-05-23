const User = require("../models/user.js");



module.exports.getSignUp=(req, res) => {
    console.log("yes");
    res.render("./user/signup.ejs")
};

module.exports.postSignUp=async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const user1 = new User({ username, email });
        let registeredUser = await User.register(user1, password);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash("success", "Welcome to wanterLust... ");
            res.redirect("/listings");
        })
        
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/user/signup");
    }

};

module.exports.getLogin=(req, res) => {
    res.render("./user/login.ejs")
};

module.exports.postLogin=async (req, res) => {
    req.flash("success","Welcome to WanderLust") 
    let redirectUrl2=res.locals.redirectUrl || "/listings";
    console.log("after login",redirectUrl2);
    res.redirect(redirectUrl2);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out successfully");
        res.redirect("/listings");
    })
};