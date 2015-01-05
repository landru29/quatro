<!doctype html>
<html>
	<head>

		<title>Changement des textures</title>

		<meta charset="utf-8">
	</head>
	<body>
		<form method="post" action="upload.php" enctype="multipart/form-data">
		     <input type="file" name="texture" id="icone" /><br />
		     <select name="what">
				  <option value="material">Plateau</option>
				  <option value="texture1">Player1</option>
				  <option value="texture2">Player2</option>
				</select>
		    <input type="submit" name="submit" value="Envoyer" />
		</form>
		<?php

		if ($_POST['what'])
		{
			$dest =  dirname(__FILE__) . '/img/' . $_POST['what'] . '.jpg';
			copy($_FILES['texture']['tmp_name'], $dest);
			echo 'image chargée pour ' . $_POST['what'] . '<br>';
		}
		?>
	</body>
</html>