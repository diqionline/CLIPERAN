import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Settings,
  Activity,
  Sparkles,
  UserPlus,
  TrendingUp,
  DollarSign,
  Cpu,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Database,
  ExternalLink,
  ChevronRight,
  Crown,
  Layers,
  Video,
  Key
} from "lucide-react";
import { SaaSUser, SystemAuditLog, SystemSettings, VideoClip } from "../types";

interface SaasDashboardProps {
  currentUser: SaaSUser;
  allUsers: SaaSUser[];
  onSwitchUser: (userId: string) => void;
  onUpdateUser: (updatedUser: SaaSUser) => void;
  onAddUser: (username: string, email: string, plan: "free" | "pro" | "enterprise") => void;
  onDeleteUser: (userId: string) => void;
  auditLogs: SystemAuditLog[];
  onAddAuditLog: (action: string, details: string, type: "info" | "warning" | "success" | "error") => void;
  systemSettings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  userClipsCount: number;
}

export default function SaasDashboard({
  currentUser,
  allUsers,
  onSwitchUser,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  auditLogs,
  onAddAuditLog,
  systemSettings,
  onUpdateSettings,
  userClipsCount
}: SaasDashboardProps) {
  // Tabs in Admin panel
  const [adminTab, setAdminTab] = useState<"users" | "logs" | "settings">("users");

  // Form states for new user
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState<"free" | "pro" | "enterprise">("free");
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Settings local states
  const [localSettings, setLocalSettings] = useState<SystemSettings>({ ...systemSettings });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Filter logs state
  const [logFilter, setLogFilter] = useState<"all" | "info" | "success" | "warning" | "error">("all");

  useEffect(() => {
    setLocalSettings({ ...systemSettings });
  }, [systemSettings]);

  // Handle adding user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim()) return;

    onAddUser(newUsername, newEmail, newPlan);
    setNewUsername("");
    setNewEmail("");
    setNewPlan("free");
    setIsAddingUser(false);
  };

  // Handle saving settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSuccess(true);
    onAddAuditLog(
      "Pengaturan Sistem Diperbarui",
      `Superadmin memperbarui konfigurasi limit & biaya model AI.`,
      "success"
    );
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const getPlanBadgeClass = (plan: "free" | "pro" | "enterprise") => {
    switch (plan) {
      case "free":
        return "bg-slate-800 text-slate-300 border border-slate-700";
      case "pro":
        return "bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-bold";
      case "enterprise":
        return "bg-amber-950/80 text-amber-300 border border-amber-500/30 font-extrabold";
    }
  };

  // Calculate SaaS Financial Metrics based on User plans
  const totalMRR = allUsers.reduce((sum, u) => {
    if (u.status === "suspended") return sum;
    if (u.plan === "pro") return sum + 29; // $29 / month
    if (u.plan === "enterprise") return sum + 149; // $149 / month
    return sum;
  }, 0);

  const filteredLogs = auditLogs.filter(
    (log) => logFilter === "all" || log.type === logFilter
  );

  return (
    <div className="space-y-6" id="saas-dashboard-panel">
      {/* SaaS Architecture Context Alert Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest inline-block mb-1">
              SaaS Multi-User & Multi-Tenant Engine
            </span>
            <h3 className="text-sm font-bold text-slate-200">
              Gerbang Simulasi SaaS Cliperan Studio
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              Aplikasi ini beroperasi dengan database multi-pengguna terisolasi. Setiap pengguna memiliki konten dashboard, batas klip video, riwayat, dan izin tersendiri. Superadmin memiliki hak akses penuh untuk mengelola pengguna, memantau log audit sistem, dan mengonfigurasi batas global platform.
            </p>
          </div>

          {/* Quick Sandbox Identity Switcher */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 shrink-0 flex flex-col space-y-1.5 min-w-[240px]">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
              Pilih Profil Simulasi Aktif:
            </span>
            <div className="space-y-1">
              <select
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-xs font-bold text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id} className="font-sans text-slate-200">
                    {user.username} ({user.role === "superadmin" ? "Admin" : user.plan.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>Status: <span className="text-emerald-400 font-semibold">{currentUser.status}</span></span>
              <span>Peran: <span className="text-indigo-400 font-semibold">{currentUser.role}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER SUPERADMIN PORTAL IF CURRENT USER IS SUPERADMIN */}
      {currentUser.role === "superadmin" ? (
        <div className="space-y-6" id="superadmin-console">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-950/50 text-red-400 border border-red-500/20 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm md:text-base text-slate-200">Konsol Kontrol Superadmin</h2>
                <p className="text-[11px] text-slate-500">Kelola operasional SaaS global, pendapatan, database, dan pembatasan fitur</p>
              </div>
            </div>

            {/* Admin Tabs Toggle */}
            <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl">
              <button
                onClick={() => setAdminTab("users")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminTab === "users" ? "bg-slate-850 text-slate-200" : "text-slate-500 hover:text-slate-300"
                }`}
                type="button"
              >
                Pengguna
              </button>
              <button
                onClick={() => setAdminTab("logs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminTab === "logs" ? "bg-slate-850 text-slate-200" : "text-slate-500 hover:text-slate-300"
                }`}
                type="button"
              >
                Log Audit
              </button>
              <button
                onClick={() => setAdminTab("settings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  adminTab === "settings" ? "bg-slate-850 text-slate-200" : "text-slate-500 hover:text-slate-300"
                }`}
                type="button"
              >
                Sistem
              </button>
            </div>
          </div>

          {/* Superadmin Grid Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Pengguna</span>
                <span className="text-xl font-black text-slate-100">{allUsers.length}</span>
                <span className="text-[9px] text-emerald-400 block font-semibold">↑ 100% Organik</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pendapatan SaaS (MRR)</span>
                <span className="text-xl font-black text-slate-100">${totalMRR}</span>
                <span className="text-[9px] text-indigo-400 block font-semibold">Dari Pro & Enterprise</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Klip Di-render</span>
                <span className="text-xl font-black text-slate-100">
                  {allUsers.reduce((sum, u) => sum + u.usedClips, 0)}
                </span>
                <span className="text-[9px] text-indigo-400 block font-semibold">Tersimpan di Cloud</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-indigo-400">
                <Video className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Biaya Komputasi AI</span>
                <span className="text-xl font-black text-slate-100">
                  ${(allUsers.length * systemSettings.aiModelCostPerHour).toFixed(2)}
                </span>
                <span className="text-[9px] text-amber-500 block font-semibold">Faktur Google Cloud API</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* TAB 1: USERS MANAGEMENT */}
          {adminTab === "users" && (
            <div className="bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-200">Manajemen Pengguna Terdaftar</h4>
                  <p className="text-[10px] text-slate-500">Daftar tenant SaaS aktif. Edit plan subscription, status akun, dan reset kuota</p>
                </div>

                <button
                  onClick={() => setIsAddingUser(!isAddingUser)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  type="button"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Pengguna Baru</span>
                </button>
              </div>

              {/* Add User Expandable Form */}
              {isAddingUser && (
                <form
                  onSubmit={handleCreateUser}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 animate-fade-in"
                >
                  <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <UserPlus className="w-3.5 h-3.5" />
                    Formulir Registrasi Tenant Baru
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase block font-bold">Username</label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="contoh: budi_creator"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase block font-bold">Alamat Email</label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="budi@domain.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase block font-bold">Subscription Plan</label>
                      <select
                        value={newPlan}
                        onChange={(e) => setNewPlan(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="free">Free ($0/bulan)</option>
                        <option value="pro">Pro ($29/bulan)</option>
                        <option value="enterprise">Enterprise ($149/bulan)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => setIsAddingUser(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200"
                      type="button"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md"
                    >
                      Buat Pengguna
                    </button>
                  </div>
                </form>
              )}

              {/* Users Directory Table */}
              <div className="overflow-x-auto border border-slate-850 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-850 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Pengguna</th>
                      <th className="py-3 px-4">Subscription</th>
                      <th className="py-3 px-4">Kuota Pemakaian</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-950/20 transition-all">
                        {/* Profile Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-slate-200 flex items-center gap-1">
                                {user.username}
                                {user.role === "superadmin" && (
                                  <span className="bg-red-500/10 text-red-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-500/20">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${getPlanBadgeClass(user.plan)}`}>
                            {user.plan.toUpperCase()}
                          </span>
                        </td>

                        {/* Kuota Limit */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 max-w-[120px]">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>{user.usedClips} klip digunakan</span>
                              <span>{user.clipsLimit} max</span>
                            </div>
                            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${user.usedClips >= user.clipsLimit ? "bg-red-500" : "bg-indigo-500"}`}
                                style={{ width: `${Math.min(100, (user.usedClips / user.clipsLimit) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                              user.status === "active" ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                            {user.status === "active" ? "Aktif" : "Ditangguhkan"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {user.role !== "superadmin" && (
                              <>
                                {/* Upgrade / Cycle through Plans */}
                                <button
                                  onClick={() => {
                                    const nextPlan = user.plan === "free" ? "pro" : user.plan === "pro" ? "enterprise" : "free";
                                    const nextLimit = nextPlan === "free" ? 5 : nextPlan === "pro" ? 15 : 999;
                                    onUpdateUser({
                                      ...user,
                                      plan: nextPlan,
                                      clipsLimit: nextLimit
                                    });
                                    onAddAuditLog(
                                      "Plan Pengguna Diubah",
                                      `Superadmin mengubah paket @${user.username} menjadi ${nextPlan.toUpperCase()}`,
                                      "info"
                                    );
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all border border-slate-800"
                                  title="Ubah Paket Subscription"
                                  type="button"
                                >
                                  <Crown className="w-3.5 h-3.5" />
                                </button>

                                {/* Toggle Active/Suspended */}
                                <button
                                  onClick={() => {
                                    const nextStatus = user.status === "active" ? "suspended" : "active";
                                    onUpdateUser({ ...user, status: nextStatus });
                                    onAddAuditLog(
                                      nextStatus === "active" ? "Akun Diaktifkan" : "Akun Ditangguhkan",
                                      `Superadmin mengubah status @${user.username} menjadi ${nextStatus}`,
                                      nextStatus === "active" ? "success" : "warning"
                                    );
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    user.status === "active"
                                      ? "bg-slate-900 hover:bg-red-950/20 border-slate-800 text-slate-400 hover:text-red-400"
                                      : "bg-red-950/20 hover:bg-emerald-950/20 border-red-900/30 text-red-400 hover:text-emerald-400"
                                  }`}
                                  title={user.status === "active" ? "Tangguhkan Pengguna" : "Aktifkan Pengguna"}
                                  type="button"
                                >
                                  {user.status === "active" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                </button>

                                {/* Delete User */}
                                <button
                                  onClick={() => {
                                    if (confirm(`Apakah Anda yakin ingin menghapus akun @${user.username}?`)) {
                                      onDeleteUser(user.id);
                                      onAddAuditLog(
                                        "Pengguna Dihapus",
                                        `Superadmin menghapus permanen pengguna @${user.username}`,
                                        "error"
                                      );
                                    }
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/20 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                  title="Hapus Akun Permanen"
                                  type="button"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT LOGS */}
          {adminTab === "logs" && (
            <div className="bg-slate-950/50 border border-slate-850 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-200">Log Audit Keamanan & Sistem</h4>
                  <p className="text-[10px] text-slate-500">Mencatat aktivitas mutasi database, ekspor, dan tindakan pengguna secara real-time</p>
                </div>

                {/* Log Severity Filter */}
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "info", "success", "warning", "error"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setLogFilter(type)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        logFilter === type
                          ? "bg-indigo-600 text-white border-transparent"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300"
                      }`}
                      type="button"
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed List */}
              <div className="border border-slate-850 rounded-xl max-h-[350px] overflow-y-auto divide-y divide-slate-900 bg-slate-950 font-mono text-[10.5px]">
                {filteredLogs.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 text-xs">
                    Tidak ada log dengan filter terpilih.
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    let typeClass = "text-indigo-400";
                    if (log.type === "success") typeClass = "text-emerald-400";
                    if (log.type === "warning") typeClass = "text-amber-400";
                    if (log.type === "error") typeClass = "text-red-400";

                    return (
                      <div key={log.id} className="p-3 hover:bg-slate-900/40 flex items-start gap-3 transition-colors">
                        <span className="text-slate-500 shrink-0 font-sans">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold uppercase tracking-wider ${typeClass}`}>
                              [{log.action}]
                            </span>
                            <span className="text-slate-400">@ {log.username}</span>
                          </div>
                          <p className="text-slate-300 font-sans">{log.details}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM CONFIGS */}
          {adminTab === "settings" && (
            <div className="bg-slate-950/50 border border-slate-850 rounded-2xl p-5">
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-200">Konfigurasi Pembatasan SaaS Global</h4>
                  <p className="text-[10px] text-slate-500">Sesuaikan batas kuota render, hosting cloud, dan struktur model pricing</p>
                </div>

                {settingsSuccess && (
                  <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Konfigurasi server global berhasil diperbarui dan direfresh!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4 bg-slate-950 border border-slate-850 p-4 rounded-xl">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      Aturan Jatah Kuota Video
                    </h5>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Batas Unggah Free Plan</label>
                        <input
                          type="number"
                          value={localSettings.maxFreeClips}
                          onChange={(e) => setLocalSettings({ ...localSettings, maxFreeClips: parseInt(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                        />
                        <p className="text-[9px] text-slate-500">Max klip video yang bisa disimpan pengguna tanpa berbayar</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Batas Unggah Pro Plan</label>
                        <input
                          type="number"
                          value={localSettings.maxProClips}
                          onChange={(e) => setLocalSettings({ ...localSettings, maxProClips: parseInt(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-950 border border-slate-850 p-4 rounded-xl">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      Struktur Biaya & Gateway
                    </h5>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Biaya Model AI Google Gemini ($ / Jam)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={localSettings.aiModelCostPerHour}
                          onChange={(e) => setLocalSettings({ ...localSettings, aiModelCostPerHour: parseFloat(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 bg-slate-900/40 rounded-lg border border-slate-900">
                        <div>
                          <span className="text-[10px] font-bold text-slate-300 block">Pendaftaran Publik Aktif</span>
                          <span className="text-[8.5px] text-slate-500">Izinkan pengguna baru registrasi mandiri</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, enablePublicSignup: !localSettings.enablePublicSignup })}
                          className={`w-10 h-5.5 rounded-full p-1 transition-all ${
                            localSettings.enablePublicSignup ? "bg-indigo-600" : "bg-slate-800"
                          }`}
                        >
                          <div
                            className={`bg-white w-3.5 h-3.5 rounded-full transition-transform ${
                              localSettings.enablePublicSignup ? "translate-x-4.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Terapkan Konfigurasi SaaS
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* RENDER TENANT CLIENT USER DASHBOARD OVERVIEW */
        <div className="space-y-5" id="user-tenant-dashboard">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-950 text-indigo-400 border border-indigo-500/10 rounded-lg">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm md:text-base text-slate-200">Dashboard Akun Saya ({currentUser.username})</h2>
                <p className="text-[11px] text-slate-500">Kelola status langganan, batas unggahan, dan integrasi sosial</p>
              </div>
            </div>

            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${getPlanBadgeClass(currentUser.plan)}`}>
              Paket: {currentUser.plan.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Limit Quota Usage Card */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Kapasitas Rendering Video</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-200">{userClipsCount}</span>
                  <span className="text-xs text-slate-500">dari {currentUser.clipsLimit} klip digunakan</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${(userClipsCount / currentUser.clipsLimit) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                {currentUser.plan === "free" 
                  ? "Sisa kuota terbatas. Upgrade ke Pro untuk membuka 15+ klip video per bulan." 
                  : "Akun Anda memiliki batas kuota premium yang diperluas untuk project studio besar."}
              </p>
            </div>

            {/* Cloud Storage Status */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Status Cloud Tenant</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Koneksi Server Stabil</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  ID Database: cliperan-tenant-{currentUser.id}
                </p>
              </div>
              <p className="text-[10px] text-slate-500">
                Semua subtitle yang diedit secara AI dan ekspor timeline terisolasi dengan enkripsi SSL 256-bit.
              </p>
            </div>

            {/* Premium Upgrade Checkout Promo Card */}
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <span className="bg-amber-400 text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider inline-block mb-1.5">
                  PROMO SAAS
                </span>
                <h4 className="text-xs font-extrabold text-slate-200 flex items-center gap-1">
                  Mulai dari $29/bulan
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Buka suara sulih suara AI, transkrip otomatis pintar, resolusi ekspor Ultra HD 4K, dan integrasi scheduler tanpa batas.
                </p>
              </div>

              {currentUser.plan === "free" ? (
                <button
                  onClick={() => {
                    onUpdateUser({
                      ...currentUser,
                      plan: "pro",
                      clipsLimit: 15
                    });
                    onAddAuditLog(
                      "Meningkatkan Paket",
                      `Pengguna @${currentUser.username} meningkatkan mandiri ke paket PRO`,
                      "success"
                    );
                    alert("Pembayaran Terverifikasi! Selamat Anda telah menjadi Pengguna PRO 🎉");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] sm:text-xs py-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                  type="button"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span>Daftar Pro Instan</span>
                </button>
              ) : (
                <div className="text-[10px] text-indigo-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Terima kasih! Anda aktif menggunakan Paket Premium</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
