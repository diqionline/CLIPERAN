import React, { useState } from "react";
import { 
  Sparkles, 
  Loader2, 
  Check, 
  Flame, 
  Video, 
  AlertCircle,
  Clock,
  ArrowRight,
  FileText
} from "lucide-react";
import { captureVideoKeyframes } from "../utils";
import { AIAnalysis, VideoClip } from "../types";

interface AIAssistantProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  duration: number;
  currentClip: VideoClip | null;
  onApplyHighlight: (start: number, end: number, analysis: AIAnalysis) => void;
  activeAnalysis: AIAnalysis | null;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<AIAnalysis | null>>;
}

export default function AIAssistant({
  videoRef,
  duration,
  currentClip,
  onApplyHighlight,
  activeAnalysis,
  setActiveAnalysis,
}: AIAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // States for Categories
  const [categories, setCategories] = useState<string[]>([
    "Adegan Lucu",
    "Adegan Baper",
    "Adegan Seram",
    "Adegan Aksi/Keren",
    "Umum"
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Umum");
  const [newCategoryInput, setNewCategoryInput] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const steps = [
    "Menyinkronkan frame video...",
    "Mengekstrak 6 snapshot adegan penting...",
    "Mengompres data visual untuk analisis...",
    "Mengirim snapshot ke server Gemini 3.5 Flash...",
    "Menganalisis pergerakan, emosi, dan kecerahan...",
    "Menghasilkan rentang klip 30 detik & teks otomatis..."
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (trimmed && !categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setCategories(prev => [...prev, trimmed]);
      setSelectedCategory(trimmed);
      setNewCategoryInput("");
      setShowAddForm(false);
    }
  };

  const handleAnalyze = async () => {
    const video = videoRef.current;
    if (!video) {
      setError("Video player tidak siap atau video belum dimuat.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setLogs([]);
    setCurrentStep(0);

    try {
      // Step 1: Initialize
      setLogs((prev) => [...prev, `Memulai analisis video dengan Cliperan AI [Kategori: ${selectedCategory}]...`]);
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 2 & 3: Extracting frames
      setCurrentStep(1);
      setLogs((prev) => [...prev, "Mengambil 6 frame kunci dari video di berbagai interval waktu..."]);
      
      const frames = await captureVideoKeyframes(video, duration, 6);
      
      setCurrentStep(2);
      setLogs((prev) => [...prev, `Berhasil menangkap ${frames.length} frame visual.`]);
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Step 4 & 5: AI analysis
      setCurrentStep(3);
      setLogs((prev) => [...prev, `Mengirim data visual ke Gemini AI untuk mencari klip terbaik kategori "${selectedCategory}"...`]);
      
      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frames,
          duration,
          description: currentClip?.name,
          category: selectedCategory,
        }),
      });

      setCurrentStep(4);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghubungi API analisis.");
      }

      setCurrentStep(5);
      const data: AIAnalysis = await response.json();
      setLogs((prev) => [...prev, "AI berhasil menemukan adegan terbaik, membuat subtitle otomatis, dan menyusun caption viral!"]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setActiveAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat menganalisis video dengan AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    if (score >= 75) return "text-amber-400 border-amber-500/30 bg-amber-950/20";
    return "text-slate-400 border-slate-700 bg-slate-800/55";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full space-y-5" id="ai-assistant-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-950 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 tracking-tight text-sm md:text-base">Adegan Menarik Menurut AI</h3>
            <p className="text-xs text-slate-400">Temukan momen viral otomatis dalam video Anda</p>
          </div>
        </div>
      </div>

      {/* Main State Handling */}
      {!isAnalyzing && !activeAnalysis && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full"></div>
            <div className="relative p-5 bg-slate-850 border border-slate-800 rounded-full text-indigo-400">
              <Sparkles className="w-10 h-10" />
            </div>
          </div>
          
          <div className="space-y-2 max-w-sm">
            <h4 className="font-medium text-slate-200 text-sm">Temukan Momen Terbaik Secara Otomatis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Teknologi AI Cliperan akan memindai frame kunci dari video Anda, menganalisis intensitas visual, transisi, dan aksi menarik untuk menghasilkan klip di bawah 30 detik yang siap mendominasi FYP.
            </p>
          </div>

          {/* Category Picker Section */}
          <div className="w-full text-left space-y-2.5 p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Pilih Kategori Pemotongan:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-950/30"
                      : "bg-slate-850 text-slate-300 border-slate-800/80 hover:bg-slate-800"
                  }`}
                  type="button"
                >
                  {cat}
                </button>
              ))}

              {/* Toggle Manual Add Category */}
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-slate-850 transition-all"
                  type="button"
                >
                  + Tambah Baru
                </button>
              ) : (
                <form onSubmit={handleAddCategory} className="flex gap-1 items-center w-full mt-1.5">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Contoh: Adegan Sedih..."
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                    maxLength={20}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shrink-0"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCategoryInput("");
                    }}
                    className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg transition-all shrink-0"
                  >
                    Batal
                  </button>
                </form>
              )}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!currentClip}
            className={`w-full py-3.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2.5 transition-all ${
              currentClip 
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:scale-[1.02] active:scale-[0.98]" 
                : "bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed"
            }`}
            id="start-ai-analysis-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Analisis AI</span>
          </button>
          
          {!currentClip && (
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Silakan upload video atau gunakan template terlebih dahulu.
            </p>
          )}
        </div>
      )}

      {/* Loading & Stepper Screen */}
      {isAnalyzing && (
        <div className="flex-1 flex flex-col justify-center space-y-6 py-6" id="ai-loading-screen">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-medium text-slate-200 text-xs">Menganalisis Adegan Video...</h4>
              <p className="text-[10px] text-slate-400 font-mono">Langkah {currentStep + 1} dari {steps.length}</p>
            </div>
          </div>

          {/* Steps Display */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2.5 max-h-[180px] overflow-y-auto font-mono text-[10px]">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-400 select-none">✓</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span>{steps[currentStep]}</span>
            </div>
          </div>

          {/* Animated Visual representation */}
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* AI Analysis Result Screen */}
      {activeAnalysis && !isAnalyzing && (
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[480px]" id="ai-result-screen">
          {/* Headline Recommendation Card */}
          <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/80 border border-indigo-500/20 py-0.5 px-2 rounded-full">Rekomendasi Terbaik</span>
                <h4 className="font-semibold text-slate-200 text-sm">{activeAnalysis.title}</h4>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg ${getScoreColor(activeAnalysis.viralScore)}`}>
                <Flame className="w-4 h-4 fill-current" />
                <div className="text-center">
                  <div className="text-xs font-bold leading-none">{activeAnalysis.viralScore}%</div>
                  <div className="text-[8px] font-medium uppercase tracking-wider text-slate-400">Viral</div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between border border-slate-800/60 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase">Mulai Klip</span>
                <div className="text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{activeAnalysis.recommendedStart}s</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="space-y-1 text-right">
                <span className="text-[9px] text-slate-500 uppercase">Selesai Klip</span>
                <div className="text-slate-300 flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeAnalysis.recommendedEnd}s</span>
                </div>
              </div>
              <div className="border-l border-slate-800 pl-3 space-y-1 text-right">
                <span className="text-[9px] text-slate-500 uppercase">Durasi</span>
                <div className="font-bold text-indigo-400">
                  {(activeAnalysis.recommendedEnd - activeAnalysis.recommendedStart).toFixed(1)}s
                </div>
              </div>
            </div>

            {/* Why Chosen */}
            <div className="space-y-1.5 text-xs">
              <h5 className="font-medium text-slate-300 flex items-center gap-1.5 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Mengapa Adegan Ini Menarik?
              </h5>
              <p className="text-slate-400 leading-relaxed text-[11px] bg-slate-900/40 p-3 rounded-lg border border-slate-800/40">
                {activeAnalysis.reason}
              </p>
            </div>
          </div>

          {/* Social Caption suggestions */}
          <div className="space-y-2">
            <h5 className="font-medium text-slate-300 text-xs flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Saran Caption & Hashtag Viral (AI)
            </h5>
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-[11px] font-mono text-slate-400 whitespace-pre-wrap relative group">
              {activeAnalysis.suggestedCaption}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeAnalysis.suggestedCaption);
                  alert("Caption disalin ke clipboard!");
                }}
                className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 border border-slate-750 px-2 py-1 rounded text-[9px] transition-all"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setActiveAnalysis(null);
                setLogs([]);
              }}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-medium text-xs transition-colors"
            >
              Reset AI
            </button>
            <button
              onClick={() => onApplyHighlight(activeAnalysis.recommendedStart, activeAnalysis.recommendedEnd, activeAnalysis)}
              className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              id="apply-ai-highlights-btn"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Potongan</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Boundary */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/20 p-4 rounded-xl text-xs text-red-200 flex items-start gap-2.5" id="ai-error-boundary">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold leading-none">Gagal Menganalisis</h5>
            <p className="text-[10px] leading-relaxed text-red-300/90">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
