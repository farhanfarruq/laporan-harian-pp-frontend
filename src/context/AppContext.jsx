import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient.js'; // Perbaikan: Menambahkan ekstensi file .js
import { useAuth } from './AuthContext.jsx'; // Perbaikan: Menambahkan ekstensi file .jsx

const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Dapatkan status otentikasi

    // State untuk data utama dari API
    const [reports, setReports] = useState([]);
    const [jobdeskData, setJobdeskData] = useState({});
    const [pengurusData, setPengurusData] = useState({});
    const [bidangData, setBidangData] = useState([]);

    // State untuk draft (disimpan di memory, hilang saat refresh)
    const [drafts, setDrafts] = useState({});

    // State untuk loading dan error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect untuk mengambil data awal saat pengguna terotentikasi
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!isAuthenticated) {
                // Reset data jika logout
                setReports([]);
                setJobdeskData({});
                setPengurusData({});
                setBidangData([]);
                setLoading(false);
                return; // Jangan fetch data jika belum login
            }

            setLoading(true);
            setError(null);

            try {
                // Mengambil semua data yang dibutuhkan secara paralel
                const [laporanRes, jobdeskRes, pengurusRes, bidangRes] = await Promise.all([
                    axiosClient.get('/laporan'),
                    axiosClient.get('/jobdesk'),
                    axiosClient.get('/pengurus'),
                    axiosClient.get('/bidang'),
                ]);

                // Update state dengan data dari API
                setReports(laporanRes.data);
                setJobdeskData(jobdeskRes.data);
                setPengurusData(pengurusRes.data);
                setBidangData(bidangRes.data);

            } catch (err) {
                console.error("Gagal mengambil data awal:", err);
                setError("Tidak dapat memuat data dari server. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [isAuthenticated]); // Jalankan effect ini setiap kali status otentikasi berubah


    // Fungsi untuk menambah laporan baru melalui API
    const addReport = async (newReportData) => {
        try {
            const response = await axiosClient.post('/laporan', newReportData);
            // Tambahkan laporan baru ke daftar laporan di state
            setReports(prevReports => [response.data, ...prevReports]);
            return response.data; // Kembalikan data laporan baru untuk Aksi selanjutnya
        } catch (err) {
            console.error("Gagal mengirim laporan:", err);
            // Melempar error agar bisa ditangkap di komponen form
            throw err.response?.data?.message || "Terjadi kesalahan saat menyimpan laporan.";
        }
    };
    
    // Fungsi untuk mengambil laporan dengan filter
    const fetchReports = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Hapus filter yang kosong
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v != null && v !== '')
            );
            const params = new URLSearchParams(cleanFilters).toString();
            const response = await axiosClient.get(`/laporan?${params}`);
            setReports(response.data);
        } catch (err) {
            console.error("Gagal memfilter laporan:", err);
            setError("Tidak dapat memuat data laporan.");
        } finally {
            setLoading(false);
        }
    };


    // Fungsi untuk draft tetap sama, karena ini adalah fitur sisi client
    const saveDraft = (bidang, data) => {
        setDrafts(prevDrafts => ({
            ...prevDrafts,
            [bidang]: data,
        }));
    };

    const deleteDraft = (bidang) => {
        setDrafts(prevDrafts => {
            const newDrafts = { ...prevDrafts };
            delete newDrafts[bidang];
            return newDrafts;
        });
    };

    const value = {
        reports,
        drafts,
        jobdeskData,
        pengurusData,
        bidangData,
        loading,
        error,
        addReport,
        saveDraft,
        deleteDraft,
        fetchReports,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

