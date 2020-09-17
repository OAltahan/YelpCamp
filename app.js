// npm install express ejs --save

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'), // npm install body-parser --save
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    // npm install method-override --save // used for editign to database
    methodOverride = require("method-override"),
    flash = require("connect-flash"); // npm install connect-flash --save

// requiring the routes files
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// seed the database
// seedDB(); // runnin seedDB js file

// passport configuration
app.use(require("express-session")({
    secret: "Mohammad is my course friend",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
/* User.authenticate is a method coming from UserSchema.plugin(passportLocalMongoose);
  in user.js */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

// middleware that passes the current user's data to the pages
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
// we can separate each environment's database using set DATABASEURL = mongodb://localhost:27017/yelp_camp
// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://omar:pass@yelpcamp.85zxd.mongodb.net/YelpCamp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// validating imported routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); // example of shortening the campgrounds.js route get and post lines
app.use("/campgrounds/:id/comments", commentRoutes);

// activate server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server is now Online...");
});