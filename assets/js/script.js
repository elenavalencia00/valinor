$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registro') === 'exitoso') {
        alert("Registro exitoso. Puedes iniciar sesión a continuación.");
    }

    $.ajax({
        url: 'check_session.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response === 'no_logueado') {
                $('#form-container').html(`
                    <div class="form" id="login-form">
                        <img src="assets/images/login.png" alt="Imagen decorativa" class="form-image">
                        <h2 class="text-center">Iniciar Sesión</h2>
                        <form id="loginForm">
                            <div class="mb-3">
                                <label>Email:</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Contraseña:</label>
                                <input type="password" name="contraseña" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-success">Iniciar Sesión</button>
                        </form>
                        <p>¿No tienes cuenta? <a href="#" id="register-link">Regístrate aquí</a></p>
                    </div>
                    <div class="form" id="register-form" style="display:none;">
                        <h2 class="text-center">Crear Cuenta</h2>
                        <form action="procesar_registro.php" method="POST">
                            <div class="mb-3">
                                <label>Usuario:</label>
                                <input type="text" name="usuario" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Email:</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Contraseña:</label>
                                <input type="password" name="contraseña" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-success">Crear Cuenta</button>
                        </form>
                        <p>¿Ya tienes cuenta? <a href="#" id="login-link">Inicia sesión aquí</a></p>
                    </div>
                `);

                $('#register-link').click(function(e) {
                    e.preventDefault();
                    $('#login-form').hide();
                    $('#register-form').show();
                });

                $('#login-link').click(function(e) {
                    e.preventDefault();
                    $('#register-form').hide();
                    $('#login-form').show();
                });

               
                $('#loginForm').submit(function(event) {
                    event.preventDefault(); 

                    $.ajax({
                        url: 'procesar_login.php',
                        method: 'POST',
                        data: $(this).serialize(),
                        dataType: 'json',
                        success: function(response) {
                            if (response.success) {
                                window.location.href = "index.html"; 
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: response.mensaje
                                });
                            }
                        },
                        error: function(xhr, status, error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error de conexión',
                                text: 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.'
                            });
                        }
                    });
                });

            } else {
                const usuario = response.usuario;
                const logros = response.logros;

                let inventarioHTML = '<p>Inventario vacío</p>';
                if (usuario.inventario && usuario.inventario.length > 0) {
                    inventarioHTML = '<ul class="lista">';
                    usuario.inventario.forEach(item => {
                        inventarioHTML += `<li class="lista-item">${item.nombre}</li>`;
                    });
                    inventarioHTML += '</ul>';
                }

                let logrosHTML = '<p>Aún no has conseguido ningún logro</p>';
                if (logros && logros.length > 0) {
                    logrosHTML = '<ul class="lista">';
                    logros.forEach(logro => {
                        logrosHTML += `
                            <li class="lista">
                                <h5>${logro.logro_nombre}</h5>
                                ${logro.descripcion}
                            </li>`;
                    });
                    logrosHTML += '</ul>';
                }

                $('#form-container').html(`
                    <div class="perfil-container">
                        <h2>Bienvenido, <span>${usuario.usuario}</span></h2>
                        <p>Estadísticas de tu personaje: ${usuario.nick || 'No establecido'}</p>
                        
                        <div class="cuerpo">
                            
                                <img src="assets/images/inventario.png" alt="Inventario" class="inventario-img">
                            
                            <div class="cuerpo">
                                ${inventarioHTML}
                            </div>
                        </div>
                        
                        <div class="cuerpo">
                            
                                <img src="assets/images/logros.png" alt="Logros" class="logros-img">
                           
                            <div class="cuerpo">
                                ${logrosHTML}
                            </div>
                        </div>
                        
                        <a href="cerrar_sesion.php" class="btn btn-danger">Cerrar sesión</a>
                    </div>
                `);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al verificar la sesión:", error);
            $('#form-container').html(`
                <div class="alert alert-danger">
                    Error. Por favor, inténtalo de nuevo más tarde.
                </div>
            `);
        }
    });
});
