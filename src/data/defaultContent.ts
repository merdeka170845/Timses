import type { SiteContent } from '../types'

export const defaultContent: SiteContent = {
  groupName: 'Tim Sukses',
  shortName: 'Timses',
  tagline: 'Angkatan 24 HMTI • Kelas Informatika • Semester 1 sampai menjelang Semester 5',
  intro:
    'Website ini adalah ruang digital untuk mengenalkan siapa kami, menyimpan cerita perjalanan kelas, dan merawat kenangan yang bertumbuh sejak awal kuliah.',
  heroTitle: 'Satu kelas, banyak cerita, dan kenangan yang terus hidup.',
  heroDescription:
    'Kami dipertemukan sebagai satu kelas di Prodi Informatika, lalu bertumbuh bersama sebagai angkatan 24 HMTI. Dari tugas, praktikum, kepanitiaan, sampai momen receh yang tidak terlupakan — semuanya terangkum di sini.',
  ctaPrimary: 'Lihat dokumentasi',
  ctaSecondary: 'Kenali kami',
  aboutTitle: 'Ruang sederhana untuk perjalanan satu kelas.',
  aboutText:
    'Kami adalah Tim Sukses, satu kelas dari Prodi Informatika yang tumbuh bersama sejak semester 1. Bukan hanya kumpulan mahasiswa, tetapi teman seperjalanan yang melewati ritme kuliah, organisasi, deadline, presentasi, dan dinamika kehidupan kampus secara bersama.',
  storyText:
    'Website ini dirancang sebagai rumah digital untuk perkenalan, dokumentasi, dan arsip kenangan kelas, dengan tampilan yang lebih bersih serta tetap menjaga privasi publik.',
  membersNote:
    'Nama dan jumlah anggota disimpan untuk kebutuhan admin dan tidak ditampilkan di halaman publik demi menjaga privasi.',
  memberCount: 0,
  adminPassphraseHint: 'Password admin disembunyikan dari tampilan publik.',
  driveFolderUrl:
    'https://drive.google.com/drive/folders/1dME-T5KUAtn0Vt3zhTDtpYW0WCthjge1?usp=drive_link',
  driveFolderId: '1dME-T5KUAtn0Vt3zhTDtpYW0WCthjge1',
  stats: [],
  timeline: [
    {
      semester: 'Semester 1',
      title: 'Mulai saling kenal',
      description:
        'Masa adaptasi, tugas-tugas dasar, dan mulai memahami ritme dunia perkuliahan bersama. Banyak nama yang awalnya asing kemudian menjadi akrab.',
      highlight: ''
    },
    {
      semester: 'Semester 2',
      title: 'Mulai kompak',
      description:
        'Kerja kelompok, obrolan di kelas, dan momen di luar kampus mulai membentuk chemistry yang lebih kuat. Dinamika kelas terasa semakin hidup.',
      highlight: ''
    },
    {
      semester: 'Semester 3',
      title: 'Tantangan makin nyata',
      description:
        'Materi semakin kompleks, deadline makin padat, tetapi solidaritas ikut tumbuh. Banyak kenangan terbentuk justru di fase paling sibuk.',
      highlight: ''
    },
    {
      semester: 'Semester 4',
      title: 'Lebih matang dan terarah',
      description:
        'Cara belajar, komunikasi, dan kerja sama semakin dewasa. Setiap orang mulai menunjukkan warna dan perannya masing-masing.',
      highlight: ''
    },
    {
      semester: 'Menjelang Semester 5',
      title: 'Merawat cerita yang sudah berjalan',
      description:
        'Kini kami tidak lagi sekadar satu kelas. Kami adalah kumpulan cerita, pengalaman, perjuangan, dan memori yang ingin kami simpan baik-baik.',
      highlight: ''
    }
  ],
  members: [],
  highlights: [
    {
      title: 'Folder utama dokumentasi',
      type: 'drive-folder',
      description:
        'Semua dokumentasi utama diarahkan ke folder Drive agar kapasitas upload tidak bergantung pada hosting gratis.',
      link: 'https://drive.google.com/drive/folders/1dME-T5KUAtn0Vt3zhTDtpYW0WCthjge1?usp=drive_link'
    },
    {
      title: 'Folder video',
      type: 'drive-folder',
      description: 'Kumpulan video dokumentasi di dalam folder utama.',
      link: 'https://drive.google.com/drive/folders/1QvhQ9I4-28s555W6AuGro6xuDy4sl6O7?usp=drive_link'
    },
    {
      title: 'Folder foto',
      type: 'drive-folder',
      description: 'Kumpulan foto dokumentasi di dalam folder utama.',
      link: 'https://drive.google.com/drive/folders/1fP2yrUUWk3aVPvvzjUaLpCR5woyelWfE?usp=drive_link'
    }
  ],
  quotes: []
}
