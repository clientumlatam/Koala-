import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Store, 
  ExternalLink, 
  Clock, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Package, 
  Truck, 
  PartyPopper, 
  HelpCircle,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { BranchInfo, ProductInventoryRecord } from '../types';
import { KoalaLogo } from './KoalaLogo';

interface FloatingWhatsAppProps {
  currentBranch: BranchInfo;
  inventory?: ProductInventoryRecord[];
  onUpdateStock?: (productId: string, branch: 'roca' | 'neuquen', newStock: number) => void;
  onSelectBranch?: (branchId: 'roca' | 'neuquen') => void;
  hasCartItems?: boolean;
}

const QUICK_PROMPTS = [
  {
    id: 'mayorista',
    icon: Package,
    label: 'Cotización Mayorista',
    desc: 'Bolsas de polietileno, film y descartables gastronómicos',
    text: 'Hola Koala Lo Tiene! Quisiera consultar lista de precios mayorista y descuentos por bulto cerrado de polietileno y descartables.'
  },
  {
    id: 'cotillon',
    icon: PartyPopper,
    label: 'Cotillón & Cumpleaños',
    desc: 'Globos, velas, repostería y vajilla para eventos',
    text: 'Hola! Necesito asesoramiento para un evento/cumpleaños. ¿Tienen catálogo y combos armados?'
  },
  {
    id: 'envios',
    icon: Truck,
    label: 'Envíos y Fletes',
    desc: 'Entregas en General Roca, Neuquén y Alto Valle',
    text: 'Hola! Quisiera saber el costo y demora de envío para mi localidad en el Alto Valle.'
  },
  {
    id: 'asesor',
    icon: HelpCircle,
    label: 'Hablar con un Asesor',
    desc: 'Atención personalizada y dudas generales',
    text: 'Hola! Me comunico desde la tienda online de Koala Lo Tiene y quisiera hacer una consulta comercial.'
  }
];

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ 
  currentBranch,
  onSelectBranch,
  hasCartItems = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<'roca' | 'neuquen'>(
    currentBranch.id === 'neuquen' ? 'neuquen' : 'roca'
  );
  const [message, setMessage] = useState('');

  // Synchronize when parent branch changes
  React.useEffect(() => {
    if (currentBranch.id === 'roca' || currentBranch.id === 'neuquen') {
      setSelectedBranchId(currentBranch.id);
    }
  }, [currentBranch.id]);

  const activeBranchData = selectedBranchId === 'roca' 
    ? {
        name: 'General Roca (Casa Central & Fábrica)',
        address: 'Av. Roca 1350',
        phone: '(0298) 443-6639',
        whatsappNum: '5492984536376',
        whatsappDisplay: '298 453-6376',
        hours: 'Lun a Vie 8:30 a 19:30 hs | Sáb 9:00 a 13:30 hs',
        specialty: 'Fábrica de polietileno, venta mayorista y minorista'
      }
    : {
        name: 'Neuquén Capital (Salón Comercial)',
        address: 'Mitre 678',
        phone: '(0299) 443-3960',
        whatsappNum: '5492995093911',
        whatsappDisplay: '299 509-3911',
        hours: 'Lun a Vie 9:00 a 19:30 hs | Sáb 9:00 a 13:30 hs',
        specialty: 'Salón de cotillón, descartables, repostería y bazar'
      };

  const handleBranchChange = (branchId: 'roca' | 'neuquen') => {
    setSelectedBranchId(branchId);
    if (onSelectBranch) {
      onSelectBranch(branchId);
    }
  };

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message || 'Hola Koala Lo Tiene! Quisiera hacer una consulta desde su tienda online.';
    const encoded = encodeURIComponent(finalMsg);
    const url = `https://wa.me/${activeBranchData.whatsappNum}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed ${hasCartItems ? 'bottom-20 md:bottom-5' : 'bottom-5'} right-4 sm:right-5 z-40 flex flex-col items-end transition-all duration-300`}>
      {/* Floating Dialog / Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-4 w-90 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* WhatsApp Header */}
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between relative shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
                    <KoalaLogo size="xs" variant="mascot-only" />
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-300 border-2 border-emerald-600 absolute bottom-0 right-0 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    WhatsApp Ventas Koala
                    <span className="text-[10px] bg-emerald-500/80 px-1.5 py-0.2 rounded font-semibold text-white">
                      Oficial
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
                    En línea • Responde en ~5 minutos
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar chat de WhatsApp"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Branch Selector Tabs */}
            <div className="bg-slate-50 dark:bg-slate-850 p-2.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
                <span>Elegí la sucursal de atención:</span>
                <span className="text-emerald-600 font-semibold">{activeBranchData.whatsappDisplay}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleBranchChange('roca')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col cursor-pointer ${
                    selectedBranchId === 'roca'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Store className="w-3 h-3" /> General Roca
                  </span>
                  <span className={`text-[10px] font-normal ${selectedBranchId === 'roca' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Av. Roca 1350
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBranchChange('neuquen')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all text-left flex flex-col cursor-pointer ${
                    selectedBranchId === 'neuquen'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Store className="w-3 h-3" /> Neuquén Capital
                  </span>
                  <span className={`text-[10px] font-normal ${selectedBranchId === 'neuquen' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Mitre 678
                  </span>
                </button>
              </div>
            </div>

            {/* Chat Body: Quick prompts */}
            <div className="p-3.5 overflow-y-auto space-y-2 flex-1 max-h-64 bg-slate-100/60 dark:bg-slate-900/60">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  👋 ¡Hola! Te contactás con <strong className="text-emerald-600">{activeBranchData.name}</strong>.
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  ¿Cómo podemos ayudarte hoy? Seleccioná una opción rápida o escribinos tu consulta:
                </p>
              </div>

              {/* Quick Prompts List */}
              <div className="space-y-1.5">
                {QUICK_PROMPTS.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleSend(prompt.text)}
                      className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {prompt.label}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {prompt.desc}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input & Direct Action */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Escribí tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer shrink-0"
                  title="Enviar por WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {activeBranchData.hours}
                </span>
                <span className="text-emerald-600 font-semibold">
                  {activeBranchData.phone}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center relative cursor-pointer group transition-colors"
        aria-label="Abrir WhatsApp oficial de Koala Lo Tiene"
      >
        {/* Pulsing rings */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />
        
        {isOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <MessageCircle className="w-7 h-7 relative z-10 fill-white" />
        )}

        {/* Small badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center text-white">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
};
