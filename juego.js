const gameConsole = document.getElementById("console"); 
const userInput = document.getElementById("userInput");

// Variables 
let usuarioId = "";
let escenaActual = 0;
let nick = "";
let karma = 0;
let inventario = []; 
logroID = 0;

async function guardarLogro(usuarioId, logroID) {
    try {
        fetch("guardar_logros.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioId,
                logro_id: logroID
            })
        });
        console.log("Logro guardado correctamente");
    } catch (error) {
        console.error("Error al guardar logro:", error);
    }
}


async function actualizarLogro(logroID) {

    if (usuarioId !== null) {
        guardarLogro(usuarioId, logroID);  
    } else {
        console.log("Usuario no logueado o logro no válido");
    }
}

function agregarItem(nombre) {
    inventario.push({ nombre });
    printToConsole(`💼 Has obtenido: ${nombre}`);
}

async function checkUserSession() {
    try {
        const response = await fetch('obtener_sesion.php');
        const data = await response.json();
        
        if (data.loggedin) {
            usuarioId = data.usuario_id;
            nick = data.nick;
            iniciarDesdeProgreso();
        } else {
            mostrarLoginPrompt();
        }
    } catch (error) {
        console.error("Error checking session:", error);
    }
}

function mostrarLoginPrompt() {
    if (window.confirm("No tienes una sesión activa. ¿Quieres ir a la página de inicio para iniciar sesión?")) {
        window.location.href = "index.html"; 
    }
}

async function guardarProgreso() {
    try {
        await fetch("guardar_progreso.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioId,
                nick: nick,
                escena_actual: escenaActual,
                karma: karma,
                inventario: inventario
            })
        });
    } catch (error) {
        console.error("Error al guardar progreso:", error);
    }
}

async function iniciarDesdeProgreso() {
    try {
        const response = await fetch("cargar_progreso.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioId })
        });

        const data = await response.json();

        if (data.success && data.escena_actual !== null) { 
            escenaActual = parseInt(data.escena_actual, 10);
            nick = data.nick;
            karma = data.karma;
            inventario = data.inventario; 
            printToConsole(`Bienvenido de nuevo, ${nick}.`);  
            procesarEscena();  
        } else {
            startGame();
        }
    } catch (error) {
        console.error("Error al cargar el progreso:", error);
        startGame();  
    }
}

function printToConsole(text) {
    gameConsole.innerHTML += text + "\n";
    gameConsole.scrollTop = gameConsole.scrollHeight;
}

function startGame() {
    printToConsole("Te despiertas desorientado. Sientes los rayos del sol en tu rostro y el sonido de las olas a tu alrededor.");
    printToConsole("Al abrir los ojos ves la cara de un desconocido que te observa con curiosidad. Estáis en un barco. El desconocido te tiende una mano y te ayuda a ponerte en pie. \"Al fin despierto. Dime, ¿cuál es tu nombre?\"");
    escenaActual = 0;
}

function procesarEscena() {
    switch (escenaActual) {
        case 0:
            
            break;
        case 1:
            
            printToConsole("\n¿Quieres hacerle una pregunta al desconocido o quedarte en silencio? (preguntar / silencio)");
            break;
        case 2:
            printToConsole("\n¿Te gustaría explorar el barco o seguir hablando con el desconocido? (explorar / hablar)");
            break;
        case 3:
            printToConsole(`Tranquilo, ${nick}, muy pronto empezarás a recordar," dice, con una voz profunda y poderosa. Sus ojos parecen ver más allá de ti. "Permíteme presentarme: Mi nombre es Anora, aunque esta no es la primera ni la última vez que nos vemos, viejo amigo. Creo que esto te pertenece."`);
            agregarItem("Espada legendaria");
            printToConsole("🏆 Has recibido el logro: Espada del héroe");
            actualizarLogro(1);
            printToConsole("\nMiras la espada en tus manos. Es ligera, pero sientes un gran poder fluir a través de ella.");
            printToConsole("Anora sonríe levemente. \"Esa espada solo responde a su verdadero dueño. Pronto entenderás tu propósito.\"");
            printToConsole("¿Qué quieres hacer con la espada? (examinar / preguntar / guardar)");
            break;
        case 4:
            printToConsole("\nDe repente, el barco se sacude violentamente. Un viento gélido y ensordecedor se apodera de todo. Algo está ocurriendo. \"¡Nos han encontrado!\", grita un elfo desde la proa.");
            printToConsole("¿Quieres correr hacia la proa para ver qué ocurre o quedarte junto a Anora? (investigar / quedarte)");
            break;
        case 5:
            printToConsole("\n¿Quieres empuñar tu espada y enfrentarlos o buscar refugio? (luchar / huir)");
            break;
        
        case 6:
            printToConsole("Cuando va a alzar su espada, le clavas la tuya. El espectro emite un chillido agudo y cae al suelo, inerte.");
        default:
            printToConsole("\nLa historia ha terminado por ahora.");
            break;
    }
}

