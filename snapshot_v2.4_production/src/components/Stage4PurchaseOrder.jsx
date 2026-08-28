import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingDown, 
  Building2, 
  Send, 
  CheckCircle2, 
  PlusCircle, 
  UserCheck, 
  Star,
  X
} from 'lucide-react';
import { benchmarkVendorPrice } from '../utils/aiEngine';

export default function Stage4PurchaseOrder({ 
  prs = [], 
  pos = [], 
  suppliers = [], 
  onCreatePO, 
  onAddSupplier,
  onProceedToReceipt,
  setActiveStage 
}) {
  const approvedPrs = prs.filter(p => p.status === 'Approved');

  const [selectedPrId, setSelectedPrId] = useState(approvedPrs[0]?.id || '');
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [officerName, setOfficerName] = useState('Siti Rahma, S.E.');
  const [officerUnit, setOfficerUnit] = useState('Divisi Pengadaan & Logistik');

  // New Supplier Registration Modal State
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierRating, setNewSupplierRating] = useState('4.8');
  const [newSupplierSLA, setNewSupplierSLA] = useState('1.5 Hari');
  const [newSupplierBenchmark, setNewSupplierBenchmark] = useState('Normal (0%)');
  const [newSupplierRisk, setNewSupplierRisk] = useState('LOW');
  const [regMode, setRegMode] = useState('MANUAL'); // 'MANUAL' | 'AUTO'

  const selectedPR = prs.find(p => p.id === selectedPrId) || approvedPrs[0] || {};
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0] || {};

  const estimatedPrice = selectedPR.estimatedTotal && selectedPR.requestedQty 
    ? Math.round(selectedPR.estimatedTotal / selectedPR.requestedQty) 
    : 100000;

  const benchmarkResult = benchmarkVendorPrice(estimatedPrice, selectedSupplier.priceBenchmarkIndex);

  const handleCreatePO = (e) => {
    e.preventDefault();
    if (!selectedPR.id || !selectedSupplier.id) return;

    const fullOfficerTitle = `${officerName.trim()} (${officerUnit.trim() || 'Purchasing'})`;

    const newPO = {
      id: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      prId: selectedPR.id,
      drugId: selectedPR.drugId,
      drugName: selectedPR.drugName,
      vendorId: selectedSupplier.id,
      vendorName: selectedSupplier.name,
      orderedQty: selectedPR.requestedQty,
      unitPrice: benchmarkResult.negotiatedPrice,
      totalAmount: benchmarkResult.negotiatedPrice * selectedPR.requestedQty,
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 10),
      expectedDelivery: '2026-08-12',
      status: 'Ordered',
      priceBenchmarked: true,
      priceDelta: benchmarkResult.priceDelta,
      pic: fullOfficerTitle
    };

    onCreatePO(newPO);
  };

  const handleRegisterSupplierSubmit = (e) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return;

    const newSupp = {
      id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: newSupplierName.trim(),
      rating: parseFloat(newSupplierRating) || 4.5,
      deliverySLA: newSupplierSLA,
      priceBenchmarkIndex: newSupplierBenchmark,
      reliabilityScore: 95,
      riskLevel: newSupplierRisk,
      status: regMode === 'AUTO' ? 'Auto-Benchmarked Vendor' : 'Verified Vendor'
    };

    onAddSupplier(newSupp);
    setSelectedSupplierId(newSupp.id);
    setShowSupplierModal(false);
    setNewSupplierName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Tahap 4: Purchase Order (PO) & Vendor Benchmarking
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Penerbitan PO Resmi & Registrasi Supplier
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Tim Purchasing • Negosiasi harga vendor otomatis dengan benchmark indeks pasar dan penerbitan PO resmi.
          </p>
        </div>

        <button
          onClick={() => setShowSupplierModal(true)}
          className="px-4 py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-700 border border-slate-200 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          + Registrasi Supplier Baru
        </button>
      </div>

      {/* Main PO Creation Form & Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Formulir Penerbitan PO Resmi
          </h3>

          <form onSubmit={handleCreatePO} className="space-y-4 text-xs font-sans">
            
            {/* Purchasing Credentials */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5 font-mono">
                <UserCheck className="w-4 h-4 text-blue-600" /> Kredensial Officer Purchasing:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Nama Officer:</label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Unit Kerja:</label>
                  <input
                    type="text"
                    value={officerUnit}
                    onChange={(e) => setOfficerUnit(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Select Approved PR */}
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Pilih PR yang Telah Disetujui (Approved):</label>
              <select
                value={selectedPrId}
                onChange={(e) => setSelectedPrId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-blue-700 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                {approvedPrs.map((pr) => (
                  <option key={pr.id} value={pr.id}>
                    {pr.id} - {pr.drugName} ({pr.requestedQty} {pr.unit}) • Est: Rp {pr.estimatedTotal?.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Supplier */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold">Pilih Vendor / Supplier Resmi:</label>
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(true)}
                  className="text-blue-600 hover:underline text-[11px] font-bold"
                >
                  + Tambah Vendor
                </button>
              </div>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Rating: {s.rating} ★) • Index: {s.priceBenchmarkIndex}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit PO Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Terbitkan Purchase Order Resmi
            </button>

          </form>
        </div>

        {/* AI Benchmarking Result Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" /> Hasil Benchmarking Harga AI
            </h3>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Vendor Dipilih</span>
                <strong className="text-slate-900 font-sans">{selectedSupplier.name}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Indeks Pricing Benchmark</span>
                <strong className="text-blue-700">{selectedSupplier.priceBenchmarkIndex}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Harga Estimasi PR</span>
                <strong className="text-slate-700">Rp {estimatedPrice?.toLocaleString('id-ID')} / unit</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Harga Setelah Benchmark AI</span>
                <strong className="text-emerald-700 text-sm">Rp {benchmarkResult.negotiatedPrice?.toLocaleString('id-ID')} / unit</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-blue-700 font-bold">
                <span>Delta Efisiensi</span>
                <span>{benchmarkResult.priceDelta}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 text-xs font-medium">
              💡 <strong>AI Procurement Note:</strong> PO ini akan diterbitkan langsung dengan jaminan harga transparan bebas komisi ilegal.
            </div>
          </div>
        </div>

      </div>

      {/* PO History Table */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Riwayat Penerbitan Purchase Order ({pos.length})
        </h3>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4">ID PO & Obat</th>
                  <th className="p-4">Vendor / Supplier</th>
                  <th className="p-4">Kuantitas</th>
                  <th className="p-4">Total Nilai (IDR)</th>
                  <th className="p-4">Purchasing Officer</th>
                  <th className="p-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {po.drugName}
                      <div className="text-[10px] font-mono text-blue-600">{po.id}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{po.vendorName}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">{po.orderedQty} Unit</td>
                    <td className="p-4 font-mono text-blue-700 font-extrabold">
                      Rp {po.totalAmount?.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{po.pic}</td>
                    <td className="p-4">
                      <button
                        onClick={() => onProceedToReceipt(po.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl shadow-md shadow-blue-500/20 transition-all"
                      >
                        Proses Penerimaan Barang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Supplier Registration Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" /> + Registrasi Supplier / Vendor Baru
              </h3>
              <button onClick={() => setShowSupplierModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-sans">
              <button
                type="button"
                onClick={() => setRegMode('MANUAL')}
                className={`py-2 rounded-xl font-bold transition-all ${
                  regMode === 'MANUAL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
                }`}
              >
                Manual Input
              </button>
              <button
                type="button"
                onClick={() => setRegMode('AUTO')}
                className={`py-2 rounded-xl font-bold transition-all ${
                  regMode === 'AUTO' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
                }`}
              >
                Auto-Benchmark AI
              </button>
            </div>

            <form onSubmit={handleRegisterSupplierSubmit} className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Nama PT / Vendor Supplier:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Pharpros Tbk"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Rating Performance:</label>
                  <input
                    type="text"
                    value={newSupplierRating}
                    onChange={(e) => setNewSupplierRating(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">SLA Pengiriman:</label>
                  <input
                    type="text"
                    value={newSupplierSLA}
                    onChange={(e) => setNewSupplierSLA(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Pricing Benchmark Index:</label>
                <select
                  value={newSupplierBenchmark}
                  onChange={(e) => setNewSupplierBenchmark(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-blue-700 font-bold"
                >
                  <option value="Competitive (-2%)">Competitive (-2%)</option>
                  <option value="Normal (0%)">Normal (0%)</option>
                  <option value="Over Benchmark (+18%)">Over Benchmark (+18%)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-2xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-md"
                >
                  Daftarkan Vendor
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
