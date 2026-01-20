const transaccionesEjemplo = [];

$(document).ready(function() {
  
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || transaccionesEjemplo;
  
  if (!localStorage.getItem("transacciones")) {
    localStorage.setItem("transacciones", JSON.stringify(transaccionesEjemplo));
  }
  
  cargarTransacciones(transacciones);
  
  $("#filtroTipo").on("change", function() {
    const filtro = $(this).val();
    const transaccionesFiltradas = filtro ? transacciones.filter(t => t.tipo === filtro) : transacciones;
    cargarTransacciones(transaccionesFiltradas);
  });
});

function cargarTransacciones(transacciones) {
  let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const contenedor = $("#listaTransacciones");
  const sinTransacciones = $("#sinTransacciones");
  
  contenedor.empty();
  
  if (transacciones.length === 0) {
    sinTransacciones.show();
    return;
  }
  sinTransacciones.hide();
  
  transacciones.filter(tx => tx.user === loggedUser.email)
    .forEach(function(transaccion) {
      const tipoTexto = obtenerTextoTipo(transaccion.tipo);
      const signo = transaccion.tipo === "deposito" ? "+" : "-";
      const colorTexto = transaccion.tipo === "deposito" ? "#4ecdc4" : "#ff6b6b";
      
      const html = `
        <div class="transaccion-item mb-3 p-3" style="border: 1px solid #e0e0e0; border-radius: 10px; cursor: pointer;" data-transaccion='${JSON.stringify(transaccion)}'>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div style="width: 45px; height: 45px; border-radius: 50%; background-color: ${transaccion.color}; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <i class="fas ${transaccion.icono}" style="color: white; font-size: 1.2rem;"></i>
              </div>
              <div>
                <p class="mb-0" style="font-weight: 600; color: #333;">${tipoTexto}</p>
                <p class="mb-0" style="font-size: 0.85rem; color: #999;">${transaccion.persona}</p>
                <p class="mb-0" style="font-size: 0.75rem; color: #bbb;">${transaccion.fecha} ${transaccion.hora}</p>
              </div>
            </div>
            <div style="text-align: right;">
              <p class="mb-0" style="font-weight: 700; color: ${colorTexto}; font-size: 1.1rem;">${signo}$${transaccion.monto.toFixed(2)}</p>
              <p class="mb-0" style="font-size: 0.75rem; color: #4caf50;">${transaccion.estado}</p>
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
  $("#detallesEstado").html(`<span style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 5px;">${transaccion.estado}</span>`);
  $("#detallesReferencia").text(transaccion.id);
  
  const modal = new bootstrap.Modal(document.getElementById("modalDetalles"));
  modal.show();
}

function agregarTransaccion(tipo, monto, persona, estado = "Completado") {
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0];
  const hora = ahora.toTimeString().split(" ")[0].substring(0, 5);
  
  const tiposIconos = {
    "deposito": { icono: "fa-plus-circle", color: "#ffd93d" },
    "transferencia": { icono: "fa-paper-plane", color: "#4ecdc4" },
  };
  
  const config = tiposIconos[tipo] || { icono: "fa-circle", color: "#ccc" };
  
  const nuevaTransaccion = {
    id: "TRX" + Date.now(),
    tipo: tipo,
    monto: monto,
    persona: persona,
    fecha: fecha,
    hora: hora,
    estado: estado,
    icono: config.icono,
    color: config.color
  };
  
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  transacciones.unshift(nuevaTransaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
}
