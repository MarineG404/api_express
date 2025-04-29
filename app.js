const express = require("express");
const app = express();
const users = require("./users");
const cards = require("./cards");

// app.use(express.json());

// Gérer les données des formulaires correctement.
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json(
		{
			message: "Bienvenue sur l'API TCG",
			data: {}
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

app.listen(3000, () => {
	console.log("Serveur démarré sur http://localhost:3000");
});
