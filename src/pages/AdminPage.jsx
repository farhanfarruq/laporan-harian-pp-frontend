import React, { useState } from 'react';
import Layout from '../components/Layout';
import MasterDataSection from '../components/admin/MasterDataSection';
import RekapSection from '../components/admin/RekapSection';
import { useAppContext } from '../context/AppContext';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('rekap');
    const { loading, error } = useAppContext();

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-10 text-gray-500">Memuat data...</div>;
        }
        if (error) {
            return <div className="text-center py-10 text-red-500">Error: {error}</div>;
        }
        switch (activeTab) {
            case 'rekap':
                return <RekapSection />;
            case 'master':
                return <MasterDataSection />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="p-4 md:p-6">
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6">
                            <button
                                onClick={() => setActiveTab('rekap')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'rekap'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Rekap Laporan
                            </button>
                            <button
                                onClick={() => setActiveTab('master')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'master'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Master Data
                            </button>
                        </nav>
                    </div>
                </div>
                <div>{renderContent()}</div>
            </div>
        </Layout>
    );
};

export default AdminPage;