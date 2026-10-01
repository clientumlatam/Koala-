import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  UserCheck, 
  MessageCircle, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Building2, 
  Store,
  Phone,
  Gauge,
  Factory,
  Sliders,
  Dumbbell
} from 'lucide-react';
import { BranchInfo } from '../types';

interface TechnicalExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBranch: BranchInfo;
  isBusinessHours: boolean;
}

const TECHNICAL_AREAS = [
  {
    id: 'polietileno',
    name: 'Polietileno a Medida & Bobinas Industriales',
    desc: 'Baja y alta densidad, espesores de 30 a 100 micrones, rollos de arranque y cristal virgen.',
    icon: Layers,
    badge: 'Producción Propia'
  },
  {
    id: 'personalizadas',
    name: 'Bolsas Impresas con Logo de Empresa',
    desc: 'Flexografía de alta definición en bolsas camiseta, riñón y boutique para marcas.',
    icon: SparklesIcon,
    badge: 'Personalizado'
  },
  {
    id: 'alimentos',
    name: 'Envasado Bromatológico & Alta Barrera',
    desc: 'Bolsas al vacío, bandejas térmicas y descartables certificados para contacto alimenticio.',
    icon: ShieldCheck,
    badge: 'Bromatología'
  },
  {
    id: 'gran-escala',
    name: 'Distribución Mayorista / Revendedor',
    desc: 'Precios directos de fábrica por palet cerrado para panaderías, supermercados y comercios.',
    icon: Building2,
    badge: 'Por Mayor'
  }
];

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

