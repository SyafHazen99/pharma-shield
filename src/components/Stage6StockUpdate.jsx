import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  ArrowRight, 
  Boxes, 
  Calendar,
  Send,
  Building2,
  X,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { normalizeStockUnits } from '../utils/numberSanitizer';

export default function Stage6StockUpdate({ 
  goodsReceipts = [], 
  medicines = [], 
  onConfirmStockUpdate, 
  onRedistributeStock,
  setActiveStage 
}) {
  const [showRedistributeModal, setShowRedistributeModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [transferQty, setTransferQty] = useState('10');
  const [targetDepo, setTargetDepo] = useState('Rawat Jalan');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  // Sort active inventory by FEFO (First-Expired First-Out)
  const fefoSortedMedicines = [...medicines].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const totalPages = Math.ceil(fefoSortedMedicines.length / ITEMS_PER_PAGE) || 1;
  const paginatedFefoMedicines = fefoSortedMedicines.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleOpenTransferModal = (med) => {
    setSelectedMed(med);
    const defaultQty = Math.max(1, Math.min(med.currentStock, Math.round(med.currentStock * 0.25)));
    setTransferQty(String(defaultQty));
    setShowRedistributeModal(true);
  };

  const numQty = Number(transferQty) || 0;
  const currentStockVal = selectedMed ? normalizeStockUnits(selectedMed.currentStock) : 0;
  const isExceedingStock = numQty > currentStockVal;
  const isInvalidQty = numQty <= 0 || isExceedingStock;
  const remainingStock = Math.max(0, currentStockVal - numQty);

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedMed || isInvalidQty) return;

    onRedistributeStock({
      medId: selectedMed.id,
      drugName: selectedMed.name,
      qty: numQty,
      sourceLocation: selectedMed.location,
      targetLocation: targetDepo,
      timestamp: new Date().toLocaleString('id-ID')
    });

    setShowRedistributeModal(false);
    setSelectedMed(null);
  };

  const pendingGoodsReceipts = goodsReceipts.filter(g => g.status === 'RECEIVED_PENDING_STOCK_UPDATE');

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner Executive AI Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-emerald-800 text-white p-6 shadow-xl shadow-teal-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md whitespace-nowrap">
              <RotateCcw className="w-3.5 h-3.5 text-white animate-spin shrink-0" /> Stage 6 — Kartu Stok Fisik & FEFO Distribution
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Pembaruan Stok Fisik Real-Time & Transfer Ke Depo
            </h2>
            <p className="text-sm text-teal-100 max-w-3xl leading-relaxed font-medium">
              Konfirmasi penerimaan barang dari Stage 5 ke kartu stok gudang utama, serta fasilitasi redistribusi obat/alkes antar 4 depo ruangan berdasarkan prinsip FEFO.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveStage(1)}
              className="px-4 py-3 bg-white text-emerald-800 hover:bg-teal-50 text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Boxes className="w-4 h-4" />
              Monitoring Stok Depo
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Pending Goods Receipts Stock Confirmation List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Konfirmasi Stok Masuk dari Goods Receipt (Stage 5)
          </h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-mono font-bold">
            {pendingGoodsReceipts.length} Menunggu Update Stok
          </span>
        </div>

        <div className="space-y-3">
          {pendingGoodsReceipts.length > 0 ? (
            pendingGoodsReceipts.map((gr) => {
              const med = medicines.find(m => m.id === gr.itemCode || m.name.toLowerCase().includes(gr.drugName?.toLowerCase())) || medicines[0];
              const addedQty = Number(gr.receivedQty) || 10;
              const initialStock = med ? normalizeStockUnits(med.currentStock) : 0;
              const newTotalStock = initialStock + addedQty;

              return (
                <div key={gr.id} className="p-5 bg-white rounded-3xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-500 font-bold">
                        <span>GR NO: {gr.grNo}</span>
                        <span className="text-slate-300">•</span>
                        <span>PO NO: {gr.poNo}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{gr.drugName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{gr.category || 'Farmasi Central'} • Batch: <strong className="font-mono text-slate-700">{gr.batchNo || 'BATCH-2026'}</strong></p>
                    </div>

                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-mono font-bold shrink-0 self-start sm:self-center">
                      PENDING STOCK UPDATE
                    </span>
                  </div>

                  {/* Stock Stream Update Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Stok Fisik Awal</span>
                      <strong className="text-slate-700 text-sm font-mono font-bold">{initialStock} {gr.unit || 'Unit'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-emerald-700 font-mono uppercase font-bold block">+ Masuk Penerimaan</span>
                      <strong className="text-emerald-700 text-sm font-mono font-extrabold">+{addedQty} {gr.unit || 'Unit'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-700 font-mono uppercase font-bold block">= Total Stok Baru</span>
                      <strong className="text-blue-900 text-sm font-mono font-extrabold">{newTotalStock} {gr.unit || 'Unit'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Vendor Supplier</span>
                      <strong className="text-slate-800 text-xs font-sans font-bold truncate block">{gr.supplierName || 'PT Kimia Farma'}</strong>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onConfirmStockUpdate(gr.id, med.id, addedQty)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Konfirmasi Update Kartu Stok Fisik
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 text-xs font-medium space-y-2">
              <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
              <div>Belum ada dokumen Goods Receipt baru yang menunggu konfirmasi stok.</div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Active Inventory FEFO Matrix & Inter-Depo Transfer */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Katalog Persediaan Aktif & Pengurutan FEFO (First-Expired, First-Out)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Obat dengan tanggal kadaluarsa terdekat secara otomatis ditempatkan di urutan teratas untuk dikonsumsi terlebih dahulu.
            </p>
          </div>

          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-mono font-bold shrink-0">
            {fefoSortedMedicines.length.toLocaleString('id-ID')} Item FEFO Active
          </span>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4">Rank FEFO</th>
                  <th className="p-4 min-w-[220px]">Nama Barang / Obat</th>
                  <th className="p-4">No. Batch</th>
                  <th className="p-4">Tgl Kadaluarsa (Expiry)</th>
                  <th className="p-4">Stok Fisik Tersedia</th>
                  <th className="p-4">Lokasi Asal</th>
                  <th className="p-4 text-right">Tindakan Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {paginatedFefoMedicines.map((med, index) => {
                  const actualRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                      
                      <td className="p-4 font-mono font-bold">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center justify-center ${
                          actualRank === 1 
                            ? 'bg-red-100 text-red-800 border border-red-300' 
                            : actualRank <= 3 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          #FEFO-{actualRank}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm">{med.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{med.dosage} • {med.category}</div>
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {med.batchNo}
                      </td>

                      <td className="p-4 font-mono font-bold whitespace-nowrap">
                        <span className="text-red-600 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {med.expiryDate}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-extrabold text-slate-900 whitespace-nowrap">
                        {med.currentStock} {med.unit}
                      </td>

                      <td className="p-4 text-slate-600 text-xs font-sans font-medium">
                        {med.location}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenTransferModal(med)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Transfer Ke Depo
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* High Performance Pagination Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border-t border-slate-200 text-xs font-mono">
            <div className="text-slate-600 font-medium font-sans">
              Menampilkan <strong className="text-slate-900 font-bold">{fefoSortedMedicines.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong> - <strong className="text-slate-900 font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, fefoSortedMedicines.length)}</strong> dari <strong className="text-blue-700 font-bold">{fefoSortedMedicines.length.toLocaleString('id-ID')} Total Items</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-bold transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200">
                Hal {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-bold transition-all flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Inter-Depo Stock Transfer */}
      {showRedistributeModal && selectedMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" /> Transfer Stok Ke Depo Ruangan
              </h3>
              <button 
                onClick={() => setShowRedistributeModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1 font-mono">
                <div className="text-indigo-900 font-extrabold text-sm">{selectedMed.name}</div>
                <div className="text-slate-600 font-sans text-xs">Lokasi Asal: <strong className="text-slate-900">{selectedMed.location}</strong></div>
                <div className="text-indigo-700 text-xs font-bold pt-1">Stok Fisik Tersedia: {currentStockVal} {selectedMed.unit}</div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Tujuan Transfer Depo *</label>
                <select
                  value={targetDepo}
                  onChange={(e) => setTargetDepo(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Rawat Jalan">🩺 Rawat Jalan (Depo Outpatient)</option>
                  <option value="Rawat Inap">🛏️ Rawat Inap (Depo Inpatient)</option>
                  <option value="Ruang Bayi">👶 Ruang Bayi (Depo NICU)</option>
                  <option value="Kamar Operasi">🔪 Kamar Operasi (Depo OK)</option>
                  <option value="Buyer">🛍️ Buyer (Pembeli / Pasien Outbound)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-600 font-bold">Jumlah Transfer ({selectedMed.unit}) *</label>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">Max: {currentStockVal} {selectedMed.unit}</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max={currentStockVal}
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className={`w-full p-3 rounded-xl border font-mono font-bold text-sm bg-white outline-none transition-all ${
                    isExceedingStock 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500 text-red-700 bg-red-50/30' 
                      : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-900'
                  }`}
                  placeholder="Masukkan jumlah fisik yang ditransfer"
                  required
                />
              </div>

              {/* 1-Click Preset Percentage Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-mono font-bold">Preset:</span>
                {[0.25, 0.50, 0.75, 1.0].map((pct) => {
                  const presetVal = Math.max(1, Math.min(currentStockVal, Math.round(currentStockVal * pct)));
                  const label = `${pct * 100}%`;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTransferQty(String(presetVal))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 text-[10px] font-mono font-bold rounded-lg border border-slate-200 transition-all"
                    >
                      {label} ({presetVal})
                    </button>
                  );
                })}
              </div>

              {/* Live Validation Alerts & Calculation Preview */}
              {isExceedingStock ? (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    Jumlah transfer ({numQty} {selectedMed.unit}) melebihi stok fisik yang ada ({currentStockVal} {selectedMed.unit})!
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Sisa Stok Di Depo Asal Setelah Transfer:</span>
                    <strong className="text-indigo-900 font-bold">{remainingStock} {selectedMed.unit}</strong>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRedistributeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isInvalidQty}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Kirim Transfer Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
