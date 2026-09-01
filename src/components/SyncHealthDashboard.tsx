import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Server,
  Database,
  Wifi,
  WifiOff,
  ShieldCheck,
  Zap,
  ArrowRight,
  Filter,
  Search,
  Download,
  Terminal,
  Clock,
  Play,
  Pause,
  XCircle,
  ChevronRight,
  Check,
  Copy,
  Sliders,
  ExternalLink,
  Layers,
  Cpu,
  Radio,
  FileSpreadsheet,
  HelpCircle,
  Flame,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  Boxes
} from 'lucide-react';
import {
  ProductInventoryRecord,
  ErpConnectionConfig,
  ErpSyncStatus,
  StockMovementRecord,
  QuoteRecord,
  BranchId
} from '../types';
import { formatCurrency } from '../utils/helpers';

export interface StockConflictItem {
  id: string;
  sku: string;
  productName: string;
  branch: BranchId;
  erpPhysicalStock: number;
  webPublishedStock: number;
  committedStock: number; // reservas o carritos
  discrepancy: number; // erp - (web + committed)
  severity: 'critical' | 'warning' | 'info';
  conflictReason: string;
  detectedAt: string;
  status: 'unresolved' | 'resolving' | 'resolved';
  lastPosTicket?: string;
  lastWebOrderId?: string;
}

export interface ConnectionErrorLog {
  id: string;
  timestamp: string;
  errorCode: string;
  endpoint: string;
  service: 'ERP Gateway' | 'AFIP WSFE' | 'Webhook Ingress' | 'Redis Sync Queue' | 'Pos Local Hub';
  errorMessage: string;
  severity: 'error' | 'warning' | 'fatal';
  retryCount: number;
  maxRetries: number;
  status: 'pending_retry' | 'auto_resolved' | 'manual_action_required' | 'ignored';
  nextRetryInSec?: number;
  requestPayload?: any;
  responsePayload?: any;
}

export interface LiveSyncEventLog {
  id: string;
  timestamp: string;
  type: 'stock_delta' | 'order_push' | 'price_update' | 'afip_invoice' | 'branch_transfer' | 'health_ping';
  direction: 'ERP -> WEB' | 'WEB -> ERP' | 'AFIP -> ERP' | 'INTERNAL';
  status: 'success' | 'warning' | 'error';
  latencyMs: number;
  summary: string;
  skuOrRef?: string;
  payload: Record<string, any>;
}

interface SyncHealthDashboardProps {
  inventory: ProductInventoryRecord[];
  erpConfig: ErpConnectionConfig;
  erpStatus: ErpSyncStatus;
  onTriggerErpSync: () => void;
  onUpdateStock?: (productId: string, branch: BranchId, newStock: number) => void;
  onAddStockMovement?: (movement: StockMovementRecord) => void;
  quotes?: QuoteRecord[];
}

