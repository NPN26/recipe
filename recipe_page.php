<?php
    $connection = mysqli_connect('localhost', 'root', 'root', 'recipe');
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $recipe_id = isset($_GET['recipe_id']) ? (int)$_GET['recipe_id'] : "./recipe_page.html";
    $sql = "SELECT * FROM recipe WHERE recipe_id = '$recipe_id'";

    $stmt = $connection->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $recipe = $result->fetch_assoc();
        $recipe_id = $recipe['recipe_id'];
        $recipe_name = $recipe['recipe_name'];
        $description = $recipe['description'];
        $prep_time = $recipe['prep_time'];
        $cook_time = $recipe['cook_time'];
        $servings = $recipe['servings'];
        $created_at = $recipe['created_at'];

        $sql = "SELECT * FROM recipe_ingredient WHERE recipe_id = '$recipe_id'";
        $stmt = $connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $recipe_ingredients = [];
        while ($row = $result->fetch_assoc()) {
            $recipe_ingredients[] = $row['ingredient'];
        }

        $sql = "SELECT * FROM recipe_step WHERE recipe_id = '$recipe_id'";
        $stmt = $connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $recipe_steps = [];
        while ($row = $result->fetch_assoc()) {
            $recipe_steps[] = $row['instruction'];
        }

        $sql = "SELECT * FROM recipe_images WHERE recipe_id = '$recipe_id'";
        $stmt = $connection->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $recipe_images = $result->fetch_assoc();

    } else {
        echo "Recipe not found";
    }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recipe</title>
    <link rel="stylesheet" href="" />
  </head>
  <body>
    <h1>
        <?php echo $recipe_name; ?>
    </h1>
    <section>
        <div>
            <h3>Prep time</h2>
            <p><?php echo $prep_time; ?> mins</p>
        </div>
        <div>
            <h3>Cook time</h2>
            <p><?php echo $cook_time; ?> mins</p>
        </div>
        <div>
            <h3>Servings</h2>
            <p><?php echo $servings; ?></p>
        </div>
    </section>
    <section>
        <div id="recipe-details">
            <div id="ingredients">
                <h2>Ingredients</h2>
                <ul>
                    <?php foreach ($recipe_ingredients as $ingredient) { ?>
                        <li><?php echo $ingredient; ?></li>
                    <?php } ?>
                </ul>
            </div>
            <div id="instructions">
                <h2>Instructions</h2>
                <ol>
                    <?php foreach ($recipe_steps as $step) { ?>
                        <li><?php echo $step; ?></li>
                    <?php } ?>
                </ol>
            </div>
        </div>
        <div id="image-container">
            <img id="recipe-image" src="$image" alt="Recipe Image" />
        </div>
    </section>
    <div id="created-at">
        <p>Created at: <?php echo $created_at; ?></p>
    </div>
  </body>
</html> 