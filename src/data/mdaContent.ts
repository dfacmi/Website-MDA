export type PageId = 'home' | 'about' | 'ppdb' | 'programs' | 'gallery' | 'contact';

export interface NavItem {
  id: PageId;
  label: string;
}

export interface CoreProgram {
  number: string;
  title: string;
  focus: string;
  description: string;
  deliverable: string;
}

export interface CharacterProgram {
  number: string;
  title: string;
  description: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  defaultPhoto?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  context: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
}

export const WHATSAPP_NUMBER = '+62 895-3740-04000';
export const WHATSAPP_URL = 'https://wa.me/62895374004000';
export const SCHOOL_EMAIL = 'dfacmi123@gmail.com';
export const SCHOOL_ADDRESS =
  '7Q68+3VH, Dua, Grajegan, Kec. Tawangsari, Kabupaten Sukoharjo, Jawa Tengah 57561';
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=7Q68%2B3VH,+Dua,+Grajegan,+Kec.+Tawangsari,+Kabupaten+Sukoharjo,+Jawa+Tengah+57561';
export const GOOGLE_MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=7Q68%2B3VH,+Dua,+Grajegan,+Kec.+Tawangsari,+Kabupaten+Sukoharjo,+Jawa+Tengah+57561&t=&z=16&ie=UTF8&iwloc=&output=embed';

