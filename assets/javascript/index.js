class Usuario {
    constructor(nombre, apellido, email, password, saldo) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.saldo = saldo;
    }
}

$(document).ready(function() {
    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem("usuarios", JSON.stringify(inicializarUsuarios()));
    }
  
    $("#formRegistro").submit(function(e) {
        e.preventDefault();

        const nombre = $("#regNombre").val();
        const apellido = $("#regApellido").val();
        const email = $("#regEmail").val();
        const password = $("#regPassword").val();

        if (!nombre || !apellido || !email || !password) {
            alert("Por favor completa todos los campos");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        if (usuarios.some(u => u.email === email)) {
            alert("El correo electrónico ya está registrado");
            return;
        }

        const nuevoUsuario = new Usuario(nombre, apellido, email, password, 0);
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        
        $("#formRegistro")[0].reset();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistro'));
        modal.hide();
    });
});

function inicializarUsuarios() {
    return [
        new Usuario("Carolina", "Flores", "carolina@gmail.com", "123456", 10000000),
        new Usuario("Juan", "Perez", "juan@gmail.com", "123456", 2000),
        new Usuario("Maria", "Gomez", "maria@gmail.com", "123456", 3000),
        new Usuario("Admin", "Admin", "admin@gmail.com", "admin", 5000)
    ];
}