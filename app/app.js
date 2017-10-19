var express             = require("express"),
app                     = express(),
mongoose                = require("mongoose"),
bodyParser              = require("body-parser"),
methodOverride          = require("method-override"),
expressSanitizer        = require("express-sanitizer"),
passport                = require("passport"),
LocalStrategy           = require("passport-local"),
passportLocalMongoose   = require("passport-local-mongoose"),
expressSession          = require("express-session"),
User                    = require("./models/user"),
expressSession          = require("express-session"),
flash                   = require("connect-flash"),
mongoosePaginate        = require('mongoose-paginate'),
Blog                    = require("./models/blog");


// requiring routes
var blogRoutes    = require("./routes/blogs"),
    indexRoutes   = require("./routes/index");


// App Config
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.locals.moment = require('moment');
//__dirname gives the current directory 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


// for doing method overirde in forms COnverting posts to put or delete based on url

//conect to db
var db_url=process.env.DBURL;
mongoose.connect(db_url);
mongoose.connection.on('open', function(){
   console.log('Mongoose connected'); 
});


// Passport configuration
app.use(expressSession({
    secret:process.env.secretpassword||'password',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());


// Custom middleware created for
// sending current user data to each page
// also used for displaying flash messages
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    // flash message
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    res.locals.info = req.flash("info");
    next();
});


app.use("/",indexRoutes);
app.use("/blogs",blogRoutes);

mongoosePaginate.paginate.options = { 
  lean:  true,
  limit: 5
};

// Starting listener
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0");
app.listen(app.get('port'),app.get('ip'), function(){
    console.log('Blog Server up: http://' + app.get('ip') +":"+ app.get('port'));
});
