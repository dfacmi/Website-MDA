import { useState, type FormEvent } from 'react';
import { CheckCircle2, ExternalLink, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import {
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_URL,
  SCHOOL_ADDRESS,
  SCHOOL_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from '../data/mdaContent';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.trim().length < 2) {
      setError('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (message.trim().length < 5) {
      setError('Mohon tuliskan pesan Anda minimal 5 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || 'Gagal mengirim pesan. Silakan coba lagi.');
        return;
      }
      setSent(true);
    } catch {
      setError('Koneksi gagal. Silakan coba lagi atau hubungi kami langsung melalui WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium text-[#0B6B53]">Kontak Sekolah</p>
            <h1 className="font-display font-bold tracking-tight text-[#0F1F1C] leading-[1.14] text-[clamp(2rem,3.8vw,3.25rem)]">
              Hubungi Muslim Digital Academy
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#475A54]">
              Tim kami siap membantu menjawab pertanyaan seputar program, jadwal belajar, dan
              pendaftaran.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Contact Info + Map Placeholder */}
            <div className="lg:col-span-5 space-y-8">
              <div className="divide-y divide-[#E2E8E5] border-t border-b border-[#E2E8E5]">
                <div className="py-5 flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#0B6B53] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#6B7E77]">Alamat</p>
                    <p className="text-sm sm:text-base font-medium text-[#0F1F1C]">
                      {SCHOOL_ADDRESS}
                    </p>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[#0B6B53] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#6B7E77]">Email</p>
                    <a
                      href={`mailto:${SCHOOL_EMAIL}`}
                      className="text-sm sm:text-base font-medium text-[#0F1F1C] hover:text-[#0B6B53] transition-colors"
                    >
                      {SCHOOL_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <MessageCircle
                    className="w-5 h-5 text-[#0B6B53] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#6B7E77]">WhatsApp</p>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-medium font-mono tabular-nums text-[#0F1F1C] hover:text-[#0B6B53] transition-colors"
                    >
                      {WHATSAPP_NUMBER}
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl border border-[#E2E8E5] bg-[#F2F5F3] overflow-hidden">
                <div className="relative h-64 w-full bg-[#EEF2F0]">
                  <iframe
                    title="Peta Lokasi Muslim Digital Academy — Tawangsari, Sukoharjo"
                    src={GOOGLE_MAPS_EMBED_URL}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
                <div className="px-4 py-3 bg-[#FAFBFA] border-t border-[#E2E8E5] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#475A54] truncate">
                    7Q68+3VH, Dua, Grajegan, Tawangsari, Sukoharjo
                  </span>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6B53] hover:text-[#085441] whitespace-nowrap shrink-0"
                  >
                    Buka Google Maps
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#FAFBFA] border border-[#E2E8E5] rounded-2xl p-6 sm:p-8 lg:p-10">
                <div className="space-y-2 mb-7">
                  <h2 className="font-display text-2xl font-bold text-[#0F1F1C]">Kirim Pesan</h2>
                  <p className="text-sm text-[#475A54]">
                    Sampaikan pertanyaan Anda melalui formulir berikut dan tim kami akan segera
                    menghubungi kembali.
                  </p>
                </div>

                {sent ? (
                  <div className="bg-white border border-[#E2E8E5] rounded-xl p-6 sm:p-8 space-y-5">
                    <div className="flex items-start gap-4">
                      <CheckCircle2
                        className="w-6 h-6 text-[#0B6B53] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="space-y-1.5">
                        <h3 className="font-display text-lg font-bold text-[#0F1F1C]">
                          Pesan Anda telah terkirim
                        </h3>
                        <p className="text-sm text-[#475A54] leading-relaxed">
                          Terima kasih, <strong>{name}</strong>. Tim Muslim Digital Academy akan
                          meninjau pesan Anda dan membalas melalui email <strong>{email}</strong>.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setName('');
                        setEmail('');
                        setMessage('');
                      }}
                      className="px-5 py-2.5 text-sm font-semibold text-[#0F1F1C] bg-[#FAFBFA] hover:bg-[#F2F5F3] border border-[#CFD9D4] rounded-lg transition-colors"
                    >
                      Kirim pesan lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-sm font-medium text-[#0F1F1C]">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama lengkap Anda"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-white text-[#0F1F1C] focus:border-[#0B6B53] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-sm font-medium text-[#0F1F1C]">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-white text-[#0F1F1C] focus:border-[#0B6B53] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-[#0F1F1C]"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tulis pertanyaan Anda seputar program, jadwal belajar, atau pendaftaran..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CFD9D4] bg-white text-[#0F1F1C] focus:border-[#0B6B53] focus:outline-none resize-y"
                      />
                    </div>

                    {error && (
                      <p role="alert" className="text-sm font-medium text-[#9E2A2B]">
                        {error}
                      </p>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Send className="w-4 h-4" aria-hidden="true" />
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
