var numero1; //declaracion de la primera variable
var numero2; //declaracion de la segunda variable
var resultado; //declaracion de la variable donde se guardara el resultado
function inicio() { //primera funcion
    numero1 = prompt("Ingrese el primer numero: "); //solicitud de ingreso de la primera variable por el usuario
    numero1 = parseFloat(numero1);                  //se transforma la variable ingresada por el usuario en numero
    if(!numero1) {                                  //se controla que la variabla numero1 se un numero
        alert("Inserte un numero valido")           //si la condicion se cumple aparece una alerta y
        inicio();                                   //vuelve a iniciar la funcion
    }                                               //termina la condicion
    numero2 = prompt("Ingrese el segundo numero: ");//se solicita que ingrese la segunda variable y realiza el mismo procedimiento que en el anterior punto
    numero2 = parseFloat(numero2);
    if(!numero2) {
        alert("Inserte un numero valido")
        inicio();
    }
}
function sumar() {                                  //funcion SUMAR
    resultado = numero1 + numero2;                  //se toman las dos variable ingresadas por el usuario y el resultado se guarda en la variable "resultado"
    result.innerHTML = (resultado);                 //la variable "resultado" se lo coloca en <div> con el id=result se lo puede encontrar en el archivo HTML
}
function restar() {
    resultado = numero1 - numero2;
    result.innerHTML = (resultado);
}
function dividir() {
    resultado = numero1 / numero2;
    result.innerHTML = (resultado);
}
function multiplicar() {
    resultado = numero1 * numero2;
    result.innerHTML = (resultado);
}