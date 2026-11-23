import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, SCHOOL_LOGO, type PageId } from '../data/mdaContent';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFBFA]/95 backdrop-blur-sm border-b border-[#E2E8E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-[#0F1F1C] whitespace-nowrap shrink-0"
        >
          <img
            src={SCHOOL_LOGO}
            alt="Logo Muslim Digital Academy"
            className="h-7 w-auto object-contain mix-blend-multiply shrink-0"
          />
          <span>Muslim Digital Academy</span>
        </a>

        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.id);
                }}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-[#0B6B53]'
                    : 'text-[#475A54] hover:text-[#0F1F1C]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-[21px] h-[2px] bg-[#0B6B53] transition-opacity duration-150 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('ppdb')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Apply Now
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E2E8E5] text-[#0F1F1C] hover:bg-[#F2F5F3] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8E5] bg-white">
          <nav aria-label="Navigasi seluler" className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#F2F5F3] text-[#0B6B53]'
                      : 'text-[#475A54] hover:bg-[#FAFBFA] hover:text-[#0F1F1C]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#E2E8E5]">
              <button
                type="button"
                onClick={() => handleNav('ppdb')}
                className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] rounded-lg transition-colors"
              >
                Apply Now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
