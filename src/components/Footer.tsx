import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  ChevronRight,
  Factory,
  Gift,
  RotateCcw,
  ShieldCheck,
  FileText,
  HelpCircle,
  Briefcase,
  ExternalLink,
  Percent,
  Instagram
} from 'lucide-react';
import { BranchInfo } from '../types';
import { KoalaLogo } from './KoalaLogo';
import { InstitutionalPageType } from './InstitutionalPageModal';

interface FooterProps {
  branches: BranchInfo[];
  onScrollToSection: (sectionId: string) => void;
  onOpenLoyaltyModal?: () => void;
  onOpenAdmin?: () => void;
  onOpenInstitutional?: (page: InstitutionalPageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  branches, 
  onScrollToSection, 
  onOpenLoyaltyModal, 
  onOpenAdmin,
  onOpenInstitutional 
}) => {
  const handlePageClick = (page: InstitutionalPageType) => {
    if (onOpenInstitutional) {
      onOpenInstitutional(page);
    } else {
      window.history.pushState({}, '', `/${page}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Legal Obligatorio: Botón de Arrepentimiento (Resolución 424/2020) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs sm:text-sm">
                Botón de Arrepentimiento · Ley de Defensa del Consumidor
              </h4>
              <p className="text-[11px] text-slate-400">
                Podés revocar tu compra online dentro de los 10 días corridos de recibido el pedido (Res. 424/2020 Secretaría de Comercio).
              </p>
            </div>
          </div>

          <button
            onClick={() => handlePageClick('arrepentimiento')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-600/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Solicitar Arrepentimiento</span>
          </button>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="bg-white p-2.5 rounded-2xl inline-block shadow-sm">
              <KoalaLogo size="md" />
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Fabricación de polietileno de alta y baja densidad. Distribución integral de descartables gastronómicos, cotillón, repostería, envases PET y bolsas comerciales en el Alto Valle de Río Negro y Neuquén.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-800/80">
                <Factory className="w-3.5 h-3.5 text-orange-500" />
                <span>Venta Mayorista y Minorista</span>
              </span>

              {onOpenLoyaltyModal && (
                <button
                  onClick={onOpenLoyaltyModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Club Koala Puntos</span>
                </button>
              )}

              <button
                onClick={() => onScrollToSection('instagram-feed')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 via-rose-500/20 to-purple-500/20 text-rose-300 hover:text-white text-[11px] font-bold border border-rose-500/30 hover:border-rose-400 transition-colors cursor-pointer"
                title="Ver Feed Oficial de Instagram @koalalotiene"
              >
                <Instagram className="w-3.5 h-3.5 text-rose-400" />
                <span>@koalalotiene</span>
              </button>
            </div>
          </div>

          {/* Col 2: Sucursales y Contacto */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider text-orange-400">
              Nuestros Locales
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <strong className="block text-white text-xs">General Roca (Casa Central)</strong>
                <span className="text-[11px] text-slate-400">Av. Roca 1350 · Tel (0298) 443-6639</span>
              </div>
              <div>
                <strong className="block text-white text-xs">Neuquén Capital (Salón)</strong>
                <span className="text-[11px] text-slate-400">Mitre 678 · Tel (0299) 443-3960</span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <button
                onClick={() => handlePageClick('sucursales')}
                className="hover:text-orange-400 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 text-orange-500" />
                <span>Ver Mapa y Horarios de Atención</span>
              </button>
              <button
                onClick={() => handlePageClick('contacto')}
                className="hover:text-orange-400 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 text-orange-500" />
                <span>Formulario de Contacto</span>
              </button>
              <button
                onClick={() => handlePageClick('trabaja')}
                className="hover:text-purple-400 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 text-purple-500" />
                <span>Trabajá con Nosotros (RRHH)</span>
              </button>
            </div>
          </div>

          {/* Col 3: Servicios y Producción */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider text-orange-400">
              Fábrica & Servicios
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handlePageClick('servicio-tecnico')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Producción de Polietileno a Medida</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('servicio-tecnico')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Bolsas Impresas con Logo</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('ofertas')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer text-amber-300 font-semibold"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  <span>Ofertas & Precios por Bulto</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('faq')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Preguntas Frecuentes (FAQ)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legales y Políticas */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm font-fredoka uppercase tracking-wider text-orange-400">
              Políticas y Legales
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handlePageClick('politicas-devolucion')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Políticas de Devolución</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('terminos')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Términos y Condiciones</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('privacidad')} 
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  <span>Políticas de Privacidad</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('derechos-datos')} 
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-indigo-400" />
                  <span>Datos Personales (Ley 25.326)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageClick('arrepentimiento')} 
                  className="hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer text-rose-400 font-semibold"
                >
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                  <span>Botón de Arrepentimiento</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="text-center md:text-left space-y-0.5">
            <div className="font-medium text-slate-300 flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
              <span>LP SRL</span>
              <a 
                href="https://ventaslp.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-white hover:text-orange-400 underline decoration-orange-500/60 underline-offset-2 transition-colors"
              >
                https://ventaslp.com/
              </a>
              <span>• CUIT 30-59986913-8 • Río Negro y Neuquén</span>
            </div>
            <div className="text-slate-500">
              Fabricación en General Roca • Atención en locales y envíos a todo el Alto Valle
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
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
              title="Acceso al Panel de Administración & ERP (ICXN)"
            >
              <span>🔒 Panel Admin & ERP (ICXN)</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 font-medium">koalalotiene.com.ar</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
