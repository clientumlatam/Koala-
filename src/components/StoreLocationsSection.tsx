import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Mail, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  Instagram, 
  Facebook,
  Navigation
} from 'lucide-react';
import { BranchInfo } from '../types';

interface StoreLocationsSectionProps {
  branches: BranchInfo[];
  currentBranch: BranchInfo;
  onSelectBranch: (branchId: 'roca' | 'neuquen') => void;
}

export const StoreLocationsSection: React.FC<StoreLocationsSectionProps> = ({
  branches,
  currentBranch,
  onSelectBranch,
}) => {
  return (
    <section id="locations" className="py-16 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block">
            Nuestras Sucursales
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-fredoka text-slate-900">
            Visitanos en General Roca y Neuquén
          </h2>
          <p className="text-sm text-slate-600">
            Contamos con locales equipados con amplio stock de polietileno, insumos gastronómicos, descartables, cotillón y repostería.
          </p>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {branches.map((b) => {
            const isSelected = b.id === currentBranch.id;
            return (
              <div
                key={b.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm transition-all space-y-6 ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center font-black font-fredoka text-xl">
                      📍
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-fredoka text-slate-900">
                        {b.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {b.city}, {b.province}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-300">
                      Seleccionada
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectBranch(b.id)}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Elegir esta sucursal
                    </button>
                  )}
                </div>

                {/* Details List */}
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block text-sm">{b.address}</strong>
                      <span className="text-slate-500">Código Postal ({b.postalCode}) • {b.city}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[11px] block font-semibold">Teléfono Fijo</span>
                      <strong className="text-slate-900 text-xs">{b.phone}</strong>
                    </div>

                    <a
                      href={`https://wa.me/${b.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-emerald-700 text-[11px] block font-semibold">WhatsApp Directo</span>
                        <strong className="text-emerald-950 text-xs">{b.whatsappFormatted}</strong>
                      </div>
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Horarios de Atención al Público:</span>
                    </div>
                    <div className="space-y-1 text-slate-600 pl-5 text-xs">
                      <div>• Lunes a Viernes: <strong className="text-slate-900">{b.hours.weekdays}</strong></div>
                      <div>• Sábados: <strong className="text-slate-900">{b.hours.saturday}</strong></div>
                      <div>• Domingos: <span className="text-rose-600 font-bold">{b.hours.sunday}</span></div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-slate-600 text-xs px-1">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Email: <strong className="text-slate-800">{b.email}</strong></span>
                  </div>
                </div>

                {/* Buttons Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Navigation className="w-4 h-4 text-orange-400" />
                    <span>Cómo llegar en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href={`https://wa.me/${b.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Mensaje</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Media & Contact Info */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black font-fredoka">
              ¡Seguinos en Redes Sociales!
            </h3>
            <p className="text-xs text-orange-100 max-w-xl">
              Novedades semanales, ingresos de repostería, cotillón festivo, ofertas en bolsas de polietileno y Big Bags.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/koalalotiene"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-xs transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-300" />
              <span>@koalalotiene (Roca)</span>
            </a>

            <a
              href="https://www.facebook.com/koalalotiene"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-xs transition-colors"
            >
              <Facebook className="w-4 h-4 text-blue-300" />
              <span>Facebook Koala</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
