<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = mysqli_connect('localhost', 'root', 'root', 'recipe');
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $userid = $connection->real_escape_string($_POST["userId"]);
    $recipeName = $connection->real_escape_string($_POST["recipeName"]);
    $recipeDescription = $connection->real_escape_string($_POST["recipeDescription"]);
    $prepTime = $connection->real_escape_string($_POST["prepTime"]);
    $cookTime = $connection->real_escape_string($_POST["cookTime"]);
    $servings = $connection->real_escape_string($_POST["recipeServings"]);
    $recipeImage = $connection->real_escape_string($_POST["recipeImage"]);
    $recipeIngredients = $_POST['recipeIngredients'];
    $recipeInstructions = $_POST["recipeInstructions"];
    $created_at = date("Y-m-d H:i:s");
    
    $prepTime = !empty($prepTime) ? $prepTime : 0;
    $cookTime = !empty($cookTime) ? $cookTime : 0;
    $servings = !empty($servings) ? $servings : 0;

    $sql = "INSERT INTO recipe (recipe_name, description, prep_time, cook_time, servings, created_at, user_id) VALUES ('$recipeName', '$recipeDescription', '$prepTime', '$cookTime', '$servings', '$created_at', '$userid')";
    $result = $connection->query($sql);

    if ($result) {
        $recipe_id = $connection->insert_id;

        foreach ($recipeIngredients as $ingredient) {
            $ingredient = $connection->real_escape_string($ingredient);
            $sql = "INSERT INTO recipe_ingredient (recipe_id, ingredient) VALUES ('$recipe_id', '$ingredient')";
            $result = $connection->query($sql);
            if (!$result) {
                echo "Error: " . $sql . "<br>" . $connection->error;
            }
        }
        $stepCount = 1;
        foreach ($recipeInstructions as $instruction) {
            $instruction = $connection->real_escape_string($instruction);
            $sql = "INSERT INTO recipe_step (recipe_id, step_number, instruction) VALUES ('$recipe_id', '$stepCount', '$instruction')";
            $result = $connection->query($sql);
            if (!$result) {
                echo "Error: " . $sql . "<br>" . $connection->error;
            }
        }

        $sql = "INSERT INTO recipe_images (recipe_id, user_id, image) VALUES ('$recipe_id','$userid', '$recipeImage')";
        $result = $connection->query($sql);
        if (!$result) {
            echo "Error: " . $sql . "<br>" . $connection->error;
        }

        echo "Recipe submitted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $connection->error;
    }
}
?>