// src/components/admin/MasterDataSection.jsx
import { useState } from 'react';
import PengurusTab from './PengurusTab';
import JobdeskTab from './JobdeskTab';

const MasterDataSection = () => {
    const [activeTab, setActiveTab] = useState('pengurus');

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

            {activeTab === 'pengurus' && <PengurusTab />}
            {activeTab === 'jobdesk' && <JobdeskTab />}
        </div>
    );
};

export default MasterDataSection;