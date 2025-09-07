// src/components/admin/JobdeskTab.jsx
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import DataManagementModal from '../modals/DataManagementModal';
import JobdeskForm from './JobdeskForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const JobdeskTab = () => {
    const { jobdeskData, bidangList, deleteJobdesk, loading } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJobdesk, setEditingJobdesk] = useState(null);

    const openModal = (jobdesk = null) => {
        setEditingJobdesk(jobdesk);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingJobdesk(null);
    };
    
    const handleDelete = async (jobdesk) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus jobdesk ini?`)) {
            try {
                await deleteJobdesk(jobdesk.id);
                alert('Jobdesk berhasil dihapus.');
            } catch (error) {
                alert(`Gagal menghapus: ${error.message}`);
            }
        }
    };
    
    if (loading) {
        return <div className="text-center p-4"><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> Memuat data...</div>;
    }

    const getBidangName = (bidangId, type) => {
        const bidang = bidangList.find(b => b.id === bidangId);
        if (!bidang) return bidangId;
        if (bidangId === 'bapakamar' && type) {
            return `${bidang.name} (${type})`;
        }
        return bidang.name;
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Tambah Jobdesk
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobdesk</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jobdeskData.map((job) => (
                            <tr key={job.id}>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm font-medium text-gray-900">{job.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getBidangName(job.bidang_id, job.type)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(job)} className="text-indigo-600 hover:text-indigo-900">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(job)} className="text-red-600 hover:text-red-900">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <DataManagementModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingJobdesk ? 'Edit Jobdesk' : 'Tambah Jobdesk'}
                formId="jobdesk-form"
            >
                <JobdeskForm jobdesk={editingJobdesk} closeModal={closeModal} />
            </DataManagementModal>
        </div>
    );
};

export default JobdeskTab;