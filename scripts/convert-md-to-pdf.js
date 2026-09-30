import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

function getAllMdFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMdFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Helper to render formatted text with inline **bold** and `code`
function renderFormattedText(doc, text, options = {}) {
  const defaultFontSize = options.fontSize || 9.5;
  const defaultFont = options.font || 'Helvetica';
  const defaultColor = options.color || '#1E293B';

  doc.fontSize(defaultFontSize).fillColor(defaultColor);

  // Split by bold (**text**) and inline code (`text`)
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  const startX = options.indent ? doc.page.margins.left + options.indent : doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right - (options.indent || 0);

  // We can render inline tokens smoothly using pdfkit's continued text
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (part.startsWith('**') && part.endsWith('**')) {
      const clean = part.slice(2, -2);
      doc.font('Helvetica-Bold').fillColor('#0F172A');
      doc.text(clean, { continued: !isLast, width, align: options.align || 'left' });
    } else if (part.startsWith('`') && part.endsWith('`')) {
      const clean = part.slice(1, -1);
      doc.font('Courier').fontSize(defaultFontSize - 0.5).fillColor('#2563EB');
      doc.text(` ${clean} `, { continued: !isLast, width, align: options.align || 'left' });
      doc.font(defaultFont).fontSize(defaultFontSize).fillColor(defaultColor);
    } else if (part) {
      doc.font(defaultFont).fontSize(defaultFontSize).fillColor(defaultColor);
      doc.text(part, { continued: !isLast, width, align: options.align || 'left' });
    }
  }

  if (parts.length === 0 || parts.every(p => !p)) {
    doc.text('', { width });
  }

  doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
}

function checkPageSpace(doc, requiredSpace = 40) {
  if (doc.y + requiredSpace > doc.page.height - doc.page.margins.bottom - 20) {
    doc.addPage();
  }
}

