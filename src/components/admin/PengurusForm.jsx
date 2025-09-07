// src/components/admin/PengurusForm.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const PengurusForm = ({ pengurus, closeModal }) => {
    const { bidangList, addPengurus, updatePengurus } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        kelas: '',
        bidang_id: '',
    });

    useEffect(() => {
        if (pengurus) {
            setFormData({
                nama: pengurus.nama || '',
                kelas: pengurus.kelas || '',
                bidang_id: pengurus.bidang_id || '',
            });
        } else {
            setFormData({ nama: '', kelas: '', bidang_id: '' });
        }
    }, [pengurus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData };
            if (payload.bidang_id !== 'bapakamar') {
                payload.kelas = null;
            }

            if (pengurus) {
                await updatePengurus(pengurus.id, payload);
                alert('Pengurus berhasil diperbarui.');
            } else {
                await addPengurus(payload);
                alert('Pengurus berhasil ditambahkan.');
            }
            closeModal();
        } catch (error) {
            alert(`Gagal menyimpan: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
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
                    name="bidang_id"
                    value={formData.bidang_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                >
                    <option value="">Pilih Bidang</option>
                    {bidangList.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
            {formData.bidang_id === 'bapakamar' && (
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
            <input type="submit" hidden disabled={isSubmitting}/>
        </form>
    );
};

export default PengurusForm;