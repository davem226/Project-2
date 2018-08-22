var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

var User = sequelize.define("users", {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
module.exports = User;