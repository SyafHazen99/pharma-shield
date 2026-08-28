/**
 * Authentication & Staff Credentials Database
 * RSIA Melinda Audit Standard - SENTRA Healthcare AI
 */

export const REGISTERED_STAFF = [
  {
    id: 'STAFF-001',
    name: 'dr. Novia Dwi Anggraini',
    email: 'direktur@sentra.health',
    password: 'admin123',
    role: 'DIRECTOR',
    roleTitle: 'Project Leader & Head of Healthcare AI',
    avatar: 'https://images.unsplash.com/photo-1594824813572-c205315822ff?auto=format&fit=crop&q=80&w=150',
    unit: 'Komite Pengadaan & Clinical AI'
  },
  {
    id: 'STAFF-002',
    name: 'Apt. Budi Santoso, S.Farm',
    email: 'kr.gudang@sentra.health',
    password: 'gudang123',
    role: 'KR_GUDANG',
    roleTitle: 'Apoteker Head - Kepala Gudang Utama',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
    unit: 'Gudang Farmasi Sentral'
  },
  {
    id: 'STAFF-003',
    name: 'Siti Rahma, S.Farm',
    email: 'kr.rj@sentra.health',
    password: 'rj123',
    role: 'KR_RAWAT_JALAN',
    roleTitle: 'Kepala Depo Rawat Jalan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    unit: 'Instalasi Rawat Jalan'
  },
  {
    id: 'STAFF-004',
    name: 'Dr. Hendra, Sp.FK',
    email: 'kr.ri@sentra.health',
    password: 'ri123',
    role: 'KR_RAWAT_INAP',
    roleTitle: 'Kepala Depo Rawat Inap',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
    unit: 'Instalasi Rawat Inap & Bangsal'
  },
  {
    id: 'STAFF-005',
    name: 'Nrs. Dewi Lestari, S.Kep',
    email: 'kr.bayi@sentra.health',
    password: 'bayi123',
    role: 'KR_RUANG_BAYI',
    roleTitle: 'Kepala Depo Ruang Bayi (NICU)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    unit: 'Ruang Bayi & Perinatologi'
  },
  {
    id: 'STAFF-006',
    name: 'Apt. Rian Hidayat, S.Farm',
    email: 'kr.ok@sentra.health',
    password: 'ok123',
    role: 'KR_KAMAR_OPERASI',
    roleTitle: 'Kepala Depo Kamar Operasi (OK)',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150',
    unit: 'Bedah Sentral & Kamar Operasi'
  },
  {
    id: 'STAFF-007',
    name: 'dr. Ferdi',
    email: 'ferdi.direktur@sentra.health',
    password: 'ferdi123',
    role: 'DIREKTUR_FERDI',
    roleTitle: 'Direktur Utama RSIA Melinda',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=150',
    unit: 'Executive Board of Directors'
  }
];

export function authenticateStaff(email, password) {
  const staff = REGISTERED_STAFF.find(
    s => s.email.toLowerCase() === email.trim().toLowerCase() && s.password === password
  );
  return staff || null;
}
