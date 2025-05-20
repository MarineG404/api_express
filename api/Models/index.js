const User = require("./User");
const Card = require("./Card");
const Collection = require("./Collection");
const Auction = require("./Auction");

// Associations
User.hasMany(Collection, { foreignKey: "userId" });
Collection.belongsTo(User, { foreignKey: "userId" });

Card.hasMany(Collection, { foreignKey: "cardId" });
Collection.belongsTo(Card, { foreignKey: "cardId" });

module.exports = { User, Card, Collection, Auction };
