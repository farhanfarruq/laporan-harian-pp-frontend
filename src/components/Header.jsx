// src/components/Header.jsx
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <img src="/alimdad.png" alt="Logo Al Imdad" className="h-8 w-8 object-contain" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">PP Al Imdad Putra</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 font-medium hidden sm:block">
                            Halo, {user?.name}
                        </span>
                        <button onClick={logout} className="text-gray-500 hover:text-gray-700" title="Logout">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;