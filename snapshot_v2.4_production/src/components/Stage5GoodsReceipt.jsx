import React, { useState, useRef, useEffect } from 'react';
import { 
  ScanLine, 
  Camera, 
  CheckCircle2, 
  AlertOctagon, 
  Brain, 
  Sparkles, 
  Zap,
  ShieldAlert,
  XCircle
} from 'lucide-react';
import { processCameraOCRScan } from '../utils/aiEngine';
import { saveSnapshotToDisk } from '../services/apiClient';

export default function Stage5GoodsReceipt({ 
  pos = [], 
  receipts = [], 
  onSaveReceipt, 
  setActiveStage 
}) {
  const pendingPos = pos.filter(p => p.status === 'Ordered');

  const [selectedPoId, setSelectedPoId] = useState(pendingPos[0]?.id || pos[0]?.id || '');
  const [actualQty, setActualQty] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [packagingCondition, setPackagingCondition] = useState('GOOD');
  const [receiverName, setReceiverName] = useState('Apt. Budi Santoso, S.Farm');

  // Real Web Camera Stream State
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [cvAnalyzing, setCvAnalyzing] = useState(false);
  const [ocrScanResult, setOcrScanResult] = useState(null);

  const selectedPO = pos.find(p => p.id === selectedPoId) || pos[0] || {};

  // Initialize or Stop Camera Stream
  useEffect(() => {
    let streamInstance = null;

    if (cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'environment' } })
        .then((stream) => {
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError('');
        })
        .catch((err) => {
          console.error("Camera access error:", err);
          setCameraError('Gagal mengakses kamera fisik webcam device. Pastikan izin kamera aktif.');
          setCameraActive(false);
        });
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  // Capture Frame & Run Strict Zero-Trust OCR Verification
  const handleCaptureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const base64Data = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(base64Data);

    // Trigger Strict AI Zero-Trust OCR Scan
    setCvAnalyzing(true);
    setTimeout(async () => {
      const ocrResult = processCameraOCRScan(canvas, batchNo, expiryDate);
      setOcrScanResult(ocrResult);
      setCvAnalyzing(false);

      const statusStr = ocrResult.labelDetected ? 'ACCEPTED' : 'REJECTED';

      // Save snapshot to local disk (/api/snapshots/save)
      await saveSnapshotToDisk({
        imageBase64: base64Data,
        status: statusStr,
        batchNumber: ocrResult.batchNumber,
        confidence: ocrResult.confidence,
        errorReason: ocrResult.errorReason
      });

      if (ocrResult.labelDetected) {
        if (ocrResult.batchNumber && ocrResult.batchNumber !== 'NOT DETECTED') {
          setBatchNo(ocrResult.batchNumber);
        }
        if (ocrResult.expiryDate && ocrResult.expiryDate !== 'NOT DETECTED') {
          setExpiryDate(ocrResult.expiryDate);
        }
        if (!actualQty) {
          setActualQty((selectedPO.orderedQty || 100).toString());
        }
      }
    }, 800);
  };

  const handleSaveReceiptSubmit = (e) => {
    e.preventDefault();
    if (!selectedPO.id) return;

    const receivedQtyNum = actualQty ? parseInt(actualQty, 10) : selectedPO.orderedQty;
    const isDiscrepancy = receivedQtyNum !== selectedPO.orderedQty || packagingCondition === 'DAMAGED';

    const newReceipt = {
      id: `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poId: selectedPO.id,
      drugId: selectedPO.drugId,
      drugName: selectedPO.drugName,
      orderedQty: selectedPO.orderedQty,
      receivedQty: receivedQtyNum,
      batchNo: batchNo || `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate,
      condition: packagingCondition,
      receivedBy: receiverName,
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cvVerified: ocrScanResult?.labelDetected || false,
      snapshotPath: capturedImage ? 'Snapshot Hardware Saved' : 'N/A',
      discrepancyFlag: isDiscrepancy,
      aiInspectionResult: ocrScanResult
    };

    onSaveReceipt(newReceipt);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Stage Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <ScanLine className="w-3.5 h-3.5 text-blue-600" /> Tahap 5: Goods Receipt & Computer Vision Inspection
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Verifikasi Penerimaan Barang Hardware Camera
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Apoteker Gudang • Tangkap foto paket fisik secara live, ekstraksi nomor batch & tanggal kadaluarsa otomatis dengan Zero-Trust OCR AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Real Web Camera Hardware Feed (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" /> Live Webcam Hardware Inspection
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              HD 1280x720 Capture
            </span>
          </div>

          {/* Camera Viewfinder Box */}
          <div className="relative aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-blue-300 overflow-hidden flex items-center justify-center">
            
            {cameraActive ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                
                {/* AI Bounding Box Overlay */}
                <div className="absolute inset-8 border-2 border-blue-600/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3 animate-pulse">
                  <div className="flex justify-between font-mono text-[10px] text-blue-700 bg-white/90 px-2 py-0.5 rounded-md font-bold">
                    <span>ZERO-TRUST OCR TARGET</span>
                    <span>LABEL DETECTION ACTIVE</span>
                  </div>
                  <div className="text-center text-[10px] text-blue-700 font-mono bg-white/90 py-1 rounded-md font-bold">
                    DEKATKAN LABEL / KEMASAN OBAT RESMI RS KE KAMERA
                  </div>
                </div>
              </>
            ) : capturedImage ? (
              <img src={capturedImage} alt="Hardware Snapshot" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-center p-6 space-y-3">
                <Camera className="w-12 h-12 mx-auto text-blue-400" />
                <div className="text-xs text-slate-600 font-bold">Kamera Web Standby</div>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Klik tombol di bawah untuk mengaktifkan webcam dan mengambil foto paket obat fisik.
                </p>
              </div>
            )}

            {cvAnalyzing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
                <Brain className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-xs font-bold text-blue-700 font-mono">Memverifikasi Kepadatan Teks & OCR AI...</span>
              </div>
            )}

          </div>

          {/* Camera Action Controls */}
          <div className="flex items-center gap-3">
            {!cameraActive ? (
              <button
                type="button"
                onClick={() => setCameraActive(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-2"
              >
                <Camera className="w-4 h-4" /> Buka Kamera Hardware
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Tangkap Snapshot & Ekstrak Data OCR
              </button>
            )}

            {capturedImage && (
              <button
                type="button"
                onClick={() => {
                  setCapturedImage(null);
                  setOcrScanResult(null);
                }}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200"
              >
                Reset Foto
              </button>
            )}
          </div>

          {/* Zero-Trust OCR Verification Status Banner */}
          {ocrScanResult && (
            <div className={`p-4 rounded-2xl border text-xs font-sans space-y-2 ${
              ocrScanResult.labelDetected 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              <div className="font-extrabold flex items-center gap-2 text-sm">
                {ocrScanResult.labelDetected ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>LABEL OBAT RESMI TERDITEKSI (OCR Validated)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>PENOLAKAN KEAMANAN: Wajah / Objek Non-Label Terdeteksi!</span>
                  </>
                )}
              </div>

              {ocrScanResult.labelDetected ? (
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700 pt-1">
                  <div>Nomor Batch Scanned: <strong>{ocrScanResult.batchNumber}</strong></div>
                  <div>Kadaluarsa Scanned: <strong>{ocrScanResult.expiryDate}</strong></div>
                  <div>OCR Confidence: <strong className="text-emerald-700">{ocrScanResult.confidence}</strong></div>
                  <div>Disimpan ke Disk: <strong className="text-blue-700">server/snapshots/</strong></div>
                </div>
              ) : (
                <p className="text-red-700 font-mono text-[11px] leading-relaxed font-semibold">
                  {ocrScanResult.errorReason}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Receipt Input Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Form Berita Acara Penerimaan Barang
          </h3>

          <form onSubmit={handleSaveReceiptSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Select PO */}
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Pilih PO yang Diterima:</label>
              <select
                value={selectedPoId}
                onChange={(e) => setSelectedPoId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-blue-700 font-bold focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                {pos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.drugName} ({p.orderedQty} Unit) • {p.vendorName}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Received & Condition */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="space-y-1">
                <label className="text-slate-700 font-sans font-bold">Jumlah Diterima Fisik:</label>
                <input
                  type="number"
                  value={actualQty}
                  placeholder={`Order: ${selectedPO.orderedQty || 100}`}
                  onChange={(e) => setActualQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-sans font-bold">Kondisi Kemasan:</label>
                <select
                  value={packagingCondition}
                  onChange={(e) => setPackagingCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                >
                  <option value="GOOD">GOOD - Utuh & Segel</option>
                  <option value="DAMAGED">DAMAGED - Rusak / Bocor</option>
                </select>
              </div>
            </div>

            {/* Batch & Expiry Date */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="space-y-1">
                <label className="text-slate-700 font-sans font-bold">Nomor Batch OCR:</label>
                <input
                  type="text"
                  value={batchNo}
                  placeholder="Terisi otomatis dari foto"
                  onChange={(e) => setBatchNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-sans font-bold">Kadaluarsa (ED):</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
              </div>
            </div>

            {/* Receiver Name */}
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Apoteker Penerima Gudang:</label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
              />
            </div>

            {/* Submit GR Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan Berita Acara Penerimaan (GR)
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