function parseAndRenderMarkdownToPdf(mdPath, pdfPath) {
  const rawText = fs.readFileSync(mdPath, 'utf8');
  const lines = rawText.split(/\r?\n/);

  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  const fileName = path.basename(mdPath, '.md');
  const dirName = path.basename(path.dirname(mdPath));

  // Cover / Header Bar on Page 1
  doc.rect(0, 0, doc.page.width, 12).fill('#0F172A');
  doc.rect(0, 12, doc.page.width, 6).fill('#2563EB');

  doc.y = 45;

  let inCodeBlock = false;
  let codeBuffer = [];
  let inTable = false;
  let tableRows = [];

  const processTable = () => {
    if (tableRows.length === 0) return;

    checkPageSpace(doc, tableRows.length * 20 + 30);

    const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colCount = Math.max(...tableRows.map(r => r.length));
    const colWidth = availableWidth / colCount;

    const startY = doc.y;

    tableRows.forEach((row, rowIdx) => {
      checkPageSpace(doc, 22);
      const isHeader = rowIdx === 0;
      const rowY = doc.y;

      // Row background
      if (isHeader) {
        doc.rect(doc.page.margins.left, rowY, availableWidth, 20).fill('#1E293B');
      } else if (rowIdx % 2 === 1) {
        doc.rect(doc.page.margins.left, rowY, availableWidth, 18).fill('#F8FAFC');
      } else {
        doc.rect(doc.page.margins.left, rowY, availableWidth, 18).fill('#FFFFFF');
      }

      row.forEach((cell, colIdx) => {
        const cellX = doc.page.margins.left + colIdx * colWidth;

        if (isHeader) {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
          doc.text(cell.replace(/\*\*/g, ''), cellX + 6, rowY + 5, {
            width: colWidth - 12,
            ellipsis: true
          });
        } else {
          doc.font('Helvetica').fontSize(8.5).fillColor('#1E293B');
          doc.text(cell.replace(/\*\*/g, ''), cellX + 6, rowY + 4, {
            width: colWidth - 12,
            ellipsis: true
          });
        }
      });

      doc.y = rowY + (isHeader ? 20 : 18);
    });

    // Outer border
    const endY = doc.y;
    doc.rect(doc.page.margins.left, startY, availableWidth, endY - startY).stroke('#CBD5E1');

    doc.moveDown(0.5);
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith('```')) {
      if (inTable) processTable();

      if (inCodeBlock) {
        inCodeBlock = false;

        const codeText = codeBuffer.join('\n');
        const lineCount = codeBuffer.length;
        const padding = 10;
        const lineHeight = 11;
        const boxHeight = lineCount * lineHeight + padding * 2;

        checkPageSpace(doc, Math.min(boxHeight, 250));

        const boxY = doc.y;
        const boxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

        // Code block box
        doc.rect(doc.page.margins.left, boxY, boxWidth, boxHeight)
           .fill('#F1F5F9')
           .stroke('#CBD5E1');

        doc.fillColor('#0F172A').font('Courier').fontSize(8);

        // Render code lines
        codeBuffer.forEach((cLine, idx) => {
          doc.text(cLine, doc.page.margins.left + padding, boxY + padding + idx * lineHeight, {
            width: boxWidth - padding * 2
          });
        });

        doc.y = boxY + boxHeight + 10;
        doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
        codeBuffer = [];
      } else {
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Handle Tables
    if (line.trim().startsWith('|')) {
      if (line.includes('---')) continue; // Skip separator line
      const cells = line.split('|').map(c => c.trim()).slice(1, -1);
      if (cells.length > 0) {
        inTable = true;
        tableRows.push(cells);
        continue;
      }
    } else if (inTable) {
      processTable();
    }

    // Skip empty lines or add natural space
    if (!line.trim()) {
      doc.moveDown(0.2);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      checkPageSpace(doc, 50);
      doc.moveDown(0.6);
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#0F172A');
      doc.text(line.replace(/^#\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.2);
      doc.rect(doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 2).fill('#2563EB');
      doc.moveDown(0.4);
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
    } else if (line.startsWith('## ')) {
      checkPageSpace(doc, 40);
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#1E3A8A');
      doc.text(line.replace(/^##\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.2);
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
    } else if (line.startsWith('### ')) {
      checkPageSpace(doc, 30);
      doc.moveDown(0.4);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0284C7');
      doc.text(line.replace(/^###\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.2);
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
    } else if (line.startsWith('#### ')) {
      checkPageSpace(doc, 25);
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#334155');
      doc.text(line.replace(/^####\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.1);
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      checkPageSpace(doc, 18);
      const cleanLine = line.replace(/^[\*\-]\s+/, '');
      doc.font('Helvetica-Bold').fillColor('#2563EB').fontSize(10);
      doc.text('• ', doc.page.margins.left + 10, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
      renderFormattedText(doc, cleanLine, { indent: 22 });
      doc.moveDown(0.15);
    } else if (/^\d+\.\s+/.test(line)) {
      checkPageSpace(doc, 18);
      const numMatch = line.match(/^(\d+\.)\s+/)[1];
      const cleanLine = line.replace(/^\d+\.\s+/, '');
      doc.font('Helvetica-Bold').fillColor('#2563EB').fontSize(9.5);
      doc.text(`${numMatch} `, doc.page.margins.left + 10, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
      renderFormattedText(doc, cleanLine, { indent: 24 });
      doc.moveDown(0.15);
    } else if (line.startsWith('> ')) {
      checkPageSpace(doc, 30);
      doc.moveDown(0.2);
      const cleanLine = line.replace(/^>\s+/, '');
      const boxY = doc.y;
      const boxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      doc.rect(doc.page.margins.left, boxY, 4, 24).fill('#2563EB');
      doc.rect(doc.page.margins.left + 4, boxY, boxWidth - 4, 24).fill('#EFF6FF');

      doc.fillColor('#1E3A8A').font('Helvetica-Oblique').fontSize(9);
      doc.text(cleanLine.replace(/\*\*/g, ''), doc.page.margins.left + 12, boxY + 6, {
        width: boxWidth - 20
      });

      doc.y = boxY + 28;
      doc.font('Helvetica').fontSize(9.5).fillColor('#1E293B');
    } else if (line.startsWith('---')) {
      checkPageSpace(doc, 15);
      doc.moveDown(0.3);
      doc.rect(doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, 0.5).fill('#CBD5E1');
      doc.moveDown(0.3);
    } else {
      checkPageSpace(doc, 16);
      renderFormattedText(doc, line);
      doc.moveDown(0.15);
    }
  }

  if (inTable) processTable();

  // Add Headers & Footers to all pages
  const range = doc.bufferedPageRange();
  for (let pageIdx = range.start; pageIdx < range.start + range.count; pageIdx++) {
    doc.switchToPage(pageIdx);

    // Top Header on page 2+
    if (pageIdx > 0) {
      doc.fontSize(7.5).fillColor('#94A3B8').font('Helvetica');
      doc.text(`Koala Lo Tiene × Clientum — ${fileName}`, doc.page.margins.left, 20, { align: 'left' });
      doc.rect(doc.page.margins.left, 30, doc.page.width - doc.page.margins.left - doc.page.margins.right, 0.5).fill('#E2E8F0');
    }

    // Bottom Footer on all pages
    doc.rect(doc.page.margins.left, doc.page.height - 35, doc.page.width - doc.page.margins.left - doc.page.margins.right, 0.5).fill('#CBD5E1');
    doc.fontSize(8).fillColor('#64748B').font('Helvetica');
    doc.text(
      `Koala Lo Tiene (LP SRL) — Documentación Oficial PDF (${dirName}/${fileName}.pdf)`,
      doc.page.margins.left,
      doc.page.height - 25,
      { align: 'left' }
    );
    doc.text(
      `Página ${pageIdx + 1} de ${range.count}`,
      doc.page.margins.left,
      doc.page.height - 25,
      { align: 'right' }
    );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

async function convertAllDocs() {
  const mdFiles = getAllMdFiles('./docs');
  console.log(`Encontrados ${mdFiles.length} archivos .md en ./docs`);

  for (const mdPath of mdFiles) {
    const pdfPath = mdPath.replace(/\.md$/, '.pdf');
    console.log(`Convirtiendo: ${mdPath} -> ${pdfPath}`);
    await parseAndRenderMarkdownToPdf(mdPath, pdfPath);
  }

  console.log('¡Conversión completada con éxito!');
}

convertAllDocs().catch(console.error);
