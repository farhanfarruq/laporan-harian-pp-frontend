// src/components/admin/JobdeskTab.jsx
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import DataManagementModal from '../modals/DataManagementModal';
import JobdeskForm from './JobdeskForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const JobdeskTab = () => {
    const { jobdeskData, bidangList, deleteJobdesk } = useAppContext();
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
    
    const handleDelete = (bidangId, jobdeskIndex) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus jobdesk ini?`)) {
            deleteJobdesk(bidangId, jobdeskIndex);
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
                        {Object.entries(jobdeskData).map(([bidangKey, jobdeskList]) => {
                            const bidangName = bidangList.find(b => b.id === bidangKey.split('_')[0])?.name || bidangKey;
                            return jobdeskList.map((job, index) => (
                                <tr key={`${bidangKey}-${index}`}>
                                    <td className="px-6 py-4 whitespace-pre-wrap text-sm font-medium text-gray-900">{job}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bidangName} {bidangKey.includes('_') ? `(${bidangKey.split('_')[1]})` : ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => openModal({ text: job, bidang: bidangKey, index })} className="text-indigo-600 hover:text-indigo-900">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDelete(bidangKey, index)} className="text-red-600 hover:text-red-900">
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
                title={editingJobdesk ? 'Edit Jobdesk' : 'Tambah Jobdesk'}
                formId="jobdesk-form"
            >
                <JobdeskForm jobdesk={editingJobdesk} closeModal={closeModal} />
            </DataManagementModal>
        </div>
    );
};

export default JobdeskTab;