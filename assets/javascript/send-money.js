const COMISION_PORCENTAJE = 0.01;

$(document).ready(function() {
  let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  if (!loggedUser) {
    window.location.href = "login.html";
    return;
  }

  $("#saldoDisponible").text("$" + loggedUser.saldo);
  $("#maxMonto").text("Monto máximo a Transferir $" + loggedUser.saldo);
  cargarContactosSelect();
  
  $("#btnAgregarContacto").click(function() {
    const modal = new bootstrap.Modal(document.getElementById("modalNuevoContacto"));
    modal.show();
  });

  $("#btnGuardarContacto").click(function() {
    const contacto = guardarNuevoContacto();
    if (contacto) {
      cargarContactosSelect();
      $("#selectContacto").val(contacto.cuenta);
      cargarCuentaSeleccionada(contacto.cuenta);
    }
  });

  function cargarCuentaSeleccionada(cuentaSeleccionada) {
    if (!cuentaSeleccionada) {
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

  $("#selectContacto").on("change", function() {
    const cuentaSeleccionada = $(this).val();
    cargarCuentaSeleccionada(cuentaSeleccionada);
  });
});

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
function calcularResumen() {
  const monto = parseFloat($("#montoTransferencia").val()) || 0;
  const comision = monto * COMISION_PORCENTAJE;
  const total = monto + comision;

  $("#montoResumen").text("$" + monto.toFixed(2));
  $("#comisionResumen").text("$" + comision.toFixed(2));
  $("#totalResumen").text("$" + total.toFixed(2));
}

$("#idFormTransfer").submit(function(e) {
  e.preventDefault();

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const monto = parseFloat($("#montoTransferencia").val());
  const banco = $("#banco").val();
  const tipoCuenta = $("#tipoCuenta").val();
  const numeroCuenta = $("#numeroCuenta").val();
  const nombreTitular = $("#nombreTitular").val();
  const rutTitular = $("#rutTitular").val();
  const comision = monto * COMISION_PORCENTAJE;
  const total = monto + comision;

  if (monto <= 0) {
    alert("Por favor ingresa un monto válido");
    return;
  }

  if (numeroCuenta.length < 10) {
    alert("Por favor ingresa un número de cuenta válido");
    return;
  }

  if (total > parseFloat(loggedUser.saldo)) {
    alert("Saldo insuficiente para realizar esta transferencia (incluyendo comisión).");
    return;
  }

  const opcionBanco = $("#banco option:selected").text();

  $("#modalBanco").text(opcionBanco);
  $("#modalCuenta").text(tipoCuenta + " - " + numeroCuenta);
  $("#modalTitular").text(nombreTitular);
  $("#modalMonto").text("$" + monto.toFixed(2));
  $("#modalComision").text("$" + comision.toFixed(2));
  $("#modalTotal").text("$" + total.toFixed(2));

  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  modal.show();
});

$("#btnConfirmarTransfer").click(function() {
  const banco = $("#banco").val();
  const tipoCuenta = $("#tipoCuenta").val();
  const numeroCuenta = $("#numeroCuenta").val();
  const nombreTitular = $("#nombreTitular").val();
  const rutTitular = $("#rutTitular").val();
  const monto = parseFloat($("#montoTransferencia").val());
  const total = monto * (1 + COMISION_PORCENTAJE);
  
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
    usuario.saldo = (parseFloat(usuario.saldo) - total).toFixed(2);
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
  return nuevoContacto;
}
