<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = mysqli_connect('localhost', 'root', 'root', 'recipe');
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $recipeName = $connection->real_escape_string($_POST[recipeName]);
    $recipeDescription = $connection->real_escape_string($_POST[recipeDescription]);
    $prepTime = $connection->real_escape_string($_POST[prepTime]);
    $cookTime = $connection->real_escape_string($_POST[cookTime]);
    $servings = $connection->real_escape_string($_POST[recipeServings]);
    $recipeIngredients = $connection->real_escape_string($_POST[recipeIngredients]);
    $recipeInstructions = $connection->real_escape_string($_POST[recipeInstructions]);
    $created_at = date("Y-m-d H:i:s");
    
    $sql = "INSERT INTO recipes (recipe_name, description, prep_time, cook_time, servings, created_at) VALUES ('$recipeName', '$recipeDescription', '$prepTime', '$cookTime', '$servings', '$recipeIngredients', '$recipeInstructions', '$created_at')";
}
?>