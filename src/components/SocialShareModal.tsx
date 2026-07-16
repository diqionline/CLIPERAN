import React, { useState, useEffect } from "react";
import { 
  Share2, 
  Download, 
  MessageCircle, 
  Heart, 
  Send, 
  Music, 
  Sparkles, 
  Check, 
  Loader2, 
  Smartphone,
  CheckCircle,
  Youtube,
  Instagram,
  RefreshCw,
  Award,
  Calendar,
  Clock,
  Trash2,
  Link,
  Unlink,
  AlertCircle,
  Lock,
  Globe,
  Settings,
  Bell
} from "lucide-react";
import { compileVideoClip, formatTimecode } from "../utils";
import { TrimRange, SocialPlatform, AIAnalysis, VideoClip, ScheduledPost } from "../types";
import { PLATFORM_DETAILS } from "../data";

interface SocialShareModalProps {
  trimRange: TrimRange;
  currentClip: VideoClip;
  analysis: AIAnalysis | null;
  onAddCreatedClip?: (clip: {
    name: string;
    originalVideoUrl: string;
    originalVideoName: string;
    sourceType: "local" | "url" | "template";
    compiledUrl: string;
    duration: number;
    trimStart: number;
    trimEnd: number;
    platformShared?: SocialPlatform | "Downloaded";
    caption?: string;
  }) => void;
}

