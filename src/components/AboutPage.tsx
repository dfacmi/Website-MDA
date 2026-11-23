import { useState, type DragEvent } from 'react';
import { usePhotos } from '../context/PhotoContext';
import {
  ABOUT_PROFILE_IMAGE,
  SCHOOL_ADDRESS,
  SCHOOL_MISSIONS,
  SCHOOL_VISION,
  TEACHERS,
  WHY_MDA_POINTS,
  type TeacherProfile,
} from '../data/mdaContent';
import { compressImageFile } from '../utils/imageStorage';
import { CornerPhotoButton } from './CornerPhotoButton';
import { SafeImage } from './SafeImage';

const ABOUT_PHOTO_KEY = 'about_profile';

interface TeacherCardProps {
  teacher: TeacherProfile;
  photoUrl?: string;
  onSavePhoto: (teacherId: string, dataUrl: string) => Promise<void>;
}

function TeacherCard({ teacher, photoUrl, onSavePhoto }: TeacherCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 720);
      await onSavePhoto(teacher.id, dataUrl);
    } catch {
      // Ignore invalid dropped file.
    }
  };

  return (
    <article className="bg-white border border-[#E2E8E5] rounded-xl overflow-hidden flex flex-col sm:flex-row">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => void onDrop(e)}
        className={`relative w-full sm:w-44 md:w-48 shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-[190px] overflow-hidden border-b sm:border-b-0 sm:border-r border-[#E2E8E5] transition-colors ${
          isDragging ? 'bg-[#E6F2EE] ring-2 ring-inset ring-[#0B6B53]' : 'bg-[#F2F5F3]'
        }`}
      >
        <CornerPhotoButton
          label="Tambah Foto"
          maxDimension={720}
          onSelectPhoto={(dataUrl) => onSavePhoto(teacher.id, dataUrl)}
        />

        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Foto pengajar ${teacher.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full mda-grid-light flex flex-col items-center justify-center p-5 text-center">
            <div className="w-16 h-16 rounded-full border border-[#CFD9D4] bg-white flex items-center justify-center">
              <span className="font-display text-xl font-bold text-[#0B6B53]">
                {teacher.initials}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex-1 min-w-0 flex flex-col justify-center">
        <div className="space-y-2 min-w-0">
          <p className="text-xs font-medium text-[#0B6B53]">{teacher.role}</p>
          <h3 className="font-display text-base sm:text-[17px] font-bold text-[#0F1F1C] leading-snug sm:whitespace-nowrap truncate">
            {teacher.name}
          </h3>
          <p className="text-sm text-[#475A54] leading-relaxed">{teacher.bio}</p>
        </div>
      </div>
    </article>
  );
}

export function AboutPage() {
  const { photos, savePhoto } = usePhotos();
  const aboutPhoto = photos[ABOUT_PHOTO_KEY];

  const handleSavePhoto = (teacherId: string, dataUrl: string) =>
    savePhoto(`teacher_${teacherId}`, dataUrl);

  const handleAboutPhotoUpload = (dataUrl: string) => savePhoto(ABOUT_PHOTO_KEY, dataUrl);

  return (
    <div>
      {/* Profil Sekolah */}
      <section className="bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-sm font-medium text-[#0B6B53]">Tentang Kami · Profil Sekolah</p>
              <h1 className="font-display font-bold tracking-tight text-[#0F1F1C] leading-[1.14] text-[clamp(2rem,3.6vw,3rem)]">
                Pendidikan digital islami yang terarah dan berorientasi karya.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-[#475A54]">
                Muslim Digital Academy adalah sekolah berbasis IT yang membantu siswa mengembangkan
                adab, kreativitas, dan keterampilan digital melalui pembelajaran modern yang terarah.
              </p>
              <p className="text-sm text-[#6B7E77]">{SCHOOL_ADDRESS}</p>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8E5] bg-[#EEF2F0]">
                <CornerPhotoButton
                  label="Tambah Foto"
                  maxDimension={1100}
                  onSelectPhoto={handleAboutPhotoUpload}
                />
                <SafeImage
                  src={aboutPhoto ?? ABOUT_PROFILE_IMAGE}
                  alt="Profil lingkungan belajar Muslim Digital Academy"
                  loading="eager"
                  fallbackLabel="Lingkungan Muslim Digital Academy"
                  className="w-full aspect-[4/3] lg:aspect-auto lg:h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-[#0B6B53]">Visi Sekolah</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1F1C]">
                  Arah pendidikan Muslim Digital Academy
                </h2>
              </div>

              <div className="border-t border-b border-[#E2E8E5] py-6">
                <p className="text-base sm:text-lg font-medium text-[#0F1F1C] leading-relaxed">
                  {SCHOOL_VISION}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-[#0B6B53]">Misi Pembelajaran</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1F1C]">
                  Tiga pilar utama pelaksanaan pendidikan di MDA
                </h2>
              </div>

              <div className="divide-y divide-[#E2E8E5] border-t border-b border-[#E2E8E5]">
                {SCHOOL_MISSIONS.map((mission, idx) => (
                  <div key={mission} className="py-5 flex items-baseline gap-5">
                    <span className="font-mono text-sm font-medium text-[#0B6B53] tabular-nums shrink-0">
                      0{idx + 1}.
                    </span>
                    <p className="text-base font-medium text-[#0F1F1C] leading-relaxed">{mission}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan MDA */}
      <section className="py-16 lg:py-20 bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-10">
            <p className="text-sm font-medium text-[#0B6B53]">Keunggulan MDA</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1F1C]">
              Pendekatan belajar yang menyeimbangkan karakter dan kompetensi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHY_MDA_POINTS.map((item) => (
              <div
                key={item.number}
                className="bg-white border border-[#E2E8E5] rounded-xl p-6 sm:p-7 space-y-2.5"
              >
                <span className="font-mono text-xs font-medium text-[#0B6B53] tabular-nums">
                  {item.number}
                </span>
                <h3 className="font-display text-lg font-bold text-[#0F1F1C] leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475A54] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pengajar MDA */}
      <section id="pengajar" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="text-sm font-medium text-[#0B6B53]">Tim Pendidik & Mentor</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F1C]">
              Pengajar Muslim Digital Academy
            </h2>
            <p className="text-base text-[#475A54] leading-relaxed">
              Dibimbing langsung oleh pendidik diniyyah dan praktisi kreatif.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {TEACHERS.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                photoUrl={photos[`teacher_${teacher.id}`] ?? teacher.defaultPhoto}
                onSavePhoto={handleSavePhoto}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
