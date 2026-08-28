// Server-side AI Fraud Engine & Calculations

export function calculateEOQ(annualDemand = 1000, setupCost = 150000, holdingCost = 1500) {
  if (!annualDemand || annualDemand <= 0) return 100;
  return Math.round(Math.sqrt((2 * annualDemand * setupCost) / holdingCost));
}

export function evaluatePRRiskScore(pr, medicine, vendor) {
  let score = 10;
  const reasons = [];

  if (medicine?.category?.includes("Narkotika") || (pr.estimatedTotal / (pr.requestedQty || 1)) > 1000000) {
    score += 30;
    reasons.push("Obat High Value / Controlled Substance (Narkotika)");
  }

  if (medicine?.abnormalUsageSpike || pr?.requestedQty > ((medicine?.eoq || 500) * 2)) {
    score += 35;
    reasons.push("Permintaan melebihi 200% dari EOQ historis / Lonjakan mendadak");
  }

  if (vendor && vendor.riskLevel === "HIGH") {
    score += 25;
    reasons.push(`Vendor terafiliasi risiko tinggi (${vendor.name})`);
  }

  if (pr?.estimatedTotal > 150000000) {
    score += 15;
    reasons.push("Nilai transaksi melebihi Rp 150.000.000 (Subjek approval khusus)");
  }

  const finalScore = Math.min(score, 99);
  let recommendation = "APPROVE - Risk low/normal";
  if (finalScore >= 75) {
    recommendation = "CRITICAL RISK - Tolak atau Minta Audit Fisik Ulang";
  } else if (finalScore >= 50) {
    recommendation = "WARNING - Butuh Verifikasi Tambahan Keuangan & Kepala Farmasi";
  }

  return {
    score: finalScore,
    reasons,
    recommendation
  };
}

export function verifyThreeWayMatch(po, gr, invoice) {
  const issues = [];
  
  if (!po || !gr || !invoice) {
    return {
      status: "INCOMPLETE",
      matched: false,
      issues: ["Dokumen pendukung (PO / Goods Receipt / Invoice) belum lengkap."]
    };
  }

  if (gr.receivedQty !== po.orderedQty) {
    issues.push(`Quantity Mismatch: PO dipesan ${po.orderedQty}, diterima ${gr.receivedQty}`);
  }

  const priceDiff = invoice.invoiceAmount - po.totalAmount;
  if (Math.abs(priceDiff) > 100) {
    issues.push(`Price Markup: Selisih invoice Rp ${priceDiff.toLocaleString("id-ID")}`);
  }

  if (!gr.scannedMatchPO) {
    issues.push("Batch Number / Expired Date mismatch pada OCR fisik.");
  }

  if (issues.length === 0) {
    return { status: "MATCHED", matched: true, issues: [], matchScore: 100 };
  } else {
    return { status: "DISCREPANCY", matched: false, issues, matchScore: Math.max(10, 100 - (issues.length * 40)) };
  }
}
