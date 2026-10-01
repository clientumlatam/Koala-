import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BranchInfo, CartItem, OrderQuote } from '../types';
import { formatCurrency } from './helpers';

export interface GeneratePdfOptions {
  cartItems: CartItem[];
  quote?: Partial<OrderQuote>;
  currentBranch: BranchInfo;
  quoteNumber?: string;
  isOrderReceipt?: boolean;
}

export function generateQuotePDF({
  cartItems,
  quote = {},
  currentBranch,
  quoteNumber,
  isOrderReceipt = false,
}: GeneratePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const generatedQuoteId = quoteNumber || `${isOrderReceipt ? 'REC' : 'COT'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate product subtotal
  const itemsSubtotal = cartItems.reduce((acc, item) => {
    const price = item.isWholesale && item.product.wholesalePrice
      ? item.product.wholesalePrice
      : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate discounts & delivery
  const loyaltyDiscount = quote.appliedLoyaltyDiscount || 0;
  const deliveryFee = quote.deliveryFee || 0;
  const paymentMethod = quote.paymentMethod || 'efectivo';
  
  const transferDiscount = paymentMethod === 'transferencia'
    ? Math.round((itemsSubtotal - loyaltyDiscount) * 0.05)
    : 0;

  const finalTotal = Math.max(0, itemsSubtotal + deliveryFee - loyaltyDiscount - transferDiscount);
  const pointsEarned = Math.floor(finalTotal / 100);
  const earnsStamp = finalTotal >= 5000;

  // --- BRAND HEADER ---
  // Top Orange Accent Line
  doc.setFillColor(234, 88, 12); // #ea580c (Orange-600)
  doc.rect(0, 0, 210, 4, 'F');

  // Dark Header Block
  doc.setFillColor(15, 23, 42); // #0f172a (Slate-900)
  doc.rect(0, 4, 210, 36, 'F');

  // Title / Logo Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('KOALA LO TIENE', 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(251, 146, 60); // Orange-400
  doc.text('FÁBRICA DE POLIETILENO • DESCARTABLES • COTILLÓN • REPOSTERÍA', 14, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('LP SRL • CUIT 30-59986913-8 • Alto Valle de Río Negro y Neuquén • ventaslp.com', 14, 30);

  // Document Badge Box (Right side of header)
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.setDrawColor(234, 88, 12); // Orange border
  doc.setLineWidth(0.4);
  doc.roundedRect(132, 10, 64, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(251, 146, 60);
  doc.text(isOrderReceipt ? 'COMPROBANTE DE PEDIDO' : 'PRESUPUESTO FORMAL', 136, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(generatedQuoteId, 136, 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Emisión: ${dateFormatted} ${timeFormatted} hs`, 136, 29);

  // --- TWO-COLUMN INFO CARDS: SUCURSAL & CLIENTE ---
  const startY = 44;

  // Left Box: Sucursal Emisora
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.2);
  doc.roundedRect(14, startY, 88, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`SUCURSAL EMISORA: ${currentBranch.name.toUpperCase()}`, 18, startY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`• Dirección: ${currentBranch.address}, ${currentBranch.city}`, 18, startY + 13);
  doc.text(`• Teléfono / WhatsApp: +${currentBranch.whatsapp}`, 18, startY + 19);
  const hoursText = typeof currentBranch.hours === 'object'
    ? `${currentBranch.hours.weekdays} | Sáb: ${currentBranch.hours.saturday}`
    : currentBranch.hours;
  doc.text(`• Horarios: ${hoursText}`, 18, startY + 25);
  doc.text('• Razón Social: LP SRL | IVA Resp. Inscripto', 18, startY + 31);

  // Right Box: Datos del Cliente
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, startY, 88, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('DATOS DEL CLIENTE / SOLICITANTE', 112, startY + 6);

  const clientDisplayName = quote.clientName?.trim() ? quote.clientName.trim() : 'Cliente Mostrador / Venta Online';
  const clientDisplayPhone = quote.clientPhone?.trim() ? quote.clientPhone.trim() : 'No especificado';
  const clientCuit = quote.clientCuitOrDni?.trim() ? quote.clientCuitOrDni.trim() : 'Consumidor Final';
  const invoiceLabel = quote.invoiceType || 'Factura B / Consumidor Final';
  const deliveryLabel = quote.deliveryType === 'envio'
    ? `Envío a Domicilio (${quote.deliveryAddress || 'Río Negro/Neuquén'})`
    : `Retiro por Sucursal (${currentBranch.name})`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`• Cliente: ${clientDisplayName}`, 112, startY + 13);
  doc.text(`• Teléfono: ${clientDisplayPhone} | CUIT/DNI: ${clientCuit}`, 112, startY + 19);
  doc.text(`• Comprobante Solicitado: ${invoiceLabel}`, 112, startY + 25);
  doc.text(`• Modalidad: ${deliveryLabel.length > 40 ? deliveryLabel.substring(0, 38) + '...' : deliveryLabel}`, 112, startY + 31);

  // --- PRODUCTS TABLE (AutoTable) ---
  const tableData = cartItems.map((item, index) => {
    const isWholesale = item.isWholesale && !!item.product.wholesalePrice;
    const unitPrice = isWholesale
      ? (item.product.wholesalePrice as number)
      : item.product.price;
    const subtotal = unitPrice * item.quantity;

    const productCode = (item.product as any).sku || `KOA-${item.product.id.slice(0, 6).toUpperCase()}`;
    const mfgBadge = item.product.isManufacturer ? ' [FABRICACIÓN PROPIA]' : '';
    const wholesaleBadge = isWholesale ? ' [BULTO MAYORISTA]' : '';

    return [
      (index + 1).toString(),
      productCode,
      `${item.product.name}${mfgBadge}${wholesaleBadge}`,
      (item.product.category || 'General').toUpperCase(),
      `${item.quantity} ${item.product.unit || 'u.'}`,
      formatCurrency(unitPrice),
      formatCurrency(subtotal),
    ];
  });

  autoTable(doc, {
    startY: 86,
    head: [['#', 'CÓDIGO', 'DESCRIPCIÓN Y DETALLE DE ARTÍCULO', 'RUBRO', 'CANT.', 'P. UNITARIO', 'SUBTOTAL']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 25 },
      4: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 23, halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Get final Y from autoTable
  const finalTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 155;

  // --- TOTALS & NOTES SUMMARY SECTION ---
  let summaryY = finalTableY + 5;

  // If table went too low, add a new page
  if (summaryY > 210) {
    doc.addPage();
    summaryY = 18;
  }

  // Left Box: Commercial Conditions & Club Koala Rewards
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, summaryY, 110, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CONDICIONES COMERCIALES & BENEFICIOS:', 18, summaryY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('• Validez de la cotización: 7 días corridos a partir de la fecha de emisión.', 18, summaryY + 12);
  doc.text('• Precios expresados en Pesos Argentinos (ARS), IVA incluido.', 18, summaryY + 17);
  doc.text('• Sujeto a confirmación de stock al momento del retiro o envío a domicilio.', 18, summaryY + 22);

  // Club Koala Points Badge
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.setDrawColor(245, 158, 11); // Amber-500
  doc.roundedRect(18, summaryY + 26, 102, 10, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9); // Amber-700
  const stampText = earnsStamp ? ' + 1 Sello Tarjeta Digital' : '';
  doc.text(`¡Con esta compra acreditás +${pointsEarned} Puntos Club Koala!${stampText}`, 22, summaryY + 32.5);

  // Right Box: Financial Totals Breakdown
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.roundedRect(130, summaryY, 66, 40, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Subtotal (${totalUnits} unid.):`, 134, summaryY + 6);
  doc.text(formatCurrency(itemsSubtotal), 188, summaryY + 6, { align: 'right' });

  let offset = 11;
  if (loyaltyDiscount > 0) {
    doc.setTextColor(52, 211, 153); // Emerald-400
    doc.text(`Descuento Club Koala:`, 134, summaryY + offset);
    doc.text(`-${formatCurrency(loyaltyDiscount)}`, 188, summaryY + offset, { align: 'right' });
    offset += 5;
  }

  if (transferDiscount > 0) {
    doc.setTextColor(52, 211, 153);
    doc.text(`Desc. 5% Transferencia:`, 134, summaryY + offset);
    doc.text(`-${formatCurrency(transferDiscount)}`, 188, summaryY + offset, { align: 'right' });
    offset += 5;
  }

  if (quote.deliveryType === 'envio') {
    doc.setTextColor(203, 213, 225);
    doc.text(`Costo de Envío:`, 134, summaryY + offset);
    doc.text(deliveryFee === 0 ? 'GRATIS' : formatCurrency(deliveryFee), 188, summaryY + offset, { align: 'right' });
    offset += 5;
  }

  // Divider Line
  doc.setDrawColor(51, 65, 85);
  doc.line(134, summaryY + offset, 190, summaryY + offset);
  offset += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(251, 146, 60); // Orange-400
  doc.text('TOTAL FINAL (ARS):', 134, summaryY + offset);

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(finalTotal), 188, summaryY + offset + 1, { align: 'right' });

  // --- SIGNATURE AND CONFORMITY BOX ---
  let sigY = summaryY + 45;

  if (sigY > 238) {
    doc.addPage();
    sigY = 20;
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, sigY, 182, 32, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CONFORMIDAD DE RECEPCIÓN & ACEPTACIÓN DE COTIZACIÓN', 18, sigY + 5.5);

  // Left Signature: Cliente
  doc.setDrawColor(148, 163, 184);
  doc.line(22, sigY + 20, 88, sigY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('FIRMA Y ACLARACIÓN DEL CLIENTE / SOLICITANTE', 26, sigY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('DNI / CUIT: _______________________ Fecha: ___ / ___ / 2026', 22, sigY + 28.5);

  // Right Signature: Koala Branch
  doc.line(116, sigY + 20, 182, sigY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('FIRMA Y SELLO DE SUCURSAL EMISORA', 126, sigY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`Koala Lo Tiene — ${currentBranch.name} • LP SRL`, 116, sigY + 28.5);

  // --- FOOTER NOTICE ---
  const pageHeight = doc.internal.pageSize.height || 297;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Documento comercial generado por la plataforma e-commerce Koala Lo Tiene × Clientum • LP SRL CUIT 30-59986913-8 • General Roca & Neuquén Capital`,
    14,
    pageHeight - 6
  );

  return doc;
}

export function downloadQuotePDF(options: GeneratePdfOptions): void {
  const doc = generateQuotePDF(options);
  const prefix = options.isOrderReceipt ? 'Comprobante_Pedido' : 'Presupuesto';
  const branchName = options.currentBranch.id.toUpperCase();
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${prefix}_Koala_${branchName}_${dateStr}.pdf`;
  doc.save(fileName);
}

export function exportCartPDF(
  cartItems: CartItem[],
  currentBranch: BranchInfo,
  clientInfo?: Partial<OrderQuote>
): void {
  downloadQuotePDF({
    cartItems,
    currentBranch,
    quote: clientInfo,
  });
}
