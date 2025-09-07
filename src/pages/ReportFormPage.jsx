// src/pages/ReportFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const ReportFormPage = () => {
    const { bidangId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { bidangList, pengurusData, jobdeskData, addReport, drafts, setDrafts, loading } = useAppContext();
    
    const [currentTab, setCurrentTab] = useState('malam');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        pengurus_id: '',
        jobdeskStatus: [],
        incompleteDetails: {},
    });
    
    const bidang = bidangList.find(b => b.id === bidangId);
    const today = dayjs().format('YYYY-MM-DD');
    const draftKey = `${bidangId}_${user.username}_${today}`;

    const pengurusOptions = pengurusData.filter(p => p.bidang_id === bidangId);
    
    let currentJobdesks = [];
    if (bidangId === 'bapakamar') {
        currentJobdesks = jobdeskData.filter(j => j.bidang_id === 'bapakamar' && j.type === currentTab);
    } else {
        currentJobdesks = jobdeskData.filter(j => j.bidang_id === bidangId);
    }

    useEffect(() => {
        const draft = drafts[draftKey];
        const initialStatus = Array(currentJobdesks.length).fill(true); 
        
        setFormData({
            pengurus_id: draft?.pengurus_id || '',
            jobdeskStatus: (draft?.jobdeskStatus?.length === currentJobdesks.length) ? draft.jobdeskStatus : initialStatus,
            incompleteDetails: draft?.incompleteDetails || {},
        });
    }, [bidangId, currentTab, drafts, draftKey, currentJobdesks.length]);

    const handleJobdeskChange = (index, status) => {
        const isCompleted = status === 'selesai';
        const newStatus = [...formData.jobdeskStatus];
        newStatus[index] = isCompleted;
        
        const newIncomplete = {...formData.incompleteDetails};
        if (!isCompleted) {
            if (!newIncomplete[index]) {
                newIncomplete[index] = { alasan: '', solusi: '' };
            }
        } else {
            delete newIncomplete[index];
        }
        
        setFormData(prev => ({ ...prev, jobdeskStatus: newStatus, incompleteDetails: newIncomplete }));
    };

    const handleIncompleteChange = (index, type, value) => {
        const newIncomplete = { ...formData.incompleteDetails };
        newIncomplete[index][type] = value;
        setFormData(prev => ({ ...prev, incompleteDetails: newIncomplete }));
    };
    
    const saveDraft = () => {
        const newDrafts = { ...drafts, [draftKey]: formData };
        setDrafts(newDrafts);
        alert('Draft berhasil disimpan!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.pengurus_id) {
            alert('Harap pilih nama pengurus.');
            return;
        }

        let isInvalid = false;
        Object.values(formData.incompleteDetails).forEach(detail => {
            if (!detail.alasan.trim() || !detail.solusi.trim()) isInvalid = true;
        });
        if (isInvalid) {
            alert('Harap lengkapi alasan dan solusi untuk semua tugas yang tidak selesai!');
            return;
        }

        setIsSubmitting(true);
        try {
            const jobdesk_laporan = currentJobdesks.map((job, index) => ({
                jobdesk_id: job.id,
                status: formData.jobdeskStatus[index] ? 'selesai' : 'tidak_selesai',
                alasan: !formData.jobdeskStatus[index] ? formData.incompleteDetails[index]?.alasan : null,
                solusi: !formData.jobdeskStatus[index] ? formData.incompleteDetails[index]?.solusi : null,
            }));

            const finalReport = {
                bidang_id: bidangId,
                pengurus_id: formData.pengurus_id,
                tanggal: today,
                type: bidangId === 'bapakamar' ? currentTab : null,
                jobdesks: jobdesk_laporan,
            };

            await addReport(finalReport);
            
            const newDrafts = { ...drafts };
            delete newDrafts[draftKey];
            setDrafts(newDrafts);

            alert('Laporan berhasil disubmit!');
            navigate('/');

        } catch (error) {
            console.error("Gagal submit laporan:", error);
            alert(`Gagal mengirim laporan: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Memuat data...</div>;
    }

    if (!bidang) {
        return <div className="p-8 text-center">Bidang tidak ditemukan.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Laporan {bidang.name}</h2>
                    <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 flex items-center">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Kembali
                    </button>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pengurus</label>
                            <select 
                                required
                                value={formData.pengurus_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, pengurus_id: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih Pengurus</option>
                                {pengurusOptions.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nama} {p.kelas ? `(Kelas ${p.kelas})` : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                            <input type="date" readOnly value={today} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"/>
                        </div>
                    </div>
                    
                    {bidangId === 'bapakamar' && (
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8">
                                <button type="button" className={`tab-btn py-2 px-1 border-b-2 font-medium text-sm ${currentTab === 'malam' && 'active'}`} onClick={() => setCurrentTab('malam')}>Laporan Malam</button>
                                <button type="button" className={`tab-btn py-2 px-1 border-b-2 font-medium text-sm ${currentTab === 'subuh' && 'active'}`} onClick={() => setCurrentTab('subuh')}>Laporan Subuh</button>
                            </nav>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Tugas</h3>
                        <div className="space-y-4">
                           {formData.jobdeskStatus.length > 0 && currentJobdesks.map((job, index) => (
                                <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-800 font-medium mb-3">{job.description}</p>
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name={`jobdesk_status_${index}`} value="selesai" checked={formData.jobdeskStatus[index] === true} onChange={() => handleJobdeskChange(index, 'selesai')} className="h-4 w-4 text-blue-600"/>
                                            <span className="ml-2 text-sm text-green-700">Selesai</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="radio" name={`jobdesk_status_${index}`} value="tidak_selesai" checked={formData.jobdeskStatus[index] === false} onChange={() => handleJobdeskChange(index, 'tidak_selesai')} className="h-4 w-4 text-blue-600"/>
                                            <span className="ml-2 text-sm text-red-700">Tidak Selesai</span>
                                        </label>
                                    </div>
                                    {formData.jobdeskStatus[index] === false && (
                                        <div className="mt-4 p-4 border-t border-red-200 bg-red-50 rounded-b-lg space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-red-800 mb-1">Alasan tidak selesai: <span className="text-red-500">*</span></label>
                                                <textarea className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm" rows="2" required placeholder="Jelaskan alasannya..." value={formData.incompleteDetails[index]?.alasan || ''} onChange={(e) => handleIncompleteChange(index, 'alasan', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-red-800 mb-1">Solusi yang akan dilakukan: <span className="text-red-500">*</span></label>
                                                <textarea className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm" rows="2" required placeholder="Jelaskan solusinya..." value={formData.incompleteDetails[index]?.solusi || ''} onChange={(e) => handleIncompleteChange(index, 'solusi', e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                           ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button type="button" onClick={saveDraft} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Simpan Draft</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center font-medium">
                            {isSubmitting ? (<><FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> Mengirim...</>) : ('Submit Laporan')}
                        </button>
                    </div>
                </form>
             </div>
        </div>
    );
};

export default ReportFormPage;