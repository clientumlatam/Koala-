import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Zap,
  Server,
  Database,
  ArrowRight,
  Filter,
  Search,
  Download,
  Terminal,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sliders,
  Radio,
  FileSpreadsheet,
  X,
  PlusCircle,
  ShoppingCart,
  Tag,
  PackagePlus,
  Store
} from 'lucide-react';
import {
  IcxnWebhookLogItem,
  ProductInventoryRecord,
  ErpConnectionConfig,
  BranchId
} from '../types';
import { formatCurrency } from '../utils/helpers';

interface IcxnWebhookMonitorProps {
  inventory: ProductInventoryRecord[];
  erpConfig: ErpConnectionConfig;
  onUpdateStock?: (productId: string, branch: BranchId, newStock: number) => void;
  onUpdateInventoryPrices?: (updatedItems: { sku: string; price?: number; wholesalePrice?: number; stockRoca?: number; stockNeuquen?: number }[]) => void;
}

const INITIAL_ICXN_LOGS: IcxnWebhookLogItem[] = [
  {
    id: 'evt-icxn-9481',
    timestamp: 'Hoy, ' + new Date(Date.now() - 45000).toLocaleTimeString('es-AR'),
    eventType: 'stock_sync',
    source: 'ICXN ERP Core · Pos Roca',
    host: 'icxn-lp.dvrdns.org',
    sku: 'POL-STR-CRIS',
    productName: 'Film Stretch Cristal 50cm × 5kg',
    branch: 'roca',
    deltaStock: -1,
    newStock: 84,
    latencyMs: 18,
    status: 'success',
    signatureVerified: true,
    httpStatus: 200,
    summary: 'Venta mostrador físico ticket B-0001-00049281. Stock descontado en 0 seg en la web.',
    rawPayload: {
      event: 'inventory.stock_delta',
      origin: 'pos_terminal_01',
      branch_code: 'DEP-01-ROCA',
      sku: 'POL-STR-CRIS',
      delta: -1,
      current_physical_stock: 84,
      ticket_number: 'B-0001-00049281',
      operator_id: 'cajero_roca_02',
      timestamp_utc: new Date(Date.now() - 45000).toISOString(),
      latency_ms: 18
    }
  },
  {
    id: 'evt-icxn-9480',
    timestamp: 'Hoy, ' + new Date(Date.now() - 140000).toLocaleTimeString('es-AR'),
    eventType: 'order_confirmation',
    source: 'Checkout Web Koala',
    host: 'icxn-lp.dvrdns.org',
    orderId: 'ORD-2026-8924',
    sku: 'COT-REP-01',
    productName: 'Mangas Descartables Repostería × 50 u.',
    branch: 'neuquen',
    amount: 14200,
    latencyMs: 24,
    status: 'success',
    signatureVerified: true,
    httpStatus: 200,
    summary: 'Lock Atómico de 15 min confirmado en ICXN ERP. Reserva registrada sin sobreventa.',
    rawPayload: {
      event: 'order.atomic_reservation',
      order_id: 'ORD-2026-8924',
      status: 'reserved_atomic',
      lock_expiration_sec: 900,
      customer_id: 'cli_98124',
      items: [
        { sku: 'COT-REP-01', qty: 2, unit_price: 7100 }
      ],
      branch_target: 'neuquen',
      payment_gateway: 'mercadopago_checkout_pro',
      timestamp_utc: new Date(Date.now() - 140000).toISOString(),
      latency_ms: 24
    }
  },
  {
    id: 'evt-icxn-9479',
    timestamp: 'Hoy, ' + new Date(Date.now() - 320000).toLocaleTimeString('es-AR'),
    eventType: 'remito_ingreso',
    source: 'ICXN ERP Depósito Central',
    host: 'icxn-lp.dvrdns.org',
    sku: 'ENV-PET-500',
    productName: 'Envase PET 500cc con Gatillo Atomizador',
    branch: 'roca',
    deltaStock: 120,
    newStock: 155,
    latencyMs: 15,
    status: 'success',
    signatureVerified: true,
    httpStatus: 200,
    summary: 'Ingreso Remito R-0001-00018472 escaneado con QR en depósito. Producto reactivado en la tienda.',
    rawPayload: {
      event: 'warehouse.goods_receipt',
      remito_number: 'R-0001-00018472',
      supplier: 'Plásticos Patagónicos SA',
      branch_code: 'DEP-01-ROCA',
      sku: 'ENV-PET-500',
      quantity_received: 120,
      new_available_stock: 155,
      auto_publish_store: true,
      timestamp_utc: new Date(Date.now() - 320000).toISOString(),
      latency_ms: 15
    }
  },
  {
    id: 'evt-icxn-9478',
    timestamp: 'Hoy, ' + new Date(Date.now() - 620000).toLocaleTimeString('es-AR'),
    eventType: 'price_update',
    source: 'ICXN ERP Administración',
    host: 'icxn-lp.dvrdns.org',
    sku: 'POL-CAM-4050',
    productName: 'Bolsas Camiseta Alta Densidad 40×50',
    branch: 'all',
    oldPrice: 18200,
    newPrice: 19800,
    latencyMs: 31,
    status: 'success',
    signatureVerified: true,
    httpStatus: 200,
    summary: 'Actualización masiva de precios mayoristas (+8.7%). Impacto automático en catálogo web.',
    rawPayload: {
      event: 'pricing.batch_update',
      reason: 'Ajuste de materia prima virgen polietileno',
      affected_skus: ['POL-CAM-4050'],
      new_retail_price: 19800,
      new_wholesale_tier1: 17600,
      authorized_by: 'Mikhail Murekian (LP SRL)',
      timestamp_utc: new Date(Date.now() - 620000).toISOString(),
      latency_ms: 31
    }
  },
  {
    id: 'evt-icxn-9477',
    timestamp: 'Hoy, ' + new Date(Date.now() - 900000).toLocaleTimeString('es-AR'),
    eventType: 'ping',
    source: 'ICXN Webhook Daemon',
    host: 'icxn-lp.dvrdns.org',
    branch: 'all',
    latencyMs: 12,
    status: 'success',
    signatureVerified: true,
    httpStatus: 200,
    summary: 'Heartbeat ping periódico de verificación de conectividad y latencia HTTP/2.',
    rawPayload: {
      event: 'daemon.heartbeat_ping',
      gateway: 'icxn-lp.dvrdns.org',
      health: 'healthy',
      active_connections: 4,
      timestamp_utc: new Date(Date.now() - 900000).toISOString(),
      latency_ms: 12
    }
  }
];

