<?php
include('conexion.php');
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["success" => false, "mensaje" => "Datos inválidos"]);
        exit;
    }

    $usuario_id = $data['usuario_id'];
    $logro_id = $data['logro_id'];

    
    $sql = "INSERT INTO logros_jugadores (usuario_id, logro_id) VALUES (?, ?)";

  
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $usuario_id, $logro_id); 

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "mensaje" => "Logro guardado correctamente"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "mensaje" => "Error al guardar logro: " . $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();
}
?>
