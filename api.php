<?php
header('Content-Type: application/json');
// Reemplaza estos datos con tus credenciales si no usas la configuración por defecto
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "skebops_db";

// Crea la conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica si la conexión falló
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$action = $_GET['action'] ?? '';

if ($action === 'add') {
    // Si la acción es 'add', inserta un nuevo producto en la base de datos
    $data = json_decode(file_get_contents("php://input"));
    $name = $conn->real_escape_string($data->name);
    $price = $data->price;
    $image = $conn->real_escape_string($data->image);

    $sql = "INSERT INTO inventory (name, price, image) VALUES ('$name', $price, '$image')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "New record created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
} elseif ($action === 'get') {
    // Si la acción es 'get', recupera todos los productos
    $sql = "SELECT id, name, price, image FROM inventory";
    $result = $conn->query($sql);
    $items = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    }
    echo json_encode($items);
}

$conn->close();
?>