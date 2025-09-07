// src/components/admin/JobdeskForm.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const JobdeskForm = ({ jobdesk, closeModal }) => {
    const { bidangList, addJobdesk, updateJobdesk } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        bidang_id: '',
        type: null,
    });
     const [selectedBidang, setSelectedBidang] = useState('');

    useEffect(() => {
        if (jobdesk) {
            const isBapakamar = jobdesk.bidang_id === 'bapakamar';
            setSelectedBidang(isBapakamar ? `bapakamar_${jobdesk.type}` : jobdesk.bidang_id);
            setFormData({
                description: jobdesk.description,
                bidang_id: jobdesk.bidang_id,
                type: jobdesk.type,
            });
        } else {
            setSelectedBidang('');
            setFormData({ description: '', bidang_id: '', type: null });
        }
    }, [jobdesk]);

    const handleBidangChange = (e) => {
        const value = e.target.value;
        setSelectedBidang(value);
        if (value.startsWith('bapakamar_')) {
            const type = value.split('_')[1];
            setFormData(prev => ({ ...prev, bidang_id: 'bapakamar', type }));
        } else {
            setFormData(prev => ({ ...prev, bidang_id: value, type: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (jobdesk) {
                await updateJobdesk(jobdesk.id, formData);
                alert('Jobdesk berhasil diperbarui.');
            } else {
                await addJobdesk(formData);
                alert('Jobdesk berhasil ditambahkan.');
            }
            closeModal();
        } catch (error) {
             alert(`Gagal menyimpan: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const jobdeskBidangOptions = bidangList.flatMap(b => {
        if (b.id === 'bapakamar') {
            return [
                { id: 'bapakamar_malam', name: 'Pengurus Bapak Kamar (Malam)'},
                { id: 'bapakamar_subuh', name: 'Pengurus Bapak Kamar (Subuh)'},
            ];
        }
        return { id: b.id, name: b.name };
    });

    return (
        <form id="jobdesk-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Jobdesk</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Bidang</label>
                <select
                    value={selectedBidang}
                    onChange={handleBidangChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                >
                    <option value="">Pilih Bidang</option>
                    {jobdeskBidangOptions.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
             <input type="submit" hidden disabled={isSubmitting}/>
        </form>
    );
};

export default JobdeskForm;