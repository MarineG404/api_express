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

	const booster = [];
	for (let i = 0; i < 5; i++) {
		const randomIndex = Math.floor(Math.random() * data_cards.length);
		const card = data_cards[randomIndex];
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
