import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  ChevronRight,
  Factory,
  Gift
} from 'lucide-react';
import { BranchInfo } from '../types';
import { KoalaLogo } from './KoalaLogo';

interface FooterProps {
  branches: BranchInfo[];
  onScrollToSection: (sectionId: string) => void;
  onOpenLoyaltyModal?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ branches, onScrollToSection, onOpenLoyaltyModal, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-2xl inline-block shadow-sm">
              <KoalaLogo size="md" />
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Fabricación de polietileno de alta y baja densidad. Distribución integral de descartables gastronómicos, cotillón, repostería, envases PET y bolsas comerciales en el Alto Valle.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-800/80">
                <Factory className="w-3.5 h-3.5 text-orange-500" />
                <span>Venta Mayorista y Minorista</span>
              </span>
            </div>
          </div>

          {/* Col 2: General Roca */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider text-orange-400">
              General Roca (Casa Central)
            </h4>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Av. Roca 1350, (8332) General Roca, Río Negro</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:02984436639" className="hover:text-white transition-colors">
                  Tel: (0298) 443-6639
                </a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <a 
                  href="https://wa.me/5492984536376" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: 298 453-6376
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>lpsrlmilton@lpsrl.com.ar</span>
              </div>
            </div>
          </div>

          {/* Col 3: Neuquén */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider text-orange-400">
              Neuquén Capital (Sucursal)
            </h4>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Mitre 678, (8300) Neuquén Capital</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:02994433960" className="hover:text-white transition-colors">
                  Tel: (0299) 443-3960
                </a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <a 
                  href="https://wa.me/5492995093911" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: 299 509-3911
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 shrink-0" />
                <span>nqn@koalalotiene.com.ar</span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider">
              Categorías & Fidelidad
            </h4>
            <ul className="space-y-2">
              {onOpenLoyaltyModal && (
                <li>
                  <button 
                    onClick={onOpenLoyaltyModal}
                    className="hover:text-amber-400 text-amber-300 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Club Koala (Puntos y Sellos)</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Bolsas & Film Stretch Polietileno</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Descartables para Gastronomía</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Cotillón & Repostería</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Envases Plásticos PET</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="text-center md:text-left space-y-0.5">
            <div className="font-medium text-slate-300">
              © {new Date().getFullYear()} Koala Lo Tiene SRL • CUIT 30-71458921-3 • Río Negro y Neuquén
            </div>
            <div className="text-slate-500">
              Fabricación en General Roca • Atención en locales y envíos a todo el Alto Valle
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
            <a 
              href="/dossier" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/dossier');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-orange-600/90 text-slate-300 hover:text-white font-semibold transition-all border border-slate-800 hover:border-orange-500/50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Abrir Dossier Comercial & Propuesta 2026"
            >
              <span>📄 Dossier Oficial</span>
            </a>
            <button
              type="button"
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.history.pushState({}, '', '/admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold transition-all border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Acceso al Panel de Administración & ERP"
            >
              <span>🔒 Panel Admin & ERP</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 font-medium">koalalotiene.com.ar</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
