import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_store.json');

// Initial seed data
const INITIAL_DB = {
  medicines: [
    {
      id: "MED-001",
      name: "Morphine Sulfate Injection",
      dosage: "10mg/ml (1ml ampoule)",
      category: "Narkotika / Controlled Substance",
      currentStock: 45,
      unit: "Ampoule",
      minSafetyStock: 100,
      reorderPoint: 150,
      eoq: 300,
      unitPrice: 125000,
      burnRateDaily: 18.5,
      abnormalUsageSpike: true,
      abnormalUsageReason: "Deteksi lonjakan penggunaan 140% di Ruang Rawat Inap Lt 3",
      batchNo: "MRP-2026-X89",
      expiryDate: "2026-11-15",
      location: "Gudang B2 - Rak Narkotika (Locked)",
      status: "Need Reorder",
      fefoRank: 1,
      supplierId: "SUP-001"
    },
    {
      id: "MED-002",
      name: "Amoxicillin Trihydrate",
      dosage: "500mg Capsule",
      category: "Antibiotik",
      currentStock: 280,
      unit: "Box (100s)",
      minSafetyStock: 500,
      reorderPoint: 700,
      eoq: 1200,
      unitPrice: 85000,
      burnRateDaily: 42.0,
      abnormalUsageSpike: false,
      batchNo: "AMX-2026-004",
      expiryDate: "2027-05-20",
      location: "Gudang A1 - Rak 04",
      status: "Need Reorder",
      fefoRank: 3,
      supplierId: "SUP-002"
    },
    {
      id: "MED-003",
      name: "Insulin Glargine Pen",
      dosage: "100 IU/ml (3ml)",
      category: "Hormon / Cold Chain",
      currentStock: 120,
      unit: "Pen",
      minSafetyStock: 80,
      reorderPoint: 150,
      eoq: 400,
      unitPrice: 210000,
      burnRateDaily: 6.2,
      abnormalUsageSpike: false,
      batchNo: "INS-2025-C11",
      expiryDate: "2026-09-10",
      location: "Chiller Utama (2-8°C)",
      status: "Near Expiry",
      fefoRank: 1,
      supplierId: "SUP-003"
    },
    {
      id: "MED-004",
      name: "Remdesivir Vial",
      dosage: "100mg Injection",
      category: "Antiviral High Value",
      currentStock: 35,
      unit: "Vial",
      minSafetyStock: 50,
      reorderPoint: 80,
      eoq: 200,
      unitPrice: 1450000,
      burnRateDaily: 3.1,
      abnormalUsageSpike: false,
      batchNo: "RDV-2026-88B",
      expiryDate: "2027-08-01",
      location: "Gudang Khusus A2",
      status: "Need Reorder",
      fefoRank: 2,
      supplierId: "SUP-001"
    }
  ],
  suppliers: [
    {
      id: "SUP-001",
      name: "PT Kimia Farma Trading & Distribution",
      rating: 4.9,
      deliverySLA: "1.2 Hari",
      priceBenchmarkIndex: "Normal (0%)",
      reliabilityScore: 98,
      riskLevel: "LOW",
      status: "Verified Main Vendor"
    },
    {
      id: "SUP-002",
      name: "PT Kalbe Farma Tbk",
      rating: 4.8,
      deliverySLA: "1.5 Hari",
      priceBenchmarkIndex: "Competitive (-2%)",
      reliabilityScore: 96,
      riskLevel: "LOW",
      status: "Verified Main Vendor"
    },
    {
      id: "SUP-003",
      name: "PT Sanofi Indonesia",
      rating: 4.6,
      deliverySLA: "2.1 Hari",
      priceBenchmarkIndex: "Normal (+1%)",
      reliabilityScore: 92,
      riskLevel: "LOW",
      status: "Cold Chain Specialist"
    },
    {
      id: "SUP-004",
      name: "CV Medika Jaya Pharma (Third Party Broker)",
      rating: 3.2,
      deliverySLA: "4.5 Hari",
      priceBenchmarkIndex: "Over Benchmark (+18%)",
      reliabilityScore: 68,
      riskLevel: "HIGH",
      status: "Under Watchlist (Potential Fraud Risk)"
    }
  ],
  prs: [
    {
      id: "PR-2026-0801",
      drugId: "MED-001",
      drugName: "Morphine Sulfate Injection",
      requestedQty: 300,
      unit: "Ampoule",
      estimatedTotal: 37500000,
      requestedBy: "Apt. Budi Santoso, S.Farm (Gudang)",
      requestDate: "2026-08-06 09:30",
      status: "Pending Approval",
      urgency: "HIGH",
      riskScore: 78,
      riskFactors: [
        "Permintaan lonjakan +140% di luar pola histori normal",
        "Peringatan AI: Risiko penyalahgunaan obat Golongan Narkotika"
      ],
      aiRecommendation: "REJECT / HOLD FOR AUDIT"
    }
  ],
  pos: [
    {
      id: "PO-2026-0041",
      prId: "PR-2026-0802",
      drugId: "MED-002",
      drugName: "Amoxicillin Trihydrate 500mg",
      vendorId: "SUP-002",
      vendorName: "PT Kalbe Farma Tbk",
      orderedQty: 1200,
      unitPrice: 85000,
      totalAmount: 102000000,
      createdDate: "2026-08-07 11:00",
      expectedDelivery: "2026-08-09",
      status: "Ordered",
      priceBenchmarked: true,
      priceDelta: "-2% (Under Benchmark)",
      pic: "Siti Rahma (Purchasing)"
    }
  ],
  goodsReceipts: [
    {
      id: "GR-2026-0038",
      poId: "PO-2026-0041",
      drugName: "Amoxicillin Trihydrate 500mg",
      expectedQty: 1200,
      receivedQty: 1200,
      batchNoScanned: "AMX-2026-9901",
      expiryScanned: "2028-02-15",
      scannedMatchPO: true,
      visualDamage: false,
      inspectedBy: "Apt. Budi Santoso",
      receivedDate: "2026-08-07 15:45",
      status: "Received & Inspected",
      ocrConfidence: "99.4%"
    }
  ],
  invoices: [
    {
      id: "INV-2026-9901",
      poId: "PO-2026-0041",
      grId: "GR-2026-0038",
      vendorName: "PT Kalbe Farma Tbk",
      invoiceAmount: 102000000,
      poAmount: 102000000,
      grAmount: 102000000,
      threeWayMatchStatus: "MATCHED",
      paymentStatus: "Pending",
      invoiceDate: "2026-08-07",
      dueDate: "2026-09-06",
      fraudScore: 5,
      notes: "Three-Way Match 100% Valid."
    }
  ],
  auditLogs: [
    {
      id: "LOG-1092",
      timestamp: "2026-08-07 16:30:12",
      actor: "AI Fraud Detector System",
      role: "System Automation",
      action: "SERVER_STARTED",
      details: "REST API Backend System for SENTRA Healthcare Artificial Intelligence is Online.",
      riskLevel: "INFO"
    }
  ]
};

let db = { ...INITIAL_DB };

export function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    } else {
      saveDB();
    }
  } catch (err) {
    console.error("DB Load error:", err);
  }
  return db;
}

export function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error("DB Save error:", err);
  }
}

export function getDB() {
  return db;
}
