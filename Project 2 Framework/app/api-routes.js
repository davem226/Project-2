module.exports = function (app, API, Rating) {
    // Get specific api to be rated
    app.get("/api/:id", function (req, res) {
        API.findOne({ where: { id: req.params.id } }).then(data => {
            res.json(data);
        });
    });

    // Get all ratings for specific user
    app.get("/api/ratings/:uid", function (req, res) {
        Rating.findAll({ where: { userID: req.params.uid } }).then(data => {
            res.json(data);
        });
    });

    // Update ratings table
    app.post("/api/ratings/", function (req, res) {
        // Check if user already rated api
        Rating.findAll({
            where: {
                userID: req.body.uid,
                apiID: req.body.dbid
            }
        }).then(function (data) {
            if (data.length === 0) {
                Rating.create({
                    userID: req.body.uid,
                    apiID: req.body.dbid,
                    rating: req.body.rating
                }).then(data => {
                    res.send("Created new rating");
                });
            }
            else {
                Rating.update(
                    {
                        rating: req.body.rating
                    },
                    {
                        where: {
                            userID: req.body.uid,
                            apiID: req.body.dbid
                        }
                    }
                ).then(function (data) {
                    res.send("Updated rating");
                })
            }
        });


    });

    // Add user rating
    app.put("/api/rate/:id", function (req, res) {
        var n = parseInt(req.body.numRatings);
        var R = parseFloat(req.body.oldAvg);
        var r = parseInt(req.body.rating);
        var newAvgRating;

        // Prevent multiple ratings by same person
        Rating.findAll({
            where: {
                userID: req.body.uid,
                apiID: req.body.dbid
            }
        }).then(function (data) {
            if (data.length === 0) {
                newAvgRating = (n * R + r) / (n + 1);
                n++;
            } else {
                r0 = data[0].dataValues.rating
                newAvgRating = (n * R - r0 + r) / n
            }

            API.update(
                {
                    // Round to one decimal
                    rating: Math.round(newAvgRating * 10) / 10,
                    numRatings: n
                },
                {
                    where: {
                        id: req.body.dbid
                    },
                }
            ).then(data => { res.json(data) });
        });
    });

    // Add new api
    app.post("/api/add", function (req, res) {
        var newAPI = {
            name: req.body.name,
            link: req.body.link
        }
        if (req.body.rating) {
            newAPI.rating = req.body.rating;
            newAPI.numRatings = 1;
        }

        API.create(newAPI).then(function (data) {
            // Update ratings table if new api was rated
            if (data.dataValues.rating) {
                Rating.create({
                    userID: req.body.uid,
                    apiID: data.dataValues.id,
                    rating: data.dataValues.rating
                }).then(function () {
                    res.send("Updated ratings table");
                });
            }
            res.send("Created new API");
        });
    });
}