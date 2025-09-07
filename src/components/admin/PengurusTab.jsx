// src/components/admin/PengurusTab.jsx
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import DataManagementModal from '../modals/DataManagementModal';
import PengurusForm from './PengurusForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const PengurusTab = () => {
    const { pengurusData, bidangList, deletePengurus, loading } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPengurus, setEditingPengurus] = useState(null);

    const openModal = (pengurus = null) => {
        setEditingPengurus(pengurus);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPengurus(null);
    };

    const handleDelete = async (pengurus) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${pengurus.nama}?`)) {
            try {
                await deletePengurus(pengurus.id);
                alert('Pengurus berhasil dihapus.');
            } catch (error) {
                alert(`Gagal menghapus: ${error.message}`);
            }
        }
    };

    if (loading) {
        return <div className="text-center p-4"><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> Memuat data...</div>;
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Tambah Pengurus
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pengurusData.map((p) => {
                            const bidangName = bidangList.find(b => b.id === p.bidang_id)?.name || p.bidang_id;
                            return (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bidangName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.kelas || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => openModal(p)} className="text-indigo-600 hover:text-indigo-900">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-900">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <DataManagementModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingPengurus ? 'Edit Pengurus' : 'Tambah Pengurus'}
                formId="pengurus-form"
            >
                <PengurusForm pengurus={editingPengurus} closeModal={closeModal} />
            </DataManagementModal>
        </div>
    );
};

export default PengurusTab;