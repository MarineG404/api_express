const { DataTypes } = require("sequelize");
const bdd = require("../utils/db.js");

const Collection = bdd.define("Collection", {
	userId: DataTypes.INTEGER,
	cardId: DataTypes.INTEGER,
	quantity: DataTypes.INTEGER,
}, {
	tableName: "Collection"
});

module.exports = Collection;
