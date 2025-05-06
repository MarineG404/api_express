<?php
	session_start();
	define('API_BASE_URL', "http://localhost:3000");
	// Chemin système absolu vers la racine du projet
	define('BASE_PATH', realpath(__DIR__));

	// URL publique (à adapter selon ton dossier local)
	define('BASE_URL', 'http://localhost:8000/');
?>

