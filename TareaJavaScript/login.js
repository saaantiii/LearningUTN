var usuario;
var contrasenia;

function login() {
//    var usuario = document.getElementById('user').value;
//    console.log(user);
//    var contrasenia = document.getElementById('password').value;
    var username = document.getElementById("username").value;
    console.log(username);
    var password = document.getElementById("password").value;
    console.log(password);
    if (username == "administrador" && password == "1234") {
        alert ("Bienvenido");
        location.assign = "/TareaJavaScript/home.html";
    }
    else {
        alert ("Error de logue")
        location.assign = "/TareaJavaScript/login.html";
    }
}