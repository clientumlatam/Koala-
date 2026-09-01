import React from 'react';
import { 
  PackageCheck, 
  UtensilsCrossed, 
  PartyPopper, 
  Cake, 
  SprayCan, 
  BookOpen,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Factory
} from 'lucide-react';
import { BranchInfo } from '../types';

interface HeroBannerProps {
  currentBranch: BranchInfo;
  onScrollToCatalog: () => void;
  onScrollToLocations: () => void;
  onOpenAi: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentBranch,
  onScrollToCatalog,
  onScrollToLocations,
  onOpenAi,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold tracking-wide uppercase">
              <Factory className="w-4 h-4 text-orange-400" />
              <span>Fabricación Propia de Polietileno & Distribuidor Mayorista</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-fredoka tracking-tight text-white leading-tight">
              Todo en Polietileno, Descartables y Cotillón. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                ¡Koala Lo Tiene!
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Atendemos comercios, gastronomía, eventos y empresas en <strong className="text-white font-semibold">General Roca</strong> (Av. Roca 1350) y <strong className="text-white font-semibold">Neuquén</strong> (Mitre 678). Presupuestos al instante con retiro por local o entrega a domicilio.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bolsas & Film Stretch</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Big Bags 1 Tonelada</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Descartables Viandas</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cotillón & Repostería</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Envases PET y Gatillos</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Resmas y Librería</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onScrollToCatalog}
                className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Ver Catálogo & Precios</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${currentBranch.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp ({currentBranch.city})</span>
              </a>

              <button
                onClick={onOpenAi}
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-sm transition-all flex items-center gap-2"
              >
                <span>Asesor Virtual AI</span>
              </button>
            </div>
          </div>

          {/* Right Column: Branch Info Card & Visual Mascot Badge */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-800 to-slate-850 rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
              {/* Mascot Badge Banner */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black font-fredoka text-xl shadow-md">
                    🦘
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Koala Lo Tiene</h3>
                    <p className="text-xs text-slate-400">Atención al cliente e Insumos</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sucursal Activa
                </span>
              </div>

              {/* Active Store Details */}
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">{currentBranch.name}</strong>
                    <span>{currentBranch.address}, {currentBranch.city} ({currentBranch.province})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <span className="text-slate-400 block text-[11px]">Teléfono Fijo</span>
                    <strong className="text-white text-xs">{currentBranch.phone}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <span className="text-slate-400 block text-[11px]">WhatsApp Directo</span>
                    <strong className="text-emerald-400 text-xs">{currentBranch.whatsappFormatted}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                  <strong className="text-amber-300 block font-semibold">Horarios de Atención:</strong>
                  <p>• Lunes a Viernes: {currentBranch.hours.weekdays}</p>
                  <p>• Sábados: {currentBranch.hours.saturday}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <button 
                  onClick={onScrollToLocations}
                  className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                >
                  Ver mapa y sucursal Neuquén →
                </button>
                <span className="text-[11px] bg-slate-700/60 px-2 py-0.5 rounded text-slate-300">
                  koalalotiene.com.ar
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
