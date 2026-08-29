//variables globales

let nombrePro = document.querySelector("#productos-select");
let precioPro = document.querySelector("#precio-pro");
let descripcionPro = document.querySelector("#descripcion-pro");
let stockPro = document.querySelector("#stock-pro");
let imagenPro = document.querySelector("#imagen-pro");
let btnCrear = document.querySelector("#btn-crear");

//evento click al boton
btnCrear.addEventListener("click", ()=> {
    //alert("okk");
    let producto = validForm();
    console.log(producto);
});

//validar informacion del formulario
function validForm() {
    let pro;
    if(nombrePro.value && precioPro.value && stockPro.value){
        pro = {
            nombre: nombrePro.value,
            descripcion: descripcionPro.value,
            precio: precioPro.value,
            stock: stockPro.value,
            imagen: imagenPro.value
        }
    }
    else{
        alert("Faltan campos obligatorios");
    }

    return pro;
}
