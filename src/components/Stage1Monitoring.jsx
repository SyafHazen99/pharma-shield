import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Flame, 
  ArrowRight, 
  Search, 
  Filter,
  Brain,
  PlusCircle,
  Pill,
  X,
  Stethoscope,
  Boxes,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Lock,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { normalizeDecimal, normalizeStockUnits, normalizeCurrency, formatRupiah } from '../utils/numberSanitizer';
import { ROLES } from '../config/rbac';

export default function Stage1Monitoring({ 
  medicines = [], 
  onTriggerPR, 
  onAddMedicine, 
  setActiveStage, 
  openExcelModal,
  activeRole = 'DIRECTOR',
  currentUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, MEDICINE, ALKES_BMHP, DUAL_COUNT, IN_OUT_LOG
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  // Active Role Scope
  const roleConfig = ROLES[activeRole] || ROLES.DIRECTOR;
  const isSuperAdmin = currentUser?.role === 'DIRECTOR' || activeRole === 'DIRECTOR' || activeRole === 'DIREKTUR_FERDI';
  const defaultRoomScope = roleConfig.roomScope || 'ALL';

  // Room Filter State for dr. Novi / Super Admin Mode
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('ALL');

  // Effective Room Filter
  const effectiveRoomScope = isSuperAdmin ? selectedRoomFilter : defaultRoomScope;
  const roomScope = effectiveRoomScope;

  // Dual-Count Audit State (Hitung 1 vs Hitung 2)
  const [dualCounts, setDualCounts] = useState({
    '0': { count1: 450, count2: 450, status: 'MATCHED' },
    '1': { count1: 15, count2: 12, status: 'HOLD_RECOUNT', reason: 'Selisih 3 vial antara Hitung 1 (Petugas) & Hitung 2 (Verifier)' },
    '2': { count1: 85, count2: 85, status: 'MATCHED' },
    '3': { count1: 30, count2: 30, status: 'MATCHED' }
  });

  // Simulated Room In/Out Distribution Log
  const [distributionLogs, setDistributionLogs] = useState([
    { id: 'LOG-IN-101', date: '28 Agu 2026', type: 'INBOUND', item: 'Insulin Glargine Pen', qty: 20, unit: 'Pen', source: 'Gudang Utama', target: 'Rawat Jalan', officer: 'Siti Rahma' },
    { id: 'LOG-OUT-102', date: '28 Agu 2026', type: 'OUTBOUND', item: 'Ambroxol 30 Tab', qty: 50, unit: 'Tab', source: 'Rawat Inap', target: 'Pasien Kamar 304', officer: 'Dr. Hendra' },
    { id: 'LOG-IN-103', date: '27 Agu 2026', type: 'INBOUND', item: 'Benang T-Dio BP9', qty: 10, unit: 'Pcs', source: 'Gudang Utama', target: 'Kamar Operasi', officer: 'Apt. Rian' },
    { id: 'LOG-OUT-104', date: '27 Agu 2026', type: 'OUTBOUND', item: 'Apialys Syrup', qty: 5, unit: 'Botol', source: 'Ruang Bayi', target: 'Pasien NICU Lt 2', officer: 'Nrs. Dewi' }
  ]);

  // Form State for Manual Entry
  const [newItemType, setNewItemType] = useState('MEDICINE');
  const [newDrugName, setNewDrugName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newCategory, setNewCategory] = useState('Antibiotik');
  const [newCurrentStock, setNewCurrentStock] = useState('20');
  const [newUnit, setNewUnit] = useState('Box');
  const [newUnitPrice, setNewUnitPrice] = useState('150000');
  const [newSafetyStock, setNewSafetyStock] = useState('50');
  const [newLocation, setNewLocation] = useState(effectiveRoomScope === 'ALL' ? 'Gudang Utama' : effectiveRoomScope);

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || m.category.includes(filterCategory);
    
    // Room Scope Filter (Data shown ONLY based on pipeline & role room scope)
    let matchesRoom = true;
    if (effectiveRoomScope !== 'ALL') {
      matchesRoom = m.location.includes(effectiveRoomScope) || (effectiveRoomScope === 'Gudang Utama' && m.location.includes('Gudang'));
    }

    let matchesType = true;
    if (activeTab === 'MEDICINE') {
      matchesType = m.itemType !== 'ALKES_BMHP';
    } else if (activeTab === 'ALKES_BMHP') {
      matchesType = m.itemType === 'ALKES_BMHP';
    }

    return matchesSearch && matchesCategory && matchesType && matchesRoom;
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, activeTab, selectedRoomFilter]);

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE) || 1;
  const paginatedMedicines = filteredMedicines.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleManualAddSubmit = (e) => {
    e.preventDefault();
    if (!newDrugName.trim()) return;

    const currentStockNum = normalizeStockUnits(newCurrentStock);
    const safetyStockNum = normalizeStockUnits(newSafetyStock);
    const unitPriceNum = normalizeCurrency(newUnitPrice);

    const newMedObj = {
      id: `MED-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newDrugName.trim(),
      dosage: newDosage.trim() || (newItemType === 'ALKES_BMHP' ? 'Ukuran Standar Steril' : '500mg'),
      category: newCategory,
      itemType: newItemType,
      currentStock: currentStockNum,
      unit: newUnit || (newItemType === 'ALKES_BMHP' ? 'Pcs' : 'Box'),
      minSafetyStock: safetyStockNum,
      reorderPoint: Math.round(safetyStockNum * 1.5),
      eoq: Math.round(safetyStockNum * 3),
      unitPrice: unitPriceNum,
      burnRateDaily: 5.0,
      abnormalUsageSpike: false,
      batchNo: `MANUAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2027-12-31',
      location: newLocation,
      status: currentStockNum <= safetyStockNum ? 'Need Reorder' : 'Normal',
      fefoRank: 2,
      supplierId: 'SUP-001'
    };

    onAddMedicine(newMedObj);
    setShowAddModal(false);
    
    setNewDrugName('');
    setNewDosage('');
  };

  // Filter medicines strictly by active room scope first for tab counters
  const roomScopedMedicines = medicines.filter(m => {
    if (effectiveRoomScope === 'ALL') return true;
    return m.location.includes(effectiveRoomScope) || (effectiveRoomScope === 'Gudang Utama' && m.location.includes('Gudang'));
  });

  const medicineCount = roomScopedMedicines.filter(m => m.itemType !== 'ALKES_BMHP').length;
  const alkesCount = roomScopedMedicines.filter(m => m.itemType === 'ALKES_BMHP').length;
  const holdRecountCount = Object.values(dualCounts).filter(d => d.status === 'HOLD_RECOUNT').length;

  const canViewPrices = isSuperAdmin || activeRole === 'PURCHASING' || currentUser?.role === 'PURCHASING';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Info Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 whitespace-nowrap">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Tahap 1: Monitoring & Stock Opname Farmasi RSIA Melinda
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <span>{effectiveRoomScope === 'ALL' ? 'Warehouse & Multi-Depo Master Inventory' : `Persediaan Ruangan: ${effectiveRoomScope}`}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-900 border border-blue-300 font-bold">
              {roleConfig.name}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Single Source of Truth (`MASTER_ITEM`) • Input Terkunci • Otomasi 80% Audit Standard dr. Novia Dwi Anggraini.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openExcelModal}
            className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap"
            title="Upload Spreadsheet Excel (.xlsx) dr. Novia Dwi Anggraini"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Import Excel (.xlsx)
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            + Input Manual Item
          </button>
        </div>
      </div>

      {/* Super Admin Direct Room Filter for dr. Novi */}
      {isSuperAdmin && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="font-extrabold text-slate-900 text-sm">Super Admin Room Scope Filter (dr. Novia Dwi Anggraini)</div>
              <div className="text-[11px] text-slate-600 font-medium">Filter langsung tampilan persediaan per ruangan tanpa mengubah wewenang utama Anda.</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-slate-500 text-[11px] font-bold">Pilih Ruangan:</span>
            <select
              value={selectedRoomFilter}
              onChange={(e) => setSelectedRoomFilter(e.target.value)}
              className="bg-white border border-blue-300 rounded-2xl px-3 py-2 text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              <option value="ALL">🌐 Semua Ruangan (Master Inventory)</option>
              <option value="Gudang Utama">📦 Gudang Utama (Central Storage)</option>
              <option value="Rawat Jalan">🩺 Depo Rawat Jalan</option>
              <option value="Rawat Inap">🛏️ Depo Rawat Inap</option>
              <option value="Ruang Bayi">👶 Depo Ruang Bayi (NICU)</option>
              <option value="Kamar Operasi">🔪 Depo Kamar Operasi (OK)</option>
            </select>
          </div>
        </div>
      )}

      {/* Restricted Room Master Banner (No Switch Button for Non-Admin Staff) */}
      {!isSuperAdmin && roomScope !== 'ALL' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl text-amber-900 text-xs font-bold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <div className="text-xs font-extrabold">Akses Ruangan Terkunci: [{roomScope}]</div>
              <div className="text-[11px] text-amber-800 font-normal">
                Tampilan persediaan dan laporan disaring strictly untuk unit <strong>{roomScope}</strong>.
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-600 text-white rounded-xl font-mono text-[10px] font-bold">Scope Enforced</span>
        </div>
      )}

      {/* Item Taxonomy Category & Audit Standard Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'ALL'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          Semua Persediaan ({roomScopedMedicines.length})
        </button>

        <button
          onClick={() => setActiveTab('MEDICINE')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'MEDICINE'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          Obat (Medicine) ({medicineCount})
        </button>

        <button
          onClick={() => setActiveTab('ALKES_BMHP')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'ALKES_BMHP'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Alkes (Medical Equipment) ({alkesCount})
        </button>

        <button
          onClick={() => setActiveTab('DUAL_COUNT')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'DUAL_COUNT'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-amber-500" />
          Protokol Hitung Ganda (Dual-Count)
          {holdRecountCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold animate-pulse">
              {holdRecountCount} HOLD
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('IN_OUT_LOG')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'IN_OUT_LOG'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          Laporan Masuk & Keluar Ruangan
        </button>
      </div>

      {/* Main Content View Switcher */}
      {activeTab === 'DUAL_COUNT' ? (
        /* Dual-Count Audit Trail Table */
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-600" /> Protokol Hitung Ganda (Dual-Count Audit Trail)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Hitung 1 (Petugas Ruang) vs Hitung 2 (Verifier Independen). Status otomatis 'HOLD / RECOUNT' jika terjadi selisih.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
              Standard dr. Novia Dwi Anggraini
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Nama Barang / Obat</th>
                  <th className="p-3">Hitung 1 (Petugas Unit)</th>
                  <th className="p-3">Hitung 2 (Verifier)</th>
                  <th className="p-3">Selisih Delta</th>
                  <th className="p-3">Status Verification</th>
                  <th className="p-3 text-right">Tindakan Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {Object.entries(dualCounts).map(([indexStr, audit]) => {
                  const idx = parseInt(indexStr, 10);
                  const med = filteredMedicines[idx] || medicines[idx] || { name: 'Amoxicillin 500mg', unit: 'Box' };
                  const delta = audit.count1 - audit.count2;

                  return (
                    <tr key={indexStr} className="hover:bg-slate-50">
                      <td className="p-3 font-sans font-bold text-slate-900">
                        {med.name}
                      </td>
                      <td className="p-3 font-bold text-blue-700">{audit.count1} {med.unit}</td>
                      <td className="p-3 font-bold text-indigo-700">{audit.count2} {med.unit}</td>
                      <td className="p-3 font-bold">
                        {delta === 0 ? (
                          <span className="text-emerald-600">0 (Nominal Match)</span>
                        ) : (
                          <span className="text-red-600">{delta > 0 ? `+${delta}` : delta} (Mismatch)</span>
                        )}
                      </td>
                      <td className="p-3 font-sans">
                        {audit.status === 'MATCHED' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> MATCHED (0 Delta)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1 animate-pulse">
                            <AlertOctagon className="w-3 h-3" /> HOLD / RECOUNT
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-sans">
                        {audit.status === 'HOLD_RECOUNT' ? (
                          <button
                            onClick={() => {
                              setDualCounts(prev => ({
                                ...prev,
                                [indexStr]: { ...prev[indexStr], count2: prev[indexStr].count1, status: 'MATCHED' }
                              }));
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm"
                          >
                            Verifikasi & Rekon Hitung 2
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Audit Verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'IN_OUT_LOG' ? (
        /* Automated Room In/Out Distribution Log Table */
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" /> Laporan Distribusi Masuk & Keluar Ruangan ({effectiveRoomScope})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pencatatan Otomatis 80%: Alur barang masuk dari Gudang Utama & alur barang keluar ke Pasien / Unit.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
              Automated Room Distribution Log
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Tanggal & ID</th>
                  <th className="p-3">Tipe Transaksi</th>
                  <th className="p-3">Nama Barang</th>
                  <th className="p-3">Kuantitas</th>
                  <th className="p-3">Asal (Source)</th>
                  <th className="p-3">Tujuan (Target)</th>
                  <th className="p-3">Petugas Penanggung Jawab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {distributionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-sans">
                      <div className="font-bold text-slate-900">{log.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.id}</div>
                    </td>
                    <td className="p-3 font-sans">
                      {log.type === 'INBOUND' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> MASUK (INBOUND)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 inline-flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" /> KELUAR (OUTBOUND)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-sans font-bold text-slate-900">{log.item}</td>
                    <td className="p-3 font-bold text-slate-900">{log.qty} {log.unit}</td>
                    <td className="p-3 text-slate-600 font-sans">{log.source}</td>
                    <td className="p-3 text-slate-600 font-sans">{log.target}</td>
                    <td className="p-3 text-slate-800 font-sans font-bold">{log.officer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Main Stock Table */
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4 whitespace-nowrap min-w-[280px]">Tipe & Nama Barang</th>
                  <th className="p-4 whitespace-nowrap">Stok Fisik Saat Ini</th>
                  <th className="p-4 whitespace-nowrap">{canViewPrices ? 'Harga Unit (IDR)' : 'Status Harga'}</th>
                  <th className="p-4 whitespace-nowrap">Safety Stock & ROP</th>
                  <th className="p-4 whitespace-nowrap">Burn Rate (Hari)</th>
                  <th className="p-4 text-right whitespace-nowrap">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {paginatedMedicines.map((med) => {
                  const currentStockNum = normalizeStockUnits(med.currentStock);
                  const safetyStockNum = normalizeStockUnits(med.minSafetyStock);
                  const unitPriceNum = normalizeCurrency(med.unitPrice);
                  const daysRemaining = (currentStockNum / (med.burnRateDaily || 1)).toFixed(1);
                  const isBelowSafety = currentStockNum <= safetyStockNum;
                  const isAlkes = med.itemType === 'ALKES_BMHP';

                  return (
                    <tr key={med.id} className="hover:bg-blue-50/50 transition-colors">
                      
                      {/* Item Name & Category Badge */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          <span>{med.name}</span>
                          {med.abnormalUsageSpike && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-mono rounded-md font-bold border border-red-300 whitespace-nowrap shrink-0 inline-flex items-center">
                              SPIKE DETECTED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                            isAlkes ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {isAlkes ? 'Alkes (Medical Equipment)' : 'Obat (Medicine)'}
                          </span>
                          <span className="whitespace-nowrap">{med.dosage}</span>
                          <span className="text-slate-300">•</span>
                          <strong className="text-slate-700 whitespace-nowrap">{med.category}</strong>
                        </div>
                      </td>

                      {/* Stock Level (Normalized Integer) */}
                      <td className="p-4 font-mono font-bold whitespace-nowrap">
                        <div className={`text-sm ${isBelowSafety ? 'text-red-600 font-extrabold' : 'text-slate-900'}`}>
                          {currentStockNum} {med.unit}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans font-medium whitespace-nowrap">
                          Lokasi: {med.location}
                        </div>
                      </td>

                      {/* Unit Price (Normalized Currency - Restricted to Purchasing & Directors) */}
                      <td className="p-4 font-mono font-bold whitespace-nowrap">
                        {canViewPrices ? (
                          <span className="text-slate-800">{formatRupiah(unitPriceNum)}</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-sans font-semibold inline-flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" /> Akses Tim Purchasing
                          </span>
                        )}
                      </td>

                      {/* Safety Stock & ROP */}
                      <td className="p-4 font-mono text-slate-600 whitespace-nowrap">
                        <div>Min: <strong>{safetyStockNum}</strong> {med.unit}</div>
                        <div className="text-[10px] text-blue-700">ROP: <strong>{med.reorderPoint}</strong> {med.unit}</div>
                      </td>

                      {/* Burn Rate */}
                      <td className="p-4 font-mono whitespace-nowrap">
                        <div className="text-slate-900 font-bold">{med.burnRateDaily} {med.unit}/hari</div>
                        <div className={`text-[10px] font-bold ${Number(daysRemaining) < 3 ? 'text-red-600' : 'text-emerald-700'}`}>
                          ~{daysRemaining} Hari
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            onTriggerPR(med);
                            setActiveStage(2);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          Trigger Smart PR
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* High Performance Pagination Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border-t border-slate-200 text-xs font-mono">
            <div className="text-slate-600 font-medium font-sans">
              Menampilkan <strong className="text-slate-900 font-bold">{filteredMedicines.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong> - <strong className="text-slate-900 font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredMedicines.length)}</strong> dari <strong className="text-blue-700 font-bold">{filteredMedicines.length.toLocaleString('id-ID')} Total Items</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-bold transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200">
                Hal {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-bold transition-all flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form for Manual Input */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-3xl border border-slate-200 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-600" /> Form Input Persediaan Baru (Obat / Alkes)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-4 text-xs font-sans">
              
              {/* Item Type Selector */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Pilih Tipe Barangnya:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewItemType('MEDICINE');
                      setNewCategory('Antibiotik');
                      setNewUnit('Box');
                    }}
                    className={`p-3 rounded-2xl border font-bold text-center flex items-center justify-center gap-2 transition-all ${
                      newItemType === 'MEDICINE'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Pill className="w-4 h-4" /> Obat (Medicine)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewItemType('ALKES_BMHP');
                      setNewCategory('Alkes / BMHP (Bahan Medis)');
                      setNewUnit('Pcs');
                    }}
                    className={`p-3 rounded-2xl border font-bold text-center flex items-center justify-center gap-2 transition-all ${
                      newItemType === 'ALKES_BMHP'
                        ? 'bg-purple-50 border-purple-600 text-purple-700 ring-2 ring-purple-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" /> Alkes (Medical Equipment)
                  </button>
                </div>
              </div>

              {/* Item Name & Dosage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Nama Barang:</label>
                  <input
                    type="text"
                    required
                    placeholder={newItemType === 'ALKES_BMHP' ? 'Contoh: Syringe 5ml Luer Lock' : 'Contoh: Amoxicillin Syrup'}
                    value={newDrugName}
                    onChange={(e) => setNewDrugName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Spesifikasi / Dosis:</label>
                  <input
                    type="text"
                    placeholder={newItemType === 'ALKES_BMHP' ? 'Contoh: 5ml Steril Single Use' : 'Contoh: 125mg/5ml'}
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Kategori Barang:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  >
                    {newItemType === 'MEDICINE' ? (
                      <>
                        <option value="Antibiotik">Antibiotik</option>
                        <option value="Narkotika / Controlled Substance">Narkotika / Controlled</option>
                        <option value="Hormon / Cold Chain">Hormon / Cold Chain</option>
                        <option value="Antiviral High Value">Antiviral High Value</option>
                        <option value="Analgesik / Antipiretik">Analgesik / Antipiretik</option>
                      </>
                    ) : (
                      <>
                        <option value="Alkes / BMHP (Bahan Medis)">Alkes / BMHP (Bahan Medis)</option>
                        <option value="APD / Alat Pelindung Diri">APD / Alat Pelindung Diri</option>
                        <option value="Diagnostic & Laboratory">Diagnostic & Laboratory Kit</option>
                        <option value="Sterilisasi & Bedah">Sterilisasi & Bedah</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-slate-700 font-sans font-bold">Satuan Unit:</label>
                  <input
                    type="text"
                    placeholder={newItemType === 'ALKES_BMHP' ? 'Pcs / Set / Box' : 'Box / Botol / Vial'}
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Stock, Safety Stock, Price (Decimal Sanitized) */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Stok Awal:</label>
                  <input
                    type="text"
                    value={newCurrentStock}
                    onChange={(e) => setNewCurrentStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Safety Stock Min:</label>
                  <input
                    type="text"
                    value={newSafetyStock}
                    onChange={(e) => setNewSafetyStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Harga Satuan (Rp):</label>
                  <input
                    type="text"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Lokasi Gudang / Ruangan Target:</label>
                <select
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Gudang Utama">📦 Gudang Utama (Central Warehouse)</option>
                  <option value="Rawat Jalan">🩺 Rawat Jalan (Depo Rawat Jalan)</option>
                  <option value="Rawat Inap">🛏️ Rawat Inap (Depo Rawat Inap)</option>
                  <option value="Ruang Bayi">👶 Ruang Bayi (Depo Ruang Bayi / NICU)</option>
                  <option value="Kamar Operasi">🔪 Kamar Operasi (Depo Kamar Operasi / OK)</option>
                  <option value="Buyer">🛒 Buyer (Pembeli / Pasien Outbound)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-2xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Simpan Barang Ke Sistem
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
