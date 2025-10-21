<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "juego_db"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}
?>