import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  ArrowRight, 
  MapPin, 
  MessageCircle, 
  CheckCircle2, 
  Factory, 
  PackageCheck, 
  UtensilsCrossed, 
  PartyPopper, 
  Cake, 
  SprayCan, 
  BookOpen, 
  Coffee, 
  Layers,
  Sparkles,
  ExternalLink,
  Instagram,
  Percent
} from 'lucide-react';
import { BranchInfo, CategoryId } from '../types';
import { InstitutionalPageType } from './InstitutionalPageModal';

interface HeroBannerProps {
  currentBranch: BranchInfo;
  onScrollToCatalog: () => void;
  onScrollToLocations: () => void;
  onOpenAi: () => void;
  onSelectCategory?: (categoryId: CategoryId) => void;
  onOpenInstitutional?: (page: InstitutionalPageType) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentBranch,
  onScrollToCatalog,
  onScrollToLocations,
  onOpenAi,
  onSelectCategory,
  onOpenInstitutional,
}) => {
  const handleCategoryClick = (catId: CategoryId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    onScrollToCatalog();
  };

  return (
    <div className="w-full bg-white">
      {/* ========================================================================= */}
      {/* SECCIÓN 1 — HERO PRINCIPAL (Dividido 8 cols + 4 cols)                    */}
      {/* ========================================================================= */}
      <section id="hero" className="relative bg-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-800">
            
            {/* Columna Principal (8 columnas) */}
            <div className="lg:col-span-8 relative min-h-[480px] lg:min-h-[520px] flex items-center p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
              {/* Imagen de fondo con overlay */}
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80" 
                alt="Koala Lo Tiene - Fábrica y Distribución de Polietileno" 
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-25 filter contrast-125"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60 pointer-events-none" />

              {/* Contenido Textual */}
              <div className="relative z-10 max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 text-[11px] font-extrabold uppercase tracking-widest">
                  <Factory className="w-3.5 h-3.5 text-orange-500" />
                  <span>Fábrica de Polietileno & Distribuidora · Alto Valle</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-fredoka tracking-tight text-white leading-[1.05]">
                  Todo para tu comercio <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                    y tus eventos.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  Bolsas de polietileno, film stretch, insumos gastronómicos, descartables y cotillón para profesionales, comercios y el hogar en <strong>General Roca</strong> (Av. Roca 1350) y <strong>Neuquén Capital</strong> (Mitre 678).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={onScrollToCatalog}
                    className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Ver Catálogo & Ofertas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onScrollToLocations}
                    className="px-5 py-3.5 rounded-2xl border-2 border-white/80 hover:bg-white hover:text-slate-950 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Sucursales Roca & Nqn</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Columna Derecha: 2 Banners Apilados (4 columnas) */}
            <div className="lg:col-span-4 flex flex-col divide-y divide-slate-800">
              
              {/* Banner Superior: Polietileno & Big Bags */}
              <div 
                onClick={() => handleCategoryClick('polietileno')}
                className="relative flex-1 min-h-[240px] p-6 flex flex-col justify-end overflow-hidden group cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80" 
                  alt="Polietileno y Embalaje Koala" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-1.5">
                  <span className="text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
                    Directo de Fábrica
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-fredoka text-white group-hover:text-orange-300 transition-colors">
                    Polietileno & Big Bags 1 Tn
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <span>Bolsas camiseta, rollos y film stretch</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>

              {/* Banner Inferior: Descartables & Gastronomía */}
              <div 
                onClick={() => handleCategoryClick('descartables')}
                className="relative flex-1 min-h-[240px] p-6 flex flex-col justify-end overflow-hidden group cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
                  alt="Descartables y Gastronomía Koala" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-1.5">
                  <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest">
                    Gastronomía & Viandas
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-fredoka text-white group-hover:text-amber-300 transition-colors">
                    Descartables & Repostería
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <span>Potes térmicos, cajas de pizza y bandejas</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 2 — BARRA DE BENEFICIOS (Fondo Oscuro #0C0D0D)                   */}
      {/* ========================================================================= */}
      <section className="bg-[#0C0D0D] text-white py-5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            
            {/* Beneficio 1 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-orange-400 shrink-0 border border-slate-800">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Envíos al Alto Valle</h4>
                <p className="text-[11px] text-slate-400">Roca, Neuquén y ciudades vecinas</p>
              </div>
            </div>

            {/* Beneficio 2 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Garantía de Fábrica</h4>
                <p className="text-[11px] text-slate-400">Micrones reales y sellado industrial</p>
              </div>
            </div>

            {/* Beneficio 3 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400 shrink-0 border border-slate-800">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Cuotas sin Interés</h4>
                <p className="text-[11px] text-slate-400">BPN Confiable & 10% OFF transf.</p>
              </div>
            </div>

            {/* Beneficio 4 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-slate-800">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Asesoramiento Directo</h4>
                <p className="text-[11px] text-slate-400">Lun–Vie 8:30–12:30 y 16–20 hs</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 3 — BARRA DE CATEGORÍAS CON ÍCONOS                                */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-3.5 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-max">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'polietileno' as CategoryId, label: 'Polietileno', icon: PackageCheck },
              { id: 'descartables' as CategoryId, label: 'Descartables', icon: UtensilsCrossed },
              { id: 'cotillon' as CategoryId, label: 'Cotillón', icon: PartyPopper },
              { id: 'reposteria' as CategoryId, label: 'Repostería', icon: Cake },
              { id: 'envases' as CategoryId, label: 'Envases PET', icon: SprayCan },
              { id: 'libreria' as CategoryId, label: 'Librería', icon: BookOpen },
              { id: 'bazar' as CategoryId, label: 'Bazar', icon: Coffee },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors border border-transparent hover:border-orange-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-orange-600" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleCategoryClick('all')}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-extrabold transition-all hover:bg-slate-900 hover:text-white cursor-pointer ml-4 shrink-0"
          >
            Ver todo el catálogo →
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 5 — BANNER BPN CUOTAS SIN INTERÉS                                  */}
      {/* ========================================================================= */}
      <section className="py-8 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wide">
                    Beneficio Regional
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Banco Provincia del Neuquén</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-fredoka text-slate-900">
                  3 y 6 Cuotas sin Interés con BPN Confiable
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  Aprovechá la financiación con tarjetas de crédito BPN Confiable y Visa/Mastercard BPN en nuestras sucursales y cotizaciones web. Además, <strong>10% de descuento directo</strong> abonando por transferencia bancaria.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {onOpenInstitutional && (
                <button
                  onClick={() => onOpenInstitutional('ofertas')}
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Ver Promociones
                </button>
              )}
              <a
                href={`https://wa.me/${currentBranch.whatsapp}?text=Hola!%20Quiero%20consultar%20por%20las%20cuotas%20sin%20interes%20con%20BPN`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 6 — CATEGORÍAS PRINCIPALES (Banners Visuales)                     */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <p className="text-orange-600 text-xs font-extrabold uppercase tracking-widest">
              Nuestras Líneas de Fabricación y Distribución
            </p>
            <h2 className="text-3xl sm:text-4xl font-black font-fredoka text-slate-900">
              Categorías Principales
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Tarjeta 1: Polietileno */}
            <div 
              onClick={() => handleCategoryClick('polietileno')}
              className="group relative h-72 rounded-3xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80" 
                alt="Polietileno y Embalaje" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">Fabricación Propia</span>
                <h3 className="text-xl font-bold font-fredoka">Polietileno & Big Bags</h3>
                <p className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1">
                  <span>Ver bultos y bobinas</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </div>

            {/* Tarjeta 2: Descartables */}
            <div 
              onClick={() => handleCategoryClick('descartables')}
              className="group relative h-72 rounded-3xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=600&q=80" 
                alt="Descartables Gastronómicos" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Gastronomía y Rotiserías</span>
                <h3 className="text-xl font-bold font-fredoka">Descartables & Viandas</h3>
                <p className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1">
                  <span>Potes, vasos y bandejas</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </div>

            {/* Tarjeta 3: Cotillón */}
            <div 
              onClick={() => handleCategoryClick('cotillon')}
              className="group relative h-72 rounded-3xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80" 
                alt="Cotillón y Eventos" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">Cumpleaños y Fiestas</span>
                <h3 className="text-xl font-bold font-fredoka">Cotillón & Festejos</h3>
                <p className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1">
                  <span>Globos, cotillón y vajilla</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </div>

            {/* Tarjeta 4: Repostería */}
            <div 
              onClick={() => handleCategoryClick('reposteria')}
              className="group relative h-72 rounded-3xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" 
                alt="Repostería y Pastelería" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-wider">Insumos y Moldes</span>
                <h3 className="text-xl font-bold font-fredoka">Repostería & Pastelería</h3>
                <p className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1">
                  <span>Moldes, mangas y bases</span>
                  <ArrowRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 7 — FILOSOFÍA / INSTITUCIONAL ("Calidad. Volumen. Soluciones.")     */}
      {/* ========================================================================= */}
      <section className="bg-[#0C0D0D] text-white py-16 sm:py-20 px-4 text-center border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-orange-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <p className="text-orange-500 text-xs font-extrabold uppercase tracking-widest">
            ¿Por qué elegir Koala Lo Tiene?
          </p>

          <h2 className="text-4xl sm:text-6xl font-black font-fredoka leading-tight tracking-tight text-white">
            Calidad. <br className="sm:hidden" />
            Volumen. <br className="sm:hidden" />
            Soluciones.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            Más de una década acompañando a comercios, rotiserías, industrias y familias del Alto Valle con producción directa, abastecimiento continuo y atención personalizada.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {onOpenInstitutional && (
              <button
                onClick={() => onOpenInstitutional('contacto')}
                className="px-6 py-3.5 rounded-2xl border-2 border-orange-500 hover:bg-orange-500 hover:text-white text-orange-400 font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Contactanos
              </button>
            )}

            <button
              onClick={onScrollToLocations}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-lg"
            >
              Ver Sucursales
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 8 — MARCAS Y FABRICACIÓN DIRECTA                                   */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Trabajamos con primeras marcas y fabricación propia
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            <span className="font-fredoka font-bold text-2xl text-orange-600 tracking-wider">
              KOALA FÁBRICA
            </span>
            <span className="font-fredoka font-bold text-2xl text-slate-800 tracking-wider">
              BANDEX
            </span>
            <span className="font-fredoka font-bold text-2xl text-slate-800 tracking-wider">
              KEKOS
            </span>
            <span className="font-fredoka font-bold text-2xl text-slate-800 tracking-wider">
              PLASTISUR
            </span>
            <span className="font-fredoka font-bold text-2xl text-slate-800 tracking-wider">
              SELPLAST
            </span>
            <span className="font-fredoka font-bold text-2xl text-slate-800 tracking-wider">
              CAROL
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 10 — INSTAGRAM (@koalalotiene)                                    */}
      {/* ========================================================================= */}
      <section className="bg-[#491817] text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <Instagram className="w-8 h-8 text-white/50 mx-auto" />
          <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">
            Seguinos en Instagram · Alto Valle
          </p>
          <h3 className="text-3xl sm:text-4xl font-black font-fredoka text-white tracking-wide">
            @koalalotiene
          </h3>
          <p className="text-xs text-white/70 max-w-md mx-auto">
            Novedades semanales, ofertas por bulto, lanzamientos de fábrica y sorteos para nuestros clientes de General Roca y Neuquén.
          </p>
          <div className="pt-2">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-white/80 hover:bg-white hover:text-[#491817] text-white font-bold text-xs sm:text-sm transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>Seguir en Instagram</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
