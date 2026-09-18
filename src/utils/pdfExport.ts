import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BranchInfo, CartItem, OrderQuote } from '../types';
import { formatCurrency } from './helpers';

export interface GeneratePdfOptions {
  cartItems: CartItem[];
  quote: OrderQuote;
  currentBranch: BranchInfo;
  quoteNumber?: string;
}

export function generateQuotePDF({
  cartItems,
  quote,
  currentBranch,
  quoteNumber,
}: GeneratePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const generatedQuoteId = quoteNumber || `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
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

  // Calculate totals
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.isWholesale && item.product.wholesalePrice
      ? item.product.wholesalePrice
      : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- BRAND HEADER ---
  // Top Orange Bar
  doc.setFillColor(234, 88, 12); // #ea580c (Orange-600)
  doc.rect(0, 0, 210, 10, 'F');

  // Dark Slate Header Block
  doc.setFillColor(15, 23, 42); // #0f172a (Slate-900)
  doc.rect(0, 10, 210, 32, 'F');

  // Logo / Title text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('KOALA LO TIENE', 14, 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(251, 146, 60); // Orange-400
  doc.text('FÁBRICA DE POLIETILENO • DESCARTABLES • COTILLÓN • REPOSTERÍA', 14, 29);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('Venta Minorista y Mayorista • Alto Valle de Río Negro y Neuquén', 14, 34);

  // Document Badge (Right Header)
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.roundedRect(140, 14, 56, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(251, 146, 60);
  doc.text('PRESUPUESTO FORMAL', 144, 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(generatedQuoteId, 144, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Fecha: ${dateFormatted} ${timeFormatted} hs`, 144, 34);

  // --- TWO-COLUMN INFO PANEL: SUCURSAL & CLIENTE ---
  let startY = 48;

  // Left Box: Sucursal Emisora
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, startY, 88, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
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
  doc.text('• Razón Social: LP SRL (ventaslp.com) | IVA Resp. Inscripto', 18, startY + 31);

  // Right Box: Datos del Cliente
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, startY, 88, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DATOS DEL CLIENTE / SOLICITANTE', 112, startY + 6);

  const clientDisplayName = quote.clientName?.trim() ? quote.clientName.trim() : 'Cliente Mostrador / Venta Online';
  const clientDisplayPhone = quote.clientPhone?.trim() ? quote.clientPhone.trim() : 'No especificado';
  const deliveryLabel = quote.deliveryType === 'envio'
    ? `Envío a domicilio (${quote.deliveryAddress || 'Dirección a coordinar'})`
    : `Retiro por sucursal (${currentBranch.name})`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`• Razón Social / Nombre: ${clientDisplayName}`, 112, startY + 13);
  doc.text(`• Teléfono de Contacto: ${clientDisplayPhone}`, 112, startY + 19);
  doc.text(`• Modalidad: ${deliveryLabel.length > 42 ? deliveryLabel.substring(0, 40) + '...' : deliveryLabel}`, 112, startY + 25);
  doc.text(`• Medio de Pago Previsto: ${quote.paymentMethod.toUpperCase()}`, 112, startY + 31);

  // --- PRODUCTS TABLE (AutoTable) ---
  const tableData = cartItems.map((item, index) => {
    const isWholesale = item.isWholesale && !!item.product.wholesalePrice;
    const unitPrice = isWholesale
      ? (item.product.wholesalePrice as number)
      : item.product.price;
    const subtotal = unitPrice * item.quantity;

    const productCode = (item.product as any).sku || `KOA-${item.product.id.slice(0, 6).toUpperCase()}`;

    return [
      (index + 1).toString(),
      productCode,
      `${item.product.name}${isWholesale ? ' [TARIFA MAYORISTA]' : ''}`,
      item.product.category.toUpperCase(),
      `${item.quantity} ${item.product.unit || 'u.'}`,
      formatCurrency(unitPrice),
      formatCurrency(subtotal),
    ];
  });

  autoTable(doc, {
    startY: 91,
    head: [['#', 'SKU / CÓD.', 'DESCRIPCIÓN DEL ARTÍCULO', 'RUBRO', 'CANT.', 'P. UNITARIO', 'SUBTOTAL']],
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
      cellPadding: 2.5,
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
  const finalTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 160;

  // --- TOTALS & NOTES SUMMARY ---
  let summaryY = finalTableY + 6;

  // Check if we have enough room for summary and signature on this page (A4 height is 297mm)
  if (summaryY > 215) {
    doc.addPage();
    summaryY = 20;
  }

  // Left: Conditions & Notes
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, summaryY, 110, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CONDICIONES COMERCIALES & OBSERVACIONES:', 18, summaryY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('• Validez de la cotización: 7 días corridos a partir de la fecha de emisión.', 18, summaryY + 12);
  doc.text('• Precios expresados en Pesos Argentinos (ARS), IVA incluido.', 18, summaryY + 17);
  doc.text('• Sujeto a disponibilidad de stock y confirmación de pago o retiro en local.', 18, summaryY + 22);
  if (quote.notes?.trim()) {
    const cleanNotes = quote.notes.trim().replace(/\n/g, ' ');
    const displayNotes = cleanNotes.length > 55 ? cleanNotes.substring(0, 52) + '...' : cleanNotes;
    doc.text(`• Nota del cliente: "${displayNotes}"`, 18, summaryY + 27);
  } else {
    doc.text('• Para coordinar facturación A o entregas al por mayor, contactar por WhatsApp.', 18, summaryY + 27);
  }

  // Right: Total Calculation Box
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.roundedRect(130, summaryY, 66, 32, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Total de Artículos: ${totalUnits} unidades`, 135, summaryY + 7);

  doc.setFontSize(8);
  doc.setTextColor(251, 146, 60); // Orange-400
  doc.text('TOTAL COTIZADO (ARS):', 135, summaryY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(formatCurrency(totalAmount), 135, summaryY + 24);

  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('IVA INCLUIDO • PRECIO FINAL', 135, summaryY + 29);

  // --- SIGNATURE AND ACCEPTANCE BOX (Firma del Cliente y Emisor) ---
  let sigY = summaryY + 38;

  if (sigY > 235) {
    doc.addPage();
    sigY = 25;
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, sigY, 182, 36, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CONFORMIDAD DE PRESUPUESTO & RECEPCIÓN', 18, sigY + 6);

  // Left Signature Line: Cliente
  doc.setDrawColor(100, 116, 139);
  doc.line(22, sigY + 23, 88, sigY + 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('FIRMA Y ACLARACIÓN DEL CLIENTE', 32, sigY + 27);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('DNI / CUIT: _______________________  Fecha: ___ / ___ / 2026', 22, sigY + 32);

  // Right Signature Line: Emisor Koala
  doc.line(116, sigY + 23, 182, sigY + 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('FIRMA / SELLO SUCURSAL EMISORA', 126, sigY + 27);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`Koala Lo Tiene - ${currentBranch.name} • Atención Comercial`, 116, sigY + 32);

  // --- FOOTER ---
  const pageHeight = doc.internal.pageSize.height || 297;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Documento comercial emitido por LP SRL (ventaslp.com) • Koala Lo Tiene • Fábrica General Roca y Sucursales Neuquén`,
    14,
    pageHeight - 6
  );

  return doc;
}

export function downloadQuotePDF(options: GeneratePdfOptions): void {
  const doc = generateQuotePDF(options);
  const fileName = `Presupuesto_Koala_${options.currentBranch.id.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
