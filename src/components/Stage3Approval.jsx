import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Brain, 
  AlertTriangle,
  RotateCcw,
  History
} from 'lucide-react';

export default function Stage3Approval({ 
  prs = [], 
  onApprovePR, 
  onRejectPR, 
  setActiveStage 
}) {
  const [rejectModalPr, setRejectModalPr] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingPrs = prs.filter(p => p.status === 'Pending Approval');
  const processedPrs = prs.filter(p => p.status === 'Approved' || p.status === 'Rejected');

  const handleConfirmReject = () => {
    if (!rejectModalPr) return;
    onRejectPR(rejectModalPr.id, rejectReason);
    setRejectModalPr(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Tahap 3: Executive Approval PR & Anti-Fraud Gatekeeper
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Verification & Approval Pengadaan Obat
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Direktur Utama / Keuangan • Gerbang verifikasi transaksi bernilai tinggi, pencegahan pengisian berulang (split purchase), dan persetujuan alokasi anggaran.
          </p>
        </div>
      </div>

      {/* Pending PR List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
          Pengajuan PR Membutuhkan Persetujuan ({pendingPrs.length})
        </h3>

        {pendingPrs.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2 text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <div className="text-xs font-bold text-slate-800">Semua Purchase Request Telah Diproses</div>
            <p className="text-[11px] text-slate-500">Tidak ada pengajuan PR yang tertunda saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingPrs.map((pr) => {
              const isHighRisk = pr.riskScore >= 70;

              return (
                <div 
                  key={pr.id}
                  className={`bg-white p-6 rounded-3xl border space-y-4 shadow-sm transition-all ${
                    isHighRisk ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900">{pr.drugName}</h4>
                        <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                          {pr.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        Pemohon: <strong className="text-slate-800">{pr.requestedBy}</strong> • Tanggal: {pr.requestDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                        isHighRisk ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        Risk Score: {pr.riskScore}%
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Kuantitas Dipesan</span>
                      <strong className="text-slate-900 text-sm font-mono font-bold">{pr.requestedQty} {pr.unit}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Estimasi Total Alokasi</span>
                      <strong className="text-blue-700 text-sm font-mono font-bold">Rp {pr.estimatedTotal?.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Urgency Level</span>
                      <strong className="text-amber-700 text-sm font-mono font-bold">{pr.urgency}</strong>
                    </div>
                  </div>

                  {/* AI Fraud Analysis */}
                  <div className={`p-4 rounded-2xl space-y-2 border text-xs ${
                    isHighRisk ? 'bg-red-50 border-red-200 text-red-900' : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 font-sans">
                      <Brain className="w-4 h-4 text-blue-600" /> Analisis AI Security Gatekeeper:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 font-medium">
                      {pr.riskFactors?.map((rf, idx) => (
                        <li key={idx}>{rf}</li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-blue-200/60 font-bold">
                      Rekomendasi AI: {pr.aiRecommendation}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setRejectModalPr(pr)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-red-600" /> Tahan / Tolak PR
                    </button>

                    <button
                      onClick={() => onApprovePR(pr.id)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Setujui & Alokasikan Anggaran
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Processed & Rejected PR Section */}
      {processedPrs.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" /> Riwayat PR Diproses & Ditahan ({processedPrs.length})
          </h3>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-4">ID PR & Obat</th>
                    <th className="p-4">Pemohon</th>
                    <th className="p-4">Qty & Total</th>
                    <th className="p-4">Status Approval</th>
                    <th className="p-4 text-right">Opsi Ubah / Re-Input</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedPrs.map((pr) => {
                    const isRejected = pr.status === 'Rejected';

                    return (
                      <tr key={pr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono">
                          <div className="font-bold text-slate-900 text-sm">{pr.drugName}</div>
                          <div className="text-[11px] text-blue-600">{pr.id} • {pr.requestDate}</div>
                        </td>

                        <td className="p-4 font-medium text-slate-700">
                          {pr.requestedBy}
                        </td>

                        <td className="p-4 font-mono font-bold">
                          <div>{pr.requestedQty} {pr.unit}</div>
                          <div className="text-blue-700">Rp {pr.estimatedTotal?.toLocaleString('id-ID')}</div>
                        </td>

                        <td className="p-4 font-mono font-bold">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] border ${
                            isRejected 
                              ? 'bg-red-100 text-red-800 border-red-200' 
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            {pr.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          {isRejected ? (
                            <button
                              onClick={() => setActiveStage(2)}
                              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                              title="Re-input PR ini di Stage 2 dengan kuantitas yang disesuaikan"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                              Re-Input PR di Stage 2
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">Approved</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalPr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" /> Penolakan / Hold Transaksi PR
            </h3>

            <p className="text-xs text-slate-600">
              Masukkan alasan penolakan atau instruksi audit untuk <strong>{rejectModalPr.drugName} ({rejectModalPr.id})</strong>:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Risiko split purchase, konfirmasi ulang dosis ke komite farmasi."
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 font-sans"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalPr(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-md"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
