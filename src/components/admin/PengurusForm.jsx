// src/components/admin/PengurusForm.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const PengurusForm = ({ pengurus, closeModal }) => {
    const { bidangList, addPengurus, updatePengurus } = useAppContext();
    const [formData, setFormData] = useState({
        nama: '',
        kelas: '',
        bidang: '',
    });

    useEffect(() => {
        if (pengurus) {
            setFormData({
                nama: typeof pengurus === 'object' ? pengurus.nama : pengurus,
                kelas: typeof pengurus === 'object' ? pengurus.kelas : '',
                bidang: pengurus.bidang || '',
            });
        } else {
            setFormData({ nama: '', kelas: '', bidang: '' });
        }
    }, [pengurus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pengurus) {
            updatePengurus(pengurus.bidang, typeof pengurus === 'object' ? pengurus.nama : pengurus, formData);
        } else {
            addPengurus(formData.bidang, formData);
        }
        closeModal();
    };

    return (
        <form id="pengurus-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                    disabled={!!pengurus}
                >
                    <option value="">Pilih Bidang</option>
                    {bidangList.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
            {formData.bidang === 'bapakamar' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Kelas</label>
                    <input
                        type="text"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            )}
        </form>
    );
};

export default PengurusForm;