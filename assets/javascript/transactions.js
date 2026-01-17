// Transacciones de ejemplo (en una aplicación real vendrían de una base de datos)
const transaccionesEjemplo = [
  {
    id: "TRX001",
    tipo: "deposito",
    monto: 500.00,
    persona: "Carolina Flores",
    fecha: "2026-01-12",
    hora: "14:30",
    estado: "Completado",
    icono: "fa-plus-circle",
    color: "#ffd93d"
  },
  {
    id: "TRX002",
    tipo: "transferencia",
    monto: 250.50,
    persona: "Juan García",
    fecha: "2026-01-11",
    hora: "10:15",
    estado: "Completado",
    icono: "fa-paper-plane",
    color: "#4ecdc4"
  },
  {
    id: "TRX003",
    tipo: "retiro",
    monto: 100.00,
    persona: "Banco BBVA",
    fecha: "2026-01-10",
    hora: "09:45",
    estado: "Completado",
    icono: "fa-money-bill-wave",
    color: "#ff6b6b"
  },
  {
    id: "TRX004",
    tipo: "transferencia",
    monto: 150.00,
    persona: "María López",
    fecha: "2026-01-09",
    hora: "16:20",
    estado: "Completado",
    icono: "fa-paper-plane",
    color: "#4ecdc4"
  },
  {
    id: "TRX005",
    tipo: "deposito",
    monto: 1000.00,
    persona: "Salario",
    fecha: "2026-01-08",
    hora: "11:00",
    estado: "Completado",
    icono: "fa-plus-circle",
    color: "#ffd93d"
  },
  {
    id: "TRX006",
    tipo: "retiro",
    monto: 300.00,
    persona: "Banco Santander",
    fecha: "2026-01-07",
    hora: "13:30",
    estado: "Completado",
    icono: "fa-money-bill-wave",
    color: "#ff6b6b"
  },
  {
    id: "TRX007",
    tipo: "transferencia",
    monto: 75.25,
    persona: "Pedro Sánchez",
    fecha: "2026-01-06",
    hora: "15:45",
    estado: "Completado",
    icono: "fa-paper-plane",
    color: "#4ecdc4"
  }
];

// Cargar transacciones al abrir la página
$(document).ready(function() {
  console.log("Pantalla de historial cargada");
  
  // Obtener transacciones (en una aplicación real, vendrían del servidor)
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || transaccionesEjemplo;
  
  // Guardar transacciones en localStorage si no existen
  if (!localStorage.getItem("transacciones")) {
    localStorage.setItem("transacciones", JSON.stringify(transaccionesEjemplo));
  }
  
  // Cargar y mostrar transacciones
  cargarTransacciones(transacciones);
  
  // Evento para filtrar por tipo
  $("#filtroTipo").on("change", function() {
    const filtro = $(this).val();
    const transaccionesFiltradas = filtro ? transacciones.filter(t => t.tipo === filtro) : transacciones;
    cargarTransacciones(transaccionesFiltradas);
  });
});

// Función para cargar y mostrar transacciones
function cargarTransacciones(transacciones) {
  const contenedor = $("#listaTransacciones");
  const sinTransacciones = $("#sinTransacciones");
  
  // Limpiar contenedor
  contenedor.empty();
  
  // Verificar si hay transacciones
  if (transacciones.length === 0) {
    sinTransacciones.show();
    return;
  }
  
  sinTransacciones.hide();
  
  // Crear HTML para cada transacción
  transacciones.forEach(function(transaccion) {
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
  
  // Evento para abrir detalles
  $(".transaccion-item").on("click", function() {
    const transaccion = JSON.parse($(this).attr("data-transaccion"));
    mostrarDetalles(transaccion);
  });
}

// Función para obtener texto del tipo de transacción
function obtenerTextoTipo(tipo) {
  const tipos = {
    "deposito": "Depósito",
    "transferencia": "Transferencia",
    "retiro": "Retiro"
  };
  return tipos[tipo] || tipo;
}

// Función para mostrar detalles de la transacción
function mostrarDetalles(transaccion) {
  const tipoTexto = obtenerTextoTipo(transaccion.tipo);
  const signo = transaccion.tipo === "deposito" ? "+" : "-";
  
  // Llenar modal con datos
  $("#detallesTipo").text(tipoTexto);
  $("#detallesMonto").text(`${signo}$${transaccion.monto.toFixed(2)}`);
  $("#detallesPersona").text(transaccion.persona);
  $("#detallesFecha").text(transaccion.fecha);
  $("#detallesHora").text(transaccion.hora);
  $("#detallesEstado").html(`<span style="background-color: #4caf50; color: white; padding: 3px 8px; border-radius: 5px;">${transaccion.estado}</span>`);
  $("#detallesReferencia").text(transaccion.id);
  
  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalDetalles"));
  modal.show();
}

// Función para agregar una nueva transacción (para usar desde otras pantallas)
function agregarTransaccion(tipo, monto, persona, estado = "Completado") {
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0];
  const hora = ahora.toTimeString().split(" ")[0].substring(0, 5);
  
  const tiposIconos = {
    "deposito": { icono: "fa-plus-circle", color: "#ffd93d" },
    "transferencia": { icono: "fa-paper-plane", color: "#4ecdc4" },
    "retiro": { icono: "fa-money-bill-wave", color: "#ff6b6b" }
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
  
  // Obtener transacciones existentes
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  
  // Agregar nueva transacción al inicio
  transacciones.unshift(nuevaTransaccion);
  
  // Guardar en localStorage
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
  
  console.log("Nueva transacción agregada:", nuevaTransaccion);
}
