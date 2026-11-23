import { useRef, useState, type FormEvent } from 'react';
import { ArrowDown, CheckCircle2, Info, MessageCircle, Send } from 'lucide-react';
import {
  CORE_PROGRAMS,
  PPDB_FLOW,
  PPDB_REQUIREMENTS,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from '../data/mdaContent';

interface PpdbSubmission {
  registrationId: string;
  studentName: string;
  parentName: string;
  programInterest: string;
}

export function PpdbPage() {
  const formSectionRef = useRef<HTMLElement | null>(null);

  const [studentName, setStudentName] = useState('');
  const [schoolOrigin, setSchoolOrigin] = useState('');
  const [parentName, setParentName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [programInterest, setProgramInterest] = useState(CORE_PROGRAMS[0].title);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<PpdbSubmission | null>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (studentName.trim().length < 2) {
      setError('Mohon isi nama lengkap calon siswa.');
      return;
    }
    if (parentName.trim().length < 2) {
      setError('Mohon isi nama orang tua atau wali.');
      return;
    }
    if (whatsapp.replace(/\D/g, '').length < 9) {
      setError('Mohon masukkan nomor WhatsApp aktif yang valid.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          schoolOrigin,
          parentName,
          whatsapp,
          programInterest,
          notes,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        registrationId?: string;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.registrationId) {
        setError(data.error || 'Terjadi kendala saat mengirim formulir. Silakan coba lagi.');
        return;
      }

      setSubmission({
        registrationId: data.registrationId,
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        programInterest,
      });
    } catch {
      setError('Koneksi gagal. Silakan coba kembali atau hubungi admin PPDB melalui WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const waConfirmLink = submission
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(
        `Assalamu'alaikum Admin PPDB MDA, saya ${submission.parentName} telah mengisi formulir pendaftaran (${submission.registrationId}) untuk calon siswa ${submission.studentName} dengan minat program ${submission.programInterest}. Mohon informasi jadwal konsultasi, biaya, dan ketersediaan kelas.`
      )}`
    : WHATSAPP_URL;

  return (
    <div>
      {/* Header PPDB */}
      <section className="bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-sm font-medium text-[#0B6B53]">PPDB / Admission</p>
              <h1 className="font-display font-bold tracking-tight text-[#0F1F1C] leading-[1.14] text-[clamp(2rem,3.8vw,3.25rem)]">
                Penerimaan Peserta Didik Baru
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-[#475A54] max-w-2xl">
                Daftarkan putra-putri Anda untuk belajar di lingkungan digital islami yang modern,
                praktis, dan berorientasi karya.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Apply now
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F1F1C] bg-white hover:bg-[#F2F5F3] border border-[#CFD9D4] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-[#0B6B53]" aria-hidden="true" />
                  Chat WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-[#E2E8E5] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-mono text-[#0B6B53]">KONSULTASI PENDAFTARAN</p>
                <h2 className="font-display text-xl font-bold text-[#0F1F1C]">
                  Informasi jadwal, biaya, dan kuota kelas
                </h2>
                <p className="text-sm leading-relaxed text-[#475A54]">
                  Hubungi admin PPDB untuk informasi jadwal, biaya, dan ketersediaan kelas sesuai
                  kebutuhan putra-putri Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F2F5F3] border border-[#E2E8E5] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#0B6B53] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-[#475A54]">
                  Rincian biaya pendidikan, jadwal kelas, dan kuota pendaftaran disampaikan secara
                  langsung melalui sesi konsultasi bersama admin PPDB.
                </p>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0F1F1C] hover:bg-[#1A332E] rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Chat WhatsApp ({WHATSAPP_NUMBER})
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Persyaratan & Alur Pendaftaran */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Requirements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-3">
              <p className="text-sm font-medium text-[#0B6B53]">Requirements</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1F1C]">
                Persyaratan Pendaftaran
              </h2>
              <p className="text-sm text-[#475A54] leading-relaxed">
                Pastikan dokumen dan kesiapan berikut dilengkapi sebelum sesi verifikasi berkas.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PPDB_REQUIREMENTS.map((req, idx) => (
                <div
                  key={req}
                  className="bg-[#FAFBFA] border border-[#E2E8E5] rounded-xl p-5 flex items-start gap-4"
                >
                  <span className="font-mono text-xs font-medium text-[#0B6B53] tabular-nums mt-0.5">
                    0{idx + 1}
                  </span>
                  <p className="text-sm font-medium text-[#0F1F1C] leading-relaxed">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Flow */}
          <div className="pt-12 border-t border-[#E2E8E5]">
            <div className="max-w-2xl space-y-3 mb-10">
              <p className="text-sm font-medium text-[#0B6B53]">Registration Flow</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1F1C]">
                Alur Pendaftaran Siswa Baru
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {PPDB_FLOW.map((item) => (
                <div
                  key={item.step}
                  className="bg-[#FAFBFA] border border-[#E2E8E5] rounded-xl p-5 flex flex-col gap-3"
                >
                  <span className="font-mono text-xs font-semibold text-[#0B6B53] tabular-nums">
                    Langkah {item.step}
                  </span>
                  <h3 className="font-display text-base font-bold text-[#0F1F1C]">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[#475A54]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formulir Pendaftaran Online */}
      <section ref={formSectionRef} id="formulir-ppdb" className="py-16 lg:py-24 bg-[#FAFBFA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 mb-8">
            <p className="text-sm font-medium text-[#0B6B53]">Formulir Online</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1F1C]">
              Daftar & Jadwalkan Konsultasi Awal
            </h2>
            <p className="text-sm sm:text-base text-[#475A54] leading-relaxed">
              Isi data berikut untuk memulai proses pendaftaran. Admin PPDB akan menindaklanjuti
              jadwal konsultasi program bersama Anda.
            </p>
          </div>

          {submission ? (
            <div className="bg-white border border-[#E2E8E5] rounded-2xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-7 h-7 text-[#0B6B53] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-2">
                  <p className="font-mono text-xs text-[#0B6B53] tabular-nums">
                    Nomor Registrasi: {submission.registrationId}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#0F1F1C]">
                    Formulir pendaftaran diterima
                  </h3>
                  <p className="text-sm text-[#475A54] leading-relaxed">
                    Terima kasih, Bapak/Ibu <strong>{submission.parentName}</strong>. Data calon
                    siswa <strong>{submission.studentName}</strong> untuk minat program{' '}
                    <strong>{submission.programInterest}</strong> telah tercatat. Silakan lanjutkan
                    ke WhatsApp admin PPDB untuk konfirmasi jadwal konsultasi awal, rincian biaya,
                    dan kuota kelas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={waConfirmLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  Lanjutkan via WhatsApp Admin
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmission(null);
                    setStudentName('');
                    setSchoolOrigin('');
                    setParentName('');
                    setWhatsapp('');
                    setNotes('');
                  }}
                  className="px-5 py-3 text-sm font-medium text-[#475A54] hover:text-[#0F1F1C] border border-[#E2E8E5] rounded-lg transition-colors"
                >
                  Isi formulir baru
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white border border-[#E2E8E5] rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="ppdb-student" className="block text-sm font-medium text-[#0F1F1C]">
                    Nama Lengkap Calon Siswa
                  </label>
                  <input
                    id="ppdb-student"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Ahmad Fauzan"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ppdb-school" className="block text-sm font-medium text-[#0F1F1C]">
                    Asal Sekolah
                  </label>
                  <input
                    id="ppdb-school"
                    type="text"
                    value={schoolOrigin}
                    onChange={(e) => setSchoolOrigin(e.target.value)}
                    placeholder="Contoh: SMPIT Sukoharjo"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="ppdb-parent" className="block text-sm font-medium text-[#0F1F1C]">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    id="ppdb-parent"
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Nama lengkap wali"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ppdb-wa" className="block text-sm font-medium text-[#0F1F1C]">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    id="ppdb-wa"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ppdb-program" className="block text-sm font-medium text-[#0F1F1C]">
                  Minat Program Utama
                </label>
                <select
                  id="ppdb-program"
                  value={programInterest}
                  onChange={(e) => setProgramInterest(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none"
                >
                  {CORE_PROGRAMS.map((prog) => (
                    <option key={prog.number} value={prog.title}>
                      {prog.number}. {prog.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ppdb-notes" className="block text-sm font-medium text-[#0F1F1C]">
                  Catatan atau Pertanyaan (Opsional)
                </label>
                <textarea
                  id="ppdb-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tuliskan pertanyaan seputar jadwal, minat karya anak, atau preferensi waktu konsultasi..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none resize-y"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-[#9E2A2B]">
                  {error}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-[#6B7E77]">
                  Setelah mengisi formulir, Anda dapat langsung terhubung ke admin PPDB.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {submitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
