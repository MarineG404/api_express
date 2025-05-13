<?php

// URL de l'API des espèces Pokémon
$apiUrl = "https://pokeapi.co/api/v2/pokemon-species?limit=1000";

echo "Récupération de la liste des espèces...\n";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

if (!isset($data["results"])) {
	die("Erreur : impossible de récupérer la liste des Pokémon.\n");
}

$mapping = [];

foreach ($data["results"] as $index => $pokemon) {
	$detailUrl = $pokemon["url"];
	echo "Traitement : " . $pokemon["name"] . "\n";

	$ch = curl_init($detailUrl);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$responseDetail = curl_exec($ch);
	curl_close($ch);

	if ($responseDetail) {
		$detailData = json_decode($responseDetail, true);
		$englishName = strtolower($detailData["name"]);

		foreach ($detailData["names"] as $nameEntry) {
			if ($nameEntry["language"]["name"] === "fr") {
				$frenchName = $nameEntry["name"];
				$mapping[$frenchName] = $englishName;
			}
		}
	}

	// Pour ne pas surcharger l'API (facultatif)
	usleep(100000); // 100ms
}

// Enregistrer dans un fichier JSON
file_put_contents(__DIR__ . "/fr_to_en.json", json_encode($mapping, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "✅ Mapping généré avec succès dans 'fr_to_en.json'.\n";
