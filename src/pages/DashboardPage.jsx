// src/pages/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import DashboardCard from '../components/DashboardCard';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { bidangList } = useAppContext();

    const openForm = (bidangId) => {
        navigate(`/report/${bidangId}`);
    };

    const openAdminPanel = () => {
        navigate('/admin');
    };

    let availableBidang = bidangList;
    if (user.role === 'admin_bidang') {
        availableBidang = bidangList.filter(b => b.id === user.bidang);
    }
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
                <p className="text-gray-600">Pilih bidang untuk membuat atau melihat laporan</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableBidang.map(bidang => (
                    <DashboardCard
                        key={bidang.id}
                        title={bidang.name}
                        description="Klik untuk membuat laporan atau melihat data"
                        icon={bidang.icon}
                        color={bidang.color}
                        onClick={() => openForm(bidang.id)}
                    />
                ))}

                {(user.role === 'admin_utama' || user.role === 'admin_bidang') && (
                    <DashboardCard
                        title="Admin Panel"
                        description="Kelola data dan lihat rekap laporan"
                        icon="fa-cog"
                        color="bg-gray-600"
                        onClick={openAdminPanel}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;