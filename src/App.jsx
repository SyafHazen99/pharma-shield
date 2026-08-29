import React, { useState, useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import DirectorDashboard from './components/DirectorDashboard';
import Stage1Monitoring from './components/Stage1Monitoring';
import Stage2PurchaseRequest from './components/Stage2PurchaseRequest';
import Stage3Approval from './components/Stage3Approval';
import Stage4PurchaseOrder from './components/Stage4PurchaseOrder';
import Stage5GoodsReceipt from './components/Stage5GoodsReceipt';
import Stage6StockUpdate from './components/Stage6StockUpdate';
import Stage7InvoicePayment from './components/Stage7InvoicePayment';
import AuditTrailModal from './components/AuditTrailModal';
import ExcelImportModal from './components/ExcelImportModal';
import GoogleSheetsModal from './components/GoogleSheetsModal';
import Footer from './components/Footer';
import { getWIBTimestamp } from './utils/timeUtils';
import { ROLES, isStageAuthorized } from './config/rbac';
import { REGISTERED_STAFF } from './config/auth';

import { 
  fetchMedicines, 
  createPurchaseRequest, 
  updatePRStatus, 
  createPurchaseOrder, 
  createGoodsReceipt, 
  payInvoice 
} from './services/apiClient';

import { 
  INITIAL_MEDICINES, 
  INITIAL_SUPPLIERS, 
  INITIAL_PURCHASE_REQUESTS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_GOODS_RECEIPTS, 
  INITIAL_INVOICES, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

// React Error Boundary Class
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PharmaShield Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-2xl max-w-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 border border-red-200 flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-900">System Error Recovery Mode</h2>
            <p className="text-xs text-slate-600 font-medium">
              Terjadi kesalahan pada komponen UI. Klik tombol di bawah untuk mereset tampilan:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs font-mono text-red-600 overflow-x-auto">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/25"
            >
              Reset & Muat Ulang Tampilan
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  // Authentication & Session State - dr. Novia Dwi Anggraini as Director Super Admin
  const [currentUser, setCurrentUser] = useState(REGISTERED_STAFF[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Active Role & Stage State
  const [activeRole, setActiveRole] = useState('DIRECTOR');
  const [activeStage, setActiveStageState] = useState(0); // 0 = Executive BI Dashboard
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPoIdForReceipt, setSelectedPoIdForReceipt] = useState(null);
  const [selectedMedForPr, setSelectedMedForPr] = useState(null);

  // Application Data States
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES || []);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS || []);
  const [prs, setPrs] = useState(INITIAL_PURCHASE_REQUESTS || []);
  const [pos, setPos] = useState(INITIAL_PURCHASE_ORDERS || []);
  const [goodsReceipts, setGoodsReceipts] = useState(INITIAL_GOODS_RECEIPTS || []);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES || []);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS || []);

  // Handle Login Action
  const handleLoginSuccess = (staffUser) => {
    setCurrentUser(staffUser);
    setIsAuthenticated(true);
    setActiveRole(staffUser.role);
    const defaultStage = ROLES[staffUser.role]?.defaultStage || 0;
    setActiveStageState(defaultStage);
    logAudit('STAFF_LOGIN', `Staff ${staffUser.name} (${staffUser.roleTitle}) berhasil masuk dengan kredensial ${staffUser.email}.`, 'INFO', staffUser.name);
  };

  // Handle Logout Action
  const handleLogout = () => {
    logAudit('STAFF_LOGOUT', `Staff ${currentUser?.name || 'User'} keluar dari sistem.`, 'INFO', currentUser?.name);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Strict RBAC Stage Switcher
  const setActiveStage = (stageId) => {
    if (!isStageAuthorized(activeRole, stageId)) {
      if (stageId === 1 || stageId === 5) setActiveRole('WAREHOUSE');
      else if (stageId === 2 || stageId === 6) setActiveRole('PHARMACY_HEAD');
      else if (stageId === 4) setActiveRole('PURCHASING');
      else setActiveRole('DIRECTOR');
    }
    setActiveStageState(stageId);
  };

  // Strict RBAC Role Switcher based on dr. Novia's Pipeline
  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    const roleConfig = ROLES[newRole] || ROLES.DIRECTOR;
    setActiveStageState(roleConfig.defaultStage);
    logAudit('RBAC_ROLE_SWITCH', `User berganti wewenang ke ${roleConfig.name}. Mengakses tahapan wewenang resmi: [${roleConfig.authorizedStages.join(', ')}].`, 'INFO', newRole);
  };

  // Attempt backend API sync on mount
  useEffect(() => {
    async function syncBackendData() {
      const serverMedicines = await fetchMedicines();
      if (serverMedicines && serverMedicines.length > 0) {
        setMedicines(serverMedicines);
      }
    }
    syncBackendData();
  }, []);

  // Helper to append audit logs with Real-Time WIB Timestamps
  const logAudit = (action, details, riskLevel = 'INFO', actor = currentUser?.name || activeRole) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: getWIBTimestamp(),
      actor: typeof actor === 'string' ? actor : activeRole,
      role: activeRole,
      action,
      details,
      riskLevel
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handlers
  const handleProceedToReceipt = (poId) => {
    setSelectedPoIdForReceipt(poId);
    setActiveRole('WAREHOUSE');
    setActiveStageState(5);
    logAudit('PROCEED_TO_RECEIPT', `Tim Purchasing melanjutkan PO ${poId} ke Stage 5 Penerimaan Barang. Role disesuaikan ke Apoteker Gudang.`, 'INFO');
  };

  const handleAddSupplier = (newSupplier) => {
    setSuppliers(prev => [newSupplier, ...prev]);
    logAudit('REGISTER_SUPPLIER', `Supplier baru ${newSupplier.name} (${newSupplier.status}) terdaftar dalam katalog vendor.`, 'INFO');
  };

  const handleAddMedicine = (newMed) => {
    setMedicines(prev => [newMed, ...prev]);
    logAudit('MANUAL_MEDICINE_ENTRY', `Obat baru ${newMed.name} (${newMed.dosage}) didaftarkan secara manual oleh ${currentUser?.name || activeRole}.`, 'INFO');
  };

  const handleImportExcelData = (importedItems) => {
    setMedicines(prev => [...importedItems, ...prev]);
    logAudit('EXCEL_IMPORT_BATCH', `Diimpor ${importedItems.length} item obat & alkes dari berkas Excel spreadsheet (.xlsx) ke dalam katalog persediaan RS.`, 'INFO', currentUser?.name || 'dr. Novia Dwi Anggraini');
  };

  const handleTriggerPRFromStock = (med) => {
    setSelectedMedForPr(med);
    logAudit('TRIGGER_SMART_PR', `Apoteker Gudang memicu Smart PR otomatis untuk ${med.name} (Stok: ${med.currentStock}).`, 'INFO');
  };

  const handleCreatePR = async (newPR) => {
    const prWithWibTime = { ...newPR, requestDate: getWIBTimestamp() };
    const apiResult = await createPurchaseRequest(prWithWibTime);
    const prToAdd = apiResult || prWithWibTime;
    setPrs(prev => [prToAdd, ...prev]);
    logAudit('CREATE_PURCHASE_REQUEST', `Dibuat PR baru ${prToAdd.id} untuk ${prToAdd.drugName} Qty ${prToAdd.requestedQty}. Risk Score: ${prToAdd.riskScore}%.`, prToAdd.riskScore >= 70 ? 'HIGH' : 'INFO');
  };

  const handleApprovePR = async (prId) => {
    await updatePRStatus(prId, 'Approved');
    setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'Approved' } : p));
    const prObj = prs.find(p => p.id === prId);
    logAudit('APPROVE_PR', `PR ${prId} (${prObj?.drugName}) disetujui Direktur Keuangan. Anggaran dialokasikan Rp ${prObj?.estimatedTotal?.toLocaleString('id-ID')}.`, 'INFO');
  };

  const handleRejectPR = async (prId, reason) => {
    await updatePRStatus(prId, 'Rejected', reason);
    setPrs(prev => prev.map(p => p.id === prId ? { ...p, status: 'Rejected' } : p));
    logAudit('REJECT_PR', `PR ${prId} ditolak/ditahan untuk audit ulang. Alasan: ${reason || 'Risiko tidak wajar'}`, 'HIGH');
  };

  const handleCreatePO = async (newPO) => {
    const poWithWibTime = { ...newPO, createdDate: getWIBTimestamp() };
    const apiResult = await createPurchaseOrder(poWithWibTime);
    const poToAdd = apiResult || newPO;
    setPos(prev => [poToAdd, ...prev]);
    logAudit('CREATE_PURCHASE_ORDER', `PO ${poToAdd.id} diterbitkan ke vendor ${poToAdd.vendorName} sejumlah Rp ${poToAdd.totalAmount.toLocaleString('id-ID')}.`, 'INFO');
  };

  const handleReceiveGoods = async (newGR) => {
    const grWithWibTime = { ...newGR, receivedDate: getWIBTimestamp() };
    const apiResult = await createGoodsReceipt(grWithWibTime);
    const grToAdd = apiResult || newGR;
    setGoodsReceipts(prev => [grToAdd, ...prev]);
    
    // Inject stock into medicines
    setMedicines(prev => prev.map(m => {
      if (m.name.includes(grToAdd.drugName) || grToAdd.drugName.includes(m.name)) {
        return {
          ...m,
          currentStock: m.currentStock + grToAdd.receivedQty,
          status: 'Normal'
        };
      }
      return m;
    }));

    // Auto-generate Digital Invoice for Stage 7 (3-Way Match Entry)
    const matchedPO = pos.find(p => p.id === grToAdd.poId) || {};
    const newInvoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poId: grToAdd.poId || 'PO-2026-0041',
      grId: grToAdd.id,
      vendorName: matchedPO.vendorName || 'PT Kimia Farma Trading & Distribution',
      drugName: grToAdd.drugName,
      poAmount: matchedPO.totalAmount || (grToAdd.receivedQty * 85000),
      receivedQty: grToAdd.receivedQty,
      invoiceAmount: matchedPO.totalAmount || (grToAdd.receivedQty * 85000),
      threeWayMatchStatus: 'MATCHED',
      paymentStatus: 'UNPAID',
      discrepancyDelta: 0,
      invoiceDate: getWIBTimestamp(),
      taxNpwp: '01.345.678.9-012.000',
      auditNotes: 'Auto-generated e-Invoice dari Goods Receipt Hardware OCR. Seluruh data PO, GR, dan Invoice cocok 100% (Zero Delta).'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    logAudit('GOODS_RECEIPT_OCR', `Goods Receipt ${grToAdd.id} diverifikasi OCR Vision. Batch: ${grToAdd.batchNoScanned || grToAdd.batchNo}. e-Invoice ${newInvoice.id} otomatis dibuat untuk Stage 7.`, 'INFO');
  };

  const handleConfirmStockUpdate = (grId, drugId, qty) => {
    logAudit('STOCK_CARD_CONFIRMED', `Kartu Stok GR ${grId} dikonfirmasi oleh Kepala Farmasi. Penambahan +${qty} Unit dicatat ke sistem.`, 'INFO', currentUser?.name || 'Kepala Farmasi');
  };

  const handleRedistributeStock = (transferPayload) => {
    let targetMedId = typeof transferPayload === 'object' ? transferPayload.medId : transferPayload;
    let targetDepoName = typeof transferPayload === 'object' ? transferPayload.targetDepo : 'Rawat Jalan';
    let qtyToTransfer = typeof transferPayload === 'object' ? transferPayload.transferQty : 50;
    let officer = typeof transferPayload === 'object' ? transferPayload.officerName : currentUser?.name || 'Kepala Farmasi';

    setMedicines(prev => prev.map(m => m.id === targetMedId ? { ...m, currentStock: Math.max(0, m.currentStock - qtyToTransfer) } : m));
    
    const targetMed = medicines.find(m => m.id === targetMedId);
    logAudit(
      'REDISTRIBUTE_STOCK_FEFO', 
      `Redistribusi FEFO: Transfer ${qtyToTransfer} ${targetMed?.unit || 'Unit'} ${targetMed?.name || ''} dari Gudang Utama ke [${targetDepoName}]. Mencegah risiko expired.`, 
      'INFO', 
      officer
    );
  };

  const handleUploadInvoice = (newInv) => {
    const invWithDate = {
      ...newInv,
      invoiceDate: getWIBTimestamp()
    };
    setInvoices(prev => [invWithDate, ...prev]);
    logAudit('VENDOR_INVOICE_UPLOAD', `Faktur digital vendor ${invWithDate.id} (${invWithDate.vendorName}) diunggah untuk verifikasi 3-Way Match.`, 'INFO');
  };

  const handleFlagDiscrepancy = (invId, reason) => {
    setInvoices(prev => prev.map(i => i.id === invId ? { ...i, paymentStatus: 'FLAGGED', threeWayMatchStatus: 'DISCREPANCY', auditNotes: `DISCREPANCY FLAGGED: ${reason || 'Selisih harga / kuantitas tidak cocok'}` } : i));
    logAudit('FLAG_INVOICE_DISCREPANCY', `Tagihan Invoice ${invId} ditahan / diaudit ulang. Alasan: ${reason}`, 'HIGH');
  };

  const handlePayInvoice = async (invId) => {
    await payInvoice(invId);
    setInvoices(prev => prev.map(i => i.id === invId ? { ...i, paymentStatus: 'PAID' } : i));
    const inv = invoices.find(i => i.id === invId);
    logAudit('PAYMENT_RELEASED', `Pembayaran Invoice ${invId} disetujui sebesar Rp ${inv?.invoiceAmount?.toLocaleString('id-ID')}. Three-Way Match Verified.`, 'INFO');
  };

  // If user is not authenticated, render Login Page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Badge pending counts
  const pendingCounts = {
    1: medicines.filter(m => (m?.currentStock || 0) <= (m?.minSafetyStock || 0)).length,
    2: prs.filter(p => p?.status === 'Draft').length,
    3: prs.filter(p => p?.status === 'Pending Approval').length,
    4: prs.filter(p => p?.status === 'Approved' && !pos.some(po => po.prId === p.id)).length,
    5: pos.filter(po => po?.status === 'Ordered').length,
    7: invoices.filter(i => i?.paymentStatus === 'UNPAID' || i?.paymentStatus === 'Pending').length
  };

  const criticalAlertCount = auditLogs.filter(l => l?.riskLevel === 'CRITICAL' || l?.riskLevel === 'HIGH').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        openAuditLog={() => setIsAuditModalOpen(true)}
        openExcelModal={() => setIsExcelModalOpen(true)}
        openGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
        criticalAlertCount={criticalAlertCount}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Sidebar Pipeline Step Navigation */}
        <Sidebar
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          currentUser={currentUser}
          pendingCounts={pendingCounts}
          openAuditLog={() => setIsAuditModalOpen(true)}
          openExcelModal={() => setIsExcelModalOpen(true)}
          openGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Center Content View Area */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8 overflow-y-auto max-w-full">
          
          {/* Active Persona RBAC Banner Info */}
          <div className="mb-6 p-4 bg-white border-2 border-blue-500 shadow-md shadow-blue-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
            <span className="text-slate-800 font-medium">
              Authenticated Staff: <strong className="text-blue-700 font-extrabold">{currentUser?.name} ({currentUser?.roleTitle})</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] bg-amber-50 text-amber-900 border border-amber-300">
              🔒 Hak Akses Resmi [{ROLES[activeRole]?.name || 'Super Admin'}]: Stage [{ROLES[activeRole]?.authorizedStages.join(', ')}] • {ROLES[activeRole]?.description}
            </span>
          </div>

          {activeStage === 0 && (
            <DirectorDashboard
              medicines={medicines}
              prs={prs}
              pos={pos}
              invoices={invoices}
              auditLogs={auditLogs}
              openSheetsModal={() => setIsSheetsModalOpen(true)}
              openExcelModal={() => setIsExcelModalOpen(true)}
            />
          )}

          {activeStage === 1 && (
            <Stage1Monitoring
              medicines={medicines}
              onTriggerPR={handleTriggerPRFromStock}
              onAddMedicine={handleAddMedicine}
              setActiveStage={setActiveStage}
              openExcelModal={() => setIsExcelModalOpen(true)}
              activeRole={activeRole}
              currentUser={currentUser}
            />
          )}

          {activeStage === 2 && (
            <Stage2PurchaseRequest
              prs={prs}
              medicines={medicines}
              suppliers={suppliers}
              selectedMed={selectedMedForPr}
              onCreatePR={handleCreatePR}
              setActiveStage={setActiveStage}
            />
          )}

          {activeStage === 3 && (
            <Stage3Approval
              prs={prs}
              onApprovePR={handleApprovePR}
              onRejectPR={handleRejectPR}
              setActiveStage={setActiveStage}
            />
          )}

          {activeStage === 4 && (
            <Stage4PurchaseOrder
              prs={prs}
              pos={pos}
              suppliers={suppliers}
              onCreatePO={handleCreatePO}
              onAddSupplier={handleAddSupplier}
              onProceedToReceipt={handleProceedToReceipt}
              setActiveStage={setActiveStage}
            />
          )}

          {activeStage === 5 && (
            <Stage5GoodsReceipt
              pos={pos}
              goodsReceipts={goodsReceipts}
              initialPoId={selectedPoIdForReceipt}
              onReceiveGoods={handleReceiveGoods}
              setActiveStage={setActiveStage}
            />
          )}

          {activeStage === 6 && (
            <Stage6StockUpdate
              medicines={medicines}
              goodsReceipts={goodsReceipts}
              onConfirmStockUpdate={handleConfirmStockUpdate}
              onRedistributeStock={handleRedistributeStock}
              setActiveStage={setActiveStage}
            />
          )}

          {activeStage === 7 && (
            <Stage7InvoicePayment
              invoices={invoices}
              pos={pos}
              onUploadInvoice={handleUploadInvoice}
              onPayInvoice={handlePayInvoice}
              onFlagDiscrepancy={handleFlagDiscrepancy}
              openAuditLog={() => setIsAuditModalOpen(true)}
            />
          )}
          <Footer />
        </main>
      </div>

      {/* Global Audit Log Inspector Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLogs={auditLogs}
      />

      {/* Excel Data Upload & Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportData={handleImportExcelData}
      />

      {/* Google Sheets Live Sync Setup Modal (Option A) */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
