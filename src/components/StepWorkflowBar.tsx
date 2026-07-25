import React from "react";
import { 
  Upload, 
  Sparkles, 
  Type, 
  Camera, 
  Calendar, 
  Check, 
  Lock, 
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { motion } from "motion/react";
import { VideoClip, AIAnalysis, SubtitleItem } from "../types";

interface StepWorkflowBarProps {
  currentClip: VideoClip | null;
  activeAnalysis: AIAnalysis | null;
  subtitles: SubtitleItem[];
  activeTab: "ai" | "subtitles" | "export" | "thumbnail" | "saas";
  setActiveTab: (tab: "ai" | "subtitles" | "export" | "thumbnail" | "saas") => void;
  onResetWorkspace: () => void;
  onNotification: (msg: string) => void;
}

export default function StepWorkflowBar({
  currentClip,
  activeAnalysis,
  subtitles,
  activeTab,
  setActiveTab,
  onResetWorkspace,
  onNotification
}: StepWorkflowBarProps) {

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Temporary pulsing high-contrast indicator ring
      element.classList.add("ring-4", "ring-indigo-500/50", "ring-offset-4", "ring-offset-slate-950", "transition-all", "duration-500");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-indigo-500/50", "ring-offset-4", "ring-offset-slate-950");
      }, 2500);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (!currentClip && stepIndex > 0) {
      onNotification("⚠️ Silakan impor video terlebih dahulu untuk membuka langkah ini!");
      return;
    }

    switch (stepIndex) {
      case 0: // Step 1: Import
        if (currentClip) {
          const confirmReset = window.confirm(
            "Kembali ke Impor? Video saat ini dan semua perubahan suntingan akan di-reset."
          );
          if (confirmReset) {
            onResetWorkspace();
          }
        } else {
          scrollToSection("import-cards-container");
        }
        break;
      case 1: // Step 2: AI Deteksi
        setActiveTab("ai");
        setTimeout(() => scrollToSection("ai-assistant-panel"), 100);
        onNotification("💡 Menuju ke Asisten AI untuk mendeteksi momen paling menarik!");
        break;
      case 2: // Step 3: Subtitle Karaoke
        setActiveTab("subtitles");
        setTimeout(() => scrollToSection("subtitle-editor-panel"), 100);
        onNotification("💡 Menuju ke Editor Subtitle untuk mempercantik teks karaoke!");
        break;
      case 3: // Step 4: Thumbnail
        setActiveTab("thumbnail");
        setTimeout(() => scrollToSection("thumbnail-generator-card"), 100);
        onNotification("💡 Menuju ke Generator Cover Thumbnail!");
        break;
      case 4: // Step 5: Ekspor & Publikasi
        setActiveTab("export");
        setTimeout(() => scrollToSection("export-share-card"), 100);
        onNotification("💡 Menuju ke Panel Ekspor & Penjadwalan Konten Sosial!");
        break;
    }
  };

  // Define steps status
  const steps = [
    {
      title: "1. Impor Video",
      shortDesc: "Unggah file / link YouTube",
      icon: Upload,
      isActive: !currentClip,
      isCompleted: !!currentClip,
      color: "indigo",
      tooltip: "Langkah pertama: Pilih berkas video lokal Anda atau tempel link video YouTube untuk memulai."
    },
    {
      title: "2. Deteksi AI",
      shortDesc: "Pindai segmen paling viral",
      icon: Sparkles,
      isActive: !!currentClip && activeTab === "ai",
      isCompleted: !!currentClip && !!activeAnalysis,
      color: "amber",
      tooltip: "Pindai video dengan Gemini AI untuk mendeteksi adegan terbaik beserta subtitle otomatis & caption cerdas."
    },
    {
      title: "3. Edit Subtitle",
      shortDesc: "Sinkronkan gaya teks karaoke",
      icon: Type,
      isActive: !!currentClip && activeTab === "subtitles",
      isCompleted: !!currentClip && subtitles.length > 0,
      color: "emerald",
      tooltip: "Sesuaikan kata-kata subtitle, ubah warna gaya font, dan sinkronisasikan ketukan teks agar bernada dinamis."
    },
    {
      title: "4. Sampul Thumbnail",
      shortDesc: "Tangkap frame & tambah teks",
      icon: Camera,
      isActive: !!currentClip && activeTab === "thumbnail",
      isCompleted: !!currentClip && activeTab === "thumbnail" && subtitles.length > 0, // simple indicator
      color: "pink",
      tooltip: "Gunakan pembuat cover untuk menangkap cuplikan frame, memasang judul tebal estetik, lalu unduh file PNG."
    },
    {
      title: "5. Ekspor & Jadwal",
      shortDesc: "Pratinjau feed & jadwalkan",
      icon: Calendar,
      isActive: !!currentClip && activeTab === "export",
      isCompleted: false, // final step remains active/completable
      color: "purple",
      tooltip: "Unduh file klip pendek video, uji simulator feed media sosial, atau daftarkan ke Kalender Jadwal Posting."
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4" id="applet-step-workflow-wizard">
      
      {/* Title & Onboarding Quick Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wider">
              ALUR KERJA INTERAKTIF
            </span>
            <span className="text-[10px] font-bold text-slate-500">•</span>
            <span className="text-[10px] text-slate-400 font-medium">Klik langkah untuk bernavigasi instan</span>
          </div>
          <h3 className="font-extrabold text-slate-100 text-sm md:text-base flex items-center gap-2">
            🚀 Panduan 5 Langkah Cerdas Pembuatan Klip Viral
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Butuh Bantuan? Klik tombol panduan di pojok kanan atas!</span>
        </div>
      </div>

      {/* 5-Step Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLocked = !currentClip && idx > 0;
          
          let stateBg = "bg-slate-950/60 border-slate-850 text-slate-500 opacity-60";
          let numBadgeBg = "bg-slate-900 text-slate-600";
          let iconBg = "bg-slate-900/55 text-slate-500";

          if (step.isCompleted) {
            stateBg = "bg-emerald-950/20 border-emerald-500/30 text-emerald-100 hover:border-emerald-500/50 cursor-pointer";
            numBadgeBg = "bg-emerald-500 text-slate-950";
            iconBg = "bg-emerald-950/60 text-emerald-400 border border-emerald-500/10";
          } else if (step.isActive) {
            stateBg = "bg-indigo-950/20 border-indigo-500/40 text-indigo-200 ring-1 ring-indigo-500/20 hover:border-indigo-400 shadow-lg shadow-indigo-950/15 cursor-pointer";
            numBadgeBg = "bg-indigo-500 text-slate-950 animate-pulse";
            iconBg = "bg-indigo-950/60 text-indigo-400 border border-indigo-500/20";
          } else if (currentClip && !isLocked) {
            // Accessible but not active/completed
            stateBg = "bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900/60 hover:border-slate-800 cursor-pointer";
            numBadgeBg = "bg-slate-800 text-slate-300";
            iconBg = "bg-slate-900 text-slate-400";
          }

          return (
            <motion.div
              key={idx}
              className={`border rounded-xl p-3.5 transition-all flex flex-col justify-between relative group overflow-hidden ${stateBg}`}
              whileHover={isLocked ? {} : { scale: 1.02, y: -2 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
              onClick={() => handleStepClick(idx)}
              title={step.tooltip}
            >
              {/* Card Header row with number badge and state icon */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono ${numBadgeBg}`}>
                  {`0${idx + 1}`}
                </span>
                
                {/* State Marker */}
                <div className="flex items-center">
                  {step.isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-700" />
                  ) : step.isActive ? (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 opacity-40" />
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="mt-3.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded-lg ${iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs tracking-tight text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug group-hover:text-slate-300 transition-colors">
                  {step.shortDesc}
                </p>
              </div>

              {/* Hover highlight background light */}
              {!isLocked && (
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
