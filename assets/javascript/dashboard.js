$(document).ready(function () {
    let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

    if (!loggedUser) {
        window.location.href = "login.html";
        return;
    }

    $("#nombreUsuario").text("Hola, " + loggedUser.nombre);
    $("#saldoDisponible").text("$" + loggedUser.saldo);

    $("#btnCerrarSesion").click(function() {
      if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.removeItem("loggedUser");
        window.location.href = "index.html";
      }
    });

    $("#btnTransferir").click(function() {
      window.location.href = "send-money.html";
    });

    $("#btnDeposito").click(function() {
      window.location.href = "deposit.html";
    });

    $("#btnHistorial").click(function() {
      window.location.href = "transactions.html";
    });
});