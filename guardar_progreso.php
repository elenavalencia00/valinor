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
    $nick = $data['nick'];
    $escena_actual = $data['escena_actual'];
    $karma = $data['karma'];
    $inventario = isset($data['inventario']) ? json_encode($data['inventario']) : "[]"; 

   
    $sql = "INSERT INTO progreso (usuario_id, nick, escena_actual, karma, inventario)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            escena_actual = VALUES(escena_actual), karma = VALUES(karma), inventario = VALUES(inventario)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiss", $usuario_id, $nick, $escena_actual, $karma, $inventario);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "mensaje" => "Progreso guardado correctamente"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "mensaje" => "Error al guardar progreso: " . $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();
}
?>