import React, { useState } from 'react';
import {
  Package,
  Layers,
  RefreshCw,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileSpreadsheet,
  Activity,
  History,
  TrendingDown,
  TrendingUp,
  Plus,
  Truck,
  ShieldCheck,
  Check,
  X,
  Server,
  Database,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Sliders,
  DollarSign,
  AlertCircle,
  Pencil
} from 'lucide-react';
import {
  ProductInventoryRecord,
  StockMovementRecord,
  BranchId,
  StockTransferOrder
} from '../types';
import { formatCurrency } from '../utils/helpers';
import { ProductEditModal } from './ProductEditModal';

interface StockErpHubProps {
  inventory: ProductInventoryRecord[];
  onUpdateStock: (productId: string, branch: BranchId, newStock: number) => void;
  onUpdateInventoryPrices: (updatedItems: { sku: string; price?: number; wholesalePrice?: number; stockRoca?: number; stockNeuquen?: number }[]) => void;
  stockMovements: StockMovementRecord[];
  onAddStockMovement: (movement: StockMovementRecord) => void;
  onOpenTransferModal: () => void;
  onTriggerErpSync: () => void;
  onCreateTransfer: (transfer: StockTransferOrder) => void;
  onUpdateFullProduct?: (product: ProductInventoryRecord) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const StockErpHub: React.FC<StockErpHubProps> = ({
  inventory,
  onUpdateStock,
  onUpdateInventoryPrices,
  stockMovements,
  onAddStockMovement,
  onOpenTransferModal,
  onTriggerErpSync,
  onCreateTransfer,
  onUpdateFullProduct,
  onDeleteProduct,
}) => {
  // Active sub-tab
  const [subTab, setSubTab] = useState<'inventory' | 'reconciliation' | 'simulator' | 'kardex' | 'replenishment'>('inventory');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockLevelFilter, setStockLevelFilter] = useState<'all' | 'low' | 'ok' | 'zero'>('all');

