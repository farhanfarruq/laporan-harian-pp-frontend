// src/components/admin/PengurusTab.jsx
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import DataManagementModal from '../modals/DataManagementModal';
import PengurusForm from './PengurusForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const PengurusTab = () => {
    const { pengurusData, bidangList, deletePengurus } = useAppContext();
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

    const handleDelete = (bidangId, pengurusNameToDelete) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${pengurusNameToDelete}?`)) {
            deletePengurus(bidangId, pengurusNameToDelete);
        }
    };

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
                        {Object.entries(pengurusData).map(([bidangId, pengurusList]) => {
                            const bidangName = bidangList.find(b => b.id === bidangId)?.name || bidangId;
                            return pengurusList.map((p, index) => (
                                <tr key={`${bidangId}-${index}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{typeof p === 'object' ? p.nama : p}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bidangName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeof p === 'object' ? p.kelas : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => openModal({ ...p, bidang: bidangId })} className="text-indigo-600 hover:text-indigo-900">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(bidangId, typeof p === 'object' ? p.nama : p)} className="text-red-600 hover:text-red-900">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ));
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