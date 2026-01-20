$(document).ready(function() {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  
  if (!loggedUser) {
    window.location.href = "login.html";
    return;
  }
  
  const transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  cargarTransacciones(transacciones);
  
  $("#filtroTipo").on("change", function() {
    const filtro = $(this).val();
    const transaccionesFiltradas = filtro ? transacciones.filter(t => t.tipo === filtro) : transacciones;
    cargarTransacciones(transaccionesFiltradas);
  });
});

function cargarTransacciones(transacciones) {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const contenedor = $("#listaTransacciones");
  const sinTransacciones = $("#sinTransacciones");
  
  contenedor.empty();
  
  const misTransacciones = transacciones.filter(tx => tx.user === loggedUser.email);
  
  if (misTransacciones.length === 0) {
    sinTransacciones.removeClass("d-none");
    return;
  }
  sinTransacciones.addClass("d-none");
  
  misTransacciones.forEach(function(transaccion) {
      const tipoTexto = obtenerTextoTipo(transaccion.tipo);
      const signo = transaccion.tipo === "deposito" ? "+" : "-";
      const colorTexto = transaccion.tipo === "deposito" ? "#4ecdc4" : "#ff6b6b";
      
      const html = `
        <div class="transaccion-item mb-3 p-3" data-transaccion='${JSON.stringify(transaccion)}'>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div class="transaccion-icono" style="background-color: ${transaccion.color};">
                <i class="fas ${transaccion.icono}"></i>
              </div>
              <div>
                <p class="mb-0 transaccion-texto-tipo">${tipoTexto}</p>
                <p class="mb-0 transaccion-texto-persona">${transaccion.persona}</p>
                <p class="mb-0 transaccion-texto-fecha">${transaccion.fecha} ${transaccion.hora}</p>
              </div>
            </div>
            <div style="text-align: right;">
              <p class="mb-0 transaccion-monto" style="color: ${colorTexto};">${signo}$${transaccion.monto.toFixed(2)}</p>
              <p class="mb-0 transaccion-estado">${transaccion.estado}</p>
            </div>
          </div>
        </div>
      `;
      
      contenedor.append(html);
  });
  
  $(".transaccion-item").on("click", function() {
    const transaccion = JSON.parse($(this).attr("data-transaccion"));
    mostrarDetalles(transaccion);
  });
}

function obtenerTextoTipo(tipo) {
  const tipos = {
    "deposito": "Depósito",
    "transferencia": "Transferencia"
  };
  return tipos[tipo] || tipo;
}

function mostrarDetalles(transaccion) {
  const tipoTexto = obtenerTextoTipo(transaccion.tipo);
  const signo = transaccion.tipo === "deposito" ? "+" : "-";
  
  $("#detallesTipo").text(tipoTexto);
  $("#detallesMonto").text(`${signo}$${transaccion.monto.toFixed(2)}`);
  $("#detallesPersona").text(transaccion.persona);
  $("#detallesFecha").text(transaccion.fecha);
  $("#detallesHora").text(transaccion.hora);
  $("#detallesEstado").html(`<span class="badge-estado">${transaccion.estado}</span>`);
  $("#detallesReferencia").text(transaccion.id);
  
  const modal = new bootstrap.Modal(document.getElementById("modalDetalles"));
  modal.show();
}
