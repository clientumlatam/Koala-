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
  CheckCircle2,
  UserCheck,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { BranchInfo, ProductInventoryRecord } from '../types';
import { KoalaLogo } from './KoalaLogo';
import { TechnicalExpertModal } from './TechnicalExpertModal';
import { checkStoreStatus } from '../utils/helpers';

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

const CHAT_STORAGE_KEY = 'koala_whatsapp_chat_history_v1';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ 
  currentBranch,
  onSelectBranch,
  hasCartItems = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<'roca' | 'neuquen'>(
    currentBranch.id === 'neuquen' ? 'neuquen' : 'roca'
  );
  const [message, setMessage] = useState('');
  
  // Persistencia de sesión utilizando localStorage
  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading chat history from localStorage:', err);
    }
    return [];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [hasUserActed, setHasUserActed] = useState(false);

  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = React.useRef<HTMLDivElement | null>(null);

  // Guardar historial en localStorage ante cada cambio
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
      }
    } catch (err) {
      console.warn('Error saving chat history to localStorage:', err);
    }
  }, [chatHistory]);

  // Limpieza de timeouts al desmontar
  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll al final del chat cuando cambia el historial o el estado de tipeo
  React.useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping, isOpen]);

  // Reset interactions and collapsed state when chat opens or closes
  React.useEffect(() => {
    if (isOpen) {
      setIsHeaderCollapsed(false);
      setHasUserActed(false);
    }
  }, [isOpen]);

  // Reiniciar estado del input y el historial de mensajes de la sesión en memoria y localStorage
  const handleResetChat = () => {
    setHasUserActed(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setMessage('');
    setChatHistory([]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Error clearing localStorage:', err);
    }
    setResetAlert(true);
    setTimeout(() => {
      setResetAlert(false);
    }, 2500);
  };

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
        hours: 'Lun a Vie 08:30 a 12:30 y 16:00 a 20:00 hs | Sáb 09:00 a 13:00 hs',
        specialty: 'Fábrica de polietileno, venta mayorista y minorista'
      }
    : {
        name: 'Neuquén Capital (Salón Comercial)',
        address: 'Mitre 678',
        phone: '(0299) 443-3960',
        whatsappNum: '5492995093911',
        whatsappDisplay: '299 509-3911',
        hours: 'Lun a Vie 08:30 a 12:30 y 16:00 a 20:00 hs | Sáb 09:00 a 13:00 hs',
        specialty: 'Salón de cotillón, descartables, repostería y bazar'
      };

  // Validar estado de atención unificado con el horario comercial oficial
  const storeStatus = React.useMemo(() => checkStoreStatus(), []);
  const isBusinessHours = storeStatus.isOpen;

  const handleBranchChange = (branchId: 'roca' | 'neuquen') => {
    setHasUserActed(true);
    setSelectedBranchId(branchId);
    if (onSelectBranch) {
      onSelectBranch(branchId);
    }
  };

  const handleChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 20) {
      setIsHeaderCollapsed(true);
    } else {
      setIsHeaderCollapsed(false);
    }
  };

  // Manejo de clic en QUICK_PROMPTS con indicador de tipeo dinámico
  const handleQuickPromptClick = (prompt: typeof QUICK_PROMPTS[number]) => {
    setHasUserActed(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    // Mensaje del usuario agregado inmediatamente
    const userItem: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt.text,
      time: timeStr
    };

    setChatHistory((prev) => [...prev, userItem]);

    // Activamos el indicador visual 'está escribiendo...'
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Respuesta dinámica simulada del asesor luego de una breve pausa
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);

      let reply = '';
      switch (prompt.id) {
        case 'mayorista':
          reply = `¡Hola! Somos fabricantes de polietileno (LP SRL) con venta directa por bulto cerrado, bobinas y film stretch desde nuestra casa central en Av. Roca 1350. Contamos con precios mayoristas escalonados y despacho a todo el Alto Valle. ¿Qué medidas o volúmenes precisás cotizar?`;
          break;
        case 'cotillon':
          reply = `¡Hola! Tenemos surtido completo de cotillón temático, globos R12, repostería Mapsa Cuber y vajilla descartable en nuestras sucursales de General Roca y Neuquén Capital (Mitre 678). ¿Para qué fecha o temática es tu festejo?`;
          break;
        case 'envios':
          reply = `¡Hola! Realizamos entregas programadas en General Roca, Allen, Cipolletti, Neuquén y Plottier. También podés retirar sin costo en mostrador de Roca o Neuquén. ¿A qué localidad sería la entrega?`;
          break;
        case 'asesor':
        default:
          reply = `¡Hola! Un asesor comercial de ${activeBranchData.name} recibió tu consulta y está en línea. Podés continuar por aquí o escribirnos directo al WhatsApp oficial (${activeBranchData.whatsappDisplay}) para atención prioritaria.`;
          break;
      }

      const replyNow = new Date();
      const replyTimeStr = replyNow.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

      const agentItem: ChatMessageItem = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: reply,
        time: replyTimeStr,
        actionUrl: `https://wa.me/${activeBranchData.whatsappNum}?text=${encodeURIComponent(prompt.text)}`,
        actionLabel: `Chatear al WhatsApp de ${selectedBranchId === 'neuquen' ? 'Neuquén' : 'Roca'}`
      };

      setChatHistory((prev) => [...prev, agentItem]);
    }, 1150);
  };

  const handleSend = (textToSend?: string) => {
    setHasUserActed(true);
    const finalMsg = textToSend || message.trim();
    if (!finalMsg) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    const userItem: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: finalMsg,
      time: timeStr
    };

    setChatHistory((prev) => [...prev, userItem]);
    setMessage('');
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const replyNow = new Date();
      const replyTimeStr = replyNow.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

      const agentItem: ChatMessageItem = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: `¡Recibido! Un asesor de ${activeBranchData.name} está revisando tu mensaje. Para enviarnos audios, fotos o cerrar tu pedido al instante, también podés derivar la charla a nuestro WhatsApp oficial.`,
        time: replyTimeStr,
        actionUrl: `https://wa.me/${activeBranchData.whatsappNum}?text=${encodeURIComponent(finalMsg)}`,
        actionLabel: 'Abrir en WhatsApp Oficial'
      };

      setChatHistory((prev) => [...prev, agentItem]);
    }, 1100);
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
            <div
              className={`${
                isBusinessHours ? 'bg-emerald-600' : 'bg-slate-700'
              } text-white ${
                isHeaderCollapsed ? 'py-2 px-3.5 shadow-md' : 'p-4 shadow-sm'
              } flex items-center justify-between relative transition-all duration-300`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div
                    className={`${
                      isHeaderCollapsed ? 'w-8 h-8' : 'w-10 h-10'
                    } rounded-full bg-white flex items-center justify-center p-1 shadow-sm transition-all duration-300`}
                  >
                    <KoalaLogo size="xs" variant="mascot-only" />
                  </div>
                  <span
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full absolute bottom-0 right-0 border-2 ${
                      isBusinessHours
                        ? 'bg-emerald-300 border-emerald-600 animate-pulse'
                        : 'bg-slate-400 border-slate-700'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <AnimatePresence initial={false}>
                    {!isHeaderCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 truncate">
                          <span className="truncate">
                            WhatsApp {selectedBranchId === 'neuquen' ? 'Neuquén' : 'General Roca'}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold text-white shrink-0 ${
                              isBusinessHours ? 'bg-emerald-500/80' : 'bg-slate-600'
                            }`}
                          >
                            Oficial
                          </span>
                        </h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p
                    className={`text-[11px] flex items-center gap-1 truncate ${
                      isBusinessHours ? 'text-emerald-100' : 'text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isBusinessHours ? 'bg-emerald-200' : 'bg-slate-400'
                      }`}
                    />
                    <span className="truncate">
                      {isHeaderCollapsed
                        ? `En línea • ${selectedBranchId === 'neuquen' ? 'Neuquén' : 'Roca'}`
                        : isBusinessHours
                        ? `En línea • ${storeStatus.statusText}`
                        : `Fuera de horario • ${storeStatus.nextChangeText}`}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Botón 'Hablar con un Experto' con animación de pulso cuando aún no hubo acciones */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setHasUserActed(true);
                    setIsExpertModalOpen(true);
                  }}
                  animate={
                    !hasUserActed
                      ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            '0 0 0 0 rgba(251, 191, 36, 0.45)',
                            '0 0 0 6px rgba(251, 191, 36, 0)',
                            '0 0 0 0 rgba(251, 191, 36, 0)'
                          ]
                        }
                      : {}
                  }
                  transition={
                    !hasUserActed
                      ? {
                          repeat: Infinity,
                          duration: 2,
                          ease: 'easeInOut'
                        }
                      : {}
                  }
                  className={`px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/30 shadow-xs active:scale-95 ${
                    !hasUserActed ? 'ring-2 ring-amber-300/80 bg-white/25' : ''
                  }`}
                  title="Solicitar atención de un especialista técnico en polietileno y packaging"
                >
                  <UserCheck className={`w-3.5 h-3.5 text-amber-300 shrink-0 ${!hasUserActed ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">Hablar con un Experto</span>
                  <span className="sm:hidden">Experto</span>
                </motion.button>

                {/* Botón discreto de 'Borrar chat actual' */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
                  title="Borrar chat actual y reiniciar consulta"
                  aria-label="Borrar chat actual"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Cerrar chat de WhatsApp"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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

            {/* Chat Body */}
            <div
              onScroll={handleChatScroll}
              className={`p-3.5 overflow-y-auto space-y-2.5 flex-1 transition-all duration-300 ${
                isHeaderCollapsed ? 'max-h-76 sm:max-h-84' : 'max-h-64'
              } bg-slate-100/60 dark:bg-slate-900/60`}
            >
              {/* Notificación de reinicio del chat */}
              <AnimatePresence>
                {resetAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold flex items-center gap-2 shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Chat reiniciado. Podés iniciar una nueva consulta.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {chatHistory.length > 0 ? (
                <div className="space-y-2.5">
                  {chatHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                          item.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p>{item.text}</p>
                        {item.actionUrl && (
                          <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                            <a
                              href={item.actionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] shadow-2xs transition-colors"
                            >
                              <MessageCircle className="w-3 h-3 fill-white" />
                              <span>{item.actionLabel || 'Continuar en WhatsApp'}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">Oficial</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {item.time}
                      </span>
                    </div>
                  ))}

                  {/* Componente visual 'está escribiendo...' */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 3, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="flex flex-col items-start"
                      >
                        <div className="flex items-center gap-2 p-2.5 px-3 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1 px-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Asesor Koala está escribiendo...
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                          En línea
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">¿Otra consulta rápida?</span>
                    <button
                      type="button"
                      onClick={handleResetChat}
                      className="text-[10px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Reiniciar chat e iniciar nueva consulta"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Borrar chat actual
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickPromptClick(p)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-left text-[10px] font-medium text-slate-700 dark:text-slate-200 truncate cursor-pointer transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200">
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">
                      👋 ¡Hola! Te contactás con <strong className="text-emerald-600">{activeBranchData.name}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      ¿Cómo podemos ayudarte hoy? Seleccioná una opción rápida o escribinos tu consulta:
                    </p>
                  </div>

                  {/* Componente visual 'está escribiendo...' en estado inicial si se activa */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 3, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="flex flex-col items-start"
                      >
                        <div className="flex items-center gap-2 p-2.5 px-3 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1 px-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Asesor Koala está escribiendo...
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                          En línea
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick Prompts List */}
                  <div className="space-y-1.5">
                    {QUICK_PROMPTS.map((prompt) => {
                      const Icon = prompt.icon;
                      return (
                        <button
                          key={prompt.id}
                          type="button"
                          onClick={() => handleQuickPromptClick(prompt)}
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
                </>
              )}

              {/* Referencia invisible para auto-scroll suave */}
              <div ref={chatBottomRef} />
            </div>

            {/* Custom Input & Direct Action */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Escribí tu mensaje aquí..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (!hasUserActed && e.target.value.trim().length > 0) {
                      setHasUserActed(true);
                    }
                  }}
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

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 gap-1">
                <span className="flex items-center gap-1 truncate" title={activeBranchData.hours}>
                  <Clock className="w-3 h-3 shrink-0" /> Lun-Vie 8:30-12:30 / 16-20h • Sáb 9-13h
                </span>
                <span className="text-emerald-600 font-semibold shrink-0">
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

      {/* Technical Specialist Request Popup Modal */}
      <TechnicalExpertModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        activeBranch={{
          id: selectedBranchId,
          name: activeBranchData.name,
          city: selectedBranchId === 'roca' ? 'General Roca' : 'Neuquén',
          address: activeBranchData.address,
          phone: activeBranchData.phone,
          hours: activeBranchData.hours,
          whatsappPhone: activeBranchData.whatsappNum,
        }}
        isBusinessHours={isBusinessHours}
      />
    </div>
  );
};
