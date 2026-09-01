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
  Layers
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  cartQuantity,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isWholesaleMode, setIsWholesaleMode] = React.useState(false);
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  // Auto check wholesale if quantity meets threshold
  const isWholesaleEligible = product.wholesalePrice && product.wholesaleMinPack;

  const handleAdd = () => {
    onAddToCart(product, quantity, isWholesaleMode);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const currentPrice = isWholesaleMode && product.wholesalePrice 
    ? product.wholesalePrice 
    : product.price;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Card Body */}
      <div className="p-5 space-y-3">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
          {product.isManufacturer && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[11px] font-extrabold">
              <Factory className="w-3 h-3 text-orange-600" />
              Fabricación Koala
            </span>
          )}

          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Más Vendido
            </span>
          )}

          {product.wholesalePrice && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <Tag className="w-3 h-3 text-emerald-600" />
              Opción Mayorista
            </span>
          )}

          {product.isNew && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
              Nuevo
            </span>
          )}
        </div>

        {/* Product Name */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            {product.subcategory}
          </span>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Packaging detail */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 p-2 rounded-xl">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span>Presentación: <strong className="text-slate-800">{product.unit}</strong></span>
        </div>

        {/* Wholesale Switcher if available */}
        {isWholesaleEligible && (
          <div className="pt-1">
            <button
              onClick={() => {
                const newMode = !isWholesaleMode;
                setIsWholesaleMode(newMode);
                if (newMode && product.wholesaleMinPack && quantity < product.wholesaleMinPack) {
                  setQuantity(product.wholesaleMinPack);
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                isWholesaleMode 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Layers className={`w-3.5 h-3.5 ${isWholesaleMode ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Modo Venta Mayorista ({product.wholesaleMinPack}+ packs)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-extrabold ${
                isWholesaleMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {isWholesaleMode ? 'Activo' : 'Activar'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Card Footer: Pricing & Quantity Selector */}
      <div className="p-5 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-3">
        {/* Pricing Display */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900 font-fredoka">
              {formatCurrency(currentPrice)}
            </div>
            {isWholesaleMode && product.wholesalePrice ? (
              <span className="text-[11px] font-bold text-emerald-600 block">
                Precio Mayorista aplicable (Mínimo {product.wholesaleMinPack} packs)
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                Por {product.unit}
              </span>
            )}
          </div>

          {cartQuantity > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-extrabold">
              En lista: {cartQuantity}
            </span>
          )}
        </div>

        {/* Quantity Controls & Add Button */}
        <div className="flex items-center gap-2">
          {/* Quantity Spinner */}
          <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-2 text-xs font-bold text-slate-800 min-w-[32px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all ${
              addedAnimation 
                ? 'bg-emerald-600 text-white scale-98' 
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20'
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
    </div>
  );
};
