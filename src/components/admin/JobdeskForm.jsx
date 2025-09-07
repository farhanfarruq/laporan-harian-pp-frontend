// src/components/admin/JobdeskForm.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const JobdeskForm = ({ jobdesk, closeModal }) => {
    const { bidangList, addJobdesk, updateJobdesk } = useAppContext();
    const [formData, setFormData] = useState({
        text: '',
        bidang: '',
    });

    useEffect(() => {
        if (jobdesk) {
            setFormData({
                text: jobdesk.text,
                bidang: jobdesk.bidang,
            });
        } else {
            setFormData({ text: '', bidang: '' });
        }
    }, [jobdesk]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (jobdesk) {
            updateJobdesk(jobdesk.bidang, jobdesk.index, formData.text);
        } else {
            addJobdesk(formData.bidang, formData.text);
        }
        closeModal();
    };
    
    const jobdeskBidangOptions = bidangList.flatMap(b => {
        if (b.id === 'bapakamar') {
            return [
                { id: 'bapakamar_malam', name: 'Bapak Kamar (Malam)'},
                { id: 'bapakamar_subuh', name: 'Bapak Kamar (Subuh)'},
            ];
        }
        return { id: b.id, name: b.name };
    });

    return (
        <form id="jobdesk-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Jobdesk</label>
                <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Bidang</label>
                <select
                    name="bidang"
                    value={formData.bidang}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                    disabled={!!jobdesk}
                >
                    <option value="">Pilih Bidang</option>
                    {jobdeskBidangOptions.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
        </form>
    );
};

export default JobdeskForm;