import { VideoTemplate } from "./types";

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: "surf-sports",
    name: "Aksi Surfing Profesional (Sports)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-surfer-riding-a-wave-under-a-blue-sky-44325-large.mp4",
    duration: 25.4,
    thumbnail: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&auto=format&fit=crop&q=80",
    category: "Sports",
    description: "Peselancar profesional menaklukkan ombak besar di bawah langit biru cerah. Klip penuh energi dan aksi dinamis."
  },
  {
    id: "cooking-steak",
    name: "Resep Memasak & Potong Sayur (Cooking)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-fresh-vegetables-on-a-board-43093-large.mp4",
    duration: 14.8,
    thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=80",
    category: "Cooking",
    description: "Koki profesional memotong sayuran segar dengan teknik pisau super cepat. Sangat cocok untuk konten ASMR kuliner."
  },
  {
    id: "forest-drone",
    name: "Sinematik Drone Hutan & Sungai (Vlog)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    duration: 10.5,
    thumbnail: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&auto=format&fit=crop&q=80",
    category: "Vlog",
    description: "Pengambilan gambar sinematik dari udara menampilkan aliran sungai jernih di tengah hutan lebat yang disinari cahaya matahari pagi."
  },
  {
    id: "tech-developer",
    name: "Programming & Desain Coding (Tech)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-laptop-keyboard-40417-large.mp4",
    duration: 15.2,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80",
    category: "Tech",
    description: "Seorang pengembang mengetik kode pemrograman dengan ritme cepat pada laptop premium berlatar belakang estetika modern."
  }
];

export const PLATFORM_DETAILS: Record<string, any> = {
  tiktok: {
    username: "cliperan.creator",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    likes: "45.2K",
    comments: "1.2K",
    shares: "8.9K",
    soundName: "Suara asli - Cliperan AI Editor"
  },
  instagram: {
    username: "cliperan_visual",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    likes: "12.8K",
    comments: "348",
    shares: "2.4K",
    soundName: "Audio Asli • Tren Musik Reels"
  },
  youtube: {
    username: "CliperanStudio",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    likes: "8.5K",
    comments: "124",
    shares: "1.1K",
    soundName: "Musik Shorts Terpopuler"
  }
};
