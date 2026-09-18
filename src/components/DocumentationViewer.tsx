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
  AlertCircle
} from 'lucide-react';
import { DOCUMENTATION_DATA, DocItem } from '../data/docsContent';
import { KoalaLogo } from './KoalaLogo';
import { PipelineDiagramViewer } from './PipelineDiagramViewer';
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

  // Check if current user is Soporte Clientum with role 'backend'
  const isClientumSupport = Boolean(
    activeUser && 
    (activeUser.role === 'backend' || 
     activeUser.email?.toLowerCase() === 'soporte@clientum.com.ar' ||
     activeUser.email?.toLowerCase().endsWith('@clientum.com.ar'))
  );

  // Authentication modal state for quick login as Soporte Clientum
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

  const handlePrint = () => {
    window.print();
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
          {isClientumSupport ? (
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-indigo-950 block text-[11px] leading-tight">Soporte Clientum</span>
                  <span className="text-[10px] text-indigo-600 font-medium">Rol: Backend e Integraciones</span>
                </div>
              </div>
              <button
                onClick={handleQuickLogout}
                title="Cerrar sesión de soporte"
                className="p-1 hover:bg-indigo-100 rounded text-indigo-700 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-amber-950 block text-[11px] leading-tight">Modo Documentación Pública</span>
                  <span className="text-[10px] text-amber-700 font-medium">Propuestas comerciales protegidas</span>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-2 py-1 rounded text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 flex items-center gap-1 shadow-xs"
              >
                <LogIn className="w-3 h-3" /> Acceder
              </button>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative mb-2.5">
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
                <Lock className="w-3 h-3" /> Propuestas Mikhail (6)
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

        {/* List of accessible documents */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
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
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 ${
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

        {/* Bottom Banner: PDF / Print Action or Access Trigger */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          {isClientumSupport ? (
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> Ver Propuesta Imprimible (PDF)
            </button>
          ) : (
            <div className="text-center">
              <p className="text-[10px] text-slate-500 mb-1.5 font-medium">
                6 propuestas comerciales y guiones reservados para Soporte Clientum.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shadow-xs transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Ingresar como Soporte Clientum
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
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
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Exclusivo Backend e Integraciones
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

              <div className="flex items-center gap-2 shrink-0">
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
                        <span>Copiar Texto Completo</span>
                      </>
                    )}
                  </button>
                )}

                {isClientumSupport && (
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir / PDF</span>
                  </button>
                )}
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

      {/* Authentication Modal: Quick Soporte Clientum Access */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Acceso Soporte Clientum</h4>
                  <p className="text-[11px] text-slate-500">Rol: Backend e Integraciones</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Ingrese con la cuenta autorizada para desbloquear las propuestas comerciales, cotizaciones y guiones confidenciales de Mikhail Murekian (LP SRL).
            </p>

            <form onSubmit={handleQuickLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>

            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Usuario de prueba preconfigurado:</span><br />
              Email: <code className="text-indigo-600 font-mono">soporte@clientum.com.ar</code><br />
              Clave: <code className="text-indigo-600 font-mono">clientum</code> (Rol: backend)
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable Proposal View */}
      {isPrintModalOpen && isClientumSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-600 text-sm">Clientum</span>
                <span className="text-slate-300">|</span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Propuesta Comercial Oficial — Koala Cotillón (LP SRL)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Styled Proposal Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
              <div className="bg-white max-w-3xl mx-auto p-6 sm:p-10 rounded-xl shadow-sm border border-slate-200 text-slate-800 print:shadow-none print:border-none">
                
                {/* Header Block */}
                <div className="border-b border-slate-200 pb-5 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <KoalaLogo size="md" />
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-xs font-bold text-orange-600 block">Clientum × Koala Lo Tiene</span>
                        <span className="text-[11px] text-slate-500 font-medium">Automatización e IA para PyMEs</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                      Septiembre 2026
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    Propuesta Comercial — Koala Cotillón (LP SRL)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                    Expansión de ventas online — e-commerce + SEO + automatización
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Cliente / Razón Social</div>
                      <div className="font-bold text-slate-800">
                        LP SRL (Mikhail Murekian)
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Alcance Geográfico</div>
                      <div className="font-bold text-slate-800">
                        Gral. Roca & Neuquén
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Plazo Etapa 1</div>
                      <div className="font-bold text-emerald-700">~15–17 días corridos</div>
                    </div>
                  </div>
                </div>

                {/* COTILLÓN / LP SRL CONTENT */}
                <div className="mb-8">
                  {/* Diagnóstico */}
                  <div className="mb-4 p-4 rounded-xl bg-orange-50/50 border border-orange-200/70 text-xs leading-relaxed text-slate-700">
                    <div className="font-bold text-orange-950 mb-1">DIAGNÓSTICO DE SITUACIÓN:</div>
                    El principal dolor de Koala Cotillón es la baja visibilidad y conversión en canales digitales. Quien busca cotillón, globos, polietileno o descartables en Google en el Alto Valle no encuentra a Koala entre los primeros resultados.
                    <ul className="list-disc list-inside mt-2 space-y-0.5 text-slate-600">
                      <li>Ausencia de posicionamiento orgánico en buscadores (SEO).</li>
                      <li>Sin e-commerce propio con catálogo actualizado en tiempo real.</li>
                      <li>Atención a consultas online sin automatización — cuellos de botella en horarios pico.</li>
                      <li>Canales sociales activos (Instagram, Facebook) sin integración fluida al flujo de ventas.</li>
                    </ul>
                  </div>

                  {/* Plan Modular 3 Etapas */}
                  <div className="space-y-2.5 mb-4">
                    <div className="border border-slate-200 rounded-lg p-3 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-xs text-slate-900">1. E-commerce + Catálogo íntegro + SEO orgánico</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">~15–17 días</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Sitio web con e-commerce completo y catálogo íntegro. Fotos, descripciones y categorías cargadas. Stock sincronizado. Estrategia SEO orgánico con palabras clave (cotillón, globos, descartables, polietileno). Alta y optimización en Google Business Profile.
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

                  {/* Tabla de inversión Cotillón */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-xs mb-4">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                      <span>Estructura de Inversión — Koala Cotillón</span>
                      <span className="text-[10px] font-semibold text-slate-500">Valores sin IVA · Validez 15 días</span>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-100/75 text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Concepto</th>
                          <th className="p-2.5">Setup (ARS)</th>
                          <th className="p-2.5">Mensual (ARS)</th>
                          <th className="p-2.5">Condición</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        <tr>
                          <td className="p-2.5 font-medium text-slate-900">Etapa 1 — E-commerce + SEO</td>
                          <td className="p-2.5 font-bold text-slate-800">$ 518.000</td>
                          <td className="p-2.5 text-slate-600">$ 104.000 / $ 133.200</td>
                          <td className="p-2.5 text-slate-600">Pago al inicio</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-900">Etapa 2 — Integración ERP</td>
                          <td className="p-2.5 font-bold text-slate-800">$ 414.400</td>
                          <td className="p-2.5 text-slate-600">$ 86.000 / $ 111.000</td>
                          <td className="p-2.5 text-slate-600">A convenir según ERP</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-900">Etapa 3 — Bots Web + WhatsApp</td>
                          <td className="p-2.5 font-bold text-slate-800">$ 187.600</td>
                          <td className="p-2.5 text-slate-600">$ 77.000 / $ 66.600</td>
                          <td className="p-2.5 text-slate-600">Al inicio de la etapa</td>
                        </tr>
                        <tr className="bg-orange-50/70 font-bold text-orange-950">
                          <td className="p-2.5">PACK COMPLETO SUGERIDO</td>
                          <td className="p-2.5 font-extrabold text-orange-900">$ 1.120.000</td>
                          <td className="p-2.5 font-bold text-orange-900">$ 267.000 / $ 310.800</td>
                          <td className="p-2.5 text-orange-800">Anticipo 50% al iniciar</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Por qué Clientum */}
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 mb-2">¿POR QUÉ CLIENTUM?</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 text-[11px]">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-bold">✓</div>
                      <div>
                        <strong className="text-slate-800 block">Precios en ARS y soporte local:</strong>
                        Equipo en General Roca (Patagonia). Soporte garantizado 365 días, respuesta &lt; 4 hs.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-bold">✓</div>
                      <div>
                        <strong className="text-slate-800 block">Tecnología propia y flexible:</strong>
                        Sin dependencia de plataformas extranjeras. Stack probado en producción.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-bold">✓</div>
                      <div>
                        <strong className="text-slate-800 block">Stack probado en producción:</strong>
                        WhatsApp API oficial Meta, agentes IA con MCP, sincronización ERP e e-commerce.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-bold">✓</div>
                      <div>
                        <strong className="text-slate-800 block">Trazabilidad y control:</strong>
                        Panel de administración con monitor de sincronización ERP, hub de stock y auditoría.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Condiciones y Próximos Pasos (5 Pasos Oficiales) */}
                <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-white text-xs">
                  <div className="font-bold text-slate-900 mb-3">CONDICIONES Y PRÓXIMOS PASOS</div>
                  <ol className="space-y-2 text-[11px] text-slate-600 list-decimal list-inside">
                    <li><strong className="text-slate-800">Revisión de la propuesta:</strong> Mikhail y equipo LP SRL revisan el alcance de las 3 etapas, los valores y las condiciones.</li>
                    <li><strong className="text-slate-800">Firma del documento:</strong> Firma formal de esta propuesta comercial como constancia de inicio de proyecto.</li>
                    <li><strong className="text-slate-800">Acreditación del anticipo:</strong> Acreditación del anticipo correspondiente (50% del pack elegido o 100% Etapa 1).</li>
                    <li><strong className="text-slate-800">Kickoff y reunión de inicio:</strong> Reunión de inicio para relevamiento de ERP actual, accesos y cronograma detallado.</li>
                    <li><strong className="text-slate-800">Entrega Etapa 1 (~15–17 días):</strong> E-commerce operativo con catálogo completo, SEO activo y Google Business Profile configurado.</li>
                  </ol>
                  <p className="text-[10px] text-slate-400 mt-3 italic border-t border-slate-100 pt-2">
                    * Validez de la propuesta: 15 días corridos desde su emisión. Los valores no incluyen IVA. El inicio formal del proyecto queda sujeto a la firma de este documento y a la acreditación del anticipo correspondiente.
                  </p>
                </div>

                {/* Bloque de Firmas */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="border-t border-slate-300 pt-2 mt-8">
                    <p className="font-bold text-slate-800">Clientum</p>
                    <p className="text-[10px] text-slate-500">Automatización e IA para PyMEs</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">clientum.com.ar · General Roca, Río Negro</p>
                  </div>
                  <div className="border-t border-slate-300 pt-2 mt-8">
                    <p className="font-bold text-slate-800">Mikhail Murekian</p>
                    <p className="text-[10px] text-slate-500">Koala Cotillón / LP SRL</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Conformidad de inicio</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