  // Product Edit / Create Modal state
  const [editingProduct, setEditingProduct] = useState<ProductInventoryRecord | null>(null);
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);

  // Kardex filters
  const [kardexBranchFilter, setKardexBranchFilter] = useState<string>('all');
  const [kardexTypeFilter, setKardexTypeFilter] = useState<string>('all');

  // Manual stock movement modal state
  const [showManualMovementModal, setShowManualMovementModal] = useState(false);
  const [movementSku, setMovementSku] = useState(inventory[0]?.sku || '');
  const [movementBranch, setMovementBranch] = useState<BranchId>('roca');
  const [movementType, setMovementType] = useState<StockMovementRecord['type']>('ingreso_proveedor');
  const [movementQty, setMovementQty] = useState(10);
  const [movementRef, setMovementRef] = useState('REM-PROV-');
  const [movementNotes, setMovementNotes] = useState('Recepción de mercadería en depósito');

  // Simulator running state
  const [simulatorRunning, setSimulatorRunning] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reconciliation state (simulated ERP external values)
  const [reconciledItems, setReconciledItems] = useState<Record<string, { erpRoca: number; erpNqn: number }>>({
    'KOA-POL-101': { erpRoca: (inventory[0]?.stockRoca || 120) + 5, erpNqn: inventory[0]?.stockNeuquen || 85 },
    'KOA-POL-102': { erpRoca: inventory[1]?.stockRoca || 200, erpNqn: (inventory[1]?.stockNeuquen || 150) - 8 },
    'KOA-PAP-103': { erpRoca: (inventory[2]?.stockRoca || 80) - 4, erpNqn: inventory[2]?.stockNeuquen || 65 },
    'KOA-CAR-104': { erpRoca: inventory[3]?.stockRoca || 300, erpNqn: inventory[3]?.stockNeuquen || 210 },
  });

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Stock totals
  const totalStockRoca = inventory.reduce((acc, i) => acc + i.stockRoca, 0);
  const totalStockNeuquen = inventory.reduce((acc, i) => acc + i.stockNeuquen, 0);
  const totalInventoryUnits = totalStockRoca + totalStockNeuquen;
  
  // Total Valuation
  const totalValuationRoca = inventory.reduce((acc, i) => acc + i.stockRoca * (i.wholesalePrice || i.price * 0.8), 0);
  const totalValuationNeuquen = inventory.reduce((acc, i) => acc + i.stockNeuquen * (i.wholesalePrice || i.price * 0.8), 0);
  const totalValuation = totalValuationRoca + totalValuationNeuquen;

  // Filtered inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.erpCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    let matchesStockLevel = true;
    const totalItemStock = item.stockRoca + item.stockNeuquen;
    if (stockLevelFilter === 'zero') {
      matchesStockLevel = item.stockRoca === 0 || item.stockNeuquen === 0;
    } else if (stockLevelFilter === 'low') {
      matchesStockLevel = item.stockRoca <= item.minStockAlert || item.stockNeuquen <= item.minStockAlert;
    } else if (stockLevelFilter === 'ok') {
      matchesStockLevel = item.stockRoca > item.minStockAlert && item.stockNeuquen > item.minStockAlert;
    }

    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  // Categories list
  const categories: string[] = Array.from(new Set(inventory.map((i) => i.category)));

  // Low stock items that require replenishment
  const replenishmentSuggestions = inventory.filter(
    (item) => item.stockNeuquen <= item.minStockAlert && item.stockRoca >= 25
  );

  // Handle manual movement submission
  const handleSaveManualMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find((i) => i.sku === movementSku);
    if (!item) return;

    const currentStock = movementBranch === 'roca' ? item.stockRoca : item.stockNeuquen;
    const isDeduction = movementType.includes('venta') || movementType.includes('salida');
    const change = isDeduction ? -Math.abs(movementQty) : Math.abs(movementQty);
    const newStock = Math.max(0, currentStock + change);

    onUpdateStock(item.id, movementBranch, newStock);

    const newMov: StockMovementRecord = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      timestamp: 'Hoy, ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      branchId: movementBranch,
      sku: item.sku,
      productName: item.name,
      type: movementType,
      quantityChange: change,
      previousStock: currentStock,
      newStock: newStock,
      operator: 'Usuario Administrador (Panel)',
      documentRef: movementRef || 'AJUSTE-MANUAL-01',
      notes: movementNotes,
      erpSyncStatus: 'sincronizado',
    };

    onAddStockMovement(newMov);
    setShowManualMovementModal(false);
    showNotification(`Movimiento registrado: ${change > 0 ? '+' : ''}${change} u. de ${item.name} en ${movementBranch === 'roca' ? 'Roca' : 'Neuquén'}.`);
  };

  // Reconcile single or all items with ERP
  const handleReconcileAllWithErp = () => {
    const updates: { sku: string; stockRoca?: number; stockNeuquen?: number }[] = [];
    const nowStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    Object.entries(reconciledItems).forEach(([sku, erpVals]: [string, { erpRoca: number; erpNqn: number }]) => {
      updates.push({
        sku,
        stockRoca: erpVals.erpRoca,
        stockNeuquen: erpVals.erpNqn,
      });

      const item = inventory.find((i) => i.sku === sku);
      if (item) {
        onAddStockMovement({
          id: `MOV-REC-${Date.now().toString().slice(-4)}`,
          timestamp: `Hoy ${nowStr} hs`,
          branchId: 'roca',
          sku: item.sku,
          productName: item.name,
          type: 'ajuste_inventario',
          quantityChange: erpVals.erpRoca - item.stockRoca,
          previousStock: item.stockRoca,
          newStock: erpVals.erpRoca,
          operator: 'Conciliador Automático Tango ERP',
          documentRef: 'AUDIT-TANGO-REC',
          notes: 'Nivelación de stock físico según recuento del ERP central.',
          erpSyncStatus: 'sincronizado',
        });
      }
    });

    onUpdateInventoryPrices(updates);
    showNotification('¡Inventario conciliado y nivelado al 100% con los saldos físicos de Tango ERP!');
  };

  // Run POS / ERP Simulator Action
  const handleRunSimulation = (
    actionKey: string,
    actionTitle: string,
    execute: () => void
  ) => {
    setSimulatorRunning(actionKey);
    setTimeout(() => {
      execute();
      setSimulatorRunning(null);
      showNotification(`Simulación completada: ${actionTitle}`);
    }, 900);
  };

  // Create Suggested Inter-Branch Transfer
  const handleCreateSuggestedTransfer = (item: ProductInventoryRecord) => {
    const qtyToTransfer = Math.min(30, Math.floor(item.stockRoca / 2));
    if (qtyToTransfer <= 0) {
      showNotification('No hay suficiente stock en Roca para transferir.');
      return;
    }

    const newTransfer: StockTransferOrder = {
      id: `TRF-2026-0${Math.floor(Math.random() * 90 + 10)}`,
      remitoNumber: `REM-R-0001-0000${Math.floor(Math.random() * 900 + 100)}`,
      date: 'Hoy, ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      fromBranch: 'roca',
      toBranch: 'neuquen',
      status: 'en_transito',
      authorizedBy: 'Módulo Inteligente de Reposición (Admin)',
      items: [
        {
          productId: item.id,
          productName: item.name,
          sku: item.sku,
          quantity: qtyToTransfer,
        },
      ],
      notes: `Transferencia automática para reposición de stock mínimo en Neuquén Capital (${qtyToTransfer} unidades).`,
    };

    onCreateTransfer(newTransfer);

    // Decrement Roca stock and log movement
    onUpdateStock(item.id, 'roca', item.stockRoca - qtyToTransfer);
    onAddStockMovement({
      id: `MOV-TRF-${Date.now().toString().slice(-4)}`,
      timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      branchId: 'roca',
      sku: item.sku,
      productName: item.name,
      type: 'transferencia_salida',
      quantityChange: -qtyToTransfer,
      previousStock: item.stockRoca,
      newStock: item.stockRoca - qtyToTransfer,
      operator: 'Sistema de Reposición Automática',
      documentRef: newTransfer.remitoNumber,
      notes: `Despacho hacia Neuquén por remito ${newTransfer.remitoNumber}.`,
      erpSyncStatus: 'sincronizado',
    });

    showNotification(`¡Remito ${newTransfer.remitoNumber} generado! Se despacharon ${qtyToTransfer} u. de ${item.name} hacia Neuquén.`);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Multi-Branch Overview & Valuation KPI */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-fredoka text-white">
                  Hub de Stock & Control ERP Multi-Sucursal
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Sincronizado con Tango ERP
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Control de existencias en tiempo real, conciliación física vs web, Kardex de movimientos y simulador POS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingNewProduct(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Nuevo Producto</span>
            </button>

            <button
              onClick={() => setShowManualMovementModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400" />
              <span>Nuevo Movimiento Manual</span>
            </button>

            <button
              onClick={onOpenTransferModal}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transferir Stock (Remito)</span>
            </button>
          </div>
        </div>

        {/* Multi-branch KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>Depósito General Roca</span>
              <span className="w-2 h-2 rounded-full bg-orange-500" />
            </div>
            <div className="text-base font-black font-fredoka text-white">
              {totalStockRoca.toLocaleString('es-AR')} <span className="text-xs text-slate-400 font-normal">unidades</span>
            </div>
            <div className="text-[11px] text-orange-400 font-mono font-semibold">
              Val: {formatCurrency(totalValuationRoca)}
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>Salón Neuquén Capital</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-base font-black font-fredoka text-white">
              {totalStockNeuquen.toLocaleString('es-AR')} <span className="text-xs text-slate-400 font-normal">unidades</span>
            </div>
            <div className="text-[11px] text-blue-400 font-mono font-semibold">
              Val: {formatCurrency(totalValuationNeuquen)}
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>Stock Consolidado Koala</span>
              <span className="text-emerald-400 text-[10px]">100% Activo</span>
            </div>
            <div className="text-base font-black font-fredoka text-emerald-400">
              {totalInventoryUnits.toLocaleString('es-AR')} <span className="text-xs text-slate-400 font-normal">unidades</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono font-semibold">
              Val. Total: {formatCurrency(totalValuation)}
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>Alertas de Reposición</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <div className="text-base font-black font-fredoka text-rose-400">
              {replenishmentSuggestions.length} productos
            </div>
            <div className="text-[11px] text-slate-400">
              Stock crítico en Neuquén
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-2xs overflow-x-auto">
        <button
          onClick={() => setSubTab('inventory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'inventory'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Matriz de Inventario Multi-Sucursal ({filteredInventory.length})</span>
        </button>

        <button
          onClick={() => setSubTab('reconciliation')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'reconciliation'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Auditoría & Conciliación Tango ERP</span>
        </button>

        <button
          onClick={() => setSubTab('simulator')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'simulator'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Simulador de Eventos POS / ERP en Vivo</span>
        </button>

        <button
          onClick={() => setSubTab('kardex')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'kardex'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Libro Diario Kardex ({stockMovements.length})</span>
        </button>

        <button
          onClick={() => setSubTab('replenishment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ml-auto ${
            subTab === 'replenishment'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Reposición Inteligente ({replenishmentSuggestions.length})</span>
        </button>
      </div>

      {/* Toast message */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SUB-TAB 1: INVENTORY MATRIX */}
      {subTab === 'inventory' && (
        <div className="space-y-3">
          {/* Filters and search */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, SKU (ej. KOA-POL-101) o código ERP..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value="all">Todos los Rubros</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={stockLevelFilter}
                onChange={(e) => setStockLevelFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">Todos los Niveles</option>
                <option value="low">⚠️ Bajo Stock Mínimo</option>
                <option value="zero">❌ Quiebre / Sin Stock</option>
                <option value="ok">✓ Stock Óptimo</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Artículo / Identificación</th>
                    <th className="p-3">Rubro</th>
                    <th className="p-3">Precios (Min / May)</th>
                    <th className="p-3 text-center bg-orange-50/60 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300">
                      Depósito Roca (Mitre 642)
                    </th>
                    <th className="p-3 text-center bg-blue-50/60 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300">
                      Salón Neuquén (Sarmiento 235)
                    </th>
                    <th className="p-3 text-center">Estado General</th>
                    <th className="p-3 text-right">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                  {filteredInventory.map((item) => {
                    const isRocaLow = item.stockRoca <= item.minStockAlert;
                    const isNqnLow = item.stockNeuquen <= item.minStockAlert;
                    const totalUnits = item.stockRoca + item.stockNeuquen;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="p-3 space-y-0.5">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.isManufacturer && (
                              <span className="px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-[9px] font-extrabold">
                                Fábrica Koala
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            SKU: <strong className="text-slate-600 dark:text-slate-300">{item.sku}</strong> | ERP: {item.erpCode}
                          </div>
                        </td>

                        <td className="p-3 capitalize text-slate-600 dark:text-slate-300 font-semibold">
                          {item.category}
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {formatCurrency(item.price)}
                          </div>
                          {item.wholesalePrice && (
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                              May: {formatCurrency(item.wholesalePrice)}
                            </div>
                          )}
                        </td>

                        {/* Stock Roca */}
                        <td className="p-3 text-center bg-orange-50/20 dark:bg-orange-950/10">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                const newQty = Math.max(0, item.stockRoca - 5);
                                onUpdateStock(item.id, 'roca', newQty);
                                onAddStockMovement({
                                  id: `MOV-${Date.now().toString().slice(-4)}`,
                                  timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                                  branchId: 'roca',
                                  sku: item.sku,
                                  productName: item.name,
                                  type: 'ajuste_inventario',
                                  quantityChange: -5,
                                  previousStock: item.stockRoca,
                                  newStock: newQty,
                                  operator: 'Operador Roca',
                                  documentRef: 'AJUSTE-RAPIDO',
                                  erpSyncStatus: 'sincronizado',
                                });
                              }}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 cursor-pointer flex items-center justify-center"
                              title="Restar 5 unidades"
                            >
                              -
                            </button>
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                isRocaLow
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.stockRoca} u.
                            </span>
                            <button
                              onClick={() => {
                                const newQty = item.stockRoca + 5;
                                onUpdateStock(item.id, 'roca', newQty);
                                onAddStockMovement({
                                  id: `MOV-${Date.now().toString().slice(-4)}`,
                                  timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                                  branchId: 'roca',
                                  sku: item.sku,
                                  productName: item.name,
                                  type: 'ajuste_inventario',
                                  quantityChange: +5,
                                  previousStock: item.stockRoca,
                                  newStock: newQty,
                                  operator: 'Operador Roca',
                                  documentRef: 'AJUSTE-RAPIDO',
                                  erpSyncStatus: 'sincronizado',
                                });
                              }}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 cursor-pointer flex items-center justify-center"
                              title="Sumar 5 unidades"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Stock Neuquen */}
                        <td className="p-3 text-center bg-blue-50/20 dark:bg-blue-950/10">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                const newQty = Math.max(0, item.stockNeuquen - 5);
                                onUpdateStock(item.id, 'neuquen', newQty);
                                onAddStockMovement({
                                  id: `MOV-${Date.now().toString().slice(-4)}`,
                                  timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                                  branchId: 'neuquen',
                                  sku: item.sku,
                                  productName: item.name,
                                  type: 'ajuste_inventario',
                                  quantityChange: -5,
                                  previousStock: item.stockNeuquen,
                                  newStock: newQty,
                                  operator: 'Operador Neuquén',
                                  documentRef: 'AJUSTE-RAPIDO',
                                  erpSyncStatus: 'sincronizado',
                                });
                              }}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 cursor-pointer flex items-center justify-center"
                              title="Restar 5 unidades"
                            >
                              -
                            </button>
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                isNqnLow
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.stockNeuquen} u.
                            </span>
                            <button
                              onClick={() => {
                                const newQty = item.stockNeuquen + 5;
                                onUpdateStock(item.id, 'neuquen', newQty);
                                onAddStockMovement({
                                  id: `MOV-${Date.now().toString().slice(-4)}`,
                                  timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                                  branchId: 'neuquen',
                                  sku: item.sku,
                                  productName: item.name,
                                  type: 'ajuste_inventario',
                                  quantityChange: +5,
                                  previousStock: item.stockNeuquen,
                                  newStock: newQty,
                                  operator: 'Operador Neuquén',
                                  documentRef: 'AJUSTE-RAPIDO',
                                  erpSyncStatus: 'sincronizado',
                                });
                              }}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold hover:bg-slate-300 cursor-pointer flex items-center justify-center"
                              title="Sumar 5 unidades"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          {isRocaLow || isNqnLow ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                              ⚠️ Reponer {isRocaLow ? 'Roca' : ''} {isNqnLow ? 'Neuquén' : ''}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                              ✓ Óptimo ({totalUnits} u.)
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(item)}
                              className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-950 dark:hover:bg-orange-900 text-orange-900 dark:text-orange-200 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Editar ficha completa de producto"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => {
                                setMovementSku(item.sku);
                                setShowManualMovementModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RECONCILIATION & AUDIT */}
      {subTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Auditoría & Conciliación en Vivo (Tango ERP vs Tienda Web)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compara los saldos físicos reportados por el ERP con las existencias reservadas y disponibles en la plataforma web
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReconcileAllWithErp}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Nivelar y Conciliar Todo con Tango ERP</span>
                </button>
              </div>
            </div>

            {/* Reconciliation table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">SKU / Producto</th>
                    <th className="p-3 text-center">Físico Tango (Roca)</th>
                    <th className="p-3 text-center">Web Actual (Roca)</th>
                    <th className="p-3 text-center">Físico Tango (Nqn)</th>
                    <th className="p-3 text-center">Web Actual (Nqn)</th>
                    <th className="p-3 text-center">Diferencia</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {inventory.slice(0, 8).map((item) => {
                    const rec = reconciledItems[item.sku] || { erpRoca: item.stockRoca, erpNqn: item.stockNeuquen };
                    const diffRoca = rec.erpRoca - item.stockRoca;
                    const diffNqn = rec.erpNqn - item.stockNeuquen;
                    const hasDiff = diffRoca !== 0 || diffNqn !== 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div className="font-mono text-[10px] text-orange-600 dark:text-orange-400">{item.sku}</div>
                          <div>{item.name}</div>
                        </td>

                        <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                          {rec.erpRoca} u.
                        </td>

                        <td className="p-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {item.stockRoca} u.
                        </td>

                        <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                          {rec.erpNqn} u.
                        </td>

                        <td className="p-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {item.stockNeuquen} u.
                        </td>

                        <td className="p-3 text-center">
                          {hasDiff ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                              {diffRoca !== 0 ? `Roca: ${diffRoca > 0 ? '+' : ''}${diffRoca}` : ''}
                              {diffNqn !== 0 ? ` Nqn: ${diffNqn > 0 ? '+' : ''}${diffNqn}` : ''}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              ✓ 100% Cuadrado
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              onUpdateStock(item.id, 'roca', rec.erpRoca);
                              onUpdateStock(item.id, 'neuquen', rec.erpNqn);
                              showNotification(`Stock de ${item.name} nivelado con Tango ERP.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Nivelar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIVE POS / ERP SIMULATOR (DEMO TOOL) */}
      {subTab === 'simulator' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white">
                    Simulador Interactivo de Eventos ERP & Facturación en Vivo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ideal para la demostración: dispare eventos reales de mostrador, remitos o caídas de red para ver la respuesta instantánea
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Event 1: POS Counter Sale in Roca */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold text-[10px]">
                      PUNTO DE VENTA ROCA (Mitre 642)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">REST Webhook / 18ms</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    Simular Venta Mostrador: 5 Resmas A4 + 2 Film Stretch
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Emite ticket fiscal en el controlador del salón y decrementa existencias inmediatamente en la tienda online.
                  </p>
                </div>

                <button
                  disabled={simulatorRunning !== null}
                  onClick={() =>
                    handleRunSimulation('pos_roca', 'Venta en mostrador Roca procesada', () => {
                      const item1 = inventory[0];
                      const item2 = inventory[2];
                      if (item1) onUpdateStock(item1.id, 'roca', Math.max(0, item1.stockRoca - 2));
                      if (item2) onUpdateStock(item2.id, 'roca', Math.max(0, item2.stockRoca - 5));

                      onAddStockMovement({
                        id: `MOV-POS-${Date.now().toString().slice(-4)}`,
                        timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                        branchId: 'roca',
                        sku: item1?.sku || 'KOA-POL-101',
                        productName: 'Venta Mostrador Roca (Ticket #0001-9481)',
                        type: 'venta_mostrador_pos',
                        quantityChange: -7,
                        previousStock: item1?.stockRoca || 0,
                        newStock: (item1?.stockRoca || 7) - 7,
                        operator: 'Caja 1 - Mostrador Mitre',
                        documentRef: 'TKT-FISCAL-B-0001-0009481',
                        notes: 'Venta presencial a consumidor final.',
                        erpSyncStatus: 'sincronizado',
                      });
                    })
                  }
                  className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulatorRunning === 'pos_roca' ? 'animate-spin' : ''}`} />
                  <span>{simulatorRunning === 'pos_roca' ? 'Enviando a Tango ERP...' : 'Ejecutar Venta Mostrador Roca'}</span>
                </button>
              </div>

              {/* Event 2: Supplier Delivery to Factory */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      INGRESO DE PROVEEDOR
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">EDI / XML Remito</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    Simular Recepción Fábrica: +100 Film Stretch Virgen
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ingresa remito de petroquímica al depósito central y habilita stock para pedidos mayoristas.
                  </p>
                </div>

                <button
                  disabled={simulatorRunning !== null}
                  onClick={() =>
                    handleRunSimulation('supplier_receipt', 'Recepción de 100 bobinas de Film Stretch', () => {
                      const item = inventory[0];
                      if (item) {
                        onUpdateStock(item.id, 'roca', item.stockRoca + 100);
                        onAddStockMovement({
                          id: `MOV-PRV-${Date.now().toString().slice(-4)}`,
                          timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                          branchId: 'roca',
                          sku: item.sku,
                          productName: item.name,
                          type: 'ingreso_proveedor',
                          quantityChange: +100,
                          previousStock: item.stockRoca,
                          newStock: item.stockRoca + 100,
                          operator: 'Depósito Central Roca',
                          documentRef: 'REM-PROV-88219 (Cuyo SA)',
                          notes: 'Materia prima ingresada para envoltura y distribución.',
                          erpSyncStatus: 'sincronizado',
                        });
                      }
                    })
                  }
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulatorRunning === 'supplier_receipt' ? 'animate-spin' : ''}`} />
                  <span>{simulatorRunning === 'supplier_receipt' ? 'Procesando Remito...' : 'Simular Ingreso Proveedor (+100)'}</span>
                </button>
              </div>

              {/* Event 3: Wholesale Sale in Neuquen */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                      SALÓN NEUQUÉN CAPITAL
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Factura A / AFIP CAE</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    Simular Venta Mayorista: 20 Cajas Cartón 40x30
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Facturación a empresa de logística con emisión de CAE y descuento de saldo en Neuquén.
                  </p>
                </div>

                <button
                  disabled={simulatorRunning !== null}
                  onClick={() =>
                    handleRunSimulation('pos_nqn', 'Venta Mayorista en Neuquén completada', () => {
                      const item = inventory[3];
                      if (item) {
                        onUpdateStock(item.id, 'neuquen', Math.max(0, item.stockNeuquen - 20));
                        onAddStockMovement({
                          id: `MOV-NQN-${Date.now().toString().slice(-4)}`,
                          timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
                          branchId: 'neuquen',
                          sku: item.sku,
                          productName: item.name,
                          type: 'venta_mostrador_pos',
                          quantityChange: -20,
                          previousStock: item.stockNeuquen,
                          newStock: Math.max(0, item.stockNeuquen - 20),
                          operator: 'Ventas Neuquén',
                          documentRef: 'FACT-A-0002-0000412',
                          notes: 'Despacho mayorista a Expreso Comahue.',
                          erpSyncStatus: 'sincronizado',
                        });
                      }
                    })
                  }
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulatorRunning === 'pos_nqn' ? 'animate-spin' : ''}`} />
                  <span>{simulatorRunning === 'pos_nqn' ? 'Emitiendo Factura...' : 'Ejecutar Venta Mayorista Nqn'}</span>
                </button>
              </div>

              {/* Event 4: Gateway REST Ping */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[10px]">
                      DIAGNÓSTICO ENLACE ERP
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold">200 OK (24ms)</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    Test de Conectividad & Health Check Gateway
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Verifica el canal de sincronización cifrado HTTPS con los servidores locales de Tango Gestión.
                  </p>
                </div>

                <button
                  disabled={simulatorRunning !== null}
                  onClick={() =>
                    handleRunSimulation('gateway_ping', 'Health Check exitoso: Servidor Tango respondiendo en 24ms', () => {
                      onTriggerErpSync();
                    })
                  }
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Server className="w-3.5 h-3.5 text-orange-400" />
                  <span>Probar Conexión Gateway (Ping)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: KARDEX LOG (MOVEMENTS) */}
      {subTab === 'kardex' && (
        <div className="space-y-3">
          {/* Kardex filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <span>Sucursal:</span>
                <select
                  value={kardexBranchFilter}
                  onChange={(e) => setKardexBranchFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                >
                  <option value="all">Todas las Sucursales</option>
                  <option value="roca">General Roca (Mitre 642)</option>
                  <option value="neuquen">Neuquén Capital (Sarmiento 235)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <span>Tipo de Movimiento:</span>
                <select
                  value={kardexTypeFilter}
                  onChange={(e) => setKardexTypeFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                >
                  <option value="all">Todos los Tipos</option>
                  <option value="ingreso_proveedor">Ingreso Proveedor</option>
                  <option value="venta_mostrador_pos">Venta Mostrador POS</option>
                  <option value="venta_ecommerce_web">Venta eCommerce Web</option>
                  <option value="transferencia_salida">Transferencia Salida</option>
                  <option value="ajuste_inventario">Ajuste Inventario</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowManualMovementModal(true)}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Movimiento</span>
            </button>
          </div>

          {/* Kardex Feed */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-2.5 shadow-xs">
            {stockMovements
              .filter(
                (m) =>
                  (kardexBranchFilter === 'all' || m.branchId === kardexBranchFilter) &&
                  (kardexTypeFilter === 'all' || m.type === kardexTypeFilter)
              )
              .map((mov) => {
                const isPositive = mov.quantityChange > 0;

                return (
                  <div
                    key={mov.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{mov.productName}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{mov.sku}</span>
                          <span
                            className={`px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              mov.branchId === 'roca'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {mov.branchId === 'roca' ? 'Roca' : 'Neuquén'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>Doc: <strong className="text-slate-700 dark:text-slate-300">{mov.documentRef}</strong></span>
                          <span>• Op: {mov.operator}</span>
                          {mov.notes && <span>• <em>{mov.notes}</em></span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-black font-mono ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {mov.quantityChange} u.
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Saldo: {mov.newStock} u. ({mov.timestamp})
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: REPLENISHMENT SUGGESTIONS */}
      {subTab === 'replenishment' && (
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-rose-600" />
                  <span>Módulo de Reposición Inteligente Inter-Sucursales</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detecta artículos con stock por debajo del punto de pedido en Neuquén y propone remitos de transferencia desde Roca
                </p>
              </div>
            </div>

            {replenishmentSuggestions.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ¡Todos los depósitos están perfectamente abastecidos!
                </h4>
                <p className="text-xs text-slate-500">
                  No hay artículos por debajo del stock mínimo de seguridad en ninguna de las sucursales.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {replenishmentSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</span>
                        <span className="font-mono text-[10px] text-orange-600 font-bold">{item.sku}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 text-[11px]">
                        <span>
                          Stock Neuquén (Crítico): <strong className="text-rose-600">{item.stockNeuquen} u.</strong> (Mínimo: {item.minStockAlert} u.)
                        </span>
                        <span>
                          Stock Roca (Disponible): <strong className="text-emerald-600">{item.stockRoca} u.</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCreateSuggestedTransfer(item)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Generar Remito de Transferencia (Roca → Neuquén)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: MANUAL STOCK MOVEMENT */}
      {showManualMovementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-fredoka text-slate-900 dark:text-white">
                  Registrar Movimiento Manual de Stock
                </h3>
              </div>
              <button
                onClick={() => setShowManualMovementModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualMovement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Artículo a Modificar
                </label>
                <select
                  value={movementSku}
                  onChange={(e) => setMovementSku(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                >
                  {inventory.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.sku} - {item.name} (Roca: {item.stockRoca} | Nqn: {item.stockNeuquen})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Sucursal Destino
                  </label>
                  <select
                    value={movementBranch}
                    onChange={(e) => setMovementBranch(e.target.value as BranchId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="roca">General Roca (Mitre 642)</option>
                    <option value="neuquen">Neuquén Capital (Sarmiento 235)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tipo de Operación
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="ingreso_proveedor">Ingreso Remito Proveedor (+)</option>
                    <option value="ajuste_inventario">Ajuste de Conteo / Auditoría (+/-)</option>
                    <option value="venta_mostrador_pos">Venta Mostrador (-)</option>
                    <option value="transferencia_entrada">Ingreso por Transferencia (+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Cantidad (Unidades)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={movementQty}
                    onChange={(e) => setMovementQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Comprobante / Remito Ref.
                  </label>
                  <input
                    type="text"
                    required
                    value={movementRef}
                    onChange={(e) => setMovementRef(e.target.value)}
                    placeholder="REM-PROV-9481"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Observaciones / Motivo
                </label>
                <input
                  type="text"
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  placeholder="Motivo del ajuste o detalle de la mercadería"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowManualMovementModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Impactar en Stock & Kardex
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {(editingProduct || isCreatingNewProduct) && (
        <ProductEditModal
          isOpen={Boolean(editingProduct || isCreatingNewProduct)}
          onClose={() => {
            setEditingProduct(null);
            setIsCreatingNewProduct(false);
          }}
          product={editingProduct}
          isNew={isCreatingNewProduct}
          onSave={(updatedProduct) => {
            if (onUpdateFullProduct) {
              onUpdateFullProduct(updatedProduct);
            }
            onAddStockMovement({
              id: `MOV-EDIT-${Date.now().toString().slice(-4)}`,
              timestamp: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
              branchId: 'roca',
              sku: updatedProduct.sku,
              productName: updatedProduct.name,
              type: 'ajuste_inventario',
              quantityChange: 0,
              previousStock: updatedProduct.stockRoca,
              newStock: updatedProduct.stockRoca,
              operator: 'Administrador (Panel de Control)',
              documentRef: 'FICHA-CATALOGO',
              notes: `Edición de producto: ${updatedProduct.name} ($${updatedProduct.price} min / $${updatedProduct.wholesalePrice || 0} may).`,
              erpSyncStatus: 'sincronizado',
            });
            showNotification(`¡Producto "${updatedProduct.name}" guardado y sincronizado con el catálogo web!`);
          }}
          onDelete={(productId) => {
            if (onDeleteProduct) {
              onDeleteProduct(productId);
              showNotification('Producto eliminado del catálogo.');
            }
          }}
        />
      )}
    </div>
  );
};
