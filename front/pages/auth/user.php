<?php

require_once(__DIR__ . '../../../config.php');
require_once(BASE_PATH . "/includes/header.php");

if (!isset($_SESSION["token"])) {
	header("Location: " . BASE_URL . "/pages/error/denied.php");
	exit;
}

$data = [
	"token" => $_SESSION["token"] ?? ""
];

// Initialiser cURL
$ch = curl_init(API_BASE_URL . "/user");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// Exécuter la requête
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
	echo "<div class='alert alert-danger'>Erreur cURL : $error</div>";
} elseif ($httpCode === 200 || $httpCode === 201) {
	$data = json_decode($response, true)["data"];
} else {
	$json = json_decode($response, true);
	$message = $json["message"] ?? $json["Erreur"] ?? "Une erreur est survenue";
	echo "<div class='alert alert-danger'>Erreur ($httpCode) : $message</div>";
}

$currency = $data["currency"];
$username = $data["username"];
$collection = $data["collection"];
$successMessage = "";
if (isset($_SESSION["success_message"])) {
	$successMessage = $_SESSION["success_message"];
	unset($_SESSION["success_message"]); // Supprimer pour ne pas le réafficher à chaque rechargement
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

	// Préparer les données
	$data = [
		"token" => $_SESSION["token"] ?? "",
		"idcard" => $_POST["idcard"] ?? ""
	];
	error_log(json_encode($data));

	// Initialiser cURL
	$ch = curl_init(API_BASE_URL . "/convert");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

	// Exécuter la requête
	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	curl_close($ch);

	if ($error) {
		echo "<div class='alert alert-danger'>Erreur cURL : $error</div>";
	} elseif ($httpCode === 200 || $httpCode === 201) {
		$json = json_decode($response, true);
		var_dump($json);
		$gain = $json["gain"] ?? 0;
		$cardName = $json["card"]["name"] ?? "Carte inconnue";
		$_SESSION["success_message"] = "$cardName a été vendu pour $gain ₽.";
		header("Location: " . $_SERVER["PHP_SELF"]);
		exit;
	} else {
		$json = json_decode($response, true);
		$message = $json["message"] ?? $json["Erreur"] ?? "Une erreur est survenue";
		echo "<div class='alert alert-danger'>Erreur ($httpCode) : $message</div>";
	}
}
?>

<?php if (!empty($successMessage)): ?>
	<div class="alert alert-success"><?= $successMessage ?></div>
<?php endif; ?>

<h1> <?= ucfirst($username) ?> - <?= $currency ?> ₽</h1>

<h2>Collection</h2>

<div class="d-flex flex-wrap gap-3">
	<?php foreach ($collection as $card): ?>
		<?php
		switch ($card["rarity"]) {
			case "common":
				$bg = "bg-light";
				break;
			case "rare":
				$bg = "bg-warning";
				break;
			case "legendary":
				$bg = "bg-danger";
				break;
		}
		$modalId = "modalCard" . $card["id"];
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
				<p class="card-text">x <?= $card["nb"] ?></p>
			</div>
		</div>

		<div class="modal fade" id="<?= $modalId ?>" tabindex="-1" aria-labelledby="<?= $modalId ?>Label"
			aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="<?= $modalId ?>Label"><?= $card["name"] ?> (<?= $card["rarity"] ?>)
						</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p class="card-text"><?= $card["description"] ?></p>
						<p>Tu possèdes <?= $card["nb"] ?> exemplaire(s).</p>
						<?php if ($card["nb"] >= 2): ?>
							<form method="POST">
								<input type="hidden" name="idcard" value="<?= $card["id"] ?>">
								<button type="submit" class="btn btn-success">Vendre 1 exemplaire </button>
							</form>
						<?php else: ?>
							<p class="text-muted">Pas de doublon, impossible à vendre.</p>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	<?php endforeach; ?>
</div>

<?php
require_once(BASE_PATH . "/includes/footer.php");
?>

