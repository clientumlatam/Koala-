import React, { useState } from 'react';
import { 
  Instagram, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Check, 
  Copy, 
  ExternalLink, 
  Tag, 
  Plus, 
  Trash2, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Phone, 
  Clock, 
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SocialTriggerRule, SocialLead, SocialCampaignLink, BranchInfo } from '../types';
import { DEFAULT_SOCIAL_TRIGGERS, DEFAULT_SOCIAL_LEADS, DEFAULT_CAMPAIGN_LINKS } from '../data/socialData';
import { formatCurrency } from '../utils/helpers';

interface SocialCommerceHubProps {
  currentBranch: BranchInfo;
}

export const SocialCommerceHub: React.FC<SocialCommerceHubProps> = ({ currentBranch }) => {
  const [triggers, setTriggers] = useState<SocialTriggerRule[]>(DEFAULT_SOCIAL_TRIGGERS);
  const [leads, setLeads] = useState<SocialLead[]>(DEFAULT_SOCIAL_LEADS);
  const [campaigns, setCampaigns] = useState<SocialCampaignLink[]>(DEFAULT_CAMPAIGN_LINKS);
  
  // Simulator State
  const [simulatedUserMsg, setSimulatedUserMsg] = useState('PRECIO');
  const [simulatedPlatform, setSimulatedPlatform] = useState<'instagram_dm' | 'instagram_comment' | 'manychat'>('instagram_dm');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'bot'; text: string; time: string; actionLink?: string }[]>([
    {
      sender: 'user',
      text: '¡Hola! ¿Tienen stock de moldes de repostería en General Roca?',
      time: '18:30',
    },
    {
      sender: 'bot',
      text: '¡Hola! 🐨 Sí, tenemos stock en Casa Central General Roca (Av. Roca 1350). Podés consultar el catálogo completo con fotos y armar tu lista en 3 clics: https://koalalotiene.com.ar/?cat=reposteria',
      time: '18:30',
      actionLink: 'https://koalalotiene.com.ar/?cat=reposteria',
    },
  ]);

  // Lead Filter
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Run Simulated Trigger
  const handleSendSimulated = (msgText?: string) => {
    const textToSend = msgText || simulatedUserMsg;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Match trigger keyword
    const upper = textToSend.toUpperCase();
    const matched = triggers.find(t => upper.includes(t.keyword.toUpperCase()) && t.active);

    let botResponse = '';
    let link: string | undefined = undefined;

    if (matched) {
      botResponse = matched.responseTemplate;
      if (matched.targetCategoryId) {
        link = `https://koalalotiene.com.ar/?cat=${matched.targetCategoryId}`;
      } else {
        link = `https://koalalotiene.com.ar/?src=ig_auto`;
      }

      // Update match count
      setTriggers(prev => prev.map(t => t.id === matched.id ? { ...t, matchCount: t.matchCount + 1 } : t));
    } else {
      botResponse = `¡Hola! 🐨 Gracias por escribir a Koala Lo Tiene (@koalalotiene). Para consultas personalizadas sobre stock en Roca o Neuquén podés ingresar a nuestra tienda online: https://koalalotiene.com.ar o chatear con un asesor al WhatsApp: ${currentBranch.whatsappFormatted}`;
      link = `https://koalalotiene.com.ar`;
    }

    const botMsg = {
      sender: 'bot' as const,
      text: botResponse,
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      actionLink: link,
    };

    setChatLog(prev => [...prev, userMsg, botMsg]);
    setSimulatedUserMsg('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: SocialLead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const filteredLeads = leads.filter(l => {
    if (leadStatusFilter === 'all') return true;
    return l.status === leadStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-orange-950 p-5 rounded-3xl text-white border border-purple-800/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-lg text-white">
              <Instagram className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black font-fredoka">
              Módulo Social Commerce & Automatización @koalalotiene
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Integración de Instagram Graph API & ManyChat para derivación de ventas en 3 clics hacia la tienda y WhatsApp. Respuestas automáticas con verificación de stock en tiempo real con el ERP.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-purple-200 uppercase font-bold block">Clicks en Bio</span>
            <span className="text-lg font-black text-white">
              {campaigns.reduce((acc, c) => acc + c.clicksCount, 0)}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Pedidos Derivados</span>
            <span className="text-lg font-black text-emerald-400">
              {campaigns.reduce((acc, c) => acc + c.ordersGenerated, 0)}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Tasa Conversión</span>
            <span className="text-lg font-black text-amber-300">
              {((campaigns.reduce((acc, c) => acc + c.ordersGenerated, 0) / campaigns.reduce((acc, c) => acc + c.clicksCount, 0)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Triggers & Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Simulator Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900 font-fredoka">
                  Simulador de Respuestas Automáticas (ManyChat / Instagram DM)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Webhook Activo
              </span>
            </div>

            {/* Quick Trigger Test Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">Probar disparador:</span>
              {triggers.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSendSimulated(t.keyword)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-900 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                >
                  "{t.keyword}"
                </button>
              ))}
            </div>

            {/* Simulated Chat Feed */}
            <div className="h-64 bg-slate-950 rounded-2xl p-3.5 overflow-y-auto space-y-3 font-sans border border-slate-800">
              {chatLog.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] opacity-75 mb-1 font-semibold">
                      {m.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-orange-400" />}
                      <span>{m.sender === 'user' ? 'Usuario en Instagram' : 'Bot @koalalotiene'}</span>
                      <span>• {m.time}</span>
                    </div>
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.actionLink && (
                      <div className="mt-2 pt-2 border-t border-slate-700/80">
                        <a
                          href={m.actionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 underline"
                        >
                          <span>Abrir Catálogo / Link en Bio</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input to send custom prompt to bot */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={simulatedUserMsg}
                onChange={(e) => setSimulatedUserMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSimulated()}
                placeholder="Escribí un mensaje o palabra clave (ej: PRECIO, REPOSTERIA, STOCK)..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => handleSendSimulated()}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simular DM</span>
              </button>
            </div>
          </div>

          {/* Trigger Rules Manager Table */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-fredoka">
                  Palabras Clave & Reglas de Automatización Activas
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cuando un cliente comenta en un reel/post o envía un DM con estas palabras, se dispara el bot automáticamente.
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {triggers.map(rule => (
                <div
                  key={rule.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-mono font-black text-[11px]">
                        {rule.keyword}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">
                        Plataforma: {rule.platform}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                        {rule.matchCount} disparos
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11.5px] line-clamp-2">
                      {rule.responseTemplate}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(rule.responseTemplate, rule.id)}
                    className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                    title="Copiar plantilla"
                  >
                    {copiedId === rule.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Meta Leads & Social CRM (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Leads Inbox */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900 font-fredoka">
                  Captura de Leads (Instagram & Meta Ads)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {leads.length} leads
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              <button
                onClick={() => setLeadStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  leadStatusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setLeadStatusFilter('nuevo')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  leadStatusFilter === 'nuevo' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Nuevos
              </button>
              <button
                onClick={() => setLeadStatusFilter('cerrado_erp')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  leadStatusFilter === 'cerrado_erp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cerrados ERP
              </button>
            </div>

            {/* Leads List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{lead.handleOrName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold uppercase">
                          {lead.source}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{lead.date}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      lead.status === 'cerrado_erp'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lead.status === 'presupuesto_enviado'
                        ? 'bg-blue-100 text-blue-800'
                        : lead.status === 'contactado_whatsapp'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-slate-700 text-[11.5px] font-medium bg-white p-2 rounded-xl border border-slate-100">
                    <strong>Interés:</strong> {lead.requestedProduct || lead.interestCategory}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Sucursal: <strong>{lead.branchPreference === 'roca' ? 'General Roca' : 'Neuquén'}</strong></span>
                    {lead.estimatedValue && (
                      <span className="font-bold text-slate-900">
                        Est.: {formatCurrency(lead.estimatedValue)}
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                    {lead.phone && (
                      <a
                        href={`https://wa.me/549${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${lead.handleOrName}! Te escribimos de Koala Lo Tiene por tu consulta en Instagram sobre ${lead.requestedProduct || 'nuestro catálogo'}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Abrir WhatsApp</span>
                      </a>
                    )}

                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                      className="p-1.5 bg-white border border-slate-300 rounded-xl text-[10.5px] font-bold"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado_whatsapp">Contactado</option>
                      <option value="presupuesto_enviado">Cotizado</option>
                      <option value="cerrado_erp">Cerrado ERP</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
