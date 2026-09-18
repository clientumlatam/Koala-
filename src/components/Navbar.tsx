import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  ShoppingCart, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  Building2,
  MessageCircle,
  Menu,
  X,
  Zap,
  Gift,
  Award,
  Star
} from 'lucide-react';
import { BranchId, BranchInfo, EmployeeUser, LoyaltyProfile } from '../types';
import { checkStoreStatus } from '../utils/helpers';
import { KoalaLogo } from './KoalaLogo';
import { InstitutionalPageType } from './InstitutionalPageModal';

interface NavbarProps {
  currentBranch: BranchInfo;
  allBranches: BranchInfo[];
  onSelectBranch: (branchId: BranchId) => void;
  cartCount: number;
  currentUser?: EmployeeUser | null;
  onOpenCart: () => void;
  onOpenAi?: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onOpenLoyaltyModal: () => void;
  loyaltyProfile?: LoyaltyProfile | null;
  onScrollToSection: (sectionId: string) => void;
  onOpenDossier?: () => void;
  onOpenInstitutional?: (page: InstitutionalPageType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBranch,
  allBranches,
  onSelectBranch,
  cartCount,
  currentUser,
  onOpenCart,
  onOpenAi,
  onOpenAdmin,
  onOpenLogin,
  onOpenLoyaltyModal,
  loyaltyProfile,
  onScrollToSection,
  onOpenDossier,
  onOpenInstitutional,
}) => {
  const [showBranchMenu, setShowBranchMenu] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const status = checkStoreStatus();

  // Cart Shake & Visual Feedback Animation
  const [isShaking, setIsShaking] = React.useState(false);
  const [showAddedBadge, setShowAddedBadge] = React.useState(false);
  const prevCartCountRef = React.useRef(cartCount);

  React.useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsShaking(true);
      setShowAddedBadge(true);

      const shakeTimer = setTimeout(() => setIsShaking(false), 650);
      const badgeTimer = setTimeout(() => setShowAddedBadge(false), 1600);

      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(badgeTimer);
      };
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      {/* Top Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-y-1 gap-x-4">
          {/* Status badge & Hours */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border ${status.badgeColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {status.statusText}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{status.nextChangeText}</span>
            </span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="hidden lg:inline text-slate-400">
              Casa Central en Gral. Roca & Salón Neuquén Capital
            </span>
          </div>

          {/* Quick contact and utility links */}
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <a 
              href={`https://wa.me/${currentBranch.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" />
              <span>WhatsApp {currentBranch.city}: <strong className="text-white font-bold">{currentBranch.whatsappFormatted}</strong></span>
            </a>
            <span className="hidden sm:inline text-slate-700">•</span>
            <a 
              href={`tel:${currentBranch.phone.replace(/\D/g, '')}`}
              className="hidden sm:flex items-center gap-1 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{currentBranch.phone}</span>
            </a>
            <span className="hidden md:inline text-slate-700">•</span>
            <button
              onClick={onOpenLoyaltyModal}
              className="hidden md:flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
            >
              <Gift className="w-3 h-3" />
              <span>Club Puntos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            className="flex items-center cursor-pointer py-1 shrink-0" 
            onClick={() => onScrollToSection('hero')}
            title="Koala Lo Tiene - Inicio"
          >
            <KoalaLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold text-slate-700">
            <button 
              onClick={() => onScrollToSection('catalog')} 
              className="hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Catálogo
            </button>
            <button 
              onClick={() => {
                if (onOpenInstitutional) onOpenInstitutional('ofertas');
              }} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Ofertas</span>
              <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wide">
                Bulto
              </span>
            </button>
            <button 
              onClick={() => {
                if (onOpenInstitutional) onOpenInstitutional('servicio-tecnico');
              }} 
              className="hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Fábrica & Medida
            </button>
            <button 
              onClick={() => onScrollToSection('locations')} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Sucursales</span>
            </button>
            <button 
              onClick={() => {
                if (onOpenInstitutional) onOpenInstitutional('faq');
              }} 
              className="hover:text-orange-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              FAQ / Ayuda
            </button>
            <button 
              onClick={onOpenLoyaltyModal} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1 text-orange-600 font-bold cursor-pointer whitespace-nowrap"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Club Koala</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Prominent Multi-Branch Selector (General Roca vs 4 Sucursales Neuquén) */}
            <div className="relative">
              <button
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50/90 hover:bg-orange-100/90 text-orange-950 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                title="Cambiar sucursal de compra (General Roca o 4 sedes Neuquén Capital)"
                aria-expanded={showBranchMenu}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-orange-600/80 font-extrabold uppercase tracking-wider block sm:inline mr-1">
                    {currentBranch.id === 'roca' ? 'Casa Central' : 'Sede NQN'}
                  </span>
                  <span className="font-black text-slate-900">
                    {currentBranch.shortName || currentBranch.city}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-orange-700 shrink-0 transition-transform ${showBranchMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showBranchMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowBranchMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 overflow-hidden"
                    >
                      <div className="px-4 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">
                            📍 Seleccionar Sucursal de Compra
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Precios y stock en tiempo real por depósito
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          5 Puntos de Venta
                        </span>
                      </div>

                      {/* General Roca Section */}
                      <div className="px-3 pb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
                          Río Negro (Casa Central & Fábrica)
                        </span>
                        {allBranches.filter(b => b.id === 'roca').map(b => (
                          <button
                            key={b.id}
                            onClick={() => {
                              onSelectBranch(b.id);
                              setShowBranchMenu(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start justify-between transition-all cursor-pointer mt-1 ${
                              b.id === currentBranch.id
                                ? 'bg-orange-50 border border-orange-200 text-orange-950 font-bold shadow-2xs'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                <span>{b.name}</span>
                                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                                  {b.depotCode || 'DEP-01'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-orange-500" />
                                <span>{b.address} • {b.city}</span>
                              </div>
                            </div>
                            {b.id === currentBranch.id && (
                              <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black">
                                Activa
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Neuquén Capital Section (4 branches) */}
                      <div className="px-3 pt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
                          Neuquén Capital (4 Sucursales Comerciales)
                        </span>
                        <div className="space-y-1 mt-1 max-h-60 overflow-y-auto pr-1">
                          {allBranches.filter(b => b.id !== 'roca').map(b => (
                            <button
                              key={b.id}
                              onClick={() => {
                                onSelectBranch(b.id);
                                setShowBranchMenu(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start justify-between transition-all cursor-pointer ${
                                b.id === currentBranch.id
                                  ? 'bg-orange-50 border border-orange-200 text-orange-950 font-bold shadow-2xs'
                                  : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                  <span>{b.name}</span>
                                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                                    {b.depotCode || 'DEP-02'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-blue-500" />
                                  <span>{b.address} • {b.city}</span>
                                </div>
                              </div>
                              {b.id === currentBranch.id ? (
                                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black">
                                  Activa
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-semibold group-hover:text-slate-600">
                                  Elegir
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="px-4 pt-2.5 mt-2 border-t border-slate-100 text-[10.5px] text-slate-500 flex items-center justify-between">
                        <span>Traspaso inter-sucursal sin costo en 24h</span>
                        <button
                          onClick={() => {
                            setShowBranchMenu(false);
                            onScrollToSection('locations');
                          }}
                          className="text-orange-600 font-bold hover:underline cursor-pointer"
                        >
                          Ver mapa completo →
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Loyalty Club Profile Button */}
            <button
              onClick={onOpenLoyaltyModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-950 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              title="Mi Cuenta Club Koala: Puntos y Tarjeta Digital"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                {loyaltyProfile ? `${loyaltyProfile.pointsBalance} pts` : 'Club Koala'}
              </span>
              {loyaltyProfile && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px] font-black shrink-0">
                  {loyaltyProfile.punchCardStamps}/6
                </span>
              )}
            </button>

            {/* Cart Button */}
            <motion.button
              onClick={onOpenCart}
              whileTap={{ scale: 0.92 }}
              animate={
                isShaking
                  ? {
                      scale: [1, 1.28, 0.88, 1.18, 0.94, 1.06, 1],
                      rotate: [0, -14, 14, -9, 9, -4, 0],
                      backgroundColor: ['#0f172a', '#ea580c', '#0f172a'],
                    }
                  : {}
              }
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="relative p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Ver Carrito de Compras"
            >
              <AnimatePresence>
                {isShaking && (
                  <motion.span
                    initial={{ opacity: 0.9, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 1.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65 }}
                    className="absolute inset-0 rounded-xl border-2 border-orange-500 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <ShoppingCart className="w-4.5 h-4.5" />

              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                >
                  {cartCount}
                </motion.span>
              )}

              <AnimatePresence>
                {showAddedBadge && (
                  <motion.span
                    initial={{ opacity: 0, y: 12, scale: 0.7 }}
                    animate={{ opacity: 1, y: 38, scale: 1 }}
                    exit={{ opacity: 0, y: 48, scale: 0.7 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full right-0 bg-orange-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap shadow-xl border border-orange-400 flex items-center gap-1 z-50 pointer-events-none"
                  >
                    <span>✨ ¡Producto agregado!</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2.5">
          <button
            onClick={() => {
              onScrollToSection('catalog');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-slate-800 hover:text-orange-600 flex items-center justify-between"
          >
            <span>📦 Catálogo de Productos</span>
          </button>
          <button
            onClick={() => {
              if (onOpenInstitutional) onOpenInstitutional('ofertas');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-rose-600 hover:text-rose-700 flex items-center justify-between"
          >
            <span>🔥 Ofertas y Bulto Cerrado</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">Descuentos</span>
          </button>
          <button
            onClick={() => {
              if (onOpenInstitutional) onOpenInstitutional('servicio-tecnico');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-slate-800 hover:text-orange-600"
          >
            🏭 Fábrica & Medidas Especiales
          </button>
          <button
            onClick={() => {
              onOpenLoyaltyModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-amber-700 hover:text-amber-800 flex items-center gap-2"
          >
            <Gift className="w-4 h-4 text-amber-500" />
            <span>🎁 Club Koala (Puntos y Tarjeta Digital)</span>
          </button>
          <button
            onClick={() => {
              onScrollToSection('locations');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-slate-800 hover:text-orange-600"
          >
            📍 Sucursales (Roca / Neuquén)
          </button>
          <button
            onClick={() => {
              if (onOpenInstitutional) onOpenInstitutional('faq');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-slate-800 hover:text-orange-600"
          >
            ❓ Preguntas Frecuentes (FAQ)
          </button>
          <button
            onClick={() => {
              if (onOpenInstitutional) onOpenInstitutional('contacto');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-slate-800 hover:text-orange-600"
          >
            📞 Contacto & Consultas
          </button>
          <button
            onClick={() => {
              if (onOpenInstitutional) onOpenInstitutional('arrepentimiento');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 font-bold text-rose-600 hover:text-rose-700 text-xs flex items-center gap-1.5"
          >
            <span>↩️ Botón de Arrepentimiento (Ley 24.240)</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 text-white font-bold text-xs text-center cursor-pointer"
            >
              🔒 Panel Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
