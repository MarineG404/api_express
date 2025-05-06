const fs = require("fs");
const bcrypt = require('bcrypt');
const TokenGenerator = require('token-generator')({
	salt: 'your secret ingredient for this magic recipe',
	timestampMap: 'abcdefghij',
});

function RegisterUser(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

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

	var user = data_users.find(user => user.username === username);
	if (user) {
		res.status(409).json({ "message": "Erreur : Utilisateur déjà existant" }); // 409 -> conflict
		return;
	}

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			res.status(500).json({ "message": "Erreur : Impossible de hacher le mot de passe" });
			return;
		};

		var token = TokenGenerator.generate();

		data_users.push(
			{
				"id": data_users.length + 1,
				"username": username,
				"password": hash,
				"currency": 0,
				"collection": [],
				"token": token
			}
		);

		fs.writeFileSync("./data/users.json", JSON.stringify(data_users, null, 2), "utf8");

		user_token = data_users.find(user => user.username === username).token;
		res.json({user_token});
	});
}

function Login(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

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

	var user = data_users.find(user => user.username === username);

	if (!user) {
		res.status(401).json({ "message": "Erreur : Utilisateur non trouvé" });
		return;
	}

	bcrypt.compare(password, user.password, (err, result) => {

		if (!result) {
			res.status(401).json(
				{
					"message": "Authentification pas réussi : mauvais mot de passe"
				}
			);
		} else {
			var token = TokenGenerator.generate();
			user.token = token;
			fs.writeFileSync("./data/users.json", JSON.stringify(data_users, null, 2), "utf8");

			res.json(
				{
					message: "Autentification réussie",
					data: {
						"token": token
					},
				}
			)
		}
	});
}

function GetUser(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

	if (!req.body) {
		return res.status(400).json({ message: "Token manquant" });
	}

	const token = req.body.token

	const user = data_users.find(user => user.token === token);

	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	res.json(
		{
			message: "Utilisateur trouvé",
			data: {
				id: user.id,
				username: user.username,
				currency: user.currency,
				collection: user.collection
			}
		}
	)
}

function Disconnect(req, res) {
	const data_users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

	if (!req.body) {
		return res.status(400).json({ message: "Body manquant" });
	}

	if (!req.body.token) {
		return res.status(400).json({ message: "Token manquant" });
	}

	const token = req.body.token

	const user = data_users.find(user => user.token === token);

	if (!user) {
		return res.status(401).json({ message: "Token invalide" });
	}

	delete user.token;

	fs.writeFileSync("./data/users.json", JSON.stringify(data_users, null, 2), "utf8");

	res.json({ message: "Déconnexion réussie" });
}

module.exports = {
	RegisterUser,
	Login,
	GetUser,
	Disconnect,
}
