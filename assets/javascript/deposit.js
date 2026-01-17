// Configuración de depósitos
const MONTO_MINIMO = 10;

// Cargar saldo desde localStorage o sessionStorage
$(document).ready(function() {
  let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (loggedUser) {
    $("#saldoDisponible").text("$" + parseFloat(loggedUser.saldo).toFixed(2));
  }

  console.log("Pantalla de depósito cargada");

  // Actualizar resumen cuando cambia el monto
  $("#montoDeposito").on("input", function() {
    calcularResumen();
  });

  // Actualizar banco en el resumen cuando cambia
  $("#bancoOrigen").on("change", function() {
    const bancoSeleccionado = $(this).find("option:selected").text();
    $("#resumenBanco").text(bancoSeleccionado);
  });
});

// Función para calcular el resumen
function calcularResumen() {
  const monto = parseFloat($("#montoDeposito").val()) || 0;

  // Actualizar valores en el resumen
  $("#montoResumen").text("$" + monto.toFixed(2));
  $("#totalResumen").text("$" + monto.toFixed(2));
}

// Envío del formulario
$("#idFormDeposit").submit(function(e) {
  e.preventDefault();

  const bancoOrigen = $("#bancoOrigen").val();
  const tipoCuentaOrigen = $("#tipoCuentaOrigen").val();
  const numeroCuentaOrigen = $("#numeroCuentaOrigen").val();
  const monto = parseFloat($("#montoDeposito").val());
  const descripcion = $("#descripcion").val();

  // Validaciones
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

  // Obtener nombre del banco
  const bancoSeleccionado = $("#bancoOrigen").find("option:selected").text();
  const tipoCuentaTexto = $("#tipoCuentaOrigen").find("option:selected").text();

  // Mostrar modal de confirmación
  $("#modalBancoOrigen").text(bancoSeleccionado);
  $("#modalTipoCuenta").text(tipoCuentaTexto);
  $("#modalNumeroCuenta").text("****" + numeroCuentaOrigen.slice(-4));
  $("#modalMonto").text("$" + monto.toFixed(2));

  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  modal.show();
});

// Confirmación final del depósito
$("#btnConfirmarDeposito").click(function() {
  const bancoOrigen = $("#bancoOrigen").val();
  const tipoCuentaOrigen = $("#tipoCuentaOrigen").val();
  const numeroCuentaOrigen = $("#numeroCuentaOrigen").val();
  const monto = parseFloat($("#montoDeposito").val());
  const descripcion = $("#descripcion").val();
  
  // Crear objeto de transacción
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
    color: "#ffd93d"
  };

  // Guardar transacción en localStorage
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  transacciones.unshift(transaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));

  // Actualizar saldo en sessionStorage
  let usuario = JSON.parse(sessionStorage.getItem("loggedUser"));
  if (usuario) {
    usuario.saldo = (parseFloat(usuario.saldo) + monto).toFixed(2);
    sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
  }

  console.log("Depósito confirmado:", transaccion);

  // Mostrar mensaje de éxito
  alert("¡Depósito realizado exitosamente! Se han depositado $" + monto.toFixed(2) + " a tu cuenta Alke Wallet.");

  // Limpiar formulario
  $("#idFormDeposit")[0].reset();
  calcularResumen();
  $("#resumenBanco").text("");

  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById("modalConfirmacion")).hide();

  // Redirigir al dashboard después de 1.5 segundos
  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1500);
});
