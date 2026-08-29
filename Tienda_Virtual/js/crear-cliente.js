let nombreCli = document.querySelector("#nombre-cliente"); // Asumiendo ids
let apellidoCli = document.querySelector("#apellido-cliente");
let emailCli = document.querySelector("#email-cliente");
let celularCli = document.querySelector("#celular-cliente");
let direccionCli = document.querySelector("#direccion-cliente");
let btnCrear = document.querySelector("#btn-crear");

if (!btnCrear) {
    // Fallback if id is different, maybe it's just a button with .btn-primary
    btnCrear = document.querySelector(".btn-primary");
}

if (btnCrear) {
    btnCrear.addEventListener("click", async (e)=> {
        e.preventDefault();
        
        let cliente = {
            nombre: nombreCli?.value || '',
            apellido: apellidoCli?.value || '',
            email: emailCli?.value || '',
            celular: celularCli?.value || '',
            direccion: direccionCli?.value || ''
        };

        if(!cliente.nombre || !cliente.apellido || !cliente.email){
            Swal.fire('Atención', 'Faltan campos obligatorios', 'warning');
            return;
        }
        
        try {
            Swal.fire({
                title: 'Guardando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetchAPI('/clientes', {
                method: 'POST',
                body: JSON.stringify(cliente)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente Creado',
                    text: 'El cliente se ha guardado correctamente',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'listado-clientes.html';
                });
            } else {
                throw new Error('Error al guardar');
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al crear el cliente', 'error');
        }
    });
}
