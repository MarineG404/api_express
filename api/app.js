const express = require("express");
const users = require("./users");
const cards = require("./cards");
const app = express();

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
app.post("/convert", cards.Convert)

app.listen(3000, () => {
	console.log("Serveur démarré sur http://localhost:3000");
});
