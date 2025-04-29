const express = require("express"); const app = express();

app.get("/", (req, res) => {
	res.json(
	{
		message : "Bienvenue sur l'API TCG",
		data : {}
	});
});

app.listen(3000, () => { console.log("Serveur démarré sur http://localhost:3000"); });

app.use(express.urlencoded({ extended: true }));
