/**
 * Authentication & Staff Credentials Database
 * SENTRA Healthcare AI - PharmaShield AI System
 */

export const REGISTERED_STAFF = [
  {
    id: 'STAFF-001',
    name: 'dr. Novia Dwi Anggraini',
    email: 'direktur@sentra.health',
    password: 'admin123',
    role: 'DIRECTOR',
    roleTitle: 'Project Leader & Direktur Utama',
    avatar: 'https://images.unsplash.com/photo-1594824813572-c205315822ff?auto=format&fit=crop&q=80&w=150',
    unit: 'Executive Board of Directors'
  },
  {
    id: 'STAFF-002',
    name: 'Dr. Hendra, Sp.FK',
    email: 'hendra.farmasi@sentra.health',
    password: 'farmasi123',
    role: 'PHARMACY_HEAD',
    roleTitle: 'Kepala Instalasi Farmasi',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
    unit: 'Komite Pengadaan Farmasi'
  },
  {
    id: 'STAFF-003',
    name: 'Apt. Budi Santoso, S.Farm',
    email: 'budi.gudang@sentra.health',
    password: 'gudang123',
    role: 'WAREHOUSE',
    roleTitle: 'Apoteker Gudang Utama',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150',
    unit: 'Gudang Farmasi Sentral'
  },
  {
    id: 'STAFF-004',
    name: 'Siti Rahma, S.E.',
    email: 'rahma.purchasing@sentra.health',
    password: 'purchasing123',
    role: 'PURCHASING',
    roleTitle: 'Lead Purchasing Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    unit: 'Divisi Pengadaan & Logistik'
  }
];

export function authenticateStaff(email, password) {
  const staff = REGISTERED_STAFF.find(
    s => s.email.toLowerCase() === email.trim().toLowerCase() && s.password === password
  );
  return staff || null;
}
