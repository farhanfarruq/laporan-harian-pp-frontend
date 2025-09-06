// src/components/modals/SuccessModal.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const SuccessModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faCheck} className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Berhasil!</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;