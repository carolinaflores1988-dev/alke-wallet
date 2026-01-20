$(document).ready(function () {
    $("#idFormLogin").submit(function (e) {
        e.preventDefault();
        
        const email = $("#emailLogin").val();
        const password = $("#passwordLogin").val();

        if (validarUsuario(email, password)) {
            window.location.href = "dashboard.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
});

function validarUsuario(email, password) {
    const usuariosList = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuariosList.find(u => u.email === email);
    
    if (usuario && usuario.password === password) {
        sessionStorage.setItem("loggedUser", JSON.stringify(usuario));
        return true;
    }
    return false;
}
