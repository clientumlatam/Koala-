import React, { useState } from 'react';
import { 
  Instagram, 
  Sparkles, 
  ExternalLink, 
  MessageCircle, 
  CheckCircle2, 
  ShoppingBag, 
  Send, 
  Bot, 
  X, 
  ArrowRight,
  Flame,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { InstagramFeedViewer } from './InstagramFeedViewer';
import { BranchInfo, ProductInventoryRecord } from '../types';
import { INSTAGRAM_PROFILE_INFO } from '../data/instagramData';

interface InstagramFeedSectionProps {
  inventory: ProductInventoryRecord[];
  currentBranch: BranchInfo;
  onScrollToCatalog: () => void;
  onAddToCart: (product: ProductInventoryRecord, quantity: number, isWholesale: boolean) => void;
}

export const InstagramFeedSection: React.FC<InstagramFeedSectionProps> = ({
  inventory,
  currentBranch,
  onScrollToCatalog,
  onAddToCart,
}) => {
  // Simulated DM Trigger Modal state
  const [simulatedKeyword, setSimulatedKeyword] = useState<string | null>(null);
  const [botSending, setBotSending] = useState(false);

  const handleTestTrigger = (keyword: string) => {
    setBotSending(true);
    setSimulatedKeyword(keyword);
    setTimeout(() => {
      setBotSending(false);
    }, 600);
  };

  const getBotResponseForKeyword = (kw: string) => {
    const upper = kw.toUpperCase();
    if (upper.includes('PRECIO') || upper.includes('STOCK')) {
      return {
        reply: `¡Hola! 🐨 Gracias por escribirnos a @koalalotiene. Tenemos stock en tiempo real en nuestras sucursales de General Roca (Av. Roca 1350) y Neuquén (Mitre 678). Podés ver los precios actualizados por mayor y menor y armar tu pedido online acá:`,
        link: 'https://koalalotiene.com.ar/?src=ig_dm_auto',
        cta: 'Ver Catálogo y Stock en Vivo',
        whatsapp: 'https://wa.me/542984536376?text=Hola!%20Vi%20su%20Instagram%20y%20quiero%20hacer%20un%20pedido%20de%20ofertas',
      };
    }
    if (upper.includes('BIGBAG') || upper.includes('COTIZAR') || upper.includes('STRETCH')) {
      return {
        reply: `¡Hola! 🏭 Somos fabricantes directos de Polietileno en General Roca. Las Big Bags de 1 Tonelada y Film Stretch virgen de 50 cm cuentan con precio mayorista por bulto cerrado y entrega en el día en todo el Alto Valle. ¿Cuántas unidades necesitás?`,
        link: 'https://koalalotiene.com.ar/?cat=polietileno',
        cta: 'Cotizador Mayorista de Polietileno',
        whatsapp: 'https://wa.me/542984536376?text=Hola!%20Quiero%20cotizar%20Big%20Bags%20y%20Film%20Stretch%20directo%20de%20fabrica',
      };
    }
    if (upper.includes('COTILLON')) {
      return {
        reply: `¡Hola festejante! 🎈 En Koala Lo Tiene encontrás globos Chrome, cortinas shimmer, vajilla y cotillón luminoso con 3 y 6 Cuotas Sin Interés con Tarjeta Confiable BPN y 10% OFF pagando con transferencia.`,
        link: 'https://koalalotiene.com.ar/?cat=cotillon',
        cta: 'Ver Artículos de Cotillón y Fiestas',
        whatsapp: 'https://wa.me/542984536376?text=Hola!%20Quiero%20el%20combo%20de%20cotillon%20promocional%20de%20Instagram',
      };
    }
    if (upper.includes('REPOSTERIA')) {
      return {
        reply: `¡Hola pastelero/a! 🎂 Encontrá moldes de silicona Mapser, placas de acetato, blondas y chocolates con 10% OFF en tu primer pedido web usando el cupón KOALA10.`,
        link: 'https://koalalotiene.com.ar/?cat=reposteria&coupon=KOALA10',
        cta: 'Explorar Repostería con Descuento',
        whatsapp: 'https://wa.me/542984536376?text=Hola!%20Quiero%20aprovechar%20el%20cupon%20de%20reposteria%20de%20Instagram',
      };
    }
    return {
      reply: `¡Hola! 🐨 Te damos la bienvenida a Koala Lo Tiene (Fábrica & Distribuidora Alto Valle). Te compartimos nuestro catálogo interactivo con stock sincronizado en Roca y Neuquén:`,
      link: 'https://koalalotiene.com.ar',
      cta: 'Abrir Tienda Oficial Koala',
      whatsapp: 'https://wa.me/542984536376?text=Hola%20Koala%20Lo%20Tiene!%20Tengo%20una%20consulta',
    };
  };

  return (
    <section 
      id="instagram-feed" 
      className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 relative scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-purple-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
              <Instagram className="w-4 h-4 text-rose-500" />
              <span>Canal Oficial de Social Commerce</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-fredoka text-slate-900 dark:text-white tracking-tight">
              Feed de Instagram <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">@{INSTAGRAM_PROFILE_INFO.handle}</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Seguinos en tiempo real para no perderte las <strong>Mega Ofertas semanales</strong>, novedades directas de nuestra <strong>fábrica de polietileno</strong> en General Roca, promociones bancarias con <strong>BPN</strong> y lanzamientos exclusivos para el Alto Valle.
            </p>
          </div>

          {/* Quick Badges & External Link */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={INSTAGRAM_PROFILE_INFO.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Seguir en Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={INSTAGRAM_PROFILE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Ventas</span>
            </a>
          </div>
        </div>

        {/* Value Props Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 flex items-center justify-center shrink-0">
              🏭
            </span>
            <span>Fábrica Propia en Roca</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0">
              💳
            </span>
            <span>3 y 6 Cuotas Sin Interés BPN</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center shrink-0">
              🚚
            </span>
            <span>Envíos a todo Río Negro y Neuquén</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
              ✨
            </span>
            <span>Sumá Puntos Club Koala</span>
          </div>
        </div>

        {/* The Core Feed Viewer Component */}
        <InstagramFeedViewer
          inventory={inventory}
          currentBranch={currentBranch}
          onNavigateToStore={onScrollToCatalog}
          onTestTrigger={handleTestTrigger}
          onAddToCart={onAddToCart}
        />

        {/* Simulated Trigger Response Modal */}
        {simulatedKeyword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSimulatedKeyword(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Simulación Bot Instagram DM / ManyChat
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Disparador de Palabra Clave: "{simulatedKeyword}"
                  </h3>
                </div>
              </div>

              {botSending ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500 font-medium">
                    Procesando respuesta automatizada en menos de 2 segundos...
                  </p>
                </div>
              ) : (
                (() => {
                  const bot = getBotResponseForKeyword(simulatedKeyword);
                  return (
                    <div className="space-y-4 pt-1">
                      {/* Instagram DM Chat Bubble */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm text-xs text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-700">
                        {bot.reply}
                      </div>

                      {/* Action Button inside Chat */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setSimulatedKeyword(null);
                            onScrollToCatalog();
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{bot.cta}</span>
                        </button>

                        <a
                          href={bot.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Continuar por WhatsApp con un Asesor</span>
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Lead capturado y sincronizado:</strong> Esta interacción vincula automáticamente al cliente con el ERP para seguimiento comercial y fidelización Club Koala.
                        </span>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
