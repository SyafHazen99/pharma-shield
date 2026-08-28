/**
 * Role-Based Access Control (RBAC) Specification
 * RSIA Melinda Audit Standard - Designed by dr. Novia Dwi Anggraini
 */

export const ROLES = {
  DIRECTOR: {
    id: 'DIRECTOR',
    name: 'Project Leader & AI Head',
    roleTitle: 'Project Leader & Head of Healthcare AI',
    description: 'Project Leader & Head of Healthcare AI. Editor Master, Rekonsiliasi, Verifier, & Executive Approval.',
    authorizedStages: [0, 1, 2, 3, 4, 5, 6, 7], // Full Visibility
    defaultStage: 0,
    roomScope: 'ALL'
  },
  KR_GUDANG: {
    id: 'KR_GUDANG',
    name: 'Kepala Gudang Utama',
    roleTitle: 'Apoteker Head - Gudang Central',
    description: 'Editor sheet/tampilan Gudang Utama. Mengelola stok cadangan central & Penerimaan Goods Receipt OCR.',
    authorizedStages: [1, 5, 6],
    defaultStage: 1,
    roomScope: 'Gudang Utama'
  },
  KR_RAWAT_JALAN: {
    id: 'KR_RAWAT_JALAN',
    name: 'Kepala Rawat Jalan',
    roleTitle: 'Kepala Depo Rawat Jalan',
    description: 'Editor sheet/tampilan Rawat Jalan. Mengelola stok obat/alkes poli rawat jalan & Laporan Masuk/Keluar.',
    authorizedStages: [1, 6],
    defaultStage: 1,
    roomScope: 'Rawat Jalan'
  },
  KR_RAWAT_INAP: {
    id: 'KR_RAWAT_INAP',
    name: 'Kepala Rawat Inap',
    roleTitle: 'Kepala Depo Rawat Inap',
    description: 'Editor sheet/tampilan Rawat Inap. Mengelola persediaan bangsal rawat inap & Laporan Masuk/Keluar.',
    authorizedStages: [1, 6],
    defaultStage: 1,
    roomScope: 'Rawat Inap'
  },
  KR_RUANG_BAYI: {
    id: 'KR_RUANG_BAYI',
    name: 'Kepala Ruang Bayi',
    roleTitle: 'Kepala Depo Ruang Bayi (NICU)',
    description: 'Editor sheet/tampilan Ruang Bayi. Mengelola persediaan khusus pediatrik/bayi & Laporan Masuk/Keluar.',
    authorizedStages: [1, 6],
    defaultStage: 1,
    roomScope: 'Ruang Bayi'
  },
  KR_KAMAR_OPERASI: {
    id: 'KR_KAMAR_OPERASI',
    name: 'Kepala Kamar Operasi',
    roleTitle: 'Kepala Depo OK (Surgical Suite)',
    description: 'Editor sheet/tampilan Kamar Operasi (OK). Mengelola benang bedah, anestesi, & Narkotika dual-key log.',
    authorizedStages: [1, 6],
    defaultStage: 1,
    roomScope: 'Kamar Operasi'
  },
  DIREKTUR_FERDI: {
    id: 'DIREKTUR_FERDI',
    name: 'Direktur Utama',
    roleTitle: 'Direktur Utama RSIA Melinda',
    description: 'Viewer Seluruh Database + Dashboard Approval Final & Audit Logs.',
    authorizedStages: [0, 3, 7],
    defaultStage: 0,
    roomScope: 'ALL'
  }
};

export function isStageAuthorized(roleId, stageId) {
  const role = ROLES[roleId];
  if (!role) return false;
  return role.authorizedStages.includes(stageId);
}
