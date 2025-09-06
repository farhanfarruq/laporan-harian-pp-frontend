// src/components/admin/MasterDataSection.jsx
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const MasterDataSection = () => {
    const [activeTab, setActiveTab] = useState('pengurus');
    const { pengurusData, bidangList } = useAppContext();

    const getButtonClass = (tabName) => activeTab === tabName ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-2">
                    <button className={`px-4 py-2 rounded-t-lg text-sm font-medium ${getButtonClass('pengurus')}`} onClick={() => setActiveTab('pengurus')}>
                        Data Pengurus
                    </button>
                    <button className={`px-4 py-2 rounded-t-lg text-sm font-medium ${getButtonClass('jobdesk')}`} onClick={() => setActiveTab('jobdesk')}>
                        Data Jobdesk
                    </button>
                </div>
            </div>

            {activeTab === 'pengurus' && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(pengurusData).map(([bidangKey, pengurusList]) => {
                                const bidangName = bidangList.find(b => b.id === bidangKey)?.name || bidangKey;
                                return pengurusList.map((p, index) => (
                                    <tr key={`${bidangKey}-${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{typeof p === 'object' ? p.nama : p}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bidangName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeof p === 'object' ? p.kelas : '-'}</td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'jobdesk' && (
                 <div className="text-gray-600">
                    <p>Fitur untuk melihat data jobdesk akan ditampilkan di sini.</p>
                </div>
            )}
        </div>
    );
};

export default MasterDataSection;