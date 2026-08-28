import React, { useState } from 'react';
import { 
  RotateCcw, 
  ArrowRight, 
  Boxes, 
  Calendar,
  Send,
  Building2,
  X,
  Layers
} from 'lucide-react';

export default function Stage6StockUpdate({ 
  goodsReceipts = [], 
  medicines = [], 
  onConfirmStockUpdate, 
  onRedistributeStock,
  setActiveStage 
}) {
  const [showRedistributeModal, setShowRedistributeModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [transferQty, setTransferQty] = useState('50');
  const [targetDepo, setTargetDepo] = useState('Depo IGD 24 Jam');

  // Sort active inventory by FEFO (First-Expired First-Out)
  const fefoSortedMedicines = [...medicines].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedMed) return;

    onRedistributeStock({
      medId: selectedMed.id,
      medName: selectedMed.name,
      transferQty: Number(transferQty) || 50,
      targetDepo,
      officerName: 'Apt. Budi Santoso, S.Farm'
    });

    setShowRedistributeModal(false);
    setSelectedMed(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Stage Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 whitespace-nowrap">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" /> Tahap 6: Stock Update & Automatic FEFO Ranking
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Pencatatan Kartu Stok Fisik & Ranking Kadaluarsa FEFO
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Kepala Instalasi Farmasi • Penambahan stok obat terverifikasi ke sistem persediaan aktif dan pengurutan First Expired, First Out.
          </p>
        </div>
      </div>

      {/* SECTION 1: Goods Receipts Stream Ready for Stock Entry */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2">
          <Boxes className="w-4 h-4 text-blue-600" /> Berita Acara Penerimaan Siap Masuk Stok ({goodsReceipts.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {goodsReceipts.length > 0 ? (
            goodsReceipts.map((gr) => {
              const med = medicines.find(m => m.name.includes(gr.drugName) || gr.drugName.includes(m.name)) || {};
              const initialStock = med.currentStock || 100;
              const addedQty = gr.receivedQty || gr.expectedQty || 100;
              const newTotalStock = initialStock + addedQty;

              return (
                <div 
                  key={gr.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono text-blue-700 text-xs font-bold shrink-0">
                        GR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">{gr.drugName}</span>
                          <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold whitespace-nowrap">
                            {gr.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          Penerima: <strong className="text-slate-800">{gr.inspectedBy || gr.receivedBy || 'Apt. Budi Santoso'}</strong> • Waktu: {gr.receivedDate}
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-mono text-xs font-bold whitespace-nowrap shrink-0 self-start md:self-auto">
                      OCR Vision Verified
                    </span>
                  </div>

                  {/* Stock Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Stok Fisik Awal</span>
                      <strong className="text-slate-900 text-sm font-mono font-bold">{initialStock} Unit</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">+ Penambahan GR</span>
                      <strong className="text-emerald-700 text-sm font-mono font-bold">+{addedQty} Unit</strong>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Stok Baru Setelah Update</span>
                      <strong className="text-blue-700 text-sm font-mono font-extrabold">{newTotalStock} Unit</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">FEFO Batch & ED</span>
                      <strong className="text-slate-800 text-xs font-mono font-bold">{gr.batchNoScanned || gr.batchNo || 'AMX-9901'} ({gr.expiryScanned || gr.expiryDate})</strong>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (onConfirmStockUpdate) onConfirmStockUpdate(gr.id, gr.drugId, addedQty);
                        setActiveStage(7);
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      Konfirmasi Kartu Stok & Lanjut ke Invoice Payment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
              <Boxes className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-600">Belum Ada Penerimaan Barang Baru</div>
              <p className="text-[11px] text-slate-400">Selesaikan Stage 5 Goods Receipt untuk memicu penambahan stok otomatis.</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Active FEFO Stock Cards & Inter-Depo Stock Redistribution */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" /> Kartu Stok Aktif & FEFO Expiration Ranking ({fefoSortedMedicines.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-mono font-bold">Sorted by Nearest Expiry Date</span>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4 whitespace-nowrap min-w-[130px]">Rank FEFO</th>
                  <th className="p-4 min-w-[200px]">Nama Obat & Batch</th>
                  <th className="p-4 whitespace-nowrap">Kadaluarsa (ED)</th>
                  <th className="p-4 whitespace-nowrap">Stok Fisik Gudang</th>
                  <th className="p-4">Lokasi Rak</th>
                  <th className="p-4 text-right whitespace-nowrap">Aksi Redistribusi FEFO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {fefoSortedMedicines.map((med, idx) => (
                  <tr key={med.id} className="hover:bg-blue-50/40 transition-colors">
                    
                    {/* FEFO Priority Badge - Fixed whitespace-nowrap */}
                    <td className="p-4 font-bold whitespace-nowrap align-middle">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold border whitespace-nowrap inline-flex items-center justify-center shrink-0 ${
                        idx === 0 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        #{idx + 1} FEFO Priority
                      </span>
                    </td>

                    <td className="p-4 font-sans">
                      <div className="font-extrabold text-slate-900 text-sm">{med.name}</div>
                      <div className="text-[11px] font-mono text-blue-600 font-semibold">{med.dosage} • Batch: {med.batchNo}</div>
                    </td>

                    <td className="p-4 text-slate-900 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 font-mono font-bold">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {med.expiryDate}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900 text-sm whitespace-nowrap">
                      {med.currentStock} {med.unit}
                    </td>

                    <td className="p-4 text-slate-600 text-xs font-sans font-medium">
                      {med.location}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedMed(med);
                          setShowRedistributeModal(true);
                        }}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 font-sans whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Transfer ke Depo
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Inter-Depo Stock Transfer */}
      {showRedistributeModal && selectedMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Transfer Redistribusi FEFO Inter-Depo
              </h3>
              <button onClick={() => setShowRedistributeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-extrabold text-slate-900">{selectedMed.name}</div>
                <div className="text-[11px] font-mono text-slate-500">Stok Gudang Utama: {selectedMed.currentStock} {selectedMed.unit} • Batch: {selectedMed.batchNo}</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Depo Tujuan Transfer:</label>
                <select
                  value={targetDepo}
                  onChange={(e) => setTargetDepo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                >
                  <option value="Depo IGD 24 Jam">Depo IGD 24 Jam</option>
                  <option value="Depo Rawat Inap Lt. 3">Depo Rawat Inap Lt. 3</option>
                  <option value="Depo Poliklinik Spesialis">Depo Poliklinik Spesialis</option>
                  <option value="Depo ICU Central">Depo ICU Central</option>
                </select>
              </div>

              <div className="space-y-1 font-mono">
                <label className="text-slate-700 font-sans font-bold">Jumlah Transfer ({selectedMed.unit}):</label>
                <input
                  type="number"
                  value={transferQty}
                  onChange={(e) => setTransferQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRedistributeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" /> Proses Transfer Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
