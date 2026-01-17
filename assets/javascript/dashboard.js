$(document).ready(function () {
    let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    console.log(loggedUser);
    $("#nombreUsuario").text("Hola, " + loggedUser.nombre);
    $("#saldoDisponible").text("$" + loggedUser.saldo);

    // Función para cerrar sesión
    $("#btnCerrarSesion").click(function() {
      if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        // Limpiar localStorage
        localStorage.removeItem("usuarioActual");
        localStorage.clear();
        // Redirigir a login
        window.location.href = "login.html";
      }
    });

    // Función para ir a transferir
    $("#btnTransferir").click(function() {
      window.location.href = "send-money.html";
    });

    // Función para ir a depositar
    $("#btnDeposito").click(function() {
      window.location.href = "deposit.html";
    });

    // Función para ir al historial
    $("#btnHistorial").click(function() {
      window.location.href = "transactions.html";
    });
});