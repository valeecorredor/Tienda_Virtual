document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.user');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener campos del formulario. (Depende del HTML actual de register.html, asumimos inputs típicos de SB Admin 2)
        const usuarioInput = document.getElementById('exampleInputEmail')?.value.trim();
        const contrasenaInput = document.getElementById('exampleInputPassword')?.value.trim();
        const repeatContrasenaInput = document.getElementById('exampleRepeatPassword')?.value.trim();
        
        if (!usuarioInput || !contrasenaInput) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos Incompletos',
                text: 'Por favor llene todos los campos'
            });
            return;
        }

        if (contrasenaInput !== repeatContrasenaInput) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            });
            return;
        }

        try {
            Swal.fire({
                title: 'Registrando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // En el backend, el endpoint de crear usuarios parece ser POST /api/usuarios
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: usuarioInput,
                    contrasena: contrasenaInput,
                    rol: 'vendedor' // Por defecto registramos como vendedor
                })
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: 'Su cuenta ha sido creada. Ahora puede iniciar sesión.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            } else {
                throw new Error(data.message || 'Error al crear el usuario');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Registro',
                text: error.message || 'No se pudo conectar con el servidor'
            });
        }
    });

    // Transformar el botón de registro en tipo submit
    const registerBtn = document.querySelector('a.btn-primary.btn-user');
    if (registerBtn) {
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = registerBtn.className;
        submitBtn.textContent = 'Register Account';
        registerBtn.parentNode.replaceChild(submitBtn, registerBtn);
    }
});
