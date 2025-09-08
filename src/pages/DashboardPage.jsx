import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const DashboardPage = () => {
    const { bidangList, loading, error } = useAppContext();

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-10">
                    <p className="text-gray-500">Memuat data bidang...</p>
                </div>
            </Layout>
        );
    }
    
    if (error) {
         return (
            <Layout>
                <div className="text-center py-10">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Pilih Bidang</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {bidangList.map((bidang) => (
                        <Link to={`/report/${bidang.id}`} key={bidang.id}>
                            <DashboardCard
                                title={bidang.nama}
                                description={bidang.deskripsi}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;