module.exports = function (app, passport, API) {
	//Root - "landing page"
	app.get("/", function (req, res) {
		res.render("index.ejs"); // load the index.ejs file
	});

	// Show the login form
	app.get("/login", function (req, res) {

		// Take user to the page and pass in any flash data if it exists
		res.render("login.ejs", { message: req.flash("loginMessage") });
	});

	// Process the login form
	app.post("/login", passport.authenticate("local-login", {
		successRedirect: "/profile", // redirect to the secure profile section
		failureRedirect: "/login", // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages...new technology!
	}),
		function (req, res) {
			console.log("Welcome to the Hitchhiker's Guide to the Galaxy of APIs");

			if (req.body.remember) {
				req.session.cookie.maxAge = 24 * 60 * 60 * 1000 // 24 hours. We can change this if we think the cookie will go stale
			} else {
				req.session.cookie.expires = false;
			}
			res.redirect("/");
		});

	// Show the signup form
	app.get("/signup", function (req, res) {
		//Take user to the page and pass in any flash data if it exists
		res.render("signup.ejs", { message: req.flash("signupMessage") });
	});
	// Process the signup form
	app.post("/signup", passport.authenticate("local-signup", {
		successRedirect: "/profile", // redirect to the secure profile section
		failureRedirect: "/signup", // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// User Profile. This section can only be accessed after the user logs in. The isLoggedIn function will take care of verifying that the user is still active
	app.get("/profile", isLoggedIn, function (req, res) {
		// Get api table
		API.findAll().then(data => {
			res.render("profile.ejs", {
				user: req.user, // get the user out of session and pass to template
				apis: data
			});
		});

	});

	// Logout
	app.get("/logout", function (req, res) {
		req.logout();
		res.redirect("/");
	});
};

// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren"t redirect them to the home page
	res.redirect("/");
}
