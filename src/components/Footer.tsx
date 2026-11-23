import { usePhotos } from '../context/PhotoContext';
import {
  NAV_ITEMS,
  SCHOOL_ADDRESS,
  SCHOOL_EMAIL,
  SCHOOL_LOGO,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
  type PageId,
} from '../data/mdaContent';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { isAdmin, signInAsAdmin, signOutAdmin } = usePhotos();

  return (
    <footer className="bg-[#0F1F1C] text-[#E6ECE9] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-3">
              <span className="inline-flex items-center justify-center bg-white rounded-md px-2 py-1 shrink-0">
                <img
                  src={SCHOOL_LOGO}
                  alt="Logo Muslim Digital Academy"
                  className="h-6 w-auto object-contain"
                />
              </span>
              <p className="font-display text-xl font-bold tracking-tight text-white">
                Muslim Digital Academy
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[#B8C7C1] max-w-md">
              Sekolah Digital Islami Berbasis Project yang mengembangkan karakter muslim,
              kreativitas digital, dan kesiapan menghadapi era teknologi.
            </p>
            <p className="text-xs text-[#91A79F]">
              Sekolah Berbasis IT · Tawangsari, Sukoharjo
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-white">Navigasi</h2>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className="text-sm text-[#B8C7C1] hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h2 className="text-sm font-semibold text-white">Kontak & Lokasi</h2>
            <div className="space-y-2.5 text-sm text-[#B8C7C1]">
              <p>{SCHOOL_ADDRESS}</p>
              <p>
                <a href={`mailto:${SCHOOL_EMAIL}`} className="hover:text-white transition-colors">
                  {SCHOOL_EMAIL}
                </a>
              </p>
              <p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-mono tabular-nums text-[13px]"
                >
                  {WHATSAPP_NUMBER}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#91A79F]">
          <p>Copyright 2026 Muslim Digital Academy. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <p>Mencetak Muslim Kreatif, Adaptif, dan Siap Menghadapi Era Digital.</p>
            <button
              type="button"
              onClick={() => void (isAdmin ? signOutAdmin() : signInAsAdmin())}
              className="text-[#91A79F] hover:text-white underline underline-offset-4 transition-colors"
            >
              {isAdmin ? 'Admin Aktif (Keluar)' : 'Admin Login'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
