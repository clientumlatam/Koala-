import React from 'react';
import { 
  Search, 
  X, 
  Factory, 
  Tag, 
  Sparkles, 
  Layers,
  LayoutGrid,
  PackageCheck,
  UtensilsCrossed,
  PartyPopper,
  Cake,
  SprayCan,
  BookOpen,
  Coffee
} from 'lucide-react';
import { CategoryId, CategoryInfo, Product } from '../types';
import { ProductCard } from './ProductCard';
import { KoalaLogo } from './KoalaLogo';
import { normalizeSearchText } from '../utils/helpers';

interface ProductCatalogProps {
  categories: CategoryInfo[];
  products: Product[];
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
  cartItemsMap: Record<string, number>;
  onOpenAi: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  cartItemsMap,
  onOpenAi,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchGlobally, setSearchGlobally] = React.useState(true);
  const [filterManufacturer, setFilterManufacturer] = React.useState(false);
  const [filterWholesale, setFilterWholesale] = React.useState(false);
  const [filterBestSeller, setFilterBestSeller] = React.useState(false);

  // Filter products logic
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      // If user has typed a search query and searchGlobally is true, search across all categories
      const activeSearch = normalizeSearchText(searchQuery);
      
      if (!activeSearch || !searchGlobally) {
        // Category filter applies when no active search OR explicitly searching inside category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
      }

      // Quick badges filter
      if (filterManufacturer && !p.isManufacturer) return false;
      if (filterWholesale && !p.wholesalePrice) return false;
      if (filterBestSeller && !p.isBestSeller) return false;

      // Text search query (accent-insensitive & case-insensitive)
      if (activeSearch) {
        const matchName = normalizeSearchText(p.name).includes(activeSearch);
        const matchDesc = normalizeSearchText(p.description).includes(activeSearch);
        const matchSubcat = normalizeSearchText(p.subcategory).includes(activeSearch);
        const matchTags = p.tags.some((t) => normalizeSearchText(t).includes(activeSearch));
        return matchName || matchDesc || matchSubcat || matchTags;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, searchGlobally, filterManufacturer, filterWholesale, filterBestSeller]);

  // Count matches in current category vs all
  const categoryMatchCount = React.useMemo(() => {
    const q = normalizeSearchText(searchQuery);
    if (!q) return 0;
    return products.filter(p => p.category === selectedCategory && (
      normalizeSearchText(p.name).includes(q) ||
      normalizeSearchText(p.description).includes(q) ||
      normalizeSearchText(p.subcategory).includes(q) ||
      p.tags.some(t => normalizeSearchText(t).includes(q))
    )).length;
  }, [products, selectedCategory, searchQuery]);

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'PackageCheck': return <PackageCheck className="w-4 h-4" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'PartyPopper': return <PartyPopper className="w-4 h-4" />;
      case 'Cake': return <Cake className="w-4 h-4" />;
      case 'SprayCan': return <SprayCan className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <section id="catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block mb-1">
            Catálogo Oficial Koala Lo Tiene
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-fredoka text-slate-900 dark:text-white">
            Explorá por Categoría o Buscador
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Precios actualizados para General Roca y Neuquén. Descuentos por volumen y bulto cerrado.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600 dark:text-orange-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscador global: producto, bolsa, vasitos, cotillón..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span>
                Buscando globalmente en los {products.length} productos
              </span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSearchGlobally(!searchGlobally)}
                  className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                >
                  {searchGlobally ? 'Filtrar solo en categoría actual' : 'Buscar en todo el catálogo'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Categories Pills bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 dark:bg-orange-600 text-white border-slate-900 dark:border-orange-600 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className={isActive ? 'text-orange-400 dark:text-white' : 'text-slate-400 dark:text-slate-400'}>
                {getCategoryIcon(cat.iconName)}
              </span>
              <span>{cat.name}</span>
              {cat.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 dark:bg-slate-700 text-orange-800 dark:text-orange-300'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Query Active Feedback Banner */}
      {searchQuery.trim() !== '' && (
        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-orange-900 dark:text-orange-200 font-medium">
            <Search className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <span>
              Resultados de búsqueda en tiempo real para: <strong className="font-extrabold text-orange-700 dark:text-orange-300">"{searchQuery}"</strong> ({filteredProducts.length} coincidencia{filteredProducts.length === 1 ? '' : 's'})
            </span>
          </div>

          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-300 rounded-xl font-bold text-[11px] hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar Búsqueda
          </button>
        </div>
      )}

      {/* Quick Filter Badges Bar */}
      <div id="wholesale" className="flex flex-wrap items-center justify-between gap-3 bg-slate-100/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Filtros Rápidos:</span>
          <button
            onClick={() => setFilterManufacturer(!filterManufacturer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterManufacturer
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Fabricación Propia Koala</span>
          </button>

          <button
            onClick={() => setFilterWholesale(!filterWholesale)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterWholesale
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Precios Mayoristas</span>
          </button>

          <button
            onClick={() => setFilterBestSeller(!filterBestSeller)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterBestSeller
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Más Vendidos</span>
          </button>

          {(filterManufacturer || filterWholesale || filterBestSeller || searchQuery) && (
            <button
              onClick={() => {
                setFilterManufacturer(false);
                setFilterWholesale(false);
                setFilterBestSeller(false);
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold underline-offset-2 ml-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Mostrando <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> de {products.length} productos
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              cartQuantity={cartItemsMap[product.id] || 0}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 max-w-lg mx-auto space-y-4">
          <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/40 rounded-full flex items-center justify-center mx-auto p-2 border border-orange-200 dark:border-orange-900/50">
            <KoalaLogo size="sm" variant="mascot-only" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-fredoka">
            No encontramos productos con esos filtros
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Podés probar buscando otro término o consultar con nuestro Asesor Virtual AI para verificar disponibilidad en stock de General Roca o Neuquén.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                setFilterManufacturer(false);
                setFilterWholesale(false);
                setFilterBestSeller(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Restablecer Filtros
            </button>
            <button
              onClick={onOpenAi}
              className="px-4 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 shadow-sm"
            >
              Consultar al Asesor AI
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
