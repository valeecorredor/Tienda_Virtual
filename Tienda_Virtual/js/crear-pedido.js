// Selectores del DOM
let clienteSelect = document.querySelector("#cliente-select");
let productoSelect = document.querySelector("#producto-select");
let cantidadInput = document.querySelector("#cantidad-pro");
let metodoPagoSelect = document.querySelector("#metodo-pago");
let btnAgregarProducto = document.querySelector("#btn-agregar-producto");
let btnCrearPedido = document.querySelector("#btn-crear");
let tablaProductos = document.querySelector("#tabla-productos-pedido tbody");

let productosSeleccionados = [];
let allProductos = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();
    cargarProductos();

    if(btnAgregarProducto) {
        btnAgregarProducto.addEventListener("click", agregarProductoLocal);
    }
    if(btnCrearPedido) {
        btnCrearPedido.addEventListener("click", crearPedido);
    }
});

async function cargarClientes() {
    try {
        let response = await fetchAPI('/clientes', { method: "GET" });
        let clientes = await response.json();
        
        if (clienteSelect) {
            clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
            clientes.forEach(c => {
                clienteSelect.innerHTML += `<option value="${c.id_cliente}">${c.nombre} ${c.apellido}</option>`;
            });
        }
    } catch (error) {
        console.error("Error al cargar clientes", error);
    }
}

async function cargarProductos() {
    try {
        let response = await fetchAPI('/productos', { method: "GET" });
        allProductos = await response.json();
        
        if (productoSelect) {
            productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
            allProductos.forEach(p => {
                productoSelect.innerHTML += `<option value="${p.id_producto}" data-precio="${p.precio}">${p.nombre} - $${p.precio}</option>`;
            });
        }
    } catch (error) {
        console.error("Error al cargar productos", error);
    }
}

function agregarProductoLocal(e) {
    e.preventDefault();
    if (!productoSelect.value || !cantidadInput.value || cantidadInput.value <= 0) {
        Swal.fire('Atención', 'Seleccione un producto y una cantidad válida', 'warning');
        return;
    }

    let idProducto = parseInt(productoSelect.value);
    let cantidad = parseInt(cantidadInput.value);
    let optionSeleccionada = productoSelect.options[productoSelect.selectedIndex];
    let nombre = optionSeleccionada.text.split(" - ")[0];
    let precio = parseFloat(optionSeleccionada.dataset.precio);

    // Buscar si ya existe
    let existe = productosSeleccionados.find(p => p.id_producto === idProducto);
    if (existe) {
        existe.cantidad += cantidad;
    } else {
        productosSeleccionados.push({
            id_producto: idProducto,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }

    renderizarProductosSeleccionados();
    
    // Reset inputs
    productoSelect.value = "";
    cantidadInput.value = "";
}

function renderizarProductosSeleccionados() {
    if(!tablaProductos) return;
    
    tablaProductos.innerHTML = '';
    let total = 0;

    productosSeleccionados.forEach((p, i) => {
        let subtotal = p.precio * p.cantidad;
        total += subtotal;
        
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.cantidad}</td>
            <td>$${subtotal}</td>
            <td><button class="btn btn-sm btn-danger" onclick="quitarProducto(${i})">✖</button></td>
        `;
        tablaProductos.appendChild(fila);
    });
}

function quitarProducto(index) {
    productosSeleccionados.splice(index, 1);
    renderizarProductosSeleccionados();
}

async function crearPedido(e) {
    e.preventDefault();
    
    let idCliente = clienteSelect?.value;
    let metodoPago = metodoPagoSelect?.value || 'Efectivo';

    if (!idCliente || productosSeleccionados.length === 0) {
        Swal.fire('Atención', 'Seleccione un cliente y agregue al menos un producto', 'warning');
        return;
    }

    let pedido = {
        id_cliente: parseInt(idCliente),
        descuento: 0,
        metodo_pago: metodoPago,
        aumento: 0,
        productos: productosSeleccionados.map(p => ({
            id_producto: p.id_producto,
            precio: p.precio,
            cantidad: p.cantidad
        }))
    };

    try {
        Swal.fire({
            title: 'Guardando...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        const response = await fetchAPI('/pedidos', {
            method: 'POST',
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Pedido Creado',
                text: 'El pedido se ha registrado correctamente',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'listado-pedidos.html';
            });
        } else {
            throw new Error('Error al guardar el pedido');
        }
    } catch (error) {
        Swal.fire('Error', 'Hubo un problema al crear el pedido', 'error');
    }
}
