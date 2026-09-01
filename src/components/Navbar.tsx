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
  Zap
} from 'lucide-react';
import { BranchId, BranchInfo, EmployeeUser } from '../types';
import { checkStoreStatus } from '../utils/helpers';

interface NavbarProps {
  currentBranch: BranchInfo;
  allBranches: BranchInfo[];
  onSelectBranch: (branchId: BranchId) => void;
  cartCount: number;
  currentUser?: EmployeeUser | null;
  onOpenCart: () => void;
  onOpenAi: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onScrollToSection: (sectionId: string) => void;
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
  onScrollToSection,
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
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.badgeColor}`}>
              <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {status.statusText}
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {status.nextChangeText}
            </span>
          </div>

          {/* Contact quick links & Admin Panel button */}
          <div className="flex items-center gap-3 text-slate-300">
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white transition-all font-black text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer animate-pulse"
              title="Abrir Demostración Transaccional en Vivo (CRM -> Depósito -> Facturación AFIP -> Despacho SLA)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
              <span>🚀 DEMO EN VIVO: Flujo 5 Departamentos & ISO</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all font-bold text-[11px] flex items-center gap-1 border border-slate-700 cursor-pointer"
              title="Acceso Empleados / Panel Admin ERP"
            >
              <span>🔒 /admin</span>
            </button>
            <span className="text-slate-600">•</span>
            <a 
              href={`https://wa.me/${currentBranch.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span>WhatsApp {currentBranch.city}: <strong className="text-white">{currentBranch.whatsappFormatted}</strong></span>
            </a>
            <span className="hidden md:inline text-slate-600">•</span>
            <a 
              href={`tel:${currentBranch.phone.replace(/\D/g, '')}`}
              className="hidden md:flex items-center gap-1 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>Tel: {currentBranch.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onScrollToSection('hero')}>
            {/* Koala Mascot Visual Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden group">
                <span className="text-2xl font-black text-orange-600 font-fredoka tracking-tighter">K</span>
                <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-emerald-500 text-white px-1 rounded-tl-md">
                  Roca/Nqn
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black font-fredoka text-slate-900 tracking-wide">
                  Koala <span className="text-orange-600">Lo tiene!</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 hidden sm:block">
                Polietileno • Descartables • Cotillón • Repostería
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button 
              onClick={() => onScrollToSection('catalog')} 
              className="hover:text-orange-600 transition-colors"
            >
              Catálogo de Productos
            </button>
            <button 
              onClick={() => onScrollToSection('wholesale')} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
            >
              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-bold">
                Mayorista
              </span>
              Venta por Bulto
            </button>
            <button 
              onClick={() => onScrollToSection('locations')} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              Locales y Mapas
            </button>
            <button 
              onClick={onOpenAdmin} 
              className="hover:text-orange-600 transition-colors flex items-center gap-1 text-slate-600"
              title="Ir a la ruta dedicada /admin del Panel ERP"
            >
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                /admin
              </span>
              Hub ERP
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Branch Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all"
                title="Cambiar sucursal activa"
              >
                <Building2 className="w-4 h-4 text-orange-600" />
                <span className="hidden sm:inline">{currentBranch.city}</span>
                <span className="sm:hidden">{currentBranch.id.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showBranchMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Seleccionar Sucursal
                  </div>
                  {allBranches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBranch(b.id);
                        setShowBranchMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                        b.id === currentBranch.id
                          ? 'bg-orange-50 text-orange-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{b.name}</div>
                        <div className="text-[11px] text-slate-500">{b.address}</div>
                      </div>
                      {b.id === currentBranch.id && (
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin ERP Button / User Status */}
            {currentUser ? (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                title={`Panel ERP activo (${currentUser.name} - ${currentUser.role})`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 text-orange-300 font-extrabold text-[10px] flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden xl:inline">{currentUser.name.split(' ')[0]}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-900/60 text-[9px] uppercase font-mono">
                  {currentUser.role}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Acceso de Personal & ERP"
              >
                <Building2 className="w-4 h-4 text-orange-400" />
                <span className="hidden xl:inline">Acceso Empleados / ERP</span>
              </button>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAi}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">Asesor AI Koala</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Cart / Presupuestador Button with Shake Feedback */}
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
              className="relative p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md flex items-center justify-center cursor-pointer"
              aria-label="Ver Cotizador de Productos"
            >
              {/* Expanding Outer Ring on Addition */}
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

              <ShoppingCart className="w-5 h-5" />

              {/* Counter Badge with scale transition */}
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}

              {/* Floating +1 / Added Visual Toast */}
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
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <button
            onClick={() => {
              onScrollToSection('catalog');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-bold text-slate-800 hover:text-orange-600"
          >
            📦 Catálogo de Productos
          </button>
          <button
            onClick={() => {
              onScrollToSection('wholesale');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-bold text-slate-800 hover:text-orange-600"
          >
            🏭 Fabricación y Venta Mayorista
          </button>
          <button
            onClick={() => {
              onScrollToSection('locations');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-bold text-slate-800 hover:text-orange-600"
          >
            📍 Sucursales (Roca / Neuquén)
          </button>
          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-bold text-orange-600 hover:text-orange-700 flex items-center justify-between border-t border-slate-100 pt-3"
          >
            <span>🔒 Panel de Control & ERP Hub</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">
              /admin
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
