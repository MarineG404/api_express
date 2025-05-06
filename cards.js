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
		const remainingMs = 300000 - (Date.now() - user.lastBooster);
		const remainingSec = Math.floor(remainingMs / 1000);
		const minutes = Math.floor(remainingSec / 60);
		const seconds = remainingSec % 60;

		return res.status(403).json({
			message: `Vous devez attendre encore ${minutes}m ${seconds}s avant d'ouvrir un autre booster.`,
			remainingTime: {
				milliseconds: remainingMs,
				seconds: remainingSec,
				minutes,
			}
		});
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

	for (const card of booster) {
		const cardInCollection = user.collection.find(c => c.id === card.id);
		if (cardInCollection) {
			cardInCollection.nb += 1;
		} else {
			user.collection.push({ ...card, nb: 1 });
		}
	}

	// Tri par rareté puis nom
	user.collection.sort((a, b) => {
		const rarityOrder = { common: 0, rare: 1, legendary: 2 };
		const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
		if (rarityDiff !== 0) return rarityDiff;
		return a.name.localeCompare(b.name);
	});

	// Sauvegarde dans le fichier
	user.lastBooster = Date.now();
	fs.writeFileSync("./data/users.json", JSON.stringify(data_users, null, 2), "utf8");

	// Envoi de la réponse
	res.status(200).json({
		message: "Booster ouvert avec succès",
		data: {
			booster: booster,
			collection: user.collection
		}
	});
}

function GetCards(req, res) {
	const data_cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));

	const rarityOrder = {
		common: 0,
		rare: 1,
		legendary: 2
	};

	data_cards.sort((a, b) => {
		const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
		if (rarityDiff !== 0) {
			return rarityDiff; // Trier par rareté d'abord
		}
		// Si même rareté, trier par nom
		return a.name.localeCompare(b.name);
	});

	res.status(200).json({
		message: "Liste des cartes",
		data: {
			cards: data_cards
		}
	});
}

function Convert(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
	const data_cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));


	if (!req.body) {
		return res.status(400).json({ message: "Body manquant" });
	}

	if (!req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}

	if (!req.body.idcard) {
		return res.status(400).json({ message: "Id de la carte manquant" })
	}

	user = data_users.find(user => user.token === req.body.token);

	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	const cardId = parseInt(req.body.idcard, 10);
	const card = data_cards.find(card => card.id === cardId);

	if (!card) {
		return res.status(404).json({ message: "Carte introuvable dans le catalogue" });
	}

	const cardInCollection = user.collection.find(c => c.id === cardId);

	if (!cardInCollection) {
		return res.status(404).json({ message: "Carte non trouvée dans la collection de l'utilisateur" });
	}

	if (cardInCollection.nb < 2) {
		return res.status(403).json({ message: "Vous devez avoir au moins un doublon pour vendre cette carte" });
	}

	cardInCollection.nb -= 1;

	let gain = 0;
	switch (card.rarity) {
		case 'common':
			gain = 5;
			break;
		case 'rare':
			gain = 15;
			break;
		case 'legendary':
			gain = 50;
			break;
	}

	user.currency += gain;

	fs.writeFileSync("./data/users.json", JSON.stringify(data_users, null, 2), "utf8");

	res.status(200).json({
		message: "Carte vendue avec succès",
		gain: gain,
		newCurrency: user.currency,
		card: {
			id: card.id,
			name: card.name,
			nb: cardInCollection.nb
		}
	});
}

module.exports = {
	OpenBooster,
	GetCards,
	Convert
}
