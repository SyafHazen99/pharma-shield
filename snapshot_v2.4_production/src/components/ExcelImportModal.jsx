import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight,
  Database,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { parseExcelFile } from '../utils/excelImporter';

export default function ExcelImportModal({ isOpen, onClose, onImportData }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successCount, setSuccessCount] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);
    setErrorMsg('');
    setSuccessCount(null);

    try {
      const items = await parseExcelFile(uploadedFile);
      setParsedData(items);
      setLoading(false);
    } catch (err) {
      console.error("Excel import failed:", err);
      setErrorMsg('Gagal membaca berkas Excel (.xlsx). Pastikan format tabel sesuai.');
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedData || parsedData.length === 0) return;

    onImportData(parsedData);
    setSuccessCount(parsedData.length);

    setTimeout(() => {
      onClose();
      setFile(null);
      setParsedData([]);
      setSuccessCount(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-2xl p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Import Data Excel (.xlsx / .csv)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pembaruan Katalog Stok Obat & Alkes dari Spreadsheet dr. Novia Dwi Anggraini
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successCount !== null ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-sm font-extrabold">Berhasil Mengimpor {successCount} Barang!</div>
              <div className="text-[11px] text-emerald-700 font-mono">Seluruh data obat & alkes dari spreadsheet Excel berhasil diinjeksi ke sistem.</div>
            </div>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 p-6 rounded-2xl text-center space-y-3 transition-all relative cursor-pointer">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-10 h-10 text-emerald-600 mx-auto" />
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {file ? file.name : 'Pilih atau Tarik Berkas Excel (.xlsx / .csv) Di Sini'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Mendukung berkas data baru dari dr. Novia Dwi Anggraini (Kolom: Nama, Dosis, Stok, Harga, Unit, Kategori)
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-4 text-xs font-bold text-emerald-700 font-mono animate-pulse flex items-center justify-center gap-2">
                <FileSpreadsheet className="w-5 h-5 animate-spin text-emerald-600" />
                Mengekstrak dan memverifikasi baris data Excel...
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" /> {errorMsg}
              </div>
            )}

            {/* Parsed Preview Table */}
            {parsedData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" /> Preview Baris Ekstraksi ({parsedData.length} Barang)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    Ready to Inject
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200 font-bold sticky top-0">
                      <tr>
                        <th className="p-3">Nama Barang</th>
                        <th className="p-3">Dosis / Spec</th>
                        <th className="p-3">Stok</th>
                        <th className="p-3">Harga Satuan</th>
                        <th className="p-3">Tipe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {parsedData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-sans font-bold text-slate-900">{item.name}</td>
                          <td className="p-3 text-slate-600">{item.dosage}</td>
                          <td className="p-3 font-bold text-emerald-700">{item.currentStock} {item.unit}</td>
                          <td className="p-3">Rp {item.unitPrice.toLocaleString('id-ID')}</td>
                          <td className="p-3 font-sans">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.itemType === 'ALKES_BMHP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.itemType === 'ALKES_BMHP' ? 'ALKES' : 'OBAT'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl"
          >
            Batal
          </button>

          {parsedData.length > 0 && (
            <button
              type="button"
              onClick={handleConfirmImport}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <Database className="w-4 h-4" /> Import {parsedData.length} Barang ke Sistem RS
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
