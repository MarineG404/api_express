const fs = require("fs");
const bcrypt = require("bcrypt");
const TokenGenerator = require("token-generator")({
	salt: "your secret ingredient for this magic recipe",
	timestampMap: 'abcdefghij',
});
const User = require("../Models/User.js");
const Card = require("../Models/Card.js");
const Collection = require("../Models/Collection.js");

async function RegisterUser(req, res) {
	if (!req.body) {
		res.status(400).json({ "message": "Erreur : Aucune données envoyées" });
		return;
	}

	if (!req.body.username || !req.body.password) {
		res.status(400).json({ "Erreur": "Username ou mot de passe absent" });
		return;
	}

	username = req.body.username;
	password = req.body.password;

	var existingUser = await User.findOne({ where: { username: username } });
	if (existingUser) {
		res.status(409).json({ "message": "Erreur : Utilisateur déjà existant" }); // 409 -> conflict
		return;
	}

	var HashedPassword = await bcrypt.hash(password, 10);
	var token = TokenGenerator.generate();
	var newUser = await User.create({
		username: username,
		password: HashedPassword,
		currency: 0,
		token: token
	});

	return res.status(201).json({ user_token: newUser.token });
}

async function Login(req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		return res.status(400).json({ message: "Username ou mot de passe manquant" });
	}

	const { username, password } = req.body;

	const user = await User.findOne({ where: { username } });

	if (!user) {
		return res.status(401).json({ message: "Échec de l'authentification : utilisateur non trouvé" });
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		return res.status(401).json({ message: "Échec de l'authentification : mot de passe incorrect" });
	}

	const token = TokenGenerator.generate();
	user.token = token;
	await user.save();

	return res.json({
		message: "Authentification réussie",
		data: { token }
	});
}

async function GetUser(req, res) {
	if (!req.body || !req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}

	const token = req.body.token;

	try {
		const user = await User.findOne({ where: { token } });

		if (!user) {
			return res.status(401).json({ message: "Token invalide" });
		}

		// Récupérer la collection de l'utilisateur
		const collection = await Collection.findAll({
			where: { userId: user.id },
			include: [{ model: Card }],
			raw: true,
			nest: true
		});

		const formattedCollection = collection.map(c => ({
			id: c.Card.id,
			name: c.Card.name,
			rarity: c.Card.rarity,
			description: c.Card.description,
			nb: c.quantity
		}));

		// Tri par rareté puis nom
		const rarityOrder = { common: 0, rare: 1, legendary: 2 };
		formattedCollection.sort((a, b) => {
			const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
			if (rarityDiff !== 0) return rarityDiff;
			return a.name.localeCompare(b.name);
		});

		res.json({
			message: "Utilisateur trouvé",
			data: {
				id: user.id,
				username: user.username,
				currency: user.currency,
				collection: formattedCollection
			}
		});
	} catch (error) {
		res.status(500).json({ message: "Erreur serveur", error: error.message });
	}
}

async function Disconnect(req, res) {
	if (!req.body) {
		return res.status(400).json({ message: "Body manquant" });
	}

	if (!req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}

	const token = req.body.token;

	const user = await User.findOne({ where: { token } });

	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	user.token = null;
	await user.save();

	return res.json({ message: "Déconnexion réussie" });

}

module.exports = {
	RegisterUser,
	Login,
	GetUser,
	Disconnect,
}