export const TechnicalExpertModal: React.FC<TechnicalExpertModalProps> = ({
  isOpen,
  onClose,
  activeBranch,
  isBusinessHours
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('polietileno');
  const [clientName, setClientName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [customMicrons, setCustomMicrons] = useState<number>(50);
  const [technicalRequirement, setTechnicalRequirement] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Recalcular métricas de IA de resistencia y disponibilidad según los micrones ingresados
  const micronMetrics = useMemo(() => {
    const microns = Math.max(20, Math.min(120, customMicrons || 50));
    
    // Estimación de resistencia a la tracción / carga máxima recomendada
    const loadCapacityKg = (microns * 0.36).toFixed(1);
    const tensileStrengthMPa = Math.round(18 + (microns / 120) * 22); // 18 a 40 MPa
    const punctureResistanceScore = Math.min(10, Math.max(3, Math.round((microns / 12) * 10) / 10));

    // Clasificación de uso
    let usageLabel = 'Ligera (Panaderías, Farmacias, Indumentaria)';
    let usageBadgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    
    if (microns >= 35 && microns <= 55) {
      usageLabel = 'Comercial Estándar (Supermercados, Repostería, Descartables)';
      usageBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    } else if (microns > 55 && microns <= 75) {
      usageLabel = 'Alta Barrera (Alimentos, Congelados, Productos Pesados)';
      usageBadgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    } else if (microns > 75) {
      usageLabel = 'Extra Fuerte Industrial (Corralón, Autopartes, Cargas Bulto Cerrado)';
      usageBadgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
    }

    // Disponibilidad en fábrica
    let availabilityStatus = '🟢 Stock Inmediato en Depósitos Roca (DEP-01) y Neuquén (DEP-02)';
    let availabilityLeadTime = 'Despacho Inmediato en 24hs';
    
    if (microns > 55 && microns <= 85) {
      availabilityStatus = '🟢 Disponible en Planta Central General Roca';
      availabilityLeadTime = 'Despacho Programado en 24-48hs';
    } else if (microns > 85) {
      availabilityStatus = '🟡 Extrusión Especial Bajo Pedido en Fusión de Extrusora';
      availabilityLeadTime = 'Producción en Lote (48-72hs)';
    }

    return {
      microns,
      loadCapacityKg,
      tensileStrengthMPa,
      punctureResistanceScore,
      usageLabel,
      usageBadgeColor,
      availabilityStatus,
      availabilityLeadTime
    };
  }, [customMicrons]);

  if (!isOpen) return null;

  const currentAreaInfo = TECHNICAL_AREAS.find(a => a.id === selectedArea) || TECHNICAL_AREAS[0];

  const handleConnectWithExpert = (e: React.FormEvent) => {
    e.preventDefault();

    const recipientPhone = activeBranch.whatsappPhone || '5492984123456';
    
    // Construir mensaje técnico detallado para el asesor incorporando el cálculo de micrones
    let message = `*SOLICITUD DE ASESOR TÉCNICO ESPECIALIZADO - KOALA LO TIENE*\n\n`;
    message += `👤 *Contacto:* ${clientName || 'Cliente Mayorista'}\n`;
    if (companyName) {
      message += `🏢 *Empresa / Comercio:* ${companyName}\n`;
    }
    if (phone) {
      message += `📱 *Teléfono:* ${phone}\n`;
    }
    message += `📍 *Sucursal de Preferencia:* ${activeBranch.name} (${activeBranch.city})\n`;
    message += `🔬 *Área Técnica:* ${currentAreaInfo.name}\n\n`;
    
    // Especificación de micrones y cálculo automático
    message += `📐 *ESPECIFICACIÓN DE ESPESOR / MICRONES:*\n`;
    message += `• *Micrones Solicitados:* ${micronMetrics.microns} µm\n`;
    message += `• *Resistencia Estimada:* Carga de hasta ~${micronMetrics.loadCapacityKg} kg (${micronMetrics.tensileStrengthMPa} MPa)\n`;
    message += `• *Apto para:* ${micronMetrics.usageLabel}\n`;
    message += `• *Estado en Fábrica:* ${micronMetrics.availabilityStatus}\n\n`;

    if (technicalRequirement.trim()) {
      message += `📋 *Detalle del requerimiento:*\n"${technicalRequirement.trim()}"\n\n`;
    } else {
      message += `📋 *Detalle:* Solicito cotización por volumen para espesor de ${micronMetrics.microns} micrones y plazos de entrega.\n\n`;
    }

    message += `_Enviado desde el portal web oficial de Koala Lo Tiene_`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encoded}`;

    setSubmittedSuccess(true);
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  const handleFillQuickDemo = () => {
    setClientName('Guillermo Ferrero');
    setCompanyName('Frutas & Conservas del Valle S.R.L.');
    setPhone('298 462-1144');
    setSelectedArea('polietileno');
    setCustomMicrons(70);
    setTechnicalRequirement('Requerimos cotizar 800 kg de bobinas de polietileno tubular de 70 micrones, ancho 50 cm, apto contacto con alimentos para línea de empaque.');
  };

  return (
    <div className="TechnicalExpertModal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 sm:p-6 relative border-b border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black tracking-tight font-fredoka text-white">
                    Solicitud de Asesor Técnico
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                    Especialista en Planta
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Soporte técnico directo de fábrica • <strong>{activeBranch.name}</strong></span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Cerrar ventana de especialista técnico"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Helper */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              {isBusinessHours 
                ? '🟢 Especialistas en guardia técnica activa (Respuesta prioritaria)'
                : '🟡 Fuera de horario comercial (Tu consulta ingresa primera en el turno de mañana)'}
            </span>
            <button
              type="button"
              onClick={handleFillQuickDemo}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer border border-amber-400/30"
            >
              ⚡ Cargar Demo Rápida
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-fredoka">
              ¡Conectando con el Especialista!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Estamos transfiriendo tus especificaciones técnicas al equipo de producción de <strong>{activeBranch.name}</strong> por WhatsApp.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 text-left max-w-md mx-auto space-y-1.5 border border-slate-200 dark:border-slate-700">
              <p>• <strong>Área:</strong> {currentAreaInfo.name}</p>
              <p>• <strong>Espesor Solicitado:</strong> {micronMetrics.microns} micrones (µm)</p>
              <p>• <strong>Resistencia Calculada:</strong> Hasta ~{micronMetrics.loadCapacityKg} kg por bolsa</p>
              <p>• <strong>Disponibilidad:</strong> {micronMetrics.availabilityStatus}</p>
              {companyName && <p>• <strong>Empresa:</strong> {companyName}</p>}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition-all hover:bg-slate-800 cursor-pointer"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnectWithExpert} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* Specialty Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Seleccioná el área de asesoramiento que necesitás:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TECHNICAL_AREAS.map((area) => {
                  const Icon = area.icon;
                  const isSelected = selectedArea === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedArea(area.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/30'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {area.name}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {area.desc}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected 
                            ? 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {area.badge}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            ✓ Seleccionado
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTOR DE MICRAS PERSONALIZADA (Calculadora de IA en tiempo real) */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-500/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-fredoka flex items-center gap-1.5">
                      <span>Selector de micras personalizada</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[9px] text-amber-300 font-mono">IA Recalculado</span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Ingresá el espesor deseado en micrones (µm) para recalcular resistencia y disponibilidad en fábrica.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slider & Input Contols */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="range"
                      min={20}
                      max={120}
                      step={5}
                      value={customMicrons}
                      onChange={(e) => setCustomMicrons(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800 border border-amber-500/40 rounded-xl px-2.5 py-1 min-w-[90px] justify-center">
                    <input
                      type="number"
                      min={20}
                      max={120}
                      value={customMicrons}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val)) setCustomMicrons(val);
                      }}
                      className="w-10 text-right bg-transparent text-sm font-black text-amber-400 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">µm</span>
                  </div>
                </div>

                {/* Preset Quick Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400 font-semibold mr-1">Frecuentes:</span>
                  {[
                    { label: '30 µm (Económica)', val: 30 },
                    { label: '50 µm (Estándar)', val: 50 },
                    { label: '70 µm (Alta Barrera)', val: 70 },
                    { label: '90 µm (Industrial)', val: 90 },
                    { label: '110 µm (Extra)', val: 110 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setCustomMicrons(preset.val)}
                      className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer font-medium ${
                        customMicrons === preset.val
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recalculated IA Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                {/* Tensile Strength & Capacity */}
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 font-semibold text-amber-300">
                      <Dumbbell className="w-3.5 h-3.5" />
                      Resistencia Recalculada:
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      ~{micronMetrics.loadCapacityKg} kg / bolsa
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(15, (micronMetrics.microns / 120) * 100))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Tracción tracción: {micronMetrics.tensileStrengthMPa} MPa</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${micronMetrics.usageBadgeColor}`}>
                      {micronMetrics.usageLabel.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Factory Availability & Lead time */}
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                    <Factory className="w-3.5 h-3.5" />
                    <span>Disponibilidad en Planta:</span>
                  </div>
                  <p className="text-[10.5px] font-bold text-white leading-tight">
                    {micronMetrics.availabilityStatus}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-emerald-400" />
                    <span>Plazo: <strong>{micronMetrics.availabilityLeadTime}</strong></span>
                  </p>
                </div>
              </div>
            </div>

            {/* Client & Business info */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                2. Tus Datos de Contacto:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Nombre o Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Empresa / Comercio / Emprendimiento
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Distribuidora Patagónica"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Teléfono / Celular de contacto
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="Ej. 298 450-8899"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Technical Requirement description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                3. Especificaciones Técnicas Adicionales o Dudas:
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">
                Indicá medidas requeridas, volumen de consumo estimado o destino final del producto.
              </p>
              <textarea
                rows={2}
                placeholder="Ej. Requerimos bobinas en ancho 60 cm para envasado de fiambres, aproximadamente 300 kg mensuales..."
                value={technicalRequirement}
                onChange={(e) => setTechnicalRequirement(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contactar Especialista por WhatsApp Oficial ({micronMetrics.microns} µm)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
