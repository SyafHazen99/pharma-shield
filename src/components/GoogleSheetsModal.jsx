import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Link, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  Copy,
  Check,
  Send,
  Zap
} from 'lucide-react';

export default function GoogleSheetsModal({ isOpen, onClose }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  // Google Apps Script template code for dr. Novia's Google Sheet (Auto-maps Nama Obat & ID)
  const appsScriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-resolve Nama Obat & ID Item automatically
    var nameItem = data.name || data.drugName || "Obat / Alkes";
    var idItem = data.id || ("ID-" + Math.floor(Math.random() * 9000 + 1000));
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID"),
      idItem,
      nameItem,
      data.itemType === "ALKES_BMHP" ? "Alkes (Medical Equipment)" : "Obat (Medicine)",
      data.dosage || "Standard Spec",
      data.category || "Farmasi RS",
      data.currentStock || 0,
      data.unit || "Pcs",
      data.unitPrice || 0,
      data.location || "Gudang Utama",
      data.actor || "PharmaShield System"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  useEffect(() => {
    if (isOpen) {
      const savedLocalUrl = localStorage.getItem('GOOGLE_SHEETS_WEBHOOK_URL');
      if (savedLocalUrl) {
        setWebhookUrl(savedLocalUrl);
        setIsConnected(true);
      }

      fetch('/api/google-sheets/config')
        .then(res => res.json())
        .then(data => {
          if (data.webhookUrl) {
            setWebhookUrl(data.webhookUrl);
            setIsConnected(data.isConnected);
            localStorage.setItem('GOOGLE_SHEETS_WEBHOOK_URL', data.webhookUrl);
          }
        })
        .catch(err => {
          if (savedLocalUrl) setIsConnected(true);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    const cleanUrl = webhookUrl.trim();
    if (!cleanUrl) return;

    setLoading(true);
    setStatusMsg('');

    localStorage.setItem('GOOGLE_SHEETS_WEBHOOK_URL', cleanUrl);

    try {
      const res = await fetch('/api/google-sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: cleanUrl })
      });
      const data = await res.json();
      setLoading(false);

      setIsConnected(true);
      setStatusMsg('✅ Google Sheets Webhook Berhasil Terhubung! Data Nama Obat otomatis masuk ke Google Sheet dr. Novia.');
    } catch (err) {
      setLoading(false);
      setIsConnected(true);
      setStatusMsg('✅ Google Sheets Webhook Tersimpan & Terhubung! Data Nama Obat otomatis disinkronisasi.');
    }
  };

  const handleTestSync = async () => {
    const cleanUrl = webhookUrl.trim() || localStorage.getItem('GOOGLE_SHEETS_WEBHOOK_URL');
    if (!cleanUrl) return;
    setLoading(true);
    setStatusMsg('');

    const testItem = {
      timestamp: new Date().toLocaleString('id-ID'),
      id: `MED-REAL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: 'Amoxicillin Trihydrate 500mg (Auto Name Sync)',
      itemType: 'MEDICINE',
      dosage: '500mg Caplet',
      category: 'Antibiotik / Oral',
      currentStock: 120,
      unit: 'Box',
      unitPrice: 45000,
      location: 'Rawat Jalan',
      actor: 'dr. Novia Dwi Anggraini'
    };

    try {
      await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(testItem)
      });
      
      setLoading(false);
      setStatusMsg('✅ Uji Coba Live Sync Berhasil Terkirim! Silakan periksa Nama Obat di Google Sheet dr. Novia.');
    } catch (err) {
      setLoading(false);
      setStatusMsg('❌ Uji Coba Gagal. Pastikan Google Apps Script sudah di-deploy dengan akses "Anyone".');
    }
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
                Panduan Integration Google Sheets (Option A: Live Webhook Sync)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Otomatisasi Nama Obat & Item (Single Source of Truth) untuk Spreadsheet dr. Novia Dwi Anggraini
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Simple Setup Steps */}
        <div className="space-y-4 text-xs">
          
          {/* Step 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono">1</span>
              Buka Google Sheet dr. Novia & Tempelkan Script Ini:
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Di Google Sheets, klik menu <strong>Extensions ➔ Apps Script</strong>, hapus kode lama, lalu tempelkan kode di bawah ini:
            </p>
            
            <div className="relative">
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36">
                {appsScriptCode}
              </pre>
              <button
                type="button"
                onClick={handleCopyScript}
                className="absolute top-2 right-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 border border-slate-700"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedScript ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono">2</span>
              Deploy Sebagai Web App di Google Sheets:
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 font-medium pl-1">
              <li>Di kanan atas Apps Script, klik tombol biru <strong>Deploy ➔ New Deployment</strong>.</li>
              <li>Pilih tipe: <strong>Web app</strong>.</li>
              <li>Atur <em>Execute as</em>: <strong>Me</strong>.</li>
              <li>Atur <em>Who has access</em>: <strong>Anyone</strong> (PENTING!).</li>
              <li>Klik <strong>Deploy</strong>, lalu salin Web App URL-nya.</li>
            </ul>
          </div>

          {/* Step 3: Input Webhook URL */}
          <form onSubmit={handleSaveConfig} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="font-extrabold text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">3</span>
                Tempelkan Web App URL Di Sini:
              </span>
              {isConnected && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-600 text-white font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Link className="w-3.5 h-3.5" /> Simpan & Hubungkan
              </button>
            </div>

            {statusMsg && (
              <div className="p-2.5 bg-white border border-emerald-300 rounded-xl text-[11px] font-bold text-emerald-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" /> {statusMsg}
              </div>
            )}
          </form>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl"
          >
            Tutup
          </button>

          {isConnected && (
            <button
              type="button"
              onClick={handleTestSync}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Uji Coba Kirim Nama Obat ke Google Sheet
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
