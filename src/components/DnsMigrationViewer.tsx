import React, { useState } from 'react';
import {
  Globe,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Server,
  Mail,
  Shield,
  Clock,
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';

interface DnsRecord {
  id: number;
  action: 'Borrar' | 'Agregar' | 'Editar' | 'Dejar' | 'Pedir a ICXN';
  type: string;
  name: string;
  content: string;
  proxy: 'Proxied' | 'DNS only';
  status: 'Pendiente' | 'No requiere';
  notes: string;
}

const DNS_RECORDS: DnsRecord[] = [
  { id: 1, action: 'Borrar', type: 'A', name: '@', content: '172.67.172.156', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 2, action: 'Borrar', type: 'A', name: '@', content: '104.21.71.250', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 3, action: 'Borrar', type: 'AAAA', name: '@', content: '2606:4700:3035::ac43:ac9c', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 4, action: 'Borrar', type: 'AAAA', name: '@', content: '2606:4700:3037::6815:47fa', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 5, action: 'Borrar', type: 'A', name: 'www', content: '172.67.172.156', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 6, action: 'Borrar', type: 'A', name: 'www', content: '104.21.71.250', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 7, action: 'Borrar', type: 'AAAA', name: 'www', content: '2606:4700:3035::ac43:ac9c', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 8, action: 'Borrar', type: 'AAAA', name: 'www', content: '2606:4700:3037::6815:47fa', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare del sitio anterior' },
  { id: 9, action: 'Agregar', type: 'CNAME', name: '@', content: '16bc395e55b20519.vercel-dns-017.com', proxy: 'DNS only', status: 'Pendiente', notes: 'Valor que muestra Vercel para la raíz. Cloudflare lo aplana (CNAME flattening).' },
  { id: 10, action: 'Agregar', type: 'CNAME', name: 'www', content: '16bc395e55b20519.vercel-dns-017.com', proxy: 'DNS only', status: 'Pendiente', notes: 'Vercel solo mostró el valor de @. Si para www muestra otro, usar ese.' },
  { id: 11, action: 'Editar', type: 'CNAME', name: 'mail', content: 'icxn-lp.dvrdns.org', proxy: 'DNS only', status: 'Pendiente', notes: 'Hoy está proxied: pasar a DNS only. Obligatorio antes de cambiar nameservers.' },
  { id: 12, action: 'Borrar', type: 'A', name: 'webmail', content: '172.67.172.156', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare, no es un servidor de correo' },
  { id: 13, action: 'Borrar', type: 'A', name: 'webmail', content: '104.21.71.250', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare, no es un servidor de correo' },
  { id: 14, action: 'Borrar', type: 'AAAA', name: 'webmail', content: '2606:4700:3035::ac43:ac9c', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare, no es un servidor de correo' },
  { id: 15, action: 'Borrar', type: 'AAAA', name: 'webmail', content: '2606:4700:3037::6815:47fa', proxy: 'Proxied', status: 'Pendiente', notes: 'IP de Cloudflare, no es un servidor de correo' },
  { id: 16, action: 'Agregar', type: 'CNAME', name: 'webmail', content: 'icxn-lp.dvrdns.org', proxy: 'DNS only', status: 'Pendiente', notes: 'SUPUESTO: mismo destino que mail. Confirmar con ICXN antes de cargar.' },
  { id: 17, action: 'Dejar', type: 'MX', name: '@', content: '10 mail.koalalotiene.com.ar', proxy: 'DNS only', status: 'No requiere', notes: 'Sin cambios' },
  { id: 18, action: 'Dejar', type: 'TXT', name: '@', content: 'v=spf1 include:outbound.mailhop.org -all', proxy: 'DNS only', status: 'No requiere', notes: 'SPF, sin cambios' },
  { id: 19, action: 'Dejar', type: 'TXT', name: '_dmarc', content: 'v=DMARC1; p=none; rua=mailto:soporte@icxn.com.ar; ruf=mailto:soporte@icxn.com.ar; rf=afrf; pct=100', proxy: 'DNS only', status: 'No requiere', notes: 'DMARC, sin cambios' },
  { id: 20, action: 'Dejar', type: 'TXT', name: '@', content: 'google-site-verification=RDqYHFnW-GbqJAiqUU4novzlTDH46JOl1y-4uumq-8o', proxy: 'DNS only', status: 'No requiere', notes: 'Verificación de Google, sin cambios' },
  { id: 21, action: 'Pedir a ICXN', type: 'TXT', name: '(selector)._domainkey', content: 'Selector y valor a confirmar con ICXN', proxy: 'DNS only', status: 'Pendiente', notes: 'No aparece DKIM en el export. Sin DKIM los mails pueden caer en spam.' }
];

const STEPS_LIST = [
  { id: 1, step: 'Cargar y corregir los registros', where: 'Cloudflare', detail: 'Ver pestaña "Registros DNS". Dejar mail y webmail en DNS only.', status: 'Pendiente' },
  { id: 2, step: 'Consultar a ICXN', where: 'soporte@icxn.com.ar', detail: 'Destino de webmail y mail, registro DKIM, otros registros necesarios. Ver pestaña "Consulta ICXN".', status: 'Pendiente' },
  { id: 3, step: 'Completar webmail y DKIM', where: 'Cloudflare', detail: 'Con la respuesta de ICXN.', status: 'Pendiente' },
  { id: 4, step: 'Presionar "Continue to activation"', where: 'Cloudflare', detail: 'Después de revisar la tabla de registros.', status: 'Pendiente' },
  { id: 5, step: 'Eliminar registro DS si existe (DNSSEC)', where: 'NIC Argentina', detail: 'Hacerlo antes de guardar los nameservers; si queda puede dejar el dominio sin resolver.', status: 'Pendiente' },
  { id: 6, step: 'Reemplazar nameservers', where: 'NIC Argentina', detail: 'Sacar nelly.ns.cloudflare.com y zac.ns.cloudflare.com. Poner braelyn.ns.cloudflare.com y bryce.ns.cloudflare.com.', status: 'Pendiente' },
  { id: 7, step: 'Verificar activación', where: 'Cloudflare', detail: '"Check nameservers". Puede tardar de minutos a unas horas.', status: 'Pendiente' },
  { id: 8, step: 'Refrescar dominios', where: 'Vercel', detail: '"Refresh" para koalalotiene.com.ar y www. Ambos deben quedar en Valid Configuration.', status: 'Pendiente' },
  { id: 9, step: 'Probar correo y webmail', where: 'Casilla del dominio', detail: 'Mail de prueba desde y hacia el dominio; abrir webmail.', status: 'Pendiente' }
];

const ICXN_QUESTIONS = [
  { id: 1, q: 'Destino correcto de webmail', why: 'Las IPs actuales son de Cloudflare (proxy); el destino real quedó oculto.' },
  { id: 2, q: 'Destino correcto de mail', why: 'Hoy apunta a icxn-lp.dvrdns.org; confirmar que sigue vigente.' },
  { id: 3, q: 'Registro DKIM (selector y valor TXT)', why: 'No aparece en el export. Sin DKIM los mails pueden caer en spam.' },
  { id: 4, q: 'Otros registros necesarios para el correo', why: 'Por si hay registros que el escaneo no detectó.' }
];

export const DnsMigrationViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dns' | 'pasos' | 'icxn' | 'milton'>('dns');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Track state of the 17 pending tasks
  const [dnsState, setDnsState] = useState<Record<number, 'Pendiente' | 'Hecho' | 'No requiere'>>(() => {
    const init: Record<number, 'Pendiente' | 'Hecho' | 'No requiere'> = {};
    DNS_RECORDS.forEach(r => {
      init[r.id] = r.status;
    });
    return init;
  });

  const [stepState, setStepState] = useState<Record<number, boolean>>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Progress computation (excluding 'No requiere')
  const actionableRecords = DNS_RECORDS.filter(r => r.status !== 'No requiere');
  const doneCount = actionableRecords.filter(r => dnsState[r.id] === 'Hecho').length;
  const progressPercent = Math.round((doneCount / actionableRecords.length) * 100);

  const toggleDnsState = (id: number) => {
    if (dnsState[id] === 'No requiere') return;
    setDnsState(prev => ({
      ...prev,
      [id]: prev[id] === 'Hecho' ? 'Pendiente' : 'Hecho'
    }));
  };

  const toggleStep = (id: number) => {
    setStepState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Borrar': return 'bg-red-100 text-red-700 border-red-200';
      case 'Agregar': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Editar': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Dejar': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Pedir a ICXN': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              koalalotiene.com.ar
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Libro Excel Disponible (.xlsx)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-orange-400" />
            Configuración DNS & Mensaje para Milton
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Hoja de cálculo interactiva con las 3 pestañas (Registros DNS, Pasos y Consulta ICXN), notas sobre webmail, DKIM y propuesta para Mikhail (LP SRL).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <a
            href="/koala-dns-checklist.xlsx"
            download="koala-dns-checklist.xlsx"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
            title="Descargar hoja de cálculo koala-dns-checklist.xlsx"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar koala-dns-checklist.xlsx</span>
          </a>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold">Progreso:</span>
            <span className="text-indigo-600 font-extrabold">{progressPercent}%</span>
            <span className="text-slate-500">({doneCount} de {actionableRecords.length} tareas realizadas)</span>
          </div>
          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-600">
          <span>Dominio Principal:</span>
          <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-900 font-mono">
            www.koalalotiene.com.ar
          </code>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-5 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dns')}
          className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'dns'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Pestaña 1: Registros DNS (21)
        </button>

        <button
          onClick={() => setActiveTab('pasos')}
          className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pasos'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Pestaña 2: Pasos & Nameservers (9)
        </button>

        <button
          onClick={() => setActiveTab('icxn')}
          className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'icxn'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Pestaña 3: Consulta ICXN
        </button>

        <button
          onClick={() => setActiveTab('milton')}
          className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'milton'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Mensaje para Milton & Mikhail
        </button>
      </div>

      {/* Pestaña 1: Registros DNS */}
      {activeTab === 'dns' && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Corrección a lo dicho antes:</strong> En Vercel la redirección 308 va de la raíz hacia <strong>www</strong>, no al revés. El dominio principal es <strong>www.koalalotiene.com.ar</strong>. Vercel solo mostró el valor para @; si para www te muestra otro, usá ese.
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Nombre</th>
                  <th className="py-2.5 px-3">Contenido</th>
                  <th className="py-2.5 px-3">Proxy</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Notas</th>
                  <th className="py-2.5 px-3 text-right">Copiar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {DNS_RECORDS.map((r) => {
                  const isDone = dnsState[r.id] === 'Hecho';
                  const isNoReq = dnsState[r.id] === 'No requiere';

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isDone ? 'bg-emerald-50/50' : isNoReq ? 'bg-slate-50/40 text-slate-500' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-400 font-bold">{r.id}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(r.action)}`}>
                          {r.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.type}</td>
                      <td className="py-2.5 px-3 font-mono text-indigo-700 font-semibold">{r.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] max-w-xs break-all">{r.content}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.proxy === 'DNS only'
                            ? 'bg-slate-100 text-slate-700 border border-slate-300'
                            : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                          {r.proxy}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {isNoReq ? (
                          <span className="text-[11px] font-medium text-slate-400">No requiere</span>
                        ) : (
                          <button
                            onClick={() => toggleDnsState(r.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-colors ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isDone ? '✓ Hecho' : 'Pendiente'}
                          </button>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500 max-w-sm">{r.notes}</td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => copyToClipboard(r.content, `c-${r.id}`)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Copiar contenido"
                        >
                          {copiedKey === `c-${r.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pestaña 2: Pasos */}
      {activeTab === 'pasos' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Orden Recomendado de Pasos
            </h4>
            <div className="space-y-2">
              {STEPS_LIST.map((s) => (
                <div
                  key={s.id}
                  onClick={() => toggleStep(s.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    stepState[s.id]
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!stepState[s.id]}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        #{s.id}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200">
                        {s.where}
                      </span>
                    </div>
                    <h5 className={`text-xs font-bold ${stepState[s.id] ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {s.step}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nameservers Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <h5 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-600" />
              Nameservers a Modificar en NIC Argentina (nic.ar)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50/70 rounded-lg border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase block mb-1.5">Quitar (actuales en NIC):</span>
                <div className="space-y-1 font-mono text-red-900 text-[11px]">
                  <div>• nelly.ns.cloudflare.com</div>
                  <div>• zac.ns.cloudflare.com</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1.5">Poner (asignados a tu zona):</span>
                <div className="space-y-1 font-mono text-emerald-950 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>• braelyn.ns.cloudflare.com</span>
                    <button onClick={() => copyToClipboard('braelyn.ns.cloudflare.com', 'ns-b1')} className="text-slate-400 hover:text-slate-700">
                      {copiedKey === 'ns-b1' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• bryce.ns.cloudflare.com</span>
                    <button onClick={() => copyToClipboard('bryce.ns.cloudflare.com', 'ns-b2')} className="text-slate-400 hover:text-slate-700">
                      {copiedKey === 'ns-b2' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 italic space-y-1">
              <p>• <strong>Nota:</strong> si el correo falla tras el cambio, se puede volver atrás poniendo de nuevo nelly y zac.</p>
              <p>• <strong>Atención:</strong> al cambiar nameservers, sitio y correo dependen de lo cargado en Cloudflare. Conviene hacerlo en horario tranquilo.</p>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 3: Consulta ICXN */}
      {activeTab === 'icxn' && (
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Consulta a Soporte de ICXN (soporte@icxn.com.ar)
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Datos que solo ICXN puede confirmar.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Qué confirmar</th>
                    <th className="py-2.5 px-3">Por qué</th>
                    <th className="py-2.5 px-3">Respuesta de ICXN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {ICXN_QUESTIONS.map((q) => (
                    <tr key={q.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-400">{q.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{q.q}</td>
                      <td className="py-2.5 px-3 text-slate-600">{q.why}</td>
                      <td className="py-2.5 px-3 bg-amber-50/50 text-slate-400 italic">Pendiente de respuesta</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Template Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Mensaje para enviar a soporte@icxn.com.ar</span>
              <button
                onClick={() => copyToClipboard(`Hola, estamos migrando el DNS de koalalotiene.com.ar a Cloudflare. Necesitamos confirmar: 1) el destino correcto para webmail y mail, 2) el registro DKIM (selector y valor TXT), y 3) si hay algún otro registro necesario para el correo del dominio. Gracias.`, 'msg-icxn-text')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'msg-icxn-text' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>Copiar Plantilla</span>
              </button>
            </div>
            <pre className="text-xs font-sans whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
{`Hola, estamos migrando el DNS de koalalotiene.com.ar a Cloudflare. Necesitamos confirmar: 1) el destino correcto para webmail y mail, 2) el registro DKIM (selector y valor TXT), y 3) si hay algún otro registro necesario para el correo del dominio. Gracias.`}
            </pre>
          </div>
        </div>
      )}

      {/* Pestaña 4: Mensaje para Milton & Mikhail */}
      {activeTab === 'milton' && (
        <div className="p-5 sm:p-6 space-y-5">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  1. Mensaje para Milton (para que lo pase a Mikhail)
                </h4>
                <span className="text-[11px] text-slate-500">Resumen comercial y operativo listo para reenviar</span>
              </div>
              <button
                onClick={() => copyToClipboard(`Milton, ¿cómo andás? Te resumo lo que consultaron sobre la tienda:

Stock: cuando un cliente confirma una compra en la web, el stock se descuenta en el momento, así no se vende dos veces la misma unidad. Las ventas de mostrador y los ingresos de mercadería se sincronizan con el sistema de gestión, y el encargado de depósito los carga desde ahí.

Tiempos: la puesta en marcha lleva 10 días hábiles desde que recibimos los accesos y la información:
• Días 1 a 3: configuración, diseño base, categorías, medios de pago y envío.
• Días 4 a 8: carga de productos o integración con el sistema, radios de entrega y fletes, y automatización de WhatsApp.
• Días 9 a 10: pruebas de compra, validación de stock y lanzamiento.

Lo que necesitamos de ustedes:
• Listado de productos con precios, descripciones y stock inicial.
• Ubicación del local o depósito, radios de entrega y reglas de envío gratis.
• Accesos de Mercado Pago, cuentas de correo y el WhatsApp oficial.

Cualquier duda me avisás.`, 'msg-milton-mikhail')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'msg-milton-mikhail' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>Copiar Mensaje</span>
              </button>
            </div>

            <pre className="text-xs font-sans whitespace-pre-wrap bg-white p-3.5 rounded-lg border border-slate-200 text-slate-800 leading-relaxed mb-4">
{`Milton, ¿cómo andás? Te resumo lo que consultaron sobre la tienda:

Stock: cuando un cliente confirma una compra en la web, el stock se descuenta en el momento, así no se vende dos veces la misma unidad. Las ventas de mostrador y los ingresos de mercadería se sincronizan con el sistema de gestión, y el encargado de depósito los carga desde ahí.

Tiempos: la puesta en marcha lleva 10 días hábiles desde que recibimos los accesos y la información:
• Días 1 a 3: configuración, diseño base, categorías, medios de pago y envío.
• Días 4 a 8: carga de productos o integración con el sistema, radios de entrega y fletes, y automatización de WhatsApp.
• Días 9 a 10: pruebas de compra, validación de stock y lanzamiento.

Lo que necesitamos de ustedes:
• Listado de productos con precios, descripciones y stock inicial.
• Ubicación del local o depósito, radios de entrega y reglas de envío gratis.
• Accesos de Mercado Pago, cuentas de correo y el WhatsApp oficial.

Cualquier duda me avisás.`}
            </pre>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Antes de mandarlo:</strong> revisá con qué frecuencia se sincroniza el stock con ICXN. En la respuesta que reenviaste se promete "0 segundos", pero si la sincronización con el sistema de gestión es por consultas periódicas y no por webhooks, el descuento de la venta web es inmediato y el de mostrador no. Por eso en el borrador dejé la sincronización sin prometer tiempos.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
