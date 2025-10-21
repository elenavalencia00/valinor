<?php
include('conexion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $email = $_POST['email'];
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_DEFAULT); 

    $sql = "INSERT INTO usuarios (usuario, email, contraseña) VALUES ('$usuario', '$email', '$contraseña')";

    if ($conn->query($sql) === TRUE) {
        
        header("Location: index.html?registro=exitoso");
    } else {
        echo "Error: " . $conn->error;
    }
}
?>

?>
