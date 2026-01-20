const MONTO_MINIMO = 10;

$(document).ready(function() {
  let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (!loggedUser) {
    window.location.href = "login.html";
    return;
  }
  
  $("#saldoDisponible").text("$" + parseFloat(loggedUser.saldo).toFixed(2));

  $("#montoDeposito").on("input", function() {
    calcularResumen();
  });

  $("#bancoOrigen").on("change", function() {
    const bancoSeleccionado = $(this).find("option:selected").text();
    $("#resumenBanco").text(bancoSeleccionado);
  });
});

function calcularResumen() {
  const monto = parseFloat($("#montoDeposito").val()) || 0;

  $("#montoResumen").text("$" + monto.toFixed(2));
  $("#totalResumen").text("$" + monto.toFixed(2));
}

$("#idFormDeposit").submit(function(e) {
  e.preventDefault();

  const bancoOrigen = $("#bancoOrigen").val();
  const tipoCuentaOrigen = $("#tipoCuentaOrigen").val();
  const numeroCuentaOrigen = $("#numeroCuentaOrigen").val();
  const monto = parseFloat($("#montoDeposito").val());
  const descripcion = $("#descripcion").val();

  if (!bancoOrigen) {
    alert("Por favor selecciona un banco de origen");
    return;
  }

  if (!tipoCuentaOrigen) {
    alert("Por favor selecciona un tipo de cuenta");
    return;
  }

  if (!numeroCuentaOrigen || numeroCuentaOrigen.length < 10) {
    alert("Por favor ingresa un número de cuenta válido (mínimo 10 dígitos)");
    return;
  }

  if (monto < MONTO_MINIMO) {
    alert("El monto mínimo a depositar es $" + MONTO_MINIMO);
    return;
  }

  if (monto > 1000000) {
    alert("El monto excede el límite permitido");
    return;
  }

  const bancoSeleccionado = $("#bancoOrigen").find("option:selected").text();
  const tipoCuentaTexto = $("#tipoCuentaOrigen").find("option:selected").text();

  $("#modalBancoOrigen").text(bancoSeleccionado);
  $("#modalTipoCuenta").text(tipoCuentaTexto);
  $("#modalNumeroCuenta").text("****" + numeroCuentaOrigen.slice(-4));
  $("#modalMonto").text("$" + monto.toFixed(2));

  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  modal.show();
});

$("#btnConfirmarDeposito").click(function() {
  const bancoOrigen = $("#bancoOrigen").val();
  const tipoCuentaOrigen = $("#tipoCuentaOrigen").val();
  const numeroCuentaOrigen = $("#numeroCuentaOrigen").val();
  const monto = parseFloat($("#montoDeposito").val());
  const descripcion = $("#descripcion").val();
  
  const transaccion = {
    id: "DEP" + Date.now(),
    tipo: "deposito",
    monto: monto,
    persona: "Depósito desde " + $("#bancoOrigen").find("option:selected").text(),
    bancoOrigen: bancoOrigen,
    tipoCuenta: tipoCuentaOrigen,
    numeroCuenta: numeroCuentaOrigen,
    descripcion: descripcion,
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().split(" ")[0].substring(0, 5),
    estado: "Completado",
    icono: "fa-plus-circle",
    color: "#ffd93d",
    user: JSON.parse(sessionStorage.getItem("loggedUser")).email
  };

  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  transacciones.unshift(transaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));

  let usuario = JSON.parse(sessionStorage.getItem("loggedUser"));
  if (usuario) {
    usuario.saldo = (parseFloat(usuario.saldo) + monto).toFixed(2);
    sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.map(u => {
      if (u.email === usuario.email) {
        u.saldo = usuario.saldo;
      }
      return u;
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  alert("¡Depósito realizado exitosamente! Se han depositado $" + monto.toFixed(2) + " a tu cuenta Alke Wallet.");

  $("#idFormDeposit")[0].reset();
  calcularResumen();
  $("#resumenBanco").text("");

  bootstrap.Modal.getInstance(document.getElementById("modalConfirmacion")).hide();

  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1500);
});
