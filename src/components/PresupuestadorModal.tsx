import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Store, 
  Truck, 
  CreditCard, 
  Layers,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  FileDown,
  FileText,
  Printer,
  Check,
  Gift,
  QrCode,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Building,
  Receipt,
  Award
} from 'lucide-react';
import { BranchInfo, CartItem, OrderQuote, LoyaltyProfile, LoyaltyReward, CompletedOrderReceipt } from '../types';
import { formatCurrency, buildWhatsAppMessage } from '../utils/helpers';
import { downloadQuotePDF } from '../utils/pdfExport';
import { KoalaLogo } from './KoalaLogo';

interface PresupuestadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onToggleWholesale: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentBranch: BranchInfo;
  loyaltyProfile?: LoyaltyProfile | null;
  onOpenLoyaltyModal?: () => void;
  onCompletePurchaseLoyaltyUpdate?: (pointsEarned: number, addStamp: boolean) => void;
  appliedReward?: LoyaltyReward | null;
  onRemoveAppliedReward?: () => void;
}

export const PresupuestadorModal: React.FC<PresupuestadorModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onToggleWholesale,
  onRemoveItem,
  onClearCart,
  currentBranch,
  loyaltyProfile,
  onOpenLoyaltyModal,
  onCompletePurchaseLoyaltyUpdate,
  appliedReward,
  onRemoveAppliedReward,
}) => {
  // Checkout Multi-Step State: 1 = Cart, 2 = Customer & Delivery, 3 = Payment Gateway, 4 = Confirmation
  const [checkoutStep, setCheckoutStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Customer & Shipping Form State
  const [clientName, setClientName] = React.useState(loyaltyProfile?.name || '');
  const [clientPhone, setClientPhone] = React.useState(loyaltyProfile?.phone || '');
  const [clientEmail, setClientEmail] = React.useState(loyaltyProfile?.email || '');
  const [clientCuitOrDni, setClientCuitOrDni] = React.useState(loyaltyProfile?.cuitOrDni || '');
  const [invoiceType, setInvoiceType] = React.useState<'Factura B (Consumidor Final)' | 'Factura A (Responsable Inscripto)'>('Factura B (Consumidor Final)');
  const [deliveryType, setDeliveryType] = React.useState<'retiro' | 'envio'>('retiro');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<'mercadopago' | 'transferencia' | 'efectivo' | 'whatsapp'>('mercadopago');
  const [notes, setNotes] = React.useState('');
  
  // MercadoPago Simulator State
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [installments, setInstallments] = React.useState<number>(1);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  // PDF Export state
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);
  const [completedOrder, setCompletedOrder] = React.useState<CompletedOrderReceipt | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleAutofillDemoData = () => {
    setClientName('Panadería & Confitería San Martín');
    setClientPhone('298 450-8899');
    setClientEmail('pedidos@panaderiasanmartin.com');
    setInvoiceType('Factura A (Responsable Inscripto)');
    setClientCuitOrDni('30-71458920-4');
    setDeliveryType('envio');
    setDeliveryAddress('Av. San Martín 1420, General Roca, Río Negro');
    setFormError(null);
  };

  React.useEffect(() => {
    if (loyaltyProfile) {
      if (!clientName) setClientName(loyaltyProfile.name);
      if (!clientPhone) setClientPhone(loyaltyProfile.phone);
      if (!clientEmail) setClientEmail(loyaltyProfile.email);
      if (!clientCuitOrDni && loyaltyProfile.cuitOrDni) setClientCuitOrDni(loyaltyProfile.cuitOrDni);
    }
  }, [loyaltyProfile]);

  if (!isOpen) return null;

  // Subtotal Calculation
  const itemsSubtotal = cartItems.reduce((acc, item) => {
    const price = item.isWholesale && item.product.wholesalePrice 
      ? item.product.wholesalePrice 
      : item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  // Free delivery threshold ($35,000)
  const FREE_DELIVERY_THRESHOLD = 35000;
  const deliveryFee = deliveryType === 'envio' 
    ? (itemsSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 2500) 
    : 0;

  // Loyalty Discount Calculation
  let loyaltyDiscount = 0;
  if (appliedReward) {
    if (appliedReward.discountAmount) {
      loyaltyDiscount = appliedReward.discountAmount;
    } else if (appliedReward.discountPercentage) {
      loyaltyDiscount = Math.round((itemsSubtotal * appliedReward.discountPercentage) / 100);
    }
  }

  // Payment method discount (5% for Direct Bank Transfer)
  const transferDiscount = paymentMethod === 'transferencia' 
    ? Math.round((itemsSubtotal - loyaltyDiscount) * 0.05) 
    : 0;

  const totalCalculated = Math.max(0, itemsSubtotal + deliveryFee - loyaltyDiscount - transferDiscount);

  // Points to be earned (1 point per $100 spent)
  const pointsToEarn = Math.floor(totalCalculated / 100);
  const earnsStamp = totalCalculated >= 5000;

  const getQuoteData = (): OrderQuote => ({
    clientName,
    clientPhone,
    clientEmail,
    clientCuitOrDni,
    invoiceType,
    branchId: currentBranch.id,
    deliveryType,
    deliveryAddress,
    deliveryFee,
    paymentMethod,
    appliedLoyaltyDiscount: loyaltyDiscount,
    appliedRewardCode: appliedReward?.code,
    appliedRewardName: appliedReward?.name,
    pointsToEarn,
    notes,
  });

  const handleExportPDF = () => {
    if (cartItems.length === 0) return;
    try {
      setIsExportingPdf(true);
      const quote = getQuoteData();
      downloadQuotePDF({
        cartItems,
        quote,
        currentBranch,
      });
    } catch (err) {
      console.error('Error al exportar PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (cartItems.length === 0) return;
    const quote = getQuoteData();
    const encodedText = buildWhatsAppMessage(cartItems, quote, currentBranch);
    const whatsappUrl = `https://wa.me/${currentBranch.whatsapp}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleProcessOrderPayment = () => {
    if (!clientName || !clientPhone) {
      setFormError('Por favor completá tu nombre y teléfono para procesar el pedido.');
      setCheckoutStep(2);
      return;
    }
    if (deliveryType === 'envio' && !deliveryAddress) {
      setFormError('Por favor ingresá la dirección completa para el envío a domicilio.');
      setCheckoutStep(2);
      return;
    }

    setFormError(null);
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const newOrderId = `KOALA-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
      const receipt: CompletedOrderReceipt = {
        orderId: newOrderId,
        date: new Date().toLocaleString('es-AR'),
        clientName,
        clientPhone,
        clientEmail: clientEmail || 'cliente@koalalotiene.com.ar',
        deliveryType,
        deliveryAddress: deliveryType === 'envio' ? deliveryAddress : undefined,
        branchName: currentBranch.name,
        paymentMethod: 
          paymentMethod === 'mercadopago' ? 'Mercado Pago (Tarjeta/QR)' :
          paymentMethod === 'transferencia' ? 'Transferencia Bancaria Directa (-5% OFF)' :
          paymentMethod === 'efectivo' ? 'Efectivo en Sucursal / Contra Entrega' : 'Pedido Directo WhatsApp',
        invoiceType,
        items: [...cartItems],
        subtotal: itemsSubtotal,
        deliveryFee,
        loyaltyDiscount,
        paymentMethodDiscount: transferDiscount,
        total: totalCalculated,
        pointsEarned: pointsToEarn,
        stampsEarned: earnsStamp ? 1 : 0,
        status: 'confirmado',
      };

      setCompletedOrder(receipt);
      setCheckoutStep(4);

      // Trigger loyalty points & stamps update
      if (onCompletePurchaseLoyaltyUpdate) {
        onCompletePurchaseLoyaltyUpdate(pointsToEarn, earnsStamp);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full sm:h-[94vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header Bar */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            {checkoutStep > 1 && checkoutStep < 4 && (
              <button
                onClick={() => setCheckoutStep((prev) => (prev - 1) as any)}
                className="p-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer mr-1"
                title="Volver al paso anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <KoalaLogo size="xs" variant="mascot-only" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-fredoka">
                  {checkoutStep === 4 ? '¡Pedido Confirmado!' : 'Carrito & Checkout E-Commerce'}
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Sucursal: <strong className="text-orange-400">{currentBranch.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {checkoutStep === 4 && (
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExportingPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingPdf ? 'Generando...' : 'Descargar Recibo PDF'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        {checkoutStep < 4 && cartItems.length > 0 && (
          <div className="bg-slate-900 text-slate-400 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${checkoutStep === 1 ? 'text-orange-400 font-extrabold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${checkoutStep === 1 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span>1. Carrito</span>
            </div>
            <span className="text-slate-700">›</span>
            <div className={`flex items-center gap-1.5 ${checkoutStep === 2 ? 'text-orange-400 font-extrabold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${checkoutStep === 2 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span>2. Entrega & Facturación</span>
            </div>
            <span className="text-slate-700">›</span>
            <div className={`flex items-center gap-1.5 ${checkoutStep === 3 ? 'text-orange-400 font-extrabold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${checkoutStep === 3 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span>3. Pago</span>
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cartItems.length > 0 ? (
            <>
              {/* STEP 1: SHOPPING CART & LOYALTY COUPON SELECTION */}
              {checkoutStep === 1 && (
                <div className="space-y-5">
                  {/* Loyalty Points Preview Banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-orange-950 text-white p-4 rounded-2xl border border-orange-500/30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-400/50 flex items-center justify-center text-amber-300 font-black text-xl">
                        🐨
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>¡Sumás +{pointsToEarn} Puntos Club Koala con esta compra!</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {earnsStamp ? '🎉 ¡Este pedido califica para 1 Sello en tu Tarjeta Digital (> $5.000)!' : 'Sumás 1 punto por cada $100 gastados.'}
                        </p>
                      </div>
                    </div>

                    {loyaltyProfile ? (
                      <button
                        onClick={onOpenLoyaltyModal}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                      >
                        Ver mis Puntos ({loyaltyProfile.pointsBalance} pts)
                      </button>
                    ) : (
                      <button
                        onClick={onOpenLoyaltyModal}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Unirme al Club Koala (+200 pts)
                      </button>
                    )}
                  </div>

                  {/* Free Delivery Bar */}
                  {itemsSubtotal < FREE_DELIVERY_THRESHOLD ? (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Faltan <strong>{formatCurrency(FREE_DELIVERY_THRESHOLD - itemsSubtotal)}</strong> para tener <strong>Envío GRATIS</strong></span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-amber-700">Meta: {formatCurrency(FREE_DELIVERY_THRESHOLD)}</span>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-3 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>¡Felicitaciones! Tenés envío a domicilio TOTALMENTE GRATIS en General Roca y Neuquén.</span>
                    </div>
                  )}

                  {/* Applied Loyalty Coupon Banner if selected */}
                  {appliedReward && (
                    <div className="bg-emerald-500/15 border border-emerald-500 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                      <div className="flex items-center gap-2 font-bold">
                        <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Cupón Aplicado: <strong>{appliedReward.name}</strong> (-{formatCurrency(loyaltyDiscount)})</span>
                      </div>
                      {onRemoveAppliedReward && (
                        <button
                          onClick={onRemoveAppliedReward}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold"
                        >
                          Quitar Cupón
                        </button>
                      )}
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span>Productos en tu Carrito ({cartItems.length})</span>
                      <button
                        onClick={onClearCart}
                        className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Vaciar Carrito
                      </button>
                    </div>

                    {cartItems.map(({ product, quantity, isWholesale }) => {
                      const unitPrice = isWholesale && product.wholesalePrice 
                        ? product.wholesalePrice 
                        : product.price;
                      const itemSubtotal = unitPrice * quantity;

                      return (
                        <div
                          key={product.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          {/* Left Item Description */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">
                                {product.subcategory}
                              </span>
                              {product.wholesalePrice && (
                                <button
                                  onClick={() => onToggleWholesale(product.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                                    isWholesale
                                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                                      : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                                  }`}
                                >
                                  {isWholesale ? '✓ Mayorista' : '+ Pasar a Mayorista'}
                                </button>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {product.name}
                            </h4>

                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Precio unitario: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(unitPrice)}</strong> ({product.unit})
                            </div>
                          </div>

                          {/* Right Quantity & Subtotal */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 overflow-hidden shadow-xs">
                              <button
                                onClick={() => onUpdateQuantity(product.id, -1)}
                                className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white">
                                {quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(product.id, 1)}
                                className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right min-w-[90px]">
                              <div className="text-sm font-black text-slate-900 dark:text-orange-400 font-fredoka">
                                {formatCurrency(itemSubtotal)}
                              </div>
                            </div>

                            <button
                              onClick={() => onRemoveItem(product.id)}
                              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary & Continue to Step 2 Button */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Subtotal de Productos:</span>
                        <span className="font-bold">{formatCurrency(itemsSubtotal)}</span>
                      </div>
                      {loyaltyDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Descuento Club Koala:</span>
                          <span>-{formatCurrency(loyaltyDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                        <span className="font-bold text-white">Subtotal Estimado:</span>
                        <span className="text-2xl font-black text-amber-400 font-fredoka">
                          {formatCurrency(itemsSubtotal - loyaltyDiscount)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Comprar Online (Entrega & Pago)</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="pt-2 border-t border-slate-800/80">
                      <p className="text-[11px] text-slate-400 text-center mb-2 font-medium">
                        ¿Sos empresa, escuela o comerciante mayorista?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleExportPDF}
                          disabled={isExportingPdf}
                          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 hover:border-slate-600"
                        >
                          <FileDown className="w-4 h-4 text-orange-400" />
                          <span>{isExportingPdf ? 'Generando...' : 'Descargar Presupuesto PDF'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSendWhatsApp}
                          className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Pedir Cotización WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING & BILLING FORM */}
              {checkoutStep === 2 && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-fredoka">
                      2. Modalidad de Entrega y Datos Fiscales
                    </h3>
                    <button
                      type="button"
                      onClick={handleAutofillDemoData}
                      className="px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 hover:bg-orange-200 text-orange-800 dark:text-orange-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-orange-300 dark:border-orange-800 shadow-xs"
                      title="Carga automática de datos de cliente mayorista para demostración en vivo"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      <span>⚡ Autocompletar Demo (Panadería)</span>
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Delivery Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Seleccionar Tipo de Entrega
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType('retiro');
                          setFormError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          deliveryType === 'retiro'
                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-300 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-extrabold text-sm">
                          <Store className="w-4 h-4 text-orange-600" />
                          <span>Retiro en Sucursal</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Sin costo adicional. Disponible en {currentBranch.name} ({currentBranch.address}).
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType('envio');
                          setFormError(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          deliveryType === 'envio'
                            ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-300 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-extrabold text-sm">
                          <Truck className="w-4 h-4 text-orange-600" />
                          <span>Envío a Domicilio</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {deliveryFee === 0 ? '¡GRATIS por superar $35.000!' : `Costo de envío: ${formatCurrency(2500)}`}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Despacho en 24/48 hs hábiles (Roca y Neuquén)</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {deliveryType === 'envio' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Dirección Completa de Envío *
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ej: San Martín 450, Piso 2 B, General Roca / Neuquén"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {/* Customer Info Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre / Razón Social *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej: Panadería San Martín"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="298 4123456"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email para Factura Electrónica
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="facturas@comercio.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tipo de Factura AFIP
                      </label>
                      <select
                        value={invoiceType}
                        onChange={(e) => setInvoiceType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      >
                        <option value="Factura B (Consumidor Final)">Factura B (Consumidor Final)</option>
                        <option value="Factura A (Responsable Inscripto)">Factura A (Responsable Inscripto)</option>
                      </select>
                    </div>
                  </div>

                  {invoiceType === 'Factura A (Responsable Inscripto)' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        CUIT del Comprador (Factura A) *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientCuitOrDni}
                        onChange={(e) => setClientCuitOrDni(e.target.value)}
                        placeholder="30-71234567-8"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!clientName.trim() || !clientPhone.trim()) {
                        setFormError('Por favor ingresá tu nombre y teléfono para continuar.');
                        return;
                      }
                      if (deliveryType === 'envio' && !deliveryAddress.trim()) {
                        setFormError('Por favor ingresá la dirección completa de entrega.');
                        return;
                      }
                      if (invoiceType === 'Factura A (Responsable Inscripto)' && !clientCuitOrDni.trim()) {
                        setFormError('Para Factura A es necesario ingresar el CUIT del comercio.');
                        return;
                      }
                      setFormError(null);
                      setCheckoutStep(3);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continuar a Selección de Pago</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 3: PAYMENT GATEWAY SELECTION & INTEGRATION SIMULATOR */}
              {checkoutStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-fredoka">
                      3. Integración de Pasarela de Pago
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Reserva Atómica ERP: 15 min
                    </span>
                  </div>

                  {/* Stock lock announcement */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong>¡Stock bloqueado para tu compra!</strong>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Los {cartItems.reduce((s, i) => s + i.quantity, 0)} artículos de tu carrito están reservados en {currentBranch.name} para que nadie compre el último producto en mostrador mientras abonás.
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mercadopago')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'mercadopago'
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-900 dark:text-sky-200 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-sky-500" />
                      <div className="text-xs">Mercado Pago / Tarjeta</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'transferencia'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Receipt className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                      <div className="text-xs">Transferencia (-5% OFF)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'efectivo'
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Store className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                      <div className="text-xs">Efectivo al Retirar</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'whatsapp'
                          ? 'bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                      <div className="text-xs">Pedido WhatsApp</div>
                    </button>
                  </div>

                  {/* MercadoPago Interactive Widget */}
                  {paymentMethod === 'mercadopago' && (
                    <div className="bg-sky-50/70 dark:bg-slate-800/80 border border-sky-200 dark:border-sky-800 p-4 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center">MP</span>
                          <div>
                            <h4 className="font-extrabold text-xs text-sky-950 dark:text-sky-200">Mercado Pago Checkout Transaccional</h4>
                            <p className="text-[11px] text-sky-800 dark:text-sky-300">Acepta Visa, Mastercard, Cabal y Dinero en cuenta MP</p>
                          </div>
                        </div>
                        <QrCode className="w-8 h-8 text-sky-600" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre en la tarjeta</label>
                          <input
                            type="text"
                            placeholder="JUAN PEREZ"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Número de Tarjeta</label>
                          <input
                            type="text"
                            placeholder="4509 •••• •••• 9912"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Vencimiento (MM/AA)</label>
                          <input
                            type="text"
                            placeholder="08/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Financiación en Cuotas</label>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-bold"
                          >
                            <option value={1}>1 Cuota de {formatCurrency(totalCalculated)} (Sin interés)</option>
                            <option value={3}>3 Cuotas de {formatCurrency(Math.round(totalCalculated / 3))} (Sin interés)</option>
                            <option value={6}>6 Cuotas de {formatCurrency(Math.round(totalCalculated / 6))} (Sin interés)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Details */}
                  {paymentMethod === 'transferencia' && (
                    <div className="bg-emerald-50 dark:bg-slate-800/80 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-black text-emerald-900 dark:text-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>¡Descuento adicional del 5% aplicado por Transferencia Directa!</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 font-mono text-[11px] space-y-1">
                        <div><strong>Banco:</strong> Banco Macro / Banco Provincia de Río Negro</div>
                        <div><strong>CBU:</strong> 0170094520000008819203</div>
                        <div><strong>Alias MP/CBU:</strong> KOALA.ROCA.PAGOS</div>
                        <div><strong>Titular:</strong> Koala Lo Tiene S.R.L.</div>
                      </div>
                    </div>
                  )}

                  {/* Total Summary */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Subtotal Ítems:</span>
                        <span>{formatCurrency(itemsSubtotal)}</span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between">
                          <span>Envío a Domicilio:</span>
                          <span>{formatCurrency(deliveryFee)}</span>
                        </div>
                      )}
                      {loyaltyDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Descuento Club Koala:</span>
                          <span>-{formatCurrency(loyaltyDiscount)}</span>
                        </div>
                      )}
                      {transferDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Descuento 5% Transferencia:</span>
                          <span>-{formatCurrency(transferDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-black text-white">
                        <span>Total Final a Pagar:</span>
                        <span className="text-3xl text-amber-400 font-fredoka">{formatCurrency(totalCalculated)}</span>
                      </div>
                    </div>

                    {paymentMethod === 'whatsapp' ? (
                      <button
                        onClick={handleSendWhatsApp}
                        className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Enviar Pedido Directo a WhatsApp</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleProcessOrderPayment}
                        disabled={isProcessingPayment}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        <span>{isProcessingPayment ? 'Procesando Pago Seguro...' : `Pagar ${formatCurrency(totalCalculated)} y Confirmar Pedido`}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: ORDER CONFIRMATION & DIGITAL RECEIPT */}
              {checkoutStep === 4 && completedOrder && (
                <div className="space-y-6 text-center py-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-3xl font-black">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-extrabold text-xs">
                      Número de Pedido: {completedOrder.orderId}
                    </span>
                    <h3 className="text-2xl font-black font-fredoka text-slate-900 dark:text-white pt-2">
                      ¡Gracias por tu compra en Koala Lo Tiene!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Hemos recibido tu pedido correctamente. Se enviará comprobante a {completedOrder.clientEmail}.
                    </p>
                  </div>

                  {/* Loyalty Points Earned Widget */}
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 p-4 rounded-2xl font-bold text-xs shadow-md space-y-1">
                    <div className="flex items-center justify-center gap-1.5 font-black uppercase text-sm font-fredoka">
                      <Sparkles className="w-4 h-4" />
                      <span>¡Acreditaste +{completedOrder.pointsEarned} Puntos Club Koala!</span>
                    </div>
                    {completedOrder.stampsEarned > 0 && (
                      <div className="text-[11px] font-extrabold">
                        🐨 ¡Agregaste 1 Sello en tu Tarjeta Digital por compra mayor a $5.000!
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 font-medium">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 font-bold">
                      <span>Modalidad:</span>
                      <span className="text-orange-600 dark:text-orange-400 capitalize">{completedOrder.deliveryType === 'envio' ? `Envío a Domicilio (${completedOrder.deliveryAddress})` : `Retiro por ${completedOrder.branchName}`}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Forma de Pago:</span>
                      <span className="font-bold">{completedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Comprobante AFIP:</span>
                      <span className="font-bold">{completedOrder.invoiceType}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-black text-slate-900 dark:text-white">
                      <span>Monto Total Abonado:</span>
                      <span className="text-orange-600 dark:text-orange-400 font-fredoka">{formatCurrency(completedOrder.total)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleExportPDF}
                      className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Descargar Recibo en PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        onClearCart();
                        onClose();
                      }}
                      className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Volver a la Tienda</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty Cart */
            <div className="py-16 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 text-3xl font-black">
                🛍️
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-fredoka">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Explorá el catálogo de bolsas, descartables, cotillón o repostería y sumá productos al carrito.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 shadow-md cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
