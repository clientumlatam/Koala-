import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  Database, 
  Clock, 
  Eye, 
  X,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  LogOut,
  UserCheck,
  KeyRound,
  AlertCircle,
  Download,
  FileDown,
  Loader2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { DOCUMENTATION_DATA, DocItem } from '../data/docsContent';
import { KoalaLogo } from './KoalaLogo';
import { PipelineDiagramViewer } from './PipelineDiagramViewer';
import { DnsMigrationViewer } from './DnsMigrationViewer';
import { EmployeeUser } from '../types';
import { INITIAL_EMPLOYEES } from '../data/adminData';

interface DocumentationViewerProps {
  initialDocId?: string;
  currentUser?: EmployeeUser | null;
  onLoginAsClientum?: () => void;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ 
  initialDocId, 
  currentUser 
}) => {
  // Current active user (prop takes precedence, then local storage fallback)
  const [activeUser, setActiveUser] = useState<EmployeeUser | null>(() => {
    if (currentUser) return currentUser;
    try {
      const saved = localStorage.getItem('koala_employee_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser !== undefined) {
      setActiveUser(currentUser);
    }
  }, [currentUser]);

  // Soporte Clientum / Backend & Integraciones ERP access is enabled passwordlessly
  const isClientumSupport = true;

  // Authentication modal state (kept closed as access is passwordless)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('soporte@clientum.com.ar');
  const [loginPassword, setLoginPassword] = useState('clientum');
  const [authError, setAuthError] = useState<string | null>(null);

  // Default initial document: if clientum support, default to propuesta-unificada; otherwise pipeline-omnicanal-unificado
  const getSafeInitialDocId = (): string => {
    if (initialDocId) {
      const found = DOCUMENTATION_DATA.find(d => d.id === initialDocId);
      if (found) {
        if (!found.requiresClientumSupport || isClientumSupport) {
          return initialDocId;
        }
      }
    }
    return isClientumSupport ? 'propuesta-unificada' : 'pipeline-omnicanal-unificado';
  };

  const [selectedDocId, setSelectedDocId] = useState<string>(getSafeInitialDocId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clientum_exclusivo' | 'pipeline' | 'backend' | 'comercial' | 'tecnico' | 'demo'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printScope, setPrintScope] = useState<'single' | 'all'>('single');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Keep selected document in sync if access changes
  useEffect(() => {
    const currentDoc = DOCUMENTATION_DATA.find(d => d.id === selectedDocId);
    if (currentDoc?.requiresClientumSupport && !isClientumSupport) {
      // If user is not authorized for current doc, switch to safe public doc
      setSelectedDocId('pipeline-omnicanal-unificado');
    }
  }, [isClientumSupport, selectedDocId]);

  // Filter documents: strictly hide sensitive Mikhail/LP SRL docs if not Soporte Clientum
  const accessibleDocs = DOCUMENTATION_DATA.filter((doc) => {
    if (doc.requiresClientumSupport && !isClientumSupport) {
      return false;
    }
    return true;
  });

  const filteredDocs = accessibleDocs.filter((doc) => {
    let matchesCategory = true;
    if (selectedCategory === 'clientum_exclusivo') {
      matchesCategory = Boolean(doc.requiresClientumSupport);
    } else if (selectedCategory !== 'all') {
      matchesCategory = doc.category === selectedCategory;
    }

    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedDoc = DOCUMENTATION_DATA.find((d) => d.id === selectedDocId) || accessibleDocs[0] || DOCUMENTATION_DATA[0];
  const isSelectedDocRestricted = selectedDoc.requiresClientumSupport && !isClientumSupport;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handlePrint = (scope: 'single' | 'all' = 'single') => {
    setPrintScope(scope);
    setIsPrintModalOpen(true);
  };

  // Direct client-side PDF download using html2pdf.js
  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById('printable-pdf-content');
      if (!element) {
        handlePrintInNewWindow();
        return;
      }

      // Import html2pdf dynamically and cast as any to bypass TS module callable union issue
      const html2pdfModule = await import('html2pdf.js');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

      const fileName = printScope === 'all'
        ? 'Dossier_Completo_11_Docs_Koala.pdf'
        : `${selectedDoc.id}_Koala.pdf`;

      const opt = {
        margin: [10, 10, 10, 10],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.page-break-before' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('html2pdf export error, falling back to window print popup:', err);
      handlePrintInNewWindow();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Fallback: Opens a clean printable window bypassing iframe restrictions
  const handlePrintInNewWindow = () => {
    const element = document.getElementById('printable-pdf-content');
    if (!element) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=950,height=1000');
    if (!printWindow) {
      window.print();
      return;
    }

    const docTitle = printScope === 'all'
      ? 'Dossier Completo 11 Docs - Koala Lo Tiene'
      : `${selectedDoc.title} - Koala Lo Tiene`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${docTitle}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #ffffff; color: #0f172a; padding: 24px; }
            .page-break-before { page-break-before: always; }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="max-w-3xl mx-auto">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 600);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Download individual document as Markdown (.md)
  const handleDownloadMarkdown = (doc: DocItem) => {
    const markdownContent = `# ${doc.title}
*${doc.subtitle}*

> **Categoría:** ${doc.categoryLabel} | **Última Actualización:** ${doc.lastUpdated} | **DOC-ID:** ${doc.id.toUpperCase()}
> **Resumen Ejecutivo:** ${doc.summary}

---

${doc.content}

${doc.copyableText ? `\n---\n### Plantilla / Texto de Trabajo\n\`\`\`\n${doc.copyableText}\n\`\`\`\n` : ''}

---
*Plataforma Omnicanal Clientum × Koala Lo Tiene (General Roca & Neuquén)*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all accessible documents in a single consolidated Markdown file
  const handleDownloadAllMarkdown = () => {
    let consolidatedMarkdown = `# Dossier Completo de Documentación (11 Documentos) — Koala Lo Tiene × Clientum
*Plataforma Omnicanal, Agentes IA, Servidor MCP & Estrategia Comercial*
*Fecha de Exportación: Septiembre 2026*

---

## Índice del Dossier
${accessibleDocs.map((doc, idx) => `${idx + 1}. **[${doc.title}](#doc-${doc.id})** — *${doc.categoryLabel}*`).join('\n')}

---

`;

    accessibleDocs.forEach((doc, idx) => {
      consolidatedMarkdown += `<a id="doc-${doc.id}"></a>\n\n# ${idx + 1}. ${doc.title}\n*${doc.subtitle}*\n\n`;
      consolidatedMarkdown += `**Categoría:** ${doc.categoryLabel} | **Última Actualización:** ${doc.lastUpdated} | **DOC-ID:** ${doc.id.toUpperCase()}\n`;
      consolidatedMarkdown += `> **Resumen Ejecutivo:** ${doc.summary}\n\n`;
      consolidatedMarkdown += `${doc.content}\n\n`;
      if (doc.copyableText) {
        consolidatedMarkdown += `### Plantilla / Texto de Trabajo\n\`\`\`\n${doc.copyableText}\n\`\`\`\n\n`;
      }
      consolidatedMarkdown += `\n---\n\n`;
    });

    consolidatedMarkdown += `*Fin del Dossier Completo de Documentación — Clientum × Koala Lo Tiene*\n`;

    const blob = new Blob([consolidatedMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dossier_Completo_11_Docs_Koala.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleQuickLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const clientumUser = INITIAL_EMPLOYEES.find(
      emp => emp.email.toLowerCase() === loginEmail.toLowerCase().trim() && emp.password === loginPassword
    );

    if (clientumUser) {
      localStorage.setItem('koala_employee_user', JSON.stringify(clientumUser));
      setActiveUser(clientumUser);
      setIsAuthModalOpen(false);
      setSelectedDocId('propuesta-unificada');
    } else {
      setAuthError('Credenciales incorrectas. Verifique correo y contraseña.');
    }
  };

  const handleQuickLogout = () => {
    localStorage.removeItem('koala_employee_user');
    setActiveUser(null);
    setSelectedDocId('pipeline-omnicanal-unificado');
    setSelectedCategory('all');
  };

  const renderDocContentForPDF = (docItem: DocItem, index: number = 0) => {
    return (
      <div key={docItem.id} className={index > 0 ? "page-break-before pt-8 border-t-2 border-slate-300 mt-10" : ""}>
        {/* Header Block */}
        <div className="border-b border-slate-200 pb-5 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <KoalaLogo size="md" />
              <div className="border-l border-slate-200 pl-4">
                <span className="text-xs font-bold text-orange-600 block">Clientum × Koala Lo Tiene</span>
                <span className="text-[11px] text-slate-500 font-medium">Plataforma Omnicanal & ERP</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 inline-block">
                {docItem.lastUpdated}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono mt-1">
                DOC-REF: {docItem.id.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              {docItem.categoryLabel}
            </span>
            {docItem.badge && (
              <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {docItem.badge}
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-medium ml-auto">
              Tiempo de lectura: {docItem.readTime}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {docItem.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
            {docItem.subtitle}
          </p>
        </div>

        {/* Executive Summary Box */}
        <div className="mb-6 p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 text-xs leading-relaxed text-slate-700">
          <div className="font-bold text-orange-950 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
            RESUMEN EJECUTIVO:
          </div>
          <p className="text-slate-700">{docItem.summary}</p>
        </div>

        {/* Document Specific Custom Layouts */}
        {docItem.id === 'propuesta-unificada' ? (
          <div className="mb-8 space-y-6">
            {/* Diagnóstico */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
              <div className="font-bold text-slate-900 mb-1">DIAGNÓSTICO DE SITUACIÓN:</div>
              El principal dolor de Koala Cotillón es la baja visibilidad y conversión en canales digitales. Quien busca cotillón, globos, polietileno o descartables en Google en el Alto Valle no encuentra a Koala entre los primeros resultados.
              <ul className="list-disc list-inside mt-2 space-y-0.5 text-slate-600">
                <li>Ausencia de posicionamiento orgánico en buscadores (SEO).</li>
                <li>Sin e-commerce propio con catálogo actualizado en tiempo real.</li>
                <li>Atención a consultas online sin automatización — cuellos de botella en horarios pico.</li>
                <li>Canales sociales activos (Instagram, Facebook) sin integración fluida al flujo de ventas.</li>
              </ul>
            </div>

            {/* Plan Modular 3 Etapas */}
            <div className="space-y-2.5">
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs text-slate-900">1. E-commerce + Catálogo íntegro + SEO orgánico</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">~15–17 días</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sitio web con e-commerce completo y catálogo íntegro. Fotos, descripciones y categorías cargadas. Stock sincronizado. Estrategia SEO orgánico con palabras clave. Alta y optimización en Google Business Profile.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs text-slate-900">2. Integración con ERP y Reserva Atómica</h4>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">A convenir según ERP</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Conexión bidireccional entre el ERP y el e-commerce. Precios y stock actualizados automáticamente. Reserva temporal de stock en tiempo real (15 min) para prevenir conflictos de venta simultánea en mostrador vs. online.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs text-slate-900">3. Bot Web + Bot WhatsApp con Servidor MCP</h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">A convenir</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Chatbot integrado en la página web para atención 24/7. Derivación automática hacia WhatsApp Business del local correspondiente. Servidor MCP para consultar stock y precios en tiempo real sin alucinaciones.
                </p>
              </div>
            </div>

            {/* Tabla de inversión Comparativa - 3 Opciones */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs bg-white shadow-xs">
              <div className="bg-slate-900 text-white px-4 py-3 font-bold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <div>
                  <span className="text-sm block">Estructura de Inversión — Comparativa de 3 Opciones</span>
                  <span className="text-[10px] font-normal text-slate-300">LP SRL · Koala Cotillón, Descartables & Polietileno</span>
                </div>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded font-semibold">
                  Valores sin IVA · Validez 15 días
                </span>
              </div>

              {/* Grid de 3 tarjetas de opciones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 border-b border-slate-200">
                {/* Opción 1: Inicial */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Opción 1</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Base Histórico</span>
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-900 mb-2">Inicial / Mínimo</h5>
                    <div className="mb-2">
                      <span className="text-[10px] text-slate-500 block">Setup Pack Completo:</span>
                      <span className="text-lg font-black text-slate-900">$ 1.120.000</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                      <div><strong>Etapa 1:</strong> $ 518.000</div>
                      <div><strong>Etapa 2:</strong> $ 414.400</div>
                      <div><strong>Etapa 3:</strong> $ 187.600</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 bg-slate-50 p-2 rounded text-[11px]">
                    <span className="text-[10px] text-slate-500 block">Abono Mensual:</span>
                    <span className="font-bold text-slate-800">$ 267.000 / $ 310.800</span>
                  </div>
                </div>

                {/* Opción 2: Intermedia (Medio) */}
                <div className="bg-gradient-to-b from-amber-50/60 to-white p-3.5 rounded-lg border-2 border-amber-400 shadow-xs flex flex-col justify-between relative">
                  <span className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                    Punto Medio Recomendado
                  </span>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Opción 2</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Equilibrada</span>
                    </div>
                    <h5 className="font-extrabold text-sm text-amber-950 mb-2">Intermedia (Medio)</h5>
                    <div className="mb-2">
                      <span className="text-[10px] text-amber-800 block font-medium">Setup Pack Completo:</span>
                      <span className="text-lg font-black text-amber-900">$ 2.785.000</span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-1 pt-2 border-t border-amber-100">
                      <div><strong>Etapa 1:</strong> $ 1.334.000</div>
                      <div><strong>Etapa 2:</strong> $ 1.032.200</div>
                      <div><strong>Etapa 3:</strong> $ 668.800</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200/60 bg-amber-100/50 p-2 rounded text-[11px]">
                    <span className="text-[10px] text-amber-800 block font-medium">Abono Mensual:</span>
                    <span className="font-bold text-amber-950">$ 578.500 / $ 680.400</span>
                  </div>
                </div>

                {/* Opción 3: Premium Mercado Actual */}
                <div className="bg-white p-3.5 rounded-lg border border-orange-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-orange-700 uppercase tracking-wider">Opción 3</span>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">Escala Completa</span>
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-900 mb-2">Mercado Actual</h5>
                    <div className="mb-2">
                      <span className="text-[10px] text-slate-500 block">Setup Pack Completo:</span>
                      <span className="text-lg font-black text-orange-950">$ 4.450.000</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                      <div><strong>Etapa 1:</strong> $ 2.150.000</div>
                      <div><strong>Etapa 2:</strong> $ 1.650.000</div>
                      <div><strong>Etapa 3:</strong> $ 1.150.000</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 bg-orange-50/60 p-2 rounded text-[11px]">
                    <span className="text-[10px] text-orange-800 block">Abono Mensual:</span>
                    <span className="font-bold text-orange-950">$ 890.000 / $ 1.050.000</span>
                  </div>
                </div>
              </div>

              {/* Tabla Comparativa Desglosada */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Etapa / Servicio</th>
                      <th className="p-2.5 text-slate-700">Opción 1 (Inicial)</th>
                      <th className="p-2.5 text-amber-900 bg-amber-50/80">Opción 2 (Intermedia)</th>
                      <th className="p-2.5 text-orange-900">Opción 3 (Mercado)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Etapa 1 — E-commerce + SEO</td>
                      <td className="p-2.5 text-slate-700 font-semibold">$ 518.000</td>
                      <td className="p-2.5 text-amber-900 font-bold bg-amber-50/30">$ 1.334.000</td>
                      <td className="p-2.5 text-slate-800 font-semibold">$ 2.150.000</td>
                    </tr>
                    <tr className="text-[10px] text-slate-500 bg-slate-50/50">
                      <td className="p-2 pl-4 italic">Abono Mantenimiento Etapa 1</td>
                      <td className="p-2">$ 104.000 / $ 133.200</td>
                      <td className="p-2 bg-amber-50/20 font-medium text-amber-900">$ 242.000 / $ 296.600</td>
                      <td className="p-2">$ 380.000 / $ 460.000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Etapa 2 — Integración ERP</td>
                      <td className="p-2.5 text-slate-700 font-semibold">$ 414.400</td>
                      <td className="p-2.5 text-amber-900 font-bold bg-amber-50/30">$ 1.032.200</td>
                      <td className="p-2.5 text-slate-800 font-semibold">$ 1.650.000</td>
                    </tr>
                    <tr className="text-[10px] text-slate-500 bg-slate-50/50">
                      <td className="p-2 pl-4 italic">Abono Mantenimiento Etapa 2</td>
                      <td className="p-2">$ 86.000 / $ 111.000</td>
                      <td className="p-2 bg-amber-50/20 font-medium text-amber-900">$ 203.000 / $ 250.500</td>
                      <td className="p-2">$ 320.000 / $ 390.000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Etapa 3 — Bots Web + WhatsApp</td>
                      <td className="p-2.5 text-slate-700 font-semibold">$ 187.600</td>
                      <td className="p-2.5 text-amber-900 font-bold bg-amber-50/30">$ 668.800</td>
                      <td className="p-2.5 text-slate-800 font-semibold">$ 1.150.000</td>
                    </tr>
                    <tr className="text-[10px] text-slate-500 bg-slate-50/50">
                      <td className="p-2 pl-4 italic">Abono Mantenimiento Etapa 3</td>
                      <td className="p-2">$ 77.000 / $ 66.600</td>
                      <td className="p-2 bg-amber-50/20 font-medium text-amber-900">$ 183.500 / $ 208.300</td>
                      <td className="p-2">$ 290.000 / $ 350.000</td>
                    </tr>
                    <tr className="bg-orange-50/80 font-bold text-slate-900 border-t-2 border-orange-200">
                      <td className="p-2.5 font-extrabold text-orange-950">PACK COMPLETO SUGERIDO</td>
                      <td className="p-2.5 font-bold text-slate-900">$ 1.120.000</td>
                      <td className="p-2.5 font-black text-amber-950 text-xs bg-amber-100/60">$ 2.785.000</td>
                      <td className="p-2.5 font-extrabold text-orange-950 text-xs">$ 4.450.000</td>
                    </tr>
                    <tr className="bg-orange-100/40 text-[10px] font-bold text-slate-800">
                      <td className="p-2 pl-4">Abono Mensual Pack Completo</td>
                      <td className="p-2">$ 267.000 / $ 310.800</td>
                      <td className="p-2 bg-amber-100/50 text-amber-950 font-bold">$ 578.500 / $ 680.400</td>
                      <td className="p-2 text-orange-950 font-bold">$ 890.000 / $ 1.050.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 space-y-6">
            {/* Interactive diagram for pipeline documents */}
            {(docItem.id === 'pipeline-omnicanal-unificado' || docItem.category === 'pipeline') && (
              <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <PipelineDiagramViewer />
              </div>
            )}

            {/* Copyable text snippet preview if applicable */}
            {docItem.copyableText && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                <div className="text-xs font-bold text-orange-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Texto de Presentación / Formulario
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800 max-h-60">
                  {docItem.copyableText}
                </pre>
              </div>
            )}

            {/* Formatted Markdown Body for Document */}
            <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-xl prose-h2:text-base prose-h3:text-sm prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-table:text-xs">
              {docItem.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('# ')) {
                  return (
                    <h2 key={idx} className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-1.5 mt-5 mb-2.5">
                      {trimmed.replace('# ', '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h3 key={idx} className="text-sm font-bold text-slate-900 mt-4 mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      {trimmed.replace('## ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="text-xs font-bold uppercase tracking-wider text-slate-800 mt-3.5 mb-1">
                      {trimmed.replace('### ', '')}
                    </h4>
                  );
                }
                if (trimmed.startsWith('```')) {
                  const codeLines = trimmed.replace(/```[a-z]*/g, '').trim();
                  return (
                    <pre key={idx} className="my-2.5 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
                      <code>{codeLines}</code>
                    </pre>
                  );
                }
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n');
                  return (
                    <ul key={idx} className="my-2 space-y-1 list-disc list-inside text-xs text-slate-700">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="leading-relaxed">
                          {item.replace(/^(\*|-)\s+/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (trimmed.startsWith('|')) {
                  const rows = trimmed.split('\n');
                  return (
                    <div key={idx} className="my-3 overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <tbody>
                          {rows.map((row, rowIdx) => {
                            if (row.includes('---')) return null;
                            const cols = row.split('|').filter((c) => c.trim().length > 0);
                            const isHeader = rowIdx === 0;
                            return (
                              <tr key={rowIdx} className={isHeader ? 'bg-slate-100 font-bold border-b border-slate-200' : 'border-b border-slate-100 hover:bg-slate-50'}>
                                {cols.map((col, colIdx) => (
                                  <td key={colIdx} className="p-2 text-slate-700">
                                    {col.trim()}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="my-1.5 text-xs text-slate-700 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Document Footer & Signatures Block */}
        <div className="pt-6 border-t border-slate-200 mt-8 grid grid-cols-2 gap-6 text-center text-xs">
          <div className="border-t border-slate-300 pt-2">
            <p className="font-bold text-slate-800">Clientum Argentina</p>
            <p className="text-[10px] text-slate-500">Automatización, ERP & Agentes IA</p>
            <p className="text-[9px] text-slate-400 mt-0.5">clientum.com.ar · General Roca & Neuquén</p>
          </div>
          <div className="border-t border-slate-300 pt-2">
            <p className="font-bold text-slate-800">Plataforma Koala Lo Tiene</p>
            <p className="text-[10px] text-slate-500">Documentación Oficial del Sistema</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Emisión: Septiembre 2026</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[680px] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
      {/* Sidebar: Documents list */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
        
        {/* Top Header & Role Status Banner */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Dossier del Proyecto</h3>
                <p className="text-[11px] text-slate-500">Documentación & Propuestas</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              {accessibleDocs.length} Docs
            </span>
          </div>

          {/* Role Access Indicator Pill */}
          <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-indigo-950 block text-[11px] leading-tight">Soporte Clientum</span>
                <span className="text-[10px] text-indigo-600 font-medium">Backend & Integraciones ERP (Acceso Directo)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar en el dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({accessibleDocs.length})
            </button>

            {isClientumSupport && (
              <button
                onClick={() => setSelectedCategory('clientum_exclusivo')}
                className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedCategory === 'clientum_exclusivo'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-500" /> Propuestas & Respuestas ({accessibleDocs.filter(d => d.requiresClientumSupport).length})
              </button>
            )}

            <button
              onClick={() => setSelectedCategory('pipeline')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'pipeline'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setSelectedCategory('backend')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'backend'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Módulos Backend
            </button>

            {isClientumSupport && (
              <>
                <button
                  onClick={() => setSelectedCategory('comercial')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'comercial'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Comercial
                </button>
                <button
                  onClick={() => setSelectedCategory('demo')}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'demo'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Demo Meet
                </button>
              </>
            )}
            
            <button
              onClick={() => setSelectedCategory('tecnico')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'tecnico'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Técnico ERP
            </button>
          </div>
        </div>

        {/* Bulk Export Banner for All 11 Docs */}
        <div className="px-3 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between gap-1 text-[11px]">
          <span className="font-bold text-slate-700">Dossier ({accessibleDocs.length}):</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadAllMarkdown}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              title="Descargar todos los documentos compilados en un único archivo Markdown (.md)"
            >
              <Download className="w-3 h-3 text-emerald-600" />
              <span>{accessibleDocs.length} Docs .md</span>
            </button>
            <button
              onClick={() => handlePrint('all')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors cursor-pointer shadow-2xs"
              title="Vista previa e impresión PDF del Dossier Completo (11 Documentos)"
            >
              <Printer className="w-3 h-3" />
              <span>Dossier PDF</span>
            </button>
          </div>
        </div>

        {/* List of accessible documents */}
        <div className="flex-1 max-h-52 sm:max-h-64 lg:max-h-none overflow-y-auto divide-y divide-slate-100">
          {filteredDocs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No se encontraron documentos con el criterio seleccionado.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDoc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      const readerEl = document.getElementById('doc-reader-pane');
                      if (readerEl) {
                        readerEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? doc.requiresClientumSupport 
                        ? 'bg-indigo-50/70 border-l-4 border-indigo-600 pl-3' 
                        : 'bg-orange-50/70 border-l-4 border-orange-500 pl-3'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 truncate">
                      {doc.categoryLabel}
                    </span>
                    {doc.requiresClientumSupport ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1 shrink-0">
                        <Lock className="w-2.5 h-2.5" /> Soporte Clientum
                      </span>
                    ) : doc.badge ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {doc.badge}
                      </span>
                    ) : null}
                  </div>
                  <h4 className={`text-xs font-bold leading-snug ${isSelected ? (doc.requiresClientumSupport ? 'text-indigo-950' : 'text-orange-950') : 'text-slate-900'}`}>
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {doc.readTime}
                    </span>
                    <span>{doc.lastUpdated}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Bottom Banner: PDF / Print Action */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Ver Propuesta Imprimible (PDF)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="doc-reader-pane" className="flex-1 flex flex-col bg-white overflow-hidden">
        {isSelectedDocRestricted ? (
          /* Access Restricted Shield Screen */
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                Documento Restringido
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-3 mb-1.5">
                Exclusivo para Soporte Clientum
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Este documento contiene información estratégica, presupuestos y plantillas comerciales para <strong>Mikhail Murekian (LP SRL)</strong>. Solo es accesible para la cuenta de soporte técnico con rol <strong>Backend e Integraciones</strong> (<code className="text-indigo-600 font-mono text-[11px]">soporte@clientum.com.ar</code>).
              </p>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" /> Desbloquear con Soporte Clientum
              </button>

              <button
                onClick={() => setSelectedDocId('pipeline-omnicanal-unificado')}
                className="w-full mt-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Ver Documentación Pública
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Document Header Bar */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    selectedDoc.requiresClientumSupport 
                      ? 'text-indigo-700 bg-indigo-50 border-indigo-200' 
                      : 'text-orange-600 bg-orange-50 border-orange-200'
                  }`}>
                    {selectedDoc.categoryLabel}
                  </span>
                  {selectedDoc.requiresClientumSupport && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" /> Backend e Integraciones Clientum
                    </span>
                  )}
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">Lectura: {selectedDoc.readTime}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{selectedDoc.lastUpdated}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedDoc.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {selectedDoc.id === 'dns-migracion-cloudflare-koala' && (
                  <a
                    href="/koalalotiene_dns_migracion_cloudflare.xlsx"
                    download="koalalotiene_dns_migracion_cloudflare.xlsx"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer active:scale-95"
                    title="Descargar libro Excel con 4 hojas: Registros DNS, Checklist, Mensajes y Servidores"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Descargar Excel (.xlsx)</span>
                  </a>
                )}

                <button
                  onClick={() => handleDownloadMarkdown(selectedDoc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer active:scale-95"
                  title="Descargar este documento en formato Markdown (.md)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Descargar .md</span>
                </button>

                {selectedDoc.copyableText && (
                  <button
                    onClick={() => handleCopy(selectedDoc.copyableText!, selectedDoc.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200 cursor-pointer"
                  >
                    {copiedId === selectedDoc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => handlePrint('single')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Vista previa e impresión PDF de este documento"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
              <div className="max-w-3xl mx-auto">
                {/* Confidentiality Notice if Clientum Doc */}
                {selectedDoc.requiresClientumSupport && (
                  <div className="mb-6 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/90 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-indigo-950 font-medium">
                        <strong>Documento Interno Clientum</strong> — Propuesta y acuerdos para Mikhail Murekian (LP SRL).
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                      Confidencial
                    </span>
                  </div>
                )}

                {/* Quick summary alert */}
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 mb-0.5">Resumen Ejecutivo del Documento</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedDoc.summary}</p>
                  </div>
                </div>

                {/* If Pipeline document: show interactive visual architecture diagram */}
                {(selectedDoc.id === 'pipeline-omnicanal-unificado' || selectedDoc.category === 'pipeline') && (
                  <PipelineDiagramViewer />
                )}

                {/* If DNS Migration document: show interactive DNS & Excel table viewer */}
                {selectedDoc.id === 'dns-migracion-cloudflare-koala' && (
                  <DnsMigrationViewer />
                )}

                {/* If Backend modules document: show module indicator bar */}
                {selectedDoc.category === 'backend' && (
                  <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-indigo-600" /> Los 13 Módulos del Backend Koala Lo Tiene
                      </h5>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        ERP & Integraciones
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        '1. Salud ERP',
                        '2. MCP Server v1.0',
                        '3. Analytics KPIs',
                        '4. Inventario DEP-01/02',
                        '5. Traspasos Ruta 22',
                        '6. Precios & CSV',
                        '7. Cotizaciones',
                        '8. Facturación AFIP',
                        '9. Personal RBAC',
                        '10. Config ERP',
                        '11. Cron Jobs',
                        '12. Tester API',
                        '13. Social Commerce'
                      ].map((modName, idx) => (
                        <span key={idx} className="text-[11px] font-medium px-2 py-1 rounded-md bg-white border border-indigo-200 text-indigo-900 shadow-xs">
                          {modName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* If copyable email or text preview */}
                {selectedDoc.copyableText && (
                  <div className="mb-6 p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Texto Listo para Enviar / Pegar
                      </span>
                      <button
                        onClick={() => handleCopy(selectedDoc.copyableText!, selectedDoc.id)}
                        className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedId === selectedDoc.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedId === selectedDoc.id ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-80 border border-slate-800">
                      {selectedDoc.copyableText}
                    </pre>
                  </div>
                )}

                {/* Formatted Markdown Content */}
                <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h1:text-xl prose-h2:text-base prose-h3:text-sm prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-table:text-xs">
                  {selectedDoc.content.split('\n\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;

                    if (trimmed.startsWith('# ')) {
                      return (
                        <h2 key={idx} className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-2 mt-6 mb-3">
                          {trimmed.replace('# ', '')}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h3 key={idx} className="text-base font-bold text-slate-900 mt-5 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          {trimmed.replace('## ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-4 mb-1.5">
                          {trimmed.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (trimmed.startsWith('```')) {
                      const codeLines = trimmed.replace(/```[a-z]*/g, '').trim();
                      return (
                        <pre key={idx} className="my-3 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
                          <code>{codeLines}</code>
                        </pre>
                      );
                    }
                    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                      const items = trimmed.split('\n');
                      return (
                        <ul key={idx} className="my-2 space-y-1 list-disc list-inside text-xs text-slate-700">
                          {items.map((item, itemIdx) => (
                            <li key={itemIdx} className="leading-relaxed">
                              {item.replace(/^(\*|-)\s+/, '')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (trimmed.startsWith('|')) {
                      const rows = trimmed.split('\n');
                      return (
                        <div key={idx} className="my-4 overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-left border-collapse text-xs">
                            <tbody>
                              {rows.map((row, rowIdx) => {
                                if (row.includes('---')) return null;
                                const cols = row.split('|').filter((c) => c.trim().length > 0);
                                const isHeader = rowIdx === 0;
                                return (
                                  <tr key={rowIdx} className={isHeader ? 'bg-slate-100 font-bold border-b border-slate-200' : 'border-b border-slate-100 hover:bg-slate-50'}>
                                    {cols.map((col, colIdx) => (
                                      <td key={colIdx} className="p-2.5 text-slate-700">
                                        {col.trim()}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }

                    return (
                      <p key={idx} className="my-2 text-xs text-slate-700 leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal: Universal Printable PDF Preview for All Documents */}
      {isPrintModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 gap-3 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-orange-600 text-sm">Clientum</span>
                  <span className="text-slate-300">|</span>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Vista Previa PDF
                  </h3>
                </div>

                {/* Scope selector tabs */}
                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setPrintScope('single')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      printScope === 'single'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Doc Actual ({selectedDoc.id})
                  </button>
                  <button
                    onClick={() => setPrintScope('all')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      printScope === 'all'
                        ? 'bg-orange-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dossier Completo (11 Docs)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportPdf}
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  title="Generar y descargar archivo PDF directamente a su equipo"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generando PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handlePrintInNewWindow}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-sm cursor-pointer"
                  title="Abrir ventana limpia para imprimir o guardar como PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Abrir Ventana</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Cerrar vista previa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Styled Document PDF Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
              <div 
                id="printable-pdf-content"
                className="printable-area bg-white max-w-3xl mx-auto p-6 sm:p-10 rounded-xl shadow-sm border border-slate-200 text-slate-800 print:shadow-none print:border-none"
              >
                {printScope === 'all' ? (
                  accessibleDocs.map((docItem, idx) => renderDocContentForPDF(docItem, idx))
                ) : (
                  renderDocContentForPDF(selectedDoc, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
