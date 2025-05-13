<?php

require_once(__DIR__ . '/../config.php');
require_once(BASE_PATH . "/includes/header.php");

// Initialiser cURL
$ch = curl_init(API_BASE_URL . "/cards");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

// Exécuter la requête
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
		if ($card["rarity"] == "common") {
			$bg = "bg-light";
		} elseif ($card["rarity"] == "rare") {
			$bg = "bg-warning";
		} elseif ($card["rarity"] == "legendary") {
			$bg = "bg-danger";
		}
		?>

		<div class="card <?= $bg ?>" style="width: 18rem;">
			<div class="card-header"><?= $card["rarity"] ?></div>
			<div class="card-body">
				<h4 class="card-title"><?= $card["name"] ?></h4>
				<p class="card-text"><?= $card["description"] ?></p>
			</div>
		</div>
	<?php } ?>
</div>

<?php
require_once(BASE_PATH . "/includes/footer.php");
?>

