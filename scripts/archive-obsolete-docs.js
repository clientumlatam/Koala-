import fs from 'fs';
import path from 'path';

/**
 * Utility script to automatically detect and move obsolete or superseded
 * .md, .pdf, and legacy working files into '/docs/archivo' to keep the
 * documentation directory clean and structured.
 */

const DOCS_DIR = path.resolve('./docs');
const ARCHIVE_DIR = path.resolve('./docs/archivo');

// Explicit list of known superseded or obsolete files
const KNOWN_OBSOLETE_FILES = [
  'Propuesta_Koala_Clientum_2026.pdf',
  'koala-mensaje-y-dns.docx',
  'koala-revision-bundle.docx',
  'WhatsApp Ptt 2026-09-30 at 12.08.07.ogg',
  'WhatsApp Ptt 2026-09-30 at 17.14.58.ogg',
  '00_COMPENDIO_COMERCIAL_UNIFICADO.md',
  '00_COMPENDIO_COMERCIAL_UNIFICADO.pdf',
  '00_COMPENDIO_TECNICO_Y_ERP_UNIFICADO.md',
  '00_COMPENDIO_TECNICO_Y_ERP_UNIFICADO.pdf',
  '00_COMPENDIO_DEMO_Y_MEET_UNIFICADO.md',
  '00_COMPENDIO_DEMO_Y_MEET_UNIFICADO.pdf',
  'propuesta-cotillon.html'
];

// Patterns matching obsolete or draft file names
const OBSOLETE_NAME_PATTERNS = [
  /borrador/i,
  /obsolet/i,
  /deprecated/i,
  /legacy/i,
  /old_/i,
  /draft_/i,
  /v0_/i,
  /v1_old/i,
  /temp_/i
];

// Content markers indicating obsolete markdown documents
const OBSOLETE_CONTENT_MARKERS = [
  '[OBSOLETO]',
  'status: deprecated',
  'status: obsoleto',
  'obsoleto: true',
  'documento superado',
  '[DRAFT_SUPERSEDED]'
];

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Creado directorio de archivo: ${dir}`);
  }
}

function isObsoleteFile(filePath, fileName) {
  // 1. Check known file list
  if (KNOWN_OBSOLETE_FILES.includes(fileName)) {
    return { obsolete: true, reason: 'Incluido en la lista oficial de archivos superseded/obsoletos.' };
  }

  // 2. Check file name patterns
  for (const pattern of OBSOLETE_NAME_PATTERNS) {
    if (pattern.test(fileName)) {
      return { obsolete: true, reason: `El nombre coincide con el patrón de archivo obsoleto: ${pattern}` };
    }
  }

  // 3. Check markdown file content markers
  if (fileName.endsWith('.md')) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const marker of OBSOLETE_CONTENT_MARKERS) {
        if (content.toLowerCase().includes(marker.toLowerCase())) {
          return { obsolete: true, reason: `El contenido contiene la etiqueta de obsolescencia: "${marker}"` };
        }
      }
    } catch (err) {
      console.error(`⚠️ Error al leer archivo ${filePath}:`, err.message);
    }
  }

  return { obsolete: false };
}

export function scanAndArchiveDocs() {
  console.log('🔍 Iniciando escaneo de documentación en /docs/...');
  ensureDirectoryExists(ARCHIVE_DIR);

  let movedCount = 0;
  let scannedCount = 0;

  function traverseDir(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip the archive folder itself
        if (path.resolve(fullPath) === ARCHIVE_DIR || item === 'archivo' || item === 'obsoletos') {
          continue;
        }
        traverseDir(fullPath);
      } else if (stat.isFile()) {
        scannedCount++;
        const check = isObsoleteFile(fullPath, item);

        if (check.obsolete) {
          const destPath = path.join(ARCHIVE_DIR, item);

          // Avoid overwriting if file exists with same name
          let finalDestPath = destPath;
          if (fs.existsSync(destPath) && destPath !== fullPath) {
            const ext = path.extname(item);
            const base = path.basename(item, ext);
            finalDestPath = path.join(ARCHIVE_DIR, `${base}_${Date.now()}${ext}`);
          }

          if (fullPath !== finalDestPath) {
            fs.renameSync(fullPath, finalDestPath);
            movedCount++;
            console.log(`📦 [MOVIDO -> /docs/archivo/]: ${path.relative(DOCS_DIR, fullPath)}`);
            console.log(`   └─ Motivo: ${check.reason}`);
          }
        }
      }
    }
  }

  traverseDir(DOCS_DIR);

  console.log('--------------------------------------------------');
  console.log(`✅ Escaneo completado. Total examinados: ${scannedCount} archivos.`);
  if (movedCount > 0) {
    console.log(`🚀 Se movieron ${movedCount} archivos obsoletos a /docs/archivo/`);
  } else {
    console.log(`✨ La estructura de documentación está limpia. No se encontraron archivos obsoletos fuera de /docs/archivo/`);
  }
}

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('archive-obsolete-docs.js')) {
  scanAndArchiveDocs();
}
