const { DataTypes } = require("sequelize");
const bdd = require("../utils/db.js");

const Card = bdd.define("Card", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: DataTypes.STRING,
	rarity: DataTypes.STRING,
	description: DataTypes.STRING,
}, {
    tableName: "Card"
});

module.exports = Card;
