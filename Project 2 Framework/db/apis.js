var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

var API = sequelize.define("apis", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    link: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rating: {
        // Must allow null to account for no ratings
        type: Sequelize.FLOAT,
        validate: {
            min: 1,
            max: 5
        }
    },
    numRatings: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
 });
module.exports = API;