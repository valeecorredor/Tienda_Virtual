let tablaClientes = document.getElementById("tabla-clientes"); // Asumimos este ID
let searchInput = document.querySelector('input[type="search"]');
let allClientes = [];
let userRole = '';

document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
        userRole = user.rol;
    }
    
    // Si la tabla no tiene el id, intentamos buscarla por clase
    if (!tablaClientes) {
        tablaClientes = document.querySelector('table');
    }

    getClientes();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allClientes.filter(c => 
                c.nombre.toLowerCase().includes(searchTerm) || 
                c.apellido.toLowerCase().includes(searchTerm) ||
                c.email.toLowerCase().includes(searchTerm)
            );
            renderizarTabla(filtered);
        });
    }
});

async function getClientes() {
    try {
        let response = await fetchAPI('/clientes', {
            method: "GET"
        });
        allClientes = await response.json();
        renderizarTabla(allClientes);
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
    }
}

function renderizarTabla(clientes) {
    if (!tablaClientes) return;
    
    let tbody = tablaClientes.querySelector('tbody');
    if (!tbody) {
        tbody = tablaClientes;
    }
    tbody.innerHTML = ''; 

    clientes.forEach((cli, i) => {
        let fila = document.createElement("tr");
        
        let accionesHtml = '';
        if (userRole === 'administrador') {
            accionesHtml = `
                <button class="btn btn-warning" onclick="editarCliente(${cli.id_cliente})">✍🏼</button>
                <button class="btn btn-danger" onclick="eliminarCliente(${cli.id_cliente})">✖</button>
            `;
        } else {
            accionesHtml = `
                <button class="btn btn-warning" onclick="bloqueadoVendedor()" disabled>✍🏼</button>
                <button class="btn btn-danger" onclick="bloqueadoVendedor()" disabled>✖</button>
            `;
        }

        fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${cli.nombre}</td>
        <td>${cli.apellido}</td>
        <td>${cli.email}</td>
        <td>${cli.celular}</td>
        <td>${accionesHtml}</td>
        `;
        tbody.appendChild(fila);
    });
}

function bloqueadoVendedor() {
    Swal.fire('Acceso Denegado', 'Los vendedores no tienen permisos para realizar esta acción.', 'warning');
}

async function eliminarCliente(id) {
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
            const response = await fetchAPI(`/clientes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'success');
                getClientes();
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar el cliente', 'error');
        }
    }
}

function editarCliente(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }
    Swal.fire('Info', 'Funcionalidad de edición en construcción', 'info');
}
