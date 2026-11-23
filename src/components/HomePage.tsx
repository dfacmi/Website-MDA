import { ArrowRight, MessageCircle } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import {
  CORE_PROGRAMS,
  HERO_IMAGE,
  HOME_HIGHLIGHTS,
  TESTIMONIALS,
  WHATSAPP_URL,
  WHY_MDA_POINTS,
  type PageId,
} from '../data/mdaContent';
import { CornerPhotoButton } from './CornerPhotoButton';
import { SafeImage } from './SafeImage';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const HERO_PHOTO_KEY = 'home_hero';

export function HomePage({ onNavigate }: HomePageProps) {
  const { photos, savePhoto } = usePhotos();
  const heroPhoto = photos[HERO_PHOTO_KEY];

  const handleHeroUpload = (dataUrl: string) => savePhoto(HERO_PHOTO_KEY, dataUrl);

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-[#E2E8E5] bg-[#FAFBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-[#0B6B53] mb-4">
                Sekolah Digital Islami Berbasis Project · Sekolah Berbasis IT
              </p>

              <h1 className="font-display font-bold tracking-tight text-[#0F1F1C] leading-[1.12] text-[clamp(2.25rem,4vw,3.5rem)] max-w-2xl">
                Mencetak Muslim Kreatif, Adaptif, dan Siap Menghadapi Era Digital.
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#475A54] max-w-xl">
                Sekolah berbasis IT yang mengembangkan karakter muslim, kreativitas digital, dan
                kesiapan menghadapi era teknologi melalui pembelajaran modern berbasis karya nyata.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('ppdb')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Daftar PPDB
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('programs')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F1F1C] bg-white hover:bg-[#F2F5F3] border border-[#CFD9D4] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Lihat Program
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8E5] bg-[#EEF2F0]">
                <CornerPhotoButton
                  label="Tambah Foto"
                  maxDimension={1200}
                  onSelectPhoto={handleHeroUpload}
                />
                <SafeImage
                  src={heroPhoto ?? HERO_IMAGE}
                  alt="Siswa Muslim Digital Academy berkolaborasi mengerjakan proyek desain digital dan IT di studio belajar"
                  loading="eager"
                  fallbackLabel="Studio Belajar Muslim Digital Academy"
                  className="w-full aspect-[16/10] lg:aspect-auto lg:h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Full-width Highlight Strip */}
          <div className="mt-12 lg:mt-14 pt-8 border-t border-[#E2E8E5]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-6">
              {HOME_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 lg:border-r lg:last:border-r-0 lg:border-[#E2E8E5] lg:pr-5"
                >
                  <span className="font-mono text-xs text-[#B88A3B] tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="font-display text-base font-semibold text-[#0F1F1C]">
                    {item.label}
                  </span>
                  <span className="text-xs text-[#475A54] leading-relaxed">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih MDA */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              <p className="text-sm font-medium text-[#0B6B53]">Keunggulan Pendidikan</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F1C] leading-tight">
                Kenapa memilih MDA?
              </h2>
              <p className="text-base leading-relaxed text-[#475A54]">
                MDA menggabungkan penguatan karakter muslim dengan keterampilan digital yang
                aplikatif. Setiap siswa diarahkan untuk tumbuh dalam adab sekaligus cakap berkarya
                secara profesional.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B6B53] hover:text-[#085441] transition-colors"
                >
                  Pelajari profil & pengajar MDA
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-[#E2E8E5] border-t border-b border-[#E2E8E5]">
              {WHY_MDA_POINTS.map((point) => (
                <div
                  key={point.number}
                  className="py-7 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start"
                >
                  <div className="sm:col-span-2">
                    <span className="font-mono text-sm font-medium text-[#0B6B53] tabular-nums">
                      {point.number}.
                    </span>
                  </div>
                  <div className="sm:col-span-10 space-y-2">
                    <h3 className="font-display text-lg font-semibold text-[#0F1F1C] leading-snug">
                      {point.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-[#475A54]">
                      {point.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Snapshot 6 Program Utama */}
      <section className="py-16 lg:py-24 bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-[#0B6B53]">Jalur Pembelajaran</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F1C]">
                Enam program utama untuk portofolio nyata
              </h2>
              <p className="text-base text-[#475A54] leading-relaxed">
                Dirancang bertahap dari fondasi hingga praktik proyek agar siswa terbiasa
                memecahkan masalah dan mempresentasikan karya digital.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('programs')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B6B53] hover:text-[#085441] whitespace-nowrap shrink-0"
            >
              Lihat semua program & Character Building
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_PROGRAMS.map((program) => (
              <article
                key={program.number}
                className="bg-white border border-[#E2E8E5] rounded-xl p-6 sm:p-7 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#475A54]">
                    <span className="font-mono font-medium text-[#0B6B53] tabular-nums">
                      {program.number}
                    </span>
                    <span>{program.focus}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0F1F1C]">
                    {program.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475A54]">{program.description}</p>
                </div>
                <p className="pt-4 border-t border-[#EDF1EF] text-xs text-[#475A54]">
                  Karya: {program.deliverable}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni (tanpa foto) */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="text-sm font-medium text-[#0B6B53]">Cerita dari Komunitas MDA</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F1C]">
              Testimoni orang tua, siswa, dan alumni
            </h2>
            <p className="text-base text-[#475A54] leading-relaxed">
              Pengalaman langsung dari keluarga besar Muslim Digital Academy yang menjalani proses
              belajar berbasis karya dan adab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, idx) => (
              <figure
                key={item.id}
                className="bg-[#FAFBFA] border border-[#E2E8E5] rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#475A54]">
                    <span className="font-mono text-[#0B6B53] tabular-nums">0{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.context}</span>
                  </div>
                  <blockquote className="font-display text-lg font-medium text-[#0F1F1C] leading-relaxed">
                    “{item.quote}”
                  </blockquote>
                </div>
                <figcaption className="pt-4 border-t border-[#E2E8E5] text-sm font-semibold text-[#0F1F1C]">
                  {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <section className="bg-[#0F1F1C] mda-lattice text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-sm font-medium text-[#7AD3B8]">Penerimaan Peserta Didik Baru</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Siap memulai perjalanan belajar digital yang islami dan terarah?
              </h2>
              <p className="text-base text-[#C7D5CF] max-w-2xl leading-relaxed">
                Konsultasikan program, jadwal, biaya, dan ketersediaan kelas secara langsung bersama
                tim admin PPDB Muslim Digital Academy.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigate('ppdb')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F1F1C] bg-white hover:bg-[#EDF2F0] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Daftar PPDB
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white border border-white/25 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
