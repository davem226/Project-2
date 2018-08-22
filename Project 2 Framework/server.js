
// References
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var app = express();
var port = process.env.PORT || 8080;

var passport = require("passport");
var flash = require("connect-flash");

// Pass passport for configuration
require("./config/passport")(passport); 

// Create db tables
var API = require("./db/apis.js");
API.sync();
var User = require("./db/users.js");
User.sync();
var Rating = require("./db/ratings.js");
Rating.sync();

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.static("views")); // allows us to reference external css in ejs files - thanks Steve
// required for passport
app.use(session({
	secret: "keyboard cat",
	resave: true,
	saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes 
require("./app/ejs-routes.js")(app, passport, API); // load our routes and pass in our app and fully configured passport
require("./app/api-routes.js")(app, API, Rating); // load our routes and pass in our app and fully configured passport

// launch 
app.listen(port);
console.log("Listening on " + port);
