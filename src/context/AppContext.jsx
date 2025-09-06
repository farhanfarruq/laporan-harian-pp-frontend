// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialJobdeskData, initialPengurusData, bidangList } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [reports, setReports] = useLocalStorage('reports', []);
    const [drafts, setDrafts] = useLocalStorage('drafts', {});
    
    // Kita kembalikan data dari file statis, bukan dari API
    const [jobdeskData, setJobdeskData] = useState(initialJobdeskData);
    const [pengurusData, setPengurusData] = useState(initialPengurusData);

    const addReport = (report) => {
        setReports(prevReports => [...prevReports, report]);
    };
    
    const value = {
        reports,
        addReport,
        drafts,
        setDrafts,
        jobdeskData,
        setJobdeskData,
        pengurusData,
        setPengurusData,
        bidangList // bidangList juga dari data statis
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};