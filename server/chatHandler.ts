import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export const MDA_SYSTEM_INSTRUCTION = `Anda adalah Asisten AI resmi "Konsultasi PPDB" untuk Muslim Digital Academy (MDA), Sekolah Digital Islami Berbasis Project / Sekolah Berbasis IT di 7Q68+3VH, Dua, Grajegan, Kec. Tawangsari, Kabupaten Sukoharjo, Jawa Tengah 57561.

Tugas Anda adalah membantu calon siswa, orang tua, dan pengunjung dengan ramah, sopan, islami, ringkas, dan akurat dalam Bahasa Indonesia berdasarkan informasi resmi MDA berikut:

1. PROFIL & IDENTITAS
- Nama: Muslim Digital Academy (MDA) — Sekolah Digital Islami Berbasis Project / Sekolah Berbasis IT.
- Tagline: "Mencetak Muslim Kreatif, Adaptif, dan Siap Menghadapi Era Digital."
- Deskripsi: Sekolah berbasis IT yang mengembangkan karakter muslim, kreativitas digital, dan kesiapan menghadapi era teknologi.
- Visi: Menjadi lembaga pendidikan digital islami yang mencetak generasi kreatif, adaptif, berakhlak, dan siap berkarya di era teknologi.
- Misi:
  1) Menguatkan adab dan karakter muslim dalam proses belajar.
  2) Menyediakan pembelajaran IT yang praktis dan relevan.
  3) Mendorong siswa menghasilkan portofolio karya digital.
- Keunggulan MDA:
  - Kurikulum digital yang relevan dengan kebutuhan masa depan.
  - Pembinaan adab dan karakter muslim dalam aktivitas belajar.
  - Pembelajaran berbasis project agar siswa punya portofolio nyata.
  - Lingkungan belajar modern, suportif, dan mudah diikuti.

2. PENGAJAR MDA
- Teguh Ade Mauladi, S.Tr.Kom (UI/UX Design & AI Tools)
- Ghazie Abdul Aziz, S.Tr.Kom (Graphic Design)
- Azmuhu Syahid, S.Pd (Kepala & Diniyyah)
- Rizky Adi Pangestu (Graphic Design)

3. 6 PROGRAM UTAMA MDA
1) UI/UX Design: Belajar merancang pengalaman digital yang mudah digunakan, rapi, dan sesuai kebutuhan pengguna.
2) Graphic Design: Mengembangkan kemampuan visual branding, layout, poster, dan konten kreatif untuk media digital.
3) AI Tools: Memanfaatkan perangkat AI secara produktif, etis, dan kreatif untuk pembelajaran serta karya nyata.
4) Internet Marketing: Mengenal strategi pemasaran digital, konten, analitik dasar, dan komunikasi brand online.
5) Photography: Mengasah kemampuan mengambil foto yang kuat secara visual untuk dokumentasi, produk, dan konten kreatif.
6) Videography: Belajar merancang, merekam, dan menyusun video pendek yang komunikatif untuk media digital.

4. 10 CHARACTER BUILDING PROGRAM
Visit Exhibition, Visit Studio, Paper Clip Challenge, Barter Better, MDA Show Up, MDA Mengajar, MDA Exhibition, Cooking Class, Designer Petani, dan Rihlah.

5. PPDB / ADMISSION
- Persyaratan:
  1) Mengisi formulir pendaftaran
  2) Fotokopi kartu keluarga
  3) Fotokopi akta kelahiran
  4) Pas foto terbaru
  5) Mengikuti sesi konsultasi awal
  6) Memiliki minat dan bakat di dunia multimedia dan industri kreatif
- Alur Pendaftaran:
  1) Konsultasi program
  2) Pengisian formulir
  3) Verifikasi berkas
  4) Wawancara singkat
  5) Pengumuman hasil
- PENTING tentang Biaya, Jadwal, dan Kuota Kelas: Informasi rincian biaya, jadwal belajar, dan ketersediaan kuota kelas TIDAK tercantum secara publik dan diberikan langsung melalui konsultasi dengan admin PPDB via WhatsApp di +62 895-3740-04000 (https://wa.me/62895374004000). Jangan pernah mengarang angka biaya atau tanggal jadwal!

6. KONTAK
- Alamat: 7Q68+3VH, Dua, Grajegan, Kec. Tawangsari, Kabupaten Sukoharjo, Jawa Tengah 57561
- Email: dfacmi123@gmail.com
- WhatsApp: +62 895-3740-04000

ATURAN MENJAWAB:
- Jawab singkat, jelas, terstruktur (maksimal 2-3 paragraf pendek atau poin ringkas).
- Gunakan bahasa Indonesia yang santun, modern, dan membantu.
- Jangan mengarang informasi di luar fakta di atas. Jika ditanya soal biaya, jadwal, atau kuota kelas, arahkan dengan ramah ke sesi konsultasi WhatsApp admin PPDB (+62 895-3740-04000) atau halaman PPDB.`;

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface ApiResult<T> {
  status: number;
  payload: T;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeHistory(rawHistory: unknown): ChatHistoryItem[] {
  if (!Array.isArray(rawHistory)) return [];
  const filtered = rawHistory
    .filter(
      (item): item is ChatHistoryItem =>
        typeof item === 'object' &&
        item !== null &&
        (item.role === 'user' || item.role === 'model') &&
        typeof item.text === 'string' &&
        item.text.trim().length > 0
    )
    .slice(-8);

  // Gemini generateContent requires conversation history to start with a 'user' turn
  const firstUserIdx = filtered.findIndex((item) => item.role === 'user');
  if (firstUserIdx === -1) return [];
  return filtered.slice(firstUserIdx);
}

export async function handlePpdbChat(
  body: Record<string, unknown> | undefined
): Promise<ApiResult<{ reply?: string; error?: string }>> {
  try {
    const message = body?.message;
    const history = body?.history;

    if (typeof message !== 'string' || message.trim().length === 0) {
      return { status: 400, payload: { error: 'Pesan tidak boleh kosong.' } };
    }

    const trimmedMessage = message.trim().slice(0, 1000);
    const safeHistory = normalizeHistory(history);

    const contents = [
      ...safeHistory.map((item) => ({
        role: item.role,
        parts: [{ text: item.text.slice(0, 1200) }],
      })),
      {
        role: 'user',
        parts: [{ text: trimmedMessage }],
      },
    ];

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction: MDA_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      return {
        status: 502,
        payload: {
          error:
            'Asisten tidak mengembalikan jawaban. Silakan coba lagi atau hubungi admin via WhatsApp.',
        },
      };
    }

    return { status: 200, payload: { reply } };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStatus =
      typeof err === 'object' && err !== null && 'status' in err
        ? Number((err as { status?: unknown }).status)
        : undefined;

    if (errMsg === 'MISSING_API_KEY') {
      return {
        status: 503,
        payload: {
          error:
            'Asisten AI belum aktif di server ini (GEMINI_API_KEY belum diatur di Environment Variables Vercel / Settings > Secrets). Anda dapat langsung konsultasi lewat tombol WhatsApp.',
        },
      };
    }
    if (
      errStatus === 403 ||
      errMsg.includes('403') ||
      errMsg.includes('PERMISSION_DENIED') ||
      errMsg.includes('API_KEY_INVALID')
    ) {
      return {
        status: 403,
        payload: {
          error:
            'API key Gemini tidak valid atau belum memiliki izin. Periksa GEMINI_API_KEY di Vercel Environment Variables atau Settings > Secrets.',
        },
      };
    }
    if (errStatus === 429 || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      return {
        status: 429,
        payload: {
          error:
            'Batas permintaan asisten tercapai sementara. Silakan coba sesaat lagi atau hubungi admin via WhatsApp.',
        },
      };
    }
    console.error('Error in handlePpdbChat:', errStatus ?? '', errMsg);
    return {
      status: 500,
      payload: {
        error:
          'Terjadi kendala saat menghubungi asisten PPDB. Silakan coba lagi atau hubungi admin via WhatsApp.',
      },
    };
  }
}

