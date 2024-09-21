<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = mysqli_connect('localhost', 'root', 'root', 'recipe');
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $userid = $connection->real_escape_string($_POST[userid]);
    $recipeName = $connection->real_escape_string($_POST[recipeName]);
    $recipeDescription = $connection->real_escape_string($_POST[recipeDescription]);
    $prepTime = $connection->real_escape_string($_POST[prepTime]);
    $cookTime = $connection->real_escape_string($_POST[cookTime]);
    $servings = $connection->real_escape_string($_POST[recipeServings]);
    $recipeIngredients = $connection->real_escape_string($_POST[recipeIngredients]);
    $ingredientQuantity = $connection->real_escape_string($_POST[ingredientsQuantity]);
    $recipeInstructions = $connection->real_escape_string($_POST[recipeInstructions]);
    $created_at = date("Y-m-d H:i:s");
    
    $sql = "INSERT INTO recipes (recipe_name, description, prep_time, cook_time, servings, created_at, user_id) VALUES ('$recipeName', '$recipeDescription', '$prepTime', '$cookTime', '$servings', '$created_at', '$userid')";
    $result = $connection->query($sql);

    if ($result) {
        $recipe_id = $connection->insert_id;
        $ingredients = explode("\n", $recipeIngredients);
        $quantities = explode("\n", $ingredientQuantity);
        $instructions = explode("\n", $recipeInstructions);
        foreach ($ingredients as $key => $ingredient) {
            $ingredient = $connection->real_escape_string($ingredient);
            $quantity = $connection->real_escape_string($quantities[$key]);
            $sql = "INSERT INTO ingredients (recipe_id, ingredient, quantity) VALUES ('$recipe_id', '$ingredient', '$quantity')";
            $result = $connection->query($sql);
        }
        foreach ($instructions as $instruction) {
            $instruction = $connection->real_escape_string($instruction);
            $sql = "INSERT INTO instructions (recipe_id, instruction) VALUES ('$recipe_id', '$instruction')";
            $result = $connection->query($sql);
        }
        echo "Recipe submitted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $connection->error;
    }
}
?>