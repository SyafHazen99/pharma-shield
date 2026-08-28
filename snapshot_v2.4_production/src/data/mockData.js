import { getWIBTimestamp, getWIBDateOnly, getWIBOffsetDate } from '../utils/timeUtils';

export const INITIAL_MEDICINES = [
  {
    id: "MED-001",
    name: "Morphine Sulfate Injection",
    dosage: "10mg/ml (1ml ampoule)",
    category: "Narkotika / Controlled Substance",
    itemType: "MEDICINE",
    currentStock: 45,
    unit: "Ampoule",
    minSafetyStock: 100,
    reorderPoint: 150,
    eoq: 300,
    unitPrice: 125000,
    burnRateDaily: 18.5,
    abnormalUsageSpike: true,
    abnormalUsageReason: "Deteksi lonjakan penggunaan 140% di Ruang Rawat Inap Lt 3 (Pola tidak wajar)",
    batchNo: "MRP-2026-X89",
    expiryDate: getWIBOffsetDate(90),
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
    itemType: "MEDICINE",
    currentStock: 280,
    unit: "Box (100s)",
    minSafetyStock: 500,
    reorderPoint: 700,
    eoq: 1200,
    unitPrice: 85000,
    burnRateDaily: 42.0,
    abnormalUsageSpike: false,
    batchNo: "AMX-2026-004",
    expiryDate: getWIBOffsetDate(280),
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
    itemType: "MEDICINE",
    currentStock: 120,
    unit: "Pen",
    minSafetyStock: 80,
    reorderPoint: 150,
    eoq: 400,
    unitPrice: 210000,
    burnRateDaily: 6.2,
    abnormalUsageSpike: false,
    batchNo: "INS-2025-C11",
    expiryDate: getWIBOffsetDate(25),
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
    itemType: "MEDICINE",
    currentStock: 35,
    unit: "Vial",
    minSafetyStock: 50,
    reorderPoint: 80,
    eoq: 200,
    unitPrice: 1450000,
    burnRateDaily: 3.1,
    abnormalUsageSpike: false,
    batchNo: "RDV-2026-88B",
    expiryDate: getWIBOffsetDate(350),
    location: "Gudang Khusus A2",
    status: "Need Reorder",
    fefoRank: 2,
    supplierId: "SUP-001"
  },
  {
    id: "MED-005",
    name: "Meropenem Injection",
    dosage: "1g Vial",
    category: "Antibiotik Reservoir",
    itemType: "MEDICINE",
    currentStock: 95,
    unit: "Vial",
    minSafetyStock: 100,
    reorderPoint: 180,
    eoq: 500,
    unitPrice: 380000,
    burnRateDaily: 11.4,
    abnormalUsageSpike: false,
    batchNo: "MRP-2026-99A",
    expiryDate: getWIBOffsetDate(180),
    location: "Gudang A1 - Rak 08",
    status: "Normal",
    fefoRank: 2,
    supplierId: "SUP-002"
  },
  {
    id: "MED-006",
    name: "Paracetamol Infus",
    dosage: "10mg/ml (100ml)",
    category: "Analgesik / Antipiretik",
    itemType: "MEDICINE",
    currentStock: 1450,
    unit: "Botol",
    minSafetyStock: 400,
    reorderPoint: 600,
    eoq: 1500,
    unitPrice: 45000,
    burnRateDaily: 28.0,
    abnormalUsageSpike: false,
    batchNo: "PCT-2025-77F",
    expiryDate: getWIBOffsetDate(60),
    location: "Gudang Utama Pallet 3",
    status: "Slow Moving",
    fefoRank: 1,
    supplierId: "SUP-004"
  },
  {
    id: "MED-007",
    name: "Syringe 3ml Luer Lock (Jarum Suntik)",
    dosage: "3ml (Terbungkus Steril)",
    category: "Alkes / BMHP (Bahan Medis)",
    itemType: "ALKES_BMHP",
    currentStock: 450,
    unit: "Pcs",
    minSafetyStock: 1000,
    reorderPoint: 1500,
    eoq: 5000,
    unitPrice: 3500,
    burnRateDaily: 120.0,
    abnormalUsageSpike: false,
    batchNo: "SYR-2026-901",
    expiryDate: getWIBOffsetDate(600),
    location: "Gudang Logistik Medis - Rak B1",
    status: "Need Reorder",
    fefoRank: 3,
    supplierId: "SUP-002"
  },
  {
    id: "MED-008",
    name: "Infusion Set Dewasa (Selang Infus)",
    dosage: "Drop Rate 20 drops/ml",
    category: "Alkes / BMHP (Bahan Medis)",
    itemType: "ALKES_BMHP",
    currentStock: 220,
    unit: "Set",
    minSafetyStock: 500,
    reorderPoint: 800,
    eoq: 2000,
    unitPrice: 18500,
    burnRateDaily: 45.0,
    abnormalUsageSpike: false,
    batchNo: "INF-2026-44B",
    expiryDate: getWIBOffsetDate(450),
    location: "Gudang Logistik Medis - Rak B2",
    status: "Need Reorder",
    fefoRank: 2,
    supplierId: "SUP-002"
  },
  {
    id: "MED-009",
    name: "IV Cannula 20G Pink (Jarum Infus)",
    dosage: "20G x 1.25 in (32mm)",
    category: "Alkes / BMHP (Bahan Medis)",
    itemType: "ALKES_BMHP",
    currentStock: 1800,
    unit: "Pcs",
    minSafetyStock: 800,
    reorderPoint: 1200,
    eoq: 3000,
    unitPrice: 14000,
    burnRateDaily: 60.0,
    abnormalUsageSpike: false,
    batchNo: "IVC-2026-880",
    expiryDate: getWIBOffsetDate(500),
    location: "Gudang Logistik Medis - Rak B3",
    status: "Normal",
    fefoRank: 4,
    supplierId: "SUP-001"
  },
  {
    id: "MED-010",
    name: "N95 Medical Respirator Masker",
    dosage: "4-Ply NIOSH Certified",
    category: "APD / Alat Pelindung Diri",
    itemType: "ALKES_BMHP",
    currentStock: 140,
    unit: "Box (20s)",
    minSafetyStock: 200,
    reorderPoint: 350,
    eoq: 800,
    unitPrice: 175000,
    burnRateDaily: 15.0,
    abnormalUsageSpike: false,
    batchNo: "MSK-2026-11C",
    expiryDate: getWIBOffsetDate(700),
    location: "Gudang APD & Sterilisasi",
    status: "Need Reorder",
    fefoRank: 3,
    supplierId: "SUP-001"
  }
];

