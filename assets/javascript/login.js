$(document).ready(function () {
    
});

$("#idFormLogin").submit(function (e) {
    e.preventDefault();
    
    var email = $("#emailLogin").val();
    var password = $("#passwordLogin").val();

    if (validarUsuario(email, password)){
        window.location.href = "dashboard.html";
    }else{
        alert("Usuario o contraseña incorrectos");
    }

});

var validarUsuario = function(email, password){
    let usuariosList = JSON.parse(localStorage.getItem("usuarios"));
    var usuario = usuariosList.find(function(usuarioActual){ 
        return usuarioActual.email === email; 
    });
    
    if(usuario == null) return false;

    if(password === usuario.password){
        sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
        return true;
    }else{
        return false;
    }
        
};

