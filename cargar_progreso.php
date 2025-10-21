<?php
header("Content-Type: application/json");
require 'conexion.php'; 

$data = json_decode(file_get_contents("php://input"), true);
$usuario_id = $data['usuario_id'];

$query = "SELECT * FROM progreso WHERE usuario_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    echo json_encode([
        "success" => true,
        "escena_actual" => $row["escena_actual"],
        "nick" => $row["nick"],
        "karma" => $row["karma"],
        "inventario" => json_decode($row["inventario"], true)
    ]);
} else {
    echo json_encode(["success" => false]);
}
?>
