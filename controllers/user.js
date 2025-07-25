const User = require("../models/user");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js"); 

module.exports.signUp = (req , res) => {
    res.render("users/signup.ejs");
};

module.exports.saveUser = async(req , res) => {
    try{
        let {username , email , password} = req.body ;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Wanderlust!");
            return res.redirect("/listings");
        })
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.logInPage =  (req , res) => {
    res.render("users/login.ejs");
};

module.exports.authenticateUser = async(req , res) => {
    req.flash("success" ,"Welcome back to Wanderlust! You are logged in!");
    if(res.locals.redirectUrl){
        return res.redirect( res.locals.redirectUrl);
    }
    res.redirect("/listings");
};

module.exports.logOut = (req , res , next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    })
};