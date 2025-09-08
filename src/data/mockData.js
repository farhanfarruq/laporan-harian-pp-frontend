// src/data/mockData.js

export const users = {
    'pengurus': { password: 'pengurus123', role: 'pengurus', name: 'Pengurus Umum' },
    'adminutama': { password: 'adminutama2025', role: 'admin_utama', name: 'Admin Utama' },
    'adminbapakamar': { password: 'admin123', role: 'admin_bidang', bidang: 'bapakamar', name: 'Admin Bapak Kamar' }
};

export const bidangList = [
    { id: 'bapakamar', name: 'Pengurus Bapak Kamar', icon: 'fa-bed', color: 'bg-blue-500' },
    { id: 'bk_keamanan', name: 'Pengurus BK dan Keamanan', icon: 'fa-shield-alt', color: 'bg-green-500' },
    { id: 'minat_bakat', name: 'Pengurus Minat Bakat', icon: 'fa-palette', color: 'bg-purple-500' },
    { id: 'kebersihan', name: 'Pengurus Kebersihan', icon: 'fa-broom', color: 'bg-yellow-500' },
    { id: 'sarpras', name: 'Pengurus Sarpras', icon: 'fa-tools', color: 'bg-orange-500' },
    { id: 'kesehatan', name: 'Pengurus Kesehatan', icon: 'fa-heartbeat', color: 'bg-red-500' }
];

export const initialPengurusData = {
    'bapakamar': [
        { nama: 'Arif Hermawan', kelas: '7' },
        { nama: 'Gading Wandira Putra Khoiri', kelas: '7' },
        { nama: 'Hasan Ngulwi Mufti', kelas: '7' },
        { nama: 'Iqbal Rofiqul Azhar', kelas: '8' },
        { nama: 'Mohamad Mauludul Fadilah', kelas: '8' },
        { nama: 'Muhammad Sulthan Maulana Asy Syauqi', kelas: '8' },
        { nama: 'M Iqbal Mirza Hidayat', kelas: '9' },
        { nama: 'Muhammad Ngainun Najib', kelas: '9' },
        { nama: 'Muhammad Dzunnurain', kelas: '10' },
        { nama: 'Syahrizal Nur Faizin', kelas: '10' },
        { nama: 'Arif Herianto', kelas: '11' },
        { nama: 'Miftahurroyyan', kelas: '11' },
        { nama: 'Muhammad Latif Baharuddin', kelas: '12' },
        { nama: 'Rafi Luthfan Zaky', kelas: '12' },
        { nama: 'Muhamad Dafa Nur Rohman', kelas: 'tahfidz' },
        { nama: 'Muhamad Dafi Nur Rohim', kelas: 'tahfidz' }
    ],
    'bk_keamanan': ['Ustad Hasan', 'Ustad Ahmad'],
    'minat_bakat': ['Ustadzah Siti', 'Ustad Yusuf'],
    'kebersihan': ['Pak Budi', 'Pak Slamet'],
    'sarpras': ['Pak Joko', 'Pak Andi'],
    'kesehatan': ['Dokter Rina', 'Perawat Sari']
};

export const initialJobdeskData = {
    'bapakamar_malam': [
        'Mengkondisikan santri piket kamar dan sekitarnya bakda jamaah Asar',
        'Mengkondisikan semua santri mandi dan makan sore pukul 17 sampai Magrib',
        'Memastikan santri berangkat jamaah Magrib sebelum adzan',
        'Mengunci gerbang kamar setelah santri berangkat jamaah Magrib',
        'Mendampingi dan mengabsen santri jamaah Magrib',
        'Memastikan santri berangkat sorogan Quran dan Muhafazhah',
        'Memastikan santri berangkat Madin',
        'Memastikan santri mengikuti bandongan talaqqi dan mengabsennya',
        'Mendampingi dan mengabsen santri jamaah Isya',
        'Mendampingi belajar malam bakda Isya',
        'Mengkondisikan santri agar segera tidur pukul 23',
        'Mengabsen santri yang berada di pondok pukul 23',
        'Lainnya'
    ],
    'bapakamar_subuh': [
        'Membangunkan santri untuk jamaah Subuh sebelum Subuh',
        'Menata bantal selimut dan memastikan kamar bersih setelah Subuh',
        'Mengunci gerbang setelah santri berangkat Subuh',
        'Mendampingi dan mengabsen santri jamaah Subuh',
        'Memastikan sorogan Quran dan Kitab bakda Subuh',
        'Mengkondisikan santri piket kamar bakda atau saat sorogan',
        'Mengkondisikan mandi dan sarapan bakda sorogan',
        'Memastikan santri berangkat sekolah sebelum pukul 07',
        'Lainnya'
    ],
    'bk_keamanan': [
        'Melakukan patroli keamanan pondok',
        'Mengecek kondisi gerbang dan pagar',
        'Mendampingi tamu yang berkunjung',
        'Melakukan pembinaan santri bermasalah',
        'Koordinasi dengan pengurus lain'
    ],
    'minat_bakat': [
        'Mengkoordinir kegiatan ekstrakurikuler',
        'Mempersiapkan perlombaan',
        'Melatih santri berbakat',
        'Dokumentasi kegiatan',
        'Evaluasi program minat bakat'
    ],
    'kebersihan': [
        'Mengecek kebersihan kamar santri',
        'Koordinasi piket kebersihan',
        'Pemeliharaan fasilitas kebersihan',
        'Pengelolaan sampah',
        'Monitoring kebersihan lingkungan'
    ],
    'sarpras': [
        'Pemeliharaan fasilitas pondok',
        'Perbaikan kerusakan ringan',
        'Inventarisasi barang',
        'Koordinasi dengan vendor',
        'Perencanaan pengadaan'
    ],
    'kesehatan': [
        'Pemeriksaan kesehatan santri',
        'Penanganan santri sakit',
        'Koordinasi dengan puskesmas',
        'Penyuluhan kesehatan',
        'Monitoring kondisi kesehatan'
    ]
};