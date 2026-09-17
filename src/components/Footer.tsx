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
}

export const Footer: React.FC<FooterProps> = ({ branches, onScrollToSection, onOpenLoyaltyModal }) => {
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

            <p className="text-slate-400 leading-relaxed">
              Fabricantes de polietileno, distribuidores de descartables gastronómicos, cotillón, repostería, envases PET y librería comercial.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-[11px] font-semibold border border-slate-800">
                <Factory className="w-3.5 h-3.5 text-orange-500" />
                Venta por Mayor y Menor
              </span>
            </div>
          </div>

          {/* Col 2: General Roca */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider text-orange-400">
              General Roca (Casa Central)
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Av. Roca 1350, (8332) General Roca, Río Negro</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Tel: (0298) 443-6639</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp: 298 453-6376</span>
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
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Mitre 678, (8300) Neuquén Capital</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Tel: (0299) 443-3960</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp: 299 509-3911</span>
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
                    className="hover:text-amber-400 text-amber-300 font-bold transition-colors flex items-center gap-1"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    Club Koala (Puntos y Sellos)
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Bolsas & Film Stretch Polietileno
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Descartables para Gastronomía
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Cotillón & Repostería
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection('catalog')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Envases Plásticos PET
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Koala Lo Tiene. Todos los derechos reservados. General Roca, Río Negro y Neuquén.
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <a 
              href="/docs" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/docs');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="hover:text-orange-400 font-semibold transition-colors flex items-center gap-1 text-slate-400"
            >
              📄 Dossier & Propuesta Oficial
            </a>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">koalalotiene.com.ar</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">Venta en local y envíos a domicilio</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
