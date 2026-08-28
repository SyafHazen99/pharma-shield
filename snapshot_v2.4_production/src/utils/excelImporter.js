import * as XLSX from 'xlsx';

/**
 * Parses uploaded .xlsx / .xls / .csv File object into structured JSON array
 * @param {File} file - Browser File object
 * @returns {Promise<Array>} List of parsed objects
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Read first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON rows
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        // Map and normalize row keys flexibily
        const normalizedItems = rawRows.map((row, index) => {
          // Normalize column names regardless of case/spacing
          const getVal = (...possibleKeys) => {
            for (let key of possibleKeys) {
              const foundKey = Object.keys(row).find(
                k => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
                return row[foundKey];
              }
            }
            return '';
          };

          const name = getVal('name', 'nama', 'nama obat', 'nama barang', 'nama alkes', 'item') || `Obat/Alkes Import #${index + 1}`;
          const dosage = getVal('dosage', 'dosis', 'spesifikasi', 'spec') || 'Standard';
          const category = getVal('category', 'kategori', 'tipe') || 'Umum';
          const currentStock = Number(getVal('currentstock', 'stok', 'stock', 'stok fisik', 'jumlah')) || 100;
          const unit = getVal('unit', 'satuan') || 'Box';
          const unitPrice = Number(getVal('unitprice', 'harga', 'harga satuan', 'price')) || 50000;
          const minSafetyStock = Number(getVal('minsafetystock', 'safety stock', 'stok min', 'min stock')) || 50;
          const location = getVal('location', 'lokasi', 'rak', 'gudang') || 'Gudang Utama - Rak A1';
          const batchNo = getVal('batchno', 'batch', 'no batch') || `EXCEL-2026-${Math.floor(100 + Math.random() * 900)}`;
          const expiryDate = getVal('expirydate', 'ed', 'kadaluarsa', 'exp') || '2028-12-31';

          // Detect item type (ALKES_BMHP vs MEDICINE)
          const categoryLower = category.toLowerCase();
          const nameLower = name.toLowerCase();
          const isAlkes = categoryLower.includes('alkes') || categoryLower.includes('bmhp') || 
                          categoryLower.includes('apd') || nameLower.includes('syringe') || 
                          nameLower.includes('infus') || nameLower.includes('jarum') || nameLower.includes('masker');

          return {
            id: `MED-XLS-${Math.floor(1000 + Math.random() * 9000)}-${index + 1}`,
            name: String(name).trim(),
            dosage: String(dosage).trim(),
            category: String(category).trim(),
            itemType: isAlkes ? 'ALKES_BMHP' : 'MEDICINE',
            currentStock,
            unit: String(unit).trim(),
            minSafetyStock,
            reorderPoint: Math.round(minSafetyStock * 1.5),
            eoq: Math.round(minSafetyStock * 3),
            unitPrice,
            burnRateDaily: Math.round((currentStock / 20) * 10) / 10 || 5.0,
            abnormalUsageSpike: false,
            batchNo: String(batchNo).trim(),
            expiryDate: String(expiryDate).trim(),
            location: String(location).trim(),
            status: currentStock <= minSafetyStock ? 'Need Reorder' : 'Normal',
            fefoRank: 2,
            supplierId: 'SUP-001'
          };
        });

        resolve(normalizedItems);
      } catch (err) {
        console.error("Excel parse error:", err);
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
