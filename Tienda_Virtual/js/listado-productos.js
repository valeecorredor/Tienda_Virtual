// variables globales
let tablaPro = document.getElementById("tabla-productos");

//agregar evento a la pagina, identifica cada vez que se recargue la pagina
document.addEventListener("DOMContentLoaded", ()=>{
    getProductos();
});

//funcion para realizar la peticion HTTP a la BD
async function getProductos(){
    try {
        let url = "http://localhost:3000/api/productos";
        let data = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "json/application"
            }
    });
    let products = await data.json();
    console.log(products);
    //mostrar productos al usuario en la tabla
    products.forEach((pro, i) => {
        let fila= document.createElement("tr");
        fila.innerHTML = `
        <td>${ (i+1)}</td>
        <td>${pro.nombre}</td>
        <td>${pro.descripcion}</td>
        <td>${pro.precio}</td>
        <td>${pro.stock}</td>
        <td>
            <img src ="${pro. imagen}" width = "100px">
        </td>
        <td>
            <button class="btn btn-warning">✍🏼</button>
            <button class="btn btn-danger">✖</button>
        </td>
        `;
        tablaPro.appendChild(fila);

    });
    } catch (error) {
        console.log(error);
    }
}