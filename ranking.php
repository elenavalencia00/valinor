<?php

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$database = "juego_db";


$conn = new mysqli($servername, $username, $password, $database);


if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}


$sql = "SELECT u.usuario AS usuario, p.karma 
        FROM usuarios u 
        JOIN progreso p ON u.usuario_id = p.usuario_id 
        ORDER BY p.karma DESC";

$result = $conn->query($sql);

$ranking_luz = [];
$ranking_oscuridad = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($row['karma'] >= 10) {
            $ranking_luz[] = $row;
        } elseif ($row['karma'] <= -10) {
            $ranking_oscuridad[] = $row;
        }
    }
}


$conn->close();
header('Content-Type: application/json');
echo json_encode(["luz" => $ranking_luz, "oscuridad" => $ranking_oscuridad]);
?>
