import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingCart, X } from 'lucide-react';

export interface CartToastItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  isWholesale?: boolean;
}

interface CartToastProps {
  toast: CartToastItem | null;
  branchCity: string;
  onClose: () => void;
  onOpenCart: () => void;
}

export const CartToast: React.FC<CartToastProps> = ({
  toast,
  branchCity,
  onClose,
  onOpenCart,
}) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-50 bg-slate-950/95 backdrop-blur-md text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3.5 max-w-sm sm:max-w-md"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs font-semibold text-slate-200 truncate">
              <strong className="text-white">+{toast.quantity} {toast.unit}</strong> de {toast.productName}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>Agregado al pedido</span>
              <span>•</span>
              <span className="text-orange-400 font-medium">Sucursal {branchCity}</span>
              {toast.isWholesale && (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] px-1 py-0.2 rounded font-bold">
                  Mayorista
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Ver Carrito</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
