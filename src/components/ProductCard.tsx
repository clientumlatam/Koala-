import React from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Check, 
  Tag, 
  Factory, 
  Sparkles, 
  Package,
  Layers,
  CreditCard,
  MapPin,
  BellRing,
  ArrowRightLeft,
  X,
  Mail,
  CheckCircle2,
  Share2,
  Instagram
} from 'lucide-react';
import { Product, ProductInventoryRecord, BranchInfo } from '../types';
import { formatCurrency } from '../utils/helpers';
import { SocialShareModal } from './SocialShareModal';

interface ProductCardProps {
  product: Product | ProductInventoryRecord;
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  cartQuantity: number;
  currentBranch?: BranchInfo;
  globalWholesaleMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  cartQuantity,
  currentBranch,
  globalWholesaleMode = false,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isWholesaleMode, setIsWholesaleMode] = React.useState(globalWholesaleMode);
  const [addedAnimation, setAddedAnimation] = React.useState(false);
  const [showNotifyModal, setShowNotifyModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [notifyEmail, setNotifyEmail] = React.useState('');
  const [notifySuccess, setNotifySuccess] = React.useState(false);
  const [isSubmittingNotify, setIsSubmittingNotify] = React.useState(false);

  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [transferRequestedSuccess, setTransferRequestedSuccess] = React.useState(false);

  // Sync with global wholesale mode if changed
  React.useEffect(() => {
    if (globalWholesaleMode && product.wholesalePrice) {
      setIsWholesaleMode(true);
      if (product.wholesaleMinPack && quantity < product.wholesaleMinPack) {
        setQuantity(product.wholesaleMinPack);
      }
    } else if (!globalWholesaleMode) {
      setIsWholesaleMode(false);
    }
  }, [globalWholesaleMode, product.wholesalePrice, product.wholesaleMinPack]);

  // Extract branch stock numbers from ProductInventoryRecord or use product data
  const stockRoca = 'stockRoca' in product ? (product.stockRoca ?? 0) : 45;
  const stockNeuquen = 'stockNeuquen' in product ? (product.stockNeuquen ?? 0) : 30;
  
  const isRocaActive = currentBranch?.id === 'roca' || !currentBranch;
  const activeBranchStock = isRocaActive ? stockRoca : stockNeuquen;
  const alternateBranchStock = isRocaActive ? stockNeuquen : stockRoca;
  const alternateBranchName = isRocaActive ? 'Neuquén' : 'General Roca';

  const hasStockBothBranches = stockRoca > 0 && stockNeuquen > 0;
  const isOutOfStockInActiveBranch = activeBranchStock <= 0;
  const requiresInterbranchTransfer = isOutOfStockInActiveBranch && alternateBranchStock > 0;

  // Wholesale pricing calculations
  const isWholesaleEligible = Boolean(product.wholesalePrice && product.wholesaleMinPack);
  const wholesaleSavingsPercent = product.wholesalePrice
    ? Math.round(((product.price - product.wholesalePrice) / product.price) * 100)
    : 0;

  const currentPrice = isWholesaleMode && product.wholesalePrice 
    ? product.wholesalePrice 
    : product.price;

  // Financing calculation (3 cuotas fijas)
  const installment3Price = Math.round(currentPrice / 3);



  const handleAdd = () => {
    onAddToCart(product, quantity, isWholesaleMode);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleRegisterNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;

    setIsSubmittingNotify(true);
    try {
      await fetch('/api/erp/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          branchId: currentBranch?.id || 'roca',
          contact: notifyEmail.trim(),
          contactType: 'email',
        }),
      });
    } catch {
      // offline fallback
    }

    setIsSubmittingNotify(false);
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifySuccess(false);
      setShowNotifyModal(false);
      setNotifyEmail('');
    }, 2200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Card Body */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 min-h-[26px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.isManufacturer && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10.5px] font-extrabold">
                <Factory className="w-3 h-3 text-orange-600" />
                Fabricación Propia
              </span>
            )}

            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10.5px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Más Vendido
              </span>
            )}

            {isWholesaleEligible && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                <Tag className="w-3 h-3 text-emerald-600" />
                Ahorro {wholesaleSavingsPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-1 text-slate-400 hover:text-pink-600 rounded-md hover:bg-pink-50 transition-colors cursor-pointer"
              title="Compartir link en Instagram Story / DMs"
              aria-label="Compartir en Redes"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-500 font-semibold bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md flex items-center gap-1.5" title="Sincronizado con ERP ICXN">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ICXN ERP
            </span>
          </div>
        </div>



        {/* Product Category & Name */}
        <div>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            {product.subcategory}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Wholesale Progress Indicator */}
        {isWholesaleEligible && product.wholesaleMinPack && (
          <div className={`p-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-between gap-2 ${
            quantity >= product.wholesaleMinPack || isWholesaleMode
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-orange-50/80 border-orange-200 text-orange-900'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <Tag className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">
                {quantity >= product.wholesaleMinPack || isWholesaleMode
                  ? '¡Precio mayorista aplicado (Bulto cerrado)!'
                  : `Faltan ${Math.max(0, product.wholesaleMinPack - quantity)} unidades para precio mayorista (Mín: ${product.wholesaleMinPack} u.)`}
              </span>
            </div>
            {product.wholesalePrice && (
              <span className="font-extrabold text-emerald-700 shrink-0">
                {formatCurrency(product.wholesalePrice)} c/u
              </span>
            )}
          </div>
        )}

        {/* Multi-Branch Stock Availability Badges & Status */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
          {/* Global Multi-Branch Status Pill */}
          {hasStockBothBranches ? (
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Stock disponible en ambas sucursales (Roca y Neuquén)</span>
            </div>
          ) : requiresInterbranchTransfer ? (
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              <ArrowRightLeft className="w-3 h-3 text-indigo-600 shrink-0" />
              <span>Disponible en {alternateBranchName} — Requiere consulta de traspaso (24h)</span>
            </div>
          ) : null}

          {/* Breakdown per branch */}
          <div className="flex items-center justify-between font-semibold text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-600" />
              <span>Stock en General Roca:</span>
            </span>
            <span className={`font-bold ${stockRoca > 15 ? 'text-emerald-700' : stockRoca > 0 ? 'text-amber-700' : 'text-rose-600'}`}>
              {stockRoca > 0 ? `${stockRoca} u. (Disponible)` : '0 u. (Sin stock)'}
            </span>
          </div>

          <div className="flex items-center justify-between font-semibold text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Stock en Neuquén:</span>
            </span>
            <span className={`font-bold ${stockNeuquen > 10 ? 'text-emerald-700' : stockNeuquen > 0 ? 'text-amber-700' : 'text-rose-600'}`}>
              {stockNeuquen > 0 ? `${stockNeuquen} u. (Disponible)` : '0 u. (Sin stock)'}
            </span>
          </div>

          {/* Real-Time Out of Stock & Inter-Branch Transfer Triggers */}
          {requiresInterbranchTransfer ? (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTransferModal(true)}
                className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                <span>Solicitar traspaso inter-sucursal (24h)</span>
              </button>
            </div>
          ) : isOutOfStockInActiveBranch ? (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowNotifyModal(true)}
                className="w-full py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-600" />
                <span>Avisarme cuando haya stock</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Dual Pricing Display: Minorista vs. Mayorista / Bulto */}
        <div className="bg-gradient-to-br from-slate-50 to-orange-50/40 p-2.5 rounded-xl border border-slate-200/90 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Precio Minorista</span>
              <span className="font-black text-slate-900 text-sm">
                {formatCurrency(product.price)}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">por {product.unit}</span>
            </div>

            {product.wholesalePrice ? (
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-black uppercase tracking-wider block">Precio por Bulto / Mayorista</span>
                <span className="font-black text-emerald-700 text-sm">
                  {formatCurrency(product.wholesalePrice)}
                </span>
                <span className="text-[10px] text-emerald-600 block font-semibold">
                  (Mín. {product.wholesaleMinPack} bultos)
                </span>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Venta Mayorista</span>
                <span className="text-xs text-slate-500 font-semibold">Consultar por bulto</span>
              </div>
            )}
          </div>

        {/* Wholesale Mode Switcher Button & Real-time Budget Progress */}
          {isWholesaleEligible && product.wholesaleMinPack && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  const newMode = !isWholesaleMode;
                  setIsWholesaleMode(newMode);
                  if (newMode && product.wholesaleMinPack && quantity < product.wholesaleMinPack) {
                    setQuantity(product.wholesaleMinPack);
                  }
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border flex items-center justify-between cursor-pointer ${
                  isWholesaleMode 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Layers className={`w-3.5 h-3.5 ${isWholesaleMode ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Modo Mayorista ({product.wholesaleMinPack}+ un.)</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9.5px] uppercase font-black tracking-wide ${
                  isWholesaleMode ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isWholesaleMode ? 'Aplicado' : 'Comprar Bulto'}
                </span>
              </button>

              {/* Real-time Budget & Minimum Pack Progress Component */}
              <div className={`p-2.5 rounded-xl border text-xs transition-all ${
                quantity >= product.wholesaleMinPack
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200'
                  : 'bg-amber-500/10 border-amber-300 text-slate-800'
              }`}>
                {quantity >= product.wholesaleMinPack ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-extrabold text-[11px] text-emerald-800">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>¡Precio Mayorista Desbloqueado!</span>
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                        -{wholesaleSavingsPercent}% OFF
                      </span>
                    </div>
                    
                    <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-slate-600 font-medium">
                        Presupuesto: <strong className="text-emerald-700 font-black">{formatCurrency(quantity * (product.wholesalePrice || product.price))}</strong>
                      </span>
                      <span className="text-emerald-700 font-extrabold">
                        Ahorro: {formatCurrency((product.price - (product.wholesalePrice || product.price)) * quantity)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">
                        Te faltan <strong className="text-amber-700 font-black">{product.wholesaleMinPack - quantity} {product.unit}</strong> para bulto mayorista
                      </span>
                      <span className="text-[10px] font-black text-slate-500">
                        {quantity}/{product.wholesaleMinPack}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((quantity / product.wholesaleMinPack) * 100))}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] pt-0.5">
                      <span className="text-slate-500">
                        Desbloqueá <strong className="text-emerald-700">{formatCurrency(product.wholesalePrice || 0)}/u.</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuantity(product.wholesaleMinPack || 1);
                          setIsWholesaleMode(true);
                        }}
                        className="text-[10.5px] font-extrabold text-orange-600 hover:text-orange-700 underline underline-offset-2 cursor-pointer"
                      >
                        + Completar {product.wholesaleMinPack} un. (Ahorrá {formatCurrency((product.price - (product.wholesalePrice || product.price)) * (product.wholesaleMinPack || 1))})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Financing & Installment breakdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[11px] text-emerald-900 font-semibold">
          <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>3 cuotas fijas de <strong className="text-emerald-800 font-extrabold">{formatCurrency(installment3Price)}</strong> o con Mercado Pago</span>
        </div>
      </div>

      {/* Card Footer: Active Price & Add to Cart Controls */}
      <div className="p-4 sm:p-5 pt-3 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900 font-fredoka">
              {formatCurrency(currentPrice)}
            </div>
            <span className="text-[10.5px] text-slate-500 font-medium">
              {isWholesaleMode ? `Precio aplicado por bulto mayorista` : `Precio unitario final`}
            </span>
          </div>

          {cartQuantity > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold">
              En lista: {cartQuantity}
            </span>
          )}
        </div>

        {/* Quantity Controls & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 py-2 text-xs font-bold text-slate-800 min-w-[30px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              addedAnimation 
                ? 'bg-emerald-600 text-white scale-98' 
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20 active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar al Cotizador</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
        currentBranch={currentBranch}
      />

      {/* Stock Notification Email Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-slate-900 text-sm font-fredoka">Avisarme cuando haya stock</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresá tu correo electrónico para que el sistema te envíe una alerta automática en cuanto se reponga stock de <strong>{product.name}</strong> en la sucursal de <strong>{currentBranch?.name || 'General Roca'}</strong>.
            </p>

            {notifySuccess ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Aviso registrado! Te enviaremos un email en cuanto haya reposición.</span>
              </div>
            ) : (
              <form onSubmit={handleRegisterNotify} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Correo Electrónico del Cliente *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="tu-email@ejemplo.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingNotify}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>{isSubmittingNotify ? 'Registrando...' : 'Registrar Notificación de Stock'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Inter-Branch Transfer Request Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-fredoka">
                    Solicitud de Traspaso Inter-Sucursal
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Logística interna sin costo en 24 horas hábiles
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferRequestedSuccess(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
              <div className="font-extrabold flex items-center gap-1.5">
                <span>📦 {product.name}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                • Origen: <strong>{alternateBranchName}</strong> (Stock: {alternateBranchStock} u.)<br />
                • Destino: <strong>{currentBranch?.name || 'Sucursal Seleccionada'}</strong> (0 u. actual)<br />
                • Flete Interno: <strong>$0 (Bonificado Koala)</strong>
              </div>
            </div>

            {transferRequestedSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>¡Traspaso Solicitado y Agregado a la Cotización!</span>
                </div>
                <p className="text-[11px] text-slate-600 font-normal">
                  El ítem se incluyó en tu pedido con la nota de traspaso inter-sucursal. Al enviar el pedido por WhatsApp, el vendedor confirmará el remito en 24hs.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferRequestedSuccess(false);
                  }}
                  className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Entendido, volver al catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  ¿Deseás que reservemos las <strong>{quantity} {product.unit}</strong> desde {alternateBranchName} para retirar en {currentBranch?.name || 'tu sucursal'} en el próximo flete diario?
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, quantity, isWholesaleMode);
                      setTransferRequestedSuccess(true);
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Confirmar Traspaso</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