export function handlePpdbSubmission(body: Record<string, unknown> | undefined) {
  const { studentName, schoolOrigin, parentName, whatsapp, programInterest, notes } = body ?? {};

  if (
    typeof studentName !== 'string' ||
    studentName.trim().length < 2 ||
    typeof parentName !== 'string' ||
    parentName.trim().length < 2 ||
    typeof whatsapp !== 'string' ||
    whatsapp.replace(/\D/g, '').length < 9
  ) {
    return {
      status: 400,
      payload: {
        error:
          'Mohon lengkapi nama calon siswa, nama orang tua/wali, dan nomor WhatsApp yang valid.',
      },
    };
  }

  const registrationId = `MDA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    status: 200,
    payload: {
      ok: true,
      registrationId,
      received: {
        studentName: studentName.trim().slice(0, 120),
        schoolOrigin: typeof schoolOrigin === 'string' ? schoolOrigin.trim().slice(0, 150) : '',
        parentName: parentName.trim().slice(0, 120),
        whatsapp: whatsapp.trim().slice(0, 30),
        programInterest:
          typeof programInterest === 'string' && programInterest.trim().length > 0
            ? programInterest.trim().slice(0, 80)
            : 'UI/UX Design',
        notes: typeof notes === 'string' ? notes.trim().slice(0, 1000) : '',
      },
    },
  };
}

export function handleContactSubmission(body: Record<string, unknown> | undefined) {
  const { name, email, message } = body ?? {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    typeof name !== 'string' ||
    name.trim().length < 2 ||
    typeof email !== 'string' ||
    !emailPattern.test(email.trim()) ||
    typeof message !== 'string' ||
    message.trim().length < 5
  ) {
    return {
      status: 400,
      payload: {
        error: 'Mohon isi nama, alamat email yang valid, dan pesan Anda minimal 5 karakter.',
      },
    };
  }

  return {
    status: 200,
    payload: {
      ok: true,
      receivedAt: new Date().toISOString(),
    },
  };
}
