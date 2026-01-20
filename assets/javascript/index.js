class usuario{
    
    constructor(nombre, apellido,email, password, saldo){
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.saldo = saldo;
    }
    

}


$(document).ready(function() {
    var usuarios = JSON.parse(localStorage.getItem("usuarios")) || InicializarUsuarios();
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
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

        const nuevoUsuario = new usuario(nombre, apellido, email, password, 0);

        usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar si el usuario ya existe
        if (usuarios.some(u => u.email === email)) {
            alert("El correo electrónico ya está registrado");
            return;
        }

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        $("#formRegistro")[0].reset();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistro'));
        modal.hide();
    });
});

var InicializarUsuarios = function(){
    var usuarios = [];
    usuarios.push(new usuario("Carolina", "Flores", "carolina@gmail.com", "123456", 10000000));
    usuarios.push(new usuario("Juan", "Perez", "juan@gmail.com", "123456", 2000));
    usuarios.push(new usuario("Maria", "Gomez", "maria@gmail.com", "123456", 3000));
    usuarios.push(new usuario("Admin", "Admin", "admin@gmail.com", "admin", 5000));
    return usuarios;
}