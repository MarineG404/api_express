const { Sequelize } = require("sequelize");

const bdd = new Sequelize("tcg", "root", "root", {
	host: "127.0.0.1",
	dialect: "mariadb",
});

(async () => {
	try {
		await bdd.authenticate();
		console.log("Connexion à la base de données réussie.");
	} catch (error) {
		console.error("Impossible de se connecter à la base de données :", error);
	}
}
)();
module.exports = bdd;
