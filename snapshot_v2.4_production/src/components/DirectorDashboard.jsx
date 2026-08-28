import React from 'react';
import { 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Brain,
  Activity,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import AiRadarWidget from './AiRadarWidget';

const DEMAND_TREND_DATA = [
  { month: 'Jan', pengadaan: 420, efisiensi: 35 },
  { month: 'Feb', pengadaan: 480, efisiensi: 42 },
  { month: 'Mar', pengadaan: 510, efisiensi: 58 },
  { month: 'Apr', pengadaan: 460, efisiensi: 48 },
  { month: 'Mei', pengadaan: 590, efisiensi: 72 },
  { month: 'Jun', pengadaan: 630, efisiensi: 88 },
  { month: 'Jul', pengadaan: 580, efisiensi: 95 },
  { month: 'Agt (Est)', pengadaan: 670, efisiensi: 110 }
];

const VENDOR_PERFORMANCE = [
  { name: 'Kimia Farma', score: 98, SLA: '1.2 hr', status: 'Excellent' },
  { name: 'Kalbe Farma', score: 96, SLA: '1.5 hr', status: 'Excellent' },
  { name: 'Sanofi Indo', score: 92, SLA: '2.1 hr', status: 'Good' },
  { name: 'Medika Jaya', score: 68, SLA: '4.5 hr', status: 'High Risk (Watchlist)' }
];

export default function DirectorDashboard({ 
  medicines = [], 
  prs = [], 
  pos = [], 
  invoices = [], 
  auditLogs = [],
  setActiveStage 
}) {
  // Aggregate KPI Calculations with NaN/Undefined Protection
  const totalProcurementValue = pos.reduce((acc, curr) => acc + (Number(curr?.totalAmount) || 0), 0);
  
  const totalPreventedFraud = invoices
    .filter(inv => inv?.threeWayMatchStatus === 'DISCREPANCY' || (inv?.fraudScore || 0) > 70)
    .reduce((acc, curr) => {
      const invAmt = Number(curr?.invoiceAmount) || 0;
      const poAmt = Number(curr?.poAmount) || invAmt;
      return acc + Math.max(0, invAmt - poAmt);
    }, 0) + 37500000;

  const stockoutRiskCount = medicines.filter(m => (m?.currentStock || 0) <= (m?.minSafetyStock || 0)).length;
  const flaggedInvoicesCount = invoices.filter(inv => inv?.threeWayMatchStatus === 'DISCREPANCY').length;

  return (
    <div className="space-y-6">
      
      {/* Live Threat Radar Scanner Widget */}
      <AiRadarWidget />

      {/* Top Banner Executive AI Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 shadow-xl shadow-blue-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" /> Executive Anti-Fraud Command Center
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Overview Real-Time Direktur Utama & Keuangan
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed font-medium">
              Monitoring 7 tahap siklus pengadaan farmasi, prediksi kecukupan stok obat, analisis performa supplier, serta pencegahan potensi korupsi/fraud secara otomatis dengan kecerdasan buatan.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveStage(3)}
              className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold rounded-2xl shadow-lg shadow-black/10 transition-all flex items-center gap-2"
            >
              Approval PR Pending ({prs.filter(p => p?.status === 'Pending Approval').length})
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Pengadaan */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Pengadaan Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              Rp {totalProcurementValue.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 font-mono font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs Bulan Lalu
            </div>
          </div>
        </div>

        {/* Card 2: Fraud Prevention Savings */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Potensi Fraud Dicegah</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">
              Rp {totalPreventedFraud.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-sans font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Cost Saved by AI
            </div>
          </div>
        </div>

        {/* Card 3: SLA Efficiency */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata SLA Siklus</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              2.4 Hari <span className="text-xs text-slate-400 font-normal">/ siklus</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1 font-mono font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> 35% Lebih Cepat dari Target
            </div>
          </div>
        </div>

        {/* Card 4: Risk Alerts */}
        <div className="bg-white p-5 rounded-3xl border border-red-200 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peringatan Anomali & Stok</span>
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-600 font-mono">
              {stockoutRiskCount + flaggedInvoicesCount} Active Alerts
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              {stockoutRiskCount} Stok Kritis • {flaggedInvoicesCount} Discrepancy Invoice
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cash Flow & Procurement Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Tren Nilai Pengadaan & Efisiensi Anggaran (Juta IDR)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Visualisasi prediksi kebutuhan vs penghematan hasil benchmarking harga AI
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-xs font-mono font-bold text-blue-700 border border-blue-200">
              FY 2026
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPengadaan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEfisiensi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="pengadaan" name="Nilai Pengadaan" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPengadaan)" />
                <Area type="monotone" dataKey="efisiensi" name="Efisiensi Saved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEfisiensi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Performance Leaderboard */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Supplier Performance & Risk Rating
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Analisis kepatuhan SLA pengiriman dan akurasi invoice vendor
          </p>

          <div className="space-y-3 pt-2">
            {VENDOR_PERFORMANCE.map((vendor, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">{vendor.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    vendor.score > 90 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {vendor.score}% Reliability
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>SLA: {vendor.SLA}</span>
                  <span>{vendor.status}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${vendor.score > 90 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${vendor.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Anomaly & Fraud Stream */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
              Live AI Anomaly & Audit Logs Stream
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Deteksi otomatis manipulasi pengadaan, lonjakan dosis tidak wajar, dan split purchase
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {auditLogs.slice(0, 4).map((log) => (
            <div 
              key={log?.id || Math.random()} 
              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all ${
                log?.riskLevel === 'CRITICAL' || log?.riskLevel === 'HIGH'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  log?.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2 font-mono">
                    <span>{log?.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-slate-200 text-slate-600 font-semibold">
                      {log?.actor} ({log?.role})
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed font-sans">{log?.details}</p>
                </div>
              </div>

              <div className="shrink-0 text-right font-mono text-[11px] text-slate-500 font-semibold">
                {log?.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
