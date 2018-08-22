// Load Passport-local
var LocalStrategy = require("passport-local").Strategy;

// Load up the user model
var mysql = require("mysql");
var bcrypt = require("bcrypt-nodejs");

// Required if SQL queries are kept
//------------------------------------------------------------
var dbconfig = require("./database");
var connection = mysql.createConnection(dbconfig.connection);
connection.query("USE " + dbconfig.database);
//------------------------------------------------------------

// Uncomment if SQL queries are changed to Sequelize
//------------------------------------------------------------
// var connection = require("../config/connection.js");
// var User = require("../config/users.js");
//------------------------------------------------------------

// expose this function to our app using module.exports
module.exports = function (passport) {

    // passport session setup (required for persistent login sessions). 

    // Serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    // Deserialize the user
    passport.deserializeUser(function (user, done) {
        // id doesn't appear to be defined yet; must select by username
        connection.query("SELECT * FROM users WHERE username = ? ", user.username, function (err, rows) {
            done(err, rows[0]);
        });
    });

    //Signup
    // we are using named strategies since we have one for login and one for signup

    passport.use(
        "local-signup",
        new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, username, password, done) {
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM users WHERE username = ?", username, function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash("signupMessage", "Sorry. That username is already taken."));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                            createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), // standardizes entry into db regardless of local machine's settings
                            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') // standardizes entry into db regardless of local machine's settings
                        };

                        var insertQuery = "INSERT INTO users ( username, password, createdAt, updatedAt ) values (?,?,?,?)";

                        connection.query(insertQuery,
                            [newUserMysql.username, newUserMysql.password,
                            newUserMysql.createdAt, newUserMysql.updatedAt],
                            function (err, rows) {
                                return done(null, newUserMysql); 
                            });
                    }
                });
            })
    );

    // Login
    // we are using named strategies since we have one for login and one for signup

    passport.use(
        "local-login",
        new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, username, password, done) { // callback with username and password from our form
                connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash("loginMessage", "No user found.")); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash("loginMessage", "That is the wrong password and you know it!")); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};
