$(document).ready(function () {
    let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    console.log(loggedUser);
    $("#nombreUsuario").text("Hola, " + loggedUser.nombre);
    $("#saldoDisponible").text("$" + loggedUser.saldo);

    $("#btnCerrarSesion").click(function() {
      if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        sessionStorage.clear();
        window.location.href = "login.html";
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