import React, { useState } from "react";
import { 
  BookOpen, 
  X, 
  Video, 
  Sparkles, 
  Scissors, 
  Type, 
  Share2, 
  Clock, 
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Play
} from "lucide-react";
import { motion } from "motion/react";

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = "quickstart" | "editor" | "subtitles" | "ai" | "export";

export default function UserGuide({ isOpen, onClose }: UserGuideProps) {
  const [activeTab, setActiveTab] = useState<GuideTab>("quickstart");

  if (!isOpen) return null;

  const tabs = [
    { id: "quickstart", label: "Mulai Cepat", icon: BookOpen },
    { id: "editor", label: "Trim & Rasio", icon: Scissors },
    { id: "subtitles", label: "Subtitle Dinamis", icon: Type },
    { id: "ai", label: "Analisis Sorotan AI", icon: Sparkles },
    { id: "export", label: "Ekspor & Jadwal API", icon: Share2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="cliperan-user-guide-overlay">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-900 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
                Pusat Bantuan & Panduan Penggunaan Cliperan
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase">v2.4 Ready</span>
              </h3>
              <p className="text-xs text-slate-400">Ikuti panduan langkah demi langkah ini untuk membuat konten viral dalam hitungan menit.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-900 text-slate-500 hover:text-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[300px]">
          
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-64 bg-slate-900/20 border-b md:border-b-0 md:border-r border-slate-900 p-4 space-y-1.5 shrink-0 overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 block">Daftar Materi</span>
            
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as GuideTab)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-left flex items-center gap-2.5 transition-all ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-6 border-t border-slate-900 mt-6 px-3 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Tips Produktif</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Gunakan preset template video di beranda jika Anda ingin menguji seluruh alur kerja rendering tanpa perlu menyiapkan file video berukuran besar secara manual.
              </p>
            </div>
          </div>

          {/* Right Tab Content Viewer */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950 text-slate-300 space-y-6">
            
            {/* Tab 1: Quickstart */}
            {activeTab === "quickstart" && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">01.</span> Alur Kerja Cepat Pembuatan Klip Viral
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Cliperan adalah studio pembuat klip potret multi-tenant profesional yang berjalan sepenuhnya secara lokal di browser Anda dengan performa rendering canvas yang optimal. Ikuti 3 langkah utama berikut:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                      1
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">Impor & Muat</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Unggah file MP4 lokal, masukkan tautan berbagi video, atau gunakan template bawaan kami yang siap pakai.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                      2
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">Edit & Tempel AI</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Tentukan rentang potongan dengan akurasi tinggi, rancang gaya subtitle dinamis, dan biarkan AI menganalisis sorotan terbaik Anda.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                      3
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">Ekspor & Bagikan</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Render klip dalam format portrait, unduh langsung ke komputer, atau jadwalkan postingan sosial media terintegrasi API.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-2xl flex gap-3 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-100 block mb-0.5">Sistem Siap Digunakan Tanpa Hambatan</span>
                    Seluruh fitur telah dikonfigurasi ke dalam status produksi. Hubungkan API akun sosial media Anda secara aman untuk melakukan simulasi integrasi penerbitan, atau gunakan unduhan video MP4 lokal hasil pemotongan yang sepenuhnya real-time di browser.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Editor & Trim */}
            {activeTab === "editor" && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">02.</span> Navigasi Linimasa & Rasio Aspek Portrait
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Gunakan editor video bawaan dengan antarmuka dinamis untuk menentukan rentang momen krusial Anda:
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex gap-3 items-start bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                    <div className="p-1.5 bg-slate-800 rounded text-indigo-400 font-bold font-mono">1</div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200">Gunakan Slider Timeline</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Geser pegangan kiri untuk menetapkan waktu mulai (Trim Start) dan pegangan kanan untuk waktu berakhir (Trim End). Durasi klip ideal adalah di bawah 30 detik untuk kenyamanan pemirsa sosial media.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                    <div className="p-1.5 bg-slate-800 rounded text-indigo-400 font-bold font-mono">2</div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200">Rasio Aspek Portrait (9:16)</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Klip akan secara otomatis beradaptasi menjadi format video potret seluler. Di panel samping pemutar, Anda dapat memilih template tata letak video (Rasio Penuh, Layar Terpisah, atau Bingkai Cantik).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                    <div className="p-1.5 bg-slate-800 rounded text-indigo-400 font-bold font-mono">3</div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200">Penyesuaian Presisi Frame</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Gunakan tombol input angka numerik pada panel kontrol trim untuk menetapkan milidetik yang akurat demi sinkronisasi suara terbaik.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Subtitles */}
            {activeTab === "subtitles" && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">03.</span> Subtitle Otomatis & Desain Visual Dinamis
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Buat subtitle dinamis dengan gaya karaoke modern yang secara otomatis menyoroti kata demi kata yang sedang diucapkan:
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                    <div>
                      <strong className="text-slate-200 font-bold">Template Subtitle Instan:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Pilih template subtitle menarik seperti <strong>"Glowing Gold"</strong>, <strong>"Retro Pop (Yellow)"</strong>, <strong>"Clean Minimal"</strong>, atau <strong>"Cyber Neon"</strong> untuk langsung mengubah atmosfer visual klip Anda.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                    <div>
                      <strong className="text-slate-200 font-bold">Edit Teks Manual:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Anda dapat mengeklik secara manual pada baris subtitle mana saja di Editor Subtitle untuk mengubah teks, mengoreksi kesalahan ketik ucapan, atau menyesuaikan penanda detik pelafalan kata secara langsung.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                    <div>
                      <strong className="text-slate-200 font-bold">Rendering Otomatis Pada Pemutar:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Subtitle akan langsung dirender secara real-time di atas kanvas pemutar video seluler sehingga Anda dapat meninjau estetika visualnya secara langsung sebelum mengekspor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: AI Highlights */}
            {activeTab === "ai" && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">04.</span> Deteksi Momen AI & Analisis Viralitas
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Cliperan didukung oleh kecerdasan buatan Gemini untuk menganalisis isi video, mendeteksi emosi, serta mengalkulasi kesiapan klip untuk fyp:
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-2xl space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">Bagaimana Cara Mengaktifkan AI?</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Buka tab <strong>Asisten AI & Analitik</strong> di editor utama, lalu klik tombol "Jalankan Analisis AI Momen Viral". Gemini akan merayapi visual video untuk mencari highlight terbaik.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">Indikator Nilai Viral (Viral Score):</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Sistem akan memberikan skor kepantasan publikasi mulai dari 1 sampai 100 berdasarkan data keterlibatan visual, grafik emosi, dan ketajaman topik video.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">Penulisan Hashtag & Caption Otomatis:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Asisten AI akan merumuskan teks takarir yang menarik lengkap dengan tagar populer yang disesuaikan dengan niche video Anda agar mempermudah algoritma media sosial mendeteksi klip Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Export & Schedules */}
            {activeTab === "export" && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">05.</span> Penerbitan Terjadwal & Hubungan Direct API
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Setelah klip portrait Anda siap, manfaatkan panel bagikan untuk mendistribusikan konten Anda ke khalayak luas:
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
                    <h5 className="font-bold text-slate-200 mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                      1. Metode Direct Upload API
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Hubungkan akun media sosial Anda dengan mengeklik tombol "Hubungkan" pada platform pilihan Anda (TikTok, Instagram, atau YouTube). Isikan nama pengguna Anda untuk mengaktifkan saluran OAuth yang aman. Setelah itu, klik tombol <strong>Direct Upload & Sync</strong> untuk menerbitkan video secara instan.
                    </p>
                  </div>

                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
                    <h5 className="font-bold text-slate-200 mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      2. Kalender Penjadwalan Konten (Auto-Posting)
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Atur tanggal dan jam tayang terbaik Anda di formulir penjadwalan. Klip Anda akan secara otomatis masuk ke antrean <strong>Jadwal Kalender Konten</strong>. Anda dapat mengontrol status antrean, menghapus entri, atau menekan tombol "Post Now" untuk mempublikasikannya langsung saat ini juga.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer info action */}
        <div className="p-5 border-t border-slate-900 bg-slate-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-mono text-[10px]">
            Dokumentasi Cliperan Studio &copy; 2026. Semua Hak Dilindungi.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-[1.01] text-xs cursor-pointer"
          >
            Mulai Sunting Video Sekarang
          </button>
        </div>

      </div>
    </div>
  );
}
