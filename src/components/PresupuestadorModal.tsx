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
  Check
} from 'lucide-react';
import { BranchInfo, CartItem, OrderQuote } from '../types';
import { formatCurrency, buildWhatsAppMessage } from '../utils/helpers';
import { downloadQuotePDF } from '../utils/pdfExport';

interface PresupuestadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onToggleWholesale: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentBranch: BranchInfo;
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
}) => {
  const [clientName, setClientName] = React.useState('');
  const [clientPhone, setClientPhone] = React.useState('');
  const [deliveryType, setDeliveryType] = React.useState<'retiro' | 'envio'>('retiro');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [notes, setNotes] = React.useState('');
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);
  const [pdfSuccess, setPdfSuccess] = React.useState(false);

  if (!isOpen) return null;

  const totalCalculated = cartItems.reduce((acc, item) => {
    const price = item.isWholesale && item.product.wholesalePrice 
      ? item.product.wholesalePrice 
      : item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  const getQuoteData = (): OrderQuote => ({
    clientName,
    clientPhone,
    branchId: currentBranch.id,
    deliveryType,
    deliveryAddress,
    paymentMethod,
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
      setPdfSuccess(true);
      setTimeout(() => {
        setPdfSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error al exportar PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const quote = getQuoteData();

    const encodedText = buildWhatsAppMessage(cartItems, quote, currentBranch);
    const whatsappUrl = `https://wa.me/${currentBranch.whatsapp}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full sm:h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black font-fredoka text-lg">
              🦘
            </div>
            <div>
              <h2 className="text-lg font-bold font-fredoka">Presupuestador & Cotizador</h2>
              <p className="text-xs text-slate-400">
                Sucursal Destino: <strong className="text-orange-400">{currentBranch.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExportingPdf}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 text-xs font-bold transition-colors cursor-pointer"
                title="Descargar presupuesto en PDF oficial con firma"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingPdf ? 'Generando...' : 'Descargar PDF'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {pdfSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 p-3.5 rounded-2xl flex items-center gap-3 text-emerald-900 dark:text-emerald-200 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">¡Presupuesto PDF generado y descargado con éxito!</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Incluye membrete de {currentBranch.name}, lista detallada de {cartItems.length} artículos, total cotizado y recuadro para firma del cliente.
                </p>
              </div>
            </div>
          )}

          {cartItems.length > 0 ? (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Productos en la Lista ({cartItems.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar Lista
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
                              {isWholesale ? '✓ Precio Mayorista' : '+ Pasar a Mayorista'}
                            </button>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {product.name}
                        </h4>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Precio u.: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(unitPrice)}</strong> ({product.unit})
                        </div>
                      </div>

                      {/* Right Controls & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        {/* Quantity controls */}
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

                        {/* Subtotal */}
                        <div className="text-right min-w-[90px]">
                          <div className="text-sm font-black text-slate-900 dark:text-orange-400 font-fredoka">
                            {formatCurrency(itemSubtotal)}
                          </div>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Wholesale Threshold Validation Alert */}
              {totalCalculated >= 50000 && (
                <div className="bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-600/80 p-4 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-extrabold shadow-sm">
                      <Sparkles className="w-5 h-5 text-slate-950" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black uppercase text-amber-950 dark:text-amber-200 tracking-wider font-fredoka">
                          ¡Monto Apto para Atención y Tarifas Mayoristas!
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-black">
                          Monto &gt; $50.000
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 dark:text-amber-300 font-medium leading-relaxed">
                        Tu cotización actual es de <strong className="font-bold">{formatCurrency(totalCalculated)}</strong>. Al superar los <strong>$50.000</strong>, podés solicitar atención directa con un ejecutivo de Ventas Mayoristas para obtener precios especiales por bulto cerrado en {currentBranch.city}.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200 dark:border-amber-800/60">
                    {cartItems.some(i => !i.isWholesale && i.product.wholesalePrice) ? (
                      <button
                        type="button"
                        onClick={() => {
                          cartItems.forEach(item => {
                            if (!item.isWholesale && item.product.wholesalePrice) {
                              onToggleWholesale(item.product.id);
                            }
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-xs transition-colors"
                      >
                        ⚡ Activar Precio Mayorista en Todo
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                        ✓ Ya tenés precios mayoristas aplicados
                      </span>
                    )}

                    <a
                      href={`https://wa.me/${currentBranch.whatsapp}?text=${encodeURIComponent(`Hola Koala Lo Tiene ${currentBranch.name}! Tengo un presupuesto de $${totalCalculated.toLocaleString('es-AR')} y me gustaría consultar por atención directa de VENTA MAYORISTA / Bulto Cerrado.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors border border-amber-500/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                      Consultar Asesor Mayorista
                    </a>
                  </div>
                </div>
              )}

              {/* Order Form */}
              <form onSubmit={handleSendWhatsApp} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-fredoka uppercase tracking-wider">
                  Completa tus datos para enviar la cotización por WhatsApp
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre o Comercio *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Panadería San Martín"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ej: 298 4123456"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Modalidad de Entrega
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('retiro')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        deliveryType === 'retiro'
                          ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-300 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <div className="text-left">
                        <div>Retiro por Local</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">{currentBranch.address}</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('envio')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        deliveryType === 'envio'
                          ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-300 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <div className="text-left">
                        <div>Envío a Domicilio</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Coordinación directa</div>
                      </div>
                    </button>
                  </div>
                </div>

                {deliveryType === 'envio' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dirección de Envío
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Calle, número, barrio y localidad"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Forma de Pago Estimada
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['efectivo', 'transferencia', 'tarjeta'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-bold capitalize transition-all text-center ${
                          paymentMethod === method
                            ? 'bg-slate-900 dark:bg-orange-600 text-white border-slate-900 dark:border-orange-600'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Notas adicionales o consultas
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Necesito factura A, consultar fecha de entrega..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden resize-none"
                  />
                </div>

                {/* Total & Submit Button */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Total Estimado Cotizado</span>
                      <span className="text-3xl font-black text-white font-fredoka">
                        {formatCurrency(totalCalculated)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold inline-block">
                        Precios Actualizados
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en lista
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* WhatsApp Action */}
                    <button
                      type="submit"
                      className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Enviar por WhatsApp</span>
                    </button>

                    {/* PDF Export Action */}
                    <button
                      type="button"
                      onClick={handleExportPDF}
                      disabled={isExportingPdf}
                      className="py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 shrink-0" />
                      <span>{isExportingPdf ? 'Generando Documento...' : 'Descargar PDF (con Firma)'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>
                      El PDF incluye membrete de <strong>Koala Lo Tiene ({currentBranch.name})</strong>, detalle de ítems, totales, validez legal por 7 días y recuadro formal para <strong>firma del cliente</strong>.
                    </span>
                  </div>
                </div>
              </form>
            </>
          ) : (
            /* Empty Cart */
            <div className="py-16 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 text-3xl font-black">
                🛍️
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-fredoka">
                Tu cotización está vacía
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Explorá el catálogo de bolsas, descartables, cotillón o repostería y agregá los productos que necesites.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 shadow-md"
              >
                Volver al Catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
