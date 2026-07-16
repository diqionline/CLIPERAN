import React, { useRef, useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Scissors, 
  Clock, 
  RotateCcw,
  Gauge
} from "lucide-react";
import { TrimRange, SubtitleItem } from "../types";
import { formatTimecode } from "../utils";

interface VideoPlayerProps {
  videoUrl: string;
  duration: number;
  trimRange: TrimRange;
  setTrimRange: React.Dispatch<React.SetStateAction<TrimRange>>;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  subtitles?: SubtitleItem[];
  showSubtitles?: boolean;
  activeSubtitleStyle?: string;
}

export default function VideoPlayer({
  videoUrl,
  duration,
  trimRange,
  setTrimRange,
  currentTime,
  setCurrentTime,
  videoRef,
  subtitles = [],
  showSubtitles = true,
  activeSubtitleStyle = "tiktok-yellow",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopTrim, setLoopTrim] = useState(true);

  // Sync state with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      // Loop or restrict playback to the trimmed range if active
      if (loopTrim) {
        if (current >= trimRange.end) {
          video.currentTime = trimRange.start;
          if (!isPlaying) {
            video.play().catch(() => {});
          }
        } else if (current < trimRange.start) {
          video.currentTime = trimRange.start;
        }
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Set video start time when loaded or when trimRange.start changes
    if (video.currentTime < trimRange.start || video.currentTime > trimRange.end) {
      video.currentTime = trimRange.start;
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [trimRange, loopTrim, isPlaying]);

  // Handle Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      // If we are at the end, jump to start before playing
      if (video.currentTime >= trimRange.end) {
        video.currentTime = trimRange.start;
      }
      video.play().catch((err) => console.log("Play failed:", err));
    }
  };

  // Handle Mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Change playback speed
  const changeSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackRate(speed);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  // Set Current Time as start of trim
  const setStartToCurrent = () => {
    const current = Math.min(currentTime, trimRange.end - 0.5);
    setTrimRange((prev) => ({
      ...prev,
      start: parseFloat(current.toFixed(1)),
    }));
  };

  // Set Current Time as end of trim
  const setEndToCurrent = () => {
    const current = Math.max(currentTime, trimRange.start + 0.5);
    // Enforce 30s limit
    const limitedEnd = Math.min(current, trimRange.start + 30);
    setTrimRange((prev) => ({
      ...prev,
      end: parseFloat(limitedEnd.toFixed(1)),
    }));
  };

  // Jump to start of trim
  const jumpToStart = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = trimRange.start;
      setCurrentTime(trimRange.start);
    }
  };

  // Find the active subtitle for the current timestamp
  const activeSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  const getSubtitleStyle = (styleName: string) => {
    switch (styleName) {
      case "tiktok-yellow":
        return {
          color: "#facc15",
          WebkitTextStroke: "1.5px black",
          textShadow: "3px 3px 0px #000",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 900,
        };
      case "classic-white":
        return {
          color: "#ffffff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
        };
      case "neon-green":
        return {
          color: "#4ade80",
          WebkitTextStroke: "1px black",
          textShadow: "0 0 8px rgba(74, 222, 128, 0.6), 2px 2px 2px #000",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
        };
      case "cyberpunk-pink":
        return {
          color: "#f472b6",
          WebkitTextStroke: "1.5px black",
          textShadow: "3px 3px 0px #000, 0 0 10px rgba(244, 114, 182, 0.5)",
          fontStyle: "italic" as const,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 900,
        };
      default:
        return {
          color: "#ffffff",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
        };
    }
  };

  const currentTrimDuration = trimRange.end - trimRange.start;
  const isOverDurationLimit = currentTrimDuration > 30;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full" id="video-player-container">
      {/* Video Display Stage */}
      <div className="relative flex-1 bg-black flex items-center justify-center min-h-[250px] md:min-h-[340px]">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full max-h-[460px] object-contain"
          playsInline
          crossOrigin="anonymous"
        />

        {/* Subtitle Overlay */}
        {showSubtitles && activeSubtitle && (
          <div className="absolute bottom-16 left-4 right-4 pointer-events-none flex justify-center z-10 transition-all duration-150 animate-bounce-short">
            <div 
              style={getSubtitleStyle(activeSubtitle.style || activeSubtitleStyle)}
              className={`px-4 py-2 rounded-xl text-center text-lg md:text-xl lg:text-2xl tracking-wide select-none ${
                (activeSubtitle.style || activeSubtitleStyle) === "classic-white" 
                  ? "bg-black/75 backdrop-blur-sm border border-slate-800" 
                  : ""
              }`}
            >
              {activeSubtitle.text}
            </div>
          </div>
        )}
        
        {/* Hover / Inactive Trim Notification */}
        {isOverDurationLimit && (
          <div className="absolute top-4 left-4 right-4 bg-red-950/90 border border-red-500/30 px-3 py-2 rounded-xl text-xs text-red-200 flex items-center gap-2 backdrop-blur-sm z-10 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Durasi klip ({currentTrimDuration.toFixed(1)} detik) melebihi batas maksimal 30 detik!</span>
          </div>
        )}

        {/* Floating Playhead Timecode overlay */}
        <div className="absolute bottom-4 right-4 bg-black/75 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 backdrop-blur-sm tracking-wider flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatTimecode(currentTime, true)}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{formatTimecode(duration)}</span>
        </div>
      </div>

      {/* Editor Scrub & Play Controls */}
      <div className="p-5 border-t border-slate-800/80 bg-slate-900/90 space-y-4">
        {/* Custom Progress bar / Playhead indicator */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>00:00</span>
            <span className="text-indigo-400 font-medium">Position: {formatTimecode(currentTime)}</span>
            <span>{formatTimecode(duration)}</span>
          </div>
          <div className="relative h-2 bg-slate-800 rounded-full cursor-pointer group" onClick={(e) => {
            const video = videoRef.current;
            if (!video) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const targetTime = pos * duration;
            video.currentTime = targetTime;
            setCurrentTime(targetTime);
          }}>
            {/* Trim range visual segment */}
            <div 
              className={`absolute top-0 h-full rounded-full transition-colors ${
                isOverDurationLimit ? "bg-red-500/20" : "bg-indigo-500/20"
              }`}
              style={{
                left: `${(trimRange.start / duration) * 100}%`,
                width: `${((trimRange.end - trimRange.start) / duration) * 100}%`
              }}
            />
            {/* Playhead handle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3.5 h-3.5 bg-white rounded-full border border-indigo-600 shadow-md group-hover:scale-125 transition-transform"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Primary Row Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Block: Playback speed and volume */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute} 
              className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-xl transition-colors"
              title={isMuted ? "Unmute" : "Muted"}
              id="volume-toggle-btn"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-850 rounded-xl p-1 border border-slate-800">
              <button 
                onClick={() => changeSpeed(0.5)} 
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${playbackRate === 0.5 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                0.5x
              </button>
              <button 
                onClick={() => changeSpeed(1)} 
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${playbackRate === 1 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                1x
              </button>
              <button 
                onClick={() => changeSpeed(1.5)} 
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${playbackRate === 1.5 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                1.5x
              </button>
            </div>
          </div>

          {/* Center Block: Play / Pause */}
          <div className="flex items-center gap-3">
            <button
              onClick={jumpToStart}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Jump to Trim Start"
              id="jump-to-start-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className={`p-4 rounded-full text-white transition-all shadow-lg transform hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-950/20" 
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/20"
              }`}
              id="main-play-pause-btn"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setLoopTrim(!loopTrim)}
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 font-medium ${
                loopTrim 
                  ? "bg-indigo-950/60 border-indigo-500/40 text-indigo-300" 
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
              title="Loop within Trimming Segment"
              id="loop-toggle-btn"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${loopTrim ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`} />
              Loop Trim
            </button>
          </div>

          {/* Right Block: Screen utility */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFullscreen} 
              className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-xl transition-colors"
              title="Fullscreen"
              id="fullscreen-btn"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Trim Markers Set */}
        <div className="pt-2 border-t border-slate-800/50 grid grid-cols-2 gap-3">
          <button
            onClick={setStartToCurrent}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
            title="Set current playhead as clip start"
            id="set-start-btn"
          >
            <Scissors className="w-3.5 h-3.5 text-indigo-400 transform -rotate-90" />
            <span>Set Mulai ({formatTimecode(currentTime)})</span>
          </button>
          <button
            onClick={setEndToCurrent}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
            title="Set current playhead as clip end"
            id="set-end-btn"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400 transform rotate-90" />
            <span>Set Selesai ({formatTimecode(currentTime)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
