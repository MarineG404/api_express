<nav class="navbar navbar-expand-lg bg-primary mb-4">
	<div class="container-fluid">
		<a class="navbar-brand" href="<?= BASE_URL; ?>">Pokémon</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav me-auto">
				<li class="nav-item">
					<a class="nav-link" href="<?= BASE_URL; ?>pages/cards.php">Cartes</a>
				</li>
				<?php if (isset($_SESSION['token'])): ?>
					<li class="nav-item">
						<a class="nav-link" href="<?= BASE_URL; ?>pages/booster.php">Booster</a>
					</li>
				<?php endif; ?>
			</ul>
			<ul class="navbar-nav">
				<?php if (isset($_SESSION['token'])): ?>
					<li class="nav-item">
						<a class="nav-link" href="<?= BASE_URL; ?>pages/auth/user.php">Mon Profil</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="<?= BASE_URL; ?>pages/auth/logout.php">Déconnexion</a>
					</li>
				<?php else: ?>
					<li class="nav-item">
						<a class="nav-link" href="<?= BASE_URL; ?>pages/auth/login.php">Connexion</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="<?= BASE_URL; ?>pages/auth/register.php">Inscription</a>
					</li>
				<?php endif; ?>
		</div>
	</div>
</nav>
