<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = mysqli_connect('localhost', 'root', 'root', 'recipe');
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }  
    $username = $connection->real_escape_string($_POST["username"]);
    $password = $connection->real_escape_string($_POST["password"]);

    $sql = "SELECT * FROM users WHERE LOWER(username) = LOWER('$username') AND password = '$password'";

    $result = $connection->query($sql);
    if(mysqli_num_rows($result) > 0) {
        echo 'success';
    } else {
        echo "Login failed";
    }

    mysqli_close($connection);
}  
?>