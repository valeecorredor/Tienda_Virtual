// variables globales
let tablaPro = document.getElementById("tabla-productos");
let searchInput = document.querySelector('input[type="search"]');
let allProducts = [];
let userRole = '';

document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
        userRole = user.rol;
    }
    getProductos();

    // Event listener for search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = allProducts.filter(pro => 
                pro.nombre.toLowerCase().includes(searchTerm) || 
                pro.descripcion.toLowerCase().includes(searchTerm)
            );
            renderizarTabla(filteredProducts);
        });
    }
});

async function getProductos() {
    try {
        let response = await fetchAPI('/productos', {
            method: "GET"
        });
        
        allProducts = await response.json();
        renderizarTabla(allProducts);

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
}

function renderizarTabla(productos) {
    let tbody = tablaPro.querySelector('tbody');
    if (!tbody) {
        // If tbody doesn't exist, use the table directly (though it's better if the HTML has it)
        tbody = tablaPro; 
    }
    tbody.innerHTML = ''; // Limpiar tabla

    productos.forEach((pro, i) => {
        let fila = document.createElement("tr");
        
        let accionesHtml = '';
        if (userRole === 'administrador') {
            accionesHtml = `
                <button class="btn btn-warning" onclick="editarProducto(${pro.id_producto})">✍🏼</button>
                <button class="btn btn-danger" onclick="eliminarProducto(${pro.id_producto})">✖</button>
            `;
        } else {
            // Vendedor no puede editar ni eliminar (deshabilitamos o ocultamos, aquí usamos deshabilitado o alert por si lo intentan forzar)
            accionesHtml = `
                <button class="btn btn-warning" onclick="bloqueadoVendedor()" disabled>✍🏼</button>
                <button class="btn btn-danger" onclick="bloqueadoVendedor()" disabled>✖</button>
            `;
        }

        fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${pro.nombre}</td>
        <td>${pro.descripcion}</td>
        <td>$${pro.precio}</td>
        <td>${pro.stock}</td>
        <td>
            <img src="${pro.imagen}" width="100px" onerror="this.src='img/undraw_posting_photo.svg'">
        </td>
        <td>${accionesHtml}</td>
        `;
        tbody.appendChild(fila);
    });
}

function bloqueadoVendedor() {
    Swal.fire('Acceso Denegado', 'Los vendedores no tienen permisos para realizar esta acción.', 'warning');
}

async function eliminarProducto(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetchAPI(`/productos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire(
                    '¡Eliminado!',
                    'El producto ha sido eliminado.',
                    'success'
                );
                getProductos(); // Recargar la tabla
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
        }
    }
}

function editarProducto(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }
    // Lógica para editar (redireccionar a form con ID o abrir modal)
    Swal.fire('Info', 'Funcionalidad de edición en construcción', 'info');
}