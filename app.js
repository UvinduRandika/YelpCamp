
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect("mongodb+srv://Uvindu:abcd@cluster0.czhkl.mongodb.net/YelpCamp?&authSource=admin&retryWrites=true&w=majority", {
/* mongodb://Uvindu:abcd@mongo-cluster-shard-00-00-ixqtu.mongodb.net:27017,mongo-cluster-shard-00-01-ixqtu.mongodb.net:27017,mongo-cluster-shard-00-02-ixqtu.mongodb.net:27017/test?ssl=true&replicaSet=mongo-cluster-shard-0&authSource=admin&retryWrites=true
 */	
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log("connected to DB");
}).catch(err => {
	console.log("error", err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
 seedDB(); //seed the database


app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});