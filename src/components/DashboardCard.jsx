// src/components/DashboardCard.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBed, faShieldAlt, faPalette, faBroom, faTools, faHeartbeat, faCog 
} from '@fortawesome/free-solid-svg-icons';

// Mapping string names to icon objects
const iconMap = {
    'fa-bed': faBed,
    'fa-shield-alt': faShieldAlt,
    'fa-palette': faPalette,
    'fa-broom': faBroom,
    'fa-tools': faTools,
    'fa-heartbeat': faHeartbeat,
    'fa-cog': faCog,
};

const DashboardCard = ({ title, description, icon, color, onClick }) => {
    const cardIcon = iconMap[icon] || faCog;

    return (
        <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-lg"
            onClick={onClick}
        >
            <div className="flex items-center mb-4">
                <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mr-4`}>
                    <FontAwesomeIcon icon={cardIcon} className="text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
};

export default DashboardCard;