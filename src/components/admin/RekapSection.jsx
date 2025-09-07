// src/components/admin/RekapSection.jsx
import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ReportDetailModal from '../modals/ReportDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faEye } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const RekapSection = () => {
    const { reports, bidangList, jobdeskData, pengurusData } = useAppContext();
    const { user } = useAuth();
    
    const [filters, setFilters] = useState({
        tanggal: dayjs().format('YYYY-MM-DD'),
        bidang: '',
    });

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const userRoleCondition = user.role === 'admin_bidang' ? report.bidang === user.bidang : true;
            const dateCondition = filters.tanggal ? report.tanggal === filters.tanggal : true;
            const bidangCondition = filters.bidang ? report.bidang === filters.bidang : true;
            return userRoleCondition && dateCondition && bidangCondition;
        });
    }, [reports, filters, user]);

    const handleViewDetail = (report) => {
        setSelectedReport(report);
        setIsDetailModalOpen(true);
    };
    
    const handleExportPDF = () => {
        if (filteredReports.length === 0) {
            alert('Tidak ada data laporan untuk diekspor pada tanggal yang dipilih.');
            return;
        }

        const doc = new jsPDF();
        const reportDate = dayjs(filters.tanggal).format('DD MMMM YYYY');
        
        doc.setFontSize(18);
        doc.text('Laporan Harian Pengurus PP Al Imdad Putra', 14, 22);
        doc.setFontSize(12);
        doc.text(`Tanggal: ${reportDate}`, 14, 30);
        
        let yPosition = 40;

        filteredReports.forEach(report => {
            const bidangName = bidangList.find(b => b.id === report.bidang)?.name || 'Tidak diketahui';
            let jobdeskKey = report.bidang === 'bapakamar' ? `bapakamar_${report.tab}` : report.bidang;
            const allJobdesks = jobdeskData[jobdeskKey] || [];

            const completedTasks = [];
            const incompletedTasks = [];

            allJobdesks.forEach((job, index) => {
                if (report.jobdesk[index]) {
                    completedTasks.push([completedTasks.length + 1, job]);
                } else {
                    const incompleteDetail = report.incomplete[index] || { alasan: '-', solusi: '-' };
                    incompletedTasks.push([
                        incompletedTasks.length + 1,
                        job,
                        incompleteDetail.alasan,
                        incompleteDetail.solusi
                    ]);
                }
            });
            
            if (yPosition > 40) yPosition += 10;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${bidangName} - ${report.pengurus}`, 14, yPosition);
            yPosition += 6;

            if (completedTasks.length > 0) {
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.text('Tugas yang Dikerjakan:', 14, yPosition);
                yPosition += 4;
                autoTable(doc, {
                    startY: yPosition,
                    head: [['No', 'Deskripsi Tugas']],
                    body: completedTasks,
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                    styles: { fontSize: 8 },
                });
                yPosition = doc.lastAutoTable.finalY + 10;
            }

            if (incompletedTasks.length > 0) {
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.text('Tugas yang Tidak Dikerjakan:', 14, yPosition);
                yPosition += 4;
                autoTable(doc, {
                    startY: yPosition,
                    head: [['No', 'Deskripsi Tugas', 'Alasan', 'Solusi']],
                    body: incompletedTasks,
                    theme: 'grid',
                    headStyles: { fillColor: [231, 76, 60], textColor: 255 },
                    styles: { fontSize: 8 },
                    columnStyles: { 1: { cellWidth: 60 } }
                });
                yPosition = doc.lastAutoTable.finalY + 5;
            }
        });

        doc.save(`Laporan_Harian_${filters.tanggal}.pdf`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-700">Filter Laporan</h3>
                <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
                    <input type="date" name="tanggal" value={filters.tanggal} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg w-full md:w-auto" />
                    <select name="bidang" value={filters.bidang} onChange={handleFilterChange} className="px-4 py-2 border rounded-lg w-full md:w-auto">
                        <option value="">Semua Bidang</option>
                        {bidangList.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center">
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                        Export PDF Harian
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengurus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Tugas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReports.length > 0 ? filteredReports.map(report => {
                            const totalTasks = report.jobdesk.length;
                            const completedTasks = report.jobdesk.filter(Boolean).length;
                            return (
                                <tr key={report.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.pengurus}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bidangList.find(b => b.id === report.bidang)?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className="text-green-600 font-semibold">{completedTasks} Selesai</span> / 
                                        <span className="text-red-600 font-semibold"> {totalTasks - completedTasks} Belum</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleViewDetail(report)} className="text-blue-600 hover:text-blue-800 flex items-center">
                                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                                            Lihat Detail
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Tidak ada laporan pada tanggal yang dipilih.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ReportDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                report={selectedReport}
            />
        </div>
    );
};

export default RekapSection;