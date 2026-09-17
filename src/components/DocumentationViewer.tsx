import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  Sparkles, 
  Database, 
  Layers, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Download,
  Eye,
  X
} from 'lucide-react';
import { DOCUMENTATION_DATA, DocItem } from '../data/docsContent';
import { KoalaLogo } from './KoalaLogo';

interface DocumentationViewerProps {
  initialDocId?: string;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ initialDocId }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocId || 'propuesta-unificada');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'comercial' | 'tecnico' | 'demo'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const selectedDoc = DOCUMENTATION_DATA.find((d) => d.id === selectedDocId) || DOCUMENTATION_DATA[0];

  const filteredDocs = DOCUMENTATION_DATA.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[680px] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Sidebar: Documents list */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
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
              6 Docs
            </span>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
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
          <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
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
              onClick={() => setSelectedCategory('tecnico')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'tecnico'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Técnico ERP
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
          </div>
        </div>

        {/* List of documents */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredDocs.map((doc) => {
            const isSelected = doc.id === selectedDoc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-orange-50/70 border-l-4 border-orange-500 pl-3'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                    {doc.categoryLabel}
                  </span>
                  {doc.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {doc.badge}
                    </span>
                  )}
                </div>
                <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-orange-950' : 'text-slate-900'}`}>
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {doc.readTime}
                  </span>
                  <span>Actualizado: {doc.lastUpdated}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> Ver Propuesta Imprimible (PDF)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Document Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {selectedDoc.categoryLabel}
              </span>
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

          <div className="flex items-center gap-2 shrink-0">
            {selectedDoc.copyableText && (
              <button
                onClick={() => handleCopy(selectedDoc.copyableText!, selectedDoc.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
              >
                {copiedId === selectedDoc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Texto Completo</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Quick summary alert */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-900 mb-0.5">Resumen Ejecutivo del Documento</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedDoc.summary}</p>
              </div>
            </div>

            {/* If copyable email or text preview */}
            {selectedDoc.copyableText && (
              <div className="mb-6 p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Texto Listo para Enviar / Pegar
                  </span>
                  <button
                    onClick={() => handleCopy(selectedDoc.copyableText!, selectedDoc.id)}
                    className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
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
      </div>

      {/* Modal: Printable Proposal View */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-600 text-sm">Clientum</span>
                <span className="text-slate-300">|</span>
                <h3 className="font-bold text-slate-900 text-sm">Propuesta Comercial Oficial — Koala Cotillón</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / Guardar PDF
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Styled Proposal Container */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100">
              <div className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-sm border border-slate-200 text-slate-800">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <KoalaLogo size="md" />
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-xs font-bold text-orange-600 block">Propuesta Conjunta</span>
                        <span className="text-[11px] text-slate-500 font-semibold">Clientum Latam × Koala Lo Tiene</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                      Propuesta Comercial
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 mt-2">
                    Transformación digital omnicanal para Koala Cotillón
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Plan de implementación en 3 etapas — expansión de ventas online
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Cliente</div>
                      <div className="font-bold text-slate-800">Koala Cotillón (LP SRL)</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Fecha</div>
                      <div className="font-bold text-slate-800">Septiembre 2026</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Duración Etapa 1</div>
                      <div className="font-bold text-slate-800">~15–17 días</div>
                    </div>
                  </div>
                </div>

                {/* Diagnóstico */}
                <div className="mb-6 p-4 rounded-lg bg-emerald-50/50 border-l-4 border-emerald-600 text-xs leading-relaxed text-slate-700">
                  <div className="font-bold text-emerald-900 mb-1">DIAGNÓSTICO INICIAL</div>
                  El principal dolor de Koala hoy es la baja visibilidad y conversión en canales digitales. Quien busca cotillón, descartables o polietileno en Google en el Alto Valle no encuentra a Koala entre los primeros resultados.
                  <ul className="list-disc list-inside mt-2 space-y-0.5 text-slate-600">
                    <li>Ausencia de posicionamiento orgánico en buscadores (SEO).</li>
                    <li>Sin e-commerce propio con catálogo actualizado en tiempo real.</li>
                    <li>Atención a consultas online sin automatización — cuellos de botella en horarios pico.</li>
                    <li>Canales sociales activos (Instagram, Facebook) sin integración fluida al flujo de ventas.</li>
                  </ul>
                </div>

                {/* Las 3 Etapas */}
                <div className="space-y-3 mb-6">
                  <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-xs text-slate-900">1. E-commerce + Catálogo Íntegro + SEO Orgánico</h5>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">~15–17 días</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Sitio web transaccional con catálogo completo, fotos, medios de pago en cuotas, derivación automática a WhatsApp y optimización SEO regional para posicionar en primer lugar en Roca y Neuquén.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-xs text-slate-900">2. Integración con ERP y Reserva de Stock</h5>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">A convenir</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Conexión bidireccional entre el sistema de gestión y la tienda online. Reserva atómica en checkout para evitar conflictos de venta simultánea en mostrador vs. web.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-xs text-slate-900">3. Bot Web + Bot WhatsApp con Inteligencia Artificial</h5>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">A convenir</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Atención automática 24/7 en web y WhatsApp con servidor MCP para consultar inventario real en vivo, derivación inteligente al vendedor calificado y cierre de operaciones.
                    </p>
                  </div>
                </div>

                {/* Inversión */}
                <div className="border-t border-slate-200 pt-4 text-xs">
                  <div className="font-bold text-slate-900 mb-2">ESTRUCTURA DE INVERSIÓN (ARS)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block">Etapa 1 — E-commerce + SEO</span>
                      <span className="font-bold text-sm text-slate-800">$ 518.000 / A convenir</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block">Etapa 2 — Integración ERP</span>
                      <span className="font-bold text-sm text-slate-800">$ 414.400 / Según ERP</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-semibold block">Etapa 3 — Bots Web + WhatsApp</span>
                      <span className="font-bold text-sm text-slate-800">$ 187.600 / Puesta en marcha</span>
                    </div>
                    <div className="p-2.5 rounded bg-orange-50 border border-orange-200">
                      <span className="text-[10px] text-orange-700 font-semibold block">Mantenimiento Mensual</span>
                      <span className="font-bold text-sm text-orange-950">$ 267.000 / $ 310.800</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
                  <span>Clientum — General Roca, Río Negro</span>
                  <span>Propuesta confidencial — Validez 15 días corridos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