export const INITIAL_SUPPLIERS = [
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
    rating: 3.4,
    deliverySLA: "4.5 Hari",
    priceBenchmarkIndex: "High Markup (+12%)",
    reliabilityScore: 68,
    riskLevel: "HIGH",
    status: "Unverified Broker Vendor"
  }
];

export const INITIAL_PURCHASE_REQUESTS = [
  {
    id: "PR-2026-0801",
    drugId: "MED-001",
    drugName: "Morphine Sulfate Injection",
    requestedQty: 300,
    unit: "Ampoule",
    estimatedTotal: 37500000,
    requestedBy: "Siti Rahma (Apoteker Gudang)",
    requestDate: getWIBTimestamp(),
    status: "Pending Approval",
    urgency: "HIGH",
    riskScore: 78,
    riskFactors: [
      "Obat Golongan Narkotika - Syarat Pengawasan Khusus",
      "Deteksi lonjakan penggunaan 140% di Ruang Rawat Inap Lt 3",
      "Kuantitas melebihi batas rata-rata bulanan"
    ],
    aiRecommendation: "FLAGGED - Butuh Approval Langsung Direktur Utama (dr. Novia Dwi Anggraini)"
  },
  {
    id: "PR-2026-0802",
    drugId: "MED-002",
    drugName: "Amoxicillin Trihydrate 500mg",
    requestedQty: 1200,
    unit: "Box",
    estimatedTotal: 102000000,
    requestedBy: "Apt. Budi Santoso (Kepala Farmasi)",
    requestDate: getWIBTimestamp(),
    status: "Approved",
    urgency: "NORMAL",
    riskScore: 12,
    riskFactors: [
      "Kuantitas sesuai EOQ otomatis",
      "Stok fisik mendekati Safety Stock Limit",
      "Pola pembelian konsisten dengan 6 bulan terakhir"
    ],
    aiRecommendation: "AUTO-APPROVE - Reorder rutin aman"
  },
  {
    id: "PR-2026-0803",
    drugId: "MED-004",
    drugName: "Remdesivir Vial 100mg",
    requestedQty: 200,
    unit: "Vial",
    estimatedTotal: 290000000,
    requestedBy: "Dr. Hendra (Kepala Farmasi)",
    requestDate: getWIBTimestamp(),
    status: "Pending Approval",
    urgency: "HIGH",
    riskScore: 65,
    riskFactors: [
      "Alert Split Purchase: Terdeteksi 2 PR sejenis dibuat dalam 48 jam untuk menghindari batas approval Direktur Rp 300 Juta",
      "Nilai pengadaan tinggi"
    ],
    aiRecommendation: "FLAGGED - Gabungkan PR-0803 dengan PR-0800 untuk konsolidasi approval Direktur Utama"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
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
    createdDate: getWIBTimestamp(),
    expectedDelivery: getWIBOffsetDate(2),
    status: "Ordered",
    priceBenchmarked: true,
    priceDelta: "-2% (Under Benchmark)",
    pic: "Siti Rahma (Purchasing)"
  }
];

