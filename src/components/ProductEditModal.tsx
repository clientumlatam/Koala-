import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  Layers,
  Building2,
  Check,
  AlertCircle,
  Sparkles,
  Factory,
  Flame,
  Plus
} from 'lucide-react';
import { ProductInventoryRecord, CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { formatCurrency } from '../utils/helpers';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductInventoryRecord | null;
  isNew?: boolean;
  onSave: (updatedProduct: ProductInventoryRecord) => void;
  onDelete?: (productId: string) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  isNew = false,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<ProductInventoryRecord>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setTagsInput(product.tags ? product.tags.join(', ') : '');
      setImageError(false);
    } else if (isNew) {
      const newId = `koa-custom-${Date.now().toString().slice(-4)}`;
      setFormData({
        id: newId,
        sku: `KOA-PROD-${Math.floor(Math.random() * 900 + 100)}`,
        erpCode: `ERP-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: '',
        category: 'polietileno',
        subcategory: 'General',
        description: '',
        price: 1000,
        wholesalePrice: 850,
        wholesaleMinPack: 10,
        unit: 'Unidad',
        packageQuantity: 1,
        stockRoca: 50,
        stockNeuquen: 30,
        minStockAlert: 10,
        isBestSeller: false,
        isManufacturer: false,
        isNew: true,
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        tags: ['nuevo', 'koala'],
      });
      setTagsInput('nuevo, koala');
      setImageError(false);
    }
  }, [product, isNew, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProductInventoryRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagsInput(val);
    const parsedTags = val
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
    setFormData((prev) => ({ ...prev, tags: parsedTags }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }
    if (!formData.sku?.trim()) {
      alert('El código SKU es obligatorio.');
      return;
    }

    const finalProduct: ProductInventoryRecord = {
      id: formData.id || `koa-${Date.now()}`,
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      erpCode: formData.erpCode || formData.sku,
      category: (formData.category as CategoryId) || 'polietileno',
      subcategory: formData.subcategory || 'General',
      description: formData.description || '',
      price: Number(formData.price) || 0,
      wholesalePrice: formData.wholesalePrice ? Number(formData.wholesalePrice) : undefined,
      wholesaleMinPack: formData.wholesaleMinPack ? Number(formData.wholesaleMinPack) : undefined,
      unit: formData.unit || 'Unidad',
      packageQuantity: Number(formData.packageQuantity) || 1,
      stockRoca: Number(formData.stockRoca) || 0,
      stockNeuquen: Number(formData.stockNeuquen) || 0,
      minStockAlert: Number(formData.minStockAlert) || 10,
      isBestSeller: Boolean(formData.isBestSeller),
      isManufacturer: Boolean(formData.isManufacturer),
      isNew: Boolean(formData.isNew),
      image: formData.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : ['producto', 'koala'],
      lastErpSync: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
    };

    onSave(finalProduct);
    onClose();
  };

  const categoriesList = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-fredoka flex items-center gap-2">
                <span>{isNew ? 'Nuevo Producto en Catálogo' : 'Editar Producto'}</span>
                {!isNew && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {formData.sku}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Modificá precios, stock, descripción, rubro y fotografía sincronizada con la tienda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          
          {/* SECCIÓN 1: Identificación y Clasificación */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Layers className="w-4 h-4" />
              <span>1. Identificación General y Rubro</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Nombre Comercial del Producto <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: Bolsas Camiseta Blanca 40x50 cm Reforzadas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Código SKU Interno <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku || ''}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="Ej: KOA-POL-101"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Código ERP / Tango Gestión
                </label>
                <input
                  type="text"
                  value={formData.erpCode || ''}
                  onChange={(e) => handleChange('erpCode', e.target.value)}
                  placeholder="Ej: ERP-POL-001"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Rubro Comercial <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category || 'polietileno'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Subcategoría / Línea</label>
                <input
                  type="text"
                  value={formData.subcategory || ''}
                  onChange={(e) => handleChange('subcategory', e.target.value)}
                  placeholder="Ej: Bolsas de Polietileno"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Precios y Presentación */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <DollarSign className="w-4 h-4" />
              <span>2. Esquema de Precios y Presentación</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Precio Minorista ($ ARS)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Unidad o pack</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={formData.price ?? 0}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/50">
                <label className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                  <span>Precio Mayorista ($ ARS)</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Bulto Cerrado</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-600 dark:text-emerald-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.wholesalePrice ?? ''}
                    onChange={(e) => handleChange('wholesalePrice', e.target.value)}
                    placeholder="Ej: 2900"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-900 dark:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Mínimo Bulto Mayorista
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.wholesaleMinPack ?? 10}
                  onChange={(e) => handleChange('wholesaleMinPack', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Unidad de Venta / Renglón</label>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  placeholder="Ej: Paquete x 100 u. / Rollo 4.5kg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Unidades Contenidas por Pack</label>
                <input
                  type="number"
                  min="1"
                  value={formData.packageQuantity ?? 1}
                  onChange={(e) => handleChange('packageQuantity', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Stock Multi-Sucursal */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Building2 className="w-4 h-4" />
              <span>3. Niveles de Existencia Multi-Sucursal (Roca & Neuquén)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 bg-orange-50/60 dark:bg-orange-950/20 p-3 rounded-2xl border border-orange-200 dark:border-orange-900/50">
                <label className="font-bold text-orange-900 dark:text-orange-300 flex items-center justify-between">
                  <span>Stock Depósito Roca</span>
                  <span className="text-[10px] text-orange-600 font-bold">Mitre 642</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockRoca ?? 0}
                  onChange={(e) => handleChange('stockRoca', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-orange-300 dark:border-orange-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              <div className="space-y-1 bg-blue-50/60 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-200 dark:border-blue-900/50">
                <label className="font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between">
                  <span>Stock Salón Neuquén</span>
                  <span className="text-[10px] text-blue-600 font-bold">Sarmiento 235</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockNeuquen ?? 0}
                  onChange={(e) => handleChange('stockNeuquen', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Stock Mínimo de Alerta
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStockAlert ?? 10}
                  onChange={(e) => handleChange('minStockAlert', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Foto, Descripción y Atributos */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ImageIcon className="w-4 h-4" />
              <span>4. Fotografía, Descripción y Atributos Comercial</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Descripción Detallada del Producto
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Especificaciones técnicas, usos recomendados, calibres o materiales..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Imagen URL & Preview */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-orange-500" />
                        <span>URL de la Fotografía Oficial del Producto</span>
                      </label>
                      {product?.image && formData.image !== product.image && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageError(false);
                            handleChange('image', product.image);
                          }}
                          className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                        >
                          Restablecer foto original
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) => {
                        setImageError(false);
                        handleChange('image', e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Copiá y pegá cualquier enlace directo a la foto real del artículo (Unsplash, servidor de archivos o ERP).
                    </p>
                  </div>

                  {/* Live Image Preview Thumbnail */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 relative shadow-sm flex items-center justify-center p-1">
                      {formData.image && !imageError ? (
                        <img
                          src={formData.image}
                          alt="Vista previa"
                          referrerPolicy="no-referrer"
                          onError={() => setImageError(true)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-1 text-center text-[9px]">
                          <ImageIcon className="w-5 h-5 mb-1" />
                          <span>Sin foto</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">Vista Previa</span>
                  </div>
                </div>

                {/* Quick Real HD Presets Gallery */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Banco de Fotos Reales en Alta Definición por Rubro:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Bolsas Camiseta', url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Bolsas Consorcio', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Big Bags 1Tn', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Film Stretch', url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Vasos Descartables', url: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Vasos Térmicos', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Cotillón & Festivos', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Repostería / Moldes', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Envases PET / Gatillo', url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Resmas Librería A4', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Bazar / Herméticos', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setImageError(false);
                          handleChange('image', preset.url);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          formData.image === preset.url
                            ? 'bg-orange-500 text-white border-orange-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags / Search Terms */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  <span>Etiquetas de Búsqueda (separadas por coma)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="bolsas, polietileno, camiseta, comercio, fabrica"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Badges / Feature Toggles */}
              <div className="pt-2 flex flex-wrap items-center gap-4 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isManufacturer)}
                    onChange={(e) => handleChange('isManufacturer', e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5 text-orange-600" />
                    <span>Fabricación Propia Koala</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isBestSeller)}
                    onChange={(e) => handleChange('isBestSeller', e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Más Vendido</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isNew)}
                    onChange={(e) => handleChange('isNew', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>Producto Nuevo</span>
                  </span>
                </label>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {!isNew && onDelete && (
              <div>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Artículo</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
                    <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold">¿Confirmás eliminar?</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.id) onDelete(formData.id);
                        onClose();
                      }}
                      className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-[10px]"
                    >
                      Sí, Eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isNew ? 'Crear Producto' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
