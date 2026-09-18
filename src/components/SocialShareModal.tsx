import React, { useState } from 'react';
import { 
  X, 
  Instagram, 
  MessageCircle, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Tag, 
  Package, 
  ExternalLink,
  Layers,
  Building2,
  QrCode
} from 'lucide-react';
import { Product, ProductInventoryRecord, BranchInfo } from '../types';
import { formatCurrency } from '../utils/helpers';
import { KoalaLogo } from './KoalaLogo';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | ProductInventoryRecord | null;
  currentBranch?: BranchInfo;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  product,
  currentBranch,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStoryText, setCopiedStoryText] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'story' | 'dm' | 'whatsapp'>('story');

  if (!isOpen || !product) return null;

  const productUrl = `https://koalalotiene.com.ar/?product=${product.id}&utm_source=instagram_share`;
  
  const storyText = `✨ ¡Encontrá ${product.name} en Koala Lo Tiene! 
💰 Minorista: ${formatCurrency(product.price)} ${product.wholesalePrice ? `| 📦 Mayorista: ${formatCurrency(product.wholesalePrice)} (Mín. ${product.wholesaleMinPack} un.)` : ''}
📍 Stock disponible en ${currentBranch?.name || 'Roca y Neuquén'}.
📲 Tocá el link para pedir online con entrega rápida: ${productUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyStoryText = () => {
    navigator.clipboard.writeText(storyText);
    setCopiedStoryText(true);
    setTimeout(() => setCopiedStoryText(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(storyText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col space-y-4 p-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-lg text-white">
              <Share2 className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-slate-900 font-fredoka">
              Compartir en Redes Sociales (@koalalotiene)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <Package className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {product.subcategory}
            </span>
            <h4 className="font-bold text-xs text-slate-900 truncate">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="font-black text-slate-900">{formatCurrency(product.price)}</span>
              {product.wholesalePrice && (
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Mayorista: {formatCurrency(product.wholesalePrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedFormat('story')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedFormat === 'story' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Story Sticker</span>
          </button>
          <button
            onClick={() => setSelectedFormat('dm')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedFormat === 'dm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart Link</span>
          </button>
          <button
            onClick={() => setSelectedFormat('whatsapp')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedFormat === 'whatsapp' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Action Content based on tab */}
        {selectedFormat === 'story' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl text-xs font-sans leading-relaxed whitespace-pre-line border border-slate-800">
              {storyText}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyStoryText}
                className="py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedStoryText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStoryText ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '¡Link Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        )}

        {selectedFormat === 'dm' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1 font-mono text-slate-800 break-all">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-sans block">Smart Link Directo:</span>
              <span>{productUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Enlace Copiado al Portapapeles!' : 'Copiar Smart Link para DM'}</span>
            </button>
          </div>
        )}

        {selectedFormat === 'whatsapp' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Compartí la ficha completa con fotos, precio minorista/mayorista y disponibilidad en {currentBranch?.name || 'Roca y Neuquén'} por WhatsApp.
            </p>
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar a Contacto por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
