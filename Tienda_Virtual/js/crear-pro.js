let nombrePro = document.querySelector("#productos-select"); // Mantenemos el ID que ya estaba, aunque idealmente sería #nombre-pro
let precioPro = document.querySelector("#precio-pro");
let descripcionPro = document.querySelector("#descripcion-pro");
let stockPro = document.querySelector("#stock-pro");
let imagenPro = document.querySelector("#imagen-pro");
let btnCrear = document.querySelector("#btn-crear");

//evento click al boton
btnCrear.addEventListener("click", async (e)=> {
    e.preventDefault();
    let producto = validForm();
    
    if(producto) {
        try {
            Swal.fire({
                title: 'Guardando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetchAPI('/productos', {
                method: 'POST',
                body: JSON.stringify(producto)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto Creado',
                    text: 'El producto se ha guardado correctamente',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'listado-pro.html';
                });
            } else {
                throw new Error('Error al guardar');
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al crear el producto', 'error');
        }
    }
});

//validar informacion del formulario
function validForm() {
    let pro = null;
    if(nombrePro.value && precioPro.value && stockPro.value){
        pro = {
            nombre: nombrePro.value,
            descripcion: descripcionPro.value || '',
            precio: parseFloat(precioPro.value),
            stock: parseInt(stockPro.value),
            imagen: imagenPro.value || ''
        }
    } else {
        Swal.fire('Atención', 'Faltan campos obligatorios (Nombre, Precio, Stock)', 'warning');
    }

    return pro;
}
