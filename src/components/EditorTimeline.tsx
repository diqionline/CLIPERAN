import React from "react";
import { 
  Scissors, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  SlidersHorizontal
} from "lucide-react";
import { TrimRange, VideoClip } from "../types";
import { formatTimecode } from "../utils";

interface EditorTimelineProps {
  duration: number;
  trimRange: TrimRange;
  setTrimRange: React.Dispatch<React.SetStateAction<TrimRange>>;
  currentClip: VideoClip;
  currentTime: number;
}

export default function EditorTimeline({
  duration,
  trimRange,
  setTrimRange,
  currentClip,
  currentTime,
}: EditorTimelineProps) {
  const clipDuration = trimRange.end - trimRange.start;
  const isOverLimit = clipDuration > 30;

  // Granular adjustments
  const adjustStart = (amount: number) => {
    setTrimRange((prev) => {
      const nextStart = Math.max(0, Math.min(prev.end - 0.5, prev.start + amount));
      return {
        ...prev,
        start: parseFloat(nextStart.toFixed(1)),
      };
    });
  };

  const adjustEnd = (amount: number) => {
    setTrimRange((prev) => {
      const nextEnd = Math.min(duration, Math.max(prev.start + 0.5, prev.end + amount));
      return {
        ...prev,
        end: parseFloat(nextEnd.toFixed(1)),
      };
    });
  };

  // Percentage calculations for visuals
  const startPercent = (trimRange.start / duration) * 100;
  const endPercent = (trimRange.end / duration) * 100;
  const currentPercent = (currentTime / duration) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5" id="timeline-panel">
      {/* Header controls info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <h4 className="font-semibold text-slate-200 text-xs md:text-sm">Timeline Presisi & Pemotong</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase">Durasi Klip:</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
            isOverLimit 
              ? "bg-red-950/80 border border-red-500/20 text-red-400" 
              : "bg-indigo-950/80 border border-indigo-500/20 text-indigo-300"
          }`}>
            {clipDuration.toFixed(1)}s / 30s
          </span>
        </div>
      </div>

      {/* Visual Track Container */}
      <div className="space-y-3">
        {/* Visual Strip representing frames */}
        <div className="relative h-14 bg-slate-950 rounded-xl overflow-hidden border border-slate-850 select-none">
          {/* Simulated Film Strip Preview Cells */}
          <div className="absolute inset-0 grid grid-cols-6 opacity-30 gap-0.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-cover bg-center h-full" style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=120&auto=format&fit=crop&q=40&sig=${i}')` 
              }} />
            ))}
          </div>

          {/* Slashed out segments outside the trim range */}
          <div className="absolute top-0 bottom-0 left-0 bg-black/75 backdrop-blur-[1px]" style={{ width: `${startPercent}%` }} />
          <div className="absolute top-0 bottom-0 right-0 bg-black/75 backdrop-blur-[1px]" style={{ left: `${endPercent}%` }} />

          {/* Active Highlight Slider Trim Segment */}
          <div 
            className={`absolute top-0 bottom-0 border-y-2 flex justify-between ${
              isOverLimit ? "border-red-500/80 bg-red-500/5" : "border-indigo-500/80 bg-indigo-500/5"
            }`}
            style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
          >
            {/* Left handle hook */}
            <div className="w-1.5 h-full bg-indigo-500 cursor-ew-resize relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-6 rounded bg-indigo-400 flex items-center justify-center border border-white shadow-md">
                <ChevronLeft className="w-3 h-3 text-slate-900 font-bold" />
              </div>
            </div>
            
            {/* Right handle hook */}
            <div className="w-1.5 h-full bg-indigo-500 cursor-ew-resize relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-6 rounded bg-indigo-400 flex items-center justify-center border border-white shadow-md">
                <ChevronRight className="w-3 h-3 text-slate-900 font-bold" />
              </div>
            </div>
          </div>

          {/* Current playback playhead line */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-amber-500 z-10"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="absolute top-0 -translate-y-1 w-2.5 h-2.5 bg-amber-500 rotate-45 -ml-1 shadow-md" />
          </div>
        </div>

        {/* Double Range Slider inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Trim Precision Inputs */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-indigo-400" />
                  DETIK MULAI
                </span>
                <span className="font-mono">{formatTimecode(trimRange.start, true)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => adjustStart(-1.0)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="-1 detik"
                  >
                    -1s
                  </button>
                  <button 
                    onClick={() => adjustStart(-0.1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="-0.1 detik"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
                
                <input 
                  type="number" 
                  value={trimRange.start} 
                  step="0.1"
                  min="0"
                  max={trimRange.end - 0.5}
                  onChange={(e) => {
                    const value = parseFloat(parseFloat(e.target.value).toFixed(1));
                    if (!isNaN(value) && value >= 0 && value < trimRange.end) {
                      setTrimRange(prev => ({ ...prev, start: value }));
                    }
                  }}
                  className="w-16 bg-transparent border-b border-slate-800 focus:border-indigo-500 text-center font-mono font-bold text-slate-200 focus:outline-none text-xs py-0.5"
                />

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => adjustStart(0.1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="+0.1 detik"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => adjustStart(1.0)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="+1 detik"
                  >
                    +1s
                  </button>
                </div>
              </div>
            </div>

            {/* Right Trim Precision Inputs */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-amber-400" />
                  DETIK SELESAI
                </span>
                <span className="font-mono">{formatTimecode(trimRange.end, true)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => adjustEnd(-1.0)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="-1 detik"
                  >
                    -1s
                  </button>
                  <button 
                    onClick={() => adjustEnd(-0.1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="-0.1 detik"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
                
                <input 
                  type="number" 
                  value={trimRange.end} 
                  step="0.1"
                  min={trimRange.start + 0.5}
                  max={duration}
                  onChange={(e) => {
                    const value = parseFloat(parseFloat(e.target.value).toFixed(1));
                    if (!isNaN(value) && value > trimRange.start && value <= duration) {
                      setTrimRange(prev => ({ ...prev, end: value }));
                    }
                  }}
                  className="w-16 bg-transparent border-b border-slate-800 focus:border-indigo-500 text-center font-mono font-bold text-slate-200 focus:outline-none text-xs py-0.5"
                />

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => adjustEnd(0.1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="+0.1 detik"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => adjustEnd(1.0)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs"
                    title="+1 detik"
                  >
                    +1s
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
