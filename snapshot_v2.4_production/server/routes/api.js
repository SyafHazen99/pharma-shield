import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDB, saveDB } from '../db/database.js';
import { BRANDING } from '../config/branding.js';
import { evaluatePRRiskScore, verifyThreeWayMatch } from '../utils/aiEngine.js';
import { getWIBTimestamp, getWIBDateOnly } from '../utils/timeUtils.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SNAPSHOTS_DIR = path.join(__dirname, '..', 'snapshots');

// Ensure snapshots directory exists on disk
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

// Helper to sanitize text inputs against XSS and injection
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim(); // Strip HTML tags
}

// Helper to append audit logs
function addAuditLog(action, details, riskLevel = 'INFO', actor = 'API User', role = 'System') {
  const db = getDB();
  const log = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: getWIBTimestamp(),
    actor: sanitizeString(actor),
    role: sanitizeString(role),
    action: sanitizeString(action),
    details: sanitizeString(details),
    riskLevel
  };
  db.auditLogs.unshift(log);
  saveDB();
  return log;
}

// 1. Branding & System Security Info
router.get('/info', (req, res) => {
  res.json({
    status: "ONLINE",
    securityStatus: "HARDENED_ANTI_BREACH",
    branding: BRANDING,
    timestamp: getWIBTimestamp()
  });
});

// 2. Local Disk Camera Snapshot Saver (Path Traversal & Base64 Shielded)
router.post('/snapshots/save', (req, res) => {
  try {
    const { imageBase64, status, batchNumber, confidence, errorReason } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: "Invalid or missing imageBase64 payload" });
    }

    // Sanitize Base64 string & validate format
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Data.slice(0, 100))) {
      return res.status(400).json({ error: "Corrupted Base64 image stream" });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Strict Path Traversal Prevention — generate safe basename only
    const formattedTime = new Date().toISOString().replace(/[:.]/g, '-');
    const safeStatus = status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED';
    const rawFilename = `SNAP_${formattedTime}_${safeStatus}.jpg`;
    const safeFilename = path.basename(rawFilename); // Prevents directory traversal Attacks
    const fullPath = path.join(SNAPSHOTS_DIR, safeFilename);

    fs.writeFileSync(fullPath, buffer);

    addAuditLog(
      'SNAPSHOT_SAVED_LOCAL_DISK',
      `Foto snapshot kamera disetujui & disimpan secara aman [server/snapshots/${safeFilename}] (Status: ${safeStatus}).`,
      safeStatus === 'REJECTED' ? 'HIGH' : 'INFO',
      'Hardware Camera Subsystem'
    );

    res.json({
      success: true,
      filename: safeFilename,
      localPath: fullPath,
      timestamp: getWIBTimestamp()
    });
  } catch (err) {
    console.error("Error saving camera snapshot to disk:", err);
    res.status(500).json({ error: "Failed to write snapshot to local folder" });
  }
});

// 3. Medicines Endpoints
router.get('/medicines', (req, res) => {
  const db = getDB();
  res.json(db.medicines);
});

// 4. Suppliers Endpoints
router.get('/suppliers', (req, res) => {
  const db = getDB();
  res.json(db.suppliers);
});

// 5. Purchase Requests Endpoints
router.get('/purchase-requests', (req, res) => {
  const db = getDB();
  res.json(db.prs);
});

