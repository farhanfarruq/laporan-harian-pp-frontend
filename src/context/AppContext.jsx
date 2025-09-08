import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage'; // Drafts masih menggunakan localStorage

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const { token, user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    // --- State Management ---
    // Ganti useLocalStorage dengan useState untuk data dari server
    const [reports, setReports] = useState([]);
    const [pengurusData, setPengurusData] = useState({});
    const [jobdeskData, setJobdeskData] = useState({});
    const [bidangList, setBidangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Drafts bisa tetap di localStorage karena bersifat lokal per perangkat
    const [drafts, setDrafts] = useLocalStorage('drafts', {});

    // Fungsi untuk mengambil semua data awal dari backend
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                };

                // Ambil semua data secara paralel
                const [bidangRes, pengurusRes, jobdeskRes, laporanRes] = await Promise.all([
                    fetch(`${API_URL}/api/bidang`, { headers }),
                    fetch(`${API_URL}/api/master/pengurus`, { headers }),
                    fetch(`${API_URL}/api/master/jobdesk`, { headers }),
                    fetch(`${API_URL}/api/laporan`, { headers })
                ]);

                if (!bidangRes.ok || !pengurusRes.ok || !jobdeskRes.ok || !laporanRes.ok) {
                    throw new Error('Gagal mengambil data dari server.');
                }

                const bidang = await bidangRes.json();
                const pengurus = await pengurusRes.json();
                const jobdesk = await jobdeskRes.json();
                const laporan = await laporanRes.json();
                
                // --- Format data agar sesuai dengan struktur state sebelumnya ---
                setBidangList(bidang.data);

                const formattedPengurus = pengurus.data.reduce((acc, p) => {
                    const bidangKey = p.bidang_id;
                    if (!acc[bidangKey]) acc[bidangKey] = [];
                    acc[bidangKey].push({ id: p.id, nama: p.nama, kelas: p.kelas });
                    return acc;
                }, {});
                setPengurusData(formattedPengurus);

                const formattedJobdesk = jobdesk.data.reduce((acc, j) => {
                    const key = j.type ? `${j.bidang_id}_${j.type}` : j.bidang_id;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push({id: j.id, description: j.description});
                    return acc;
                }, {});
                setJobdeskData(formattedJobdesk);
                
                setReports(laporan.data);

            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [token, API_URL]);

    // --- Fungsi CRUD Laporan (sudah disesuaikan) ---
    const addReport = async (report) => {
        try {
            const response = await fetch(`${API_URL}/api/laporan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...report,
                    user_id: user.id // Pastikan user_id dikirim
                }),
            });
            if (!response.ok) throw new Error('Gagal menambahkan laporan.');
            const newReport = await response.json();
            setReports(prev => [newReport.data, ...prev]);
        } catch (err) {
            console.error(err);
            // Handle error (e.g., show notification)
        }
    };
    
    // --- Fungsi CRUD Master Data (Pengurus) ---
    const addPengurus = async (bidangId, newPengurus) => {
        try {
            const response = await fetch(`${API_URL}/api/master/pengurus`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newPengurus, bidang_id: bidangId }),
            });
            if (!response.ok) throw new Error('Gagal menambahkan pengurus.');
            const result = await response.json();
            setPengurusData(prev => ({
                ...prev,
                [bidangId]: [...(prev[bidangId] || []), result.data],
            }));
        } catch (err) {
            console.error(err);
        }
    };
    
    const updatePengurus = async (bidangId, oldNama, updatedPengurus) => {
        const pengurusToUpdate = pengurusData[bidangId]?.find(p => p.nama === oldNama);
        if (!pengurusToUpdate) return;

        try {
            const response = await fetch(`${API_URL}/api/master/pengurus/${pengurusToUpdate.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPengurus),
            });
            if (!response.ok) throw new Error('Gagal memperbarui pengurus.');
            const result = await response.json();
            setPengurusData(prev => ({
                ...prev,
                [bidangId]: prev[bidangId].map(p => p.id === pengurusToUpdate.id ? result.data : p),
            }));
        } catch (err) {
            console.error(err);
        }
    };
    
    const deletePengurus = async (bidangId, pengurusNama) => {
        const pengurusToDelete = pengurusData[bidangId]?.find(p => p.nama === pengurusNama);
        if (!pengurusToDelete) return;

        try {
            const response = await fetch(`${API_URL}/api/master/pengurus/${pengurusToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal menghapus pengurus.');
            setPengurusData(prev => ({
                ...prev,
                [bidangId]: prev[bidangId].filter(p => p.id !== pengurusToDelete.id),
            }));
        } catch (err) {
            console.error(err);
        }
    };

    // --- Fungsi CRUD Master Data (Jobdesk) ---
    const addJobdesk = async (key, newJobdesk) => {
        const [bidang_id, type] = key.split('_');
        try {
            const response = await fetch(`${API_URL}/api/master/jobdesk`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newJobdesk, bidang_id, type: type || null }),
            });
            if (!response.ok) throw new Error('Gagal menambahkan jobdesk.');
            const result = await response.json();
            setJobdeskData(prev => ({
                ...prev,
                [key]: [...(prev[key] || []), {id: result.data.id, description: result.data.description}],
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const updateJobdesk = async (key, oldJobdesk, newJobdesk) => {
        const jobdeskToUpdate = jobdeskData[key]?.find(j => j.description === oldJobdesk);
        if (!jobdeskToUpdate) return;
        
        try {
             const response = await fetch(`${API_URL}/api/master/jobdesk/${jobdeskToUpdate.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newJobdesk }),
            });
            if (!response.ok) throw new Error('Gagal memperbarui jobdesk.');
            const result = await response.json();
            setJobdeskData(prev => ({
                ...prev,
                [key]: prev[key].map(j => j.id === jobdeskToUpdate.id ? { ...j, description: result.data.description } : j),
            }));
        } catch (err) {
             console.error(err);
        }
    };

    const deleteJobdesk = async (key, jobdeskDescription) => {
        const jobdeskToDelete = jobdeskData[key]?.find(j => j.description === jobdeskDescription);
        if (!jobdeskToDelete) return;

        try {
            const response = await fetch(`${API_URL}/api/master/jobdesk/${jobdeskToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal menghapus jobdesk.');
            setJobdeskData(prev => ({
                ...prev,
                [key]: prev[key].filter(j => j.id !== jobdeskToDelete.id),
            }));
        } catch (err) {
            console.error(err);
        }
    };

    // Nilai yang disediakan oleh context
    const value = {
        reports,
        addReport,
        drafts,
        setDrafts,
        jobdeskData,
        addJobdesk,
        updateJobdesk,
        deleteJobdesk,
        pengurusData,
        addPengurus,
        updatePengurus,
        deletePengurus,
        bidangList,
        loading,
        error,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};