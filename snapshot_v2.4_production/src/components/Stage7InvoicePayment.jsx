import React, { useState } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Lock, 
  XCircle,
  FileCheck,
  Upload,
  Eye,
  X,
  Building2,
  Printer
} from 'lucide-react';

export default function Stage7InvoicePayment({ 
  invoices = [], 
  pos = [], 
  onUploadInvoice,
  onPayInvoice, 
  onFlagDiscrepancy 
}) {
  const [rejectModalInv, setRejectModalInv] = useState(null);
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  
  // Invoice Document Preview Modal
  const [previewInvModal, setPreviewInvModal] = useState(null);

  // Upload/Input Vendor Invoice Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPoId, setUploadPoId] = useState(pos[0]?.id || '');
  const [customInvoiceNo, setCustomInvoiceNo] = useState('');
  const [customBilledAmount, setCustomBilledAmount] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const selectedPOForUpload = pos.find(p => p.id === uploadPoId) || pos[0] || {};

  const handleConfirmDiscrepancyFlag = () => {
    if (!rejectModalInv) return;
    onFlagDiscrepancy(rejectModalInv.id, discrepancyReason);
    setRejectModalInv(null);
    setDiscrepancyReason('');
  };

  const handleUploadInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!selectedPOForUpload.id) return;

    const billedNum = customBilledAmount ? Number(customBilledAmount) : selectedPOForUpload.totalAmount;
    const poAmt = selectedPOForUpload.totalAmount || 100000000;
    const delta = billedNum - poAmt;
    const isDiscrepancy = delta !== 0;

    const newInv = {
      id: customInvoiceNo.trim() || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poId: selectedPOForUpload.id,
      vendorName: selectedPOForUpload.vendorName || 'PT Kimia Farma Trading',
      drugName: selectedPOForUpload.drugName || 'Obat Farmasi',
      poAmount: poAmt,
      receivedQty: selectedPOForUpload.orderedQty || 100,
      invoiceAmount: billedNum,
      threeWayMatchStatus: isDiscrepancy ? 'DISCREPANCY' : 'MATCHED',
      paymentStatus: 'UNPAID',
      discrepancyDelta: delta,
      taxNpwp: '01.345.678.9-012.000',
      auditNotes: isDiscrepancy 
        ? `ALERT DISCREPANCY: Tagihan vendor (Rp ${billedNum.toLocaleString('id-ID')}) memiliki selisih Rp ${delta.toLocaleString('id-ID')} dibanding PO.` 
        : 'Verifikasi e-Invoice Berhasil. Data 3-Way Match PO vs GR vs Invoice cocok 100%.'
    };

    onUploadInvoice(newInv);
    setShowUploadModal(false);
    setCustomInvoiceNo('');
    setCustomBilledAmount('');
    setCustomNotes('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Stage Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Receipt className="w-3.5 h-3.5 text-blue-600" /> Tahap 7: 3-Way Match Invoice & Final Payment
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Verifikasi Tagihan 3-Way Match (PR vs PO vs GR vs Invoice)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Divisi Keuangan RS • Verifikasi otomatis pencocokan 3 arah untuk mendeteksi penagihan ganda, phantom billing, atau selisih harga vendor sebelum pembayaran dilakukan.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0"
        >
          <Upload className="w-4 h-4" />
          Terima / Unggah Faktur Tagihan Vendor
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
          Daftar Tagihan Vendor e-Invoice ({invoices.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {invoices.map((inv) => {
            const isDiscrepancy = inv.threeWayMatchStatus === 'DISCREPANCY';

            return (
              <div 
                key={inv.id}
                className={`bg-white p-6 rounded-3xl border space-y-4 shadow-sm transition-all ${
                  isDiscrepancy ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono text-blue-700 text-xs font-bold shrink-0">
                      INV
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{inv.vendorName}</span>
                        <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                          {inv.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        Item: <strong className="text-slate-800">{inv.drugName}</strong> • Ref PO: {inv.poId} • Tanggal: {inv.invoiceDate || 'Live WIB'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      isDiscrepancy ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      3-Way Match: {inv.threeWayMatchStatus}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.paymentStatus === 'PAID' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : inv.paymentStatus === 'FLAGGED'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* 3-Way Match Comparison Table */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-sans">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">1. Purchase Order (PO)</span>
                    <strong className="text-slate-900 text-xs font-mono font-bold">Rp {inv.poAmount?.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">2. Goods Receipt (GR)</span>
                    <strong className="text-slate-900 text-xs font-mono font-bold">{inv.receivedQty || 1200} Unit</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">3. Invoice Vendor</span>
                    <strong className="text-blue-700 text-xs font-mono font-extrabold">Rp {inv.invoiceAmount?.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Selisih Discrepancy</span>
                    <strong className={`text-xs font-mono font-bold ${isDiscrepancy ? 'text-red-600' : 'text-emerald-700'}`}>
                      {inv.discrepancyDelta ? `Rp ${inv.discrepancyDelta.toLocaleString('id-ID')}` : 'Rp 0 (Sesuai)'}
                    </strong>
                  </div>
                </div>

                {/* AI Audit Security Details */}
                <div className={`p-4 rounded-2xl space-y-2 border text-xs ${
                  isDiscrepancy ? 'bg-red-50 border-red-200 text-red-900' : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 font-sans">
                    <Brain className="w-4 h-4 text-blue-600" /> Hasil Audit AI 3-Way Match & Fraud Index:
                  </div>
                  <div className="text-slate-700 font-medium leading-relaxed">
                    {inv.auditNotes || 'Seluruh data PO, GR, dan Invoice cocok 100%. Bebas dari indikasi phantom billing.'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setPreviewInvModal(inv)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-blue-600" /> Lihat Dokumen Faktur Digital (e-Invoice)
                  </button>

                  {inv.paymentStatus === 'UNPAID' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRejectModalInv(inv)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-red-600" /> Flag Discrepancy / Tahan Tagihan
                      </button>

                      <button
                        onClick={() => onPayInvoice(inv.id)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Eksekusi Pembayaran Tagihan RS
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Vendor Invoice Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" /> Penerimaan & Upload Faktur Vendor (e-Invoice)
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadInvoiceSubmit} className="space-y-4 text-xs font-sans">
              
              {/* Select Target PO */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Pilih Referensi Purchase Order (PO):</label>
                <select
                  value={uploadPoId}
                  onChange={(e) => setUploadPoId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-blue-700 font-bold"
                >
                  {pos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.drugName} (Rp {p.totalAmount?.toLocaleString('id-ID')}) • {p.vendorName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Invoice No */}
              <div className="space-y-1 font-mono">
                <label className="text-slate-700 font-sans font-bold">Nomor Faktur Vendor (e-Invoice No):</label>
                <input
                  type="text"
                  placeholder="Contoh: INV-2026-9988"
                  value={customInvoiceNo}
                  onChange={(e) => setCustomInvoiceNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
              </div>

              {/* Billed Amount */}
              <div className="space-y-1 font-mono">
                <label className="text-slate-700 font-sans font-bold">Nominal Ditagihkan Vendor (Rp):</label>
                <input
                  type="number"
                  placeholder={`Default PO: ${selectedPOForUpload.totalAmount}`}
                  value={customBilledAmount}
                  onChange={(e) => setCustomBilledAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
              </div>

              {/* File Attachment Simulation */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
                <div className="font-bold text-blue-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" /> Lampiran Berkas PDF / Scan e-Invoice Vendor:
                </div>
                <div className="flex items-center gap-2">
                  <input type="file" className="text-[11px] text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-2xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan & Verifikasi 3-Way Match
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Official Digital e-Invoice Document Preview Modal */}
      {previewInvModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 font-sans">
            
            {/* Header Document */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-extrabold text-blue-600 font-mono tracking-wider uppercase">FAKTUR TAGIHAN DIGITAL (e-INVOICE VENDOR)</div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{previewInvModal.vendorName}</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">NPWP: {previewInvModal.taxNpwp || '01.345.678.9-012.000'}</div>
              </div>
              <div className="text-right font-mono">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-xs">
                  {previewInvModal.id}
                </span>
                <div className="text-[11px] text-slate-500 mt-1">Ref PO: {previewInvModal.poId}</div>
              </div>
            </div>

            {/* Hospital & Billing Addresses */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Ditagihkan Kepada:</span>
                <div className="font-extrabold text-slate-900">RS SENTRA HEALTHCARE AI</div>
                <div className="text-slate-600">Jl. Healthcare Boulevard No. 88, Jakarta</div>
                <div className="text-slate-500">PIC Pembayaran: dr. Novia Dwi Anggraini</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Status Verifikasi System:</span>
                <div className="font-extrabold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3-Way Match Verified
                </div>
                <div className="text-slate-600 font-mono">Status Bayar: {previewInvModal.paymentStatus}</div>
                <div className="text-slate-500 font-mono">Discrepancy Delta: Rp {(previewInvModal.discrepancyDelta || 0).toLocaleString('id-ID')}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left font-sans">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Deskripsi Item Obat</th>
                    <th className="p-3">Kuantitas</th>
                    <th className="p-3 text-right">Harga Satuan</th>
                    <th className="p-3 text-right">Total Tagihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="p-3 font-sans font-bold text-slate-900">{previewInvModal.drugName}</td>
                    <td className="p-3 font-bold text-slate-800">{previewInvModal.receivedQty || 1200} Unit</td>
                    <td className="p-3 text-right">Rp {((previewInvModal.invoiceAmount || 100000000) / (previewInvModal.receivedQty || 1200)).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-extrabold text-blue-700">Rp {previewInvModal.invoiceAmount?.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <div className="text-xs text-blue-900 font-medium">
                Termin Pembayaran: <strong>Net 30 Days</strong> (Transfer Bank Mandiri Virtual Account RS)
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Yang Harus Dibayar</span>
                <strong className="text-lg font-mono font-extrabold text-blue-700">Rp {previewInvModal.invoiceAmount?.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl flex items-center gap-1.5 text-xs"
              >
                <Printer className="w-4 h-4" /> Cetak Faktur Digital (PDF)
              </button>

              <button
                onClick={() => setPreviewInvModal(null)}
                className="px-5 py-2 bg-blue-600 text-white font-extrabold rounded-2xl"
              >
                Tutup Dokumen
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Discrepancy Modal */}
      {rejectModalInv && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" /> Tahan Tagihan / Flag Discrepancy
            </h3>

            <p className="text-xs text-slate-600">
              Masukkan catatan ketidakcocokan tagihan <strong>{rejectModalInv.id} ({rejectModalInv.vendorName})</strong>:
            </p>

            <textarea
              value={discrepancyReason}
              onChange={(e) => setDiscrepancyReason(e.target.value)}
              placeholder="Contoh: Selisih unit price Rp 15.000 / box dibanding kesepakatan PO."
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 font-sans"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalInv(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDiscrepancyFlag}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-md"
              >
                Konfirmasi Tahan Tagihan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
