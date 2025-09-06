// src/components/admin/PieChart.jsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ chartData }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Status Penyelesaian Laporan',
            },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default PieChart;