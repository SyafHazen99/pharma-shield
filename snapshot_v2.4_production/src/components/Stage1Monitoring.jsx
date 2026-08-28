import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';

export default function Stage1Monitoring({ medicines = [], onTriggerPR, onAddMedicine, setActiveStage, openExcelModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, MEDICINE, ALKES_BMHP
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Manual Entry (Medicine or Medical Consumable/BMHP)
  const [newItemType, setNewItemType] = useState('MEDICINE'); // MEDICINE or ALKES_BMHP
  const [newDrugName, setNewDrugName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newCategory, setNewCategory] = useState('Antibiotik');
  const [newCurrentStock, setNewCurrentStock] = useState('20');
  const [newUnit, setNewUnit] = useState('Box');
  const [newUnitPrice, setNewUnitPrice] = useState('150000');
  const [newSafetyStock, setNewSafetyStock] = useState('50');
  const [newLocation, setNewLocation] = useState('Gudang Utama - Rak A3');

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || m.category.includes(filterCategory);
    
    let matchesType = true;
    if (activeTab === 'MEDICINE') {
      matchesType = m.itemType !== 'ALKES_BMHP';
    } else if (activeTab === 'ALKES_BMHP') {
      matchesType = m.itemType === 'ALKES_BMHP';
    }

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleManualAddSubmit = (e) => {
    e.preventDefault();
    if (!newDrugName.trim()) return;

    const currentStockNum = Number(newCurrentStock) || 0;
    const safetyStockNum = Number(newSafetyStock) || 50;
    const unitPriceNum = Number(newUnitPrice) || 100000;

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
    
    // Reset Form
    setNewDrugName('');
    setNewDosage('');
  };

  const medicineCount = medicines.filter(m => m.itemType !== 'ALKES_BMHP').length;
  const alkesCount = medicines.filter(m => m.itemType === 'ALKES_BMHP').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Info Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 whitespace-nowrap">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Tahap 1: Monitoring Persediaan Obat & Alat Kesehatan (Alkes/BMHP)
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            Warehouse Inventory & Medical Items Entry
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            PIC: Apoteker Gudang • Pemantauan stok real-time persediaan farmasi (obat-obatan) & bahan medis habis pakai (alkes/BMHP).
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
            + Input Manual
          </button>
        </div>
      </div>

      {/* Item Taxonomy Category Tabs */}
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
          Semua Persediaan RS ({medicines.length})
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
          Obat-Obatan Farmasi ({medicineCount})
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
          Alat Kesehatan & BMHP ({alkesCount})
        </button>
      </div>

      {/* AI Intelligence Operational Alerts Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-red-800">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Flame className="w-4 h-4 text-red-600 shrink-0" /> Deteksi Anomali Lonjakan
            </span>
            <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-mono font-bold whitespace-nowrap shrink-0">ALERT</span>
          </div>
          <p className="text-xs text-red-700 leading-relaxed font-medium">
            Terdeteksi lonjakan penggunaan tidak wajar pada <strong>Morphine Sulfate Injection (140%)</strong> di Ruang Rawat Inap Lt 3.
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Stok Mendekati ROP
            </span>
            <span className="px-2 py-0.5 bg-amber-600 text-white rounded-full text-[10px] font-mono font-bold whitespace-nowrap shrink-0">WARNING</span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed font-medium">
            Obat & Alkes (Syringe/Infus) mendekati Safety Stock Limit diprediksi <strong>kehabisan stok dalam 2.5 hari</strong> jika tidak di-reorder.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Brain className="w-4 h-4 text-blue-600 shrink-0" /> Multi-Taxonomy Active
            </span>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-mono font-bold whitespace-nowrap shrink-0">ACTIVE</span>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Sistem mendukung pengelolaan <strong>Obat-Obatan</strong> & <strong>Alat Kesehatan / BMHP</strong> lengkap dengan kalkulasi EOQ otomatis.
          </p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama obat/alkes, kategori, batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-blue-700 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">Semua Kategori (Obat & Alkes)</option>
            <option value="Narkotika">Narkotika / Controlled</option>
            <option value="Antibiotik">Antibiotik</option>
            <option value="Hormon">Hormon / Cold Chain</option>
            <option value="Antiviral">Antiviral High Value</option>
            <option value="Alkes">Alkes / BMHP (Bahan Medis)</option>
            <option value="APD">APD (Alat Pelindung Diri)</option>
          </select>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4 whitespace-nowrap min-w-[280px]">Tipe & Nama Barang</th>
                <th className="p-4 whitespace-nowrap">Stok Fisik Saat Ini</th>
                <th className="p-4 whitespace-nowrap">Harga Unit (IDR)</th>
                <th className="p-4 whitespace-nowrap">Safety Stock & ROP</th>
                <th className="p-4 whitespace-nowrap">Burn Rate (Hari)</th>
                <th className="p-4 text-right whitespace-nowrap">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredMedicines.map((med) => {
                const daysRemaining = (med.currentStock / (med.burnRateDaily || 1)).toFixed(1);
                const isBelowSafety = med.currentStock <= med.minSafetyStock;
                const isAlkes = med.itemType === 'ALKES_BMHP';

                return (
                  <tr key={med.id} className="hover:bg-blue-50/50 transition-colors">
                    
                    {/* Item Name & Category Badge - Strict whitespace-nowrap */}
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
                          {isAlkes ? 'ALKES / BMHP' : 'OBAT PHARMA'}
                        </span>
                        <span className="whitespace-nowrap">{med.dosage}</span>
                        <span className="text-slate-300">•</span>
                        <strong className="text-slate-700 whitespace-nowrap">{med.category}</strong>
                      </div>
                    </td>

                    {/* Stock Level */}
                    <td className="p-4 font-mono font-bold whitespace-nowrap">
                      <div className={`text-sm ${isBelowSafety ? 'text-red-600 font-extrabold' : 'text-slate-900'}`}>
                        {med.currentStock} {med.unit}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans font-medium whitespace-nowrap">
                        Rak: {med.location}
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="p-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      Rp {med.unitPrice?.toLocaleString('id-ID')}
                    </td>

                    {/* Safety Stock & ROP */}
                    <td className="p-4 font-mono text-slate-600 whitespace-nowrap">
                      <div>Min: <strong>{med.minSafetyStock}</strong> {med.unit}</div>
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
      </div>

      {/* Modal Form for Manual Input (Obat or Alkes/BMHP) */}
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
                    <Pill className="w-4 h-4" /> Obat-Obatan Farmasi
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
                    <Stethoscope className="w-4 h-4" /> Alat Kesehatan & BMHP
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

              {/* Stock, Safety Stock, Price */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Stok Awal:</label>
                  <input
                    type="number"
                    value={newCurrentStock}
                    onChange={(e) => setNewCurrentStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Safety Stock Min:</label>
                  <input
                    type="number"
                    value={newSafetyStock}
                    onChange={(e) => setNewSafetyStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-sans font-bold">Harga Satuan (Rp):</label>
                  <input
                    type="number"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Lokasi Gudang / Rak:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-bold"
                />
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
