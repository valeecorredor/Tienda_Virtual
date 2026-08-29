// Configuración base de la API
const API_URL = 'http://localhost:3000/api';

// Verificar si estamos en una página pública (login / register)
const isPublicPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

// Función para obtener el token
function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Función para obtener los datos del usuario
function getUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Guardia de navegación
function checkAuth() {
    const token = getToken();
    
    if (!token && !isPublicPage) {
        // Redirigir a login si no hay token y no es página pública
        window.location.href = 'login.html';
    } else if (token && isPublicPage) {
        // Redirigir a dashboard si hay token y estamos en login/register
        window.location.href = 'index.html';
    }
}

// Ejecutar guardia al cargar
checkAuth();

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Helper para realizar peticiones autenticadas
async function fetchAPI(endpoint, options = {}) {
    const token = getToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        // Si el token expiró o es inválido
        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Sesión expirada o inválida');
        }
        
        return response;
    } catch (error) {
        console.error('Error en fetchAPI:', error);
        throw error;
    }
}

// Actualizar el nombre de usuario en el topbar si el elemento existe
document.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('navbar-user-name');
    if (userNameElement) {
        const user = getUser();
        if (user) {
            userNameElement.textContent = user.usuario;
        }
    }
});
