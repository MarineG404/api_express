<?php
require_once(__DIR__ . '/../config.php');
require_once(BASE_PATH . "/includes/header.php");

$cards = [];

if (!isset($_SESSION["token"])) {
	header("Location: " . BASE_URL . "/pages/error/denied.php");
	exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$data = [
		"token" => $_SESSION["token"] ?? ""
	];

	$ch = curl_init(API_BASE_URL . "/booster");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	curl_close($ch);

	if ($error) {
		echo "<div class='alert alert-danger'>Erreur cURL : $error</div>";
	} elseif ($httpCode === 200 || $httpCode === 201) {
		$cards = json_decode($response, true)["data"]["booster"];
	} else {
		$json = json_decode($response, true);
		$message = $json["message"] ?? $json["Erreur"] ?? "Une erreur est survenue";
		echo "<div class='alert alert-danger'>$message</div>";
	}
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
		$name = $card["name"];
		$mapping = json_decode(file_get_contents(BASE_PATH . "/utils/fr_to_en.json"), true);
		$englishName = $mapping[$card["name"]] ?? null;
		$imageUrl = $englishName ? "https://img.pokemondb.net/sprites/home/normal/{$englishName}.png" : null;
		?>

		<div class="card <?= $bg ?>" style="width: 18rem; cursor: pointer;" data-bs-toggle="modal"
			data-bs-target="#<?= $modalId ?>">
			<div class="card-header"><?= ucfirst($card["rarity"]) ?></div>
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

<?php if (!empty($cards)): ?>
	<div class="text-center mt-4">
		<a href="<?= BASE_URL; ?>pages/auth/user.php" class="btn btn-success btn-lg">Voir ma collection</a>
	</div>
<?php endif; ?>

<form method="POST">
	<div class="d-grid gap-2 mt-3">
		<button class="btn btn-lg btn-primary" type="submit">Ouvrir booster</button>
	</div>
</form>

<?php
require_once(BASE_PATH . "/includes/footer.php");
?>

