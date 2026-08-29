let tablaUsuarios = document.getElementById("tabla-usuarios");
let searchInput = document.querySelector('input[type="search"]');
let allUsuarios = [];
let userRole = '';

document.addEventListener("DOMContentLoaded", () => {
    const user = getUser();
    if (user) {
        userRole = user.rol;
    }
    
    if (!tablaUsuarios) {
        tablaUsuarios = document.querySelector('table');
    }

    getUsuarios();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allUsuarios.filter(u => 
                u.usuario.toLowerCase().includes(searchTerm) || 
                u.rol.toLowerCase().includes(searchTerm)
            );
            renderizarTabla(filtered);
        });
    }
});

async function getUsuarios() {
    try {
        let response = await fetchAPI('/usuarios', { method: "GET" });
        allUsuarios = await response.json();
        renderizarTabla(allUsuarios);
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    }
}

function renderizarTabla(usuarios) {
    if (!tablaUsuarios) return;
    
    let tbody = tablaUsuarios.querySelector('tbody');
    if (!tbody) tbody = tablaUsuarios;
    tbody.innerHTML = ''; 

    usuarios.forEach((usr, i) => {
        let fila = document.createElement("tr");
        
        let accionesHtml = '';
        if (userRole === 'administrador') {
            accionesHtml = `
                <button class="btn btn-warning" onclick="editarUsuario(${usr.id_usuario})">✍🏼</button>
                <button class="btn btn-danger" onclick="eliminarUsuario(${usr.id_usuario})">✖</button>
            `;
        } else {
            accionesHtml = `
                <button class="btn btn-warning" onclick="bloqueadoVendedor()" disabled>✍🏼</button>
                <button class="btn btn-danger" onclick="bloqueadoVendedor()" disabled>✖</button>
            `;
        }

        // Capitalizar rol
        const rolFormat = usr.rol.charAt(0).toUpperCase() + usr.rol.slice(1);

        fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${usr.usuario}</td>
        <td><span class="badge badge-${usr.rol === 'administrador' ? 'danger' : 'primary'}">${rolFormat}</span></td>
        <td>${accionesHtml}</td>
        `;
        tbody.appendChild(fila);
    });
}

function bloqueadoVendedor() {
    Swal.fire('Acceso Denegado', 'Los vendedores no tienen permisos para realizar esta acción.', 'warning');
}

async function eliminarUsuario(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }

    const currentUserId = getUser()?.id;
    if (currentUserId === id) {
        Swal.fire('Error', 'No puedes eliminar tu propio usuario', 'error');
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
            const response = await fetchAPI(`/usuarios/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
                getUsuarios();
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar el usuario', 'error');
        }
    }
}

function editarUsuario(id) {
    if (userRole !== 'administrador') {
        bloqueadoVendedor();
        return;
    }
    Swal.fire('Info', 'Funcionalidad de edición en construcción', 'info');
}
