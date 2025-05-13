<?php

require_once(__DIR__ . '/../config.php');
require_once(BASE_PATH . "/includes/header.php");

// Initialiser cURL
$ch = curl_init(API_BASE_URL . "/cards");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
	echo "<div class='alert alert-danger'>Erreur cURL : $error</div>";
} elseif ($httpCode === 200) {
	$cards = json_decode($response, true)["data"]["cards"];
} else {
	$json = json_decode($response, true);
	$message = $json["message"] ?? $json["Erreur"] ?? "Une erreur est survenue";
	echo "<div class='alert alert-danger'>Erreur ($httpCode) : $message</div>";
}
?>

<div class="d-flex flex-wrap gap-3">
	<?php
	foreach ($cards as $card) {
		$rarity = $card["rarity"];
		$bg = match ($rarity) {
			"common" => "bg-light",
			"rare" => "bg-warning",
			"legendary" => "bg-danger",
			default => "bg-secondary"
		};

		$name = $card["name"];
		$mapping = json_decode(file_get_contents(BASE_PATH . "/utils/fr_to_en.json"), true);
		$englishName = $mapping[$card["name"]] ?? null;
		$imageUrl = $englishName ? "https://img.pokemondb.net/sprites/home/normal/{$englishName}.png" : null;
		?>

		<div class="card <?= $bg ?>" style="width: 18rem;">
			<div class="card-header"><?= $rarity ?></div>
			<div class="card-body text-center">
				<h4 class="card-title"><?= $name ?></h4>
				<?php if ($imageUrl): ?>
					<img src="<?= $imageUrl ?>" alt="<?= $name ?>" class="img-fluid mb-2" style="height: 120px;">
				<?php else: ?>
					<p><em>Aucune image disponible</em></p>
				<?php endif; ?>
				<p class="card-text"><?= $card["description"] ?></p>
			</div>
		</div>
	<?php } ?>
</div>

<?php require_once(BASE_PATH . "/includes/footer.php"); ?>

