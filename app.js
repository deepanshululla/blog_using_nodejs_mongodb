var express             = require("express"),
mongoose                = require("mongoose"),
bodyParser              = require("body-parser"),
methodOverride          = require("method-override"),
expressSanitizer        = require("express-sanitizer"),
passport                = require("passport"),
LocalStrategy           = require("passport-local"),
passportLocalMongoose   = require("passport-local-mongoose"),
expressSession          = require("express-session"),
User                    = require("./models/user"),
Blog                    = require("./models/blog");


//conect to db
mongoose.connect("mongodb://localhost/restful_blog_app",{useMongoClient: true});
mongoose.connection.on('open', function(){
   console.log('Mongoose connected'); 
});

// App Config
var app=express();
app.set("view engine","ejs");
app.use(express.static('public'));

app.use(expressSanitizer());
app.use(methodOverride("_method"));
// for doing method overirde in forms COnverting posts to put or delete based on url



app.use(expressSession({
    secret:"Some random string",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// var blog1={
//     title: "My first post",
//     image: "https://images.unsplash.com/photo-1500081849989-c79773135bf6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=933fb9ee5d3ab4b698c24f0a3f32813c",
//     body:"MY first blog post..Awesome"
// };
// Blog.create(blog1);


//Restful Routes
// INDEX ROUTE
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({},function(err,allBlogs){
        if(err){
            console.log(err);
            
        } else {
            console.log("GET /blogs");
            res.render("index",{blogs:allBlogs});
        }
    });
});
// new route
app.get("/blogs/new",isLoggedIn, function(req, res) {
    console.log("GET /blogs/new");
    res.render("new");
});



// create route
app.post("/blogs",isLoggedIn, function (req, res) {
    // sanitizing inputs
    req.body.blog.image= req.sanitize(req.body.blog.image);
    req.body.blog.title= req.sanitize(req.body.blog.title);
    req.body.blog.body= req.sanitize(req.body.blog.body);
    var data=req.body.blog;
    
    Blog.create(data,function (err, newBlog) {
       if(err){
           console.log(err);
           res.render("new");
       } else {
           console.log("POST /blogs")
           User.findOne({email:"deepu@gmail.com"}, function (err, foundUser) {
                if(err){
                    console.log(err);
                } else {
                    foundUser.blogs.push(newBlog);
                    foundUser.save(function (err, data) {
                        if(err){
                            console.log(err);
                        } else {
                            console.log(data);
                        }
                    });
                }
            });
           
           console.log("New blog post created with title: ", newBlog.title);
           //redirect to index
           
           
           res.redirect("/blogs");
       }
    });
});

// Show route
app.get("/blogs/:id", function(req, res) {
    var blogId=req.params.id;
    Blog.findById(blogId, function(err, foundblog){
         if(err){
            console.log(err);
            res.redirect("/error");
         }  else {
            console.log("GET /blogs/"+blogId);
            res.render("show",{blog:foundblog}); 
         }
    });
});

// Edit route
app.get("/blogs/:id/edit",isLoggedIn,function(req, res) {
    var blogId=req.params.id;
    Blog.findById(blogId, function(err, foundblog){
         if(err){
            console.log(err);
            res.redirect("/error");
         }  else {
            console.log("GET /blogs/"+blogId+"/edit");
            res.render("edit",{blog:foundblog}); 
         }
    });
    
});
// Update route
app.put("/blogs/:id",isLoggedIn, function (req,res) {
    var blogId=req.params.id;
    req.body.blog.image= req.sanitize(req.body.blog.image);
    req.body.blog.title= req.sanitize(req.body.blog.title);
    req.body.blog.body= req.sanitize(req.body.blog.body);
    var newData=req.body.blog;
    console.log("PUT /blogs/"+blogId);
    Blog.findByIdAndUpdate(blogId, newData, function(err, updatedBlog){
        if(err){
            console.log(err);
            res.redirect("/error");
        } else {
            res.redirect("/blogs/"+blogId);
        }
    })
});
// Delete route
app.delete("/blogs/:id",isLoggedIn, function (req,res) {
    var blogId=req.params.id;
    console.log("DELETE /blogs/"+blogId);
    Blog.findByIdAndRemove(blogId, function(err){
        if(err){
            console.log(err);
            res.redirect("/error");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.get("/error",function(req, res) {
    console.log("GET /error");
    res.redirect("/blogs");
   
});

//show signup form
app.get("/register", function(req, res) {
    console.log("GET /register");
    res.render('register');  
});
//handling user sign up
app.post("/register", function (req,res) {
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
    User.register(new User({username: username, email: email, fullname: fullname}), password, function (err, newUser) {
       if(err){
           console.log(err);
           return res.redirect("/register");
       } else {
           passport.authenticate("local")(req, res, function () {
               res.redirect("/login");
           });
       }
    });
    
});

// =======================
// Login Routes
// =======================

//render login form
app.get("/login", function(req, res) {
    console.log("GET /login");
    res.render('login');  
});
//handle user logging in
// middleware: here passport.authenticate is a middleware which is basically code 
//before request is rendered

app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),
function (req,res) {
    console.log("POST /login");
});

// =======================
// Logout Routes
// =======================
app.get("/logout",isLoggedIn, function(req, res) {
   req.logout();
   console.log("GET /logout");
   res.redirect('/');
});


// =======================
// isLoggedIn middleware
// =======================
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// =======================
// Default route
// =======================

app.get("*",function(req, res) {
   res.redirect("/"); 
});


// find user and all posts by him using the ids in the post array
// User.findOne({email:"deepu@gmail.com"}).populate("posts").exec(function (err, user) {
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });

// Starting listener
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0");
app.listen(app.get('port'),app.get('ip'), function(){
    console.log('Blog Server up: http://' + app.get('ip') +":"+ app.get('port'));
});