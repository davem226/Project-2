var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

var Rating = sequelize.define("rating", {
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    apiID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    rating: {
        // Must allow null to account for no ratings
        type: Sequelize.FLOAT,
        validate: {
            min: 1,
            max: 5
        }
    }
 });
module.exports = Rating;