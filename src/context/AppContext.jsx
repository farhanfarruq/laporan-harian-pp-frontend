// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

// Fungsi helper untuk standarisasi panggilan API
const apiFetch = async (endpoint, options = {}) => {
    const { token } = options;
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 204) { // Handle "No Content" untuk response DELETE
        return null;
    }
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
    }

    return data;
};

export const AppProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [reports, setReports] = useState([]);
    const [drafts, setDrafts] = useState({}); // Drafts tetap di localStorage
    const [pengurusData, setPengurusData] = useState([]);
    const [jobdeskData, setJobdeskData] = useState([]);
    const [bidangList, setBidangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mengambil semua data awal dari backend saat aplikasi dimuat
    useEffect(() => {
        if (token) {
            const fetchAllData = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const [bidangRes, pengurusRes, jobdeskRes, laporanRes] = await Promise.all([
                        apiFetch('/bidang', { token }),
                        apiFetch('/pengurus', { token }),
                        apiFetch('/jobdesk', { token }),
                        apiFetch('/laporan', { token }),
                    ]);

                    setBidangList(bidangRes);
                    setPengurusData(pengurusRes);
                    setJobdeskData(jobdeskRes);
                    setReports(laporanRes.data);
                } catch (err) {
                    console.error("Gagal mengambil data awal:", err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllData();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Laporan
    const addReport = async (reportData) => {
        const payload = {
            ...reportData,
            user_id: user.id,
        };
        const newReport = await apiFetch('/laporan', {
            method: 'POST',
            body: JSON.stringify(payload),
            token,
        });
        setReports(prev => [newReport.data, ...prev]);
        return newReport.data;
    };

    // Pengurus
    const addPengurus = async (newPengurus) => {
        const createdPengurus = await apiFetch('/master/pengurus', {
            method: 'POST',
            body: JSON.stringify(newPengurus),
            token,
        });
        setPengurusData(prev => [...prev, createdPengurus]);
    };

    const updatePengurus = async (pengurusId, updatedData) => {
        const updatedPengurus = await apiFetch(`/master/pengurus/${pengurusId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            token,
        });
        setPengurusData(prev => prev.map(p => (p.id === pengurusId ? updatedPengurus : p)));
    };

    const deletePengurus = async (pengurusId) => {
        await apiFetch(`/master/pengurus/${pengurusId}`, { method: 'DELETE', token });
        setPengurusData(prev => prev.filter(p => p.id !== pengurusId));
    };

    // Jobdesk
    const addJobdesk = async (newJobdesk) => {
        const createdJobdesk = await apiFetch('/master/jobdesk', {
            method: 'POST',
            body: JSON.stringify(newJobdesk),
            token,
        });
        setJobdeskData(prev => [...prev, createdJobdesk]);
    };

    const updateJobdesk = async (jobdeskId, updatedData) => {
        const updatedJobdesk = await apiFetch(`/master/jobdesk/${jobdeskId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            token,
        });
        setJobdeskData(prev => prev.map(j => (j.id === jobdeskId ? updatedJobdesk : j)));
    };

    const deleteJobdesk = async (jobdeskId) => {
        await apiFetch(`/master/jobdesk/${jobdeskId}`, { method: 'DELETE', token });
        setJobdeskData(prev => prev.filter(j => j.id !== jobdeskId));
    };

    const value = {
        reports, addReport,
        drafts, setDrafts,
        pengurusData, addPengurus, updatePengurus, deletePengurus,
        jobdeskData, addJobdesk, updateJobdesk, deleteJobdesk,
        bidangList,
        loading, error,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};