export const INITIAL_GOODS_RECEIPTS = [
  {
    id: "GR-2026-0038",
    poId: "PO-2026-0041",
    drugName: "Amoxicillin Trihydrate 500mg",
    expectedQty: 1200,
    receivedQty: 1200,
    batchNoScanned: "AMX-2026-9901",
    expiryScanned: getWIBOffsetDate(500),
    scannedMatchPO: true,
    visualDamage: false,
    inspectedBy: "Apt. Budi Santoso",
    receivedDate: getWIBTimestamp(),
    status: "Received & Inspected",
    ocrConfidence: "99.4%"
  }
];

export const INITIAL_INVOICES = [
  {
    id: "INV-2026-9901",
    poId: "PO-2026-0041",
    vendorName: "PT Kalbe Farma Tbk",
    drugName: "Amoxicillin Trihydrate 500mg",
    poAmount: 102000000,
    receivedQty: 1200,
    invoiceAmount: 102000000,
    threeWayMatchStatus: "MATCHED",
    paymentStatus: "UNPAID",
    discrepancyDelta: 0,
    invoiceDate: getWIBTimestamp(),
    taxNpwp: "01.345.678.9-012.000",
    auditNotes: "Seluruh data PO, GR, dan Invoice cocok 100%. Bebas dari indikasi phantom billing."
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-9901",
    timestamp: getWIBTimestamp(),
    actor: "dr. Novia Dwi Anggraini",
    role: "DIRECTOR",
    action: "SYSTEM_INITIALIZED",
    details: "Inisialisasi sistem PharmaShield AI v2.4 Production dengan proteksi Anti-Fraud & 3-Way Match Verification.",
    riskLevel: "INFO"
  },
  {
    id: "LOG-9902",
    timestamp: getWIBTimestamp(),
    actor: "Siti Rahma, A.Md.Farm",
    role: "WAREHOUSE",
    action: "TRIGGER_SMART_PR",
    details: "Pemicuan Smart PR otomatis untuk Morphine Sulfate (Stok Kritis 45 Ampoule). Risk Score 78%.",
    riskLevel: "HIGH"
  }
];
