// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReportFormPage from './pages/ReportFormPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* === BAGIAN YANG DIPERBAIKI === */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Rute-rute ini sekarang akan dirender di dalam <Outlet /> milik Layout */}
        <Route index element={<DashboardPage />} />
        <Route path="report/:bidangId" element={<ReportFormPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      {/* === AKHIR PERBAIKAN === */}

    </Routes>
  );
}

export default App;