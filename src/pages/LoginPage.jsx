// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const { user, login, error, setError, isLoggingIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        login(username, password);
    };
    
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">

                    {/* === BAGIAN YANG BERUBAH === */}
                    <img src="/alimdad.png" alt="Logo Al Imdad" className="w-28 h-28 mx-auto mb-4 object-contain" />
                    {/* === AKHIR BAGIAN YANG BERUBAH === */}

                    <h1 className="text-2xl font-bold text-gray-800">PP Al Imdad Putra</h1>
                    <p className="text-gray-600 mt-2">Sistem Laporan Tugas Harian</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 rounded-lg text-sm bg-red-100 text-red-700">
                           {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                id="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12" 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoggingIn}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;