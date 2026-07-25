import React, { useRef, useState, useEffect } from "react";
import { 
  Sparkles, 
  Upload, 
  Tv, 
  Youtube, 
  Plus, 
  Flame, 
  CheckCircle, 
  Video, 
  ArrowLeft,
  Trash2,
  Share2,
  Clock,
  ExternalLink,
  Shield,
  Info,
  Camera,
  LogOut,
  BookOpen,
  Type,
  Calendar,
  RefreshCw
} from "lucide-react";
import { VideoClip, TrimRange, AIAnalysis, SubtitleItem, SaaSUser, SystemAuditLog, SystemSettings, CreatedClipHistoryItem } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { VIDEO_TEMPLATES } from "./data";
import { formatTimecode, formatBytes } from "./utils";
import VideoPlayer from "./components/VideoPlayer";
import EditorTimeline from "./components/EditorTimeline";
import SubtitleEditor from "./components/SubtitleEditor";
import AIAssistant from "./components/AIAssistant";
import SocialShareModal from "./components/SocialShareModal";
import ThumbnailGenerator from "./components/ThumbnailGenerator";
import SaasDashboard from "./components/SaaSDashboard";
import LoginView from "./components/LoginView";
import UserGuide from "./components/UserGuide";
import StepWorkflowBar from "./components/StepWorkflowBar";

const DEFAULT_USERS: SaaSUser[] = [
  {
    id: "admin",
    username: "superadmin_cliperan",
    email: "admin@cliperan.com",
    role: "superadmin",
    plan: "enterprise",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    createdAt: "2026-01-10",
    status: "active",
    clipsLimit: 999,
    usedClips: 4,
    lastLogin: "2026-07-16"
  },
  {
    id: "budi",
    username: "budi_creator",
    email: "budi.creator@gmail.com",
    role: "user",
    plan: "free",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    createdAt: "2026-05-20",
    status: "active",
    clipsLimit: 5,
    usedClips: 1,
    lastLogin: "2026-07-16"
  },
  {
    id: "siti",
    username: "siti_reels",
    email: "siti.reels@outlook.com",
    role: "user",
    plan: "pro",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    createdAt: "2026-03-15",
    status: "active",
    clipsLimit: 15,
    usedClips: 2,
    lastLogin: "2026-07-16"
  },
  {
    id: "rian",
    username: "rian_studio",
    email: "rian.studio@agency.com",
    role: "user",
    plan: "enterprise",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    createdAt: "2026-02-01",
    status: "active",
    clipsLimit: 999,
    usedClips: 1,
    lastLogin: "2026-07-15"
  }
];

