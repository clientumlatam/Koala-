import QRCode from 'qrcode';
import { Product, ProductInventoryRecord, BranchInfo } from '../types';
import { formatCurrency } from './helpers';

export interface PrintProductTableOptions {
  products: (Product | ProductInventoryRecord)[];
  title?: string;
  categoryName?: string;
  currentBranch?: BranchInfo;
  isWholesale?: boolean;
}

/**
 * Triggers the browser native print window applying index.css print styles
 * to generate a clean, professional PDF or paper printout of the product table.
 * Uses the 'qrcode' library to embed a local high-res QR code data URL linking
 * to the active branch's online store catalog.
 */
export async function printProductTable({
  products,
  title = 'Tabla Oficial de Productos y Lista de Precios',
  categoryName = 'Todas las Categorías',
  currentBranch = {
    id: 'roca',
    name: 'Casa Central General Roca',
    address: 'Av. Roca 1350',
    city: 'General Roca',
    province: 'Río Negro',
    postalCode: '8332',
    phone: '(0298) 443-6639',
    whatsapp: '5492984123456',
    whatsappFormatted: '+54 9 298 412-3456',
    email: 'roca@koalalotiene.com.ar',
    hours: {
      weekdays: '8:00 a 17:00 hs',
      saturday: '8:30 a 13:00 hs',
      sunday: 'Cerrado'
    },
    mapsUrl: ''
  },
  isWholesale = false
}: PrintProductTableOptions): Promise<void> {
  if (typeof window === 'undefined') return;

  // Create temporary printable DOM container if it doesn't exist
  let printContainer = document.getElementById('print-product-table-container');
  if (!printContainer) {
    printContainer = document.createElement('div');
    printContainer.id = 'print-product-table-container';
    printContainer.className = 'printable-area hidden print:block bg-white p-6 text-slate-900';
    document.body.appendChild(printContainer);
  }

  const currentDate = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate QR code linking to current active branch URL using 'qrcode' library
  const qrTargetUrl = `${window.location.origin}/?branch=${currentBranch.id}#catalogo`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Error generating QR code using qrcode library for print catalog:', err);
  }

  // Build Table Rows HTML
  const rowsHtml = products.map((prod, index) => {
    const sku = (prod as any).sku || `KOA-${prod.id.slice(0, 6).toUpperCase()}`;
    const price = isWholesale && prod.wholesalePrice ? prod.wholesalePrice : prod.price;
    const stockVal = typeof (prod as any).stock === 'number' ? (prod as any).stock : 'Disponible';
    const manufacturerTag = (prod as any).isManufacturer ? ' <span class="badge">FÁBRICA</span>' : '';

    return `
      <tr>
        <td style="text-align: center; font-weight: bold;">${index + 1}</td>
        <td style="font-family: monospace; font-weight: bold; color: #1e3a8a;">${sku}</td>
        <td>
          <strong>${prod.name}</strong>${manufacturerTag}
          ${prod.description ? `<br/><small style="color: #64748b;">${prod.description}</small>` : ''}
        </td>
        <td style="text-transform: uppercase;">${prod.category}</td>
        <td style="text-align: center;">${prod.unit || 'unid.'}</td>
        <td style="text-align: center; font-weight: bold;">${stockVal}</td>
        <td style="text-align: right; font-weight: bold; color: #166534;">${formatCurrency(price)}</td>
      </tr>
    `;
  }).join('');

  printContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px;">
      <div>
        <h1 style="font-size: 18pt; font-weight: 800; color: #0f172a; margin: 0;">KOALA LO TIENE (LP SRL)</h1>
        <p style="font-size: 9pt; color: #2563eb; font-weight: bold; margin: 2px 0 0 0;">
          FÁBRICA DE POLIETILENO • DESCARTABLES • COTILLÓN • REPOSTERÍA
        </p>
        <p style="font-size: 8pt; color: #64748b; margin: 2px 0 0 0;">
          Sucursal Activa: ${currentBranch.name} (${currentBranch.address}, ${currentBranch.city}) • Tel: ${currentBranch.phone}
        </p>
      </div>
      <div style="text-align: right;">
        <span style="background: #1e293b; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold; display: inline-block;">
          LISTA DE PRECIOS ${isWholesale ? 'MAYORISTA' : 'MINORISTA'}
        </span>
        <p style="font-size: 8pt; color: #64748b; margin: 4px 0 0 0;">Fecha: ${currentDate} ${currentTime} hs</p>
        <p style="font-size: 8pt; color: #0f172a; font-weight: bold; margin: 2px 0 0 0;">Total Productos: ${products.length}</p>
      </div>
    </div>

    <div style="margin-bottom: 12px; padding: 6px 12px; background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px;">
      <span style="font-weight: bold; font-size: 10pt; color: #0f172a;">${title}</span>
      <span style="font-size: 9pt; color: #64748b; margin-left: 10px;">Filtro: ${categoryName}</span>
    </div>

    <table class="price-table" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="width: 30px; text-align: center;">#</th>
          <th style="width: 100px;">SKU / CÓD.</th>
          <th>DESCRIPCIÓN DEL PRODUCTO</th>
          <th style="width: 110px;">RUBRO</th>
          <th style="width: 60px; text-align: center;">UNID.</th>
          <th style="width: 70px; text-align: center;">STOCK</th>
          <th style="width: 100px; text-align: right;">PRECIO ARS</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div id="print-catalog-footer-container" class="print-catalog-footer-container" style="margin-top: 20px; padding-top: 10px; border-top: 2px solid #0f172a; display: flex; justify-content: space-between; align-items: center;">
      <div style="max-width: 75%;">
        <p style="font-size: 9pt; font-weight: bold; color: #0f172a; margin: 0 0 4px 0;">
          KOALA LO TIENE — Cotillón, Descartables, Repostería & Polietileno
        </p>
        <p style="font-size: 8pt; color: #475569; margin: 0 0 4px 0;">
          ¡Repetí tu pedido en segundos! Escaneá el código QR con tu celular para acceder al catálogo digital de la sucursal ${currentBranch.name} con stock en 0s y precios mayoristas en tiempo real.
        </p>
        <p style="font-size: 7.5pt; color: #64748b; margin: 0;">
          General Roca: Av. Roca 1350 | Neuquén: Mitre 678 | WhatsApp: +54 9 298 412-3456 | Web: ${qrTargetUrl.replace(/^https?:\/\//, '')}
        </p>
      </div>
      <div style="text-align: center; min-width: 120px;">
        <div class="qr-box" style="border: 2px dashed #ea580c; border-radius: 10px; padding: 3px; background: #ffffff; display: inline-block;">
          ${
            qrDataUrl
              ? `<img src="${qrDataUrl}" alt="QR Catalogo Koala" style="width: 80px; height: 84px; object-fit: contain; margin: 0 auto; display: block;" />`
              : `<div style="width: 80px; height: 84px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 6pt; color: #64748b;">QR KOALA</div>`
          }
        </div>
        <span class="qr-label" style="display: block; font-size: 7.5pt; font-weight: 900; color: #0f172a; margin-top: 4px; text-transform: uppercase; text-align: center; max-width: 130px; line-height: 1.1;">
          Escaneá para acceder al catálogo digital actualizado
        </span>
      </div>
    </div>
  `;

  // Trigger window print after DOM update
  setTimeout(() => {
    window.print();
  }, 120);
}
