const { DataTypes } = require("sequelize");
const bdd = require("../db.js");

const User = bdd.define("User", {
	username: DataTypes.STRING,
	password: DataTypes.STRING,
	currency: DataTypes.INTEGER,
	lastbooster: DataTypes.DATE,
	token: DataTypes.STRING,
}, {
	tableName: "User"
});

module.exports = User;
