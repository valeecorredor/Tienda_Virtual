let usuarioInput = document.querySelector("#usuario-user");
let contrasenaInput = document.querySelector("#contrasena-user");
let rolSelect = document.querySelector("#rol-user");
let btnCrear = document.querySelector("#btn-crear");

if (!btnCrear) {
    btnCrear = document.querySelector(".btn-primary");
}

if (btnCrear) {
    btnCrear.addEventListener("click", async (e)=> {
        e.preventDefault();
        
        let usuario = {
            usuario: usuarioInput?.value || '',
            contrasena: contrasenaInput?.value || '',
            rol: rolSelect?.value || 'vendedor'
        };

        if(!usuario.usuario || !usuario.contrasena){
            Swal.fire('Atención', 'Usuario y contraseña son obligatorios', 'warning');
            return;
        }
        
        try {
            Swal.fire({
                title: 'Guardando...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const response = await fetchAPI('/usuarios', {
                method: 'POST',
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario Creado',
                    text: 'El usuario se ha registrado correctamente',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'listado-usuarios.html';
                });
            } else {
                throw new Error('Error al guardar el usuario');
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al crear el usuario', 'error');
        }
    });
}
