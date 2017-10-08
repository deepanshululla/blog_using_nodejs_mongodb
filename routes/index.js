var express     = require("express"),
    router      = express.Router(),
    Blog        = require("../models/blog"),
    User        = require("../models/user"),
    passport    = require("passport"),
    flash       = require("connect-flash"),
    middleware  = require("../middleware");

// INDEX ROUTE
router.get("/", function(req, res) {
    return res.redirect("/blogs");
});



//show signup form
router.get("/register", function(req, res) {
    console.log("GET /register");
    res.render('register');  
});
//handling user sign up
router.post("/register", function (req,res) {
    // req.body.user.name= req.sanitize(req.body.user.name);
    // req.body.user.username= req.sanitize(req.body.user.username);
    // req.body.user.email= req.sanitize(req.body.user.email);
    // req.body.user.password= req.sanitize(req.body.user.password);
    console.log("POST /register");
    var data = req.body;
    var fullname=data.fullname;
    var username=data.username;
    var password=data.password;
    var email=data.email;
    User.find({},function (err,foundUsers) {
       if(err){
           console.log(err);
           return res.redirect("/register");
       } else {
        //   eval(require("locus"));
           if(foundUsers.length>=1){
               req.flash("error","Only one user registeration per blog");
               return res.redirect("/");
           } else {
                User.register(new User({username: username, email: email, fullname: fullname}), password, function (err, newUser) {
                   if(err){
                       console.log(err);
                       return res.redirect("/register");
                   } else {
                       passport.authenticate("local")(req, res, function () {
                           return res.redirect("/");
                       });
                   }
                });
               
               
           }
       }
    });
   
    
});

// =======================
// Login Routes
// =======================

//render login form
router.get("/login", function(req, res) {
    console.log("GET /login");
    
    res.render('login');  
});
//handle user logging in
// middleware: here passport.authenticate is a middleware which is basically code 
//before request is rendered

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true,
    successFlash:"WELCOME BACK!!!!"
}),
function (req,res) {
    console.log("POST /login");
    
});

// =======================
// Logout Routes
// =======================
router.get("/logout",middleware.isLoggedIn, function(req, res) {
   req.logout();
   console.log("GET /logout");
   req.flash("info","Successfuly Logged you out. Bye ");
   
   return res.redirect('/');
});



module.exports = router;