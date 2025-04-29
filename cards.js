const fs = require("fs");

function OpenBooster(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
	const data_cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));

	user = data_users.find(user => user.token === req.body.token);

	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	if (user.lastBooster && Date.now() - user.lastBooster < 300000) {
		return res.status(403).json({ message: "Vous devez attendre 5 avant d'ouvrir un autre booster." });
	}

	const commons = data_cards.filter(card => card.rarity === "common");
	const rares = data_cards.filter(card => card.rarity === "rare");
	const legendaries = data_cards.filter(card => card.rarity === "legendary");

	const booster = [];
	for (let i = 0; i < 5; i++) {

		const rand = Math.random();
		if (rand < 0.80) {
			chosenRarity = "common";
		} else if (rand < 0.95) {
			chosenRarity = "rare";
		} else {
			chosenRarity = "legendary";
		}

		let pool;
		if (chosenRarity === "common")
			pool = commons;
		if (chosenRarity === "rare")
			pool = rares;
		if (chosenRarity === "legendary")
			pool = legendaries;

		const card = pool[Math.floor(Math.random() * pool.length)];
		booster.push(card);
	}

	user.collection = user.collection || [];
	user.collection.push(...booster);

	res.status(200).json({
		"message": "Booster ouvert avec succès"
		,
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
