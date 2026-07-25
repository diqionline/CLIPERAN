export interface VideoClip {
  id: string;
  name: string;
  url: string;
  size?: number;
  duration: number;
  file?: File;
  sourceType: "local" | "url" | "template";
}

export interface TrimRange {
  start: number;
  end: number;
}

export interface SubtitleItem {
  id: string;
  text: string;
  start: number;
  end: number;
  style?: string; // e.g. "tiktok-yellow", "classic-white", "neon-green"
}

export interface AIScene {
  id: string;
  title: string;
  start: number;
  end: number;
  viralScore: number;
  reason: string;
  suggestedCaption: string;
  subtitles?: SubtitleItem[];
}

export interface AIAnalysis {
  recommendedStart: number;
  recommendedEnd: number;
  title: string;
  reason: string;
  viralScore: number;
  suggestedCaption: string;
  subtitles?: SubtitleItem[];
  isMock: boolean;
  scenes?: AIScene[];
}

export type SocialPlatform = "tiktok" | "instagram" | "youtube";

export interface SocialMockDetails {
  username: string;
  profilePic: string;
  likes: string;
  comments: string;
  shares: string;
  soundName: string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  url: string;
  duration: number;
  thumbnail: string;
  category: "Sports" | "Tech" | "Cooking" | "Vlog";
  description: string;
}

export interface ScheduledPost {
  id: string;
  platform: SocialPlatform;
  caption: string;
  clipName: string;
  clipDuration: number;
  scheduledTime: string; // ISO or datetime-local string
  status: "scheduled" | "published" | "cancelled";
  createdAt: string;
  userId?: string; // Associated SaaS User
}

export interface SaaSUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "superadmin";
  plan: "free" | "pro" | "enterprise";
  avatar: string;
  createdAt: string;
  status: "active" | "suspended";
  clipsLimit: number;
  usedClips: number;
  lastLogin: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  type: "info" | "warning" | "success" | "error";
}

export interface SystemSettings {
  maxFreeClips: number;
  maxProClips: number;
  aiModelCostPerHour: number;
  enablePublicSignup: boolean;
  maintenanceMode: boolean;
}

export interface CreatedClipHistoryItem {
  id: string;
  userId: string;
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
  createdAt: string;
}