function procesarComando(decision) {
    decision = decision.trim().toLowerCase();

    switch (escenaActual) {
        case 0:
            if (decision) {
                nick = decision;
                escenaActual = 1;
                guardarProgreso();
                printToConsole(`\n${nick}, ¿eh? Un buen nombre.`);
                printToConsole("\"Bienvenido a bordo. Espero que tengas buen equilibrio.\"");
                printToConsole("\nEl desconocido se ríe. Sientes el vaivén del barco.");
            } else {
                printToConsole("\nEl desconocido te mira con impaciencia. \"Vamos, dime tu nombre.\"");
                return;
            }
            escenaActual = 1;
            break;
        case 1:
            if (decision === "preguntar") {
                printToConsole("\n\"¿Dónde estamos?\", preguntas.");
                printToConsole("\"En el Gran Mar, rumbo a Valinor.\"");
            } else if (decision === "silencio") {
                printToConsole("\nNo dices nada. El desconocido sonríe.");
                printToConsole("\"Sabes, el silencio es una respuesta poderosa.\"");
            } else {
                printToConsole("\nOpción inválida. Escribe 'preguntar' o 'silencio'.");
                return;
            }
            escenaActual = 2;
            break;
        case 2:
            if (decision === "explorar") {
                printToConsole("Miras a tu alrededor. Estás rodeado de elfos. Algunos te miran con curiosidad, mientras que otros dirigen su vista hacia el horizonte, oteando algo que tú no alcanzas a ver. Hay un cierto sentimiento reverencial en el ambiente.");
                printToConsole("Una mujer misteriosa aparece repentinamente a tu lado, asustándote.");
            } else if (decision === "hablar") {
                printToConsole("\"¿Por qué no puedo recordar nada? ¿Qué hago aquí?\", preguntas.");
                printToConsole("\"Creo que ella podrá explicártelo mejor que nadie.\" El desconocido se limita a señalar a una figura que ha aparecido repentinamente a tu lado, asustándote.");
            } else {
                printToConsole("\nOpción inválida. Escribe 'explorar' o 'hablar'.");
                return;
            }
            escenaActual = 3;
            
            break;
        case 3:
            if (decision === "examinar") {
                printToConsole("\nObservas la espada con más atención. Su hoja reluce con un brillo etéreo, y un antiguo grabado recorre la empuñadura.");
                printToConsole("\"Ese símbolo... creo que lo he visto antes\", murmuras.");
                printToConsole("La mujer asiente. \"Es un fragmento de la historia que olvidaste. Pronto lo recordarás.\"");
            } else if (decision === "preguntar") {
                printToConsole("\n\"¿Por qué me das esto?\", preguntas, dubitativo.");
                printToConsole("\"Porque es tu destino. El Ojo de Valinor te espera, y solo tú puedes protegerlo.\"");
            } else if (decision === "guardar") {
                printToConsole("\nDecides guardar la espada en tu cinturón. No es momento de hacer preguntas.");
                printToConsole("La mujer asiente con aprobación. \"Eres más sabio de lo que crees.\"");
            } else {
                printToConsole("\nOpción inválida. Escribe 'examinar', 'preguntar' o 'guardar'.");
                return;
            }
            escenaActual = 4;
            break;
        case 4:
            if (decision === "investigar") {
                printToConsole("\nTe apresuras hacia la proa. Un grupo de elfos ha desenvainado sus armas.");
                printToConsole("\"¡Son los Nâzgul!\", exclama uno de ellos.");
                printToConsole("Un escalofrío recorre tu espalda. Desde el cielo, figuras oscuras montadas en bestias aladas descienden rápidamente.");
            
            } else if (decision === "quedarte") {
                printToConsole("\nAnora parece tranquila, como si ya supiera lo que va a ocurrir.");
                printToConsole("\"No temas. La batalla es inevitable, pero aún puedes elegir cómo afrontarla.\"");
                printToConsole("Un grito de advertencia resuena por el barco. \"¡Los Nâzgul están aquí!\"");
            } else {
                printToConsole("\nOpción inválida. Escribe 'investigar' o 'quedarte'.");
                return;
            }
            escenaActual = 5;
            break;
        case 5:
            if (decision === "luchar") {
                karma+=10;
                printToConsole("🏆 Has recibido el logro: Impávido ante el el peligro.");
                actualizarLogro(2);
                printToConsole("\nDesenvainas tu espada y te unes al grupo de elfos guerreros.");
                printToConsole("Uno de los Nâzgul se abalanza sobre ti con su espada negra. Su aura helada te corta la respiración, pero resistes y esquivas su primer ataque.");
        
            } else if (decision === "huir") {
                karma -=10;
                printToConsole("\nIntentando no llamar mucho la atención, te escondes entre unos barriles cercanos. Los elfos luchan con valentía, pero muchos de ellos caen.");
                printToConsole("Uno de los Nâzgul se acerca hasta tu escondite. Intentas escabullirte, pero su espada cae sobre ti con celeridad.");
            } else {
                printToConsole("\nOpción inválida. Escribe 'luchar' o 'huir'.");
                return;
            }
            escenaActual = 6;
            break;
    }
    
    guardarProgreso();
    procesarEscena();
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        let decision = userInput.value;
        userInput.value = ""; 
        printToConsole("> " + decision);
        procesarComando(decision);
    }
});

checkUserSession();