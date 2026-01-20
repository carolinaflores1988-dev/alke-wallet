// Configuración de comisión (1%)
const COMISION_PORCENTAJE = 0.01;

// Cargar saldo desde localStorage
$(document).ready(function() {
  let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  $("#saldoDisponible").text("$" + loggedUser.saldo);
  $("#maxMonto").text("Monto máximo a Transferir $" + loggedUser.saldo);
  cargarContactosSelect();
  // Evento para abrir modal de agregar contacto
  $("#btnAgregarContacto").click(function() {
    const modal = new bootstrap.Modal(document.getElementById("modalNuevoContacto"));
    modal.show();
  });

  // Evento para guardar nuevo contacto
  $("#btnGuardarContacto").click(function() {
    contacto =guardarNuevoContacto();
    cargarContactosSelect();
    $("#selectContacto").val(contacto.cuenta);
    cargarCuentaSeleccionada(contacto.cuenta);
  });

  function cargarCuentaSeleccionada(cuentaSeleccionada) {
    if (!cuentaSeleccionada) {
      // Limpiar campos si no hay selección
      $("#banco").val("");
      $("#numeroCuenta").val("");
      $("#nombreTitular").val("");
      return;
    }
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const contacto = contactos.find(c => c.cuenta === cuentaSeleccionada);
    if (contacto) {
      $("#banco").val(contacto.banco);
      $("#numeroCuenta").val(contacto.cuenta);
      $("#nombreTitular").val(contacto.nombre);
      $("#tipoCuenta").val(contacto.tipoCuenta);
      $("#rutTitular").val(contacto.rut);
    }

  }

  // Evento para cargar datos del contacto seleccionado
  $("#selectContacto").on("change", function() {
    const cuentaSeleccionada = $(this).val();
    cargarCuentaSeleccionada(cuentaSeleccionada);
  });
});

// Actualizar resumen cuando cambia el monto
$("#montoTransferencia").on("input", function() {
  calcularResumen();
});

function cargarContactosSelect() {
  const select = $("#selectContacto");
  select.empty();
  select.append('<option value="">Selecciona un contacto</option>');

  const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
  contactos.forEach(contacto => {
    select.append(`<option value="${contacto.cuenta}" data-nombre="${contacto.nombre}" data-banco="${contacto.banco}">${contacto.nombre} - ${contacto.cuenta}</option>`);
  });
}
// Función para calcular el resumen
function calcularResumen() {
  const monto = parseFloat($("#montoTransferencia").val()) || 0;
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
    color: "#4ecdc4",
    user: JSON.parse(sessionStorage.getItem("loggedUser")).email
  };

  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  transacciones.unshift(transaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
  let usuario = JSON.parse(sessionStorage.getItem("loggedUser"));
  
  if (usuario) {
    usuario.saldo = (parseFloat(usuario.saldo) - monto).toFixed(2);
    sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
  }
  alert("¡Transferencia realizada exitosamente! Se ha transferido $" + monto.toFixed(2) + " a " + nombreTitular);

  $("#idFormTransfer")[0].reset();
  calcularResumen();

  bootstrap.Modal.getInstance(document.getElementById("modalConfirmacion")).hide();

  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 1500);
});

function guardarNuevoContacto() {
  const nombre = $("#contactoNombre").val();
  const email = $("#contactoEmail").val();
  const banco = $("#contactoBanco").val();
  const tipoCuenta = $("#contactoTipoCuenta").val();
  const cuenta = $("#contactoCuenta").val();
  const rut = $("#contactoRutTitular").val();

  if (!nombre || !email || !banco || !cuenta) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (cuenta.length < 10) {
    alert("Por favor ingresa un número de cuenta válido");
    return;
  }

  const nuevoContacto = {
    nombre: nombre,
    email: email,
    banco: banco,
    cuenta: cuenta,
    rut: rut,
    tipoCuenta: tipoCuenta
  };

  let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
  
  const contactoExistente = contactos.find(c => c.cuenta === cuenta);
  if (contactoExistente) {
    alert("Este contacto ya existe");
    return;
  }

  contactos.push(nuevoContacto);
  localStorage.setItem("contactos", JSON.stringify(contactos));
  alert("¡Contacto agregado exitosamente!");
  $("#idFormNuevoContacto")[0].reset();

  bootstrap.Modal.getInstance(document.getElementById("modalNuevoContacto")).hide();
  return nuevoContacto
}
