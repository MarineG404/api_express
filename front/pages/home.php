<?php
require_once(__DIR__ . '/../config.php');
require_once(BASE_PATH . "/includes/header.php");
?>

<div class="container">
	<div class="row">
		<div class="col-md-12 text-center">
			<h1>Bienvenue sur le site Pokémon</h1>

			<?php if (!isset($_SESSION["token"])): ?>
				<p>Connectez-vous pour accéder à votre compte.</p>
				<a href="<?= BASE_URL; ?>pages/auth/login.php" class="btn btn-primary">Se connecter</a>
				<p class="mt-3">
					Pas encore de compte ?
					<a href="<?= BASE_URL; ?>pages/auth/register.php">Inscrivez-vous ici</a>
				</p>
			<?php else: ?>
				<p>Bienvenue, dresseur.euse !</p>
				<a href="<?= BASE_URL; ?>pages/auth/user.php" class="btn btn-success m-2">Voir ma collection</a>
				<a href="<?= BASE_URL; ?>pages/booster.php" class="btn btn-warning m-2">Ouvrir un booster</a>
			<?php endif; ?>

			<a href="<?= BASE_URL; ?>pages/cards.php" class="btn btn-info m-2">Voir les cartes disponibles</a>
		</div>
	</div>
</div>

<?php
require_once(BASE_PATH . "/includes/footer.php");
?>

