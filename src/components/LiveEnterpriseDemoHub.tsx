import React, { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  Share2,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Send,
  Download,
  Users,
  Briefcase,
  MapPin,
  Flame,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  BarChart3,
  Layers,
  Truck,
  Receipt,
  Package,
  DollarSign,
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  Target
} from 'lucide-react';
import { Product, QuoteRecord, EmployeeUser, ErpConnectionConfig, ProductInventoryRecord } from '../types';
import { formatCurrency } from '../utils/helpers';

interface LiveEnterpriseDemoHubProps {
  inventory: (Product | ProductInventoryRecord)[];
  quotes: QuoteRecord[];
  currentUser: EmployeeUser;
  erpConfig: ErpConnectionConfig;
  onUpdateStock?: (productId: string, stockRoca: number, stockNeuquen: number) => void;
  onNavigateToStore?: () => void;
}

interface TransactionStep {
  id: number;
  department: string;
  role: string;
  icon: any;
  actionTitle: string;
  actionDetail: string;
  slaTarget: string;
  slaActual: string;
  status: 'idle' | 'running' | 'completed';
  outputData: any;
  systemImpact: string;
}

export const LiveEnterpriseDemoHub: React.FC<LiveEnterpriseDemoHubProps> = ({
  inventory,
  quotes,
  currentUser,
  erpConfig,
  onUpdateStock,
  onNavigateToStore,
}) => {
  const [activeSection, setActiveSection] = useState<
    'flow_simulator' | 'crm_pipeline' | 'neuquen_expansion' | 'omnichannel_marketing' | 'iso_sla'
  >('flow_simulator');

  // Interactive Live Transaction Simulation State
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    inventory[0] || {
      id: 'prod-demo',
      name: 'Resma Autor A4 75g (Caja x5 u.)',
      sku: 'PAP-AUT-A4',
      category: 'Papelería Comercial',
      price: 28900,
      wholesalePrice: 24500,
      stockRoca: 140,
      stockNeuquen: 18,
      minStock: 25,
      unit: 'caja',
      description: 'Papel alcalino reprográfico de alto desempeño para oficinas y empresas.',
      barcode: '7791234567890',
      brand: 'Autor Ledesma',
      origin: 'Nacional',
      ivaRate: 21,
    }
  );

  const [transactionQty, setTransactionQty] = useState(10);
  const [customerName, setCustomerName] = useState('PetroServices Neuquén S.A.');
  const [customerCuit, setCustomerCuit] = useState('30-71829341-4');
  const [destinationBranch, setDestinationBranch] = useState<'neuquen' | 'roca'>('neuquen');
  const [generatedInvoiceCae, setGeneratedInvoiceCae] = useState<string>('');
  const [generatedDispatchId, setGeneratedDispatchId] = useState<string>('');

  // Transaction steps definition
  const initialSteps: TransactionStep[] = [
    {
      id: 1,
      department: 'Ventas & CRM Omnicanal',
      role: 'Ejecutivo Comercial / WhatsApp Business',
      icon: MessageCircle,
      actionTitle: 'Ingreso & Validación del Pedido',
      actionDetail: `Cliente corporativo "${customerName}" solicita ${transactionQty}x ${selectedProduct.name} para Sucursal Neuquén.`,
      slaTarget: '< 5 min',
      slaActual: '0.8 min',
      status: 'idle',
      outputData: { canal: 'WhatsApp API + Web B2B', total: selectedProduct.wholesalePrice * transactionQty },
      systemImpact: 'Creación de Orden de Pedido #ORD-2026-NQN y verificación de cuenta corriente autorizada.',
    },
    {
      id: 2,
      department: 'Depósito & Control de Stock',
      role: 'Jefe de Logística / Kardex WMS',
      icon: Package,
      actionTitle: 'Reserva Inmediata & Bloqueo de Unidades',
      actionDetail: `Bloqueo de ${transactionQty} unidades en inventario. Stock NQN: ${selectedProduct.stockNeuquen} -> ${Math.max(0, selectedProduct.stockNeuquen - transactionQty)}.`,
      slaTarget: '< 15 min',
      slaActual: '1.2 min',
      status: 'idle',
      outputData: { pickingList: 'Lote #LOT-2026-08', pasillo: 'Sector C-04', stockRestante: selectedProduct.stockNeuquen - transactionQty },
      systemImpact: 'Actualización en tiempo real en web pública y sincronización de Kardex para auditoría.',
    },
    {
      id: 3,
      department: 'Facturación Electrónica AFIP',
      role: 'Sistema Fiscal Automático',
      icon: Receipt,
      actionTitle: 'Emisión de Factura A con CAE Autorizado',
      actionDetail: `Generación de Factura A para CUIT ${customerCuit} con cálculo automático de IVA 21% y percepciones IIBB Río Negro/Neuquén.`,
      slaTarget: '< 2 min',
      slaActual: '0.4 min',
      status: 'idle',
      outputData: { tipo: 'Factura A', cae: '74829103847291', caeDueDate: '07/09/2026', total: selectedProduct.wholesalePrice * transactionQty * 1.21 },
      systemImpact: 'Registro en Libro IVA Ventas y notificación instantánea del PDF fiscal al cliente.',
    },
    {
      id: 4,
      department: 'Logística & Despacho SLA',
      role: 'Coordinador de Flota Inter-Valle',
      icon: Truck,
      actionTitle: 'Ruta de Entrega & Remito Electrónico',
      actionDetail: 'Generación de Remito R oficial y asignación de móvil utilitario para entrega prioritaria en Parque Industrial Neuquén.',
      slaTarget: '< 2 horas',
      slaActual: '45 min',
      status: 'idle',
      outputData: { remito: 'REM-0004-0002819', chofer: 'Carlos Benítez', furgon: 'Renault Kangoo AA-934-KL' },
      systemImpact: 'Tracking GPS activado con notificación por WhatsApp de hora estimada de arribo (ETA).',
    },
    {
      id: 5,
      department: 'Finanzas & Tesorería',
      role: 'Conciliación Automática ERP',
      icon: DollarSign,
      actionTitle: 'Asiento Contable & Conciliación de Cobro',
      actionDetail: 'Imputación en Cuenta Corriente B2B / Acreditación en Mercado Pago Checkout Pro y actualización de balances contables.',
      slaTarget: '< 1 min',
      slaActual: '0.2 min',
      status: 'idle',
      outputData: { asiento: '#AST-94821', cuenta: '1.1.03 Créditos por Ventas', saldoActualizado: '$1.420.000' },
      systemImpact: 'Cierre de ciclo transaccional con trazabilidad total bajo norma ISO 9001:2015.',
    },
  ];

  const [steps, setSteps] = useState<TransactionStep[]>(initialSteps);

  const handleStartSimulation = () => {
    setSimulationRunning(true);
    setSimulationStep(1);
    setGeneratedInvoiceCae(`74${Math.floor(100000000000 + Math.random() * 900000000000)}`);
    setGeneratedDispatchId(`DESP-NQN-${Math.floor(1000 + Math.random() * 9000)}`);

    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: s.id === 1 ? 'running' : 'idle' })));

    // Step 1
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: 'completed' } : s.id === 2 ? { ...s, status: 'running' } : s));
      setSimulationStep(2);
    }, 1200);

    // Step 2
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 2 ? { ...s, status: 'completed' } : s.id === 3 ? { ...s, status: 'running' } : s));
      setSimulationStep(3);
      if (onUpdateStock && selectedProduct) {
        onUpdateStock(
          selectedProduct.id,
          selectedProduct.stockRoca,
          Math.max(0, selectedProduct.stockNeuquen - transactionQty)
        );
      }
    }, 2400);

    // Step 3
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 3 ? { ...s, status: 'completed' } : s.id === 4 ? { ...s, status: 'running' } : s));
      setSimulationStep(4);
    }, 3600);

    // Step 4
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 4 ? { ...s, status: 'completed' } : s.id === 5 ? { ...s, status: 'running' } : s));
      setSimulationStep(5);
    }, 4800);

    // Step 5 (Done)
    setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 5 ? { ...s, status: 'completed' } : s));
      setSimulationRunning(false);
      setSimulationStep(6);
    }, 6000);
  };

  const handleResetSimulation = () => {
    setSimulationRunning(false);
    setSimulationStep(0);
    setSteps(initialSteps);
  };

  // Neuquén Acceleration Campaigns State
  const [nqnCampaigns, setNqnCampaigns] = useState([
    {
      id: 'cmp-1',
      title: 'Pack Oficina Vaca Muerta & PIN',
      target: 'Empresas de Servicios Petroleros & Oficinas Neuquén',
      discount: '18% OFF Mayorista',
      status: 'Activa',
      reach: '3.420 empresas',
      leads: 48,
      sales: '$1.840.000',
    },
    {
      id: 'cmp-2',
      title: 'Retiro Express 20 Minutos (Mitre 450)',
      target: 'Comercios Centro Neuquén & Profesionales',
      discount: 'Envío Bonificado',
      status: 'Activa',
      reach: '8.100 usuarios',
      leads: 92,
      sales: '$2.490.000',
    },
    {
      id: 'cmp-3',
      title: 'Insumos Escolares & Colegios Confluencia',
      target: 'Instituciones Educativas y Familias NQN',
      discount: 'Cuotas sin interés MP',
      status: 'Programada',
      reach: '12.000 familias',
      leads: 130,
      sales: '$3.150.000',
    },
  ]);

  // Social Publishing State
  const [copiedPost, setCopiedPost] = useState<string | null>(null);

  const handleCopyPost = (network: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPost(network);
      setTimeout(() => setCopiedPost(null), 2500);
    });
  };

  return (
    <div className="space-y-6" id="live-enterprise-demo-hub">
      {/* Top Hero Banner of the Demo */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
              <span>DEMO OPERATIVA EN VIVO • KOALA ERP & CRM HUB</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Normas ISO 9001 / 27001 Ready</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 font-bold text-xs">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>SLA Tiempos de Respuesta</span>
              </span>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-xl sm:text-3xl font-black font-fredoka tracking-tight text-white">
              Demostración Integral: Cómo Impacta una Transacción en Vivo en Todos los Departamentos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Prueba en tiempo real de automatización de procesos entre <strong>Ventas (CRM)</strong>,{' '}
              <strong>Depósito (Stock Multi-Sucursal)</strong>, <strong>Facturación AFIP (CAE)</strong>,{' '}
              <strong>Logística (SLA de Despacho)</strong> y <strong>Tesorería</strong> sin presentaciones estáticas.
            </p>
          </div>

          {/* Quick Sub-Navigation Pills for the 5 Pillars */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveSection('flow_simulator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'flow_simulator'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1. Simulador Transaccional (5 Departamentos)</span>
            </button>

            <button
              onClick={() => setActiveSection('crm_pipeline')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'crm_pipeline'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>2. Conexión CRM ↔ ERP (Clientes & B2B)</span>
            </button>

            <button
              onClick={() => setActiveSection('neuquen_expansion')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'neuquen_expansion'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>3. Plan Subir Ventas Neuquén (NQN Boost)</span>
            </button>

            <button
              onClick={() => setActiveSection('omnichannel_marketing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'omnichannel_marketing'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>4. Posicionamiento en Redes (Omnicanal)</span>
            </button>

            <button
              onClick={() => setActiveSection('iso_sla_audit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'iso_sla'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-102'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 text-purple-400" />
              <span>5. Auditoría ISO & Tiempos SLA</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE END-TO-END TRANSACTION SIMULATOR */}
      {activeSection === 'flow_simulator' && (
        <div className="space-y-6">
          {/* Controls Bar for the Simulation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Configurar y Ejecutar Transacción de Prueba en Tiempo Real
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Selecciona el producto, el cliente corporativo y presiona ejecutar para ver cómo viajan los datos entre áreas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSimulation}
                  disabled={simulationRunning}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>

                <button
                  onClick={handleStartSimulation}
                  disabled={simulationRunning}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-98 text-white text-xs font-black transition-all shadow-lg shadow-orange-600/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Zap className={`w-4 h-4 ${simulationRunning ? 'animate-bounce text-amber-200' : ''}`} />
                  <span>{simulationRunning ? 'Procesando en Vivo...' : 'EJECUTAR TRANSACCIÓN EN VIVO'}</span>
                </button>
              </div>
            </div>

            {/* Simulation Parameter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Artículo a Comercializar:
                </label>
                <select
                  disabled={simulationRunning}
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const p = inventory.find((item) => item.id === e.target.value);
                    if (p) setSelectedProduct(p);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {inventory.slice(0, 8).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock NQN: {p.stockNeuquen})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Cliente Corporativo (B2B):
                </label>
                <input
                  type="text"
                  disabled={simulationRunning}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Cantidad a Facturar:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    disabled={simulationRunning}
                    value={transactionQty}
                    onChange={(e) => setTransactionQty(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-center"
                  />
                  <span className="text-[11px] text-slate-500">
                    Total:{' '}
                    <strong className="text-orange-600 dark:text-orange-400">
                      {formatCurrency(selectedProduct.wholesalePrice * transactionQty)}
                    </strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Sucursal de Despacho:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={simulationRunning}
                    onClick={() => setDestinationBranch('neuquen')}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-all ${
                      destinationBranch === 'neuquen'
                        ? 'bg-orange-500 text-white border-orange-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Neuquén (NQN)
                  </button>
                  <button
                    type="button"
                    disabled={simulationRunning}
                    onClick={() => setDestinationBranch('roca')}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-all ${
                      destinationBranch === 'roca'
                        ? 'bg-orange-500 text-white border-orange-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Gral. Roca
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Department Pipeline Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                Matriz de Flujo Interdepartamental en Ejecución
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Paso actual:{' '}
                <strong className="text-orange-600 dark:text-orange-400">
                  {simulationStep === 0
                    ? 'Esperando inicio'
                    : simulationStep > 5
                    ? 'Transacción Finalizada (100% Completado)'
                    : `Paso ${simulationStep} de 5 en progreso`}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isRunning = step.status === 'running';
                const isCompleted = step.status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      isRunning
                        ? 'bg-orange-500/10 dark:bg-orange-950/30 border-orange-500 ring-2 ring-orange-400/40 shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            isRunning
                              ? 'bg-orange-600 text-white animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              Paso {step.id} • {step.department}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold">({step.role})</span>
                            {isRunning && (
                              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-extrabold animate-pulse">
                                PROCESANDO EN VIVO
                              </span>
                            )}
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> ACREDITADO & SINCRONIZADO
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {step.actionTitle}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {step.actionDetail}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            💡 Impacto en Sistema: {step.systemImpact}
                          </p>
                        </div>
                      </div>

                      {/* SLA and Metrics Column */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 text-right shrink-0">
                        <div className="text-[10px] text-slate-400">SLA Normativa ISO:</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Meta: <span className="font-mono text-indigo-500">{step.slaTarget}</span>
                        </div>
                        <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          Real: {isCompleted ? step.slaActual : isRunning ? '0.1 min' : '--'}
                        </div>
                      </div>
                    </div>

                    {/* Step Output Payload (Appears when completed) */}
                    {isCompleted && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono bg-emerald-100/40 dark:bg-emerald-950/40 p-2 rounded-xl">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                            📦 Payload Generado:
                          </span>
                          {step.id === 3 && (
                            <span className="bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100">
                              CAE AFIP: {generatedInvoiceCae || '74829103847291'} (Vto: 07/09/2026)
                            </span>
                          )}
                          {step.id === 4 && (
                            <span className="bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100">
                              Hoja de Ruta: {generatedDispatchId || 'DESP-NQN-8392'} (Asignado a Flota NQN)
                            </span>
                          )}
                          {step.id === 2 && (
                            <span className="bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-100">
                              Stock NQN Actualizado: {Math.max(0, selectedProduct.stockNeuquen - transactionQty)} u.
                            </span>
                          )}
                        </div>
                        <span className="text-emerald-700 dark:text-emerald-400 font-sans font-bold">
                          ✓ Auditoría ISO OK
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CRM & ERP CONNECTION PIPELINE */}
      {activeSection === 'crm_pipeline' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-500" />
                  Conexión en Tiempo Real: CRM Clientes ↔ ERP Central
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Trazabilidad de leads, cuentas corrientes, líneas de crédito autorizadas y conversión de consultas en órdenes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  Sincronización Bidireccional Activa
                </span>
              </div>
            </div>

            {/* B2B Clients Table with Real Credit Limits and Purchases */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="p-3 rounded-l-xl">Razón Social / Cliente</th>
                    <th className="p-3">CUIT & Condición</th>
                    <th className="p-3">Sucursal Asignada</th>
                    <th className="p-3">Línea de Crédito</th>
                    <th className="p-3">Saldo Cta. Cte.</th>
                    <th className="p-3">Estado CRM</th>
                    <th className="p-3 rounded-r-xl text-right">Acción ERP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    {
                      id: 'cli-1',
                      name: 'PetroServices Neuquén S.A.',
                      cuit: '30-71829341-4',
                      cond: 'Resp. Inscripto',
                      branch: 'Neuquén Capital',
                      creditLimit: 5000000,
                      balance: 1420000,
                      status: 'Cliente Activo VIP',
                      lastOrder: 'Hace 2 horas',
                    },
                    {
                      id: 'cli-2',
                      name: 'Constructora del Valle SRL',
                      cuit: '30-68924152-3',
                      cond: 'Resp. Inscripto',
                      branch: 'General Roca',
                      creditLimit: 3000000,
                      balance: 850000,
                      status: 'Cotización en Curso',
                      lastOrder: 'Ayer',
                    },
                    {
                      id: 'cli-3',
                      name: 'Colegio Bilingüe San Martín (NQN)',
                      cuit: '30-54918274-8',
                      cond: 'Exento',
                      branch: 'Neuquén Capital',
                      creditLimit: 2000000,
                      balance: 310000,
                      status: 'Pedido Confirmado',
                      lastOrder: 'Hace 3 días',
                    },
                    {
                      id: 'cli-4',
                      name: 'Distribuidora Gastronómica Patagónica',
                      cuit: '30-71029384-9',
                      cond: 'Resp. Inscripto',
                      branch: 'Neuquén Capital',
                      creditLimit: 4000000,
                      balance: 2150000,
                      status: 'Cliente Activo',
                      lastOrder: 'Hace 1 día',
                    },
                  ].map((cli) => (
                    <tr key={cli.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div>{cli.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Última compra: {cli.lastOrder}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{cli.cuit}</div>
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-sans font-semibold">{cli.cond}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-[10px]">
                          {cli.branch}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {formatCurrency(cli.creditLimit)}
                      </td>
                      <td className="p-3 font-mono font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(cli.balance)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">
                          {cli.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setCustomerName(cli.name);
                            setCustomerCuit(cli.cuit);
                            setActiveSection('flow_simulator');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] transition-all cursor-pointer"
                        >
                          Generar Pedido ERP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PLAN TO BOOST SALES IN NEUQUÉN */}
      {activeSection === 'neuquen_expansion' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-orange-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-fredoka text-white">
                    Estrategia de Expansión & Aceleración de Ventas en Neuquén (NQN Boost)
                  </h3>
                  <p className="text-xs text-orange-200">
                    Plan comercial y logístico para duplicar el volumen transaccional en Neuquén Capital y Vaca Muerta.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-black">
                  Meta Q3: +65% Facturación NQN
                </span>
              </div>
            </div>

            {/* Strategic Pillars for Neuquén */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-orange-500/20 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>1. Retiro Express en 20 Minutos</span>
                </div>
                <p className="text-xs text-slate-300">
                  Punto neurálgico en <strong>Mitre 450 (NQN)</strong> con stock de alta rotación pre-armado para profesionales y comercios.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  SLA Pick & Collect: 18 min promedio
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-orange-500/20 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>2. Corredor Parque Industrial & Añelo</span>
                </div>
                <p className="text-xs text-slate-300">
                  Despachos diarios programados a empresas petroleras, obradores y talleres de Parque Industrial Este/Oeste con flete consolidado.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  Frecuencia: 2 salidas diarias
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-orange-500/20 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <DollarSign className="w-4 h-4" />
                  <span>3. Listas Mayoristas y Cuenta Corriente</span>
                </div>
                <p className="text-xs text-slate-300">
                  Condiciones comerciales a 15/30 días con integración automática de Factura A AFIP y cobro por transferencia o Mercado Pago.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  Bonificación adicional: 15% por volumen
                </div>
              </div>
            </div>
          </div>

          {/* Active Neuquén Campaigns Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              Campañas de Captación Zonales en Ejecución (Neuquén)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nqnCampaigns.map((cmp) => (
                <div key={cmp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {cmp.status}
                    </span>
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">{cmp.discount}</span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">{cmp.title}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{cmp.target}</p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                    <div>
                      <div className="text-slate-400 text-[8px]">Alcance</div>
                      <div className="font-bold">{cmp.reach}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[8px]">Leads</div>
                      <div className="font-bold text-sky-600 dark:text-sky-400">{cmp.leads}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[8px]">Ventas</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{cmp.sales}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: OMNICHANNEL MARKETING & SOCIAL POSITIONING */}
      {activeSection === 'omnichannel_marketing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-500" />
                Generador y Publicador Omnicanal de Ofertas para Redes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crea publicaciones automáticas con precios actualizados, fotos y links directos a WhatsApp y Checkout Pro para Instagram, Facebook, Google y Estados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* WhatsApp Business Promo Card */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Business</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">Catálogo 1-Click</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] font-mono leading-relaxed border border-emerald-200 dark:border-emerald-800">
                  🔥 *¡SUPER PROMO KOALA LO TIENE!* 🐨<br/>
                  📄 {selectedProduct.name}<br/>
                  💰 *Precio Mayorista: {formatCurrency(selectedProduct.wholesalePrice)}*<br/>
                  📍 Retiro en *Mitre 450 (NQN)* y *Tucumán 284 (Roca)*.<br/>
                  💳 Hasta 3 cuotas sin interés con Mercado Pago.<br/>
                  👉 ¡Pedilo acá!
                </div>

                <button
                  onClick={() =>
                    handleCopyPost(
                      'whatsapp',
                      `🔥 ¡SUPER PROMO KOALA LO TIENE! 🐨\n📄 ${selectedProduct.name}\n💰 Precio Mayorista: ${formatCurrency(
                        selectedProduct.wholesalePrice
                      )}\n📍 Retiro en Mitre 450 (NQN) y Tucumán 284 (Roca).\n💳 Hasta 3 cuotas sin interés con Mercado Pago.`
                    )
                  }
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedPost === 'whatsapp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPost === 'whatsapp' ? '¡Copiado para WhatsApp!' : 'Copiar Texto para Difusión'}</span>
                </button>
              </div>

              {/* Instagram Shopping Post Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300 dark:border-purple-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram / Meta Ads</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white">Post & Reels</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] leading-relaxed border border-purple-200 dark:border-purple-800 font-sans">
                  🚀 Equipá tu oficina o comercio en Neuquén y Roca con <strong>{selectedProduct.name}</strong> al mejor precio mayorista. Factura A AFIP + Entrega en 24h. #KoalaLoTiene #Neuquen #GeneralRoca
                </div>

                <button
                  onClick={() =>
                    handleCopyPost(
                      'instagram',
                      `🚀 Equipá tu oficina o comercio en Neuquén y Roca con ${selectedProduct.name} al mejor precio mayorista. Factura A AFIP + Entrega en 24h. #KoalaLoTiene #Neuquen #GeneralRoca`
                    )
                  }
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedPost === 'instagram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPost === 'instagram' ? '¡Copiado para Instagram!' : 'Copiar Copy Instagram'}</span>
                </button>
              </div>

              {/* Google Business Profile Card */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-300 dark:border-blue-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <Globe className="w-4 h-4" />
                    <span>Google Perfil de Negocio</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">Maps & Search</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] leading-relaxed border border-blue-200 dark:border-blue-800">
                  📍 <strong>Novedad en Google Maps:</strong> Stock disponible en local Mitre 450 (Neuquén). Horarios de atención: Lunes a Sábados 9:00 a 20:30 hs.
                </div>

                <button
                  onClick={() =>
                    handleCopyPost(
                      'google',
                      `📍 Stock disponible en local Mitre 450 (Neuquén). Horarios de atención: Lunes a Sábados 9:00 a 20:30 hs. Consultas y reservas directas en koalalotiene.com.ar`
                    )
                  }
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedPost === 'google' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPost === 'google' ? '¡Copiado para Google!' : 'Copiar para Google Maps'}</span>
                </button>
              </div>

              {/* Facebook Marketplace & Tienda Card */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-300 dark:border-sky-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-xs">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook Marketplace</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-600 text-white">Comercio</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-[11px] leading-relaxed border border-sky-200 dark:border-sky-800">
                  📦 <strong>{selectedProduct.name}</strong> • Venta minorista y mayorista. Envíos a todo el Alto Valle (Roca, Cervantes, Cipolletti, Neuquén, Plottier).
                </div>

                <button
                  onClick={() =>
                    handleCopyPost(
                      'facebook',
                      `📦 ${selectedProduct.name} • Venta minorista y mayorista. Envíos a todo el Alto Valle (Roca, Cervantes, Cipolletti, Neuquén, Plottier). Facturación oficial.`
                    )
                  }
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedPost === 'facebook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPost === 'facebook' ? '¡Copiado para Facebook!' : 'Copiar Marketplace'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ISO 9001 / ISO 27001 AUDIT & RESPONSE TIME SLAS */}
      {activeSection === 'iso_sla' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Tablero de Cumplimiento de SLAs y Auditoría Normas ISO
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monitoreo de tiempos de respuesta por proceso operativo y bitácora inmutable de eventos.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                Certificación ISO 9001:2015 Cumplida (99.4%)
              </span>
            </div>

            {/* SLA Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  process: 'Tiempo de Respuesta en Cotización (CRM)',
                  target: '< 5 min',
                  current: '1.4 min',
                  compliance: '99.8%',
                  status: 'Excelente',
                },
                {
                  process: 'Bloqueo y Picking en Depósito',
                  target: '< 15 min',
                  current: '8.2 min',
                  compliance: '98.5%',
                  status: 'Excelente',
                },
                {
                  process: 'Emisión y Validación Fiscal AFIP (CAE)',
                  target: '< 2 min',
                  current: '0.3 min',
                  compliance: '100%',
                  status: 'Óptimo',
                },
                {
                  process: 'Despacho y Entrega a Sucursal NQN',
                  target: '< 2 horas',
                  current: '52 min',
                  compliance: '96.2%',
                  status: 'Excelente',
                },
              ].map((sla, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{sla.process}</div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-lg font-black font-mono text-purple-600 dark:text-purple-400">{sla.current}</span>
                    <span className="text-[10px] text-slate-400">Meta: {sla.target}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-[10px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Cumplimiento: {sla.compliance}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold">
                      {sla.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Log Trail */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registro de Eventos y Trazabilidad ISO (Kardex Inmutable)
              </h4>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[10px] space-y-1 max-h-36 overflow-y-auto">
                <div>[2026-08-28 20:25:01] [ISO-AUDIT] Usuario {currentUser.name} (Rol: {currentUser.role}) inició sesión en Sucursal {currentUser.branchId.toUpperCase()}.</div>
                <div>[2026-08-28 20:25:14] [CRM-SYNC] Lead PetroServices Neuquén S.A. sincronizado vía Webhook B2B.</div>
                <div>[2026-08-28 20:25:30] [STOCK-WMS] Bloqueo preventivo de 10 unidades SKU PAP-AUT-A4 en Sucursal Neuquén.</div>
                <div>[2026-08-28 20:25:31] [AFIP-WS] Solicitud de CAE Factura A aprobada por WebService WSFEv1. CAE: 74829103847291.</div>
                <div>[2026-08-28 20:25:45] [DISPATCH] Hoja de ruta REM-0004-0002819 asignada a móvil de entrega. SLA Cumplido.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
