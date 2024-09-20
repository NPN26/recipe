<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = mysqli_connect('localhost', 'root', 'root', 'recipe');
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $user_id = rand(1000, 9999);
    $sql_test = "SELECT * FROM users WHERE user_id = '$user_id'";
    $result_test = mysqli_query($connection, $sql_test);
    while (mysqli_num_rows($result_test) > 0) {
        $user_id = rand(1000, 9999);
        $sql_test = "SELECT * FROM users WHERE user_id = '$user_id'";
        $result_test = mysqli_query($connection, $sql_test);
    }

    $name = $connection->real_escape_string($_POST["username"]);
    $email = $connection->real_escape_string($_POST["email"]);
    $password = $connection->real_escape_string($_POST["password"]);
    $created_at = date("Y-m-d H:i:s");

    $sql = "INSERT INTO users (user_id, username, email, password, created_at) VALUES ('$user_id', '$name', '$email', '$password', '$created_at')";
    $result = $connection->query($sql);

    if ($result) {
        echo "User registered successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $connection->error;
    }

    mysqli_close($connection);
}
?>