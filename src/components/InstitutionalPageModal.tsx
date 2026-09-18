import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Briefcase, 
  Factory, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink,
  Percent,
  Sparkles
} from 'lucide-react';
import { 
  SUCURSALES_DATA, 
  FAQ_DATA, 
  POLITICAS_DEVOLUCION_TEXT, 
  TERMINOS_CONDICIONES_TEXT, 
  PRIVACIDAD_TEXT, 
  DERECHOS_DATOS_TEXT, 
  SERVICIO_TECNICO_TEXT, 
  TRABAJA_CON_NOSOTROS_DATA 
} from '../data/legalAndInstitutionalData';
import { BranchInfo } from '../types';

export type InstitutionalPageType = 
  | 'arrepentimiento' 
  | 'contacto' 
  | 'derechos-datos' 
  | 'faq' 
  | 'ofertas' 
  | 'politicas-devolucion' 
  | 'privacidad' 
  | 'servicio-tecnico' 
  | 'sucursales' 
  | 'terminos' 
  | 'trabaja';

interface InstitutionalPageModalProps {
  page: InstitutionalPageType;
  isOpen: boolean;
  onClose: () => void;
  currentBranch: BranchInfo;
  onNavigatePage: (page: InstitutionalPageType) => void;
  onGoToCatalogOffers?: () => void;
}

