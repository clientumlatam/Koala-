import React from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  User, 
  ShoppingCart,
  Check, 
  Loader2,
  HelpCircle,
  RotateCcw,
  Tag,
  Factory,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { BranchInfo, Product, LoyaltyProfile } from '../types';
import { KoalaLogo } from './KoalaLogo';
import { formatCurrency } from '../utils/helpers';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: BranchInfo;
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  products: Product[];
  loyaltyProfile?: LoyaltyProfile | null;
}

const QUICK_PROMPTS = [
  "🎉 Necesito insumos para un cumpleaños de 30 personas",
  "👕 ¿Qué bolsas de polietileno me convienen para mi local de ropa?",
  "🏗️ ¿Qué especificaciones tienen las Big Bags de 1 Tonelada?",
  "🍱 Necesito envases y cubiertos para viandas de rotisería",
  "🎂 ¿Qué moldes y mangas tienen para repostería?",
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentBranch,
  onAddToCart,
  products = [],
  loyaltyProfile = null,
}) => {
  // Storage key dynamic per logged-in loyalty profile or guest
  const userStorageKey = React.useMemo(() => {
    if (loyaltyProfile && (loyaltyProfile.phone || loyaltyProfile.id)) {
      return `koala_ai_chat_v2_${loyaltyProfile.phone || loyaltyProfile.id}`;
    }
    return 'koala_ai_chat_v2_guest';
  }, [loyaltyProfile]);

  // Messages state with dynamic localStorage persistence
  const [messages, setMessages] = React.useState<Message[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(userStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading saved AI chat history:', e);
    }
    return [
      {
        id: 'welcome',
        sender: 'ai',
        text: `¡Hola! Soy el **Asesor Virtual de Koala Lo Tiene**. Estoy capacitado para ayudarte a calcular cantidades para tu evento, seleccionar las bolsas de polietileno o film stretch adecuadas para tu comercio/industria, o armar combos de descartables y repostería en ${currentBranch.name}.\n\n¿En qué puedo asesorarte hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [addedItemsMap, setAddedItemsMap] = React.useState<Record<string, boolean>>({});
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Sync / reload history whenever loyaltyProfile changes (e.g., user logs in)
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(userStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Error syncing chat on profile change:', e);
    }
    // Default welcome message if no history for this profile
    const clientName = loyaltyProfile ? (loyaltyProfile.name || (loyaltyProfile as any).fullName || '') : '';
    const firstName = clientName ? clientName.trim().split(' ')[0] : '';
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `¡Hola${firstName ? ' ' + firstName : ''}! Soy el **Asesor Virtual de Koala Lo Tiene**. Estoy capacitado para ayudarte a calcular cantidades para tu evento, seleccionar las bolsas de polietileno o film stretch adecuadas para tu comercio/industria, o armar combos de descartables y repostería en ${currentBranch.name}.\n\n¿En qué puedo asesorarte hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [userStorageKey, loyaltyProfile, currentBranch.name]);

  // Persist messages to localStorage on state change
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(userStorageKey, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn('Error saving AI chat history:', e);
    }
  }, [messages, userStorageKey]);

  React.useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  // Clear chat history handler
  const handleClearChatHistory = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(userStorageKey);
      }
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'ai',
        text: `Reiniciamos la conversación. ¿En qué producto o cotización de polietileno, descartables o cotillón te ayudo ahora?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper function to match product keywords from query and response
  const findMatchingProducts = (queryText: string, aiResponseText: string): Product[] => {
    if (!products || products.length === 0) return [];
    const text = (queryText + ' ' + aiResponseText).toLowerCase();
    const matched: Product[] = [];

    // Filter relevant products
    for (const p of products) {
      const pName = p.name.toLowerCase();
      const pSub = p.subcategory.toLowerCase();
      const pCat = p.category.toLowerCase();
      const pTags = p.tags.map((t) => t.toLowerCase());

      const nameMatch = pName.split(' ').some((w) => w.length > 3 && text.includes(w));
      const subMatch = pSub.length > 3 && text.includes(pSub);
      const tagMatch = pTags.some((t) => t.length > 3 && text.includes(t));

      let keywordDomainMatch = false;
      if (text.includes('bolsa') || text.includes('polietileno') || text.includes('camiseta') || text.includes('consorcio')) {
        if (pCat === 'polietileno' || pName.includes('bolsa')) keywordDomainMatch = true;
      }
      if (text.includes('film') || text.includes('stretch') || text.includes('pallet') || text.includes('embalaje')) {
        if (pName.includes('film') || pName.includes('stretch')) keywordDomainMatch = true;
      }
      if (text.includes('globo') || text.includes('cotillon') || text.includes('cumple') || text.includes('festejo')) {
        if (pCat === 'cotillon') keywordDomainMatch = true;
      }
      if (text.includes('vianda') || text.includes('pote') || text.includes('vaso') || text.includes('plato') || text.includes('cubierto') || text.includes('descartable')) {
        if (pCat === 'descartables' || pCat === 'envases') keywordDomainMatch = true;
      }
      if (text.includes('molde') || text.includes('manga') || text.includes('reposteria') || text.includes('torta') || text.includes('pico')) {
        if (pCat === 'reposteria') keywordDomainMatch = true;
      }

      if ((nameMatch || subMatch || tagMatch || keywordDomainMatch) && !matched.some((m) => m.id === p.id)) {
        matched.push(p);
      }
      if (matched.length >= 6) break;
    }

    return matched;
  };

  const handleQuickAddToCart = (product: Product, isWholesale: boolean = false) => {
    onAddToCart(product, 1, isWholesale);
    setAddedItemsMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemsMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const clientFullName = loyaltyProfile?.name || (loyaltyProfile as any)?.fullName || 'Cliente';
      const clientPoints = loyaltyProfile?.pointsBalance ?? (loyaltyProfile as any)?.points ?? 0;

      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          branch: currentBranch.id,
          context: loyaltyProfile ? { user: clientFullName, points: clientPoints } : undefined
        }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || 'No pude obtener una respuesta en este momento.';

      // Search matching products in catalog to build actionable product buttons & carousel
      const matchedProds = findMatchingProducts(query, aiReplyText);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: matchedProds.length > 0 ? matchedProds : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error in AI Assistant:', error);
      const matchedProds = findMatchingProducts(query, '');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Estamos experimentando un inconveniente técnico con el servidor AI. Podés comunicarte directamente con el WhatsApp oficial de ${currentBranch.name} al ${currentBranch.whatsappFormatted}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedProducts: matchedProds.length > 0 ? matchedProds : undefined,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm font-fredoka flex items-center gap-1.5 truncate">
                <span className="truncate">Asesor Virtual Koala</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-extrabold border border-orange-500/30 shrink-0">
                  Gemini AI
                </span>
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                <span>Atención en {currentBranch.city}</span>
                {loyaltyProfile ? (
                  <span className="flex items-center gap-1 text-amber-300 font-semibold truncate">
                    <Award className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">
                      {(loyaltyProfile.name || (loyaltyProfile as any).fullName || 'Cliente').split(' ')[0]}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500">• Modo Invitado</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleClearChatHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Borrar e iniciar nueva conversación"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Profile Banner if logged in */}
        {loyaltyProfile && (
          <div className="bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-500/20 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200 font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">
                Historial guardado en perfil: <strong>{loyaltyProfile.phone || loyaltyProfile.name || (loyaltyProfile as any).fullName || 'Cliente'}</strong>
              </span>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">
              {loyaltyProfile.pointsBalance ?? (loyaltyProfile as any).points ?? 0} Pts
            </span>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2.5`}
            >
              <div className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start max-w-full`}>
                {msg.sender === 'ai' ? (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 shadow-xs border border-slate-200 mt-1">
                    <KoalaLogo size="xs" variant="mascot-only" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none font-medium shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-xs rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <div>{msg.text}</div>

                  {/* Inline 1-Click "Añadir al Carrito" Action Pills for Matched Products */}
                  {msg.sender === 'ai' && msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                      <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Añadir directo al carrito:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedProducts.slice(0, 3).map((prod) => {
                          const isAdded = addedItemsMap[prod.id];
                          return (
                            <button
                              key={prod.id}
                              onClick={() => handleQuickAddToCart(prod)}
                              className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-950 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>¡Agregado!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                  <span className="truncate max-w-[120px]">{prod.name}</span>
                                  <span className="text-orange-700 dark:text-orange-300">
                                    {formatCurrency(prod.price)}
                                  </span>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right font-medium ${
                      msg.sender === 'user' ? 'text-orange-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>

              {/* Recommended Product Cards Carousel */}
              {msg.sender === 'ai' && msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                <div className="w-full pl-10 pr-1 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Recomendados para tu consulta:</span>
                    <span className="text-[10px] text-slate-400 font-normal">Deslizá para ver más →</span>
                  </div>

                  <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none">
                    {msg.suggestedProducts.map((p) => {
                      const isAdded = addedItemsMap[p.id];
                      return (
                        <div
                          key={p.id}
                          className="w-44 shrink-0 bg-white dark:bg-slate-850 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-2 group"
                        >
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-24 object-cover rounded-xl bg-slate-100"
                            />
                          ) : (
                            <div className="w-full h-20 bg-orange-50 dark:bg-orange-950/40 rounded-xl flex items-center justify-center p-1">
                              <KoalaLogo size="xs" variant="mascot-only" />
                            </div>
                          )}

                          <div className="space-y-1 min-w-0">
                            {p.isManufacturer && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-extrabold text-[9px]">
                                <Factory className="w-2.5 h-2.5" /> Fábrica
                              </span>
                            )}
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight">
                              {p.name}
                            </h5>
                            <div className="flex items-baseline gap-1">
                              <span className="font-black text-sm text-orange-600 dark:text-orange-400 font-fredoka">
                                {formatCurrency(p.price)}
                              </span>
                              <span className="text-[10px] text-slate-400">{p.unit}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleQuickAddToCart(p)}
                            className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>¡Añadido!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>+ Carrito</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 shadow-sm border border-slate-200 mt-1">
                <KoalaLogo size="xs" variant="mascot-only" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-orange-600 dark:text-orange-400" />
                <span>Analizando stock y especificaciones técnicas...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consultas Frecuentes:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-900 dark:hover:text-orange-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribí tu consulta sobre bolsas, film o descartables..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
