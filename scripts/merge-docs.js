import fs from 'fs';
import path from 'path';

/**
 * Script to automatically merge and fuse markdown files from each subfolder
 * into unified compendium documents and a single Master Document for Koala.
 */

const DOCS_DIR = path.resolve('./docs');

const MODULES = [
  {
    folder: '01-comercial',
    outputFile: '00_COMPENDIO_COMERCIAL_UNIFICADO.md',
    title: 'COMPENDIO MÓDULO COMERCIAL Y ESTRATÉGICO — KOALA × CLIENTUM',
    subtitle: 'Propuestas Unificadas, Cartas de Oferta, Análisis de Inversión y Plan de Implementación'
  },
  {
    folder: '02-tecnico-y-erp',
    outputFile: '00_COMPENDIO_TECNICO_Y_ERP_UNIFICADO.md',
    title: 'COMPENDIO MÓDULO TÉCNICO, ERP Y DNS — KOALA × CLIENTUM',
    subtitle: 'Manual de Integración API REST, Sincronización 0s, Planilla DNS e Infraestructura ICXN'
  },
  {
    folder: '03-presentacion-demo',
    outputFile: '00_COMPENDIO_DEMO_Y_MEET_UNIFICADO.md',
    title: 'COMPENDIO MÓDULO DEMO Y PRESENTACIÓN EN VIVO — KOALA × CLIENTUM',
    subtitle: 'Guía Cronometrada de Demostración y Checklist de Framing'
  }
];

function mergeSubfolder(moduleInfo) {
  const folderPath = path.join(DOCS_DIR, moduleInfo.folder);
  if (!fs.existsSync(folderPath)) return null;

  const files = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.md') && !f.startsWith('00_'))
    .sort();

  let combinedContent = `# ${moduleInfo.title}\n\n`;
  combinedContent += `**${moduleInfo.subtitle}**  \n`;
  combinedContent += `*Documento Integrado Generado Automáticamente • Koala Lo Tiene (LP SRL)*  \n\n`;
  combinedContent += `---\n\n## Índice de Contenidos Integrados\n\n`;

  files.forEach((file, idx) => {
    const titleClean = file.replace(/\.md$/, '').replace(/^\d+_[a-z0-9_]+_/, '').replace(/_/g, ' ').toUpperCase();
    combinedContent += `${idx + 1}. **[Capítulo ${idx + 1}: ${file}](#capitulo-${idx + 1})**\n`;
  });

  combinedContent += `\n---\n\n`;

  files.forEach((file, idx) => {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    combinedContent += `<a id="capitulo-${idx + 1}"></a>\n\n`;
    combinedContent += `# CAPÍTULO ${idx + 1}: ${file.toUpperCase()}\n\n`;
    combinedContent += content;
    combinedContent += `\n\n---\n\n`;
  });

  const targetPath = path.join(folderPath, moduleInfo.outputFile);
  fs.writeFileSync(targetPath, combinedContent, 'utf-8');
  console.log(`✅ Creado compendio unificado: ${targetPath}`);
  return { path: targetPath, content: combinedContent, folder: moduleInfo.folder };
}

function generateFullMasterDoc(results) {
  let masterContent = `# DOCUMENTO MAESTRO INTEGRAL DE TRANSFORMACIÓN DIGITAL — KOALA LO TIENE (LP SRL)\n\n`;
  masterContent += `**Manual Holístico Comercial, Técnico, Operativo y de Demostración**  \n`;
  masterContent += `*Proyecto de E-Commerce, Integración ERP ICXN (0s), Bots con IA y Migración DNS*  \n`;
  masterContent += `*Cliente: Koala Cotillón (LP SRL - Mikhail Murekian / Milton) • Desarrollo: Clientum (Patagonia)*  \n\n`;
  masterContent += `---\n\n## Estructura General del Documento Maestro\n\n`;
  masterContent += `1. **Módulo 1: Comercial, Propuestas e Inversión**\n`;
  masterContent += `2. **Módulo 2: Especificación Técnica, ERP ICXN y Migración DNS**\n`;
  masterContent += `3. **Módulo 3: Presentación, Guión de Demo y Framing**\n\n`;
  masterContent += `---\n\n`;

  results.forEach((res, idx) => {
    if (res && res.content) {
      masterContent += `\n\n# SECCIÓN MASTER ${idx + 1}: MÓDULO ${res.folder.toUpperCase()}\n\n`;
      masterContent += res.content;
      masterContent += `\n\n================================================================================\n\n`;
    }
  });

  const masterPath = path.join(DOCS_DIR, 'DOCUMENTO_MAESTRO_COMPLETO_KOALA.md');
  fs.writeFileSync(masterPath, masterContent, 'utf-8');
  console.log(`🚀 Creado Documento Maestro Completo: ${masterPath}`);
}

function runMerge() {
  console.log('🔄 Iniciando fusión de documentos Markdown por subcarpeta...');
  const results = MODULES.map(mergeSubfolder);
  generateFullMasterDoc(results);
  console.log('✨ Fusión completada con éxito.');
}

runMerge();
