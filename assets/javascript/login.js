
class usuario{
    
    constructor(nombre, apellido,email, password, saldo){
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.saldo = saldo;
    }
    

}

$(document).ready(function () {
    console.log("Documento listo");
    var usuarios = InicializarUsuarios();
    console.log(usuarios);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
});

$("#idFormLogin").submit(function (e) {
    e.preventDefault();
    
    var email = $("#emailLogin").val();
    var password = $("#passwordLogin").val();

    // Redirigir al dashboard
    if (validarUsuario(email, password)){
        window.location.href = "dashboard.html";
    }else{
        alert("Usuario o contraseña incorrectos");
    }

});

var validarUsuario = function(email, password){
    // Simulación de validación de usuario
    let usuariosList = JSON.parse(localStorage.getItem("usuarios"));

    var usuario = usuariosList.find(function(usuarioActual){ 
        return usuarioActual.email === email; 
    });
    
    console.log(usuario);

    if(usuario == null) return false;

    if(password === usuario.password){
        sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
        alert("Bienvenido " + email);
        return true;
    }else{
        return false;
    }
        
};

var InicializarUsuarios = function(){
    var usuarios = [];
    usuarios.push(new usuario("Carolina", "Flores", "carolina@gmail.com", "123456", 10000000));
    usuarios.push(new usuario("Juan", "Perez", "juan@gmail.com", "123456", 2000));
    usuarios.push(new usuario("Maria", "Gomez", "maria@gmail.com", "123456", 3000));
    usuarios.push(new usuario("Admin", "Admin", "admin@gmail.com", "admin", 5000));
    return usuarios;
}