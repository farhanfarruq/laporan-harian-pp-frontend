// src/context/AppContext.jsx
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialJobdeskData, initialPengurusData, bidangList } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [reports, setReports] = useLocalStorage('reports', []);
    const [drafts, setDrafts] = useLocalStorage('drafts', {});
    const [jobdeskData, setJobdeskData] = useLocalStorage('jobdeskData', initialJobdeskData);
    const [pengurusData, setPengurusData] = useLocalStorage('pengurusData', initialPengurusData);

    const addReport = (report) => {
        setReports(prevReports => [...prevReports, report]);
    };
    
    // Pengurus CRUD
    const addPengurus = (bidangId, newPengurus) => {
        setPengurusData(prev => {
            const list = prev[bidangId] || [];
            const updatedList = [...list, newPengurus.bidang === 'bapakamar' ? { nama: newPengurus.nama, kelas: newPengurus.kelas } : newPengurus.nama];
            return { ...prev, [bidangId]: updatedList };
        });
    };

    const updatePengurus = (bidangId, oldNama, updatedPengurus) => {
        setPengurusData(prev => {
            const list = prev[bidangId] || [];
            const updatedList = list.map(p => {
                 const currentName = typeof p === 'object' ? p.nama : p;
                 if (currentName === oldNama) {
                     return updatedPengurus.bidang === 'bapakamar' ? { nama: updatedPengurus.nama, kelas: updatedPengurus.kelas } : updatedPengurus.nama;
                 }
                 return p;
            });
            return { ...prev, [bidangId]: updatedList };
        });
    };

    const deletePengurus = (bidangId, pengurusNama) => {
        setPengurusData(prev => {
            const list = prev[bidangId] || [];
            const updatedList = list.filter(p => (typeof p === 'object' ? p.nama : p) !== pengurusNama);
            return { ...prev, [bidangId]: updatedList };
        });
    };
    
    // Jobdesk CRUD
    const addJobdesk = (bidangId, newJobdesk) => {
        setJobdeskData(prev => {
            const list = prev[bidangId] || [];
            return { ...prev, [bidangId]: [...list, newJobdesk] };
        });
    };
    
    const updateJobdesk = (bidangId, index, updatedText) => {
        setJobdeskData(prev => {
            const list = prev[bidangId] || [];
            const updatedList = [...list];
            updatedList[index] = updatedText;
            return { ...prev, [bidangId]: updatedList };
        });
    };
    
    const deleteJobdesk = (bidangId, index) => {
        setJobdeskData(prev => {
            const list = prev[bidangId] || [];
            const updatedList = list.filter((_, i) => i !== index);
            return { ...prev, [bidangId]: updatedList };
        });
    };

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
        bidangList
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};