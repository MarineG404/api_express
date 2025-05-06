<?php

require_once(__DIR__ . '../../../config.php');
require_once(BASE_PATH . "/includes/header.php");

// if (isset($_SESSION["token"])){
// 	header("Location: pages/error/denied.php");
// }

if ($_SERVER["REQUEST_METHOD"] === "POST") {
	$username = $_POST["username"] ?? "";
	$password = $_POST["password"] ?? "";

	$data = [
		"username" => $username,
		"password" => $password
	];
	error_log(json_encode($data));

	if (empty($username) || empty($password)) {
		echo "<div class='alert alert-danger'>Veuillez remplir tous les champs.</div>";
		exit;
	}

	// Initialiser cURL
	$ch = curl_init(API_BASE_URL . "login");
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
		echo "<div class='alert alert-success'>Inscription réussie !</div>";
		if ($user_token = json_decode($response, true)["data"]["token"] ?? "") {
			$_SESSION["token"] = $user_token;
		}
		header("Location: " . BASE_URL . "index.php");
	} else {
		$json = json_decode($response, true);
		$message = $json["message"] ?? $json["Erreur"] ?? "Une erreur est survenue";
		echo "<div class='alert alert-danger'>Erreur ($httpCode) : $message</div>";
	}
}

?>

<form method="POST">
	<fieldset>
		<div class="row">
			<h1>Connexion</h1>
			<div class="mb-3">
				<label for="username" class="form-label">Nom d"utilisateur</label>
				<input type="text" class="form-control" id="username" name="username" required>
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Mot de passe</label>
				<input type="password" class="form-control" id="password" name="password" required>
			</div>
			<button type="submit" class="btn btn-primary">Se connecter</button>
		</div>
	</fieldset>
</form>

<?php
require_once(BASE_PATH . "/includes/footer.php");
?>
