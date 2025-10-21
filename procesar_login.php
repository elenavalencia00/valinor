<?php
include('conexion.php');
session_start();

header('Content-Type: application/json'); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $contraseña = trim($_POST['contraseña']);

    if (empty($email) || empty($contraseña)) {
        echo json_encode(["success" => false, "mensaje" => "Por favor, rellena todos los campos."]);
        exit();
    }

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        
        if (password_verify($contraseña, $row['contraseña'])) {
            $_SESSION['usuario_id'] = $row['usuario_id']; 
            $_SESSION['usuario'] = $row['usuario'];

            echo json_encode([
                "success" => true,
                "usuario_id" => $row['usuario_id'],
                "usuario" => $row['usuario']
            ]);
            exit();
        } else {
            echo json_encode(["success" => false, "mensaje" => "Contraseña incorrecta."]);
            exit();
        }
    } else {
        echo json_encode(["success" => false, "mensaje" => "Usuario no encontrado."]);
        exit();
    }
} else {
    echo json_encode(["success" => false, "mensaje" => "Método no permitido."]);
    exit();
}
?>