export default function SocialShareModal({
  trimRange,
  currentClip,
  analysis,
  onAddCreatedClip,
}: SocialShareModalProps) {
  const [platform, setPlatform] = useState<SocialPlatform>("tiktok");
  const [customCaption, setCustomCaption] = useState("");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compiledUrl, setCompiledUrl] = useState<string | null>(null);
  
  // Direct Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // Account Connections State (Instagram and TikTok)
  const [connections, setConnections] = useState<Record<SocialPlatform, { connected: boolean; username: string; profilePic: string }>>(() => {
    const saved = localStorage.getItem("cliperan_social_connections");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      tiktok: { connected: true, username: "cliperan.creator", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
      instagram: { connected: false, username: "", profilePic: "" },
      youtube: { connected: false, username: "", profilePic: "" }
    };
  });

  // Modal State for Custom OAuth Connection Simulation
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);
  const [inputUsername, setInputUsername] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Post Scheduling States
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem("cliperan_scheduled_posts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [schedulerNotification, setSchedulerNotification] = useState<string | null>(null);

  // Save connections & scheduled posts to local storage when changed
  useEffect(() => {
    localStorage.setItem("cliperan_social_connections", JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem("cliperan_scheduled_posts", JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  // Background Scheduler checker (runs every 4 seconds to simulate automatic posting trigger)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let updated = false;

      const nextPosts = scheduledPosts.map((post) => {
        if (post.status === "scheduled") {
          const postTime = new Date(post.scheduledTime);
          if (now >= postTime) {
            updated = true;
            triggerPostNotification(post);
            return { ...post, status: "published" as const };
          }
        }
        return post;
      });

      if (updated) {
        setScheduledPosts(nextPosts);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [scheduledPosts]);

  const triggerPostNotification = (post: ScheduledPost) => {
    const platformName = post.platform === "tiktok" ? "TikTok" : post.platform === "instagram" ? "Instagram" : "YouTube Shorts";
    setSchedulerNotification(`📢 Postingan Terjadwal [${platformName}] Berhasil Dipublikasikan Otomatis! 🎉`);
    setTimeout(() => setSchedulerNotification(null), 6000);
  };

  const details = PLATFORM_DETAILS[platform];
  const clipDuration = trimRange.end - trimRange.start;

  // Handles custom simulated caption generation
  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: analysis?.title || currentClip.name,
          reason: analysis?.reason || "Adegan visual menarik.",
          platform: platform === "tiktok" ? "TikTok" : platform === "instagram" ? "Instagram Reels" : "YouTube Shorts",
          duration: parseFloat(clipDuration.toFixed(1)),
        }),
      });

      if (!response.ok) throw new Error("Gagal membuat caption otomatis.");
      const data = await response.json();
      setCustomCaption(data.caption);
    } catch (err) {
      console.error(err);
      setCustomCaption(`🔥 Klip hasil potong Cliperan AI! Durasi ${clipDuration.toFixed(1)} detik.\n\nBagaimana menurut kalian? 🤔👇\n\n#cliperan #video #fyp #viral #bestmoment #${platform}`);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  // Direct Social Upload Sync (Upload directly to API)
  const handleDirectUploadAndSync = async () => {
    // Check if the current platform is connected
    if (!connections[platform].connected) {
      alert(`Mohon hubungkan akun ${platform.toUpperCase()} Anda terlebih dahulu untuk memulai upload langsung!`);
      triggerConnectPlatform(platform);
      return;
    }

    setIsCompiling(true);
    setCompileProgress(0);
    setIsSynced(false);
    setIsUploading(false);
    setUploadProgress(0);
    setSyncLogs([]);

    try {
      // 1. Compile video (slicing segment via helper)
      const mockResultUrl = await compileVideoClip(
        currentClip.url,
        trimRange.start,
        trimRange.end,
        (progress) => {
          setCompileProgress(progress);
        }
      );

      setCompiledUrl(mockResultUrl);
      setIsCompiling(false); // Done compiling, start direct uploading

      // 2. Start Live direct upload to TikTok / Instagram API
      setIsUploading(true);
      const activeUser = connections[platform].username;
      
      setSyncLogs((prev) => [...prev, `[OAuth] Membuka saluran aman ke server API ${platform.toUpperCase()}...`]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUploadProgress(15);

      setSyncLogs((prev) => [...prev, `Mengautentikasi akun @${activeUser} dengan Token API...`]);
      await new Promise((resolve) => setTimeout(resolve, 650));
      setUploadProgress(35);

      setSyncLogs((prev) => [...prev, `Mengunggah klip MP4 (${clipDuration.toFixed(1)} detik) langsung ke CDN ${platform}...`]);
      await new Promise((resolve) => setTimeout(resolve, 900));
      setUploadProgress(70);

      setSyncLogs((prev) => [...prev, `Menerapkan teks otomatis dan metadata hashtag...`]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUploadProgress(90);

      setSyncLogs((prev) => [...prev, `Memproses rendering & mempublikasikan klip ke feed...`]);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUploadProgress(100);

      setSyncLogs((prev) => [...prev, `Klip BERHASIL diupload langsung ke akun @${activeUser}! 🚀`]);
      await new Promise((resolve) => setTimeout(resolve, 400));

      setIsSynced(true);
      
      // Automatic download fallback
      const link = document.createElement("a");
      link.href = mockResultUrl;
      link.download = `cliperan-${platform}-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onAddCreatedClip) {
        onAddCreatedClip({
          name: `${currentClip.name} (${platform === "tiktok" ? "TikTok" : platform === "instagram" ? "Instagram" : "Shorts"})`,
          originalVideoUrl: currentClip.url,
          originalVideoName: currentClip.name,
          sourceType: currentClip.sourceType,
          compiledUrl: mockResultUrl,
          duration: parseFloat(clipDuration.toFixed(1)),
          trimStart: trimRange.start,
          trimEnd: trimRange.end,
          platformShared: platform,
          caption: displayCaption
        });
      }

    } catch (err) {
      console.error("Direct upload error", err);
      setSyncLogs((prev) => [...prev, `Kesalahan API: Gagal mengunggah postingan langsung.`]);
    } finally {
      setIsCompiling(false);
      setIsUploading(false);
    }
  };

  // Compile and just download (local file only)
  const handleJustDownload = async () => {
    setIsCompiling(true);
    setCompileProgress(0);

    try {
      const mockResultUrl = await compileVideoClip(
        currentClip.url,
        trimRange.start,
        trimRange.end,
        (progress) => {
          setCompileProgress(progress);
        }
      );

      setCompiledUrl(mockResultUrl);
      setIsCompiling(false);

      const link = document.createElement("a");
      link.href = mockResultUrl;
      link.download = `cliperan-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onAddCreatedClip) {
        onAddCreatedClip({
          name: `${currentClip.name} (Unduhan MP4)`,
          originalVideoUrl: currentClip.url,
          originalVideoName: currentClip.name,
          sourceType: currentClip.sourceType,
          compiledUrl: mockResultUrl,
          duration: parseFloat(clipDuration.toFixed(1)),
          trimStart: trimRange.start,
          trimEnd: trimRange.end,
          platformShared: "Downloaded",
          caption: displayCaption
        });
      }
    } catch (err) {
      console.error("Download compile error", err);
      alert("Gagal merender video untuk unduhan.");
    } finally {
      setIsCompiling(false);
    }
  };

  // Open Connect Platform Simulated Modal
  const triggerConnectPlatform = (plat: SocialPlatform) => {
    setConnectingPlatform(plat);
    setInputUsername("");
    setShowConnectModal(true);
  };

  // Handle Simulated OAuth / Username Login
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingPlatform || !inputUsername.trim()) return;

    setIsAuthenticating(true);
    setTimeout(() => {
      const formattedUsername = inputUsername.replace("@", "").trim();
      setConnections(prev => ({
        ...prev,
        [connectingPlatform]: {
          connected: true,
          username: formattedUsername,
          profilePic: connectingPlatform === "tiktok" 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
        }
      }));
      setIsAuthenticating(false);
      setShowConnectModal(false);
      setConnectingPlatform(null);
    }, 1200);
  };

  // Disconnect social channel
  const handleDisconnect = (plat: SocialPlatform) => {
    setConnections(prev => ({
      ...prev,
      [plat]: { connected: false, username: "", profilePic: "" }
    }));
  };

  // Handles adding scheduled post to the list
  const handleSchedulePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) {
      alert("Harap pilih tanggal dan waktu penjadwalan terlebih dahulu!");
      return;
    }

    const scheduledDateTime = `${scheduleDate}T${scheduleTime}`;
    const targetDate = new Date(scheduledDateTime);
    const now = new Date();

    if (targetDate <= now) {
      alert("Waktu penjadwalan harus di masa depan!");
      return;
    }

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      platform,
      caption: displayCaption,
      clipName: currentClip.name,
      clipDuration: parseFloat(clipDuration.toFixed(1)),
      scheduledTime: scheduledDateTime,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };

    setScheduledPosts(prev => [newPost, ...prev]);
    setScheduleDate("");
    setScheduleTime("");
    
    // Alert feedback
    setSchedulerNotification(`Postingan berhasil dijadwalkan pada ${targetDate.toLocaleString("id-ID")}! ⏰`);
    setTimeout(() => setSchedulerNotification(null), 4500);
  };

  // Delete/Cancel Scheduled Post
  const handleCancelScheduled = (id: string) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== id));
  };

  // Publish immediate from scheduled queue
  const handlePublishNow = (post: ScheduledPost) => {
    setScheduledPosts(prev =>
      prev.map(p => (p.id === post.id ? { ...p, status: "published" as const } : p))
    );
    setSchedulerNotification(`Postingan berhasil diupload langsung ke @${connections[post.platform].username || "creator"}! 🚀`);
    setTimeout(() => setSchedulerNotification(null), 4000);
  };

  const displayCaption = customCaption || analysis?.suggestedCaption || `🎥 Klip menarik dari video "${currentClip.name}" berdurasi ${clipDuration.toFixed(1)} detik. Diedit praktis menggunakan Cliperan AI Editor.\n\n#video #editor #cliperan #viral #trending`;

  // Format date readable for schedule cards
  const formatScheduleTime = (dtStr: string) => {
    try {
      const dt = new Date(dtStr);
      return dt.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dtStr;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full space-y-5 relative" id="export-sync-panel">
      
      {/* Toast Notification for Scheduler */}
      {schedulerNotification && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-indigo-950 border border-indigo-500/40 text-indigo-200 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-short">
          <Bell className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold">{schedulerNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-950 text-amber-400 border border-amber-500/20 rounded-xl">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 tracking-tight text-sm md:text-base">Ekspor, Upload Langsung & Jadwalkan</h3>
            <p className="text-xs text-slate-400">Hubungkan akun sosial Anda dan atur kalender postingan</p>
          </div>
        </div>
      </div>

      {/* Connection Center - Direct Upload Integrations */}
      <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-indigo-400" />
            Integrasi Upload Langsung & API
          </span>
          <span className="text-[9px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/10">Connected API</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* TikTok Account Connection */}
          <div className="bg-slate-900/80 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold border border-slate-800">
                🎵
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-200">TikTok Direct</p>
                <p className="text-[9px] text-slate-500 font-mono truncate max-w-[90px]">
                  {connections.tiktok.connected ? `@${connections.tiktok.username}` : "Belum Terhubung"}
                </p>
              </div>
            </div>

            {connections.tiktok.connected ? (
              <button
                onClick={() => handleDisconnect("tiktok")}
                className="p-1 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                title="Putuskan Sambungan"
                type="button"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => triggerConnectPlatform("tiktok")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 text-[10px] font-bold rounded-lg transition-all"
                type="button"
              >
                Hubungkan
              </button>
            )}
          </div>

          {/* Instagram Account Connection */}
          <div className="bg-slate-900/80 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold border border-slate-800">
                📸
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-200">Instagram Reels</p>
                <p className="text-[9px] text-slate-500 font-mono truncate max-w-[90px]">
                  {connections.instagram.connected ? `@${connections.instagram.username}` : "Belum Terhubung"}
                </p>
              </div>
            </div>

            {connections.instagram.connected ? (
              <button
                onClick={() => handleDisconnect("instagram")}
                className="p-1 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                title="Putuskan Sambungan"
                type="button"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => triggerConnectPlatform("instagram")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 text-[10px] font-bold rounded-lg transition-all"
                type="button"
              >
                Hubungkan
              </button>
            )}
          </div>

          {/* YouTube Accounts */}
          <div className="bg-slate-900/80 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold border border-slate-800">
                🔴
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-200">YouTube Shorts</p>
                <p className="text-[9px] text-slate-500 font-mono truncate max-w-[90px]">
                  {connections.youtube.connected ? `@${connections.youtube.username}` : "Belum Terhubung"}
                </p>
              </div>
            </div>

            {connections.youtube.connected ? (
              <button
                onClick={() => handleDisconnect("youtube")}
                className="p-1 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                title="Putuskan Sambungan"
                type="button"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => triggerConnectPlatform("youtube")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 text-[10px] font-bold rounded-lg transition-all"
                type="button"
              >
                Hubungkan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Form/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): Editor controls & details */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Platform Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Pilih Platform Aktif</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setPlatform("tiktok");
                  setCustomCaption("");
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  platform === "tiktok"
                    ? "bg-black border-slate-700 text-white shadow-lg"
                    : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-cyan-400 font-bold">🎵</span>
                <span>TikTok</span>
              </button>

              <button
                onClick={() => {
                  setPlatform("instagram");
                  setCustomCaption("");
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  platform === "instagram"
                    ? "bg-gradient-to-tr from-yellow-600 via-pink-600 to-purple-600 border-transparent text-white shadow-lg"
                    : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>

              <button
                onClick={() => {
                  setPlatform("youtube");
                  setCustomCaption("");
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  platform === "youtube"
                    ? "bg-red-700 border-transparent text-white shadow-lg"
                    : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Shorts</span>
              </button>
            </div>
          </div>

          {/* Caption Configurer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">Caption Video</label>
              <button
                onClick={handleGenerateCaption}
                disabled={isGeneratingCaption}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/20 py-1 px-2.5 rounded-lg transition-colors"
                type="button"
              >
                {isGeneratingCaption ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>Sesuaikan Caption AI</span>
              </button>
            </div>

            <textarea
              value={displayCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              className="w-full h-[110px] p-3.5 bg-slate-950 border border-slate-850 focus:border-indigo-500/60 rounded-xl text-xs font-sans text-slate-300 focus:outline-none leading-relaxed resize-none"
              placeholder="Tulis deskripsi atau gunakan AI untuk membuat caption..."
            />
          </div>

          {/* Action Choice: Upload Now OR Scheduler Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            
            {/* Direct Upload Card Button */}
            <div className="bg-slate-950/40 border border-slate-850/80 p-3 rounded-xl space-y-3 flex flex-col justify-between">
              <div>
                <h5 className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Metode 1: Direct Upload API
                </h5>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">
                  Ekspor instan dan langsung terbitkan ke akun {platform.toUpperCase()} terhubung.
                </p>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <button
                  onClick={handleDirectUploadAndSync}
                  disabled={isCompiling || isUploading || clipDuration > 30}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all ${
                    clipDuration > 30
                      ? "bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:scale-[1.01]"
                  }`}
                  type="button"
                >
                  {isCompiling || isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  <span>Direct Upload & Sync</span>
                </button>

                <button
                  onClick={handleJustDownload}
                  disabled={isCompiling || isUploading || clipDuration > 30}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 border transition-all ${
                    clipDuration > 30
                      ? "bg-slate-800/40 text-slate-600 border-slate-850 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-850 text-indigo-400 border-slate-800 hover:border-slate-750 hover:scale-[1.01]"
                  }`}
                  type="button"
                >
                  {isCompiling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Ekspor & Unduh MP4</span>
                </button>
              </div>
            </div>

            {/* Post Scheduling Form */}
            <form onSubmit={handleSchedulePost} className="bg-slate-950/40 border border-slate-850/80 p-3 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <h5 className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Metode 2: Jadwalkan Posting
                </h5>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">
                  Pilih waktu postingan ideal Anda untuk performa viral maksimal.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-lg p-1 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-lg p-1 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={clipDuration > 30}
                className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] bg-amber-600 hover:bg-amber-500 text-white shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 ${
                  clipDuration > 30 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Simpan di Jadwal</span>
              </button>
            </form>

          </div>

          {clipDuration > 30 && (
            <p className="text-[10px] text-red-400 text-center font-medium animate-pulse">
              * Durasi klip melebihi batas maksimal 30 detik. Sesuaikan pemotong Anda!
            </p>
          )}

        </div>

        {/* Right Column (5 cols): Interactive Smartphone Feed Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            Pratinjau Umpan Seluler
          </span>

          <div className="w-[230px] h-[390px] bg-black rounded-[36px] border-[6px] border-slate-800 relative shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-black rounded-full z-20"></div>

            {/* Video preview simulation (using cover positioning) */}
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
              <video
                src={`${currentClip.url}#t=${trimRange.start},${trimRange.end}`}
                className="w-full h-full object-cover opacity-85"
                muted
                autoPlay
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none"></div>
            </div>

            {/* Overlay Platform Elements */}
            {/* Top Bar */}
            <div className="relative z-10 p-4 pt-5 flex justify-between items-center text-[9px] text-white/80 font-semibold">
              <span>09:41</span>
              <div className="flex gap-1.5">
                <span className="bg-white/20 px-1 py-0.5 rounded">HD</span>
                <span>Live</span>
              </div>
            </div>

            {/* Side interaction elements */}
            <div className="relative z-10 self-end pr-3 pb-20 flex flex-col items-center gap-3 text-white">
              {/* Profile */}
              <div className="w-7 h-7 rounded-full border border-white bg-slate-700 overflow-hidden">
                <img 
                  src={connections[platform].connected ? connections[platform].profilePic : details.profilePic} 
                  alt="profile" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Likes */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="p-1.5 bg-black/40 rounded-full backdrop-blur-sm">
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                </div>
                <span className="text-[8px] font-bold shadow-sm">{details.likes}</span>
              </div>

              {/* Comments */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="p-1.5 bg-black/40 rounded-full backdrop-blur-sm">
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-black" />
                </div>
                <span className="text-[8px] font-bold shadow-sm">{details.comments}</span>
              </div>

              {/* Shares */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="p-1.5 bg-black/40 rounded-full backdrop-blur-sm">
                  <Send className="w-3.5 h-3.5 fill-white text-black" />
                </div>
                <span className="text-[8px] font-bold shadow-sm">{details.shares}</span>
              </div>
            </div>

            {/* Bottom Details (User/Caption Overlay) */}
            <div className="relative z-10 p-3 pb-5 text-white space-y-1 max-w-[85%]">
              <h5 className="font-bold text-[10px] flex items-center gap-1.5">
                @{connections[platform].connected ? connections[platform].username : details.username}
                {connections[platform].connected && (
                  <span className="bg-indigo-500 text-[6px] px-1 py-0.1 rounded uppercase font-bold">API ACTIVE</span>
                )}
              </h5>
              
              <p className="text-[8px] leading-relaxed line-clamp-2 text-slate-100 font-sans">
                {displayCaption}
              </p>

              <div className="flex items-center gap-1 text-[7px] text-slate-300">
                <Music className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "6s" }} />
                <span className="truncate">{details.soundName}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Render/Export Compilation Loader */}
      {isCompiling && (
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Menyusun klip video di browser...
            </span>
            <span className="font-mono text-indigo-400 font-bold">{compileProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all"
              style={{ width: `${compileProgress}%` }}
            ></div>
          </div>
          <p className="text-[9px] text-slate-500">
            Cliperan menggunakan rendering canvas berkecepatan tinggi untuk merender klip Anda tanpa perlu server backend eksternal.
          </p>
        </div>
      )}

      {/* Direct Social Media Upload Logger */}
      {isUploading && (
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              Mengupload postingan langsung ke API {platform.toUpperCase()}...
            </span>
            <span className="font-mono text-amber-400 font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Sync Success logs */}
      {syncLogs.length > 0 && (
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2 font-mono text-[10px]">
          <h5 className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Status Sinkronisasi API</h5>
          {syncLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 text-slate-300">
              <span className="text-emerald-400">✓</span>
              <span>{log}</span>
            </div>
          ))}
          
          {isSynced && (
            <div className="pt-3 border-t border-slate-900 mt-2 flex flex-col md:flex-row items-center justify-between gap-3 bg-emerald-950/20 p-3 rounded-lg border-emerald-900/30">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[11px] font-bold">Sukses Dipublikasikan langsung ke @{connections[platform].username}!</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-400">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Video MP4 berhasil dipotong dan siap ditonton publik!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agenda/List of Scheduled Posts Section */}
      <div className="border-t border-slate-850 pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-slate-200 text-xs md:text-sm">Jadwal Kalender Konten ({scheduledPosts.length})</h4>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Auto-Publisher Aktif</span>
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-xl p-5 text-center text-slate-500">
            <Clock className="w-6 h-6 mx-auto text-slate-600 mb-1.5" />
            <p className="text-xs font-semibold text-slate-400">Belum Ada Postingan Terjadwal</p>
            <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-0.5">
              Tentukan tanggal & jam di atas untuk mengatur antrean auto-posting media sosial.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
            {scheduledPosts.map((post) => {
              const platIcon = post.platform === "tiktok" ? "🎵" : post.platform === "instagram" ? "📸" : "🔴";
              const isPlatConnected = connections[post.platform].connected;
              
              return (
                <div 
                  key={post.id} 
                  className={`p-3 border rounded-xl flex flex-col justify-between gap-2 transition-all ${
                    post.status === "published" 
                      ? "bg-emerald-950/15 border-emerald-900/30" 
                      : "bg-slate-950/50 border-slate-850 hover:bg-slate-950"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{platIcon}</span>
                        <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">{post.platform}</span>
                      </div>
                      
                      {post.status === "published" ? (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Published
                        </span>
                      ) : (
                        <span className="bg-amber-950 text-amber-400 border border-amber-900/50 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "4s" }} />
                          Pending
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{formatScheduleTime(post.scheduledTime)}</span>
                    </p>

                    <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-[8px] text-slate-500 truncate max-w-[100px]">
                      📂 {post.clipName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {post.status === "scheduled" && (
                        <>
                          <button
                            onClick={() => handlePublishNow(post)}
                            className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded"
                            title="Publish Sekarang Langsung ke API"
                            type="button"
                          >
                            Post Now
                          </button>
                          <button
                            onClick={() => handleCancelScheduled(post.id)}
                            className="p-1 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded"
                            title="Hapus"
                            type="button"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      
                      {post.status === "published" && (
                        <button
                          onClick={() => handleCancelScheduled(post.id)}
                          className="p-1 text-slate-500 hover:text-slate-300"
                          title="Hapus Catatan"
                          type="button"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulated OAuth Modal Backdrop */}
      {showConnectModal && connectingPlatform && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl relative">
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-indigo-950 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-xl shadow">
                🔑
              </div>
              <h4 className="font-bold text-slate-100 text-sm md:text-base">Hubungkan Akun {connectingPlatform.toUpperCase()}</h4>
              <p className="text-xs text-slate-400">Gunakan OAuth berkeamanan tinggi untuk upload langsung</p>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Username Anda</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="nama_pengguna"
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-750 focus:border-indigo-500 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-200 focus:outline-none"
                    disabled={isAuthenticating}
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-start gap-2.5 text-[9px] text-slate-400 leading-relaxed">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Cliperan menggunakan integrasi resmi Sandbox API. Kami tidak pernah melihat atau menyimpan kata sandi pribadi Anda.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectModal(false);
                    setConnectingPlatform(null);
                  }}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-xl transition-all"
                  disabled={isAuthenticating}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengaitkan...</span>
                    </>
                  ) : (
                    <span>Lanjut Hubungkan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
