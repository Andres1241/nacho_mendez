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
    $earning_rate = $data->earningRate;

    $sql = "INSERT INTO inventory (name, price, image, user_id, earning_rate) VALUES ('$name', $price, '$image', $user_id, $earning_rate)";

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
    $sql = "SELECT id, name, price, image, generated_income, acquisition_date, earning_rate FROM inventory WHERE user_id = $user_id";
    $result = $conn->query($sql);
    $items = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $acquisition_time = strtotime($row['acquisition_date']);
            $current_time = time();
            $time_elapsed = $current_time - $acquisition_time;
            $new_income = $time_elapsed * $row['earning_rate'];
            
            if ($new_income > $row['generated_income']) {
                $row['generated_income'] = $new_income;
                $update_sql = "UPDATE inventory SET generated_income = $new_income WHERE id = {$row['id']}";
                $conn->query($update_sql);
            }
            $items[] = $row;
        }
    }
    echo json_encode(["items" => $items]);
} elseif ($action === 'logout') {
    session_destroy();
    echo json_encode(["message" => "Logged out successfully"]);
}

elseif ($action === 'get_top_users') {
    $sql = "
        SELECT
            u.id,
            u.username,
            COUNT(i.id) AS skebop_count,
            SUM(i.price) AS total_value
        FROM users u
        LEFT JOIN inventory i ON u.id = i.user_id
        GROUP BY u.id
        ORDER BY total_value DESC, skebop_count DESC;
    ";
    
    $result = $conn->query($sql);
    $top_users = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $user_id = $row['id'];
            $inventory_sql = "SELECT name, price FROM inventory WHERE user_id = $user_id";
            $inventory_result = $conn->query($inventory_sql);
            $inventory = [];
            if ($inventory_result->num_rows > 0) {
                while($item_row = $inventory_result->fetch_assoc()) {
                    $inventory[] = $item_row;
                }
            }
            $row['inventory'] = $inventory;
            $top_users[] = $row;
        }
    }
    echo json_encode(["top_users" => $top_users]);
}

$conn->close();
?>