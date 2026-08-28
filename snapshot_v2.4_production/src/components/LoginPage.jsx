import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Building2,
  UserCheck,
  Eye,
  EyeOff,
  Activity,
  CheckCircle2,
  Stethoscope,
  Boxes,
  Cpu
} from 'lucide-react';
import { REGISTERED_STAFF, authenticateStaff } from '../config/auth';
import { BRANDING } from '../config/branding';
import LiveWibClock from './LiveWibClock';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'DEMO_CARDS'

  const projectLeaderName = typeof BRANDING.team?.projectLeader === 'object' 
    ? BRANDING.team.projectLeader.name 
    : (BRANDING.team?.projectLeader || 'dr. Novia Dwi Anggraini');

  const qcDesignerName = typeof BRANDING.team?.qcEngineerAndDesigner === 'object' 
    ? BRANDING.team.qcEngineerAndDesigner.name 
    : (BRANDING.team?.qcEngineerAndDesigner || 'Asyraf Hadi');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const user = authenticateStaff(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setErrorMsg('Kredensial staff tidak terverifikasi. Silakan periksa kembali email dan password resmi RS Anda.');
      }
      setLoading(false);
    }, 700);
  };

  const handleQuickLogin = (staffUser) => {
    setEmail(staffUser.email);
    setPassword(staffUser.password);
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(staffUser);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Top Clinical Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                {BRANDING.appName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                v{BRANDING.version}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {BRANDING.organization} • Portal Otentikasi Terintegrasi
            </p>
          </div>
        </div>

        {/* Live System Status & Live WIB Clock Widget */}
        <div className="hidden md:flex items-center gap-3 font-sans text-xs">
          
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-700 font-semibold">
            <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>SATUSEHAT Kemenkes Ready</span>
          </div>

          <LiveWibClock />

        </div>

      </header>

      {/* Main Authentication Grid (Previous Loved Layout with Light Clinical Palette) */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10 my-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hospital & System Credentials Hero Panel (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Title & Tagline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Enterprise Healthcare Security Gateway
              </div>

              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Sistem Informasi & <br />
                <span className="text-blue-600 border-b-4 border-blue-600 pb-1">
                  Anti-Fraud Pengadaan Obat
                </span>
              </h2>

              <p className="text-xs lg:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
                Platform terpadu keamanan rantai pasok obat rumah sakit berbasis kecerdasan buatan. Mengamankan alur pengadaan dari pencatatan stok hingga verifikasi tagihan 3-Way Match.
              </p>
            </div>

            {/* Leadership & Accreditation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 font-sans">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Project Leader</div>
                <div className="text-sm font-extrabold text-blue-700 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  {projectLeaderName}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Direktur Utama & Head of Healthcare AI</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 font-sans">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">QC Engineer & Designer</div>
                <div className="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  {qcDesignerName}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Desain Sistem & Verifikasi Kualitas AI</div>
              </div>

            </div>

            {/* Quick Demo Staff Login Selector Grid (Restored previous UI) */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" /> Demo 1-Click Akses Role Staff:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REGISTERED_STAFF.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => handleQuickLogin(staff)}
                    className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all text-left space-y-1 group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {staff.roleTitle}
                      </span>
                      <span className="text-[10px] font-mono text-blue-700 font-bold px-2 py-0.5 rounded-full bg-blue-100 border border-blue-200">
                        {staff.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium truncate">{staff.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{staff.email}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Professional Hospital Login Box (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xl shadow-blue-500/10 relative">
              
              {/* Login Header */}
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" /> Otentikasi Kredensial Staff
                </h3>
                <p className="text-xs text-slate-500">
                  Silakan masuk menggunakan email dan password resmi rumah sakit.
                </p>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setActiveTab('CREDENTIALS')}
                  className={`py-2.5 rounded-xl font-bold transition-all ${
                    activeTab === 'CREDENTIALS' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Form Login Email
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('DEMO_CARDS')}
                  className={`py-2.5 rounded-xl font-bold transition-all ${
                    activeTab === 'DEMO_CARDS' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Quick Demo Staff
                </button>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* TAB 1: FORM LOGIN */}
              {activeTab === 'CREDENTIALS' && (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-blue-600" /> Alamat Email Staff RS:
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 font-bold">direktur@sentra.health</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama.staff@sentra.health"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-blue-600" /> Password Kredensial:
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 font-bold">Default: admin123</span>
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 pr-10 text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span className="font-mono">Memverifikasi Kredensial Staff...</span>
                    ) : (
                      <>
                        <span>Masuk ke Pipeline RBAC</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* TAB 2: QUICK DEMO STAFF SELECTOR */}
              {activeTab === 'DEMO_CARDS' && (
                <div className="space-y-2.5">
                  <div className="text-[11px] text-slate-500 font-medium font-mono">
                    Pilih akun staff di bawah untuk pengujian cepat:
                  </div>

                  <div className="space-y-2">
                    {REGISTERED_STAFF.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => handleQuickLogin(staff)}
                        className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-left flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-9 h-9 rounded-xl object-cover border border-blue-400"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs group-hover:text-blue-700 transition-colors">
                              {staff.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">{staff.roleTitle}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-blue-700 px-2.5 py-1 rounded-full bg-blue-100 border border-blue-200 font-bold shrink-0">
                          {staff.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 text-center text-[10px] font-mono text-slate-400">
                🔒 Enterprise Security Standard • Protected by 256-Bit Encryption
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Professional Hospital Footer */}
      <footer className="p-4 border-t border-slate-200 bg-white text-center text-xs text-slate-600 font-medium relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 px-8">
        <div>
          {BRANDING.organization} © {new Date().getFullYear()} • All Rights Reserved.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Leader: <strong className="text-blue-700 font-bold">{projectLeaderName}</strong></span>
          <span>QC Engineer & Design: <strong className="text-emerald-700 font-bold">{qcDesignerName}</strong></span>
        </div>
      </footer>

    </div>
  );
}
