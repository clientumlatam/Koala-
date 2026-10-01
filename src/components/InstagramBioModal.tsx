import React, { useState } from 'react';
import { 
  X, 
  Instagram, 
  Sparkles, 
  ShoppingBag, 
  Send, 
  Bot, 
  ArrowDownLeft, 
  Megaphone, 
  ExternalLink,
  MessageCircle,
  Heart,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { ProductInventoryRecord, BranchInfo } from '../types';
import { INSTAGRAM_PROFILE_INFO, INITIAL_INSTAGRAM_POSTS } from '../data/instagramData';
import { formatCurrency } from '../utils/helpers';

interface InstagramBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: ProductInventoryRecord[];
  currentBranch?: BranchInfo;
  onAddToCart?: (product: ProductInventoryRecord, quantity: number, isWholesale: boolean) => void;
  onNavigateToStore?: () => void;
}

export const InstagramBioModal: React.FC<InstagramBioModalProps> = ({
  isOpen,
  onClose,
  inventory = [],
  currentBranch,
  onAddToCart,
  onNavigateToStore
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'inbound_dm' | 'outbound_campaigns'>('feed');
  const [selectedPost, setSelectedPost] = useState<typeof INITIAL_INSTAGRAM_POSTS[0] | null>(null);
  const [simulatedComment, setSimulatedComment] = useState('PRECIO');
  const [commentSent, setCommentSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-900 via-rose-900 to-orange-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white shadow-md">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold font-fredoka tracking-wide">
                  @koalalotiene — Social Commerce Oficial
                </h3>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  Verificado
                </span>
              </div>
              <p className="text-xs text-purple-200">
                Instagram Feed, Inbound Auto-DM y Campañas Outbound
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar modal Instagram"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Stats Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/koala-logo.png"
              alt="Koala Logo"
              className="w-12 h-12 rounded-full border-2 border-rose-500 p-0.5 object-cover"
            />
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Koala Lo Tiene (LP SRL)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fábrica de Polietileno • Cotillón • Descartables • General Roca & Neuquén
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center text-xs shrink-0">
            <div>
              <div className="font-black text-slate-900 dark:text-white text-sm">24.8K</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Seguidores</div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">&lt; 1s</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Auto-DM IA</div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <a
              href="https://www.instagram.com/koalalotiene/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Seguir en IG</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Subtab Selector */}
        <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>📱 Feed & Posts Comprables</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inbound_dm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inbound_dm'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>📥 Inbound Auto-DM (Prueba)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outbound_campaigns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'outbound_campaigns'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>📤 Outbound Ofertas & Broadcast</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-900 dark:text-white">
          
          {/* TAB 1: FEED POSTS GRID */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INITIAL_INSTAGRAM_POSTS.slice(0, 6).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all shadow-xs"
                  >
                    <img
                      src={post.mediaUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.commentsCount}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold truncate mt-1">
                        🛍️ {post.title || 'Ver publicación'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPost && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-200">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span>Producto Etiquetado en Publicación:</span>
                    </span>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {selectedPost.title || 'Insumos Koala Lo Tiene'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Publicado en @koalalotiene • Auto-DM activo con keyword
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToStore) {
                          onNavigateToStore();
                          onClose();
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                    >
                      Ver en Cotizador Web →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INBOUND DM TEST */}
          {activeTab === 'inbound_dm' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                <div className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  <span>Probar Respuesta Inbound en Tiempo Real:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Escribí una palabra clave como <strong>PRECIO</strong>, <strong>MAYORISTA</strong>, <strong>POLIETILENO</strong> o <strong>MOLDES</strong> para simular el mensaje privado inmediato que recibe el usuario en Instagram:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={simulatedComment}
                    onChange={(e) => setSimulatedComment(e.target.value)}
                    placeholder="Escribí tu comentario (Ej: PRECIO)..."
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCommentSent(true);
                      setTimeout(() => setCommentSent(false), 3000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Comentario</span>
                  </button>
                </div>

                {commentSent && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-md animate-in zoom-in-95">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Respuesta Auto-DM @koalalotiene (&lt; 1s)</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">Meta Graph API</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      ¡Hola! 🐨 Gracias por comentar en <strong>@koalalotiene</strong>. Para consultar precios actualizados y armar tu presupuesto con envío a General Roca y Neuquén ingresá directamente a la tienda online: 
                      <a href="https://koalalotiene.com.ar" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold ml-1">
                        https://koalalotiene.com.ar/?src=ig_inbound
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: OUTBOUND BROADCAST */}
          {activeTab === 'outbound_campaigns' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-2">
                <div className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <span>Campañas Outbound & Ofertas Masivas WhatsApp:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Difusión proactiva de promociones de fábrica para compradores mayoristas de Río Negro y Neuquén:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    📦 Oferta Fábrica Polietileno (Bulto Cerrado)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Enviado a 480 comercios registrados. Tasa de conversión: 18.6%
                  </p>
                  <a
                    href="https://wa.me/5492984508899?text=Hola!%20Quisiera%20consultar%20lista%20mayorista%20de%20polietileno"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Consultar por WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    🎂 Lanzamiento Moldes Repostería Temporada
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Enviado a 320 reposteros del Alto Valle. Tasa de conversión: 21.2%
                  </p>
                  <a
                    href="https://wa.me/5492984508899?text=Hola!%20Quisiera%20consultar%20moldes%20de%20reposteria"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Consultar por WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
