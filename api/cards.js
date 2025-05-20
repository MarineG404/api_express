const fs = require("fs");
const { Card, User, Collection } = require("./Models");

async function OpenBooster(req, res) {
	if (!req.body) {
		return res.status(400).json({ message: "Body manquant" });
	}
	if (!req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}

	const user = await User.findOne({ where: { token: req.body.token } });
	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	// Vérification du cooldown
	const now = Date.now();
	if (user.lastbooster && now - user.lastbooster < 5 * 60 * 1000) {
		const remainingMs = 5 * 60 * 1000 - (now - user.lastbooster);
		const remainingSec = Math.floor(remainingMs / 1000);
		const minutes = Math.floor(remainingSec / 60);
		const seconds = remainingSec % 60;
		return res.status(403).json({
			message: `Vous devez attendre encore ${minutes}m ${seconds}s avant d'ouvrir un autre booster.`,
			remainingTime: { milliseconds: remainingMs, seconds: remainingSec, minutes }
		});
	}

	// Récupérer toutes les cartes
	const data_cards = await Card.findAll({ raw: true });

	// Génération du booster
	const booster = [];
	for (let i = 0; i < 5; i++) {
		const rand = Math.random();
		let cards;
		if (rand < 0.80) {
			cards = data_cards.filter(card => card.rarity === "common");
		} else if (rand < 0.95) {
			cards = data_cards.filter(card => card.rarity === "rare");
		} else {
			cards = data_cards.filter(card => card.rarity === "legendary");
		}
		const card = cards[Math.floor(Math.random() * cards.length)];
		booster.push(card);
	}

	for (const card of booster) {
		const [collection, created] = await Collection.findOrCreate({
			where: { userId: user.id, cardId: card.id },
			defaults: { quantity: 1 }
		});
		if (!created) {
			collection.quantity += 1;
			await collection.save();
		}
	}

	user.lastbooster = now;
	await user.save();

	const collection = await Collection.findAll({
		where: { userId: user.id },
		include: [{ model: Card }],
		raw: true,
		nest: true
	});

	// Formater la collection pour le front
	const formattedCollection = collection.map(c => ({
		id: c['Card.id'],
		name: c['Card.name'],
		rarity: c['Card.rarity'],
		description: c['Card.description'],
		quantity: c.quantity
	}));

	// Tri par rareté puis nom
	const rarityOrder = { common: 0, rare: 1, legendary: 2 };
	formattedCollection.sort((a, b) => {
		const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
		if (rarityDiff !== 0) return rarityDiff;
		return a.name.localeCompare(b.name);
	});

	res.status(200).json({
		message: "Booster ouvert avec succès",
		data: {
			booster,
			collection: formattedCollection
		}
	});
}

async function GetCards(req, res) {
	const data_cards = await Card.findAll({ raw: true });

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

async function Convert(req, res) {
	if (!req.body) {
		return res.status(400).json({ message: "Body manquant" });
	}
	if (!req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}
	if (!req.body.idcard) {
		return res.status(400).json({ message: "Id de la carte manquant" });
	}

	const user = await User.findOne({ where: { token: req.body.token } });
	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	const card = await Card.findByPk(req.body.idcard);
	if (!card) {
		return res.status(404).json({ message: "Carte introuvable dans le catalogue" });
	}

	const cardInCollection = await Collection.findOne({
		where: { userId: user.id, cardId: card.id }
	});
	if (!cardInCollection) {
		return res.status(404).json({ message: "Carte non trouvée dans la collection de l'utilisateur" });
	}
	if (cardInCollection.quantity < 2) {
		return res.status(403).json({ message: "Vous devez avoir au moins un doublon pour vendre cette carte" });
	}

	cardInCollection.quantity -= 1;
	await cardInCollection.save();

	let gain = 0;
	switch (card.rarity) {
		case 'common': gain = 5; break;
		case 'rare': gain = 15; break;
		case 'legendary': gain = 50; break;
	}

	user.currency += gain;
	await user.save();

	res.status(200).json({
		message: "Carte vendue avec succès",
		gain: gain,
		newCurrency: user.currency,
		card: {
			id: card.id,
			name: card.name,
			nb: cardInCollection.quantity
		}
	});
}

module.exports = {
	OpenBooster,
	GetCards,
	Convert
}
