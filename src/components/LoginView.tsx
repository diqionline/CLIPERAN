import React, { useState } from "react";
import { 
  Lock, 
  User, 
  Shield, 
  Sparkles, 
  Video, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { SaaSUser } from "../types";
import { motion } from "motion/react";

interface LoginViewProps {
  allUsers: SaaSUser[];
  onLoginSuccess: (user: SaaSUser) => void;
}

export default function LoginView({ allUsers, onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find the user by username
      const user = allUsers.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (!user) {
        setError("Username tidak terdaftar.");
        setIsLoading(false);
        return;
      }

      if (user.status === "suspended") {
        setError("Akun ini telah ditangguhkan oleh Superadmin.");
        setIsLoading(false);
        return;
      }

      // Simple password rule: admin123 for superadmin, user123 for others
      const correctPassword = user.role === "superadmin" ? "admin123" : "user123";

      if (password !== correctPassword) {
        setError("Password salah. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      // Success
      setIsLoading(false);
      onLoginSuccess(user);
    }, 800);
  };

  const handleQuickLogin = (user: SaaSUser) => {
    setUsername(user.username);
    setPassword(user.role === "superadmin" ? "admin123" : "user123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden p-4 md:p-8 selection:bg-indigo-500/30 selection:text-white">
      {/* Glow Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-950/40 border border-indigo-400/20">
            <Video className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Cliperan
            </h1>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none block mt-0.5">
              AI Highlights
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-850 py-1 px-3 rounded-full text-[11px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>v2.4 Production</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 z-10 py-6 md:py-12">
        
        {/* Left Side: Brand Promo / Info Box */}
        <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Multi-Tenant SaaS Studio</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Ubah Video Panjang Menjadi Klip <span className="text-indigo-400 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Viral & Menarik</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Cliperan didukung oleh teknologi kecerdasan buatan untuk menganalisis video, mendeteksi momen dramatis, menyinkronkan subtitle dinamis otomatis, dan mengekspor klip potrait berdurasi pendek langsung ke platform favorit Anda.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-900">
            <div className="space-y-1 bg-slate-900/30 p-3 rounded-2xl border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Render AI</span>
              <span className="text-base font-black text-slate-200 font-mono">⚡ 12.5x Fast</span>
            </div>
            <div className="space-y-1 bg-slate-900/30 p-3 rounded-2xl border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Keakuratan</span>
              <span className="text-base font-black text-slate-200 font-mono">🎯 99.4%</span>
            </div>
            <div className="space-y-1 bg-slate-900/30 p-3 rounded-2xl border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Multi-Tenant</span>
              <span className="text-base font-black text-slate-200 font-mono">👥 Ready</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Box */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative">
          
          <div className="space-y-2 mb-6 text-center">
            <h3 className="text-xl font-bold text-slate-100">Selamat Datang Kembali</h3>
            <p className="text-xs text-slate-400">Silakan masukkan detail akun Anda untuk masuk ke Studio</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-950/40 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: superadmin_cliperan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Password</label>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono cursor-pointer hover:text-slate-400">
                  <HelpCircle className="w-3 h-3" />
                  <span>Petunjuk terlampir di bawah</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-850 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Akun Superadmin & Demo (Klik untuk isi)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allUsers.map((user) => {
                const isAdmin = user.role === "superadmin";
                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    type="button"
                    className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.01] ${
                      isAdmin 
                        ? "bg-amber-950/20 hover:bg-amber-950/30 border-amber-500/20 hover:border-amber-500/40" 
                        : "bg-slate-950 hover:bg-slate-850 border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="w-4 h-4 rounded-full object-cover" 
                      />
                      <span className="text-[9px] font-extrabold text-slate-300 truncate">
                        @{user.username}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[8px] text-slate-500 font-mono">
                      <span>Peran: {isAdmin ? "Admin" : user.plan.toUpperCase()}</span>
                      <span className="text-slate-600">
                        {isAdmin ? "admin123" : "user123"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center z-10 py-2 border-t border-slate-900 mt-4">
        <p className="text-[10px] text-slate-600 font-mono">
          &copy; 2026 Cliperan Studio Inc. Semua Hak Dilindungi. Multi-Tenant Sandbox System Aktif.
        </p>
      </div>
    </div>
  );
}
