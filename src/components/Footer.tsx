import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Facebook, 
  ChevronRight,
  ShieldCheck,
  Factory
} from 'lucide-react';
import { BranchInfo } from '../types';

interface FooterProps {
  branches: BranchInfo[];
  onScrollToSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ branches, onScrollToSection, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black font-fredoka text-xl">
                🦘
              </div>
              <span className="text-xl font-black font-fredoka text-white tracking-wide">
                Koala <span className="text-orange-500">Lo tiene!</span>
              </span>
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
              Categorías Principales
            </h4>
            <ul className="space-y-2">
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
                  Big Bags 1 Tonelada
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

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">koalalotiene.com.ar</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">Venta en local y envíos</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Panel ERP (/admin)</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
