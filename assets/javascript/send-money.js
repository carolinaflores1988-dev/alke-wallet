// Configuración de comisión (1%)
const COMISION_PORCENTAJE = 0.01;

// Cargar saldo desde localStorage
$(document).ready(function() {
  console.log("Pantalla de transferencia cargada");
  
  // Evento para abrir modal de agregar contacto
  $("#btnAgregarContacto").click(function() {
    const modal = new bootstrap.Modal(document.getElementById("modalNuevoContacto"));
    modal.show();
  });

  // Evento para guardar nuevo contacto
  $("#btnGuardarContacto").click(function() {
    guardarNuevoContacto();
  });
});

// Actualizar resumen cuando cambia el monto
$("#montoTransferencia").on("input", function() {
  calcularResumen();
});

// Función para calcular el resumen
function calcularResumen() {
  const monto = parseFloat($("#montoRetiro").val()) || 0;
  const comision = monto * COMISION_PORCENTAJE;
  const total = monto + comision;

  // Actualizar valores en el resumen
  $("#montoResumen").text("$" + monto.toFixed(2));
  $("#comisionResumen").text("$" + comision.toFixed(2));
  $("#totalResumen").text("$" + total.toFixed(2));
}

// Envío del formulario
$("#idFormTransfer").submit(function(e) {
  e.preventDefault();

  const monto = parseFloat($("#montoTransferencia").val());
  const banco = $("#banco").val();
  const tipoCuenta = $("#tipoCuenta").val();
  const numeroCuenta = $("#numeroCuenta").val();
  const nombreTitular = $("#nombreTitular").val();
  const rutTitular = $("#rutTitular").val();
  const comision = monto * COMISION_PORCENTAJE;
  const total = monto + comision;

  // Validaciones
  if (monto <= 0) {
    alert("Por favor ingresa un monto válido");
    return;
  }

  if (numeroCuenta.length < 10) {
    alert("Por favor ingresa un número de cuenta válido");
    return;
  }

  // Obtener nombre del banco
  const opcionBanco = $("#banco option:selected").text();

  // Mostrar modal de confirmación
  $("#modalBanco").text(opcionBanco);
  $("#modalCuenta").text(tipoCuenta + " - " + numeroCuenta);
  $("#modalTitular").text(nombreTitular);
  $("#modalMonto").text("$" + monto.toFixed(2));
  $("#modalComision").text("$" + comision.toFixed(2));
  $("#modalTotal").text("$" + total.toFixed(2));

  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  modal.show();
});

// Confirmación final de la transferencia
$("#btnConfirmarTransfer").click(function() {
  const banco = $("#banco").val();
  const tipoCuenta = $("#tipoCuenta").val();
  const numeroCuenta = $("#numeroCuenta").val();
  const nombreTitular = $("#nombreTitular").val();
  const rutTitular = $("#rutTitular").val();
  const monto = parseFloat($("#montoTransferencia").val());
  
  // Crear objeto de transacción
  const transaccion = {
    id: "TRF" + Date.now(),
    tipo: "transferencia",
    monto: monto,
    persona: nombreTitular,
    banco: banco,
    tipoCuenta: tipoCuenta,
    numeroCuenta: numeroCuenta,
    rut: rutTitular,
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().split(" ")[0].substring(0, 5),
    estado: "Completado",
    icono: "fa-paper-plane",
    color: "#4ecdc4"
  };

  // Guardar transacción en localStorage
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  transacciones.unshift(transaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));

  // Actualizar saldo en sessionStorage
  let usuario = JSON.parse(sessionStorage.getItem("loggedUser"));
  if (usuario) {
    usuario.saldo = (parseFloat(usuario.saldo) - monto).toFixed(2);
    sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
  }

  console.log("Transferencia confirmada:", transaccion);

  // Mostrar mensaje de éxito
  alert("¡Transferencia realizada exitosamente! Se ha transferido $" + monto.toFixed(2) + " a " + nombreTitular);

  // Limpiar formulario y redirigir
  $("#idFormTransfer")[0].reset();
  calcularResumen();

  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById("modalConfirmacion")).hide();

  // Redirigir al dashboard después de 1.5 segundos
  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1500);
});

// Función para guardar nuevo contacto
function guardarNuevoContacto() {
  const nombre = $("#contactoNombre").val();
  const email = $("#contactoEmail").val();
  const banco = $("#contactoBanco").val();
  const cuenta = $("#contactoCuenta").val();

  // Validaciones
  if (!nombre || !email || !banco || !cuenta) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (cuenta.length < 10) {
    alert("Por favor ingresa un número de cuenta válido");
    return;
  }

  // Crear objeto contacto
  const nuevoContacto = {
    nombre: nombre,
    email: email,
    banco: banco,
    cuenta: cuenta
  };

  // Obtener contactos del localStorage
  let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
  
  // Verificar que no exista un contacto con la misma cuenta
  const contactoExistente = contactos.find(c => c.cuenta === cuenta);
  if (contactoExistente) {
    alert("Este contacto ya existe");
    return;
  }

  // Agregar nuevo contacto
  contactos.push(nuevoContacto);
  localStorage.setItem("contactos", JSON.stringify(contactos));

  // Mostrar mensaje de éxito
  alert("¡Contacto agregado exitosamente!");

  // Limpiar formulario
  $("#idFormNuevoContacto")[0].reset();

  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById("modalNuevoContacto")).hide();

  console.log("Contactos guardados:", contactos);
}
