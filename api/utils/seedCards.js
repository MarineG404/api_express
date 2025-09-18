const bdd = require("./db.js");
const Card = require("../Models/Card.js");
const cards = require("../data/cards.json"); // ton fichier JSON

const seed = async () => {
	try {
		await bdd.authenticate();
		console.log("Connexion à la base réussie.");

		const filteredCards = cards.map(c => ({
			name: c.name,
			rarity: c.rarity,
			description: c.description || "Aucune description",
		}));

		await Card.bulkCreate(filteredCards);
	} catch (err) {
		console.error("Erreur :", err);
	} finally {
		await bdd.close();
	}
};

seed();
