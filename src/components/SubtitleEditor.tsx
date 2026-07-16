import React, { useState } from "react";
import { Plus, Trash2, Clock, Type, Eye, EyeOff, Settings, AlertCircle } from "lucide-react";
import { SubtitleItem, TrimRange } from "../types";
import { formatTimecode } from "../utils";

interface SubtitleEditorProps {
  subtitles: SubtitleItem[];
  setSubtitles: React.Dispatch<React.SetStateAction<SubtitleItem[]>>;
  showSubtitles: boolean;
  setShowSubtitles: (show: boolean) => void;
  activeSubtitleStyle: string;
  setActiveSubtitleStyle: (style: string) => void;
  currentTime: number;
  duration: number;
  trimRange: TrimRange;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function SubtitleEditor({
  subtitles,
  setSubtitles,
  showSubtitles,
  setShowSubtitles,
  activeSubtitleStyle,
  setActiveSubtitleStyle,
  currentTime,
  duration,
  trimRange,
  videoRef,
}: SubtitleEditorProps) {
  const [newText, setNewText] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const handleAddSubtitle = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newText.trim();
    const start = parseFloat(newStart) || currentTime;
    const end = parseFloat(newEnd) || Math.min(start + 3, trimRange.end);

    if (!text) return;

    const newItem: SubtitleItem = {
      id: `sub-${Date.now()}`,
      text,
      start: parseFloat(start.toFixed(1)),
      end: parseFloat(end.toFixed(1)),
    };

    setSubtitles((prev) => [...prev, newItem].sort((a, b) => a.start - b.start));
    setNewText("");
    setNewStart("");
    setNewEnd("");
  };

  const handleUpdateText = (id: string, text: string) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, text } : sub))
    );
  };

  const handleUpdateTimes = (id: string, field: "start" | "end", val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: num } : sub))
    );
  };

  const handleDeleteSubtitle = (id: string) => {
    setSubtitles((prev) => prev.filter((sub) => sub.id !== id));
  };

  const handleUseCurrentTime = (field: "start" | "end") => {
    if (field === "start") {
      setNewStart(currentTime.toFixed(1));
    } else {
      setNewEnd(currentTime.toFixed(1));
    }
  };

  const jumpToTime = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4" id="subtitle-editor-panel">
      {/* Title & Style Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-950 text-indigo-400 border border-indigo-500/10 rounded-lg">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-xs md:text-sm">Teks Otomatis & Subtitle</h4>
            <p className="text-[10px] text-slate-500">Edit teks dan atur durasi kemunculan</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Show/Hide Toggle */}
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 font-semibold ${
              showSubtitles
                ? "bg-indigo-950/40 border-indigo-500/20 text-indigo-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="Sembunyikan/Tampilkan Subtitle di Video"
            type="button"
          >
            {showSubtitles ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{showSubtitles ? "Aktif" : "Sembunyi"}</span>
          </button>

          {/* Subtitle Style Picker */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 p-1 rounded-xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">Gaya:</span>
            <select
              value={activeSubtitleStyle}
              onChange={(e) => setActiveSubtitleStyle(e.target.value)}
              className="bg-transparent text-xs text-indigo-300 focus:outline-none cursor-pointer pr-1 font-semibold"
            >
              <option value="tiktok-yellow" className="bg-slate-900 text-yellow-400 font-bold">TikTok Yellow</option>
              <option value="classic-white" className="bg-slate-900 text-white font-semibold">Classic White</option>
              <option value="neon-green" className="bg-slate-900 text-green-400 font-bold">Neon Green</option>
              <option value="cyberpunk-pink" className="bg-slate-900 text-pink-400 font-bold italic">Cyberpunk Pink</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manual Subtitle Add Form */}
      <form onSubmit={handleAddSubtitle} className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl space-y-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <span>+ Tambah Subtitle Baru</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end">
          <div className="md:col-span-6 space-y-1">
            <label className="text-[9px] text-slate-500 block">Isi Teks Subtitle</label>
            <input
              type="text"
              required
              placeholder="Ketik teks subtitle disini..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-750 focus:border-indigo-500/80 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-200"
              maxLength={40}
            />
          </div>

          <div className="md:col-span-2.5 space-y-1">
            <label className="text-[9px] text-slate-500 block flex justify-between">
              <span>Mulai (Detik)</span>
              <button 
                type="button" 
                onClick={() => handleUseCurrentTime("start")} 
                className="text-[8px] text-indigo-400 hover:underline font-mono"
              >
                Gunakan Playhead
              </button>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max={duration}
              placeholder={currentTime.toFixed(1)}
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-200 font-mono"
            />
          </div>

          <div className="md:col-span-2.5 space-y-1">
            <label className="text-[9px] text-slate-500 block flex justify-between">
              <span>Selesai (Detik)</span>
              <button 
                type="button" 
                onClick={() => handleUseCurrentTime("end")} 
                className="text-[8px] text-indigo-400 hover:underline font-mono"
              >
                Gunakan Playhead
              </button>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max={duration}
              placeholder={Math.min(currentTime + 3, trimRange.end).toFixed(1)}
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-200 font-mono"
            />
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full h-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all flex items-center justify-center shrink-0"
              title="Tambahkan Subtitle"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Subtitles Lists */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Daftar Segmen Teks ({subtitles.length})
        </label>

        {subtitles.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2 bg-slate-950/20">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400 font-semibold">Belum Ada Teks Subtitle</p>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                Gunakan fitur <span className="text-indigo-400">AI Highlights</span> untuk mendeteksi adegan dan membuat subtitle otomatis, atau tambahkan secara manual di atas.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            {subtitles.map((sub, idx) => {
              const isCurrent = currentTime >= sub.start && currentTime <= sub.end;
              return (
                <div
                  key={sub.id}
                  className={`border p-2.5 rounded-xl transition-all flex flex-wrap items-center gap-3 justify-between ${
                    isCurrent
                      ? "bg-indigo-950/30 border-indigo-500/30 shadow-sm"
                      : "bg-slate-950/50 border-slate-850 hover:bg-slate-900"
                  }`}
                >
                  {/* Left segment - Text Input */}
                  <div className="flex-1 min-w-[140px] flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 font-mono">#{idx + 1}</span>
                    <input
                      type="text"
                      value={sub.text}
                      onChange={(e) => handleUpdateText(sub.id, e.target.value)}
                      className="bg-transparent font-medium text-slate-200 text-xs border-b border-transparent hover:border-slate-800 focus:border-indigo-500 focus:outline-none w-full"
                    />
                  </div>

                  {/* Timestamps inputs */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-500 uppercase">In:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={sub.start}
                        onChange={(e) => handleUpdateTimes(sub.id, "start", e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-300 w-12 text-[11px] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-500 uppercase">Out:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={sub.end}
                        onChange={(e) => handleUpdateTimes(sub.id, "end", e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-slate-300 w-12 text-[11px] focus:outline-none"
                      />
                    </div>

                    {/* Preview Jump playhead */}
                    <button
                      type="button"
                      onClick={() => jumpToTime(sub.start)}
                      className="p-1.5 bg-slate-800 hover:bg-indigo-950 hover:text-indigo-400 text-slate-400 rounded transition-colors"
                      title="Lompat ke Detik Subtitle"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtitle(sub.id)}
                      className="p-1.5 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded transition-colors"
                      title="Hapus Subtitle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
