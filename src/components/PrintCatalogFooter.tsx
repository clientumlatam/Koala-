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
  showOnScreen?: boolean;
}

export const PrintCatalogFooter: React.FC<PrintCatalogFooterProps> = ({
  currentBranch,
  catalogUrl,
  storeName = 'Koala Lo Tiene (LP SRL)',
  phone = '+54 9 298 412-3456',
  branches = ['General Roca: Av. Roca 1350', 'Neuquén Capital: Mitre 678'],
  customCallToAction = '¡Repetí tu pedido en segundos! Escaneá el código QR con tu celular para acceder al catálogo digital completo con stock en 0s y precios mayoristas actualizados.',
  showOnScreen = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Determine dynamic APP_URL and target catalog URL
  const activeBranchId = currentBranch?.id || 'roca';
  const appUrl = typeof window !== 'undefined'
    ? (window.location.origin || 'https://koalalotiene.com.ar')
    : 'https://koalalotiene.com.ar';

  const targetCatalogUrl = catalogUrl || `${appUrl}/?branch=${activeBranchId}#catalogo`;

  const activeBranchName = currentBranch 
    ? `${currentBranch.name} (${currentBranch.address}, ${currentBranch.city})` 
    : 'Casa Central General Roca & Sucursal Neuquén';

  useEffect(() => {
    let isMounted = true;
    
    // Generate QR code with High Error Correction ('H') and an overlay brand logo
    const generateQrWithLogoOverlay = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 280;
        canvas.height = 280;

        // Render QR with high error recovery (30%) to ensure mobile devices scan reliably with logo overlay
        await QRCode.toCanvas(canvas, targetCatalogUrl, {
          width: 280,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });

        const ctx = canvas.getContext('2d');
        if (ctx) {
          const logoSize = 56;
          const center = (280 - logoSize) / 2;
          const padding = 5;

          // Draw white background container in the center for the logo overlay
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(center - padding, center - padding, logoSize + padding * 2, logoSize + padding * 2, 8);
          } else {
            ctx.rect(center - padding, center - padding, logoSize + padding * 2, logoSize + padding * 2);
          }
          ctx.fill();

          ctx.strokeStyle = '#ea580c'; // Orange brand border
          ctx.lineWidth = 2;
          ctx.stroke();

          // Overlay Koala Brand Logo
          const logo = new Image();
          logo.crossOrigin = 'anonymous';
          logo.src = '/koala-logo.png';

          await new Promise<void>((resolve) => {
            logo.onload = () => {
              ctx.drawImage(logo, center, center, logoSize, logoSize);
              resolve();
            };
            logo.onerror = () => {
              // Fallback brand mark if logo image fails
              ctx.fillStyle = '#ea580c';
              ctx.font = 'bold 32px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('K', 140, 140);
              resolve();
            };
          });
        }

        const dataUrl = canvas.toDataURL('image/png');
        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code with overlay logo:', err);
        // Fallback standard high-res QR code
        QRCode.toDataURL(targetCatalogUrl, {
          width: 240,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
          errorCorrectionLevel: 'H'
        }).then((dataUrl) => {
          if (isMounted) setQrDataUrl(dataUrl);
        });
      }
    };

    generateQrWithLogoOverlay();

    return () => {
      isMounted = false;
    };
  }, [targetCatalogUrl]);

  const containerClasses = showOnScreen
    ? "print-catalog-footer-container flex flex-row items-center justify-between border-t-2 border-slate-900 dark:border-slate-700 p-3 mt-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-full rounded-2xl border shadow-xs"
    : "print-catalog-footer-container print-only hidden print:flex flex-row items-center justify-between border-t-2 border-slate-900 pt-3 mt-6 bg-white text-slate-900 w-full break-inside-avoid page-break-inside-avoid";

  return (
    <div id="print-catalog-footer-container" className={containerClasses}>
      {/* Left side: Brand info, active branch & details */}
      <div className="flex-1 pr-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-extrabold text-sm uppercase tracking-wide text-blue-950 dark:text-blue-300">{storeName}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">| Descartables, Repostería & Polietileno</span>
        </div>
        
        <p className="text-[9pt] leading-snug text-slate-700 dark:text-slate-300 font-medium mb-2">
          {customCallToAction}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 text-[8pt] text-slate-600 dark:text-slate-400 font-sans">
          <span className="flex items-center">
            <strong className="text-slate-900 dark:text-slate-200 mr-1">📍 Sucursal Activa:</strong> {activeBranchName}
          </span>
          {branches.map((b, i) => (
            <span key={i} className="flex items-center">
              <strong className="text-slate-800 dark:text-slate-300 mr-1">•</strong> {b}
            </span>
          ))}
          <span><strong className="text-slate-900 dark:text-slate-200">💬 WhatsApp:</strong> {phone}</span>
          <span><strong className="text-slate-900 dark:text-slate-200">🌐 Web:</strong> {appUrl.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>

      {/* Right side: QR Code Box with dashed border and high-contrast label */}
      <div className="flex flex-col items-center justify-center pl-3 border-l-2 border-slate-300 min-w-[130px]">
        <div className="qr-box p-1 bg-white border-2 border-dashed border-orange-600 rounded-xl shadow-2xs mb-1 flex items-center justify-center">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="Código QR Catálogo Koala con Isotipo" 
              className="w-[84px] h-[84px] object-contain"
            />
          ) : (
            <div className="w-[84px] h-[84px] bg-slate-100 flex items-center justify-center text-[8pt] text-slate-400">
              Generando...
            </div>
          )}
        </div>
        <span className="qr-label text-[7.5pt] font-black text-slate-950 dark:text-white tracking-tight uppercase text-center leading-tight max-w-[130px] font-sans">
          Escaneá para acceder al catálogo digital actualizado
        </span>
      </div>
    </div>
  );
};
