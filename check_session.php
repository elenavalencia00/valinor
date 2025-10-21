<?php
session_start();


if (!isset($_SESSION['usuario_id'])) {
    echo json_encode('no_logueado');
    exit();
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "juego_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$usuario_id = $_SESSION['usuario_id'];


$sql_usuario = "SELECT u.usuario, u.email, p.nick, p.escena_actual, p.karma, p.inventario 
                FROM usuarios u 
                LEFT JOIN progreso p ON u.usuario_id = p.usuario_id 
                WHERE u.usuario_id = ?";

$stmt_usuario = $conn->prepare($sql_usuario);
$stmt_usuario->bind_param("i", $usuario_id);
$stmt_usuario->execute();
$result_usuario = $stmt_usuario->get_result();


$sql_logros = "SELECT l.logro_id, l.logro_nombre, l.descripcion 
               FROM logros l 
               INNER JOIN logros_jugadores lj ON l.logro_id = lj.logro_id 
               WHERE lj.usuario_id = ?";

$stmt_logros = $conn->prepare($sql_logros);
$stmt_logros->bind_param("i", $usuario_id);
$stmt_logros->execute();
$result_logros = $stmt_logros->get_result();


$datos = array();

if ($result_usuario->num_rows > 0) {
    $datos['usuario'] = $result_usuario->fetch_assoc();
    
    
    if (!empty($datos['usuario']['inventario'])) {
        $datos['usuario']['inventario'] = json_decode($datos['usuario']['inventario'], true);
    } else {
        $datos['usuario']['inventario'] = array();
    }
}


$datos['logros'] = array();
while ($row = $result_logros->fetch_assoc()) {
    $datos['logros'][] = $row;
}


$stmt_usuario->close();
$stmt_logros->close();
$conn->close();


header('Content-Type: application/json');
echo json_encode($datos);
?>