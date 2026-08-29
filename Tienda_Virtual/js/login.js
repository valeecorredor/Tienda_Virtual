document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.user'); // Assuming form has class "user"
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuarioInput = document.getElementById('exampleInputEmail').value.trim();
        const contrasenaInput = document.getElementById('exampleInputPassword').value.trim();
        const rememberCheck = document.getElementById('customCheck').checked;

        if (!usuarioInput || !contrasenaInput) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor ingrese su usuario y contraseña'
            });
            return;
        }

        try {
            // Mostrar estado de carga
            Swal.fire({
                title: 'Iniciando sesión...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: usuarioInput,
                    contrasena: contrasenaInput
                })
            });

            const data = await response.json();

            if (response.ok && data.id) {
                // Guardar en localStorage o sessionStorage dependiendo de "Remember Me"
                const storage = rememberCheck ? localStorage : sessionStorage;
                storage.setItem('token', 'auth-token-' + data.id);
                storage.setItem('user', JSON.stringify({
                    id: data.id,
                    usuario: data.usuario || usuarioInput,
                    rol: data.rol || 'administrador'
                }));

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'index.html';
                });
            } else {
                throw new Error(data.message || 'Credenciales inválidas');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: error.message || 'No se pudo conectar con el servidor'
            });
        }
    });

    // Transformar el botón de login en tipo submit
    const loginBtn = document.querySelector('a.btn-primary.btn-user');
    if (loginBtn) {
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = loginBtn.className;
        submitBtn.textContent = loginBtn.textContent.trim();
        loginBtn.parentNode.replaceChild(submitBtn, loginBtn);
    }
});
