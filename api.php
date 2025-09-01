<?php
session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "skebops_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$action = $_GET['action'] ?? '';

if ($action === 'register') {
    $data = json_decode(file_get_contents("php://input"));
    $username = $conn->real_escape_string($data->username);
    $password = password_hash($data->password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "User registered successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
} elseif ($action === 'login') {
    $data = json_decode(file_get_contents("php://input"));
    $username = $conn->real_escape_string($data->username);
    $password = $data->password;

    $sql = "SELECT id, password FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            echo json_encode(["message" => "Login successful"]);
        } else {
            echo json_encode(["error" => "Invalid username or password"]);
        }
    } else {
        echo json_encode(["error" => "Invalid username or password"]);
    }
} elseif ($action === 'add') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents("php://input"));
    $name = $conn->real_escape_string($data->name);
    $price = $data->price;
    $image = $conn->real_escape_string($data->image);

    $sql = "INSERT INTO inventory (name, price, image, user_id) VALUES ('$name', $price, '$image', $user_id)";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "New record created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
} elseif ($action === 'get') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["items" => []]);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $sql = "SELECT id, name, price, image FROM inventory WHERE user_id = $user_id";
    $result = $conn->query($sql);
    $items = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    echo json_encode(["items" => $items]);
} elseif ($action === 'logout') {
    session_destroy();
    echo json_encode(["message" => "Logged out successfully"]);
}

$conn->close();
?>