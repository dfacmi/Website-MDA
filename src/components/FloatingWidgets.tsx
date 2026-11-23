import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Bot, MessageCircle, Send, X } from 'lucide-react';
import { WHATSAPP_URL, type PageId } from '../data/mdaContent';

interface FloatingWidgetsProps {
  onNavigate: (page: PageId) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: 'Halo, ingin tahu program dan alur pendaftaran MDA?',
};

const QUICK_QUESTIONS = [
  'Apa saja 6 program utama MDA?',
  'Bagaimana alur pendaftaran PPDB?',
  'Apa syarat mendaftar di MDA?',
  'Bagaimana info biaya dan jadwal?',
];

export function FloatingWidgets({ onNavigate }: FloatingWidgetsProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (assistantOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, assistantOpen, loading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const historyPayload = messages
      .filter((m) => m.id !== 'welcome' && !m.isError)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? ((await response.json()) as { reply?: string; error?: string })
        : {};

      if (!response.ok || !data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text:
              data.error ||
              'Maaf, asisten sedang mengalami kendala. Anda dapat langsung menghubungi admin melalui WhatsApp.',
            isError: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply!,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: 'Koneksi ke asisten terputus. Silakan coba lagi atau hubungi admin PPDB lewat WhatsApp.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleGoToPpdb = () => {
    onNavigate('ppdb');
    setAssistantOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* Assistant Panel */}
      {assistantOpen && (
        <section
          aria-label="Asisten AI Konsultasi PPDB"
          className="w-[calc(100vw-2rem)] sm:w-[370px] max-h-[75vh] bg-white border border-[#CFD9D4] rounded-2xl shadow-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0F1F1C] text-white px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-sm font-bold text-white leading-tight truncate">
                Konsultasi PPDB
              </h2>
              <p className="text-xs text-[#B8C7C1]">Online assistant · MDA</p>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(false)}
              aria-label="Tutup asisten Konsultasi PPDB"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFA] min-h-[240px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#0B6B53] text-white'
                      : msg.isError
                        ? 'bg-[#FDF2F2] border border-[#E8C5C5] text-[#9E2A2B]'
                        : 'bg-white border border-[#E2E8E5] text-[#0F1F1C]'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.id === 'welcome' && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGoToPpdb}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B6B53] hover:bg-[#085441] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Lihat PPDB
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F1F1C] bg-white hover:bg-[#F2F5F3] border border-[#CFD9D4] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Chat WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="pt-2 space-y-1.5">
                <p className="text-xs font-medium text-[#6B7E77]">Pertanyaan cepat</p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="text-left px-3 py-2 text-xs font-medium text-[#0F1F1C] bg-white hover:bg-[#F2F5F3] border border-[#E2E8E5] rounded-lg transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-start">
                <div className="bg-white border border-[#E2E8E5] rounded-xl px-3.5 py-2.5 text-xs text-[#475A54]">
                  Menyiapkan jawaban...
                </div>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#E2E8E5] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya program atau PPDB MDA..."
              aria-label="Ketik pertanyaan untuk asisten PPDB"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#CFD9D4] bg-[#FAFBFA] text-[#0F1F1C] focus:bg-white focus:border-[#0B6B53] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Kirim pesan"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#0B6B53] hover:bg-[#085441] disabled:opacity-50 text-white transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Action Controls */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setAssistantOpen((prev) => !prev)}
          aria-expanded={assistantOpen}
          className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-[#0F1F1C] hover:bg-[#19302B] text-white text-xs sm:text-sm font-semibold shadow-md border border-white/10 transition-colors whitespace-nowrap"
        >
          <Bot className="w-4 h-4 text-[#7AD3B8]" aria-hidden="true" />
          <span>Konsultasi PPDB</span>
        </button>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp Muslim Digital Academy"
          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#0B6B53] hover:bg-[#085441] text-white text-xs sm:text-sm font-semibold shadow-md transition-colors whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