export const HERO_IMAGE = '/assets/photos/home_hero.jpg';
export const ABOUT_PROFILE_IMAGE = '/assets/photos/about_profile.jpg';
export const SCHOOL_LOGO = '/assets/aistudio/image_366e8f5d.png';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'ppdb', label: 'PPDB' },
  { id: 'programs', label: 'Programs' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

export const HOME_HIGHLIGHTS = [
  { label: 'Project Based', detail: 'Karya & portofolio nyata' },
  { label: '6 Program Utama', detail: 'Desain, AI, hingga media' },
  { label: 'Digital Skill', detail: 'Aplikatif di industri kreatif' },
  { label: 'IT', detail: 'Future-ready students' },
  { label: 'Learning Path', detail: 'Terarah & terukur' },
];

export const WHY_MDA_POINTS = [
  {
    number: '01',
    title: 'Kurikulum digital yang relevan dengan kebutuhan masa depan.',
    detail: 'Materi disusun mengikuti perkembangan industri kreatif, desain antarmuka, pemasaran digital, dan pemanfaatan AI modern.',
  },
  {
    number: '02',
    title: 'Pembinaan adab dan karakter muslim dalam aktivitas belajar.',
    detail: 'Penguasaan teknologi berjalan berdampingan dengan pembiasaan adab, tanggung jawab, dan nilai-nilai islami setiap hari.',
  },
  {
    number: '03',
    title: 'Pembelajaran berbasis project agar siswa punya portofolio nyata.',
    detail: 'Setiap jalur belajar menghasilkan karya konkret yang terkurasi sebagai bekal studi lanjut maupun dunia profesional.',
  },
  {
    number: '04',
    title: 'Lingkungan belajar modern, suportif, dan mudah diikuti.',
    detail: 'Pendampingan intensif bersama praktisi dan mentor dalam suasana kelas kolaboratif yang nyaman untuk bertumbuh.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'parent',
    quote:
      'MDA membantu anak kami lebih percaya diri membuat karya digital sambil tetap menjaga nilai islami.',
    author: 'Orang Tua Siswa',
    context: 'Wali Murid Muslim Digital Academy',
  },
  {
    id: 'student-2025',
    quote:
      'Materinya praktis dan menyenangkan. Saya bisa belajar desain, AI, dan cara membuat konten yang bermanfaat.',
    author: 'Siswa Angkatan 2025',
    context: 'Peserta Didik Aktif MDA',
  },
  {
    id: 'alumni-design',
    quote:
      'Pembelajarannya terasa terarah dan membantu saya membangun portofolio desain yang lebih rapi.',
    author: 'Alumni Program Design',
    context: 'Lulusan Jalur Desain MDA',
  },
];

export const SCHOOL_VISION =
  'Menjadi lembaga pendidikan digital islami yang mencetak generasi kreatif, adaptif, berakhlak, dan siap berkarya di era teknologi.';

export const SCHOOL_MISSIONS = [
  'Menguatkan adab dan karakter muslim dalam proses belajar.',
  'Menyediakan pembelajaran IT yang praktis dan relevan.',
  'Mendorong siswa menghasilkan portofolio karya digital.',
];

export const TEACHERS: TeacherProfile[] = [
  {
    id: 'teguh-ade-mauladi',
    name: 'Teguh Ade Mauladi, S.Tr.Kom',
    role: 'UI/UX Design & AI Tools',
    initials: 'TA',
    bio: 'Membimbing perancangan pengalaman digital dan pemanfaatan perangkat AI secara produktif serta etis.',
    defaultPhoto: '/assets/photos/teacher_teguh-ade-mauladi.jpg',
  },
  {
    id: 'ghazie-abdul-aziz',
    name: 'Ghazie Abdul Aziz, S.Tr.Kom',
    role: 'Graphic Design',
    initials: 'GA',
    bio: 'Fokus pada fundamental desain grafis, identitas visual, tata letak editorial, dan konten kreatif.',
    defaultPhoto: '/assets/photos/teacher_ghazie-abdul-aziz.jpg',
  },
  {
    id: 'azmuhu-syahid',
    name: 'Azmuhu Syahid, S.Pd',
    role: 'Kepala & Diniyyah',
    initials: 'AS',
    bio: 'Memimpin penyelenggaraan pendidikan MDA serta membina penguatan diniyyah, adab, dan karakter siswa.',
    defaultPhoto: '/assets/photos/teacher_azmuhu-syahid.jpg',
  },
  {
    id: 'rizky-adi-pangestu',
    name: 'Rizky Adi Pangestu',
    role: 'Graphic Design',
    initials: 'RA',
    bio: 'Mendampingi praktik produksi karya grafis, eksplorasi visual, dan penyusunan portofolio siswa.',
    defaultPhoto: '/assets/photos/teacher_rizky-adi-pangestu.jpg',
  },
];

export const CORE_PROGRAMS: CoreProgram[] = [
  {
    number: '01',
    title: 'UI/UX Design',
    focus: 'Antarmuka & Pengalaman Pengguna',
    description:
      'Belajar merancang pengalaman digital yang mudah digunakan, rapi, dan sesuai kebutuhan pengguna.',
    deliverable: 'Wireframe, desain aplikasi, & studi kasus UX',
  },
  {
    number: '02',
    title: 'Graphic Design',
    focus: 'Identitas Visual & Komunikasi Grafis',
    description:
      'Mengembangkan kemampuan visual branding, layout, poster, dan konten kreatif untuk media digital.',
    deliverable: 'Brand kit, poster kampanye, & layout media',
  },
  {
    number: '03',
    title: 'AI Tools',
    focus: 'Produktivitas & Kreativitas Berbasis AI',
    description:
      'Memanfaatkan perangkat AI secara produktif, etis, dan kreatif untuk pembelajaran serta karya nyata.',
    deliverable: 'Alur kerja AI kreatif & asistensi proyek digital',
  },
  {
    number: '04',
    title: 'Internet Marketing',
    focus: 'Strategi Digital & Komunikasi Brand',
    description:
      'Mengenal strategi pemasaran digital, konten, analitik dasar, dan komunikasi brand online.',
    deliverable: 'Rencana konten, kampanye digital, & laporan analitik',
  },
  {
    number: '05',
    title: 'Photography',
    focus: 'Komposisi, Cahaya & Dokumentasi',
    description:
      'Mengasah kemampuan mengambil foto yang kuat secara visual untuk dokumentasi, produk, dan konten kreatif.',
    deliverable: 'Foto produk, dokumentasi acara, & kurasi visual',
  },
  {
    number: '06',
    title: 'Videography',
    focus: 'Produksi & Penyuntingan Video',
    description:
      'Belajar merancang, merekam, dan menyusun video pendek yang komunikatif untuk media digital.',
    deliverable: 'Video profil, konten edukatif, & reel kampanye',
  },
];

export const CHARACTER_PROGRAMS: CharacterProgram[] = [
  {
    number: '01',
    title: 'Visit Exhibition',
    description:
      'Siswa mengamati pameran kreatif untuk memperluas referensi visual, ide produk, dan standar karya.',
  },
  {
    number: '02',
    title: 'Visit Studio',
    description:
      'Kunjungan ke studio kreatif agar siswa memahami proses produksi profesional dari dekat.',
  },
  {
    number: '03',
    title: 'Paper Clip Challenge',
    description:
      'Latihan berpikir kreatif melalui tantangan sederhana yang mendorong ide, strategi, dan kolaborasi.',
  },
  {
    number: '04',
    title: 'Barter Better',
    description:
      'Aktivitas negosiasi dan value creation untuk melatih komunikasi, keberanian, dan problem solving.',
  },
  {
    number: '05',
    title: 'MDA Show Up',
    description:
      'Ruang tampil untuk membangun percaya diri, personal branding, dan kemampuan presentasi.',
  },
  {
    number: '06',
    title: 'MDA Mengajar',
    description:
      'Siswa berbagi ilmu kepada orang lain sebagai latihan empati, kepemimpinan, dan kebermanfaatan.',
  },
  {
    number: '07',
    title: 'MDA Exhibition',
    description:
      'Showcase karya siswa untuk melatih kurasi, komunikasi karya, dan apresiasi proses belajar.',
  },
  {
    number: '08',
    title: 'Cooking Class',
    description:
      'Kelas praktik yang mengasah kerja tim, disiplin proses, dan kreativitas dalam aktivitas harian.',
  },
  {
    number: '09',
    title: 'Designer Petani',
    description:
      'Program lintas pengalaman yang menghubungkan kreativitas desain dengan realitas sosial dan alam.',
  },
  {
    number: '10',
    title: 'Rihlah',
    description:
      'Perjalanan edukatif untuk memperkuat ukhuwah, refleksi, dan pembentukan karakter siswa.',
  },
];

export const PPDB_REQUIREMENTS = [
  'Mengisi formulir pendaftaran',
  'Fotokopi kartu keluarga',
  'Fotokopi akta kelahiran',
  'Pas foto terbaru',
  'Mengikuti sesi konsultasi awal',
  'Memiliki minat dan bakat di dunia multimedia dan industri kreatif',
];

export const PPDB_FLOW = [
  {
    step: '01',
    title: 'Konsultasi program',
    detail: 'Diskusi awal bersama admin PPDB terkait pilihan program, jadwal belajar, biaya, dan kuota kelas.',
  },
  {
    step: '02',
    title: 'Pengisian formulir',
    detail: 'Melengkapi data calon siswa dan orang tua/wali melalui formulir pendaftaran resmi MDA.',
  },
  {
    step: '03',
    title: 'Verifikasi berkas',
    detail: 'Penyerahan dan pengecekan kelengkapan dokumen persyaratan administrasi pendaftaran.',
  },
  {
    step: '04',
    title: 'Wawancara singkat',
    detail: 'Sesi perkenalan bersama calon siswa dan wali untuk melihat minat, kesiapan, serta karakter belajar.',
  },
  {
    step: '05',
    title: 'Pengumuman hasil',
    detail: 'Penyampaian hasil seleksi penerimaan beserta arahan langkah awal memulai pembelajaran di MDA.',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'acmi-magang',
    src: '/assets/photos/gallery_acmi-magang.jpg',
    alt: 'Dokumentasi kegiatan praktik magang siswa Muslim Digital Academy di studio digital',
  },
  {
    id: 'acmi-mengajar',
    src: '/assets/photos/gallery_acmi-mengajar.jpg',
    alt: 'Dokumentasi kegiatan siswa MDA berbagi ilmu desain grafis di ruang kelas',
  },
  {
    id: 'event-organizer',
    src: '/assets/photos/gallery_event-organizer.jpg',
    alt: 'Dokumentasi tim event organizer siswa MDA saat menyelenggarakan pameran karya',
  },
  {
    id: 'fotbar-1',
    src: '/assets/photos/gallery_fotbar-1.jpg',
    alt: 'Foto bersama siswa dan mentor Muslim Digital Academy di halaman sekolah',
  },
  {
    id: 'fotbar-2',
    src: '/assets/photos/gallery_fotbar-2.jpg',
    alt: 'Foto bersama siswa MDA di ruang studio kreatif setelah sesi proyek',
  },
  {
    id: 'fotbar-3',
    src: '/assets/photos/gallery_fotbar-3.jpg',
    alt: 'Foto bersama siswa MDA dalam kegiatan rihlah edukatif di alam terbuka',
  },
  {
    id: 'happy-edurace',
    src: '/assets/photos/gallery_happy-edurace.jpg',
    alt: 'Dokumentasi kegiatan Happy Edurace melatih kolaborasi dan pemecahan masalah siswa MDA',
  },
  {
    id: 'job-survival',
    src: '/assets/photos/gallery_job-survival.jpg',
    alt: 'Dokumentasi kegiatan Job Survival melatih komunikasi, negosiasi, dan presentasi karya',
  },
  {
    id: 'sidang-akhir',
    src: '/assets/photos/gallery_sidang-akhir.jpg',
    alt: 'Dokumentasi sidang akhir presentasi portofolio karya digital siswa MDA',
  },
  {
    id: 'visit-studio',
    src: '/assets/photos/gallery_visit-studio.jpg',
    alt: 'Dokumentasi kegiatan Visit Studio siswa MDA mengenal proses produksi kreatif profesional',
  },
  {
    id: 'kegiatan-umum-1',
    src: '/assets/photos/gallery_kegiatan-umum-1.jpg',
    alt: 'Dokumentasi kelas praktik fotografi produk dan tata cahaya siswa MDA',
  },
  {
    id: 'kegiatan-umum-2',
    src: '/assets/photos/gallery_kegiatan-umum-2.jpg',
    alt: 'Dokumentasi sesi pendampingan proyek UI/UX dan AI Tools bersama pengajar MDA',
  },
];
