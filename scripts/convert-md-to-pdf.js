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

function parseAndRenderMarkdownToPdf(mdPath, pdfPath) {
  const rawText = fs.readFileSync(mdPath, 'utf8');
  const lines = rawText.split(/\r?\n/);

  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Document Title Header
  const fileName = path.basename(mdPath, '.md');
  const dirName = path.basename(path.dirname(mdPath));

  // Accent Brand Header Bar
  doc.rect(0, 0, doc.page.width, 18).fill('#1E293B');
  doc.rect(0, 18, doc.page.width, 4).fill('#2563EB');

  doc.fillColor('#0F172A');
  doc.moveDown(1.5);

  let inCodeBlock = false;
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Closing code block
        inCodeBlock = false;
        doc.moveDown(0.3);
        const codeText = codeBuffer.join('\n');
        const boxHeight = Math.max(30, codeBuffer.length * 12 + 12);
        
        // Background box for code
        const currentY = doc.y;
        if (currentY + boxHeight > doc.page.height - 50) {
          doc.addPage();
        }
        
        doc.rect(40, doc.y, doc.page.width - 80, boxHeight).fill('#F1F5F9').stroke('#CBD5E1');
        doc.fillColor('#0F172A').font('Courier').fontSize(8.5);
        doc.text(codeText, 48, doc.y - boxHeight + 8, {
          width: doc.page.width - 96
        });
        doc.font('Helvetica').fillColor('#0F172A');
        doc.moveDown(0.5);
        codeBuffer = [];
      } else {
        // Opening code block
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Skip empty lines or handle spacing
    if (!line.trim()) {
      doc.moveDown(0.3);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      doc.moveDown(0.8);
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#1E293B');
      doc.text(line.replace(/^#\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.2);
      doc.rect(40, doc.y, doc.page.width - 80, 1.5).fill('#2563EB');
      doc.moveDown(0.5);
      doc.font('Helvetica').fillColor('#0F172A');
    } else if (line.startsWith('## ')) {
      doc.moveDown(0.6);
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#1E3A8A');
      doc.text(line.replace(/^##\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.3);
      doc.font('Helvetica').fillColor('#0F172A');
    } else if (line.startsWith('### ')) {
      doc.moveDown(0.4);
      doc.font('Helvetica-Bold').fontSize(11.5).fillColor('#0284C7');
      doc.text(line.replace(/^###\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.2);
      doc.font('Helvetica').fillColor('#0F172A');
    } else if (line.startsWith('#### ')) {
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#334155');
      doc.text(line.replace(/^####\s+/, '').replace(/\*\*/g, ''));
      doc.moveDown(0.2);
      doc.font('Helvetica').fillColor('#0F172A');
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      // Bullet items
      doc.fontSize(9.5).font('Helvetica');
      const cleanLine = line.replace(/^[\*\-]\s+/, '');
      doc.fillColor('#2563EB').text('• ', { continued: true });
      doc.fillColor('#0F172A').text(cleanLine.replace(/\*\*/g, ''));
      doc.moveDown(0.15);
    } else if (/^\d+\.\s+/.test(line)) {
      // Numbered items
      doc.fontSize(9.5).font('Helvetica');
      const cleanLine = line.replace(/^\d+\.\s+/, '');
      const numMatch = line.match(/^(\d+\.)\s+/)[1];
      doc.fillColor('#2563EB').text(`${numMatch} `, { continued: true });
      doc.fillColor('#0F172A').text(cleanLine.replace(/\*\*/g, ''));
      doc.moveDown(0.15);
    } else if (line.startsWith('> ')) {
      // Blockquote / Warning box
      doc.moveDown(0.3);
      const cleanLine = line.replace(/^>\s+/, '').replace(/\*\*/g, '');
      doc.rect(40, doc.y, doc.page.width - 80, 22).fill('#FEF3C7').stroke('#F59E0B');
      doc.fillColor('#92400E').font('Helvetica-Oblique').fontSize(9);
      doc.text(cleanLine, 48, doc.y - 17, { width: doc.page.width - 96 });
      doc.font('Helvetica').fillColor('#0F172A');
      doc.moveDown(0.3);
    } else if (line.startsWith('---')) {
      doc.moveDown(0.3);
      doc.rect(40, doc.y, doc.page.width - 80, 0.5).fill('#CBD5E1');
      doc.moveDown(0.3);
    } else if (line.includes('|') && line.trim().startsWith('|')) {
      // Table rows - render as compact text
      if (line.includes('---')) continue;
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#334155');
      doc.text(cells.join('  |  '));
      doc.font('Helvetica').fillColor('#0F172A');
      doc.moveDown(0.1);
    } else {
      // Normal paragraph
      doc.fontSize(9.5).font('Helvetica').fillColor('#0F172A');
      doc.text(line.replace(/\*\*/g, ''), {
        align: 'left',
        lineGap: 2
      });
      doc.moveDown(0.2);
    }
  }

  // Footer on all pages
  const range = doc.bufferedPageRange();
  for (let pageIdx = range.start; pageIdx < range.start + range.count; pageIdx++) {
    doc.switchToPage(pageIdx);
    
    // Bottom line
    doc.rect(40, doc.page.height - 30, doc.page.width - 80, 0.5).fill('#CBD5E1');
    doc.fontSize(8).fillColor('#64748B').font('Helvetica');
    doc.text(
      `Koala Lo Tiene × Clientum — Documento Oficial PDF (${dirName}/${fileName})`,
      40,
      doc.page.height - 22,
      { align: 'left' }
    );
    doc.text(
      `Página ${pageIdx + 1} de ${range.count}`,
      40,
      doc.page.height - 22,
      { align: 'right' }
    );
  }

  doc.end();

  return new Promise((resolve) => {
    writeStream.on('finish', resolve);
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
