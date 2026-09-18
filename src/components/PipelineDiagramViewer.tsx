import React, { useState } from 'react';
import { 
  Share2, 
  ShoppingCart, 
  Database, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  Users, 
  Layers, 
  Send, 
  Mail, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Filter, 
  MessageSquare,
  Sparkles,
  BarChart3,
  Repeat
} from 'lucide-react';

export const PipelineDiagramViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'matrix' | 'automation' | 'winback'>('architecture');
  const [activePillar, setActivePillar] = useState<'social' | 'ecommerce' | 'erp' | null>('social');

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Ecosistema Integrado
              </span>
              <span className="text-xs text-slate-400">Clientum × Koala Lo Tiene</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              Pipeline Omnicanal Unificado
            </h3>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            ⛓️ Los 3 Pilares
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'matrix'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            🔄 Matriz de Datos
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'automation'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            🔁 Ciclo de Marketing (7)
          </button>
          <button
            onClick={() => setActiveTab('winback')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'winback'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            ⚡ Flujo Reactivación
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* TAB 1: ARCHITECTURE (THE 3 PILLARS) */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-600 leading-relaxed">
              El concepto de un pipeline unificado que conecte <strong>redes sociales</strong>, <strong>comercio electrónico</strong> y un <strong>sistema ERP</strong> representa la sincronización definitiva del ciclo comercial moderno. Consiste en crear un flujo de datos automatizado donde cada interacción con un cliente se convierte en una venta y se procesa operativamente de inmediato.
            </p>

            {/* Interactive Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Connector 1 */}
              <div className="hidden md:flex absolute top-1/2 left-[31%] -translate-y-1/2 -translate-x-1/2 z-10 items-center justify-center">
                <div className="bg-white border-2 border-orange-400 rounded-full p-1.5 shadow-md flex items-center justify-center text-orange-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Connector 2 */}
              <div className="hidden md:flex absolute top-1/2 left-[67%] -translate-y-1/2 -translate-x-1/2 z-10 items-center justify-center">
                <div className="bg-white border-2 border-orange-400 rounded-full p-1.5 shadow-md flex items-center justify-center text-orange-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Pillar 1: Redes Sociales */}
              <div 
                onClick={() => setActivePillar('social')}
                className={`cursor-pointer rounded-xl p-4 sm:p-5 border-2 transition-all ${
                  activePillar === 'social'
                    ? 'border-pink-500 bg-pink-50/50 shadow-md ring-2 ring-pink-400/30'
                    : 'border-slate-200 bg-white hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 border border-pink-200">
                    Etapa 1: Captura
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  Redes Sociales
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">Atracción & Captura de Tráfico</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                    <span>Instagram (@koalalotiene) y Facebook</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                    <span>DMs automáticos y disparadores ManyChat</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                    <span>Shoppable Tags y enlaces de producto directo</span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-pink-700 font-semibold">
                  <span>Genera: Leads & Consultas</span>
                  <span className="text-slate-400">➔ Web</span>
                </div>
              </div>

              {/* Pillar 2: E-commerce */}
              <div 
                onClick={() => setActivePillar('ecommerce')}
                className={`cursor-pointer rounded-xl p-4 sm:p-5 border-2 transition-all ${
                  activePillar === 'ecommerce'
                    ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-400/30'
                    : 'border-slate-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 border border-orange-200">
                    Etapa 2: Conversión
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  E-commerce Koala
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">Conversión & Transacción en 3 Clics</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>Catálogo de polietileno, descartables y cotillón</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>Selector multi-sucursal: Roca vs Neuquén</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>Reserva atómica temporal de 15 minutos</span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-orange-700 font-semibold">
                  <span>Genera: Órdenes & Reservas</span>
                  <span className="text-slate-400">➔ ERP</span>
                </div>
              </div>

              {/* Pillar 3: Sistema ERP */}
              <div 
                onClick={() => setActivePillar('erp')}
                className={`cursor-pointer rounded-xl p-4 sm:p-5 border-2 transition-all ${
                  activePillar === 'erp'
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-400/30'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Etapa 3: Procesamiento
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  Sistema ERP Central
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">Operación, Logística & Finanzas</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Descuento en depósitos DEP-01 y DEP-02</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Facturación electrónica AFIP (Factura A/B)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Remito de despacho y conciliación bancaria</span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-700 font-semibold">
                  <span>Devuelve: Stock & Precios</span>
                  <span className="text-slate-400">➔ En vivo</span>
                </div>
              </div>
            </div>

            {/* Strategic Advantages Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200">
                <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>Segmentación Inteligente</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Usa el historial de compras del ERP para crear anuncios hiperespecíficos de recompra o cross-selling en Meta Ads.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200">
                <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold text-xs">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Logística en Segundos</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  El almacén recibe la orden de empaque segundos después del pago online, sin carga manual ni errores de tipeo.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200">
                <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Visibilidad Financiera</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ingresos sincronizados con la contabilidad y flujo de caja oficial de LP SRL con respaldo tributario AFIP.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATA INTEGRATION MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Matriz de Flujo de Datos e Integración entre Componentes
              </h4>
              <span className="text-[10px] text-slate-500">Sincronización Bidireccional</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-200 text-slate-800">
                    <th className="p-3">Conexión</th>
                    <th className="p-3">¿Qué datos se transmiten?</th>
                    <th className="p-3">Beneficio Clave para Koala</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-pink-700 flex items-center gap-1.5 whitespace-nowrap">
                      <Share2 className="w-3.5 h-3.5" /> Social Media ➔ E-commerce
                    </td>
                    <td className="p-3">
                      Enlaces de productos, etiquetas de compra (shoppable tags), catálogos sincronizados y píxeles de seguimiento UTM.
                    </td>
                    <td className="p-3 text-slate-900 font-medium">
                      <strong>Experiencia de compra fluida</strong>: El cliente compra el producto que vio en su feed con un solo clic.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-purple-700 flex items-center gap-1.5 whitespace-nowrap">
                      <MessageSquare className="w-3.5 h-3.5" /> Social Media ➔ ERP / CRM
                    </td>
                    <td className="p-3">
                      Mensajes directos, datos de contacto de leads calificados y registros de interacciones por WhatsApp/ManyChat.
                    </td>
                    <td className="p-3 text-slate-900 font-medium">
                      <strong>Historial centralizado</strong>: El equipo de ventas conoce todo el contexto y consultas previas antes de responder.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-orange-700 flex items-center gap-1.5 whitespace-nowrap">
                      <ShoppingCart className="w-3.5 h-3.5" /> E-commerce ➔ ERP
                    </td>
                    <td className="p-3">
                      Órdenes de compra confirmadas, pasarelas de pago (MercadoPago/Transferencia), perfiles de clientes y datos fiscales de CUIT.
                    </td>
                    <td className="p-3 text-slate-900 font-medium">
                      <strong>Automatización total</strong>: Se elimina el error humano de digitar pedidos a mano y se agiliza el despacho.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-indigo-700 flex items-center gap-1.5 whitespace-nowrap">
                      <Database className="w-3.5 h-3.5" /> ERP ➔ E-commerce y Redes
                    </td>
                    <td className="p-3">
                      Niveles de stock en tiempo real en Roca (DEP-01) y Neuquén (DEP-02), listas de precios mayoristas y estados de remitos.
                    </td>
                    <td className="p-3 text-slate-900 font-medium">
                      <strong>Adiós al sobrestock</strong>: Evita vender en la web o promocionar en redes productos que ya están agotados en mostrador.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MARKETING AUTOMATION WHEEL (7 STAGES) */}
        {activeTab === 'automation' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
              <h4 className="text-xs font-bold text-orange-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Ciclo de Marketing Automation para Koala Lo Tiene
              </h4>
              <p className="text-xs text-orange-800 mt-1 leading-relaxed">
                Estructura de 7 pasos continuos basada en automatización de marketing y nutrición de leads para convertir seguidores de redes en compradores recurrentes de repostería, descartables y polietileno:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <h5 className="text-xs font-bold text-slate-900">Build Targeted Lists</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Construir listas segmentadas de clientes: reposteros locales, gastronómicos, organizadores de eventos y clientes mayoristas de polietileno.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <h5 className="text-xs font-bold text-slate-900">Execute Campaign</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ejecutar campañas coordinadas por correo transaccional, automatizaciones de Instagram ManyChat y alertas por WhatsApp API.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  <h5 className="text-xs font-bold text-slate-900">Measure Behaviour</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Monitorear comportamiento: clics en enlaces, carritos iniciados, consultas de listas de precios y descargas de catálogos.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">4</span>
                  <h5 className="text-xs font-bold text-slate-900">Segment & Score Leads</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Calificar prospectos con puntajes automáticos (Lead Scoring): mayor puntuación para pedidos mayoristas o consultas de stock crítico.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">5</span>
                  <h5 className="text-xs font-bold text-slate-900">Route to CRM / ERP</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Enrutar leads de alta intención directo a los vendedores de General Roca o Neuquén con el carrito prearmado para cierre inmediato.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">6</span>
                  <h5 className="text-xs font-bold text-slate-900">Nurture Cycle</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nutrir prospectos indecisos con contenido de temporada (pascuas, primavera, fiestas de fin de año, promociones por bulto cerrado).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">7</span>
                <div>
                  <h5 className="text-xs font-bold text-white">Analyse Sales Performance</h5>
                  <p className="text-[11px] text-slate-300">Medición de retorno publicitario y facturación consolidada en el ERP</p>
                </div>
              </div>
              <Repeat className="w-4 h-4 text-orange-400 shrink-0" />
            </div>
          </div>
        )}

        {/* TAB 4: WIN-BACK & REACTIVATION FLOW */}
        {activeTab === 'winback' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900">
                Flujo Condicional de Lead Nurturing & Campaña de Reconquista (Win-Back)
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Automatización desatendida inspirada en el flujo estructurado de conversión y reactivación:
              </p>
            </div>

            {/* Step-by-step flowchart */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                  1
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Captura de Contacto</div>
                  <div className="text-xs font-bold text-slate-900">El cliente ingresa por formulario web o mensaje directo de Instagram</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Asignación automática de etiqueta inicial (ej: #reposteria-roca o #polietileno-mayorista).</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                  2
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-orange-600 uppercase">Disparo Inmediato</div>
                  <div className="text-xs font-bold text-slate-900">Envío instantáneo de Catálogo + Link de Tienda Online</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Mensaje enriquecido con fotos de artículos destacados y precios vigentes.</div>
                </div>
              </div>

              {/* Step 3: Conditional Split */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                  3
                </div>
                <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50">
                  <div className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Espera de 48 Horas & Evaluación de Interacción
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">¿Hizo clic en el enlace del producto?</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-purple-200">
                    <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800">
                        SÍ HIZO CLIC
                      </span>
                      <p className="text-[11px] text-slate-700 mt-1 font-medium">
                        Etiquetar como <code className="text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">#alta-intencion</code> y enviar cupón de bonificación de envío en sucursal para cerrar la compra.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                        NO HIZO CLIC
                      </span>
                      <p className="text-[11px] text-slate-700 mt-1 font-medium">
                        Reenviar con asunto alternativo (*"¿Buscabas cotillón para tu evento en Roca?"*). Si persiste sin respuesta, transferir a <strong>Campaña de Reconquista (Win-Back)</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Win-Back Campaign */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                  4
                </div>
                <div className="p-3 rounded-lg border border-slate-300 bg-slate-900 text-white">
                  <div className="text-[10px] font-bold text-orange-400 uppercase">Campaña de Reconquista (Win-Back)</div>
                  <div className="text-xs font-bold text-white mt-0.5">Reactivación a los 14 días con oferta exclusiva por bulto cerrado</div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Si el cliente aún no compró, recibe una notificación automatizada con descuento exclusivo en polietileno o descartables gastronómicos para reactivar la conversión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