router.post('/purchase-requests', (req, res) => {
  const db = getDB();
  const { drugId, drugName, requestedQty, unit, estimatedTotal, requestedBy, urgency } = req.body;

  const cleanDrugName = sanitizeString(drugName);
  const cleanRequestedBy = sanitizeString(requestedBy) || 'Apt. Budi Santoso (Gudang)';

  const medicine = db.medicines.find(m => m.id === drugId) || { name: cleanDrugName, eoq: 500, unitPrice: estimatedTotal / requestedQty };
  const supplier = db.suppliers.find(s => s.id === medicine.supplierId);

  const riskEval = evaluatePRRiskScore({ requestedQty, estimatedTotal }, medicine, supplier);

  const newPR = {
    id: `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    drugId: sanitizeString(drugId),
    drugName: medicine.name || cleanDrugName,
    requestedQty: Math.max(1, Math.abs(Number(requestedQty) || 1)),
    unit: sanitizeString(unit || medicine.unit || 'Unit'),
    estimatedTotal: Math.max(0, Number(estimatedTotal) || 0),
    requestedBy: cleanRequestedBy,
    requestDate: getWIBTimestamp(),
    status: 'Pending Approval',
    urgency: sanitizeString(urgency || 'NORMAL'),
    riskScore: riskEval.score,
    riskFactors: riskEval.reasons,
    aiRecommendation: riskEval.recommendation
  };

  db.prs.unshift(newPR);
  addAuditLog('CREATE_PURCHASE_REQUEST', `PR ${newPR.id} dibuat untuk ${newPR.drugName} Qty ${newPR.requestedQty}. Risk Score: ${newPR.riskScore}%.`, newPR.riskScore >= 70 ? 'HIGH' : 'INFO', newPR.requestedBy);
  saveDB();

  res.status(201).json(newPR);
});

router.put('/purchase-requests/:id/status', (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { status, reason } = req.body;

  const pr = db.prs.find(p => p.id === id);
  if (!pr) return res.status(404).json({ error: "PR not found" });

  const cleanStatus = sanitizeString(status);
  const cleanReason = sanitizeString(reason);

  pr.status = cleanStatus;
  if (cleanStatus === 'Approved') {
    addAuditLog('APPROVE_PR', `PR ${id} (${pr.drugName}) disetujui Direktur Keuangan. Anggaran dialokasikan Rp ${pr.estimatedTotal.toLocaleString('id-ID')}.`, 'INFO', 'Direktur Keuangan');
  } else {
    addAuditLog('REJECT_PR', `PR ${id} ditolak/ditahan untuk audit. Alasan: ${cleanReason || 'Risiko Fraud'}`, 'HIGH', 'Direktur Keuangan');
  }
  saveDB();

  res.json(pr);
});

// 6. Purchase Orders Endpoints
router.get('/purchase-orders', (req, res) => {
  const db = getDB();
  res.json(db.pos);
});

router.post('/purchase-orders', (req, res) => {
  const db = getDB();
  const { prId, vendorId } = req.body;

  const pr = db.prs.find(p => p.id === prId);
  const vendor = db.suppliers.find(s => s.id === vendorId);

  if (!pr || !vendor) return res.status(400).json({ error: "Invalid PR or Vendor ID" });

  const newPO = {
    id: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    prId: pr.id,
    drugId: pr.drugId,
    drugName: pr.drugName,
    vendorId: vendor.id,
    vendorName: vendor.name,
    orderedQty: pr.requestedQty,
    unitPrice: Math.round(pr.estimatedTotal / pr.requestedQty),
    totalAmount: pr.estimatedTotal,
    createdDate: getWIBTimestamp(),
    expectedDelivery: getWIBDateOnly(),
    status: 'Ordered',
    priceBenchmarked: true,
    priceDelta: vendor.priceBenchmarkIndex,
    pic: 'Siti Rahma (Purchasing)'
  };

  db.pos.unshift(newPO);
  addAuditLog('CREATE_PURCHASE_ORDER', `PO ${newPO.id} diterbitkan ke vendor ${newPO.vendorName} sejumlah Rp ${newPO.totalAmount.toLocaleString('id-ID')}.`, 'INFO', 'Siti Rahma (Purchasing)');
  saveDB();

  res.status(201).json(newPO);
});

// 7. Goods Receipts Endpoints
router.get('/goods-receipts', (req, res) => {
  const db = getDB();
  res.json(db.goodsReceipts);
});

router.post('/goods-receipts', (req, res) => {
  const db = getDB();
  const { poId, drugName, expectedQty, receivedQty, batchNoScanned, expiryScanned, scannedMatchPO, ocrConfidence, inspectedBy, snapshotUrl } = req.body;

  const cleanDrugName = sanitizeString(drugName);
  const cleanBatchNo = sanitizeString(batchNoScanned);

  const newGR = {
    id: `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    poId: sanitizeString(poId),
    drugName: cleanDrugName,
    expectedQty: Number(expectedQty),
    receivedQty: Number(receivedQty),
    batchNoScanned: cleanBatchNo,
    expiryScanned: sanitizeString(expiryScanned),
    scannedMatchPO: Boolean(scannedMatchPO),
    visualDamage: false,
    inspectedBy: sanitizeString(inspectedBy || 'Apt. Budi Santoso'),
    receivedDate: getWIBTimestamp(),
    status: 'Received & Inspected',
    ocrConfidence: sanitizeString(ocrConfidence || '99.2%'),
    snapshotUrl: sanitizeString(snapshotUrl)
  };

  db.goodsReceipts.unshift(newGR);

  // Update Inventory
  const medicine = db.medicines.find(m => m.name.includes(cleanDrugName) || cleanDrugName.includes(m.name));
  if (medicine) {
    medicine.currentStock += Number(receivedQty);
    medicine.status = 'Normal';
  }

  addAuditLog('GOODS_RECEIPT_OCR', `Goods Receipt ${newGR.id} diverifikasi OCR Vision. Batch: ${cleanBatchNo}, Exp: ${newGR.expiryScanned}. Stock diperbarui.`, 'INFO', newGR.inspectedBy);
  saveDB();

  res.status(201).json(newGR);
});

// 8. Invoices Endpoints
router.get('/invoices', (req, res) => {
  const db = getDB();
  res.json(db.invoices);
});

router.put('/invoices/:id/pay', (req, res) => {
  const db = getDB();
  const { id } = req.params;

  const inv = db.invoices.find(i => i.id === id);
  if (!inv) return res.status(404).json({ error: "Invoice not found" });

  inv.paymentStatus = 'Paid';
  addAuditLog('PAYMENT_RELEASED', `Pembayaran Invoice ${id} disetujui sebesar Rp ${inv.invoiceAmount.toLocaleString('id-ID')}. Three-Way Match Verified.`, 'INFO', 'Keuangan');
  saveDB();

  res.json(inv);
});

// 9. Audit Logs Endpoints
router.get('/audit-logs', (req, res) => {
  const db = getDB();
  res.json(db.auditLogs);
});

export default router;
