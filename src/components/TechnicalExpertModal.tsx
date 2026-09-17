import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UserCheck, 
  MessageCircle, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Sparkles, 
  Phone, 
  ShieldCheck, 
  Building2, 
  Store,
  Send
} from 'lucide-react';
import { BranchInfo } from '../types';
import { KoalaLogo } from './KoalaLogo';

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
    icon: Sparkles,
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
  const [technicalRequirement, setTechnicalRequirement] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAreaInfo = TECHNICAL_AREAS.find(a => a.id === selectedArea) || TECHNICAL_AREAS[0];

  const handleConnectWithExpert = (e: React.FormEvent) => {
    e.preventDefault();

    const recipientPhone = activeBranch.whatsappPhone || '5492984536376';
    
    // Construir mensaje técnico detallado para el asesor
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
    
    if (technicalRequirement.trim()) {
      message += `📋 *Detalle del requerimiento:*\n"${technicalRequirement.trim()}"\n\n`;
    } else {
      message += `📋 *Detalle:* Necesito asesoramiento técnico en medidas, espesores/micrones y cotización por volumen.\n\n`;
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
    setTechnicalRequirement('Requerimos cotizar 800 kg de bobinas de polietileno tubular de 60 micrones, ancho 50 cm, apto contacto con alimentos para línea de empaque.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 sm:p-6 relative border-b border-slate-800">
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
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-fredoka">
              ¡Conectando con el Especialista!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Estamos transfiriendo tus especificaciones técnicas al equipo de producción de <strong>{activeBranch.name}</strong> por WhatsApp.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 text-left max-w-md mx-auto space-y-1">
              <p>• <strong>Área:</strong> {currentAreaInfo.name}</p>
              {companyName && <p>• <strong>Empresa:</strong> {companyName}</p>}
              <p>• <strong>Canal prioritario:</strong> {activeBranch.phone}</p>
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
          <form onSubmit={handleConnectWithExpert} className="p-5 sm:p-6 space-y-5">
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
                3. Especificaciones Técnicas o Dudas:
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">
                Indicá medidas requeridas, calibres/micrones, volumen de consumo estimado o destino final del producto.
              </p>
              <textarea
                rows={3}
                placeholder="Ej. Necesitamos bobinas de 70 micrones en 60 cm para envasado al vacío de fiambres, aproximadamente 300 kg mensuales..."
                value={technicalRequirement}
                onChange={(e) => setTechnicalRequirement(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contactar Especialista por WhatsApp Oficial</span>
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
