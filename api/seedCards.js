const bdd = require("./db.js");
const Card = require("./Models/Card");
const cards = require("./data/cards.json"); // ton fichier JSON

const seed = async () => {
	try {
		await bdd.authenticate();
		console.log("Connexion à la base réussie.");

		// (Optionnel) Synchroniser le modèle, si nécessaire :
		// await bdd.sync({ force: true }); // ATTENTION : efface la table si elle existe déjà

		// Insertion en masse
		const filteredCards = cards.map(c => ({
			name: c.name,
			rarity: c.rarity,
			description: c.description || "Aucune description",
		}));

		await Card.bulkCreate(filteredCards); console.log("Cartes insérées avec succès.");
	} catch (err) {
		console.error("Erreur :", err);
	} finally {
		await bdd.close();
	}
};

seed();
