/**
 * Role-Based Access Control (RBAC) Specification
 * Pipeline Architecture designed by dr. Novia Dwi Anggraini
 */

export const ROLES = {
  WAREHOUSE: {
    id: 'WAREHOUSE',
    name: 'Apoteker Gudang',
    description: 'Manajemen stok fisik, monitoring reorder limit, dan penerimaan fisik barang (OCR).',
    authorizedStages: [1, 5],
    defaultStage: 1
  },
  PHARMACY_HEAD: {
    id: 'PHARMACY_HEAD',
    name: 'Kepala Farmasi',
    description: 'Perencanaan kebutuhan obat (EOQ), pembuatan PR, dan pengawasan efisiensi FEFO.',
    authorizedStages: [2, 6],
    defaultStage: 2
  },
  PURCHASING: {
    id: 'PURCHASING',
    name: 'Tim Purchasing',
    description: 'Vendor price benchmarking, negosiasi distributor, dan penerbitan PO resmi.',
    authorizedStages: [4],
    defaultStage: 4
  },
  DIRECTOR: {
    id: 'DIRECTOR',
    name: 'Direktur Utama / Keuangan',
    description: 'Executive Command Center, approval pengadaan > threshold, dan verifikasi 3-Way Match.',
    authorizedStages: [0, 1, 2, 3, 4, 5, 6, 7], // Super Admin full visibility
    defaultStage: 0
  }
};

export function isStageAuthorized(roleId, stageId) {
  const role = ROLES[roleId];
  if (!role) return false;
  return role.authorizedStages.includes(stageId);
}
