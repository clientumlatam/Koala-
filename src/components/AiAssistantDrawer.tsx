import React from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Package, 
  MessageCircle, 
  Check, 
  Loader2,
  HelpCircle
} from 'lucide-react';
import { BranchInfo, Product } from '../types';
import { KoalaLogo } from './KoalaLogo';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: BranchInfo;
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  products: Product[];
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
}) => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `¡Hola! Soy el **Asesor Virtual de Koala Lo Tiene**. Estoy capacitado para ayudarte a calcular cantidades para tu evento, seleccionar las bolsas de polietileno o film stretch adecuadas para tu comercio/industria, o armar combos de descartables y repostería en ${currentBranch.name}.\n\n¿En qué puedo asesorarte hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

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
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          branch: currentBranch.id,
        }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || 'No pude obtener una respuesta en este momento.';

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error in AI Assistant:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Estamos experimentando un inconveniente técnico. Podés comunicarte directamente con el WhatsApp de ${currentBranch.name} al ${currentBranch.whatsappFormatted}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm font-fredoka flex items-center gap-1.5">
                <span>Asesor AI Koala</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-extrabold border border-orange-500/30">
                  Gemini AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Atención interactiva para {currentBranch.city}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 shadow-sm border border-slate-200 mt-1">
                  <KoalaLogo size="xs" variant="mascot-only" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-none font-medium'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-xs rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`text-[10px] text-right font-medium ${
                    msg.sender === 'user' ? 'text-orange-200' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  <User className="w-4 h-4" />
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
                <span>Analizando productos y stock de Koala Lo Tiene...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
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
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-900 dark:hover:text-orange-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap transition-all"
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
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribí tu consulta sobre descartables o polietileno..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
