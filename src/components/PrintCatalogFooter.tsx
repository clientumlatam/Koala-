import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { BranchInfo } from '../types';

interface PrintCatalogFooterProps {
  currentBranch?: BranchInfo;
  catalogUrl?: string;
  storeName?: string;
  phone?: string;
  branches?: string[];
  customCallToAction?: string;
}

export const PrintCatalogFooter: React.FC<PrintCatalogFooterProps> = ({
  currentBranch,
  catalogUrl,
  storeName = 'Koala Lo Tiene (LP SRL)',
  phone = '+54 9 298 412-3456',
  branches = ['General Roca: Av. Roca 1350', 'Neuquén Capital: Mitre 678'],
  customCallToAction = '¡Repetí tu pedido en segundos! Escaneá el código QR con tu celular para acceder al catálogo digital completo con stock en 0s y precios mayoristas actualizados.'
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Determine active branch catalog URL
  const activeBranchId = currentBranch?.id || 'roca';
  const targetCatalogUrl = catalogUrl || (
    typeof window !== 'undefined' 
      ? `${window.location.origin}/?branch=${activeBranchId}#catalogo`
      : 'https://koalalotiene.com.ar'
  );

  const activeBranchName = currentBranch 
    ? `${currentBranch.name} (${currentBranch.address}, ${currentBranch.city})` 
    : 'Casa Central General Roca & Sucursal Neuquén';

  useEffect(() => {
    let isMounted = true;
    
    // Generate high-quality QR code image data URL using 'qrcode' library
    QRCode.toDataURL(targetCatalogUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code for printable catalog footer:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [targetCatalogUrl]);

  return (
    <div className="print-catalog-footer-container print-only hidden print:flex flex-row items-center justify-between border-t-2 border-slate-900 pt-3 mt-6 bg-white text-slate-900 w-full break-inside-avoid page-break-inside-avoid">
      {/* Left side: Brand info, active branch & details */}
      <div className="flex-1 pr-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-extrabold text-sm uppercase tracking-wide text-blue-950">{storeName}</span>
          <span className="text-xs text-slate-500 font-semibold">| Descartables, Repostería & Polietileno</span>
        </div>
        
        <p className="text-[9pt] leading-snug text-slate-700 font-medium mb-2">
          {customCallToAction}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 text-[8pt] text-slate-600 font-sans">
          <span className="flex items-center">
            <strong className="text-slate-900 mr-1">📍 Sucursal Activa:</strong> {activeBranchName}
          </span>
          {branches.map((b, i) => (
            <span key={i} className="flex items-center">
              <strong className="text-slate-800 mr-1">•</strong> {b}
            </span>
          ))}
          <span><strong className="text-slate-900">💬 WhatsApp:</strong> {phone}</span>
          <span><strong className="text-slate-900">🌐 Web:</strong> koalalotiene.com.ar</span>
        </div>
      </div>

      {/* Right side: QR Code Box generated with 'qrcode' library */}
      <div className="flex flex-col items-center justify-center pl-3 border-l-2 border-slate-300 min-w-[100px]">
        <div className="p-1 bg-white border border-slate-300 rounded shadow-2xs mb-1">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="Código QR Catalogo Koala" 
              className="w-[72px] h-[72px] object-contain"
            />
          ) : (
            <div className="w-[72px] h-[72px] bg-slate-100 flex items-center justify-center text-[8pt] text-slate-400">
              Generando...
            </div>
          )}
        </div>
        <span className="text-[7pt] font-black text-blue-950 tracking-tight uppercase text-center">
          Escaneá & Comprá
        </span>
      </div>
    </div>
  );
};
