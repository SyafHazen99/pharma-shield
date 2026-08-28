import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Brain, 
  PlusCircle, 
  TrendingUp, 
  Send, 
  UserCheck,
  X,
  Sparkles
} from 'lucide-react';
import { evaluatePRRiskScore, calculateEOQ } from '../utils/aiEngine';

export default function Stage2PurchaseRequest({ 
  prs = [], 
  medicines = [], 
  suppliers = [], 
  selectedMed = null,
  onCreatePR, 
  setActiveStage 
}) {
  const [selectedDrugId, setSelectedDrugId] = useState(medicines[0]?.id || '');
  const [requestedQty, setRequestedQty] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [requesterName, setRequesterName] = useState('dr. Novia Dwi Anggraini');
  const [requesterUnit, setRequesterUnit] = useState('Instalasi Farmasi Utama');
  const [showModal, setShowModal] = useState(false);

  // Auto-fill form and open modal when Trigger Smart PR is clicked from Stage 1 Monitoring
  useEffect(() => {
    if (selectedMed && selectedMed.id) {
      setSelectedDrugId(selectedMed.id);
      const computed = selectedMed.eoq || (selectedMed.burnRateDaily ? calculateEOQ(selectedMed.burnRateDaily * 30 * 12) : 500);
      setRequestedQty(computed.toString());
      setUrgency(selectedMed.currentStock <= selectedMed.minSafetyStock ? 'HIGH' : 'NORMAL');
      setShowModal(true);
    }
  }, [selectedMed]);

  const selectedDrug = medicines.find(m => m?.id === selectedDrugId) || medicines[0] || {};
  const selectedSupplier = suppliers.find(s => s?.id === selectedDrug?.supplierId) || suppliers[0] || {};

  // Auto-calculated fields when selectedDrug changes
  const computedEOQ = selectedDrug?.eoq || (selectedDrug?.burnRateDaily ? calculateEOQ(selectedDrug.burnRateDaily * 30 * 12) : 500);
  const currentQty = requestedQty ? parseInt(requestedQty, 10) : computedEOQ;
  const unitPrice = selectedDrug?.unitPrice || 100000;
  const estimatedTotal = currentQty * unitPrice;

  // AI Risk Evaluation
  const riskEval = evaluatePRRiskScore(
    { requestedQty: currentQty, estimatedTotal },
    selectedDrug,
    selectedSupplier
  );

  const handleSubmitNewPR = (e) => {
    e.preventDefault();
    if (!requesterName.trim() || !selectedDrug?.id) return;

    const fullRequesterTitle = `${requesterName.trim()} (${requesterUnit.trim() || 'Farmasi'})`;

    const newPr = {
      id: `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      drugId: selectedDrug.id,
      drugName: selectedDrug.name || 'Obat Farmasi',
      requestedQty: currentQty,
      unit: selectedDrug.unit || 'Box',
      estimatedTotal,
      requestedBy: fullRequesterTitle,
      requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending Approval',
      urgency,
      riskScore: riskEval.score,
      riskFactors: riskEval.reasons,
      aiRecommendation: riskEval.recommendation
    };

    onCreatePR(newPr);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Stage Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <FileEdit className="w-3.5 h-3.5 text-blue-600" /> Tahap 2: Purchase Request (PR)
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Smart Purchase Request & User Credentials Entry
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Kepala Instalasi Farmasi • Formulir pengajuan reorder obat dengan input kredensial identitas pemohon, EOQ otomatis, dan deteksi risiko.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Buat PR Baru (Input Kredensial)
        </button>
      </div>

      {/* PR Cards / Active PR List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Daftar Transaksi Purchase Request ({prs.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {prs.map((pr) => {
            const getRiskBadge = (score) => {
              if (score >= 70) return { bg: 'bg-red-100 text-red-800 border-red-200', label: 'HIGH RISK' };
              if (score >= 40) return { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'MEDIUM RISK' };
              return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'LOW RISK' };
            };
            const riskBadge = getRiskBadge(pr?.riskScore || 0);

            return (
              <div 
                key={pr.id} 
                className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono text-blue-700 text-xs font-bold">
                      PR
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{pr?.drugName}</span>
                        <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                          {pr?.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-sans mt-0.5">
                        Pemohon Resmi: <strong className="text-slate-800 font-bold">{pr?.requestedBy}</strong> • Tanggal: {pr?.requestDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border ${riskBadge.bg}`}>
                      {riskBadge.label} ({pr?.riskScore || 0}%)
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      pr?.status === 'Approved' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : pr?.status === 'Pending Approval' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {pr?.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Kuantitas Dipesan</span>
                    <strong className="text-slate-900 text-sm font-mono font-bold">{pr?.requestedQty} {pr?.unit}</strong>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Estimasi Total Biaya</span>
                    <strong className="text-blue-700 text-sm font-mono font-bold">Rp {pr?.estimatedTotal?.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Urgency Level</span>
                    <strong className="text-amber-700 text-sm font-mono font-bold">{pr?.urgency}</strong>
                  </div>
                </div>

                {/* AI Intelligence Breakdown */}
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5 font-sans">
                      <Brain className="w-4 h-4 text-blue-600" /> Analisis AI Intelligence & Deteksi Anomali:
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700 pl-4 list-disc font-sans font-medium">
                    {pr?.riskFactors?.map((rf, idx) => (
                      <li key={idx} className={rf?.includes('Split Purchase') || rf?.includes('140%') ? 'text-red-700 font-bold' : ''}>
                        {rf}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-blue-200 text-xs font-sans text-blue-900">
                    <strong>Rekomendasi AI:</strong> {pr?.aiRecommendation}
                  </div>
                </div>

                {/* Action Trigger for Stage 3 Approval */}
                {pr?.status === 'Pending Approval' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setActiveStage(3)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      Proses ke Tahap 3 (Approval Keuangan)
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Form for Creating New Smart PR with User Credentials */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" /> Formulir Purchase Request & Kredensial Pemohon
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPR} className="space-y-4 text-xs font-sans">
              
              {/* User Credentials Input Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" /> Kredensial Identitas Pemohon (Apoteker / Staff):
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Nama & Gelar Pemohon:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: dr. Novia Dwi Anggraini"
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Unit Kerja / Jabatan:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Instalasi Farmasi Utama"
                      value={requesterUnit}
                      onChange={(e) => setRequesterUnit(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Select Drug */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Pilih Obat (Stok Kritis / Reorder):</label>
                <select
                  value={selectedDrugId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedDrugId(newId);
                    const targetMed = medicines.find(m => m.id === newId);
                    if (targetMed) {
                      const eoqVal = targetMed.eoq || (targetMed.burnRateDaily ? calculateEOQ(targetMed.burnRateDaily * 30 * 12) : 500);
                      setRequestedQty(eoqVal.toString());
                      setUrgency(targetMed.currentStock <= targetMed.minSafetyStock ? 'HIGH' : 'NORMAL');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-blue-700 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  {medicines.map((m) => (
                    <option key={m?.id} value={m?.id}>
                      {m?.name} ({m?.dosage}) - Stok Saat Ini: {m?.currentStock} {m?.unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* EOQ Recommendation Info Box */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                <div className="text-blue-800 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Kalkulasi EOQ Otomatis: {computedEOQ} {selectedDrug?.unit || 'Unit'}
                </div>
                <div className="text-slate-600 text-[11px] font-medium">
                  Rekomendasi jumlah pesanan paling ekonomis berdasarkan riwayat burn rate bulanan.
                </div>
              </div>

              {/* Requested Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Kuantitas Permintaan:</label>
                  <input
                    type="number"
                    value={requestedQty}
                    placeholder={`Contoh: ${computedEOQ}`}
                    onChange={(e) => setRequestedQty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Tingkat Urgensi:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-amber-800 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="NORMAL">NORMAL - Reorder Rutin</option>
                    <option value="HIGH">HIGH - Stok Mendekati Habis</option>
                    <option value="CRITICAL">EMERGENCY - Cito Rawat Inap</option>
                  </select>
                </div>
              </div>

              {/* Live Risk Preview Widget */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Live AI Risk Score Calculator:</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold font-mono ${
                    riskEval.score >= 70 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Score: {riskEval.score}%
                  </span>
                </div>
                <div className="text-slate-600 font-medium">
                  Estimasi Total: <strong className="text-blue-700 font-mono font-bold">Rp {estimatedTotal?.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit PR dengan Kredensial
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
