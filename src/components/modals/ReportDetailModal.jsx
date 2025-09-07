// src/components/modals/ReportDetailModal.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faTimesCircle, faUser, faBriefcase, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const ReportDetailModal = ({ isOpen, onClose, report }) => {
    if (!isOpen || !report) return null;

    const completedTasks = report.details.filter(d => d.status === 'selesai');
    const incompletedTasks = report.details.filter(d => d.status !== 'selesai');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Detail Laporan</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
                    <div className="flex items-center"><FontAwesomeIcon icon={faUser} className="text-blue-500 mr-3 w-4" /> <strong>Pengurus:</strong><span className="ml-2 text-gray-700">{report.pengurus.nama}</span></div>
                    <div className="flex items-center"><FontAwesomeIcon icon={faBriefcase} className="text-blue-500 mr-3 w-4" /> <strong>Bidang:</strong><span className="ml-2 text-gray-700">{report.bidang.name}</span></div>
                    <div className="flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 mr-3 w-4" /> <strong>Tanggal:</strong><span className="ml-2 text-gray-700">{dayjs(report.tanggal).format('DD MMMM YYYY')}</span></div>
                    <div className="flex items-center"><FontAwesomeIcon icon={faClock} className="text-blue-500 mr-3 w-4" /> <strong>Waktu Submit:</strong><span className="ml-2 text-gray-700">{dayjs(report.created_at).format('HH:mm')}</span></div>
                </div>

                <div className="space-y-6">
                    {/* Bagian Tugas Selesai */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Kegiatan yang Dikerjakan</h4>
                        {completedTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {completedTasks.map((detail) => (
                                    <li key={detail.id} className="flex items-start text-sm">
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-3 mt-1" />
                                        <span className="text-gray-700">{detail.jobdesk.description}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Tidak ada tugas yang selesai dilaporkan.</p>
                        )}
                    </div>

                    {/* Bagian Tugas Tidak Selesai */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Kegiatan yang Tidak Dikerjakan</h4>
                        {incompletedTasks.length > 0 ? (
                             <div className="space-y-4">
                                {incompletedTasks.map((detail) => (
                                     <div key={detail.id} className="p-3 border border-red-200 rounded-lg bg-red-50 text-sm">
                                        <div className="flex items-start font-semibold">
                                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-3 mt-1" />
                                            <p className="text-red-800">{detail.jobdesk.description}</p>
                                        </div>
                                        <div className="pl-7 mt-2 space-y-1 text-xs">
                                            <p><strong>Alasan:</strong> <span className="text-gray-600">{detail.alasan}</span></p>
                                            <p><strong>Solusi:</strong> <span className="text-gray-600">{detail.solusi}</span></p>
                                        </div>
                                     </div>
                                ))}
                             </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Semua tugas dilaporkan selesai.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailModal;