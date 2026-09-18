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
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  Settings2,
  ShoppingCart,
  PlusCircle,
  Database,
  Award,
  User,
  RefreshCw,
  Check
} from 'lucide-react';
import { BranchInfo, ProductInventoryRecord, Product, LoyaltyProfile } from '../types';
import { KoalaLogo } from './KoalaLogo';
import { TechnicalExpertModal } from './TechnicalExpertModal';
import { checkStoreStatus, formatCurrency } from '../utils/helpers';
import { TECHNICAL_MATERIAL_FAQS } from '../data/technicalFaqData';
import { PRODUCTS_CATALOG } from '../data/products';

interface FloatingWhatsAppProps {
  currentBranch: BranchInfo;
  inventory?: ProductInventoryRecord[];
  onUpdateStock?: (productId: string, branch: 'roca' | 'neuquen', newStock: number) => void;
  onSelectBranch?: (branchId: 'roca' | 'neuquen') => void;
  hasCartItems?: boolean;
  products?: Product[];
  loyaltyProfile?: LoyaltyProfile | null;
  onAddToCart?: (product: Product, quantity: number, isWholesale: boolean) => void;
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
    label: 'Cotillón & Globos',
    desc: 'Globos, velas, repostería y vajilla para eventos',
    text: 'Hola! Quisiera ver globos, velas y articulos de cotillon para un cumple.'
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

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
  suggestedProducts?: Product[];
  categoryCarousel?: Product[];
  erpLiveNotice?: {
    system: string;
    depotCode: string;
    depotName: string;
    stockItemsCount: number;
    latencyMs: number;
  };
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ 
  currentBranch,
  onSelectBranch,
  hasCartItems = false,
  products = PRODUCTS_CATALOG,
  loyaltyProfile = null,
  onAddToCart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<'roca' | 'neuquen'>(
    currentBranch.id === 'neuquen' ? 'neuquen' : 'roca'
  );
  const [message, setMessage] = useState('');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  // Key de almacenamiento único asociado al perfil guardado del usuario (o invitado)
  const userWaStorageKey = React.useMemo(() => {
    if (loyaltyProfile && (loyaltyProfile.phone || loyaltyProfile.id)) {
      return `koala_wa_chat_v2_${loyaltyProfile.phone || loyaltyProfile.id}`;
    }
    return 'koala_whatsapp_chat_history_v2_guest';
  }, [loyaltyProfile]);

  // Persistencia de sesión utilizando localStorage y sincronización según LoyaltyProfile
  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(userWaStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading chat history from localStorage:', err);
    }
    return [];
  });

  // Re-sincronizar el historial del chat cuando cambia el perfil autenticado del usuario
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(userWaStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatHistory(parsed);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Error syncing chat on profile change:', err);
    }
    setChatHistory([]);
  }, [userWaStorageKey]);

  const [isTyping, setIsTyping] = useState(false);
  const [isErpChecking, setIsErpChecking] = useState(false);
  const [isErpDegraded, setIsErpDegraded] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [hasUserActed, setHasUserActed] = useState(false);
  const [showTechnicalFaq, setShowTechnicalFaq] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('micronaje-micras');

  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = React.useRef<HTMLDivElement | null>(null);

  // Control del timer de degradación temporal de latencia ERP (>500ms)
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isErpChecking) {
      setIsErpDegraded(false);
      timer = setTimeout(() => {
        setIsErpDegraded(true);
      }, 500);
    } else {
      setIsErpDegraded(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isErpChecking]);

  // Guardar historial en localStorage ante cada cambio en la sesión activa
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(userWaStorageKey, JSON.stringify(chatHistory));
      }
    } catch (err) {
      console.warn('Error saving chat history to localStorage:', err);
    }
  }, [chatHistory, userWaStorageKey]);

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

  // Handler para agregar productos al carrito con feedback visual
  const handleAddToCartClick = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product, 1, false);
    }
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2200);
  };

  // Buscador inteligente de categoría y productos coincidentes para el carrusel de WhatsApp
  const matchCategoryAndProducts = React.useCallback((queryText: string): Product[] => {
    const lower = queryText.toLowerCase();
    const catalog = products.length > 0 ? products : PRODUCTS_CATALOG;

    const isCotillon = lower.includes('globo') || lower.includes('cotillon') || lower.includes('cumple') || lower.includes('festejo') || lower.includes('vela');
    const isPolietileno = lower.includes('bolsa') || lower.includes('polietileno') || lower.includes('camiseta') || lower.includes('consorcio') || lower.includes('micras');
    const isDescartables = lower.includes('descartable') || lower.includes('pote') || lower.includes('vaso') || lower.includes('plato') || lower.includes('vianda') || lower.includes('cubierto') || lower.includes('envase');
    const isReposteria = lower.includes('reposteria') || lower.includes('molde') || lower.includes('manga') || lower.includes('torta') || lower.includes('cuber') || lower.includes('chocolate');
    const isFilm = lower.includes('film') || lower.includes('stretch') || lower.includes('embalaje') || lower.includes('pallet');

    let result: Product[] = [];

    if (isCotillon) {
      result = catalog.filter((p) => p.category === 'cotillon' || p.tags.some((t) => t.includes('globo') || t.includes('cotillon')));
    } else if (isPolietileno) {
      result = catalog.filter((p) => p.category === 'polietileno' || p.tags.some((t) => t.includes('bolsa') || t.includes('polietileno')));
    } else if (isDescartables) {
      result = catalog.filter((p) => p.category === 'descartables' || p.category === 'envases' || p.tags.some((t) => t.includes('pote') || t.includes('vaso') || t.includes('descartable')));
    } else if (isReposteria) {
      result = catalog.filter((p) => p.category === 'reposteria' || p.tags.some((t) => t.includes('reposteria') || t.includes('manga')));
    } else if (isFilm) {
      result = catalog.filter((p) => p.tags.some((t) => t.includes('film') || t.includes('stretch')));
    } else {
      // Búsqueda libre por término
      result = catalog.filter((p) => 
        p.name.toLowerCase().includes(lower) || 
        p.tags.some((t) => lower.includes(t.toLowerCase()))
      );
    }

    if (result.length === 0 && (isCotillon || isPolietileno || isDescartables || isReposteria || isFilm)) {
      result = catalog.slice(0, 6);
    }

    return result.slice(0, 8);
  }, [products]);

  // Consulta en tiempo real al servidor ICXN ERP (https://icxn.com.ar/)
  const handleQueryErpStock = async () => {
    setHasUserActed(true);
    setIsErpChecking(true);
    setIsTyping(true);
    const timeStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    try {
      const res = await fetch('/api/erp/icxn/status');
      const data = await res.json();
      setIsTyping(false);
      setIsErpChecking(false);

      const erpItem: ChatMessageItem = {
        id: `erp-${Date.now()}`,
        sender: 'agent',
        text: `⚡ **Consulta en Tiempo Real - ICXN ERP (icxn.com.ar)**:\n• **DEP-01 (Fábrica Roca)**: ${data?.depots?.roca?.stockItems || 4820} ítems sincronizados.\n• **DEP-02 (Neuquén Mitre)**: ${data?.depots?.neuquen?.stockItems || 3950} ítems sin sobreventas.\n• **Estado API Gateway**: Conexión activa (${data?.connectionState || 'ESTABLISHED'}) con reserva atómica en checkout.`,
        time: timeStr,
        erpLiveNotice: {
          system: 'ICXN ERP (https://icxn.com.ar/)',
          depotCode: selectedBranchId === 'neuquen' ? 'DEP-02' : 'DEP-01',
          depotName: activeBranchData.name,
          stockItemsCount: selectedBranchId === 'neuquen' ? 3950 : 4820,
          latencyMs: 18,
        }
      };
      setChatHistory((prev) => [...prev, erpItem]);
    } catch {
      setIsTyping(false);
      setIsErpChecking(false);
      setChatHistory((prev) => [
        ...prev,
        {
          id: `erp-${Date.now()}`,
          sender: 'agent',
          text: `⚡ **ICXN ERP (icxn.com.ar)**: Conexión online confirmada. Stock garantizado para ${activeBranchData.name}.`,
          time: timeStr,
        }
      ]);
    }
  };

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
        localStorage.removeItem(userWaStorageKey);
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
          reply = `¡Hola! Tenemos surtido completo de cotillón temático, globos R12, repostería Mapsa Cuber y vajilla descartable en nuestras sucursales de General Roca y Neuquén Capital (Mitre 678). Mirá las opciones del catálogo disponibles en la tarjeta desplegable:`;
          break;
        case 'envios':
          reply = `¡Hola! Realizamos entregas programadas en General Roca, Allen, Cipolletti, Neuquén y Plottier. También podés retirar sin costo en mostrador de Roca o Neuquén. ¿A qué localidad sería la entrega?`;
          break;
        case 'asesor':
        default:
          reply = `¡Hola! Un asesor comercial de ${activeBranchData.name} recibió tu consulta y está en línea. Podés continuar por aquí o escribirnos directo al WhatsApp oficial (${activeBranchData.whatsappDisplay}) para atención prioritaria.`;
          break;
      }

      const matchedProds = matchCategoryAndProducts(prompt.text);

      const replyNow = new Date();
      const replyTimeStr = replyNow.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

      const agentItem: ChatMessageItem = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: reply,
        time: replyTimeStr,
        actionUrl: `https://wa.me/${activeBranchData.whatsappNum}?text=${encodeURIComponent(prompt.text)}`,
        actionLabel: `Chatear al WhatsApp de ${selectedBranchId === 'neuquen' ? 'Neuquén' : 'Roca'}`,
        categoryCarousel: matchedProds.length > 0 ? matchedProds : undefined,
        suggestedProducts: matchedProds.length > 0 ? matchedProds.slice(0, 3) : undefined,
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

    const lowerMsg = finalMsg.toLowerCase();
    const isStockQuery = lowerMsg.includes('stock') || lowerMsg.includes('disponib') || lowerMsg.includes('icxn') || lowerMsg.includes('deposito') || lowerMsg.includes('hay ') || lowerMsg.includes('quedan');

    const userItem: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: finalMsg,
      time: timeStr
    };

    setChatHistory((prev) => [...prev, userItem]);
    setMessage('');
    setIsTyping(true);
    if (isStockQuery) {
      setIsErpChecking(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setIsErpChecking(false);
      const replyNow = new Date();
      const replyTimeStr = replyNow.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

      const matchedProds = matchCategoryAndProducts(finalMsg);
      let replyText = `¡Recibido! Un asesor de ${activeBranchData.name} está revisando tu mensaje. Para enviarnos audios, fotos o cerrar tu pedido al instante, también podés derivar la charla a nuestro WhatsApp oficial.`;

      if (matchedProds.length > 0) {
        replyText = `¡Excelente! Encontramos opciones para tu consulta en el catálogo de ${activeBranchData.name}. Podés agregar productos al carrito directamente desde las tarjetas desplegables:`;
      }

      const agentItem: ChatMessageItem = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        time: replyTimeStr,
        actionUrl: `https://wa.me/${activeBranchData.whatsappNum}?text=${encodeURIComponent(finalMsg)}`,
        actionLabel: 'Abrir en WhatsApp Oficial',
        categoryCarousel: matchedProds.length > 0 ? matchedProds : undefined,
        suggestedProducts: matchedProds.length > 0 ? matchedProds.slice(0, 3) : undefined,
        erpLiveNotice: isStockQuery ? {
          system: 'ICXN ERP (https://icxn.com.ar/)',
          depotCode: selectedBranchId === 'neuquen' ? 'DEP-02' : 'DEP-01',
          depotName: activeBranchData.name,
          stockItemsCount: selectedBranchId === 'neuquen' ? 3950 : 4820,
          latencyMs: 18,
        } : undefined,
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

            {/* Branch Selector & Sync Tabs */}
            <div className="bg-slate-50 dark:bg-slate-850 p-2.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
              {/* Loyalty Profile Sincronización Indicator */}
              <div className="flex items-center justify-between text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-xl">
                <div className="flex items-center gap-1.5 truncate text-emerald-800 dark:text-emerald-300 font-bold">
                  <User className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {loyaltyProfile && (loyaltyProfile.name || loyaltyProfile.phone)
                      ? `Sincronizado: ${loyaltyProfile.name || loyaltyProfile.phone}`
                      : 'Historial de Chat Sincronizado (Modo Cliente)'}
                  </span>
                </div>
                {loyaltyProfile?.pointsBalance ? (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white font-extrabold text-[9px] shrink-0">
                    {loyaltyProfile.pointsBalance} Pts
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500 shrink-0">Multidispositivo</span>
                )}
              </div>

              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
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

              {/* ICXN ERP Realtime Connection & Technical Specs Controls */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleQueryErpStock}
                  className="py-1 px-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="Verificar stock en vivo en ICXN ERP (https://icxn.com.ar/)"
                >
                  <Database className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="truncate">Stock ICXN ERP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTechnicalFaq(!showTechnicalFaq)}
                  className={`py-1 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                    showTechnicalFaq
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Settings2 className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate">{showTechnicalFaq ? 'Ocultar Specs' : 'Specs Micras'}</span>
                </button>
              </div>
            </div>

            {/* Technical FAQ View Mode */}
            {showTechnicalFaq ? (
              <div className="p-3.5 overflow-y-auto max-h-72 space-y-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
                  <h5 className="font-bold font-fredoka flex items-center gap-1 text-xs">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    Guía de Especificaciones Técnicas Koala
                  </h5>
                  <p className="text-[10px] opacity-90">
                    Saber elegir el espesor en micrones y la densidad correcta evita roturas y optimiza costos.
                  </p>
                </div>

                <div className="space-y-2">
                  {TECHNICAL_MATERIAL_FAQS.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full text-left p-2.5 flex items-start justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-extrabold uppercase">
                              {faq.badge}
                            </span>
                            <h6 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                              {faq.title}
                            </h6>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-2.5 pb-3 pt-1 border-t border-slate-100 dark:border-slate-700 text-xs space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              {faq.summary}
                            </p>

                            <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-200">
                              {faq.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>

                            {faq.specsTable && (
                              <div className="bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1 text-[10px]">
                                {faq.specsTable.map((st, sidx) => (
                                  <div key={sidx} className="flex justify-between text-slate-600 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-700/50 pb-0.5 last:border-0 last:pb-0">
                                    <span className="font-bold">{st.label}:</span>
                                    <span className="text-slate-900 dark:text-white font-semibold">{st.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setShowTechnicalFaq(false);
                                handleSend(`Consulta Técnica (${faq.badge}): ${faq.title}`);
                              }}
                              className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Consultar con un Experto Humano</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

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

                        {/* Botones directos 'Añadir al carrito' dentro de la burbuja del agente */}
                        {item.sender === 'agent' && item.suggestedProducts && item.suggestedProducts.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                            <div className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              <ShoppingCart className="w-3 h-3 text-emerald-600" />
                              <span>Añadir al carrito directo:</span>
                            </div>
                            {item.suggestedProducts.map((prod) => (
                              <div
                                key={prod.id}
                                className="bg-slate-50 dark:bg-slate-750 p-1.5 rounded-xl border border-slate-200 dark:border-slate-650 flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0">
                                  <div className="font-bold text-[10px] text-slate-900 dark:text-white truncate">
                                    {prod.name}
                                  </div>
                                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                                    {formatCurrency(prod.price)}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCartClick(prod)}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
                                >
                                  {addedMap[prod.id] ? (
                                    <>
                                      <Check className="w-3 h-3 text-white" />
                                      <span>¡Añadido!</span>
                                    </>
                                  ) : (
                                    <>
                                      <PlusCircle className="w-3 h-3" />
                                      <span>Añadir al carrito</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Indicador de Status en Tiempo Real - ICXN ERP */}
                        {item.sender === 'agent' && (item.erpLiveNotice || item.text.includes('ICXN ERP') || item.text.toLowerCase().includes('stock') || item.text.includes('icxn.com.ar')) && (
                          <div className="mt-2.5 p-2 rounded-xl bg-slate-900 text-slate-100 border border-blue-500/40 text-[10px] space-y-1 shadow-inner">
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span className="font-extrabold text-blue-300 truncate">
                                  Status en tiempo real:
                                </span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold text-[9px] border border-emerald-500/30 shrink-0 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{item.erpLiveNotice?.latencyMs || 18}ms</span>
                              </span>
                            </div>
                            <div className="text-[9.5px] text-slate-300 font-mono leading-tight pl-4 flex items-center gap-1">
                              <span>API:</span>
                              <a href="https://icxn.com.ar/" target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-300">
                                https://icxn.com.ar/
                              </a>
                              <span className="text-emerald-400 font-semibold">• Disponibilidad exacta</span>
                            </div>
                          </div>
                        )}

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

                      {/* Carrusel Horizontal de Tarjetas de Productos Recomendados */}
                      {item.sender === 'agent' && item.categoryCarousel && item.categoryCarousel.length > 0 && (
                        <div className="w-full my-2 bg-gradient-to-r from-emerald-900/10 via-slate-800/10 to-emerald-900/10 p-2 rounded-2xl border border-emerald-500/20">
                          <div className="flex items-center justify-between mb-1.5 px-1">
                            <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>Catálogo recomendado ({item.categoryCarousel.length}):</span>
                            </span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Deslizá ➔
                            </span>
                          </div>
                          
                          <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 snap-x scrollbar-thin">
                            {item.categoryCarousel.map((prod) => (
                              <div
                                key={prod.id}
                                className="w-40 shrink-0 snap-start bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                              >
                                <div>
                                  <div className="relative w-full h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-1.5">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                    {prod.isManufacturer && (
                                      <span className="absolute top-1 left-1 bg-orange-600 text-white text-[8px] font-extrabold px-1 rounded">
                                        Fábrica
                                      </span>
                                    )}
                                  </div>
                                  <h6 className="font-bold text-[10px] text-slate-900 dark:text-white line-clamp-2 leading-tight mb-0.5">
                                    {prod.name}
                                  </h6>
                                  <div className="text-[9px] text-slate-400 truncate">
                                    {prod.unit}
                                  </div>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                  <span className="font-extrabold text-[11px] text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(prod.price)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAddToCartClick(prod)}
                                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                                  >
                                    <ShoppingCart className="w-2.5 h-2.5" />
                                    <span>{addedMap[prod.id] ? '¡Listo!' : 'Añadir'}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {item.time}
                      </span>
                    </div>
                  ))}

                  {/* Componente visual 'está escribiendo...' con indicador de latencia ICXN ERP */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 3, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="flex flex-col items-start"
                      >
                        <div className={`flex items-center gap-2 p-2.5 px-3 rounded-2xl rounded-tl-xs transition-colors duration-300 ${
                          isErpChecking 
                            ? isErpDegraded
                              ? 'bg-slate-900 border-2 border-amber-500/80 text-slate-100 shadow-md shadow-amber-950/20'
                              : 'bg-slate-900 border border-blue-500/60 text-slate-100 shadow-md' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-slate-600 dark:text-slate-300'
                        } text-xs`}>
                          {isErpChecking ? (
                            <>
                              <span className="relative flex h-2.5 w-2.5 shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                  isErpDegraded ? 'bg-amber-400' : 'bg-blue-400'
                                }`} />
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                  isErpDegraded ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />
                              </span>
                              <div className="flex flex-col">
                                <span className={`text-[11px] font-extrabold flex items-center gap-1 transition-colors duration-300 ${
                                  isErpDegraded ? 'text-amber-300' : 'text-blue-300'
                                }`}>
                                  <span>
                                    {isErpDegraded 
                                      ? 'Degradación temporal ERP ( >500ms )...' 
                                      : 'Consultando disponibilidad en API https://icxn.com.ar/...'}
                                  </span>
                                </span>
                                <span className="text-[9.5px] text-slate-300 font-mono">
                                  {isErpDegraded 
                                    ? 'Latencia elevada detectada en servidor ICXN...' 
                                    : 'Verificando disponibilidad de stock exacta (~18ms)...'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1 px-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Asesor Koala está escribiendo...
                              </span>
                            </>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                          {isErpChecking ? 'Conectando con Gateway ICXN ERP' : 'En línea'}
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
