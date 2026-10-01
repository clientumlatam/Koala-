import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  QrCode, 
  Scan, 
  Package, 
  Check, 
  ShoppingCart, 
  AlertCircle, 
  Camera, 
  CameraOff, 
  Volume2, 
  Sparkles, 
  Search,
  Plus,
  Minus
} from 'lucide-react';
import { Product, ProductInventoryRecord, BranchInfo } from '../types';
import { formatCurrency, normalizeSearchText } from '../utils/helpers';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: (Product | ProductInventoryRecord)[];
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  currentBranch?: BranchInfo;
  globalWholesaleMode?: boolean;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  currentBranch,
  globalWholesaleMode = false,
}) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'koala-qr-reader';

  // Play audio beep feedback on scan
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback silent
    }
  };

  // Find product by SKU, ID, code or tags
  const findProductByCode = (code: string): Product | null => {
    const cleanCode = normalizeSearchText(code.trim());
    if (!cleanCode) return null;

    // 1. Direct SKU or ID match
    const exactMatch = products.find((p) => {
      const sku = (p as any).sku || '';
      return (
        normalizeSearchText(p.id) === cleanCode ||
        normalizeSearchText(sku) === cleanCode ||
        p.id.toLowerCase().includes(cleanCode) ||
        sku.toLowerCase().includes(cleanCode)
      );
    });

    if (exactMatch) return exactMatch as Product;

    // 2. Fallback search by tag or partial SKU code
    const partialMatch = products.find((p) => {
      const sku = (p as any).sku || '';
      return (
        normalizeSearchText(p.name).includes(cleanCode) ||
        p.tags.some((t) => normalizeSearchText(t) === cleanCode) ||
        sku.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanCode.replace(/[^a-z0-9]/g, ''))
      );
    });

    return (partialMatch as Product) || null;
  };

  // Handle scanned code
  const handleCodeDetected = (code: string) => {
    playBeep();
    setLastScannedCode(code);
    const found = findProductByCode(code);

    if (found) {
      setScannedProduct(found);
      setNotFoundCode(null);
      setQuantity(1);
    } else {
      setScannedProduct(null);
      setNotFoundCode(code);
    }
  };

  // Start Scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (html5QrcodeRef.current) {
        try {
          await html5QrcodeRef.current.stop();
        } catch {
          // ignore stop errors
        }
      }

      const html5Qrcode = new Html5Qrcode(scannerContainerId);
      html5QrcodeRef.current = html5Qrcode;

      const qrConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5Qrcode.start(
        { facingMode: 'environment' },
        qrConfig,
        (decodedText) => {
          handleCodeDetected(decodedText);
        },
        () => {
          // Scanning frame error, ignore
        }
      );

      setScannerActive(true);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setScannerActive(false);
      setCameraError(
        'No se pudo acceder a la cámara. Por favor otorgá permisos de cámara o probá los botones de escaneo de prueba.'
      );
    }
  };

  // Stop Scanner
  const stopCamera = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
      } catch (err) {
        console.warn('Error stopping camera:', err);
      } finally {
        html5QrcodeRef.current = null;
        setScannerActive(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setScannedProduct(null);
      setNotFoundCode(null);
      setLastScannedCode(null);
      setAddedSuccess(false);

      // Timeout to ensure DOM container is mounted before starting camera
      const timer = setTimeout(() => {
        startCamera();
      }, 300);

      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleCodeDetected(manualCode);
  };

  const handleAddToCartScanned = () => {
    if (!scannedProduct) return;
    onAddToCart(scannedProduct, quantity, globalWholesaleMode);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1500);
  };

  // Demo Barcodes for Instant Desktop Testing
  const sampleBarcodes = [
    { code: 'KOA-DES-01', name: 'Bolsas Camiseta' },
    { code: 'KOA-COT-01', name: 'Globos Perla' },
    { code: 'KOA-REP-01', name: 'Dulce de Leche' },
    { code: 'KOA-ENV-01', name: 'Potes PET' },
    { code: 'KOA-LIB-01', name: 'Cinta Embalaje' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner shrink-0">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold font-fredoka tracking-wide truncate">
                  Escáner de Código & QR
                </h3>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-white/25 text-white tracking-wider">
                  Koala Barcode
                </span>
              </div>
              <p className="text-xs text-orange-100 truncate">
                Apuntá con tu cámara al código de barra o QR para sumar al carrito
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Cerrar escáner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-900 dark:text-white">
          
          {/* Camera Scan Viewport Container */}
          <div className="relative rounded-2xl bg-slate-950 overflow-hidden border-2 border-slate-800 aspect-4/3 flex flex-col items-center justify-center text-center shadow-inner">
            <div id={scannerContainerId} className="w-full h-full object-cover" />

            {/* Overlay Scanner Laser Animation Effect */}
            {scannerActive && !scannedProduct && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-56 h-56 border-2 border-dashed border-orange-500/80 rounded-2xl relative flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  {/* Laser Beam Motion Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce shadow-md" />
                  
                  {/* Corner Targets */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-400 rounded-tl-md" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-400 rounded-tr-md" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-400 rounded-bl-md" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-400 rounded-br-md" />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                  Alineá el código de barras dentro del recuadro
                </span>
              </div>
            )}

            {/* Camera Error or Off State */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center space-y-3">
                <CameraOff className="w-10 h-10 text-rose-500/80" />
                <p className="text-xs text-slate-300 max-w-xs">{cameraError}</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Reintentar Encender Cámara</span>
                </button>
              </div>
            )}
          </div>

          {/* Scanned Product Match Card */}
          {scannedProduct ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/40 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>¡Producto Encontrado!</span>
                </span>
                <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Código: {lastScannedCode}
                </span>
              </div>

              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                  {scannedProduct.image ? (
                    <img src={scannedProduct.image} alt={scannedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {scannedProduct.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Rubro: <strong className="text-slate-800 dark:text-slate-200 capitalize">{scannedProduct.category}</strong>
                  </div>
                  <div className="text-base font-black font-fredoka text-orange-600 dark:text-orange-400">
                    {formatCurrency(globalWholesaleMode ? (scannedProduct.wholesalePrice || Math.round(scannedProduct.price * 0.85)) : scannedProduct.price)}
                    <span className="text-[10px] font-normal text-slate-500 ml-1">
                      {globalWholesaleMode ? 'x Bulto' : 'x Unid.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Add Button */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-emerald-500/20">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCartScanned}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white scale-98'
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30 active:scale-95'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>¡Añadido al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Agregar al Cotizador ({quantity})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : notFoundCode ? (
            /* Not Found Alert */
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">No encontramos un producto con código: <strong className="font-mono">{notFoundCode}</strong></span>
              </div>
              <button
                onClick={() => setNotFoundCode(null)}
                className="text-[11px] font-bold text-rose-700 dark:text-rose-400 hover:underline shrink-0"
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {/* Quick Demo Test Barcodes Grid for Desktop & Fast Testing */}
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Escaneo de Prueba Rápida (1-Click):</span>
              </span>
              <span className="text-[10px] text-slate-400">Ideal para prueba sin cámara</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sampleBarcodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleCodeDetected(item.code)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-orange-400 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold group-hover:scale-105 transition-transform">
                    {item.code}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Barcode Input Form */}
          <form onSubmit={handleManualSearch} className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Ingresar o Pegar Código Manualmente:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ej: KOA-DES-01, 77912345678..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Buscar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
