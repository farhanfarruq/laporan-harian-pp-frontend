// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        {/* Outlet akan merender komponen halaman (Dashboard, Admin, dll.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;