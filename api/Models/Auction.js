const { DataTypes } = require("sequelize");
const bdd = require("../utils/db.js");

const Auction = bdd.define("Auction", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	card_id: DataTypes.INTEGER,
	seller_id: DataTypes.INTEGER,
	bidder_id: DataTypes.INTEGER,
	end_date: DataTypes.DATE,
	bid: DataTypes.INTEGER,
}, {
	tableName: "Auction"
});

module.exports = Auction;
