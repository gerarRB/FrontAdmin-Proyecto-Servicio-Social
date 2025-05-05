import axios from 'axios';

const httpClient =  axios.create({
  baseURL: import.meta.env.VITE_API_URL, // cambia esto a tu URL base
  
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    // Puedes agregar más headers si necesitas, como Authorization
    // 'Authorization': `Bearer ${token}`
  }
});

// Interceptores de request
httpClient.interceptors.request.use(
  config => {
    // Puedes agregar token automáticamente si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptores de response
httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Manejar logout o redireccionar si el token expira
      console.log('No autorizado, redirigiendo al login...');
    }
    return Promise.reject(error);
  }
);

export {httpClient};