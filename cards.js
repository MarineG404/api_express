const fs = require("fs");

function OpenBooster(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
	const data_cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));

	if (!req.body) {
		return res.status(400).json({ message: "Body manquant" });
	}

	if (!req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}

	user = data_users.find(user => user.token === req.body.token);

	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	if (user.lastBooster && Date.now() - user.lastBooster < 300000) {
		return res.status(403).json({ message: "Vous devez attendre 5 min avant d'ouvrir un autre booster." });
	}

	const booster = [];

	for (let i = 0; i < 5; i++) {
		const rand = Math.random();

		if (rand < 0.80) {
			cards = data_cards.filter(card => card.rarity === "common")
		} else if (rand < 0.95) {
			cards = data_cards.filter(card => card.rarity === "rare")
		} else {
			cards = data_cards.filter(card => card.rarity === "legendary")
		}

		const card = cards[Math.floor(Math.random() * cards.length)];
		booster.push(card);
	}

	user.collection.push(...booster);

	res.status(200).json({
		"message": "Booster ouvert avec succès",
		"data": {
			"booster": booster,
			"collection": user.collection
		}
	});

	user.lastBooster = Date.now();

	fs.writeFileSync("./data/users.json", JSON.stringify(data_users, null, 2), "utf8");
}

module.exports = {
	OpenBooster,
}