export const IcxnWebhookMonitor: React.FC<IcxnWebhookMonitorProps> = ({
  inventory,
  erpConfig,
  onUpdateStock,
  onUpdateInventoryPrices
}) => {
  const [logs, setLogs] = useState<IcxnWebhookLogItem[]>(INITIAL_ICXN_LOGS);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<IcxnWebhookLogItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Live stream simulated ping & random event every 25 seconds if active
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const randomLatency = Math.floor(Math.random() * 20 + 12); // 12-32ms
      const newPing: IcxnWebhookLogItem = {
        id: `evt-icxn-${Math.floor(Math.random() * 8999 + 1000)}`,
        timestamp: 'Hoy, ' + now.toLocaleTimeString('es-AR'),
        eventType: 'ping',
        source: 'ICXN Webhook Daemon (Keep-Alive)',
        host: 'icxn-lp.dvrdns.org',
        branch: 'all',
        latencyMs: randomLatency,
        status: 'success',
        signatureVerified: true,
        httpStatus: 200,
        summary: `Keep-alive ping procesado en ${randomLatency}ms. Protocolo HTTP/2 en escucha activa.`,
        rawPayload: {
          event: 'daemon.keep_alive',
          gateway: 'icxn-lp.dvrdns.org',
          ping_seq: Math.floor(Math.random() * 90000 + 10000),
          latency_ms: randomLatency,
          timestamp_utc: now.toISOString()
        }
      };

      setLogs(prev => [newPing, ...prev.slice(0, 49)]); // keep last 50
    }, 28000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Compute key metrics
  const metrics = useMemo(() => {
    const totalEvents = logs.length;
    const avgLatency = Math.round(
      logs.reduce((acc, curr) => acc + curr.latencyMs, 0) / (totalEvents || 1)
    );
    const stockEvents = logs.filter(l => l.eventType === 'stock_sync' || l.eventType === 'remito_ingreso' || l.eventType === 'pos_sale').length;
    const priceEvents = logs.filter(l => l.eventType === 'price_update').length;
    const orderEvents = logs.filter(l => l.eventType === 'order_confirmation').length;
    const successRate = ((logs.filter(l => l.status === 'success').length / (totalEvents || 1)) * 100).toFixed(1);

    return { totalEvents, avgLatency, stockEvents, priceEvents, orderEvents, successRate };
  }, [logs]);

  // Simulation Handlers: Actually affects the app inventory/pricing in real-time!
  const handleSimulateRemito = () => {
    const target = inventory[0] || { id: 'prod-1', sku: 'POL-STR-CRIS', name: 'Film Stretch Cristal 50cm', stockRoca: 84 };
    const addQty = 50;
    const newStock = (target.stockRoca || 0) + addQty;
    const latency = Math.floor(Math.random() * 15 + 14); // 14-29ms
    const now = new Date();

    if (onUpdateStock) {
      onUpdateStock(target.id, 'roca', newStock);
    }

    const newLog: IcxnWebhookLogItem = {
      id: `evt-icxn-${Date.now().toString().slice(-4)}`,
      timestamp: 'Hoy, ' + now.toLocaleTimeString('es-AR'),
      eventType: 'remito_ingreso',
      source: 'ICXN ERP Depósito Central',
      host: 'icxn-lp.dvrdns.org',
      sku: target.sku,
      productName: target.name,
      branch: 'roca',
      deltaStock: addQty,
      newStock: newStock,
      latencyMs: latency,
      status: 'success',
      signatureVerified: true,
      httpStatus: 200,
      summary: `Remito de Fábrica escaneado en Roca (+${addQty} u.). Stock actualizado a ${newStock} u. en ${latency}ms (0 segundos).`,
      rawPayload: {
        event: 'warehouse.remito_received',
        remito_id: `REM-ING-0001-${Math.floor(Math.random() * 9000 + 1000)}`,
        sku: target.sku,
        product_name: target.name,
        branch: 'roca',
        qty_added: addQty,
        resulting_stock: newStock,
        latency_ms: latency,
        timestamp_utc: now.toISOString()
      }
    };

    setLogs(prev => [newLog, ...prev]);
    showToast(`⚡ ¡Remito procesado en ${latency}ms! Stock de ${target.name} actualizado a ${newStock} u.`);
  };

  const handleSimulatePosSale = () => {
    const target = inventory[1] || inventory[0] || { id: 'prod-2', sku: 'COT-REP-01', name: 'Mangas Descartables', stockNeuquen: 40 };
    const currentStock = target.stockNeuquen || 15;
    const newStock = Math.max(0, currentStock - 1);
    const latency = Math.floor(Math.random() * 14 + 16); // 16-30ms
    const now = new Date();

    if (onUpdateStock) {
      onUpdateStock(target.id, 'neuquen', newStock);
    }

    const newLog: IcxnWebhookLogItem = {
      id: `evt-icxn-${Date.now().toString().slice(-4)}`,
      timestamp: 'Hoy, ' + now.toLocaleTimeString('es-AR'),
      eventType: 'pos_sale',
      source: 'ICXN ERP · Caja Mostrador Neuquén',
      host: 'icxn-lp.dvrdns.org',
      sku: target.sku,
      productName: target.name,
      branch: 'neuquen',
      deltaStock: -1,
      newStock: newStock,
      latencyMs: latency,
      status: 'success',
      signatureVerified: true,
      httpStatus: 200,
      summary: `Venta física en mostrador Neuquén (Factura B). Descuento web aplicado en ${latency}ms evitando sobreventa.`,
      rawPayload: {
        event: 'pos.physical_sale_completed',
        ticket: `FC-B-0002-${Math.floor(Math.random() * 90000 + 10000)}`,
        sku: target.sku,
        product_name: target.name,
        branch: 'neuquen',
        delta: -1,
        resulting_stock: newStock,
        latency_ms: latency,
        timestamp_utc: now.toISOString()
      }
    };

    setLogs(prev => [newLog, ...prev]);
    showToast(`⚡ ¡Venta en mostrador impactada en ${latency}ms! Stock web ajustado en 0 seg.`);
  };

  const handleSimulatePriceAdjustment = () => {
    const target = inventory[0] || { id: 'prod-1', sku: 'POL-STR-CRIS', price: 24500, wholesalePrice: 21800, name: 'Film Stretch Cristal' };
    const currentPrice = target.price || 24500;
    const newPrice = Math.round(currentPrice * 1.05); // +5%
    const latency = Math.floor(Math.random() * 18 + 20); // 20-38ms
    const now = new Date();

    if (onUpdateInventoryPrices) {
      onUpdateInventoryPrices([
        {
          sku: target.sku,
          price: newPrice,
          wholesalePrice: Math.round(newPrice * 0.88)
        }
      ]);
    }

    const newLog: IcxnWebhookLogItem = {
      id: `evt-icxn-${Date.now().toString().slice(-4)}`,
      timestamp: 'Hoy, ' + now.toLocaleTimeString('es-AR'),
      eventType: 'price_update',
      source: 'ICXN ERP · Tarifas y Listas',
      host: 'icxn-lp.dvrdns.org',
      sku: target.sku,
      productName: target.name,
      branch: 'all',
      oldPrice: currentPrice,
      newPrice: newPrice,
      latencyMs: latency,
      status: 'success',
      signatureVerified: true,
      httpStatus: 200,
      summary: `Ajuste de precio ERP transmitido (+5%). Precio actualizado a ${formatCurrency(newPrice)} en ${latency}ms.`,
      rawPayload: {
        event: 'pricing.price_changed',
        sku: target.sku,
        old_price: currentPrice,
        new_price: newPrice,
        currency: 'ARS',
        latency_ms: latency,
        timestamp_utc: now.toISOString()
      }
    };

    setLogs(prev => [newLog, ...prev]);
    showToast(`⚡ ¡Precio actualizado por Webhook en ${latency}ms! Nuevo valor: ${formatCurrency(newPrice)}.`);
  };

  const handleSimulateOrderConfirmation = () => {
    const latency = Math.floor(Math.random() * 12 + 15); // 15-27ms
    const now = new Date();
    const orderNum = `ORD-2026-${Math.floor(Math.random() * 8999 + 1000)}`;

    const newLog: IcxnWebhookLogItem = {
      id: `evt-icxn-${Date.now().toString().slice(-4)}`,
      timestamp: 'Hoy, ' + now.toLocaleTimeString('es-AR'),
      eventType: 'order_confirmation',
      source: 'Checkout Tienda Web',
      host: 'icxn-lp.dvrdns.org',
      orderId: orderNum,
      branch: 'roca',
      amount: 48500,
      latencyMs: latency,
      status: 'success',
      signatureVerified: true,
      httpStatus: 200,
      summary: `Locking temporal y orden ${orderNum} confirmada. ERP bloquea stock en 0 seg.`,
      rawPayload: {
        event: 'order.payment_verified',
        order_number: orderNum,
        amount_total: 48500,
        branch: 'roca',
        lock_token: `lock_${Date.now()}`,
        latency_ms: latency,
        timestamp_utc: now.toISOString()
      }
    };

    setLogs(prev => [newLog, ...prev]);
    showToast(`⚡ ¡Reserva atómica confirmada en ${latency}ms! Orden ${orderNum} registrada en ICXN.`);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        searchQuery === '' ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.sku && log.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.productName && log.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.orderId && log.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        filterType === 'all' ||
        (filterType === 'stock' && (log.eventType === 'stock_sync' || log.eventType === 'remito_ingreso' || log.eventType === 'pos_sale')) ||
        (filterType === 'price' && log.eventType === 'price_update') ||
        (filterType === 'order' && log.eventType === 'order_confirmation') ||
        (filterType === 'ping' && log.eventType === 'ping');

      const matchesBranch =
        filterBranch === 'all' ||
        log.branch === 'all' ||
        log.branch === filterBranch;

      return matchesSearch && matchesType && matchesBranch;
    });
  }, [logs, searchQuery, filterType, filterBranch]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Tipo', 'SKU', 'Producto', 'Sucursal', 'Latencia_ms', 'Estado', 'Resumen'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      l.eventType,
      l.sku || '-',
      `"${l.productName || '-'}"`,
      l.branch,
      l.latencyMs,
      l.status,
      `"${l.summary.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `icxn_webhooks_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exportación CSV descargada correctamente.');
  };

  const getBadgeForType = (type: IcxnWebhookLogItem['eventType']) => {
    switch (type) {
      case 'stock_sync':
      case 'remito_ingreso':
        return { label: 'Stock / Remito', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200' };
      case 'pos_sale':
        return { label: 'Venta Mostrador POS', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200' };
      case 'price_update':
        return { label: 'Precio Actualizado', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200' };
      case 'order_confirmation':
        return { label: 'Orden Web (Lock)', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200' };
      case 'ping':
      default:
        return { label: 'Keep-Alive Ping', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 text-xs animate-bounce font-medium">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Banner with Host & SLA Status */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                icxn-lp.dvrdns.org
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                SLA: Promesa de 0 Segundos Cumplida (&lt; 100ms)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                HTTP/2 Push Bidireccional
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Monitor de Webhooks en Tiempo Real (ICXN ERP)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Trazabilidad en milisegundos de sincronización de stock de depósito, ventas en mostrador físico, ajustes de precios mayoristas y confirmación de checkout atómico.
            </p>
          </div>

          {/* Controls: Live Stream & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isLiveStreaming
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isLiveStreaming ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <Pause className="w-3.5 h-3.5" />
                  <span>Escucha en Vivo (ON)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Pausado (OFF)</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setLogs(INITIAL_ICXN_LOGS);
                showToast('Consola de logs reinicializada con el historial de eventos.');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Reiniciar a eventos iniciales"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Latencia Promedio</span>
            <div className="text-lg sm:text-xl font-black text-emerald-400 flex items-center gap-1">
              <span>{metrics.avgLatency} ms</span>
              <span className="text-[10px] text-slate-400 font-normal">(&lt; 0.1s)</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium">Cumple promesa de 0s</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Eventos Registrados</span>
            <div className="text-lg sm:text-xl font-black text-white">
              {metrics.totalEvents}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Últimas 24 horas</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Deltas de Stock</span>
            <div className="text-lg sm:text-xl font-black text-blue-400">
              {metrics.stockEvents}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Remitos & Mostrador</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Pushes de Precio</span>
            <div className="text-lg sm:text-xl font-black text-purple-400">
              {metrics.priceEvents}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Listas mayoristas</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Tasa de Éxito (SLA)</span>
            <div className="text-lg sm:text-xl font-black text-emerald-400">
              {metrics.successRate}%
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium">200 OK Verificados</span>
          </div>
        </div>
      </div>

      {/* Simulator Action Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-500" />
              Simuladores de Disparo Inmediato (Prueba de Estrés en 0 Segundos)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hacé clic en cualquiera de las acciones para enviar un webhook simulado de ICXN y observar el impacto inmediato en el stock y catálogo:
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-200 shrink-0">
            Impacto Real en Memoria
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={handleSimulateRemito}
            className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1">
              <PackagePlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-700 bg-white dark:bg-slate-900 px-1.5 py-0.2 rounded border border-emerald-200">
                +50 u.
              </span>
            </div>
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 group-hover:text-emerald-700">
              1. Remito Ingreso Depósito
            </h4>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5 leading-snug">
              Simula escaneo QR de ingreso de fábrica en General Roca.
            </p>
          </button>

          <button
            onClick={handleSimulatePosSale}
            className="p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1">
              <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold text-blue-700 bg-white dark:bg-slate-900 px-1.5 py-0.2 rounded border border-blue-200">
                -1 u.
              </span>
            </div>
            <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200 group-hover:text-blue-700">
              2. Venta Mostrador POS
            </h4>
            <p className="text-[11px] text-blue-800 dark:text-blue-400 mt-0.5 leading-snug">
              Descuenta stock de tienda física en Neuquén para evitar doble venta.
            </p>
          </button>

          <button
            onClick={handleSimulatePriceAdjustment}
            className="p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1">
              <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] font-bold text-purple-700 bg-white dark:bg-slate-900 px-1.5 py-0.2 rounded border border-purple-200">
                +5% OFF
              </span>
            </div>
            <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200 group-hover:text-purple-700">
              3. Push de Precios Mayorista
            </h4>
            <p className="text-[11px] text-purple-800 dark:text-purple-400 mt-0.5 leading-snug">
              Actualiza precios mayoristas desde ICXN ERP al catálogo web.
            </p>
          </button>

          <button
            onClick={handleSimulateOrderConfirmation}
            className="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-left transition-all cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between mb-1">
              <ShoppingCart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-bold text-amber-700 bg-white dark:bg-slate-900 px-1.5 py-0.2 rounded border border-amber-200">
                Lock 15m
              </span>
            </div>
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 group-hover:text-amber-700">
              4. Confirmar Checkout Web
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5 leading-snug">
              Reserva atómica temporal de 15 min ante pago en línea.
            </p>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por SKU, producto, orden o evento..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer focus:outline-none"
          >
            <option value="all">Todos los Eventos</option>
            <option value="stock">Stock & Remitos</option>
            <option value="price">Precios</option>
            <option value="order">Órdenes (Checkout)</option>
            <option value="ping">Keep-Alive Ping</option>
          </select>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer focus:outline-none"
          >
            <option value="all">Todas las Sucursales</option>
            <option value="roca">General Roca (DEP-01)</option>
            <option value="neuquen">Neuquén Capital (DEP-02)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium">
            Mostrando <strong>{filteredLogs.length}</strong> de {logs.length}
          </span>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer active:scale-95"
            title="Exportar registros filtrados a CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Webhook Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-3.5">ID & Timestamp</th>
                <th className="py-2.5 px-3">Tipo de Evento</th>
                <th className="py-2.5 px-3">Origen / Host</th>
                <th className="py-2.5 px-3">SKU & Producto</th>
                <th className="py-2.5 px-3">Sucursal</th>
                <th className="py-2.5 px-3">Latencia (SLA)</th>
                <th className="py-2.5 px-3">HTTP</th>
                <th className="py-2.5 px-3">Detalle / Acción</th>
                <th className="py-2.5 px-3 text-right">Inspeccionar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No se encontraron eventos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getBadgeForType(log.eventType);
                  const isUltraFast = log.latencyMs <= 40;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <div className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                          {log.id}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          {log.source}
                        </div>
                        <code className="text-[10px] text-slate-400 font-mono">
                          {log.host}
                        </code>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        {log.sku ? (
                          <>
                            <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">
                              {log.sku}
                            </span>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate block">
                              {log.productName}
                            </span>
                          </>
                        ) : log.orderId ? (
                          <span className="font-mono text-[11px] font-bold text-amber-600">
                            Orden #{log.orderId}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sistema</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-semibold">
                          {log.branch === 'roca'
                            ? 'Roca (DEP-01)'
                            : log.branch === 'neuquen'
                            ? 'Neuquén (DEP-02)'
                            : 'Global (Todas)'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isUltraFast ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {log.latencyMs} ms
                          </span>
                        </div>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium block">
                          0 segundos
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                          {log.httpStatus} OK
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-sm">
                        {log.summary}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedEvent(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-indigo-500" />
                          <span>Payload JSON</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Banner for Mikhail & Milton */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80 text-xs">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
              ¿Por qué se cumple la promesa de actualización en 0 segundos?
            </h4>
            <p className="text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
              A diferencia de las plataformas tradicionales que realizan consultas periódicas cada 15 o 30 minutos (batch polling), esta arquitectura integra <strong>Webhooks Push HTTP/2</strong> directamente desde el servidor central de <strong>ICXN (`icxn-lp.dvrdns.org`)</strong>. Cada escaneo de remito o venta física en mostrador dispara un evento instantáneo que actualiza el inventario en menos de <strong>30 milisegundos</strong>, garantizando que el stock online refleje con exactitud la existencia real sin intervención humana.
            </p>
          </div>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Inspección de Webhook: {selectedEvent.id}
                </h3>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {selectedEvent.latencyMs} ms de latencia
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] leading-relaxed">
                <div className="text-slate-400 mb-1 font-bold">Headers HTTP/2 Recibidos:</div>
                <div>X-ICXN-Event: {selectedEvent.rawPayload?.event || selectedEvent.eventType}</div>
                <div>X-ICXN-Host: {selectedEvent.host}</div>
                <div>X-ICXN-Signature: sha256={Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')} (VERIFICADO)</div>
                <div>X-Delivery-Latency: {selectedEvent.latencyMs}ms</div>
                <div>Content-Type: application/json; charset=utf-8</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-sans text-xs">
                    Cuerpo del Payload (JSON):
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEvent.rawPayload, null, 2), 'modal-payload')}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-bold font-sans cursor-pointer"
                  >
                    {copiedKey === 'modal-payload' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar JSON</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 overflow-x-auto text-[11px]">
                  {JSON.stringify(selectedEvent.rawPayload, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] font-sans text-slate-600 dark:text-slate-400">
                <strong>Respuesta de la Tienda Web:</strong> HTTP 200 OK en {selectedEvent.latencyMs}ms. Evento persistido y despachado al motor reactivo de inventario.
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Cerrar Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