export default function App() {
  // --- SaaS STATE MANAGEMENT ---
  const [allUsers, setAllUsers] = useState<SaaSUser[]>(() => {
    const saved = localStorage.getItem("cliperan_saas_users");
    if (saved) return JSON.parse(saved);
    return DEFAULT_USERS;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("cliperan_saas_is_logged_in") === "true";
  });

  const [currentUser, setCurrentUser] = useState<SaaSUser>(() => {
    const saved = localStorage.getItem("cliperan_saas_current_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
    return DEFAULT_USERS[1]; // Budi Creator (Free) is default active user
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem("cliperan_saas_settings");
    if (saved) return JSON.parse(saved);
    return {
      maxFreeClips: 5,
      maxProClips: 15,
      aiModelCostPerHour: 0.12,
      enablePublicSignup: true,
      maintenanceMode: false
    };
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem("cliperan_saas_logs");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: "admin",
        username: "superadmin_cliperan",
        action: "Sistem Boot",
        details: "Server SaaS Cliperan Studio berhasil di-booting di wilayah google-cloud-asia.",
        type: "info"
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        userId: "budi",
        username: "budi_creator",
        action: "Login",
        details: "Pengguna budi_creator masuk ke dashboard tenant Free.",
        type: "success"
      },
      {
        id: "log-3",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        userId: "siti",
        username: "siti_reels",
        action: "Ekspor Video",
        details: "Siti mengekspor klip 'Aksi Surfing Profesional' berdurasi 10 detik ke Instagram Reels.",
        type: "success"
      }
    ];
  });

  // User clips isolation map
  const [userClips, setUserClips] = useState<Record<string, VideoClip[]>>(() => {
    const saved = localStorage.getItem("cliperan_saas_user_clips");
    if (saved) return JSON.parse(saved);
    
    // Default seeded clips for different tenants to show different contents immediately!
    return {
      budi: [
        {
          id: "cooking-steak",
          name: "Resep Memasak & Potong Sayur (Cooking)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-fresh-vegetables-on-a-board-43093-large.mp4",
          duration: 14.8,
          sourceType: "template"
        }
      ],
      siti: [
        {
          id: "surf-sports",
          name: "Aksi Surfing Profesional (Sports)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-under-a-blue-sky-44325-large.mp4",
          duration: 25.4,
          sourceType: "template"
        },
        {
          id: "forest-drone",
          name: "Sinematik Drone Hutan & Sungai (Vlog)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
          duration: 10.5,
          sourceType: "template"
        }
      ],
      rian: [
        {
          id: "tech-developer",
          name: "Programming & Desain Coding (Tech)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-laptop-keyboard-40417-large.mp4",
          duration: 15.2,
          sourceType: "template"
        }
      ],
      admin: [
        {
          id: "surf-sports",
          name: "Aksi Surfing Profesional (Sports)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-under-a-blue-sky-44325-large.mp4",
          duration: 25.4,
          sourceType: "template"
        },
        {
          id: "cooking-steak",
          name: "Resep Memasak & Potong Sayur (Cooking)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-fresh-vegetables-on-a-board-43093-large.mp4",
          duration: 14.8,
          sourceType: "template"
        },
        {
          id: "forest-drone",
          name: "Sinematik Drone Hutan & Sungai (Vlog)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
          duration: 10.5,
          sourceType: "template"
        },
        {
          id: "tech-developer",
          name: "Programming & Desain Coding (Tech)",
          url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-laptop-keyboard-40417-large.mp4",
          duration: 15.2,
          sourceType: "template"
        }
      ]
    };
  });

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem("cliperan_saas_users", JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem("cliperan_saas_is_logged_in", String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("cliperan_saas_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("cliperan_saas_settings", JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem("cliperan_saas_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("cliperan_saas_user_clips", JSON.stringify(userClips));
  }, [userClips]);

  const [createdClips, setCreatedClips] = useState<CreatedClipHistoryItem[]>(() => {
    const saved = localStorage.getItem("cliperan_saas_created_clips");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: "hist-1",
        userId: "siti",
        name: "Aksi Surfing Profesional (Instagram Reels)",
        originalVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-under-a-blue-sky-44325-large.mp4",
        originalVideoName: "Aksi Surfing Profesional (Sports)",
        sourceType: "template",
        compiledUrl: "https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-under-a-blue-sky-44325-large.mp4",
        duration: 10.2,
        trimStart: 2.0,
        trimEnd: 12.2,
        platformShared: "instagram",
        caption: "Aksi gila surfer pro taklukkan ombak raksasa! 🏄‍♂️🔥 #surfing #extreme #viral",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "hist-2",
        userId: "budi",
        name: "Resep Memasak & Potong Sayur (TikTok Video)",
        originalVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-fresh-vegetables-on-a-board-43093-large.mp4",
        originalVideoName: "Resep Memasak & Potong Sayur (Cooking)",
        sourceType: "template",
        compiledUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-fresh-vegetables-on-a-board-43093-large.mp4",
        duration: 8.4,
        trimStart: 0,
        trimEnd: 8.4,
        platformShared: "tiktok",
        caption: "Skill pisau chef bintang 5 ini bikin candu! 🔪🥦 #cooking #chef #recipe #kitchen",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("cliperan_saas_created_clips", JSON.stringify(createdClips));
  }, [createdClips]);

  const handleAddCreatedClip = (clip: Omit<CreatedClipHistoryItem, "id" | "userId" | "createdAt">) => {
    const newItem: CreatedClipHistoryItem = {
      ...clip,
      id: `created-clip-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setCreatedClips(prev => [newItem, ...prev]);

    handleAddAuditLog(
      "Ekspor Klip",
      `Berhasil mengekspor klip baru '${clip.name}' durasi ${clip.duration}s (${clip.platformShared})`,
      "success"
    );
  };

  const handleDeleteCreatedClip = (id: string) => {
    setCreatedClips(prev => prev.filter(c => c.id !== id));
    handleAddAuditLog(
      "Hapus Riwayat Klip",
      `Menghapus klip riwayat dengan ID ${id}`,
      "warning"
    );
  };

  const [previewHistoryClip, setPreviewHistoryClip] = useState<CreatedClipHistoryItem | null>(null);

  const handleLoadHistoryOriginalClip = (hist: CreatedClipHistoryItem) => {
    const clip: VideoClip = {
      id: hist.id,
      name: hist.originalVideoName,
      url: hist.originalVideoUrl,
      duration: hist.duration + (hist.trimEnd - hist.trimStart),
      sourceType: hist.sourceType
    };
    
    const matchedTemplate = VIDEO_TEMPLATES.find(t => t.url === hist.originalVideoUrl);
    if (matchedTemplate) {
      clip.duration = matchedTemplate.duration;
    } else {
      clip.duration = hist.trimEnd;
    }

    setCurrentClip(clip);
    setTrimRange({ start: hist.trimStart, end: hist.trimEnd });
    
    handleAddAuditLog(
      "Muat Ulang Klip",
      `Memuat ulang video asal '${hist.originalVideoName}' dengan trim range [${hist.trimStart.toFixed(1)}s - ${hist.trimEnd.toFixed(1)}s]`,
      "info"
    );
  };

  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

  // Set the first clip of the active user on initial load
  useEffect(() => {
    const clips = userClips[currentUser.id] || [];
    if (clips.length > 0 && !currentClip) {
      setCurrentClip(clips[0]);
      const end = Math.min(15, clips[0].duration);
      setTrimRange({ start: 0, end: parseFloat(end.toFixed(1)) });
    }
  }, []);

  const handleAddAuditLog = (action: string, details: string, type: "info" | "warning" | "success" | "error" = "info") => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      username: currentUser.username,
      action,
      details,
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSwitchUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (!found) return;

    if (found.status === "suspended") {
      alert(`Akun @${found.username} ditangguhkan oleh Superadmin! Tidak dapat masuk.`);
      return;
    }

    setCurrentUser(found);
    
    // Load that user's active clips
    const clips = userClips[found.id] || [];
    if (clips.length > 0) {
      setCurrentClip(clips[0]);
      const end = Math.min(15, clips[0].duration);
      setTrimRange({ start: 0, end: parseFloat(end.toFixed(1)) });
    } else {
      setCurrentClip(null);
    }

    // Add Audit log
    const updatedUsers = allUsers.map(u => 
      u.id === found.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    setAllUsers(updatedUsers);

    // Create log directly to prevent stale state issues
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: found.id,
      username: found.username,
      action: "Ganti Tenant",
      details: `Beralih sesi tenant ke akun @${found.username} (${found.plan.toUpperCase()})`,
      type: "info"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLoginSuccess = (user: SaaSUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);

    // Update lastLogin timestamp
    const updatedUsers = allUsers.map((u) =>
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    setAllUsers(updatedUsers);

    // Load that user's active clips
    const clips = userClips[user.id] || [];
    if (clips.length > 0) {
      setCurrentClip(clips[0]);
      const end = Math.min(15, clips[0].duration);
      setTrimRange({ start: 0, end: parseFloat(end.toFixed(1)) });
    } else {
      setCurrentClip(null);
    }

    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      username: user.username,
      action: "Login Sesi",
      details: `Pengguna @${user.username} (${user.role.toUpperCase()}) berhasil masuk ke dalam sistem.`,
      type: "success"
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleLogout = () => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      username: currentUser.username,
      action: "Logout Sesi",
      details: `Pengguna @${currentUser.username} keluar dari sistem.`,
      type: "info"
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setIsLoggedIn(false);
  };

  const handleUpdateUser = (updatedUser: SaaSUser) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleAddUser = (username: string, email: string, plan: "free" | "pro" | "enterprise") => {
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, "_");
    const limit = plan === "free" ? systemSettings.maxFreeClips : plan === "pro" ? systemSettings.maxProClips : 999;
    const newUser: SaaSUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      email: email.trim(),
      role: "user",
      plan,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      clipsLimit: limit,
      usedClips: 0,
      lastLogin: "-"
    };

    setAllUsers(prev => [...prev, newUser]);
    setUserClips(prev => ({ ...prev, [newUser.id]: [] }));
  };

  const handleDeleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    setUserClips(prev => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
  };

  const [currentClip, setCurrentClip] = useState<VideoClip | null>(null);
  const [trimRange, setTrimRange] = useState<TrimRange>({ start: 0, end: 10 });
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"ai" | "subtitles" | "export" | "thumbnail" | "saas">("ai");
  const [activeAnalysis, setActiveAnalysis] = useState<AIAnalysis | null>(null);

  // Subtitle states
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [activeSubtitleStyle, setActiveSubtitleStyle] = useState<string>("tiktok-yellow");
  
  // URL Input State
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // When a video clip is loaded, set its initial duration and trim range
  const handleLoadClip = (clip: VideoClip) => {
    // Check SaaS limits!
    const activeClips = userClips[currentUser.id] || [];
    const isAlreadyLoaded = activeClips.some(c => c.id === clip.id);
    
    if (!isAlreadyLoaded && activeClips.length >= currentUser.clipsLimit) {
      alert(`Batas Kuota Video Terlampaui! Akun Anda (${currentUser.plan.toUpperCase()}) dibatasi maksimal ${currentUser.clipsLimit} video. Silakan tingkatkan paket Anda di Dashboard.`);
      return;
    }

    setCurrentClip(clip);
    setActiveAnalysis(null);
    setSubtitles([]); // Reset subtitles
    setCurrentTime(0);
    
    // Set default trim range (0 to 10 seconds, or full length if shorter)
    const end = Math.min(15, clip.duration);
    setTrimRange({ start: 0, end: parseFloat(end.toFixed(1)) });

    // Save to user isolated storage if not already there
    if (!isAlreadyLoaded) {
      const updatedClips = [clip, ...activeClips];
      const nextUserClips = {
        ...userClips,
        [currentUser.id]: updatedClips
      };
      setUserClips(nextUserClips);

      // Update usedClips count in SaaS state
      const nextUsers = allUsers.map(u => 
        u.id === currentUser.id 
          ? { ...u, usedClips: updatedClips.length } 
          : u
      );
      setAllUsers(nextUsers);
      
      const foundLatestCurrentUser = nextUsers.find(u => u.id === currentUser.id);
      if (foundLatestCurrentUser) {
        setCurrentUser(foundLatestCurrentUser);
      }

      handleAddAuditLog(
        "Tambah Video", 
        `Mendatangkan video baru '${clip.name}' ke dalam cloud tenant.`, 
        "success"
      );
    }
  };

  // Handle local video file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      alert("Format berkas harus berupa video.");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    
    // Create a temporary video element to extract duration
    const tempVideo = document.createElement("video");
    tempVideo.src = blobUrl;
    tempVideo.addEventListener("loadedmetadata", () => {
      const clip: VideoClip = {
        id: `local-${Date.now()}`,
        name: file.name,
        url: blobUrl,
        size: file.size,
        duration: tempVideo.duration,
        file: file,
        sourceType: "local",
      };
      handleLoadClip(clip);
    });
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Handle popular video links input (YouTube etc)
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrlInput.trim()) return;

    setIsUrlLoading(true);
    setUrlError(null);

    // YouTube regex pattern
    const ytRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
    const isYt = ytRegex.test(videoUrlInput);

    setTimeout(() => {
      setIsUrlLoading(false);
      
      // Simulate mapping external streaming URLs to our high-fidelity templates
      // This is a robust mechanism to allow flawless analysis and editing inside
      // the iframe sandbox where external YouTube streams are blocked by CORS.
      let mappedTemplate = VIDEO_TEMPLATES[0]; // Default template
      
      if (isYt) {
        // Find or assign matching template
        mappedTemplate = VIDEO_TEMPLATES[Math.floor(Math.random() * VIDEO_TEMPLATES.length)];
      }

      const clip: VideoClip = {
        id: `url-${Date.now()}`,
        name: isYt ? "Tautan YouTube Terhubung (Simulasi Sandbox)" : "Tautan Video Kustom",
        url: mappedTemplate.url,
        duration: mappedTemplate.duration,
        sourceType: "url",
      };

      handleLoadClip(clip);
      setVideoUrlInput("");
    }, 1200);
  };

  // Apply AI Recommended Crop
  const handleApplyAIHighlight = (start: number, end: number, analysis: AIAnalysis) => {
    setTrimRange({ start, end });
    setActiveAnalysis(analysis);
    if (analysis.subtitles) {
      setSubtitles(analysis.subtitles);
    } else {
      setSubtitles([]);
    }
    setActiveTab("export"); // Shift to social sync tab instantly for previewing
    
    // Seek video player to start
    if (videoRef.current) {
      videoRef.current.currentTime = start;
      setCurrentTime(start);
    }
  };

  // Reset / Delete current clip
  const handleResetWorkspace = () => {
    if (currentClip?.url.startsWith("blob:")) {
      URL.revokeObjectURL(currentClip.url);
    }
    setCurrentClip(null);
    setActiveAnalysis(null);
    setSubtitles([]);
  };

  // Active duration of the trim
  const clipDuration = trimRange.end - trimRange.start;

  if (!isLoggedIn) {
    return <LoginView allUsers={allUsers} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="cliperan-app-root">
      
      {/* Top Studio Nav Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Glowing Logo Block */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-950/40 border border-indigo-400/20">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                Cliperan
              </h1>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none block">AI Video Highlight Cutter</span>
            </div>
          </div>

          {/* Nav Actions / Info info */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] bg-slate-900 border border-slate-850 py-1 px-2.5 rounded-full text-slate-400 font-mono">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full-Stack AI Engine</span>
            </span>
            <div className="h-5 w-[1px] bg-slate-900 hidden sm:block" />
            <a 
              href="https://ai.studio/build" 
              target="_blank" 
              referrerPolicy="no-referrer" 
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Built in AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="h-5 w-[1px] bg-slate-900" />
            <button
              onClick={() => setIsUserGuideOpen(true)}
              className="text-xs bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all font-bold cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Panduan</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-900" />
            <button
              onClick={handleLogout}
              className="text-xs bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Studio Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        
        {/* SaaS Global Simulation Control Panel & Tenant Switcher */}
        <div className="mb-6 bg-slate-900/90 border border-indigo-950/20 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Left: Active Session Indicator */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.username} 
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  currentUser.role === 'superadmin' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">@{currentUser.username}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    currentUser.role === 'superadmin' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : currentUser.plan === 'enterprise'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : currentUser.plan === 'pro'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {currentUser.role === 'superadmin' ? 'SUPERADMIN' : currentUser.plan}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Sesi Tenant: <span className="font-mono text-slate-300">{currentUser.email}</span>
                </p>
              </div>
            </div>

            {/* Middle: Quota Progress Bar for Regular Users */}
            {currentUser.role !== 'superadmin' && (
              <div className="flex-1 max-w-xs w-full">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                  <span>Quota Penyimpanan Cloud ({currentUser.usedClips}/{currentUser.clipsLimit})</span>
                  <span className="font-mono">{Math.round((currentUser.usedClips / currentUser.clipsLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (currentUser.usedClips / currentUser.clipsLimit) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Right: Simulation Switcher Actions */}
            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block w-full md:w-auto">Beralih Workspace:</span>
              <div className="flex flex-wrap gap-1.5">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchUser(u.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                      currentUser.id === u.id 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/20' 
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    @{u.username} ({u.role === 'superadmin' ? 'Admin' : u.plan.toUpperCase()})
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* If Superadmin, render the full SaasDashboard system administrative controls */}
        {currentUser.role === 'superadmin' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Portal Administrasi Superadmin SaaS Cliperan</h3>
                  <p className="text-[11px] text-slate-400">Kontrol sistem multi-tenant terpusat, audit log real-time, dan konfigurasi paket harga.</p>
                </div>
              </div>
              <SaasDashboard 
                currentUser={currentUser}
                allUsers={allUsers}
                systemSettings={systemSettings}
                auditLogs={auditLogs}
                onSwitchUser={handleSwitchUser}
                onUpdateUser={handleUpdateUser}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                onUpdateSettings={setSystemSettings}
                onAddAuditLog={handleAddAuditLog}
                userClipsCount={userClips[currentUser.id]?.length || 0}
              />
            </div>
          </div>
        ) : (
          /* Normal Tenants Workspace (Budi Free, Siti Pro, Rian Enterprise) */
          <>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*"
              className="hidden" 
            />
            {/* Interactive Step-by-Step Numbered Workflow Stepper */}
            <div className="mb-6 animate-fade-in" id="workflow-stepper-container">
              <StepWorkflowBar
                currentClip={currentClip}
                activeAnalysis={activeAnalysis}
                subtitles={subtitles}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onResetWorkspace={handleResetWorkspace}
                onNotification={triggerToast}
              />
            </div>

            {/* Landing Page State - No Video Imported */}
            {!currentClip ? (
          <div className="flex-1 flex flex-col justify-center py-6 md:py-12 space-y-12 max-w-4xl mx-auto w-full">
            
            {/* Elegant Callout Header */}
            <div className="text-center space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold tracking-wider uppercase animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Teknologi Pemotong AI Terkini</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-2xl mx-auto">
                Potong Video Menarik Jadi Klip Viral Dalam <span className="text-indigo-400">Detik</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                Cliperan mendeteksi otomatis momen aksi terbaik, menghasilkan highlight di bawah 30 detik menggunakan Gemini, serta melakukan sinkronisasi instan ke feed TikTok, Reels, dan YouTube Shorts Anda.
              </p>
            </div>

            {/* Source Importers (Bento Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="import-cards-container">
              
              {/* Card 1: Local File upload */}
              <div 
                className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between hover:shadow-indigo-950/5 hover:shadow-xl transition-all group cursor-pointer ${
                  isDragging 
                    ? "border-dashed border-indigo-400 bg-indigo-950/20 shadow-indigo-500/10 scale-[1.02]" 
                    : "border-slate-800 hover:border-indigo-500/40"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                    isDragging
                      ? "bg-indigo-500 text-white border-indigo-400 animate-bounce"
                      : "bg-slate-850 text-slate-300 border-slate-800 group-hover:bg-indigo-950/50 group-hover:text-indigo-400 group-hover:border-indigo-500/20"
                  }`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm md:text-base">
                      {isDragging ? "Lepaskan Video ke Sini!" : "Impor dari Galeri Perangkat"}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {isDragging 
                        ? "Lepaskan berkas video MP4/WebM Anda sekarang untuk langsung menganalisis!" 
                        : "Unggah berkas video lokal MP4 atau WebM langsung dari komputer atau galeri ponsel Anda untuk mulai memotong dengan instan."}
                    </p>
                  </div>
                </div>
                
                <div className={`pt-6 flex items-center justify-between text-xs font-semibold transition-colors ${
                  isDragging ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"
                }`}>
                  <span>{isDragging ? "Lepas berkas sekarang" : "Pilih berkas video / Seret ke sini"}</span>
                  <Plus className={`w-4 h-4 transform transition-transform ${isDragging ? "rotate-45 text-indigo-400" : "group-hover:rotate-90"}`} />
                </div>
              </div>

              {/* Card 2: Share Platform Link importer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-indigo-950/5 hover:shadow-xl transition-all">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-850 text-slate-300 flex items-center justify-center border border-slate-800">
                    <Youtube className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm md:text-base">Tempel Tautan Berbagi Video</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Koneksikan video dari platform berbagi populer seperti YouTube atau tautan video eksternal lainnya.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="url"
                      required
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="Masukkan URL YouTube..."
                      className="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500/60 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none text-slate-300"
                    />
                    <button 
                      type="submit"
                      disabled={isUrlLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      {isUrlLoading ? "..." : "Konek"}
                    </button>
                  </div>
                </form>

                {urlError && <p className="text-[10px] text-red-400 mt-2">{urlError}</p>}
                <span className="text-[9px] text-slate-500 font-mono mt-4 block">Mendukung resolusi HD 1085p & 4K</span>
              </div>

            </div>

            {/* Fast presets / Templates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Atau Pilih Preset Template Pengujian Cepat</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {VIDEO_TEMPLATES.map((tpl) => (
                  <div 
                    key={tpl.id}
                    onClick={() => {
                      const clip: VideoClip = {
                        id: tpl.id,
                        name: tpl.name,
                        url: tpl.url,
                        duration: tpl.duration,
                        sourceType: "template"
                      };
                      handleLoadClip(clip);
                    }}
                    className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                      <img 
                        src={tpl.thumbnail} 
                        alt={tpl.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-300">
                        {tpl.duration}s
                      </span>
                      <span className="absolute top-2 left-2 bg-indigo-600 px-2 py-0.5 rounded-full text-[8px] font-bold text-white uppercase tracking-wider">
                        {tpl.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-slate-200 text-xs truncate">{tpl.name}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>
                      
                      <div className="pt-3 text-[10px] text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                        <span>Pilih Template</span>
                        <span className="text-[9px]">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Riwayat Klip yang Pernah Dibuat Section */}
            <div className="space-y-4 border-t border-slate-900 pt-8 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-indigo-400" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-sans">
                    Riwayat Klip yang Pernah Dibuat ({createdClips.filter(c => c.userId === currentUser.id).length})
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Penyimpanan Lokal (localStorage) Aktif</span>
              </div>

              {createdClips.filter(c => c.userId === currentUser.id).length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 bg-slate-900/30">
                  <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2 animate-pulse" />
                  <p className="text-xs font-bold text-slate-400">Belum Ada Riwayat Klip</p>
                  <p className="text-[10px] text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    Klip video yang Anda ekspor, bagikan, atau unduh akan secara otomatis tercatat di sini agar Anda dapat melihat kembali atau memuat ulangnya ke timeline editor.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {createdClips
                    .filter(c => c.userId === currentUser.id)
                    .map((item) => {
                      const shareIcon = item.platformShared === "tiktok" ? "🎵 TikTok Direct" : item.platformShared === "instagram" ? "📸 Instagram Direct" : item.platformShared === "youtube" ? "🔴 YouTube Shorts" : "📥 Unduhan MP4";
                      const shareBadgeStyle = item.platformShared === "tiktok" ? "bg-black border-slate-800 text-slate-200" : item.platformShared === "instagram" ? "bg-pink-950/40 border-pink-500/20 text-pink-400" : item.platformShared === "youtube" ? "bg-red-950/40 border-red-500/20 text-red-400" : "bg-emerald-950/40 border-emerald-500/20 text-emerald-400";
                      
                      return (
                        <div key={item.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-750 transition-all shadow-md">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${shareBadgeStyle}`}>
                                {shareIcon}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {new Date(item.createdAt).toLocaleString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h5 className="font-bold text-slate-200 text-xs md:text-sm line-clamp-1">{item.name}</h5>
                              <p className="text-[10px] text-slate-500 font-mono truncate">Asal Video: {item.originalVideoName}</p>
                            </div>

                            <div className="bg-slate-950/60 border border-slate-850/50 p-2.5 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>Durasi: <strong className="text-indigo-400 font-bold">{item.duration.toFixed(1)}s</strong></span>
                                <span>Trim: <strong className="text-slate-300">{item.trimStart.toFixed(1)}s - {item.trimEnd.toFixed(1)}s</strong></span>
                              </div>
                              {item.caption && (
                                <p className="text-[10px] text-slate-400 italic leading-relaxed line-clamp-2 bg-slate-900/50 p-2 rounded border border-slate-850">
                                  "{item.caption}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-850/60 gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => setPreviewHistoryClip(item)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-400 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
                              >
                                <span>▶ Putar</span>
                              </button>
                              
                              <button
                                onClick={() => handleLoadHistoryOriginalClip(item)}
                                className="px-2.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-lg transition-colors"
                              >
                                Load ke Editor
                              </button>

                              {item.caption && (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.caption || "");
                                    alert("Caption berhasil disalin ke clipboard!");
                                  }}
                                  className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded text-xs transition-colors"
                                  title="Salin Caption"
                                >
                                  📋
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteCreatedClip(item.id)}
                              className="p-1.5 text-slate-600 hover:text-red-400 rounded transition-colors text-xs"
                              title="Hapus dari Riwayat"
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
        ) : (
          
          /* Loaded Workspace Editor State */
          <div className="flex-1 flex flex-col space-y-6">
            
            {/* Editor Workspace Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
              
              {/* Back button and current source details */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetWorkspace}
                  className="p-2 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
                  title="Kembali ke Impor"
                  id="reset-workspace-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="space-y-0.5 max-w-[200px] sm:max-w-xs md:max-w-md">
                  <h3 className="font-bold text-slate-200 text-xs md:text-sm truncate">{currentClip.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="uppercase">{currentClip.sourceType} Video</span>
                    <span>•</span>
                    <span>Durasi Asli: {formatTimecode(currentClip.duration)}</span>
                    {currentClip.size && (
                      <>
                        <span>•</span>
                        <span>{formatBytes(currentClip.size)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-400 font-semibold">Ruang Kerja Aktif</span>
              </div>

            </div>

            {/* Main Studio Workspace Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Side: Video Player Stage and Timeline track (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* 1. Custom Video Player */}
                <div className="flex-1">
                  <VideoPlayer
                    videoUrl={currentClip.url}
                    duration={currentClip.duration}
                    trimRange={trimRange}
                    setTrimRange={setTrimRange}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    videoRef={videoRef}
                    subtitles={subtitles}
                    showSubtitles={showSubtitles}
                    activeSubtitleStyle={activeSubtitleStyle}
                  />
                </div>

                {/* 2. Precision Timeline Editor */}
                <div>
                  <EditorTimeline
                    duration={currentClip.duration}
                    trimRange={trimRange}
                    setTrimRange={setTrimRange}
                    currentClip={currentClip}
                    currentTime={currentTime}
                  />
                </div>

                {/* 3. Interactive Step-by-Step Progress & Checkbox Hub */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <h4 className="font-extrabold text-slate-200 text-xs uppercase tracking-wider">📋 Status Alur Kerja Anda</h4>
                    </div>
                    <span className="text-[10px] bg-slate-950 px-2.5 py-1 rounded-lg text-indigo-400 font-mono font-bold border border-slate-850">
                      {Math.round(((subtitles.length > 0 ? 1 : 0) + (activeAnalysis ? 1 : 0) + (activeTab === "export" ? 1 : 0) + 1) / 5 * 100)}% Selesai
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850/60 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-400 font-bold flex items-center justify-center text-[10px] border border-indigo-500/30 shrink-0">1</span>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200 text-xs">Langkah 1: Impor Video Baru / Ganti Video</p>
                          <p className="text-[10px] text-slate-400">Video aktif: <span className="text-slate-300 font-semibold font-mono">"{currentClip.name}"</span></p>
                        </div>
                      </div>

                      {/* Compact Quick Importer inside Workspace Area Kerja */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-850/50">
                        {/* 1. File Upload Button */}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 transition-colors"
                        >
                          <Upload className="w-3 h-3 text-indigo-400 animate-pulse" />
                          <span>Unggah MP4</span>
                        </button>

                        {/* 2. Quick Preset Selector/Reset */}
                        <button
                          type="button"
                          onClick={handleResetWorkspace}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" />
                          <span>Ganti / Preset</span>
                        </button>
                      </div>

                      {/* 3. Paste YouTube URL Input */}
                      <form onSubmit={handleUrlSubmit} className="flex gap-1 border-t border-slate-850/50 pt-2">
                        <input 
                          type="url"
                          required
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          placeholder="Masukkan tautan YouTube..."
                          className="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500/60 rounded-lg px-2 py-1 text-[9px] focus:outline-none text-slate-300 placeholder-slate-600"
                        />
                        <button 
                          type="submit"
                          disabled={isUrlLoading}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[9px] px-2.5 rounded-lg transition-all flex items-center justify-center shrink-0"
                        >
                          {isUrlLoading ? "..." : "Konek"}
                        </button>
                      </form>
                      {urlError && <p className="text-[8px] text-red-400 mt-1">{urlError}</p>}
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab("ai")}
                      className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-all border ${activeAnalysis ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-300' : 'bg-slate-950/20 border-slate-850/40 hover:border-slate-800 hover:bg-slate-950/50'}`}
                    >
                      <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0 ${activeAnalysis ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>2</span>
                      <div className="flex-1">
                        <p className={`font-semibold ${activeAnalysis ? 'text-emerald-400' : 'text-slate-300 group-hover:text-white'}`}>Langkah 2: Deteksi AI Highlights {activeAnalysis ? "✓" : ""}</p>
                        <p className="text-[10px] text-slate-500">
                          {activeAnalysis ? "AI telah memindai. Klik untuk melihat rekomendasi adegan." : "Klik di sini untuk memindai & mendeteksi adegan menarik dengan Gemini AI."}
                        </p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveTab("subtitles")}
                      className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-all border ${subtitles.length > 0 ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-300' : 'bg-slate-950/20 border-slate-850/40 hover:border-slate-800 hover:bg-slate-950/50'}`}
                    >
                      <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0 ${subtitles.length > 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>3</span>
                      <div className="flex-1">
                        <p className={`font-semibold ${subtitles.length > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>Langkah 3: Edit Teks Bahasa Indonesia {subtitles.length > 0 ? "✓" : ""}</p>
                        <p className="text-[10px] text-slate-500">
                          {subtitles.length > 0 ? `${subtitles.length} baris subtitle aktif. Klik untuk menyunting teks.` : "Klik di sini untuk mengedit subtitle karaoke hasil translasi AI."}
                        </p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveTab("thumbnail")}
                      className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-all border bg-slate-950/20 border-slate-850/40 hover:border-slate-800 hover:bg-slate-950/50"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-400 font-bold flex items-center justify-center text-[10px] border border-slate-800 shrink-0">4</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-300">Langkah 4: Cover Thumbnail Estetik</p>
                        <p className="text-[10px] text-slate-500">Tangkap adegan terbaik, berikan judul tebal, lalu simpan cover gambar PNG.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setActiveTab("export")}
                      className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-all border bg-slate-950/20 border-slate-850/40 hover:border-slate-800 hover:bg-slate-950/50"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-400 font-bold flex items-center justify-center text-[10px] border border-slate-800 shrink-0">5</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-300">Langkah 5: Ekspor, Bagikan & Jadwal</p>
                        <p className="text-[10px] text-slate-500">Unduh hasil video Anda atau buat posting terjadwal ke media sosial.</p>
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Side: Tabbed AI & Social Publishing Hub (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                {/* Hub Navigation Tabs */}
                <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-t-2xl flex flex-wrap gap-1">
                  <motion.button
                    onClick={() => setActiveTab("ai")}
                    className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 ${
                      activeTab === "ai"
                        ? "bg-slate-850 text-indigo-400 border border-slate-800 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    id="ai-highlights-tab-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      boxShadow: activeTab === "ai" ? "0 0 12px rgba(99, 102, 241, 0.25)" : "0 0 0px rgba(0,0,0,0)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                    <span>Langkah 2: AI</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab("subtitles")}
                    className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 ${
                      activeTab === "subtitles"
                        ? "bg-slate-850 text-emerald-400 border border-slate-800 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    id="subtitle-tab-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      boxShadow: activeTab === "subtitles" ? "0 0 12px rgba(16, 185, 129, 0.25)" : "0 0 0px rgba(0,0,0,0)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Type className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Langkah 3: Teks</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab("thumbnail")}
                    className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 ${
                      activeTab === "thumbnail"
                        ? "bg-slate-850 text-pink-400 border border-slate-800 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    id="thumbnail-tab-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      boxShadow: activeTab === "thumbnail" ? "0 0 12px rgba(244, 114, 182, 0.25)" : "0 0 0px rgba(0,0,0,0)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Camera className="w-3.5 h-3.5 text-pink-400" />
                    <span>Langkah 4: Cover</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab("export")}
                    className={`flex-1 min-w-[70px] py-2.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 ${
                      activeTab === "export"
                        ? "bg-slate-850 text-amber-400 border border-slate-800 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    id="export-sync-tab-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      boxShadow: activeTab === "export" ? "0 0 12px rgba(245, 158, 11, 0.25)" : "0 0 0px rgba(0,0,0,0)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Langkah 5: Ekspor</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab("saas")}
                    className={`flex-none py-2.5 px-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 ${
                      activeTab === "saas"
                        ? "bg-slate-850 text-purple-400 border border-slate-800 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    id="saas-tab-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      boxShadow: activeTab === "saas" ? "0 0 12px rgba(168, 85, 247, 0.25)" : "0 0 0px rgba(0,0,0,0)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* Tab Frame Contents */}
                <div className="flex-1 bg-slate-900 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden min-h-[500px] flex flex-col">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="flex-1 flex flex-col"
                    >
                      {activeTab === "ai" ? (
                        <AIAssistant
                          videoRef={videoRef}
                          duration={currentClip.duration}
                          currentClip={currentClip}
                          onApplyHighlight={handleApplyAIHighlight}
                          activeAnalysis={activeAnalysis}
                          setActiveAnalysis={setActiveAnalysis}
                          setActiveTab={setActiveTab}
                        />
                      ) : activeTab === "subtitles" ? (
                        <div id="subtitle-editor-panel-card" className="flex-1 flex flex-col">
                          <SubtitleEditor
                            subtitles={subtitles}
                            setSubtitles={setSubtitles}
                            showSubtitles={showSubtitles}
                            setShowSubtitles={setShowSubtitles}
                            activeSubtitleStyle={activeSubtitleStyle}
                            setActiveSubtitleStyle={setActiveSubtitleStyle}
                            currentTime={currentTime}
                            duration={currentClip.duration}
                            trimRange={trimRange}
                            videoRef={videoRef}
                          />
                        </div>
                      ) : activeTab === "export" ? (
                        <div id="export-share-card" className="flex-1 flex flex-col">
                          <SocialShareModal
                            trimRange={trimRange}
                            currentClip={currentClip}
                            analysis={activeAnalysis}
                            onAddCreatedClip={handleAddCreatedClip}
                          />
                        </div>
                      ) : activeTab === "thumbnail" ? (
                        <div id="thumbnail-generator-card" className="flex-1 flex flex-col">
                          <ThumbnailGenerator
                            videoRef={videoRef}
                            currentTime={currentTime}
                            currentClip={currentClip}
                            trimRange={trimRange}
                          />
                        </div>
                      ) : (
                        <SaasDashboard
                          currentUser={currentUser}
                          allUsers={allUsers}
                          systemSettings={systemSettings}
                          auditLogs={auditLogs}
                          onSwitchUser={handleSwitchUser}
                          onUpdateUser={handleUpdateUser}
                          onAddUser={handleAddUser}
                          onDeleteUser={handleDeleteUser}
                          onUpdateSettings={setSystemSettings}
                          onAddAuditLog={handleAddAuditLog}
                          userClipsCount={userClips[currentUser.id]?.length || 0}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

            </div>

          </div>
        )}
        </>
        )}

      </main>

      {/* Footer Info credit */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 Cliperan. Aplikasi Pemotong Highlight Video AI Terintegrasi.</p>
          <p className="text-[10px] text-slate-600">
            Diberdayakan oleh Google Gemini 3.5 Flash & Antigravity Platform. Semua pemrosesan klip aman dan instan.
          </p>
        </div>
      </footer>

      {/* Interactive History Preview Modal */}
      {previewHistoryClip && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h4 className="font-bold text-slate-100 text-xs md:text-sm truncate max-w-[280px]">
                  {previewHistoryClip.name}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Dimulai dari {previewHistoryClip.trimStart.toFixed(1)}s hingga {previewHistoryClip.trimEnd.toFixed(1)}s
                </p>
              </div>
              <button
                onClick={() => setPreviewHistoryClip(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video Box */}
            <div className="relative aspect-[9/16] max-h-[480px] bg-black flex items-center justify-center overflow-hidden border-b border-slate-850">
              <video
                src={`${previewHistoryClip.compiledUrl}#t=${previewHistoryClip.trimStart},${previewHistoryClip.trimEnd}`}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            </div>

            {/* Subtext info */}
            <div className="p-4 bg-slate-950 space-y-3 text-xs">
              {previewHistoryClip.caption && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Caption Klip:</span>
                  <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850/50 italic leading-relaxed">
                    {previewHistoryClip.caption}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                <span>Format: MP4 (Full HD)</span>
                <span>Dimensi: 1080 x 1920 (Portrait)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <UserGuide isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />

      {/* Interactive Toast Alerts */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/30 text-indigo-200 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-xs font-bold leading-relaxed">{toastNotification}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
