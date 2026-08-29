let tablaPedidos = document.getElementById("tabla-pedidos");
let searchInput = document.querySelector('input[type="search"]');
let allPedidos = [];
let userRole = '';

document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
        userRole = user.rol;
    }
    
    if (!tablaPedidos) {
        tablaPedidos = document.querySelector('table');
    }

    getPedidos();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allPedidos.filter(p => 
                (p.cliente_nombre && p.cliente_nombre.toLowerCase().includes(searchTerm)) ||
                (p.metodo_pago && p.metodo_pago.toLowerCase().includes(searchTerm))
            );
            renderizarTabla(filtered);
        });
    }
});

async function getPedidos() {
    try {
        let response = await fetchAPI('/pedidos', { method: "GET" });
        allPedidos = await response.json();
        renderizarTabla(allPedidos);
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
    }
}

function renderizarTabla(pedidos) {
    if (!tablaPedidos) return;
    
    let tbody = tablaPedidos.querySelector('tbody');
    if (!tbody) tbody = tablaPedidos;
    tbody.innerHTML = ''; 

    pedidos.forEach((ped, i) => {
        let fila = document.createElement("tr");
        
        let accionesHtml = '';
        if (userRole === 'administrador') {
            accionesHtml = `
                <button class="btn btn-warning" onclick="editarPedido(${ped.id_pedido})">✍🏼</button>
                <button class="btn btn-danger" onclick="eliminarPedido(${ped.id_pedido})">✖</button>
            `;
        } else {
            accionesHtml = `
                <button class="btn btn-warning" onclick="bloqueadoVendedor()" disabled>✍🏼</button>
                <button class="btn btn-danger" onclick="bloqueadoVendedor()" disabled>✖</button>
            `;
        }

        fila.innerHTML = `
        <td>${ped.id_pedido}</td>
        <td>${ped.cliente_nombre || 'N/A'}</td>
        <td>$${ped.total || 0}</td>
        <td>${ped.metodo_pago}</td>
        <td>${new Date(ped.fecha_pedido).toLocaleDateString()}</td>
        <td>${accionesHtml}</td>
        `;
        tbody.appendChild(fila);
    });
}

function bloqueadoVendedor() {
    Swal.fire('Acceso Denegado', 'Los vendedores no tienen permisos para realizar esta acción.', 'warning');
}

async function eliminarPedido(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto! Eliminará el pedido y sus detalles.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetchAPI(`/pedidos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('¡Eliminado!', 'El pedido ha sido eliminado.', 'success');
                getPedidos();
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar el pedido', 'error');
        }
    }
}

function editarPedido(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }
    Swal.fire('Info', 'Funcionalidad de edición en construcción', 'info');
}
