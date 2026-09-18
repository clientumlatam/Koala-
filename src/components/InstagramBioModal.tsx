import React, { useState } from 'react';
import { 
  X, 
  Instagram, 
  MessageCircle, 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  Tag, 
  ExternalLink, 
  Copy, 
  Check, 
  QrCode, 
  Gift, 
  Share2, 
  Building2, 
  Phone, 
  Clock, 
  ChevronRight,
  Search,
  Package,
  Cake,
  PartyPopper,
  UtensilsCrossed,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BranchInfo, BranchId, CategoryId } from '../types';
import { KoalaLogo } from './KoalaLogo';
import { STORES_DATA } from '../data/products';

interface InstagramBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: BranchInfo;
  onSelectBranch: (branchId: BranchId) => void;
  onSelectCategoryAndClose: (catId: CategoryId) => void;
  onOpenLoyaltyModal: () => void;
  onOpenAi: () => void;
  onOpenCart: () => void;
}

export const InstagramBioModal: React.FC<InstagramBioModalProps> = ({
  isOpen,
  onClose,
  currentBranch,
  onSelectBranch,
  onSelectCategoryAndClose,
  onOpenLoyaltyModal,
  onOpenAi,
  onOpenCart,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'bio_links' | 'link_generator' | 'story_ctas'>('bio_links');
  
  // Custom Campaign Link Generator State
  const [customCategory, setCustomCategory] = useState<CategoryId>('all');
  const [customCampaign, setCustomCampaign] = useState('ig_story_promo');
  const [customDiscount, setCustomDiscount] = useState('KOALA10');
  const [customMode, setCustomMode] = useState<'minorista' | 'mayorista'>('minorista');

  if (!isOpen) return null;

  const generatedUrl = `https://koalalotiene.com.ar/?src=${customCampaign}&cat=${customCategory}&mode=${customMode}${customDiscount ? `&coupon=${customDiscount}` : ''}`;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const bioLinks = [
    {
      title: '🛒 Catálogo Completo & Stock en Vivo',
      subtitle: 'Consultá precios actualizados en General Roca y Neuquén',
      action: () => onSelectCategoryAndClose('all'),
      icon: <ShoppingBag className="w-5 h-5 text-orange-600" />,
      badge: 'Popular',
      highlight: true,
    },
    {
      title: '🎂 Repostería, Pastelería & Chocolatería',
      subtitle: 'Moldes de silicona, chocolates, mangas, cortantes y bases',
      action: () => onSelectCategoryAndClose('reposteria'),
      icon: <Cake className="w-5 h-5 text-pink-600" />,
      badge: '10% OFF',
    },
    {
      title: '🎈 Cotillón, Globología & Eventos',
      subtitle: 'Globos Chrome, cortinas shimmer, bengalas y cotillón luminoso',
      action: () => onSelectCategoryAndClose('cotillon'),
      icon: <PartyPopper className="w-5 h-5 text-purple-600" />,
    },
    {
      title: '📦 Polietileno & Descartables de Fábrica',
      subtitle: 'Bolsas camiseta, film stretch, Big Bags y envases vianda',
      action: () => onSelectCategoryAndClose('polietileno'),
      icon: <Package className="w-5 h-5 text-amber-600" />,
      badge: 'Fábrica',
    },
    {
      title: '🏷️ Precios Mayoristas (Bulto Cerrado)',
      subtitle: 'Descuentos por volumen para revendedores y comercios',
      action: () => onSelectCategoryAndClose('all'),
      icon: <Tag className="w-5 h-5 text-emerald-600" />,
      badge: 'Mayorista',
    },
    {
      title: '🎁 Club Koala: Puntos y Tarjeta Digital',
      subtitle: 'Sumá puntos con cada compra y canjeá premios y descuentos',
      action: () => {
        onClose();
        onOpenLoyaltyModal();
      },
      icon: <Gift className="w-5 h-5 text-amber-500" />,
    },
    {
      title: '💬 Hablar con un Vendedor por WhatsApp',
      subtitle: `Atención directa en ${currentBranch.name}`,
      action: () => {
        window.open(`https://wa.me/${currentBranch.whatsapp}?text=${encodeURIComponent(`¡Hola! Vengo desde el enlace de Instagram @koalalotiene y quisiera hacer una consulta sobre productos y stock en ${currentBranch.name}.`)}`, '_blank');
      },
      icon: <MessageCircle className="w-5 h-5 text-emerald-500" />,
      highlight: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header with Instagram Branding */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-4 sm:p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-lg relative ring-4 ring-white/30">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-orange-50">
                <KoalaLogo size="sm" variant="mascot-only" />
              </div>
              <span className="absolute bottom-0 right-0 p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full text-white shadow-xs">
                <Instagram className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="text-lg font-black font-fredoka">@koalalotiene</h2>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-bold tracking-wider uppercase">Oficial</span>
              </div>
              <p className="text-xs text-white/90 font-medium max-w-xs mt-0.5">
                Fabricantes de Polietileno • Cotillón • Repostería • Descartables
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-white/80">
                <span className="flex items-center gap-1">📍 General Roca</span>
                <span>•</span>
                <span className="flex items-center gap-1">📍 Neuquén Capital</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-center gap-1 mt-4 pt-3 border-t border-white/20 text-xs font-bold">
            <button
              onClick={() => setSelectedTab('bio_links')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedTab === 'bio_links'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              📱 Link en Bio
            </button>
            <button
              onClick={() => setSelectedTab('link_generator')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedTab === 'link_generator'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              🔗 Generador de Links
            </button>
            <button
              onClick={() => setSelectedTab('story_ctas')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedTab === 'story_ctas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              📣 Stories & CTAs
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-slate-50">
          {/* TAB 1: Mobile-First Link in Bio */}
          {selectedTab === 'bio_links' && (
            <div className="space-y-3">
              {/* Branch Selector Switcher inside Bio */}
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-orange-600" />
                    Sucursal activa para ver stock:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STORES_DATA.map((b) => {
                    const isActive = b.id === currentBranch.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => onSelectBranch(b.id)}
                        className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-extrabold text-[11.5px]">{b.city}</div>
                        <div className="text-[10px] text-slate-500">{b.address}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Story Highlights simulated badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => onSelectCategoryAndClose('reposteria')}
                  className="flex flex-col items-center gap-1 shrink-0 p-1 cursor-pointer group"
                >
                  <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm">
                      🎂
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Repostería</span>
                </button>

                <button
                  onClick={() => onSelectCategoryAndClose('cotillon')}
                  className="flex flex-col items-center gap-1 shrink-0 p-1 cursor-pointer group"
                >
                  <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm">
                      🎈
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Cotillón</span>
                </button>

                <button
                  onClick={() => onSelectCategoryAndClose('polietileno')}
                  className="flex flex-col items-center gap-1 shrink-0 p-1 cursor-pointer group"
                >
                  <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm">
                      🏭
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Fábrica</span>
                </button>

                <button
                  onClick={() => onSelectCategoryAndClose('descartables')}
                  className="flex flex-col items-center gap-1 shrink-0 p-1 cursor-pointer group"
                >
                  <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm">
                      🥤
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Descartables</span>
                </button>

                <button
                  onClick={onOpenAi}
                  className="flex flex-col items-center gap-1 shrink-0 p-1 cursor-pointer group"
                >
                  <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-orange-400 to-amber-500 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm">
                      ✨
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Asesor AI</span>
                </button>
              </div>

              {/* Bio Links Buttons List */}
              <div className="space-y-2 pt-1">
                {bioLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={link.action}
                    className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer group ${
                      link.highlight
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md hover:from-orange-600 hover:to-amber-600 scale-[1.01]'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 shadow-2xs hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${link.highlight ? 'bg-white/20 text-white' : 'bg-slate-100'}`}>
                        {link.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs group-hover:translate-x-0.5 transition-transform">
                            {link.title}
                          </span>
                          {link.badge && (
                            <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-black uppercase ${
                              link.highlight ? 'bg-white text-orange-700' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10.5px] leading-tight ${link.highlight ? 'text-white/90' : 'text-slate-500'}`}>
                          {link.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                      link.highlight ? 'text-white' : 'text-slate-400'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Smart Link & QR Code Generator for Instagram Posts/Stories */}
          {selectedTab === 'link_generator' && (
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Generador de Smart Links con UTM & Descuentos
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Creá enlaces listos para pegar en el sticker de enlace de historias, bio o respuestas automáticas de ManyChat.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Categoría Destino:
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as CategoryId)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">Todo el Catálogo</option>
                    <option value="reposteria">🎂 Repostería y Pastelería</option>
                    <option value="cotillon">🎈 Cotillón y Festejos</option>
                    <option value="polietileno">🏭 Polietileno y Fábrica</option>
                    <option value="descartables">🥤 Descartables Gastronómicos</option>
                    <option value="envases">🧴 Envases y PET</option>
                    <option value="libreria">📚 Librería y Comercial</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Campaña / Origen:
                    </label>
                    <select
                      value={customCampaign}
                      onChange={(e) => setCustomCampaign(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ig_story_promo">Historia de Instagram</option>
                      <option value="ig_reel_viral">Reel de Instagram</option>
                      <option value="ig_dm_auto">Respuesta DM / ManyChat</option>
                      <option value="meta_ad_boost">Anuncio Pago Meta</option>
                      <option value="qr_local">Cartel / QR en Mostrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Modo de Precios:
                    </label>
                    <select
                      value={customMode}
                      onChange={(e) => setCustomMode(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="minorista">Minorista</option>
                      <option value="mayorista">Mayorista (Bulto)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cupón de Descuento Auto-Aplicable:
                  </label>
                  <input
                    type="text"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value.toUpperCase())}
                    placeholder="Ej: KOALA10, REPOSTERIA15"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:ring-2 focus:ring-orange-500"
                  >
                  </input>
                </div>

                {/* Generated Link Box */}
                <div className="pt-2">
                  <span className="block text-[10.5px] font-bold text-slate-500 mb-1">Enlace Generado:</span>
                  <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[10.5px] break-all border border-slate-800 flex items-center justify-between gap-2">
                    <span>{generatedUrl}</span>
                    <button
                      onClick={() => handleCopyLink(generatedUrl)}
                      className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-sans font-bold text-xs shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Story & Post CTA Templates */}
          {selectedTab === 'story_ctas' && (
            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider block">
                  Plantilla 1: Sticker de Enlace para Historias
                </span>
                <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "📲 ¡Mirá precios actualizados y stock en vivo de Roca y Neuquén! Tocá el sticker para armar tu pedido online 🛒👇"
                </p>
                <button
                  onClick={() => handleCopyLink("📲 ¡Mirá precios actualizados y stock en vivo de Roca y Neuquén! Tocá el sticker para armar tu pedido online 🛒👇")}
                  className="w-full py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Texto para Story</span>
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider block">
                  Plantilla 2: Promo Repostería / Pastelería
                </span>
                <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "🎂 ¿Tenés una fiesta o emprendimiento pastelero? Encontrá todos los moldes, chocolates e insumos con 10% OFF en nuestra web: www.koalalotiene.com.ar"
                </p>
                <button
                  onClick={() => handleCopyLink("🎂 ¿Tenés una fiesta o emprendimiento pastelero? Encontrá todos los moldes, chocolates e insumos con 10% OFF en nuestra web: www.koalalotiene.com.ar")}
                  className="w-full py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Texto para Post / Reel</span>
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                  Plantilla 3: Compras Mayoristas Bulto Cerrado
                </span>
                <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "📦 ¿Buscás polietileno y descartables directo de fábrica? Cotizá por bulto cerrado y recibí en tu comercio en 24/48 hs. 🚛"
                </p>
                <button
                  onClick={() => handleCopyLink("📦 ¿Buscás polietileno y descartables directo de fábrica? Cotizá por bulto cerrado y recibí en tu comercio en 24/48 hs. 🚛")}
                  className="w-full py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Texto Mayorista</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Instagram: <strong>@koalalotiene</strong></span>
          <button
            onClick={() => onSelectCategoryAndClose('all')}
            className="px-3 py-1.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Ir a la Tienda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
