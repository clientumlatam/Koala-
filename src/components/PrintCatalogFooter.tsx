import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PrintCatalogFooterProps {
  catalogUrl?: string;
  storeName?: string;
  phone?: string;
  branches?: string[];
  customCallToAction?: string;
}

export const PrintCatalogFooter: React.FC<PrintCatalogFooterProps> = ({
  catalogUrl = typeof window !== 'undefined' ? `${window.location.origin}/#catalogo` : 'https://koalalotiene.com.ar',
  storeName = 'Koala Lo Tiene (LP SRL)',
  phone = '+54 9 298 412-3456',
  branches = ['General Roca: Av. Roca 1350', 'Neuquén Capital: Mitre 678'],
  customCallToAction = '¡Repetí tu pedido en segundos! Escaneá el código QR con tu celular para acceder al catálogo digital completo con stock en 0s y precios mayoristas actualizados.'
}) => {
  return (
    <div className="print-catalog-footer-container print-only hidden print:flex flex-row items-center justify-between border-t-2 border-slate-900 pt-3 mt-6 bg-white text-slate-900">
      {/* Left side: Brand info & Branch locations */}
      <div className="flex-1 pr-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-extrabold text-sm uppercase tracking-wide text-blue-900">{storeName}</span>
          <span className="text-xs text-slate-500">| Descartables, Repostería & Polietileno</span>
        </div>
        
        <p className="text-[9pt] leading-tight text-slate-700 font-medium mb-2">
          {customCallToAction}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 text-[8pt] text-slate-600 font-sans">
          {branches.map((b, i) => (
            <span key={i} className="flex items-center">
              <strong className="text-slate-800 mr-1">📍</strong> {b}
            </span>
          ))}
          <span><strong className="text-slate-800">💬 WhatsApp:</strong> {phone}</span>
          <span><strong className="text-slate-800">🌐 Web:</strong> koalalotiene.com.ar</span>
        </div>
      </div>

      {/* Right side: QR Code Box */}
      <div className="flex flex-col items-center justify-center pl-3 border-l border-slate-300 min-w-[90px]">
        <div className="p-1 bg-white border border-slate-300 rounded shadow-sm mb-1">
          <QRCodeSVG
            value={catalogUrl}
            size={68}
            level="M"
            includeMargin={false}
            fgColor="#0f172a"
            bgColor="#ffffff"
          />
        </div>
        <span className="text-[7pt] font-bold text-blue-900 tracking-tight uppercase text-center">
          Escaneá & Comprá
        </span>
      </div>
    </div>
  );
};