export const InstitutionalPageModal: React.FC<InstitutionalPageModalProps> = ({
  page,
  isOpen,
  onClose,
  currentBranch,
  onNavigatePage,
  onGoToCatalogOffers,
}) => {
  // Arrepentimiento Form State
  const [arrepentimientoForm, setArrepentimientoForm] = React.useState({
    nombre: '',
    dni: '',
    telefono: '',
    email: '',
    numeroPedido: '',
    sucursal: currentBranch.id,
    motivo: '',
  });
  const [arrepentimientoSent, setArrepentimientoSent] = React.useState(false);
  const [tramiteCode, setTramiteCode] = React.useState('');

  // Contact Form State
  const [contactForm, setContactForm] = React.useState({
    nombre: '',
    telefono: '',
    email: '',
    sucursal: currentBranch.id,
    asunto: 'consulta',
    mensaje: '',
  });
  const [contactSent, setContactSent] = React.useState(false);

  // Job Application Form State
  const [jobForm, setJobForm] = React.useState({
    nombre: '',
    telefono: '',
    email: '',
    puesto: 'planta',
    localidad: 'roca',
    experiencia: '',
  });
  const [jobSent, setJobSent] = React.useState(false);

  // Technical Manufacturing Quote Form
  const [techForm, setTechForm] = React.useState({
    nombre: '',
    telefono: '',
    tipoProducto: 'bolsas-impresas',
    medidas: '40x50 cm, 30 micrones',
    cantidadEstimada: '10.000 unidades',
    detalles: '',
  });
  const [techSent, setTechSent] = React.useState(false);

  // Active FAQ category filter and open accordion item
  const [activeFaqCategory, setActiveFaqCategory] = React.useState<string>('todos');
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  // Close on ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleArrepentimientoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `ARR-${Date.now().toString().slice(-6)}`;
    setTramiteCode(code);
    setArrepentimientoSent(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJobSent(true);
  };

  const handleTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTechSent(true);
  };

  const filteredFaqs = activeFaqCategory === 'todos' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(f => f.category === activeFaqCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            {page === 'arrepentimiento' && <RotateCcw className="w-5 h-5 text-rose-600" />}
            {page === 'contacto' && <Phone className="w-5 h-5 text-orange-600" />}
            {page === 'derechos-datos' && <ShieldCheck className="w-5 h-5 text-indigo-600" />}
            {page === 'faq' && <HelpCircle className="w-5 h-5 text-amber-600" />}
            {page === 'ofertas' && <Percent className="w-5 h-5 text-rose-600" />}
            {page === 'politicas-devolucion' && <RotateCcw className="w-5 h-5 text-blue-600" />}
            {page === 'privacidad' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            {page === 'servicio-tecnico' && <Factory className="w-5 h-5 text-orange-600" />}
            {page === 'sucursales' && <MapPin className="w-5 h-5 text-orange-600" />}
            {page === 'terminos' && <FileText className="w-5 h-5 text-slate-700" />}
            {page === 'trabaja' && <Briefcase className="w-5 h-5 text-purple-600" />}

            <h3 className="text-base sm:text-lg font-bold font-fredoka text-slate-900 capitalize">
              {page === 'arrepentimiento' && 'Botón de Arrepentimiento (Res. 424/2020)'}
              {page === 'contacto' && 'Contacto y Atención Comercial'}
              {page === 'derechos-datos' && 'Protección de Datos Personales (Ley 25.326)'}
              {page === 'faq' && 'Preguntas Frecuentes (FAQ)'}
              {page === 'ofertas' && 'Ofertas Especiales & Precios por Bulto'}
              {page === 'politicas-devolucion' && 'Políticas de Cambios y Devoluciones'}
              {page === 'privacidad' && 'Políticas de Privacidad'}
              {page === 'servicio-tecnico' && 'Fábrica & Producción Especial a Medida'}
              {page === 'sucursales' && 'Nuestras Sucursales (Roca y Neuquén)'}
              {page === 'terminos' && 'Términos y Condiciones Generales'}
              {page === 'trabaja' && 'Trabajá con Nosotros (RRHH)'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {/* ========================================================= */}
          {/* 1. BOTÓN DE ARREPENTIMIENTO */}
          {/* ========================================================= */}
          {page === 'arrepentimiento' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-950">
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  Derecho de Revocación de Compra Online (Ley 24.240 y Res. 424/2020)
                </h4>
                <p className="text-xs text-rose-900/90 mt-1 leading-relaxed">
                  Conforme a la normativa nacional de la Secretaría de Comercio Interior, podés revocar la aceptación del producto contratado dentro de los <strong>10 (diez) días corridos</strong> contados a partir de la fecha en que se entregue el bien o se celebre el contrato, sin costo alguno para el comprador.
                </p>
              </div>

              {arrepentimientoSent ? (
                <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold font-fredoka text-emerald-950">
                    Solicitud de Arrepentimiento Registrada
                  </h4>
                  <p className="text-sm text-emerald-900 max-w-lg mx-auto">
                    Tu número de trámite oficial es: <strong className="text-emerald-700 text-base font-mono">{tramiteCode}</strong>.
                    Te hemos enviado un correo de acuse de recibo. Nuestro equipo de administración se comunicará en un plazo máximo de 24 horas hábiles para coordinar la devolución del dinero y retiro de la mercadería.
                  </p>
                  <button
                    onClick={() => {
                      setArrepentimientoSent(false);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Entendido y Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleArrepentimientoSubmit} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre y Apellido *</label>
                      <input 
                        required
                        type="text" 
                        value={arrepentimientoForm.nombre}
                        onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, nombre: e.target.value})}
                        placeholder="Ej: Milton López" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">DNI / CUIT *</label>
                      <input 
                        required
                        type="text" 
                        value={arrepentimientoForm.dni}
                        onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, dni: e.target.value})}
                        placeholder="Ej: 35.123.456" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input 
                        required
                        type="tel" 
                        value={arrepentimientoForm.telefono}
                        onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, telefono: e.target.value})}
                        placeholder="Ej: 298 453-6376" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input 
                        required
                        type="email" 
                        value={arrepentimientoForm.email}
                        onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, email: e.target.value})}
                        placeholder="tucorreo@ejemplo.com" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nº de Pedido o Comprobante (si lo tiene)</label>
                      <input 
                        type="text" 
                        value={arrepentimientoForm.numeroPedido}
                        onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, numeroPedido: e.target.value})}
                        placeholder="Ej: COT-829102" 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sucursal de Origen *</label>
                      <select
                        value={arrepentimientoForm.sucursal}
                        onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, sucursal: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="roca">General Roca (Casa Central - Av. Roca 1350)</option>
                        <option value="neuquen">Neuquén Capital (Mitre 678)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Motivo o Detalle (Opcional)</label>
                    <textarea 
                      rows={3}
                      value={arrepentimientoForm.motivo}
                      onChange={(e) => setArrepentimientoForm({...arrepentimientoForm, motivo: e.target.value})}
                      placeholder="Contanos brevemente qué sucedió para ayudarnos a mejorar..." 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirmar Revocación de Compra</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. CONTACTO */}
          {/* ========================================================= */}
          {page === 'contacto' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUCURSALES_DATA.map((suc) => (
                  <div key={suc.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 uppercase tracking-wide">
                      {suc.city}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 font-fredoka">{suc.name}</h4>
                    <p className="text-xs text-slate-600 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span>{suc.address}, ({suc.postalCode}) {suc.city}</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <a href={`tel:${suc.phoneRaw}`} className="hover:text-orange-600 font-medium">
                        {suc.phone}
                      </a>
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <a href={`https://wa.me/${suc.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        WhatsApp: {suc.whatsappFormatted}
                      </a>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 shrink-0" />
                      <a href={`mailto:${suc.email}`} className="hover:underline">
                        {suc.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>

              {contactSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900">¡Mensaje Enviado con Éxito!</h4>
                  <p className="text-xs text-emerald-800">Nos pondremos en contacto con vos a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900 font-fredoka">Envianos tu Consulta o Solicitud</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre y Apellido *</label>
                      <input 
                        required
                        type="text" 
                        value={contactForm.nombre}
                        onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                        placeholder="Ej: Milton López" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono de Contacto *</label>
                      <input 
                        required
                        type="tel" 
                        value={contactForm.telefono}
                        onChange={(e) => setContactForm({...contactForm, telefono: e.target.value})}
                        placeholder="Ej: 298 453-6376" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sucursal a consultar</label>
                      <select 
                        value={contactForm.sucursal}
                        onChange={(e) => setContactForm({...contactForm, sucursal: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="roca">General Roca (Casa Central - Av. Roca 1350)</option>
                        <option value="neuquen">Neuquén Capital (Mitre 678)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Asunto</label>
                      <select 
                        value={contactForm.asunto}
                        onChange={(e) => setContactForm({...contactForm, asunto: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="consulta">Consulta General / Precios</option>
                        <option value="mayorista">Cotización Mayorista por Bulto</option>
                        <option value="fabrica">Producción de Polietileno a Medida</option>
                        <option value="envios">Logística y Envíos al Alto Valle</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje *</label>
                    <textarea 
                      required
                      rows={3}
                      value={contactForm.mensaje}
                      onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})}
                      placeholder="Escribí aquí los productos o cantidades que estás buscando..." 
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-orange-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Mensaje</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. DERECHOS Y PROTECCIÓN DE DATOS (LEY 25.326) */}
          {/* ========================================================= */}
          {page === 'derechos-datos' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Garantía de Habeas Data · Ley Nacional N° 25.326
                </h4>
                <p className="text-xs text-indigo-900/90 mt-1">
                  Koala Lo Tiene cumple estrictamente con el marco legal argentino de protección integral de datos personales registrados en archivos, registros, bancos de datos u otros medios técnicos.
                </p>
              </div>

              <div className="space-y-4">
                {DERECHOS_DATOS_TEXT.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">{sec.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>¿Deseás solicitar la supresión o actualización de tus datos?</span>
                <a 
                  href="mailto:legales@koalalotiene.com.ar?subject=Solicitud%20Habeas%20Data" 
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                >
                  Enviar Solicitud
                </a>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. PREGUNTAS FRECUENTES (FAQ) */}
          {/* ========================================================= */}
          {page === 'faq' && (
            <div className="space-y-5">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todas las preguntas' },
                  { id: 'envios', label: '🚚 Envíos y Logística' },
                  { id: 'pedidos', label: '📦 Mayorista y Bultos' },
                  { id: 'pagos', label: '💳 Formas de Pago y BPN' },
                  { id: 'locales', label: '🏪 Retiro en Locales' },
                  { id: 'facturacion', label: '🧾 Factura A y B' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFaqCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeFaqCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Accordion FAQ List */}
              <div className="space-y-2.5">
                {filteredFaqs.map((item, idx) => {
                  const isOpenItem = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpenItem ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span className="pr-4">{item.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpenItem ? 'rotate-180 text-orange-600' : ''}`} />
                      </button>
                      {isOpenItem && (
                        <div className="p-4 pt-1 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. OFERTAS */}
          {/* ========================================================= */}
          {page === 'ofertas' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 text-white space-y-2 shadow-lg shadow-orange-600/20">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wide">
                  Precios Especiales de Fábrica
                </span>
                <h4 className="text-2xl font-black font-fredoka">Ofertas por Bulto Cerrado y Mayorista</h4>
                <p className="text-xs text-orange-100 max-w-xl">
                  Aprovechá descuentos de hasta el 25% llevando por bulto cerrado en bolsas de polietileno, bobinas de film stretch, potes térmicos para viandas y cotillón festivo.
                </p>
                {onGoToCatalogOffers && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onGoToCatalogOffers();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-bold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Filtrar Productos en Oferta en el Catálogo →
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    10% OFF EXTRA
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">Pago por Transferencia Bancaria</h5>
                  <p className="text-xs text-slate-600">
                    Abonando tu cotización con transferencia inmediata o depósito bancario accedés a un 10% de descuento directo en el total.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                    BPN CONFIABLE
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">3 y 6 Cuotas sin Interés</h5>
                  <p className="text-xs text-slate-600">
                    Comprá con tarjetas Confiable de Banco Provincia del Neuquén en hasta 6 cuotas fijas sin recargo en locales y pedidos web.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. POLÍTICAS DE DEVOLUCIÓN */}
          {/* ========================================================= */}
          {page === 'politicas-devolucion' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">{POLITICAS_DEVOLUCION_TEXT.intro}</p>
              <div className="space-y-4">
                {POLITICAS_DEVOLUCION_TEXT.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">{sec.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. PRIVACIDAD */}
          {/* ========================================================= */}
          {page === 'privacidad' && (
            <div className="space-y-4">
              {PRIVACIDAD_TEXT.sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">{sec.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. SERVICIO TÉCNICO Y FÁBRICA A MEDIDA */}
          {/* ========================================================= */}
          {page === 'servicio-tecnico' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 text-white space-y-2">
                <span className="px-2 py-0.5 rounded bg-orange-500/30 border border-orange-500/40 text-orange-400 text-[10px] font-black uppercase">
                  Planta Industrial General Roca
                </span>
                <h4 className="text-xl font-bold font-fredoka">{SERVICIO_TECNICO_TEXT.subtitle}</h4>
                <p className="text-xs text-slate-300">{SERVICIO_TECNICO_TEXT.intro}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICIO_TECNICO_TEXT.services.map((serv, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Factory className="w-3.5 h-3.5 text-orange-600" />
                      {serv.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{serv.desc}</p>
                  </div>
                ))}
              </div>

              {techSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900">Cotización Técnica Recibida</h4>
                  <p className="text-xs text-emerald-800">El departamento técnico de fábrica te enviará la propuesta en breve.</p>
                </div>
              ) : (
                <form onSubmit={handleTechSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">Solicitar Presupuesto Especial de Fábrica</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre / Razón Social *</label>
                      <input 
                        required
                        type="text" 
                        value={techForm.nombre}
                        onChange={(e) => setTechForm({...techForm, nombre: e.target.value})}
                        placeholder="Ej: Distribuidora Patagónica" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">WhatsApp de Contacto *</label>
                      <input 
                        required
                        type="tel" 
                        value={techForm.telefono}
                        onChange={(e) => setTechForm({...techForm, telefono: e.target.value})}
                        placeholder="Ej: 298 453-6376" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo de Solución</label>
                      <select 
                        value={techForm.tipoProducto}
                        onChange={(e) => setTechForm({...techForm, tipoProducto: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="bolsas-impresas">Bolsas Camiseta / Riñón con Impresión de Logo</option>
                        <option value="bobinas-tubulares">Bobinas Tubulares / Polietileno en Rollo</option>
                        <option value="film-stretch">Film Stretch Automático / Manual para Paletizar</option>
                        <option value="big-bags">Big Bags 1 Tonelada para Áridos o Fruta</option>
                        <option value="consorcio-especial">Bolsas de Consorcio Reforzadas Extra Micrones</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Medidas y Micrones aproximados</label>
                      <input 
                        type="text" 
                        value={techForm.medidas}
                        onChange={(e) => setTechForm({...techForm, medidas: e.target.value})}
                        placeholder="Ej: 50x60 cm, 40 micrones" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Detalles de uso o requerimientos</label>
                    <textarea 
                      rows={2}
                      value={techForm.detalles}
                      onChange={(e) => setTechForm({...techForm, detalles: e.target.value})}
                      placeholder="Indicar color de polietileno, destino del material, cantidad estimada..." 
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-orange-400" />
                      <span>Enviar a Planta Fabril</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. SUCURSALES DETALLADAS */}
          {/* ========================================================= */}
          {page === 'sucursales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SUCURSALES_DATA.map((suc) => (
                  <div key={suc.id} className="p-6 rounded-3xl border border-slate-200 bg-slate-50 space-y-4">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-600 text-white uppercase tracking-wider">
                        {suc.city}
                      </span>
                      <h4 className="text-xl font-bold text-slate-900 font-fredoka mt-2">{suc.name}</h4>
                      <p className="text-xs text-orange-600 font-semibold">{suc.role}</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span><strong>Dirección:</strong> {suc.address}, ({suc.postalCode}) {suc.city}, {suc.province}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                        <span><strong>Teléfono:</strong> <a href={`tel:${suc.phoneRaw}`} className="hover:text-orange-600">{suc.phone}</a></span>
                      </p>
                      <p className="flex items-center gap-2 text-emerald-600 font-semibold">
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span><strong>WhatsApp:</strong> <a href={`https://wa.me/${suc.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{suc.whatsappFormatted}</a></span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Horarios:</strong> {suc.hours.weekdays} | {suc.hours.saturday}</span>
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Servicios en este local:</span>
                      <ul className="space-y-1">
                        {suc.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <a 
                        href={suc.mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Cómo llegar en Google Maps</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. TÉRMINOS Y CONDICIONES */}
          {/* ========================================================= */}
          {page === 'terminos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                <span>Koala Lo Tiene SRL · CUIT 30-71458921-3</span>
                <span>Actualización: {TERMINOS_CONDICIONES_TEXT.lastUpdated}</span>
              </div>
              <div className="space-y-4">
                {TERMINOS_CONDICIONES_TEXT.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">{sec.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. TRABAJÁ CON NOSOTROS (RRHH) */}
          {/* ========================================================= */}
          {page === 'trabaja' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                <h4 className="font-bold text-base font-fredoka">{TRABAJA_CON_NOSOTROS_DATA.title}</h4>
                <p className="text-xs text-purple-900">{TRABAJA_CON_NOSOTROS_DATA.subtitle}</p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">Búsquedas Activas</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {TRABAJA_CON_NOSOTROS_DATA.areas.map((area, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                      <h6 className="font-bold text-slate-900 text-xs">{area.title}</h6>
                      <p className="text-[11px] text-slate-600">{area.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {jobSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900">¡Postulación Recibida!</h4>
                  <p className="text-xs text-emerald-800">
                    Tu perfil fue incorporado a nuestra base de talentos para futuras vacantes de planta y salón.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJobSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">Formulario de Postulación</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Completo *</label>
                      <input 
                        required
                        type="text" 
                        value={jobForm.nombre}
                        onChange={(e) => setJobForm({...jobForm, nombre: e.target.value})}
                        placeholder="Ej: Milton López" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">WhatsApp / Teléfono *</label>
                      <input 
                        required
                        type="tel" 
                        value={jobForm.telefono}
                        onChange={(e) => setJobForm({...jobForm, telefono: e.target.value})}
                        placeholder="Ej: 298 453-6376" 
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Puesto de Interés</label>
                      <select 
                        value={jobForm.puesto}
                        onChange={(e) => setJobForm({...jobForm, puesto: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="planta">Operario de Fábrica de Polietileno (Gral. Roca)</option>
                        <option value="ventas">Ventas de Mostrador y Atención al Público (Roca o Nqn)</option>
                        <option value="logistica">Chofer de Reparto / Depósito y Logística</option>
                        <option value="administracion">Administración y Facturación</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Localidad de Residencia</label>
                      <select 
                        value={jobForm.localidad}
                        onChange={(e) => setJobForm({...jobForm, localidad: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="roca">General Roca</option>
                        <option value="neuquen">Neuquén Capital</option>
                        <option value="cipolletti">Cipolletti</option>
                        <option value="allen">Allen</option>
                        <option value="otra">Otra localidad del Alto Valle</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Breve Resumen de Experiencia</label>
                    <textarea 
                      rows={3}
                      value={jobForm.experiencia}
                      onChange={(e) => setJobForm({...jobForm, experiencia: e.target.value})}
                      placeholder="Contanos tus trabajos anteriores o qué conocimientos tenés en fábricas, comercios o logística..." 
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-purple-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Postulación</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer with Navigation Pills */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-100/70 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-slate-400 text-[11px] font-semibold">Ver también:</span>
            <button 
              onClick={() => onNavigatePage('faq')} 
              className={`px-2 py-0.5 rounded-md hover:bg-slate-200 cursor-pointer ${page === 'faq' ? 'font-bold text-orange-600' : 'text-slate-600'}`}
            >
              FAQ
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigatePage('contacto')} 
              className={`px-2 py-0.5 rounded-md hover:bg-slate-200 cursor-pointer ${page === 'contacto' ? 'font-bold text-orange-600' : 'text-slate-600'}`}
            >
              Contacto
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigatePage('sucursales')} 
              className={`px-2 py-0.5 rounded-md hover:bg-slate-200 cursor-pointer ${page === 'sucursales' ? 'font-bold text-orange-600' : 'text-slate-600'}`}
            >
              Sucursales
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigatePage('servicio-tecnico')} 
              className={`px-2 py-0.5 rounded-md hover:bg-slate-200 cursor-pointer ${page === 'servicio-tecnico' ? 'font-bold text-orange-600' : 'text-slate-600'}`}
            >
              Fábrica a Medida
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigatePage('arrepentimiento')} 
              className={`px-2 py-0.5 rounded-md hover:bg-slate-200 cursor-pointer ${page === 'arrepentimiento' ? 'font-bold text-rose-600' : 'text-slate-600'}`}
            >
              Arrepentimiento
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
