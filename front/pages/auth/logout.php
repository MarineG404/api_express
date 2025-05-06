<?php

require_once(__DIR__ . '../../../config.php');
require_once(BASE_PATH . "/includes/header.php");

	$data = [
		"token" => $_SESSION["token"] ?? ""
	];
	// Initialiser cURL
	$ch = curl_init(API_BASE_URL . "/disconnect");
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
		$_SESSION = array();
		session_destroy();
		header(header: "Location: " . BASE_URL . "index.php");
	} else {
		$json = json_decode($response, true);
		$message = $json["message"] ?? $json["Erreur"] ?? "Une erreur est survenue";
		echo "<div class='alert alert-danger'>Erreur ($httpCode) : $message</div>";
	}

	require_once(BASE_PATH . "/includes/footer.php");

