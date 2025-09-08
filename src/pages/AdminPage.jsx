// src/pages/AdminPage.jsx
import { useState } from 'react';
import MasterDataSection from '../components/admin/MasterDataSection';
import RekapSection from '../components/admin/RekapSection'; // <-- PASTIKAN INI DI-IMPORT
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('rekap');
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const getButtonClass = (tabName) => {
        return activeTab === tabName
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
                    <p className="text-gray-500 mt-1">Kelola laporan dan data master aplikasi.</p>
                </div>
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Kembali ke Dashboard
                </button>
            </div>
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-t-lg text-sm font-medium ${getButtonClass('rekap')}`}
                        onClick={() => setActiveTab('rekap')}
                    >
                        Rekap Laporan
                    </button>
                    {user.role === 'admin_utama' && (
                        <button
                            className={`px-4 py-2 rounded-t-lg text-sm font-medium ${getButtonClass('master')}`}
                            onClick={() => setActiveTab('master')}
                        >
                            Master Data
                        </button>
                    )}
                </div>
            </div>

            <div className="transition-opacity duration-300">
                {/* === BAGIAN YANG DIPERBAIKI === */}
                {activeTab === 'rekap' && <RekapSection />}
                
                {activeTab === 'master' && user.role === 'admin_utama' && <MasterDataSection />}
            </div>
        </div>
    );
};

export default AdminPage;