export const SyncHealthDashboard: React.FC<SyncHealthDashboardProps> = ({
  inventory,
  erpConfig,
  erpStatus,
  onTriggerErpSync,
  onUpdateStock,
  onAddStockMovement,
  quotes = [],
}) => {
  // Active subtab
  const [subTab, setSubTab] = useState<'overview' | 'conflicts' | 'errors' | 'live_stream' | 'probes'>('overview');

  // Auto-refresh timer state
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(5); // in seconds, 0 = paused
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>(new Date().toLocaleTimeString('es-AR'));
  const [latencyHistory, setLatencyHistory] = useState<number[]>([24, 28, 31, 22, 26, 29, 25, 33, 27, 24]);
  const [isTestingProbe, setIsTestingProbe] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState<boolean>(false);

  // Stock conflicts state
  const [conflicts, setConflicts] = useState<StockConflictItem[]>([
    {
      id: 'CONF-101',
      sku: 'KOA-POL-101',
      productName: 'Film Stretch Cristal Virgen 50cm',
      branch: 'roca',
      erpPhysicalStock: 110,
      webPublishedStock: 145,
      committedStock: 15,
      discrepancy: -50,
      severity: 'critical',
      conflictReason: 'Venta por mostrador POS en Roca (Factura A #8410) no sincronizó reserva con el e-commerce antes de checkout web.',
      detectedAt: 'Hace 4 minutos',
      status: 'unresolved',
      lastPosTicket: 'TKT-POS-ROC-9941',
      lastWebOrderId: 'COT-8842',
    },
    {
      id: 'CONF-102',
      sku: 'KOA-POL-102',
      productName: 'Bolsas Camiseta Reforzadas 40x50',
      branch: 'neuquen',
      erpPhysicalStock: 190,
      webPublishedStock: 170,
      committedStock: 0,
      discrepancy: +20,
      severity: 'warning',
      conflictReason: 'Recepción de remito de traslado inter-sucursal #REM-0291 confirmada en ERP pero pendiente de impacto en catálogo online.',
      detectedAt: 'Hace 18 minutos',
      status: 'unresolved',
      lastPosTicket: 'REM-R-0001-0000291',
    },
    {
      id: 'CONF-103',
      sku: 'KOA-PAP-103',
      productName: 'Resma Fotocopia A4 75g Autor',
      branch: 'roca',
      erpPhysicalStock: 65,
      webPublishedStock: 70,
      committedStock: 12,
      discrepancy: -17,
      severity: 'critical',
      conflictReason: 'Riesgo de sobre-venta: Reserva web de 12 resmas supera el remanente físico del depósito de Av. Roca.',
      detectedAt: 'Hace 32 minutos',
      status: 'unresolved',
      lastWebOrderId: 'COT-8841',
    },
    {
      id: 'CONF-104',
      sku: 'KOA-CAR-104',
      productName: 'Cajas de Cartón Corrugado 40x30x30',
      branch: 'neuquen',
      erpPhysicalStock: 100,
      webPublishedStock: 100,
      committedStock: 0,
      discrepancy: 0,
      severity: 'info',
      conflictReason: 'Ajuste de inventario físico verificado y conciliado exitosamente.',
      detectedAt: 'Hace 1 hora',
      status: 'resolved',
    }
  ]);

  // Connection errors state
  const [connectionErrors, setConnectionErrors] = useState<ConnectionErrorLog[]>([
    {
      id: 'ERR-2026-901',
      timestamp: 'Hoy 16:28:10 hs',
      errorCode: 'AFIP_AUTH_TOKEN_WARN',
      endpoint: 'https://wsaa.afip.gov.ar/ws/services/LoginCms',
      service: 'AFIP WSFE',
      errorMessage: 'El Ticket de Acceso (TA) de AFIP expira en menos de 60 minutos. Renovación automática encolada.',
      severity: 'warning',
      retryCount: 0,
      maxRetries: 3,
      status: 'auto_resolved',
      requestPayload: { service: 'wsfe', cuit: '30-71482910-8', sign: '***' },
      responsePayload: { status: 'OK', expiration: '2026-08-30T22:00:00-03:00' }
    },
    {
      id: 'ERR-2026-902',
      timestamp: 'Hoy 15:42:05 hs',
      errorCode: 'GATEWAY_TIMEOUT_504',
      endpoint: 'https://erp.koalalotiene.com.ar/api/v2/gateway/stock/sync',
      service: 'ERP Gateway',
      errorMessage: 'Tiempo de espera agotado (Timeout > 4000ms) durante la consulta de saldos masivos de Neuquén.',
      severity: 'error',
      retryCount: 2,
      maxRetries: 5,
      status: 'pending_retry',
      nextRetryInSec: 8,
      requestPayload: { branchId: 'neuquen', batchSize: 50, timestamp: '15:42:00' },
      responsePayload: { error: 'Gateway Timeout', code: 504 }
    },
    {
      id: 'ERR-2026-903',
      timestamp: 'Hoy 14:15:33 hs',
      errorCode: 'STOCK_LOCK_CONTENTION',
      endpoint: 'POST /api/v2/webhooks/orders',
      service: 'Webhook Ingress',
      errorMessage: 'Bloqueo concurrente temporal al actualizar SKU KOA-POL-101 desde canal POS mostrador.',
      severity: 'warning',
      retryCount: 1,
      maxRetries: 3,
      status: 'auto_resolved',
      requestPayload: { sku: 'KOA-POL-101', quantityChange: -10, source: 'POS_ROCA' },
      responsePayload: { status: 're-queued_and_applied', latency: 45 }
    }
  ]);

  // Live Sync Events Feed
  const [liveEvents, setLiveEvents] = useState<LiveSyncEventLog[]>([
    {
      id: 'EVT-501',
      timestamp: new Date(Date.now() - 5000).toLocaleTimeString('es-AR'),
      type: 'health_ping',
      direction: 'INTERNAL',
      status: 'success',
      latencyMs: 24,
      summary: 'Heartbeat de sincronización bidireccional verificado. Buffer de cola vacío.',
      payload: { status: 'HEALTHY', pingMs: 24, activeSockets: 4, queueLength: 0 }
    },
    {
      id: 'EVT-502',
      timestamp: new Date(Date.now() - 25000).toLocaleTimeString('es-AR'),
      type: 'stock_delta',
      direction: 'ERP -> WEB',
      status: 'success',
      latencyMs: 38,
      skuOrRef: 'KOA-POL-101',
      summary: 'Ajuste de stock en Roca aplicado (+100 unidades por Remito Proveedor Petroquímica).',
      payload: { sku: 'KOA-POL-101', previousStock: 45, newStock: 145, branch: 'roca' }
    },
    {
      id: 'EVT-503',
      timestamp: new Date(Date.now() - 55000).toLocaleTimeString('es-AR'),
      type: 'afip_invoice',
      direction: 'AFIP -> ERP',
      status: 'success',
      latencyMs: 210,
      skuOrRef: 'Factura A #0001-00008412',
      summary: 'CAE #74192839102938 validado y asentado en Tango ERP para Distribuidora Fiestas SRL.',
      payload: { invoiceNumber: '0001-00008412', cae: '74192839102938', total: 145000, iva: 25165.29 }
    },
    {
      id: 'EVT-504',
      timestamp: new Date(Date.now() - 110000).toLocaleTimeString('es-AR'),
      type: 'order_push',
      direction: 'WEB -> ERP',
      status: 'success',
      latencyMs: 44,
      skuOrRef: 'COT-8842',
      summary: 'Pedido web Panadería San Martín transmitido al módulo de ventas ERP.',
      payload: { orderId: 'COT-8842', total: 98500, branch: 'roca', itemsCount: 3 }
    }
  ]);

  // Selected event or error for payload inspection modal
  const [inspectedPayload, setInspectedPayload] = useState<{ title: string; json: any } | null>(null);

  // Conflict filter
  const [conflictSeverityFilter, setConflictSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [errorServiceFilter, setErrorServiceFilter] = useState<'all' | 'ERP Gateway' | 'AFIP WSFE' | 'Webhook Ingress'>('all');
  const [eventFilterType, setEventFilterType] = useState<string>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Heartbeat simulation & interval
  useEffect(() => {
    if (isPaused || autoRefreshInterval === 0) return;

    const timer = setInterval(() => {
      const newLatency = Math.floor(Math.random() * 15) + 20; // 20ms - 35ms
      setLatencyHistory((prev) => [...prev.slice(1), newLatency]);
      setLastHeartbeat(new Date().toLocaleTimeString('es-AR'));

      // Decrement countdown for retries
      setConnectionErrors((prev) =>
        prev.map((err) => {
          if (err.status === 'pending_retry' && err.nextRetryInSec && err.nextRetryInSec > 0) {
            const next = err.nextRetryInSec - autoRefreshInterval;
            if (next <= 0) {
              return {
                ...err,
                status: 'auto_resolved',
                nextRetryInSec: 0,
                retryCount: err.retryCount + 1
              };
            }
            return { ...err, nextRetryInSec: next };
          }
          return err;
        })
      );
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, isPaused]);

  // Calculated Metrics
  const unresolvedConflicts = useMemo(() => conflicts.filter((c) => c.status === 'unresolved'), [conflicts]);
  const criticalConflictsCount = useMemo(() => unresolvedConflicts.filter((c) => c.severity === 'critical').length, [unresolvedConflicts]);
  const pendingErrorsCount = useMemo(() => connectionErrors.filter((e) => e.status === 'pending_retry').length, [connectionErrors]);
  const avgLatency = Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length);

  // Global Health Score calculation
  const healthScore = useMemo(() => {
    if (circuitBreakerTripped) return 65.0;
    let score = 100.0;
    score -= criticalConflictsCount * 3.5;
    score -= (unresolvedConflicts.length - criticalConflictsCount) * 1.5;
    score -= pendingErrorsCount * 4.0;
    if (avgLatency > 100) score -= 5.0;
    return Math.max(50.0, Math.min(100.0, score));
  }, [criticalConflictsCount, unresolvedConflicts.length, pendingErrorsCount, avgLatency, circuitBreakerTripped]);

  // Actions
  const handleResolveConflict = (conflict: StockConflictItem, resolutionMethod: 'force_erp' | 'update_web' | 'audit_kardex') => {
    // Find target product in inventory
    const targetProduct = inventory.find((p) => p.sku === conflict.sku);
    
    if (resolutionMethod === 'force_erp') {
      if (targetProduct && onUpdateStock) {
        onUpdateStock(targetProduct.id, conflict.branch, conflict.erpPhysicalStock);
      }
      showToast(`Stock web alineado con ERP físico (${conflict.erpPhysicalStock} un. en ${conflict.branch.toUpperCase()}).`);
    } else if (resolutionMethod === 'update_web') {
      showToast(`Catálogo web forzado como prioritario para ${conflict.sku}.`);
    } else if (resolutionMethod === 'audit_kardex') {
      if (onAddStockMovement) {
        onAddStockMovement({
          id: `ADJ-${Date.now().toString().slice(-4)}`,
          timestamp: 'Ahora mismo',
          branchId: conflict.branch,
          sku: conflict.sku,
          productName: conflict.productName,
          type: 'ajuste_inventario',
          quantityChange: conflict.erpPhysicalStock - conflict.webPublishedStock,
          previousStock: conflict.webPublishedStock,
          newStock: conflict.erpPhysicalStock,
          operator: 'Health Engine Auto-Fix',
          documentRef: `RESOLV-${conflict.id}`,
          notes: `Resolución de conflicto de concurrencia: ${conflict.conflictReason}`,
          erpSyncStatus: 'sincronizado'
        });
      }
      showToast(`Ajuste de Kardex registrado y conciliado en ERP.`);
    }

    // Mark as resolved
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflict.id ? { ...c, status: 'resolved' } : c))
    );

    // Push live event
    const newEvent: LiveSyncEventLog = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('es-AR'),
      type: 'stock_delta',
      direction: 'INTERNAL',
      status: 'success',
      latencyMs: 18,
      skuOrRef: conflict.sku,
      summary: `Conflicto ${conflict.id} resuelto mediante [${resolutionMethod.toUpperCase()}]. Stock sincronizado.`,
      payload: { conflictId: conflict.id, sku: conflict.sku, branch: conflict.branch, resolution: resolutionMethod }
    };
    setLiveEvents((prev) => [newEvent, ...prev]);
  };

  const handleSimulateNewConflict = () => {
    const randomProduct = inventory[Math.floor(Math.random() * inventory.length)] || inventory[0];
    const targetBranch: BranchId = Math.random() > 0.5 ? 'roca' : 'neuquen';
    const currentStock = targetBranch === 'roca' ? (randomProduct.stockRoca || 50) : (randomProduct.stockNeuquen || 30);
    const posSold = Math.floor(Math.random() * 15) + 5;
    const newPhysical = Math.max(0, currentStock - posSold);

    const newConflict: StockConflictItem = {
      id: `CONF-${Math.floor(Math.random() * 900) + 100}`,
      sku: randomProduct.sku || 'KOA-GEN-99',
      productName: randomProduct.name,
      branch: targetBranch,
      erpPhysicalStock: newPhysical,
      webPublishedStock: currentStock,
      committedStock: Math.floor(Math.random() * 8) + 2,
      discrepancy: -(posSold),
      severity: 'critical',
      conflictReason: `Venta POS en salón ${targetBranch === 'roca' ? 'General Roca' : 'Neuquén Capital'} de ${posSold} un. ocurrió simultáneamente con orden e-commerce en proceso.`,
      detectedAt: 'Ahora mismo (Simulado)',
      status: 'unresolved',
      lastPosTicket: `TKT-POS-${targetBranch.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`
    };

    setConflicts((prev) => [newConflict, ...prev]);
    showToast(`⚠️ Nuevo conflicto de stock detectado en tiempo real para ${randomProduct.name}.`);

    // Add error & live event
    const newEvent: LiveSyncEventLog = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('es-AR'),
      type: 'stock_delta',
      direction: 'ERP -> WEB',
      status: 'warning',
      latencyMs: 42,
      skuOrRef: randomProduct.sku,
      summary: `ALERTA DISCREPANCIA: Stock ERP (${newPhysical} un.) vs Web (${currentStock} un.) en ${targetBranch.toUpperCase()}.`,
      payload: newConflict
    };
    setLiveEvents((prev) => [newEvent, ...prev]);
  };

  const handleSimulateNetworkError = () => {
    const newErr: ConnectionErrorLog = {
      id: `ERR-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('es-AR'),
      errorCode: 'ERP_HTTP_503_SERVICE_UNAVAILABLE',
      endpoint: 'https://erp.koalalotiene.com.ar/api/v2/gateway/stock/batch',
      service: 'ERP Gateway',
      errorMessage: 'El servidor central de Tango ERP respondió 503 (Mantenimiento / Alta Carga). Circuito encolador activo.',
      severity: 'error',
      retryCount: 0,
      maxRetries: 4,
      status: 'pending_retry',
      nextRetryInSec: 12,
      requestPayload: { itemsCount: 48, branch: 'todas' },
      responsePayload: { error: 'Service Unavailable', retryAfter: 12 }
    };
    setConnectionErrors((prev) => [newErr, ...prev]);
    showToast(`🛑 Simulación de Error 503 generada. Se activó el reintento automático con backoff.`);
  };

  const handleRunFullProbe = (probeName: string) => {
    setIsTestingProbe(probeName);
    setTimeout(() => {
      setIsTestingProbe(null);
      showToast(`✅ Diagnóstico de [${probeName}] completado con éxito: 100% operativo.`);
      
      const newEvent: LiveSyncEventLog = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString('es-AR'),
        type: 'health_ping',
        direction: 'INTERNAL',
        status: 'success',
        latencyMs: Math.floor(Math.random() * 20) + 15,
        summary: `Sonda de diagnóstico '${probeName}' ejecutada. SLA: 100% OK.`,
        payload: { probe: probeName, passed: true, timestamp: new Date().toISOString() }
      };
      setLiveEvents((prev) => [newEvent, ...prev]);
    }, 900);
  };

  const handleRetryAllPendingErrors = () => {
    setConnectionErrors((prev) =>
      prev.map((err) => ({
        ...err,
        status: 'auto_resolved',
        retryCount: err.retryCount + 1,
        nextRetryInSec: 0
      }))
    );
    showToast(`✅ Todos los errores en cola fueron reintentados y resueltos.`);
  };

  const handleClearResolvedErrors = () => {
    setConnectionErrors((prev) => prev.filter((err) => err.status !== 'auto_resolved'));
    showToast(`🧹 Registro de errores resueltos limpiado.`);
  };

  const handleExportHealthReportCsv = () => {
    const headers = ['Tipo_Registro', 'ID', 'Timestamp', 'Servicio_o_SKU', 'Estado', 'Severidad', 'Detalle_Diagnostico'];
    const rows: string[] = [];

    // Add conflicts
    conflicts.forEach((c) => {
      rows.push([
        'CONFLICTO_STOCK',
        `"${c.id}"`,
        `"${c.detectedAt}"`,
        `"${c.sku} (${c.branch})"`,
        `"${c.status}"`,
        `"${c.severity}"`,
        `"${c.conflictReason.replace(/"/g, '""')}"`
      ].join(';'));
    });

    // Add errors
    connectionErrors.forEach((e) => {
      rows.push([
        'ERROR_CONEXION',
        `"${e.id}"`,
        `"${e.timestamp}"`,
        `"${e.service} - ${e.errorCode}"`,
        `"${e.status}"`,
        `"${e.severity}"`,
        `"${e.errorMessage.replace(/"/g, '""')}"`
      ].join(';'));
    });

    // Summary lines
    const summary = [
      '',
      `"--- REPORTE DE SALUD DEL SISTEMA ERP/E-COMMERCE KOALA ---"`,
      `"Fecha Emision:";"${new Date().toLocaleString('es-AR')}"`,
      `"Indice de Salud Global:";"${healthScore.toFixed(1)}%"`,
      `"Latencia Promedio ms:";"${avgLatency}"`,
      `"Total Conflictos de Stock:";"${conflicts.length}"`,
      `"Conflictos No Resueltos:";"${unresolvedConflicts.length}"`,
      `"Total Errores de Conexión:";"${connectionErrors.length}"`
    ];

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows, ...summary].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Koala_Health_Sync_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Payload Inspector Modal */}
      {inspectedPayload && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">{inspectedPayload.title}</h3>
              </div>
              <button
                onClick={() => setInspectedPayload(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto font-mono text-xs text-emerald-300 bg-slate-950 flex-1 rounded-b-2xl">
              <pre className="whitespace-pre-wrap">{JSON.stringify(inspectedPayload.json, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Header Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SYNC EN TIEMPO REAL ACTIVO
              </span>
              <span className="text-xs text-slate-400">
                Latido:{' '}
                <strong className="text-slate-200 font-mono">{lastHeartbeat}</strong>
              </span>
              <span className="text-xs text-slate-400">
                Servidor ERP:{' '}
                <strong className="text-orange-300">{erpConfig.systemType}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-orange-400" />
              Dashboard de Salud del Sistema & Sincronización ERP
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Monitor de conectividad bidireccional entre la tienda online y los depósitos de General Roca y Neuquén.
              Detección y resolución instantánea de conflictos de concurrencia de stock y contingencia ante cortes.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => handleRunFullProbe('Diagnóstico General')}
              disabled={isTestingProbe !== null}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isTestingProbe ? 'animate-spin' : ''}`} />
              <span>{isTestingProbe ? 'Verificando...' : 'Ejecutar Sonda'}</span>
            </button>
            <button
              onClick={handleExportHealthReportCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-600 transition-all cursor-pointer"
              title="Descargar reporte completo en CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-xl border font-bold text-xs flex items-center transition-all cursor-pointer ${
                isPaused
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isPaused ? 'Reanudar auto-refresco' : 'Pausar auto-refresco'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Global Health Index & Latency Meter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-800">
          {/* Card 1: Health Index */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Índice de Salud</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-black ${healthScore >= 90 ? 'text-emerald-400' : healthScore >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
                {healthScore.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400">Óptimo</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${healthScore >= 90 ? 'bg-emerald-500' : healthScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* Card 2: Latency */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latencia ERP</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-xl font-black text-sky-400 font-mono">{avgLatency} ms</span>
              <span className="text-[10px] text-emerald-400">Ultra-Rápido</span>
            </div>
            {/* Sparkline simulation */}
            <div className="flex items-end gap-1 h-3">
              {latencyHistory.map((val, idx) => (
                <div
                  key={idx}
                  className="w-1.5 bg-sky-500/70 rounded-xs transition-all"
                  style={{ height: `${Math.min(100, (val / 40) * 100)}%` }}
                  title={`${val} ms`}
                />
              ))}
            </div>
          </div>

          {/* Card 3: Stock Conflicts */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conflictos Stock</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-black ${unresolvedConflicts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {unresolvedConflicts.length}
              </span>
              <span className="text-[10px] text-slate-400">
                {criticalConflictsCount > 0 ? `${criticalConflictsCount} críticos` : '0 críticos'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {unresolvedConflicts.length === 0 ? 'Stock 100% cuadrado' : 'Acción requerida'}
            </span>
          </div>

          {/* Card 4: Connection Errors */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Errores / Reintentos</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-black ${pendingErrorsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {pendingErrorsCount}
              </span>
              <span className="text-[10px] text-slate-400">en cola</span>
            </div>
            <span className="text-[10px] text-slate-400">Auto-Backoff activo</span>
          </div>

          {/* Card 5: AFIP Status */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AFIP WSFE</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-xl font-black text-emerald-400">ONLINE</span>
              <span className="text-[10px] text-slate-400">CAE ok</span>
            </div>
            <span className="text-[10px] text-slate-400">Puntos Venta 0001 / 0002</span>
          </div>

          {/* Card 6: Circuit Breaker */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contingencia</span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-black ${circuitBreakerTripped ? 'text-rose-400' : 'text-emerald-400'}`}>
                {circuitBreakerTripped ? 'TRIPPED' : 'NORMAL'}
              </span>
            </div>
            <button
              onClick={() => {
                setCircuitBreakerTripped(!circuitBreakerTripped);
                showToast(circuitBreakerTripped ? 'Modo Contingencia desactivado.' : 'Modo Contingencia Offline activado.');
              }}
              className="text-[10px] text-orange-400 hover:underline text-left cursor-pointer"
            >
              {circuitBreakerTripped ? 'Restaurar' : 'Probar corte'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            subTab === 'overview'
              ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Topología & Conectores</span>
        </button>

        <button
          onClick={() => setSubTab('conflicts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer relative ${
            subTab === 'conflicts'
              ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Conflictos de Stock ({unresolvedConflicts.length})</span>
          {unresolvedConflicts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute -top-1 -right-1" />
          )}
        </button>

        <button
          onClick={() => setSubTab('errors')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            subTab === 'errors'
              ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Registro de Errores ({connectionErrors.length})</span>
        </button>

        <button
          onClick={() => setSubTab('live_stream')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            subTab === 'live_stream'
              ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Stream en Vivo ({liveEvents.length})</span>
        </button>

        <button
          onClick={() => setSubTab('probes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            subTab === 'probes'
              ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Sondas de Auto-Diagnóstico</span>
        </button>
      </div>

      {/* SUBTAB 1: TOPOLOGY & CONNECTORS */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Microservices & Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Service 1: ERP Gateway */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Gateway ERP</h3>
                    <p className="text-[11px] text-slate-500 font-mono">https://erp.koalalotiene.com.ar/api/v2</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  200 OK
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Uptime</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">99.98%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Latencia</span>
                  <span className="font-bold text-emerald-600">24 ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Autenticación</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Bearer JWT</span>
                </div>
              </div>
              <button
                onClick={() => handleRunFullProbe('API Gateway ERP')}
                className="w-full py-1.5 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 rounded-lg hover:bg-orange-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                <span>Testear Latencia Directa</span>
              </button>
            </div>

            {/* Service 2: AFIP Fiscal Hub */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">AFIP WSAA & WSFE</h3>
                    <p className="text-[11px] text-slate-500">Facturación Electrónica A y B</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  AUTORIZADO
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Token Expira</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">11h 20m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Puntos Venta</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">0001 / 0002</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CAE SLA</span>
                  <span className="font-bold text-emerald-600">0.3 seg</span>
                </div>
              </div>
              <button
                onClick={() => handleRunFullProbe('AFIP WSFE Service')}
                className="w-full py-1.5 text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 rounded-lg hover:bg-sky-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Verificar Ticket de Acceso (TA)</span>
              </button>
            </div>

            {/* Service 3: Multi-Branch Ingress & Sockets */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Webhooks Ingress</h3>
                    <p className="text-[11px] text-slate-500 font-mono">/api/v2/webhooks/orders</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  ESCUCHANDO
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sockets</span>
                  <span className="font-bold text-purple-600">4 Activos</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Buffer Cola</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">0 Pendientes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Firma HMAC</span>
                  <span className="font-bold text-emerald-600">SHA-256</span>
                </div>
              </div>
              <button
                onClick={() => handleRunFullProbe('Webhooks Ingress Bus')}
                className="w-full py-1.5 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 rounded-lg hover:bg-purple-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                <span>Simular Push de Orden Web</span>
              </button>
            </div>
          </div>

          {/* Real-world Interactive Architecture Banner */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Mapeo de Flujo de Datos & Algoritmo Anti-Colisión de Stock</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cada venta efectuada por mostrador (Tango POS / Bejerman) en las sucursales de General Roca o Neuquén emite
              un webhook delta con bloqueo atómico de 50ms. Si un cliente web intenta comprar la última unidad disponible
              en simultáneo, el sistema realiza una reserva temporal de 15 minutos en el buffer de contingencia,
              garantizando <strong>cero cancelaciones por quiebre de stock</strong>.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleSimulateNewConflict}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simular Conflicto Concurrente (Venta POS vs Carrito Web)</span>
              </button>
              <button
                onClick={handleSimulateNetworkError}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              >
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Simular Caída Temporal de Conectividad (Error 503)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STOCK CONFLICT RESOLVER */}
      {subTab === 'conflicts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-500" />
                <span>Matriz de Detección y Resolución de Discrepancias de Stock</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identificación de diferencias entre el inventario físico en góndola/depósito y el stock visible en la web.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSimulateNewConflict}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                <span>Generar Conflicto de Prueba</span>
              </button>
            </div>
          </div>

          {/* Conflicts Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">SKU / Artículo</th>
                    <th className="p-3.5">Sucursal</th>
                    <th className="p-3.5 text-center">Físico ERP</th>
                    <th className="p-3.5 text-center">Publicado Web</th>
                    <th className="p-3.5 text-center">Reservado</th>
                    <th className="p-3.5 text-center">Discrepancia</th>
                    <th className="p-3.5">Causa & Diagnóstico</th>
                    <th className="p-3.5 text-right">Acción Correctiva 1-Clic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {conflicts.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        item.status === 'resolved' ? 'opacity-50 bg-slate-50/50 dark:bg-slate-900/20' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{item.productName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.sku}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          item.branch === 'roca' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60'
                        }`}>
                          {item.branch === 'roca' ? 'Gral. Roca' : 'Neuquén'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {item.erpPhysicalStock} un.
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {item.webPublishedStock} un.
                      </td>
                      <td className="p-3.5 text-center font-bold text-amber-600 font-mono">
                        {item.committedStock} un.
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          item.discrepancy < 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60' : item.discrepancy > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60'
                        }`}>
                          {item.discrepancy > 0 ? `+${item.discrepancy}` : item.discrepancy} un.
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">{item.conflictReason}</p>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{item.detectedAt}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        {item.status === 'resolved' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <Check className="w-3.5 h-3.5" />
                            Resuelto
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleResolveConflict(item, 'force_erp')}
                              className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs transition-all cursor-pointer"
                              title="Forzar al e-commerce a adoptar el stock físico del ERP"
                            >
                              Forzar ERP
                            </button>
                            <button
                              onClick={() => handleResolveConflict(item, 'audit_kardex')}
                              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] transition-all cursor-pointer"
                              title="Generar movimiento de ajuste automático en Kardex"
                            >
                              Ajustar Kardex
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONNECTION ERRORS & BACKOFF */}
      {subTab === 'errors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Registro de Diagnóstico y Errores de Conectividad</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitoreo de Timeouts HTTP, fallas de validación AFIP y reintentos automáticos con Exponential Backoff.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRetryAllPendingErrors}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reintentar Cola ({pendingErrorsCount})</span>
              </button>
              <button
                onClick={handleClearResolvedErrors}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Limpiar Resueltos</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {connectionErrors.map((err) => (
              <div
                key={err.id}
                className={`p-4 rounded-2xl border transition-all ${
                  err.status === 'auto_resolved'
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/50 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                      err.severity === 'fatal' ? 'bg-rose-600 text-white' : err.severity === 'error' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60'
                    }`}>
                      {err.errorCode}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{err.service}</span>
                    <span className="text-[10px] font-mono text-slate-400">{err.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {err.status === 'pending_retry' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        Reintento en {err.nextRetryInSec || 5}s (Intento {err.retryCount + 1}/{err.maxRetries})
                      </span>
                    )}
                    {err.status === 'auto_resolved' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Auto-Resuelto
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-sans">
                  {err.errorMessage}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  <span className="font-mono text-slate-400 truncate max-w-md">{err.endpoint}</span>
                  <div className="flex items-center gap-2">
                    {err.requestPayload && (
                      <button
                        onClick={() => setInspectedPayload({ title: `Payload de ${err.errorCode}`, json: { request: err.requestPayload, response: err.responsePayload } })}
                        className="text-orange-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Ver Payload JSON</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: REAL-TIME EVENT BUS STREAM */}
      {subTab === 'live_stream' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Event Bus & Live Webhook Stream</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Flujo continuo de transacciones, deltas de stock y pings de salud recibidos en tiempo real.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20">
                WebSockets CONECTADOS
              </span>
            </div>
          </div>

          {/* Console-like Event Stream */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2 shadow-2xl max-h-[500px] overflow-y-auto">
            {liveEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="text-[10px] text-slate-500 shrink-0">{evt.timestamp}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                    evt.direction === 'ERP -> WEB' ? 'bg-orange-500/20 text-orange-400' : evt.direction === 'WEB -> ERP' ? 'bg-sky-500/20 text-sky-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {evt.direction}
                  </span>
                  <span className="text-white font-sans text-xs">{evt.summary}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[10px] text-emerald-400 font-bold">{evt.latencyMs} ms</span>
                  <button
                    onClick={() => setInspectedPayload({ title: `Evento ${evt.id} (${evt.type})`, json: evt.payload })}
                    className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-md transition-colors"
                    title="Ver Payload"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SELF-HEALING DIAGNOSTIC PROBES */}
      {subTab === 'probes' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-500" />
              <span>Sondas de Auto-Diagnóstico & Test de Carga</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ejecute pruebas individuales de extremo a extremo para verificar la resiliencia de la arquitectura
              y certificar la continuidad operativa según normas ISO 9001.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Probe 1 */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prueba de Conexión Base de Datos ERP</h4>
                <p className="text-[11px] text-slate-500">Query test a tablas de stock físico Roca & Neuquén</p>
              </div>
              <button
                onClick={() => handleRunFullProbe('DB ERP Query Probe')}
                disabled={isTestingProbe !== null}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer"
              >
                {isTestingProbe === 'DB ERP Query Probe' ? 'Probando...' : 'Lanzar'}
              </button>
            </div>

            {/* Probe 2 */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prueba de Autenticación AFIP WSAA</h4>
                <p className="text-[11px] text-slate-500">Valida certificado fiscal digital X.509 y CMS</p>
              </div>
              <button
                onClick={() => handleRunFullProbe('AFIP WSAA Probe')}
                disabled={isTestingProbe !== null}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
              >
                {isTestingProbe === 'AFIP WSAA Probe' ? 'Probando...' : 'Lanzar'}
              </button>
            </div>

            {/* Probe 3 */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Simulación de Sobrecarga de Carritos Web</h4>
                <p className="text-[11px] text-slate-500">Prueba de estrés del buffer de bloqueo de stock (100 ops/sec)</p>
              </div>
              <button
                onClick={() => handleRunFullProbe('Stress Test Buffer')}
                disabled={isTestingProbe !== null}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
              >
                {isTestingProbe === 'Stress Test Buffer' ? 'Probando...' : 'Lanzar'}
              </button>
            </div>

            {/* Probe 4 */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Verificación de Cron Jobs Automáticos</h4>
                <p className="text-[11px] text-slate-500">Chequea los 4 temporizadores de sincronización de precios y stock</p>
              </div>
              <button
                onClick={() => handleRunFullProbe('Cron Jobs Health')}
                disabled={isTestingProbe !== null}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                {isTestingProbe === 'Cron Jobs Health' ? 'Probando...' : 'Lanzar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
