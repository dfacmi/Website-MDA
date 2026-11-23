import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  CHARACTER_PROGRAMS,
  CORE_PROGRAMS,
  type PageId,
} from '../data/mdaContent';

interface ProgramsPageProps {
  onNavigate: (page: PageId) => void;
}

type ProgramTab = 'all' | 'core' | 'character';

export function ProgramsPage({ onNavigate }: ProgramsPageProps) {
  const [activeTab, setActiveTab] = useState<ProgramTab>('all');

  const showCore = activeTab === 'all' || activeTab === 'core';
  const showCharacter = activeTab === 'all' || activeTab === 'character';

  return (
    <div>
      {/* Header */}
      <section className="bg-[#FAFBFA] border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-medium text-[#0B6B53]">Kurikulum & Aktivitas</p>
              <h1 className="font-display font-bold tracking-tight text-[#0F1F1C] leading-[1.14] text-[clamp(2rem,3.8vw,3.25rem)]">
                Program Pembelajaran MDA
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-[#475A54]">
                Menggabungkan enam jalur keahlian digital berbasis proyek dengan sepuluh program
                pembentukan karakter muslim yang aplikatif.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter kategori program"
              className="inline-flex items-center gap-1 p-1 bg-[#EEF2F0] rounded-lg border border-[#E2E8E5] self-start lg:self-end"
            >
              {(
                [
                  { id: 'all', label: 'Semua Program' },
                  { id: 'core', label: 'Program Utama (6)' },
                  { id: 'character', label: 'Character Building (10)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#0F1F1C] shadow-xs'
                      : 'text-[#475A54] hover:text-[#0F1F1C]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Utama MDA (tanpa foto di samping judul) */}
      {showCore && (
        <section className="py-16 lg:py-20 bg-white border-b border-[#E2E8E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3 mb-12">
              <p className="text-sm font-medium text-[#0B6B53]">01 — Program Utama MDA</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1F1C]">
                Enam jalur pembelajaran digital
              </h2>
              <p className="text-base text-[#475A54] leading-relaxed">
                Enam jalur pembelajaran digital untuk membangun kreativitas, kemampuan problem
                solving, dan portofolio siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CORE_PROGRAMS.map((program) => (
                <article
                  key={program.number}
                  className="bg-[#FAFBFA] border border-[#E2E8E5] rounded-xl p-6 sm:p-7 flex flex-col justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#475A54]">
                      <span className="font-mono font-semibold text-[#0B6B53] tabular-nums">
                        {program.number}
                      </span>
                      <span>{program.focus}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#0F1F1C]">
                      {program.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#475A54]">{program.description}</p>
                  </div>

                  <p className="pt-4 border-t border-[#E2E8E5] text-xs text-[#475A54]">
                    Output Portofolio: {program.deliverable}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Character Building Program (tanpa foto di samping judul) */}
      {showCharacter && (
        <section className="py-16 lg:py-24 bg-[#FAFBFA] border-b border-[#E2E8E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3 mb-12">
              <p className="text-sm font-medium text-[#0B6B53]">02 — Character Building Program</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1F1C]">
                Sepuluh aktivitas pembentukan karakter
              </h2>
              <p className="text-base text-[#475A54] leading-relaxed">
                Aktivitas pembentukan karakter yang menggabungkan pengalaman nyata, kreativitas,
                adab, kolaborasi, dan keberanian berkarya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 divide-y divide-[#E2E8E5] border-t border-b border-[#E2E8E5] bg-white rounded-2xl border px-6 sm:px-8">
              {CHARACTER_PROGRAMS.map((item) => (
                <div key={item.number} className="py-6 flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold text-[#0B6B53] tabular-nums mt-1 shrink-0">
                    {item.number}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-bold text-[#0F1F1C]">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#475A54]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#0F1F1C] mda-lattice text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h3 className="font-display text-2xl font-bold text-white">
                  Ingin memilih jalur belajar yang tepat untuk putra-putri Anda?
                </h3>
                <p className="text-sm text-[#C7D5CF]">
                  Mulai dari konsultasi program bersama admin PPDB dan lihat alur pendaftarannya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('ppdb')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F1F1C] bg-white hover:bg-[#EDF2F0] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Lihat PPDB
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
