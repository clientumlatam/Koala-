import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  RefreshCw, 
  Database, 
  PackageCheck, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Building2, 
  Search, 
  Plus, 
  Send, 
  Clock, 
  DollarSign, 
  Activity, 
  Lock, 
  LogOut,
  ArrowUpRight,
  UserPlus,
  Check,
  Eye,
  Edit3,
  Receipt,
  Truck,
  ArrowRightLeft,
  Upload,
  Download,
  Terminal,
  Zap,
  Play,
  Copy,
  Printer,
  Calendar,
  Layers,
  Percent,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { 
  EmployeeUser, 
  EmployeeRole, 
  ErpSyncStatus, 
  QuoteRecord, 
  ProductInventoryRecord, 
  BranchId,
  ErpConnectionConfig,
  ErpInvoice,
  StockTransferOrder,
  ErpSystemType,
  CsvCronTask,
  CsvCronExecutionLog,
  StockMovementRecord
} from '../types';
import { formatCurrency } from '../utils/helpers';
import { CsvCronManager } from './CsvCronManager';
import { StockErpHub } from './StockErpHub';
import { LiveEnterpriseDemoHub } from './LiveEnterpriseDemoHub';
import { SyncHealthDashboard } from './SyncHealthDashboard';
import { DocumentationViewer } from './DocumentationViewer';
import { KoalaLogo } from './KoalaLogo';
import { INITIAL_STOCK_MOVEMENTS } from '../data/adminData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: EmployeeUser;
  onLogout: () => void;
  employees: EmployeeUser[];
  onUpdateEmployees: (updated: EmployeeUser[]) => void;
  erpStatus: ErpSyncStatus;
  onTriggerErpSync: () => void;
  erpConfig: ErpConnectionConfig;
  onUpdateErpConfig: (config: ErpConnectionConfig) => void;
  quotes: QuoteRecord[];
  onUpdateQuoteStatus: (quoteId: string, newStatus: QuoteRecord['status']) => void;
  inventory: ProductInventoryRecord[];
  onUpdateStock: (productId: string, branch: 'roca' | 'neuquen', newStock: number) => void;
  invoices: ErpInvoice[];
  onCreateInvoice: (invoice: ErpInvoice) => void;
  transfers: StockTransferOrder[];
  onCreateTransfer: (transfer: StockTransferOrder) => void;
  onBulkPriceUpdate: (percentage: number) => void;
  cronTasks: CsvCronTask[];
  onUpdateCronTasks: (tasks: CsvCronTask[]) => void;
  cronLogs: CsvCronExecutionLog[];
  onAddCronLog: (log: CsvCronExecutionLog) => void;
  onUpdateInventoryPrices: (updatedItems: { sku: string; price?: number; wholesalePrice?: number; stockRoca?: number; stockNeuquen?: number }[]) => void;
  isStandalonePage?: boolean;
  onNavigateToStore?: () => void;
  onNavigateToDedicatedRoute?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  employees,
  onUpdateEmployees,
  erpStatus,
  onTriggerErpSync,
  erpConfig,
  onUpdateErpConfig,
  quotes,
  onUpdateQuoteStatus,
  inventory,
  onUpdateStock,
  invoices,
  onCreateInvoice,
  transfers,
  onCreateTransfer,
  onBulkPriceUpdate,
  cronTasks,
  onUpdateCronTasks,
  cronLogs,
  onAddCronLog,
  onUpdateInventoryPrices,
  isStandalonePage = false,
  onNavigateToStore,
  onNavigateToDedicatedRoute,
}) => {
  const [activeTab, setActiveTab] = useState<
    'enterprise_demo' | 'sync_health' | 'docs' | 'dashboard' | 'quotes' | 'inventory' | 'transfers' | 'invoices' | 'prices_import' | 'csv_cron' | 'staff' | 'erp_config' | 'api_tester'
  >(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam as any;
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('demo')) return 'enterprise_demo';
      if (hash.includes('health') || hash.includes('sync')) return 'sync_health';
      if (hash.includes('inventory') || hash.includes('stock')) return 'inventory';
      if (hash.includes('doc') || hash.includes('dossier') || hash.includes('propuesta')) return 'docs';
    }
    return 'erp_config';
  });

  const tabsNavRef = React.useRef<HTMLDivElement>(null);

  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (tabsNavRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      tabsNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Stock Movements (Kardex) state
  const [stockMovements, setStockMovements] = useState<StockMovementRecord[]>(INITIAL_STOCK_MOVEMENTS);

  const handleAddStockMovement = (mov: StockMovementRecord) => {
    setStockMovements((prev) => [mov, ...prev]);
  };

  // Search and filter states
  const [quoteFilterStatus, setQuoteFilterStatus] = useState<string>('todas');
  const [quoteFilterBranch, setQuoteFilterBranch] = useState<string>('todas');
  const [inventorySearch, setInventorySearch] = useState<string>('');
  
  // Sync simulation loading state
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transfer creation modal state
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const [transferFrom, setTransferFrom] = useState<BranchId>('roca');
  const [transferTo, setTransferTo] = useState<BranchId>('neuquen');
  const [transferProductId, setTransferProductId] = useState(inventory[0]?.id || '');
  const [transferQty, setTransferQty] = useState(20);
  const [transferNotes, setTransferNotes] = useState('');

  // Bulk Price update state
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  // New Invoice generator modal state
  const [selectedQuoteForInvoice, setSelectedQuoteForInvoice] = useState<QuoteRecord | null>(null);
  const [newInvoiceType, setNewInvoiceType] = useState<'Factura A' | 'Factura B'>('Factura A');
  const [clientCuitInput, setClientCuitInput] = useState('30-71928341-9');

  // API Tester Playground state
  const [apiEndpoint, setApiEndpoint] = useState<string>('GET /api/v2/inventory/sync-stock');
  const [apiPayload, setApiPayload] = useState<string>(
    JSON.stringify({ branchId: 'roca', limit: 50, filterManufacturer: true }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // ERP Config local state
  const [editConfig, setEditConfig] = useState<ErpConnectionConfig>(erpConfig);

  // New employee form state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPass, setNewEmpPass] = useState('123456');
  const [newEmpRole, setNewEmpRole] = useState<EmployeeRole>('ventas');
  const [newEmpBranch, setNewEmpBranch] = useState<BranchId | 'todas'>('roca');

  // CSV Import simulation state
  const [csvContent, setCsvContent] = useState<string>('SKU,PRECIO_MIN,PRECIO_MAY,STOCK_ROCA,STOCK_NQN\nKOA-POL-101,34500,28900,120,85\nKOA-POL-102,12800,10500,200,150');
  const [csvImportSuccess, setCsvImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onTriggerErpSync();
      setIsSyncing(false);
      showNotification(`¡Sincronización con ${erpConfig.systemType} completada con éxito!`);
    }, 1100);
  };

  const handleSaveErpConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateErpConfig(editConfig);
    showNotification('Configuración de conexión ERP guardada y verificada.');
  };

  const handleApplyBulkPrice = () => {
    setIsUpdatingPrices(true);
    setTimeout(() => {
      onBulkPriceUpdate(bulkPercent);
      setIsUpdatingPrices(false);
      showNotification(`¡Se aplicó un ajuste de precios del +${bulkPercent}% a todo el catálogo y se envió al ERP!`);
    }, 900);
  };

  const handleCreateTransferOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferFrom === transferTo) {
      showNotification('La sucursal de origen no puede ser igual a la de destino.');
      return;
    }

    const prod = inventory.find((p) => p.id === transferProductId);
    if (!prod) return;

    const newTransfer: StockTransferOrder = {
      id: `TRF-2026-${Math.floor(Math.random() * 900 + 100)}`,
      remitoNumber: `REM-R-000${transferFrom === 'roca' ? '1' : '2'}-0000${Math.floor(Math.random() * 9000 + 1000)}`,
      date: 'Hoy, ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      fromBranch: transferFrom,
      toBranch: transferTo,
      status: 'en_transito',
      authorizedBy: currentUser.name,
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          quantity: Number(transferQty),
        },
      ],
      notes: transferNotes.trim() || 'Remito de transferencia interna autorizado desde Panel ERP.',
    };

    onCreateTransfer(newTransfer);
    // Adjust local inventory
    if (transferFrom === 'roca') {
      onUpdateStock(prod.id, 'roca', Math.max(0, prod.stockRoca - transferQty));
    } else {
      onUpdateStock(prod.id, 'neuquen', Math.max(0, prod.stockNeuquen - transferQty));
    }

    setShowNewTransfer(false);
    setTransferNotes('');
    showNotification(`Remito de Transferencia ${newTransfer.remitoNumber} generado y transmitido a logística.`);
  };

  const handleGenerateInvoiceFromQuote = () => {
    if (!selectedQuoteForInvoice) return;

    const netAmount = selectedQuoteForInvoice.totalAmount / 1.21;
    const ivaAmount = selectedQuoteForInvoice.totalAmount - netAmount;

    const newInv: ErpInvoice = {
      id: `inv-${Date.now()}`,
      quoteId: selectedQuoteForInvoice.id,
      invoiceType: newInvoiceType,
      invoiceNumber: `000${selectedQuoteForInvoice.branchId === 'roca' ? '1' : '2'}-0000${Math.floor(Math.random() * 9000 + 1000)}`,
      caeNumber: `${Math.floor(Math.random() * 89999999999999 + 10000000000000)}`,
      caeExpiration: '10 días corridos',
      clientName: selectedQuoteForInvoice.clientName,
      clientCuit: clientCuitInput || '30-71482910-8',
      branchId: selectedQuoteForInvoice.branchId,
      totalNet: netAmount,
      totalIva: ivaAmount,
      totalAmount: selectedQuoteForInvoice.totalAmount,
      date: 'Hoy, ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      status: 'emitida_afip',
    };

    onCreateInvoice(newInv);
    onUpdateQuoteStatus(selectedQuoteForInvoice.id, 'facturado_erp');
    setSelectedQuoteForInvoice(null);
    showNotification(`¡Comprobante AFIP (${newInv.invoiceType} #${newInv.invoiceNumber}) emitido con CAE ${newInv.caeNumber}!`);
  };

  const handleRunApiTest = () => {
    setApiLoading(true);
    setApiResponse(null);
    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start);
      setApiLatency(elapsed);
      setApiLoading(false);

      if (apiEndpoint.startsWith('GET')) {
        setApiResponse(
          JSON.stringify(
            {
              status: 200,
              success: true,
              erpSystem: erpConfig.systemType,
              environment: erpConfig.environment,
              serverTimestamp: new Date().toISOString(),
              data: {
                totalSkus: inventory.length,
                branchRocaTotalUnits: inventory.reduce((acc, i) => acc + i.stockRoca, 0),
                branchNeuquenTotalUnits: inventory.reduce((acc, i) => acc + i.stockNeuquen, 0),
                criticalStockAlerts: inventory.filter((i) => i.stockRoca < i.minStockAlert).length,
                apiGatewayVersion: 'v2.4.18',
              },
            },
            null,
            2
          )
        );
      } else if (apiEndpoint.startsWith('POST')) {
        setApiResponse(
          JSON.stringify(
            {
              status: 201,
              success: true,
              erpDocumentId: `ERP-DOC-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
              afipCae: `${Math.floor(Math.random() * 89999999999999 + 10000000000000)}`,
              afipVtoCae: '2026-09-15',
              message: 'Transacción asentada en base de datos central Tango Gestión.',
            },
            null,
            2
          )
        );
      } else {
        setApiResponse(
          JSON.stringify(
            {
              status: 200,
              success: true,
              message: 'Lista de precios mayoristas y minoristas actualizada en tiempo real.',
              recordsUpdated: inventory.length,
            },
            null,
            2
          )
        );
      }
    }, 600);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim()) return;

    const newEmp: EmployeeUser = {
      id: `emp-${Date.now()}`,
      name: newEmpName.trim(),
      email: newEmpEmail.trim(),
      password: newEmpPass.trim() || '123456',
      role: newEmpRole,
      branchId: newEmpBranch,
      active: true,
      lastLogin: 'Recién registrado',
    };

    onUpdateEmployees([...employees, newEmp]);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPass('123456');
    setShowAddEmployee(false);
    showNotification(`Empleado ${newEmp.name} dado de alta con rol ${newEmpRole}.`);
  };

  const toggleEmployeeActive = (empId: string) => {
    const updated = employees.map((emp) => 
      emp.id === empId ? { ...emp, active: !emp.active } : emp
    );
    onUpdateEmployees(updated);
  };

  // Role permissions checker helper
  const canAccess = (tab: typeof activeTab) => {
    if (tab === 'enterprise_demo' || tab === 'sync_health' || tab === 'docs') return true;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'ventas') return tab === 'quotes' || tab === 'inventory' || tab === 'invoices' || tab === 'csv_cron';
    if (currentUser.role === 'deposito') return tab === 'inventory' || tab === 'transfers' || tab === 'quotes';
    if (currentUser.role === 'facturacion') return tab === 'quotes' || tab === 'invoices' || tab === 'dashboard' || tab === 'erp_config' || tab === 'prices_import' || tab === 'csv_cron';
    return false;
  };

  const filteredQuotes = quotes.filter((q) => {
    if (quoteFilterStatus !== 'todas' && q.status !== quoteFilterStatus) return false;
    if (quoteFilterBranch !== 'todas' && q.branchId !== quoteFilterBranch) return false;
    if (currentUser.role !== 'admin' && currentUser.branchId !== 'todas' && q.branchId !== currentUser.branchId) {
      return false;
    }
    return true;
  });

  const filteredInventory = inventory.filter((item) => {
    if (!inventorySearch.trim()) return true;
    const q = inventorySearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.erpCode.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const roleLabels: Record<EmployeeRole, { title: string; color: string; badge: string }> = {
    admin: { title: 'Super Admin / Gerencia', color: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800', badge: '👑 Gerencia' },
    ventas: { title: 'Ejecutivo de Ventas', color: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-800', badge: '💼 Ventas' },
    deposito: { title: 'Logística y Depósito', color: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800', badge: '📦 Depósito' },
    facturacion: { title: 'Administración y ERP', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800', badge: '🧾 Facturación' },
  };

  const statusLabels: Record<QuoteRecord['status'], { label: string; color: string }> = {
    nueva: { label: 'Nueva Cotización', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200' },
    en_preparacion: { label: 'En Preparación', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200' },
    facturado_erp: { label: 'Facturado en ERP', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200' },
    despachado: { label: 'Entregado / Despachado', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300' },
    cancelado: { label: 'Cancelado', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200' },
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyAdminUrl = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/admin`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  const containerClasses = isStandalonePage
    ? 'min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-1.5 sm:p-4 overflow-y-auto';

  const cardClasses = isStandalonePage
    ? 'w-full flex-1 flex flex-col bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
    : 'bg-white dark:bg-slate-900 w-full max-w-7xl h-full max-h-[96vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200';

  return (
    <div className={containerClasses} id="admin-erp-root-container">
      <div className={cardClasses}>
        
        {/* Top Header Bar */}
        <div className="bg-slate-950 text-white p-3.5 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {isStandalonePage && onNavigateToStore && (
              <button
                onClick={onNavigateToStore}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-orange-500 shadow-xs cursor-pointer mr-1"
                title="Regresar a la tienda online pública"
              >
                <span>← Volver a la Tienda</span>
              </button>
            )}

            <div className="bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <KoalaLogo size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black font-fredoka text-white">
                  Panel de Control & ERP Hub — Koala Lo Tiene
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                  {erpConfig.systemType}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span>Ruta:</span>
                  <strong>/admin</strong>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sincronización multi-sucursal (General Roca & Neuquén) con facturación AFIP e inventario
              </p>
            </div>
          </div>

          {/* User Profile Badge, Route Switcher & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
            {/* Copy direct link button */}
            <button
              onClick={handleCopyAdminUrl}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
              title="Copiar URL directa de esta ruta /admin"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-[11px]">¡URL Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline text-[11px]">Copiar /admin</span>
                </>
              )}
            </button>

            {/* Switch to Dedicated Route when in modal mode */}
            {!isStandalonePage && onNavigateToDedicatedRoute && (
              <button
                onClick={onNavigateToDedicatedRoute}
                className="px-2.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                title="Abrir como página independiente en la ruta /admin"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Abrir ruta /admin</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-none">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{roleLabels[currentUser.role].title}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-rose-700"
              title="Cerrar sesión de empleado"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            {!isStandalonePage && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Current Active Employee Info Banner */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Sesión iniciada:</span>
            <strong className="text-slate-900 dark:text-white font-bold">{currentUser.name}</strong>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${roleLabels[currentUser.role].color}`}>
              {roleLabels[currentUser.role].badge}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-orange-500" />
              Sucursal: <strong className="text-slate-800 dark:text-slate-200 uppercase">{currentUser.branchId}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{erpConfig.systemType} ({erpConfig.environment})</span>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar ERP Ahora</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-500 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Tabs Navigation */}
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => handleScrollTabs('left')}
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer bg-slate-100/80 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-700 shrink-0 z-10"
            title="Desplazar pestañas a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div ref={tabsNavRef} className="flex items-center gap-1 px-3 pt-2.5 overflow-x-auto scrollbar-none flex-1">
            <button
              onClick={() => setActiveTab('enterprise_demo')}
              className={`px-4 py-2.5 text-xs font-black flex items-center gap-2 border-b-2 transition-all whitespace-nowrap rounded-t-xl ${
                activeTab === 'enterprise_demo'
                  ? 'border-orange-500 text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-md shadow-orange-600/30'
                  : 'border-transparent text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 font-bold'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>🚀 DEMO EN VIVO (Flujo 5 Departamentos & ISO)</span>
            </button>

            {canAccess('sync_health') && (
              <button
                onClick={() => setActiveTab('sync_health')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap relative ${
                  activeTab === 'sync_health'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Salud del Sistema & Sync ERP</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {canAccess('docs') && (
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap relative ${
                  activeTab === 'docs'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span>Dossier & Documentación</span>
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-extrabold border border-orange-200 dark:border-orange-800">
                  6 docs
                </span>
              </button>
            )}

            {canAccess('dashboard') && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Dashboard ERP</span>
              </button>
            )}

            {canAccess('quotes') && (
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap relative ${
                  activeTab === 'quotes'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Cotizaciones ({quotes.length})</span>
              </button>
            )}

            {canAccess('inventory') && (
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Hub de Stock & ERP Multi-Sucursal</span>
              </button>
            )}

            {canAccess('transfers') && (
              <button
                onClick={() => setActiveTab('transfers')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'transfers'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Remitos Inter-Sucursales ({transfers.length})</span>
              </button>
            )}

            {canAccess('invoices') && (
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'invoices'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Facturación AFIP ({invoices.length})</span>
              </button>
            )}

            {canAccess('prices_import') && (
              <button
                onClick={() => setActiveTab('prices_import')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'prices_import'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>Ajustes & Precios</span>
              </button>
            )}

            {canAccess('csv_cron') && (
              <button
                onClick={() => setActiveTab('csv_cron')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'csv_cron'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Automatización & CSV Cron ({cronTasks.filter((t) => t.active).length})</span>
              </button>
            )}

            {canAccess('erp_config') && (
              <button
                onClick={() => setActiveTab('erp_config')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'erp_config'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span>Configuración ERP</span>
              </button>
            )}

            {canAccess('api_tester') && (
              <button
                onClick={() => setActiveTab('api_tester')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'api_tester'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Tester API REST</span>
              </button>
            )}

            {canAccess('staff') && (
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'staff'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Personal ({employees.length})</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleScrollTabs('right')}
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer bg-slate-100/80 dark:bg-slate-800/80 border-l border-slate-200 dark:border-slate-700 shrink-0 z-10"
            title="Desplazar pestañas a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-950/40">
          
          {/* TAB: DOSSIER & DOCUMENTACION */}
          {activeTab === 'docs' && (
            <div className="h-full">
              <DocumentationViewer />
            </div>
          )}
          
          {/* TAB 0: LIVE ENTERPRISE DEMO (5 DEPARTMENTS & SLA/ISO) */}
          {activeTab === 'enterprise_demo' && (
            <LiveEnterpriseDemoHub
              inventory={inventory}
              quotes={quotes}
              currentUser={currentUser}
              erpConfig={erpConfig}
              onUpdateStock={(productId, stockRoca, stockNeuquen) => {
                onUpdateStock(productId, 'roca', stockRoca);
                onUpdateStock(productId, 'neuquen', stockNeuquen);
              }}
              onNavigateToStore={onNavigateToStore}
            />
          )}

          {/* TAB 0.5: REAL-TIME SYSTEM HEALTH & SYNC MONITOR */}
          {activeTab === 'sync_health' && (
            <SyncHealthDashboard
              inventory={inventory}
              erpConfig={erpConfig}
              erpStatus={erpStatus}
              onTriggerErpSync={onTriggerErpSync}
              onUpdateStock={onUpdateStock}
              onAddStockMovement={handleAddStockMovement}
              quotes={quotes}
            />
          )}

          {/* TAB 1: DASHBOARD ERP */}
          {activeTab === 'dashboard' && canAccess('dashboard') && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                    <span>Ventas / Cotizaciones Hoy</span>
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                    {formatCurrency(quotes.reduce((acc, q) => acc + q.totalAmount, 0))}
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ↑ 18% sincronizado con {erpConfig.systemType}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                    <span>Pendientes de Facturación AFIP</span>
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                    {quotes.filter((q) => q.status === 'nueva' || q.status === 'en_preparacion').length} Pedidos
                  </div>
                  <p className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                    PV 0001 (Roca) / PV 0002 (Nqn)
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                    <span>Alertas de Stock Crítico</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                    {inventory.filter((i) => i.stockRoca < i.minStockAlert || i.stockNeuquen < i.minStockAlert).length} Productos
                  </div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    Requerir reposición en fábrica
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
                    <span>Estado Conexión ERP</span>
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-xl font-black font-fredoka text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Conectado (24ms)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Último sync: {erpStatus.lastSyncTime}
                  </p>
                </div>
              </div>

              {/* Multi-branch Stock Quick Summary */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-600" />
                      <span>Balance de Inventario en Tiempo Real por Sucursal</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Existencias consolidadas entre Casa Central (General Roca) y Sucursal Neuquén Capital
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-500 flex items-center gap-1"
                  >
                    <span>Ver detalle completo de artículos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-slate-900/80 border border-orange-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500" />
                        <strong className="text-slate-900 dark:text-white text-xs">General Roca (Casa Central & Fábrica)</strong>
                      </div>
                      <span className="text-xs font-mono font-bold text-orange-600">Av. Roca 1350</span>
                    </div>
                    <div className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                      {inventory.reduce((acc, i) => acc + i.stockRoca, 0)} unidades
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Módulo Depósito Roca activo. Fabricación propia de polietileno y film stretch.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500" />
                        <strong className="text-slate-900 dark:text-white text-xs">Neuquén Capital (Salón Comercial)</strong>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600">Mitre 678</span>
                    </div>
                    <div className="text-2xl font-black font-fredoka text-slate-900 dark:text-white">
                      {inventory.reduce((acc, i) => acc + i.stockNeuquen, 0)} unidades
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Módulo Salón Neuquén activo. Stock disponible para retiro y flete exprés en el Alto Valle.
                    </p>
                  </div>
                </div>
              </div>

              {/* ERP Sync Event Feed & System Log */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span>Registro de Eventos y Sincronización ERP</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Historial en tiempo real de actualizaciones de precios, notas de pedido e inventario.
                    </p>
                  </div>

                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Forzar Sincronización Completa</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {erpStatus.lastSyncLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3 text-xs"
                    >
                      <div className="mt-0.5">
                        {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {log.type === 'info' && <Database className="w-4 h-4 text-blue-500" />}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white">{log.message}</span>
                          <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                        </div>
                        {log.itemCount && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            Registros procesados: <strong>{log.itemCount} items</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTES MANAGEMENT */}
          {activeTab === 'quotes' && canAccess('quotes') && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                    <span>Estado:</span>
                    <select
                      value={quoteFilterStatus}
                      onChange={(e) => setQuoteFilterStatus(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-hidden"
                    >
                      <option value="todas">Todas</option>
                      <option value="nueva">Nueva Cotización</option>
                      <option value="en_preparacion">En Preparación</option>
                      <option value="facturado_erp">Facturado ERP</option>
                      <option value="despachado">Despachado</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                    <span>Sucursal:</span>
                    <select
                      value={quoteFilterBranch}
                      onChange={(e) => setQuoteFilterBranch(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-hidden"
                    >
                      <option value="todas">Todas las Sucursales</option>
                      <option value="roca">General Roca</option>
                      <option value="neuquen">Neuquén</option>
                    </select>
                  </div>
                </div>

                <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                  Mostrando <strong>{filteredQuotes.length}</strong> presupuestos
                </div>
              </div>

              {/* Quotes Cards Grid */}
              <div className="space-y-3">
                {filteredQuotes.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                          #{q.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusLabels[q.status].color}`}>
                          {statusLabels[q.status].label}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">
                          Sucursal: {q.branchId}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {q.createdAt}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Cliente / Comercio</div>
                        <div className="font-bold text-slate-900 dark:text-white">{q.clientName}</div>
                        <div className="text-slate-500 dark:text-slate-400">Tel: {q.clientPhone}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Entrega & Pago</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                          {q.deliveryType === 'envio' ? `🚚 Envío: ${q.deliveryAddress}` : '🏪 Retiro por local'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 capitalize">
                          Pago: {q.paymentMethod}
                        </div>
                      </div>

                      <div className="md:text-right">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Monto Total</div>
                        <div className="text-lg font-black font-fredoka text-slate-900 dark:text-white">
                          {formatCurrency(q.totalAmount)}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {q.items.length} productos en la lista
                        </div>
                      </div>
                    </div>

                    {/* Items snippet */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-[11px] space-y-1">
                      <div className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Detalle del Pedido:</div>
                      <div className="flex flex-wrap gap-2 text-slate-700 dark:text-slate-300">
                        {q.items.map((item, idx) => (
                          <span key={idx} className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
                            {item.quantity}x {item.product.name} {item.isWholesale ? '(Mayorista)' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions bar per quote */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Cambiar estado:</span>
                        <select
                          value={q.status}
                          onChange={(e) => onUpdateQuoteStatus(q.id, e.target.value as QuoteRecord['status'])}
                          className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold py-1 px-2 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-hidden"
                        >
                          <option value="nueva">Nueva</option>
                          <option value="en_preparacion">En Preparación</option>
                          <option value="facturado_erp">Facturado ERP</option>
                          <option value="despachado">Despachado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {q.erpSyncId ? (
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-extrabold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Sincronizado: {q.erpSyncId}
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedQuoteForInvoice(q)}
                            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-orange-400" />
                            <span>Facturar AFIP/ERP</span>
                          </button>
                        )}

                        <a
                          href={`https://wa.me/549${q.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${q.clientName}! Le escribimos de Koala Lo Tiene respecto a su cotización #${q.id}. Su pedido ya se encuentra ${statusLabels[q.status].label.toLowerCase()}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY BY BRANCH & ERP STOCK HUB */}
          {activeTab === 'inventory' && canAccess('inventory') && (
            <StockErpHub
              inventory={inventory}
              onUpdateStock={onUpdateStock}
              onUpdateInventoryPrices={onUpdateInventoryPrices}
              stockMovements={stockMovements}
              onAddStockMovement={handleAddStockMovement}
              onOpenTransferModal={() => setShowNewTransfer(true)}
              onTriggerErpSync={handleManualSync}
              onCreateTransfer={onCreateTransfer}
            />
          )}

          {/* TAB 4: INTER-BRANCH STOCK TRANSFERS */}
          {activeTab === 'transfers' && canAccess('transfers') && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Remitos de Transferencia Inter-Sucursales</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Control de envíos de mercadería entre Depósito Central Roca y Salón de Ventas Neuquén
                  </p>
                </div>

                <button
                  onClick={() => setShowNewTransfer(true)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Remito de Transferencia</span>
                </button>
              </div>

              {/* Transfers List */}
              <div className="space-y-3">
                {transfers.map((trf) => (
                  <div
                    key={trf.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                          #{trf.id}
                        </span>
                        <span className="font-mono text-xs text-orange-600 dark:text-orange-400 font-bold">
                          {trf.remitoNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
                          🚚 {trf.status === 'en_transito' ? 'En Tránsito por Ruta 22' : 'Recibido'}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400">{trf.date}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Origen & Destino</div>
                        <div className="font-bold text-slate-900 dark:text-white capitalize">
                          {trf.fromBranch === 'roca' ? '🏢 General Roca (Fábrica)' : '🏪 Neuquén Capital'}
                          {' → '}
                          {trf.toBranch === 'neuquen' ? '🏪 Neuquén Capital' : '🏢 General Roca'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">Autorizó: {trf.authorizedBy}</div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Artículos Incluidos</div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {trf.items.map((item, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                              <strong>{item.quantity} u.</strong> {item.productName} ({item.sku})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {trf.notes && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <strong>Nota de chofer/logística:</strong> {trf.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AFIP & ERP INVOICES */}
          {activeTab === 'invoices' && canAccess('invoices') && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    <span>Facturación Electrónica AFIP & Comprobantes ERP</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprobantes fiscales emitidos mediante WebService AFIP / Tango Facturación
                  </p>
                </div>

                <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  Total Facturado: {formatCurrency(invoices.reduce((acc, i) => acc + i.totalAmount, 0))}
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                          {inv.invoiceType}
                        </span>
                        <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                          N° {inv.invoiceNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">
                          Punto de Venta: {inv.branchId === 'roca' ? 'PV 0001 (Roca)' : 'PV 0002 (Neuquén)'}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400">{inv.date}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Razón Social / Cliente</div>
                        <div className="font-bold text-slate-900 dark:text-white">{inv.clientName}</div>
                        <div className="text-slate-500 dark:text-slate-400 font-mono">CUIT: {inv.clientCuit}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Validación Fiscal AFIP</div>
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">CAE: {inv.caeNumber}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">Vto: {inv.caeExpiration}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Desglose Impositivo</div>
                        <div className="text-slate-600 dark:text-slate-300">Neto: {formatCurrency(inv.totalNet)}</div>
                        <div className="text-slate-600 dark:text-slate-300">IVA 21%: {formatCurrency(inv.totalIva)}</div>
                      </div>

                      <div className="md:text-right">
                        <div className="text-slate-400 text-[10px] font-bold uppercase">Total Facturado</div>
                        <div className="text-lg font-black font-fredoka text-slate-900 dark:text-white">
                          {formatCurrency(inv.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BULK PRICE MODIFIERS & CSV IMPORTER */}
          {activeTab === 'prices_import' && canAccess('prices_import') && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Bulk percentage adjustment card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-orange-600" />
                  <span>Ajuste Masivo de Lista de Precios (% Inflación / Costos)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modifica simultáneamente los precios minoristas y mayoristas de todo el catálogo y sincroniza con Tango ERP.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {[5, 10, 15, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBulkPercent(pct)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        bulkPercent === pct
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      +{pct}%
                    </button>
                  ))}

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Personalizado:</span>
                    <input
                      type="number"
                      value={bulkPercent}
                      onChange={(e) => setBulkPercent(Number(e.target.value))}
                      className="w-16 bg-transparent font-bold text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>

                  <button
                    onClick={handleApplyBulkPrice}
                    disabled={isUpdatingPrices}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingPrices ? 'animate-spin' : ''}`} />
                    <span>Aplicar y Enviar a Tango ERP</span>
                  </button>
                </div>
              </div>

              {/* CSV Import/Export */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Importador & Exportador CSV para ERP / Excel</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pegue o importe su archivo plano delimitado por comas desde Tango Gestión o Bejerman
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const csvHeader = 'SKU,NOMBRE,PRECIO_LISTA,PRECIO_MAYORISTA,STOCK_ROCA,STOCK_NEUQUEN\n';
                      const csvRows = inventory
                        .map((i) => `"${i.sku}","${i.name}",${i.price},${i.wholesalePrice || 0},${i.stockRoca},${i.stockNeuquen}`)
                        .join('\n');
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `koala_inventario_precios_${Date.now()}.csv`;
                      a.click();
                      showNotification('Archivo CSV de inventario descargado con éxito.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Catálogo CSV</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block text-slate-600 dark:text-slate-300 font-bold">
                    Pegar datos CSV desde el sistema de gestión:
                  </label>
                  <textarea
                    rows={4}
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab('csv_cron')}
                      className="text-orange-600 hover:text-orange-700 dark:text-orange-400 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Configurar importación automática programada con CSV Cron →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleManualSync();
                        showNotification('¡Archivo CSV procesado e integrado en el catálogo Koala!');
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Procesar e Importar Precios y Stock</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CSV CRON AUTOMATION ENGINE */}
          {activeTab === 'csv_cron' && canAccess('csv_cron') && (
            <CsvCronManager
              tasks={cronTasks}
              onUpdateTasks={onUpdateCronTasks}
              logs={cronLogs}
              onAddLog={onAddCronLog}
              inventory={inventory}
              onUpdateInventoryPrices={onUpdateInventoryPrices}
              onTriggerErpSync={onTriggerErpSync}
            />
          )}

          {/* TAB 7: ERP CONFIGURATION */}
          {activeTab === 'erp_config' && canAccess('erp_config') && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <form onSubmit={handleSaveErpConfig} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-orange-600" />
                      <span>Configuración del Sistema ERP & Endpoints</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Parámetros de conexión de la API REST y credenciales del servidor central
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    Online: {erpConfig.lastSuccessfulPing}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Software ERP Seleccionado
                    </label>
                    <select
                      value={editConfig.systemType}
                      onChange={(e) => setEditConfig({ ...editConfig, systemType: e.target.value as ErpSystemType })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="Tango Gestión ERP">Tango Gestión ERP (Recomendado)</option>
                      <option value="Bejerman ERP">Bejerman ERP</option>
                      <option value="SAP Business One">SAP Business One</option>
                      <option value="Dragonfish">Dragonfish / Zoo Logic</option>
                      <option value="API REST Koala Directa">API REST Koala Directa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Entorno de Ejecución
                    </label>
                    <select
                      value={editConfig.environment}
                      onChange={(e) => setEditConfig({ ...editConfig, environment: e.target.value as 'production' | 'testing_sandbox' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="production">🟢 Producción (Base de Datos Real)</option>
                      <option value="testing_sandbox">🟡 Sandbox / Entorno de Pruebas</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Endpoint URL Servidor ERP
                    </label>
                    <input
                      type="text"
                      value={editConfig.serverUrl}
                      onChange={(e) => setEditConfig({ ...editConfig, serverUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Token Bearer de Autenticación
                    </label>
                    <input
                      type="password"
                      value={editConfig.apiBearerToken}
                      onChange={(e) => setEditConfig({ ...editConfig, apiBearerToken: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      ID de Empresa / Razón Social en ERP
                    </label>
                    <input
                      type="text"
                      value={editConfig.companyId}
                      onChange={(e) => setEditConfig({ ...editConfig, companyId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Aplicar Configuración</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: API REST TESTER PLAYGROUND */}
          {activeTab === 'api_tester' && canAccess('api_tester') && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-purple-600" />
                      <span>Playground de Pruebas API REST ERP</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ejecute llamadas interactivas al Gateway de {erpConfig.systemType} y verifique respuestas JSON
                    </p>
                  </div>

                  {apiLatency !== null && (
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                      Latencia: {apiLatency} ms
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Método & Endpoint a Probar
                    </label>
                    <select
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                    >
                      <option value="GET /api/v2/inventory/sync-stock">GET /api/v2/inventory/sync-stock (Consulta Stock Roca y Nqn)</option>
                      <option value="POST /api/v2/quotes/export-order">POST /api/v2/quotes/export-order (Crear Pedido de Venta en Tango)</option>
                      <option value="PUT /api/v2/prices/update-wholesale">PUT /api/v2/prices/update-wholesale (Actualizar Precios por Bulto)</option>
                      <option value="POST /api/v2/afip/electronic-invoice">POST /api/v2/afip/electronic-invoice (Emitir Factura Electrónica CAE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Payload JSON Request
                    </label>
                    <textarea
                      rows={4}
                      value={apiPayload}
                      onChange={(e) => setApiPayload(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunApiTest}
                      disabled={apiLoading}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{apiLoading ? 'Ejecutando llamada API...' : 'Ejecutar Petición de Prueba'}</span>
                    </button>
                  </div>

                  {apiResponse && (
                    <div className="space-y-1 pt-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold">
                        Respuesta del Servidor ERP (HTTP 200 OK):
                      </label>
                      <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-60">
                        {apiResponse}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: STAFF MANAGEMENT */}
          {activeTab === 'staff' && canAccess('staff') && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Nómina de Empleados y Permisos de Sistema</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Administración de roles (Gerencia, Ventas, Depósito y Facturación ERP).
                  </p>
                </div>

                <button
                  onClick={() => setShowAddEmployee(!showAddEmployee)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nuevo Empleado</span>
                </button>
              </div>

              {/* Add employee form */}
              {showAddEmployee && (
                <form onSubmit={handleCreateEmployee} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-orange-300 dark:border-orange-700 space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Registrar Nuevo Empleado en Koala Lo Tiene
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Nombre y Apellido</label>
                      <input
                        type="text"
                        required
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        placeholder="Ej: Marcelo Paz"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Email Corporativo</label>
                      <input
                        type="email"
                        required
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        placeholder="ej: marcelo@koalalotiene.com.ar"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Contraseña Inicial</label>
                      <input
                        type="password"
                        required
                        value={newEmpPass}
                        onChange={(e) => setNewEmpPass(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Rol Asignado</label>
                      <select
                        value={newEmpRole}
                        onChange={(e) => setNewEmpRole(e.target.value as EmployeeRole)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                      >
                        <option value="ventas">💼 Ejecutivo de Ventas</option>
                        <option value="deposito">📦 Logística y Depósito</option>
                        <option value="facturacion">🧾 Administrador Facturación ERP</option>
                        <option value="admin">👑 Super Admin / Gerencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Sucursal</label>
                      <select
                        value={newEmpBranch}
                        onChange={(e) => setNewEmpBranch(e.target.value as BranchId | 'todas')}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                      >
                        <option value="roca">General Roca</option>
                        <option value="neuquen">Neuquén</option>
                        <option value="todas">Todas las Sucursales</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEmployee(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Guardar Empleado
                    </button>
                  </div>
                </form>
              )}

              {/* Staff Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-700 text-orange-400 font-extrabold flex items-center justify-center text-sm shadow-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">{emp.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{emp.email}</div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${roleLabels[emp.role].color}`}>
                        {roleLabels[emp.role].badge}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">Sucursal Asignada:</span>
                        <strong className="text-slate-800 dark:text-slate-200 uppercase font-mono">{emp.branchId}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">Último Ingreso:</span>
                        <span className="text-slate-600 dark:text-slate-300 font-mono">{emp.lastLogin}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => toggleEmployeeActive(emp.id)}
                        className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
                          emp.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {emp.active ? '✓ Cuenta Activa' : '✕ Desactivado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL: INTER-BRANCH STOCK TRANSFER CREATION */}
      {showNewTransfer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-base font-black font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                <span>Generar Remito de Transferencia de Stock</span>
              </h4>
              <button onClick={() => setShowNewTransfer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransferOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Sucursal Origen</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value as BranchId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="roca">General Roca (Fábrica)</option>
                    <option value="neuquen">Neuquén Capital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Sucursal Destino</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value as BranchId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="neuquen">Neuquén Capital</option>
                    <option value="roca">General Roca (Fábrica)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Producto a Transferir</label>
                <select
                  value={transferProductId}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (SKU: {item.sku}) — Stock Roca: {item.stockRoca} | Nqn: {item.stockNeuquen}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Cantidad de Unidades</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Notas de Expedición</label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Ej: Despacho por furgón de reparto inter-sucursal..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTransfer(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Emitir Remito R
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AFIP INVOICE GENERATOR */}
      {selectedQuoteForInvoice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-base font-black font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>Emitir Factura Electrónica AFIP desde Cotización #{selectedQuoteForInvoice.id}</span>
              </h4>
              <button onClick={() => setSelectedQuoteForInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedQuoteForInvoice.clientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monto Total:</span>
                  <strong className="text-emerald-600 text-sm font-black">{formatCurrency(selectedQuoteForInvoice.totalAmount)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Tipo de Comprobante</label>
                  <select
                    value={newInvoiceType}
                    onChange={(e) => setNewInvoiceType(e.target.value as 'Factura A' | 'Factura B')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Factura A">Factura A (Responsable Inscripto)</option>
                    <option value="Factura B">Factura B (Consumidor Final / Monotributo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">CUIT del Cliente</label>
                  <input
                    type="text"
                    value={clientCuitInput}
                    onChange={(e) => setClientCuitInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGenerateInvoiceFromQuote}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Solicitar CAE y Emitir AFIP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
