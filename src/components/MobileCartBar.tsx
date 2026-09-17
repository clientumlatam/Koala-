import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface MobileCartBarProps {
  cartCount: number;
  cartTotal: number;
  branchCity: string;
  onOpenCart: () => void;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({
  cartCount,
  cartTotal,
  branchCity,
  onOpenCart,
}) => {
  if (cartCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 px-4 shadow-2xl safe-bottom"
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Cart Info Summary */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-600/40">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-orange-700 rounded-full font-black text-[11px] flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </div>

            <div className="truncate">
              <div className="text-white font-extrabold text-sm tracking-tight truncate">
                {formatCurrency(cartTotal)}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{cartCount} {cartCount === 1 ? 'producto' : 'productos'} • Suc. {branchCity}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenCart}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Ver Carrito</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
