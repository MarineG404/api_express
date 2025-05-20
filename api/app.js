const express = require("express");
const users = require("./users");
const cards = require("./cards");
const app = express();
const { DataTypes } = require("sequelize");
const bdd = require("./db.js");
const { User, Card, Collection, Auction } = require("./Models");

// Gérer les données des formulaires correctement.
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
	res.json(
		{
			message: "Bienvenue sur l'API TCG",
		}
	);
});

// routes users
app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.post("/user", users.GetUser);
app.post("/disconnect", users.Disconnect);

// routes cards
app.post("/booster", cards.OpenBooster);
app.get("/cards", cards.GetCards);
app.post("/convert", cards.Convert);

// app.post("/auction")
// app.post("/bid")
// app.get("/auctions")
// app.get("/close")

console.log("Démarrage de l'application...");
bdd.sync()
	.then(() => {
		console.log("Modèles synchronisés avec succès.");
	})
	.catch((error) => {
		console.error("Erreur lors de la synchronisation des modèles :", error);
	});

// bdd.sync({ force: true })
//     .then(() => {
//         console.log("Modèles synchronisés avec succès.");
//     })
//     .catch((error) => {
//         console.error("Erreur lors de la synchronisation des modèles :", error);
//     });

app.listen(3000, () => {
	console.log("Serveur démarré sur http://localhost:3000");
});
