import axios from 'axios';

// Buat instance Axios dengan konfigurasi dasar
const axiosClient = axios.create({
    baseURL: 'https://laporan-harian-pp-backend.laravel.cloud/api', // Sesuaikan dengan URL backend Anda
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Tambahkan interceptor untuk menyertakan token otentikasi pada setiap request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
