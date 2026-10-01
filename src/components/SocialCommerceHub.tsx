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
  AlertCircle,
  Grid,
  Layers,
  BarChart3,
  Flame,
  ShoppingBag,
  Megaphone,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Mail,
  Radio
} from 'lucide-react';
import { 
  SocialTriggerRule, 
  SocialLead, 
  SocialCampaignLink, 
  BranchInfo, 
  ProductInventoryRecord 
} from '../types';
import { 
  DEFAULT_SOCIAL_TRIGGERS, 
  DEFAULT_SOCIAL_LEADS, 
  DEFAULT_CAMPAIGN_LINKS 
} from '../data/socialData';
import { STORES_DATA } from '../data/products';
import { formatCurrency } from '../utils/helpers';
import { InstagramFeedViewer } from './InstagramFeedViewer';

interface SocialCommerceHubProps {
  currentBranch?: BranchInfo;
  inventory?: ProductInventoryRecord[];
  onNavigateToStore?: () => void;
  onAddToCart?: (product: ProductInventoryRecord, quantity: number, isWholesale: boolean) => void;
}

export const SocialCommerceHub: React.FC<SocialCommerceHubProps> = ({ 
  currentBranch = STORES_DATA[0],
  inventory = [],
  onNavigateToStore,
  onAddToCart
}) => {
  // Main Module Tab State
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'inbound' | 'outbound' | 'simulator' | 'triggers' | 'leads' | 'campaigns'>('feed');

  const [triggers, setTriggers] = useState<SocialTriggerRule[]>(DEFAULT_SOCIAL_TRIGGERS);
  const [leads, setLeads] = useState<SocialLead[]>(DEFAULT_SOCIAL_LEADS);
  const [campaigns, setCampaigns] = useState<SocialCampaignLink[]>(DEFAULT_CAMPAIGN_LINKS);

  // Outbound Broadcast State
  const [outboundSegment, setOutboundSegment] = useState<'mayoristas' | 'reposteria' | 'indumentaria' | 'abandoned_carts'>('mayoristas');
  const [outboundTemplate, setOutboundTemplate] = useState<'oferta_polietileno' | 'carrito_abandonado' | 'cupon_club'>('oferta_polietileno');
  const [isDispatchingOutbound, setIsDispatchingOutbound] = useState(false);
  const [outboundDispatchedSuccess, setOutboundDispatchedSuccess] = useState(false);
  const [outboundCustomMsg, setOutboundCustomMsg] = useState(
    '¡Hola! 🐨 Te escribimos de Fábrica Koala Lo Tiene. Lanzamos precios especiales en Bolsas de Polietileno por Bulto Cerrado con envío en 24h a Roca y Neuquén. Ver catálogo: https://koalalotiene.com.ar/?src=outbound_wa'
  );

  // Inbound Story Mention State
  const [storyMentionReply, setStoryMentionReply] = useState(
    '¡Gracias por mencionarnos en tu historia de Instagram! 🐨 Te regalamos un cupón del 5% OFF para tu próxima compra en la tienda web: CUPON-HISTORIA-5. Ver catálogo: https://koalalotiene.com.ar'
  );
  const [storyMentionActive, setStoryMentionActive] = useState(true);
  
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

  // New Trigger Form State
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [newPlatform, setNewPlatform] = useState<SocialTriggerRule['platform']>('instagram_dm');

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

  // Called from Instagram feed to immediately test a post's trigger
  const handleTestTriggerFromFeed = (keyword: string) => {
    setActiveSubTab('simulator');
    setSimulatedUserMsg(keyword);
    setTimeout(() => {
      handleSendSimulated(keyword);
    }, 150);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: SocialLead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleCreateTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newResponse.trim()) return;

    const newRule: SocialTriggerRule = {
      id: `trig-${Date.now()}`,
      keyword: newKeyword.trim().toUpperCase(),
      platform: newPlatform,
      actionType: 'reply_catalog_link',
      responseTemplate: newResponse.trim(),
      active: true,
      matchCount: 0,
    };

    setTriggers(prev => [newRule, ...prev]);
    setNewKeyword('');
    setNewResponse('');
    setShowAddTrigger(false);
  };

  const filteredLeads = leads.filter(l => {
    if (leadStatusFilter === 'all') return true;
    return l.status === leadStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-orange-950 p-5 sm:p-6 rounded-3xl text-white border border-purple-800/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 rounded-xl text-white shadow-md">
              <Instagram className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-fredoka flex items-center gap-2">
                <span>Módulo Social Commerce & Automatización @koalalotiene</span>
              </h2>
              <span className="text-[11px] font-bold text-orange-300">
                Instagram Graph API • Feed en Vivo • ManyChat Webhooks • CRM de Leads
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Gestión integral de la presencia oficial en Instagram (@koalalotiene). Feed interactivo de publicaciones, sincronización de stock con ERP, respuestas automáticas ante palabras clave y derivación fluida de clientes a WhatsApp y tienda web.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-2.5 shrink-0 overflow-x-auto pb-1 md:pb-0">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] text-purple-200 uppercase font-extrabold block">Clicks en Bio</span>
            <span className="text-lg font-black text-white">
              {campaigns.reduce((acc, c) => acc + c.clicksCount, 0)}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] text-emerald-300 uppercase font-extrabold block">Pedidos Derivados</span>
            <span className="text-lg font-black text-emerald-400">
              {campaigns.reduce((acc, c) => acc + c.ordersGenerated, 0)}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] text-amber-300 uppercase font-extrabold block">Tasa Conversión</span>
            <span className="text-lg font-black text-amber-300">
              {((campaigns.reduce((acc, c) => acc + c.ordersGenerated, 0) / campaigns.reduce((acc, c) => acc + c.clicksCount, 0)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('feed')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'feed'
              ? 'bg-gradient-to-r from-purple-600 via-rose-600 to-orange-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>📱 Feed de Instagram (@koalalotiene)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inbound')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'inbound'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>📥 INBOUND Auto-DM & Historias</span>
        </button>

        <button
          onClick={() => setActiveSubTab('outbound')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'outbound'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>📤 OUTBOUND Broadcast & Carritos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'simulator'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>🤖 Simulador ManyChat</span>
        </button>

        <button
          onClick={() => setActiveSubTab('triggers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'triggers'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>🏷️ Keywords ({triggers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leads')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'leads'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 CRM Leads ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'campaigns'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>🔗 Enlaces & Bio</span>
        </button>
      </div>

      {/* SUB-TAB 1: INSTAGRAM FEED IN VIVO */}
      {activeSubTab === 'feed' && (
        <InstagramFeedViewer
          inventory={inventory}
          currentBranch={currentBranch}
          onNavigateToStore={onNavigateToStore}
          onTestTrigger={handleTestTriggerFromFeed}
          onAddToCart={onAddToCart}
        />
      )}

      {/* SUB-TAB 1.5: INBOUND AUTOMATION & STORY MENTIONS */}
      {activeSubTab === 'inbound' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 rounded-3xl text-white border border-emerald-800/40 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/30 rounded-2xl border border-emerald-500/40 text-emerald-400">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  ESTRATEGIA INBOUND @KOALALOTIENE
                </span>
                <h3 className="text-xl font-extrabold font-fredoka text-white">
                  Atracción Orgánica, Auto-DM y Menciones en Historias
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Respuesta en menos de 1 segundo ante comentarios, menciones de etiqueta y DMs. Convierte la curiosidad en ventas web inmediatas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Story Mentions Auto-Responder */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-rose-500" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-fredoka">
                    Auto-DM por Menciones en Historias
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setStoryMentionActive(!storyMentionActive)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    storyMentionActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {storyMentionActive ? '✓ Activo (24/7)' : 'Pausado'}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Cada vez que un cliente etiqueta a <strong>@koalalotiene</strong> en sus historias de Instagram, el bot le envía automáticamente un mensaje privado con un cupón de agradecimiento:
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Plantilla de Respuesta Privada (Auto-DM):
                </label>
                <textarea
                  rows={3}
                  value={storyMentionReply}
                  onChange={(e) => setStoryMentionReply(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  ⚡ Latencia promedio de envío: <strong>480ms</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleTestTriggerFromFeed('MENCION');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Probar Mención en Simulador</span>
                </button>
              </div>
            </div>

            {/* Inbound Comment-to-DM Rules Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-fredoka">
                    Embudo Inbound Comentario ➔ Mensaje Directo (DM)
                  </h4>
                </div>
                <span className="text-[10px] font-mono bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold px-2.5 py-0.5 rounded-full">
                  Meta Graph API Live
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      💬 Comentario en Reel o Post
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Usuario escribe "PRECIO", "POLIETILENO", "DONDE ESTAN"
                    </p>
                  </div>
                  <span className="text-xs font-black text-orange-600 dark:text-orange-400 shrink-0">
                    Step 1
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      📩 Respuesta Auto-DM Privado
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Envía catálogo con link UTM personalizado de la categoría
                    </p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                    Step 2 (&lt; 1s)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      🛒 Conversión Directa a Cotizador Web
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Sincronización con stock de Casa Central Roca y Neuquén
                    </p>
                  </div>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 shrink-0">
                    Step 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1.6: OUTBOUND BROADCAST & CARTS RECOVERY */}
      {activeSubTab === 'outbound' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-blue-800/40 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/30 rounded-2xl border border-blue-500/40 text-blue-400">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold">
                  ESTRATEGIA OUTBOUND @KOALALOTIENE
                </span>
                <h3 className="text-xl font-extrabold font-fredoka text-white">
                  Campañas Broadcast Proactivas & Recuperación de Carritos
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Envió masivo de ofertas segmentadas vía WhatsApp API Oficial (Cloud API Meta) y reactivación automática de cotizaciones no finalizadas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Outbound Broadcast Launcher Form (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-fredoka">
                    Lanzador de Campaña Outbound Broadcast (WhatsApp HSM)
                  </h4>
                </div>
                <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full">
                  Meta Cloud API Verified
                </span>
              </div>

              {/* Step 1: Select Target Segment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  1. Seleccionar Segmento de Público Destino:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutboundSegment('mayoristas')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      outboundSegment === 'mayoristas'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-extrabold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="text-xs">📦 Mayoristas Polietileno</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">480 contactos</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutboundSegment('reposteria')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      outboundSegment === 'reposteria'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-extrabold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="text-xs">🎂 Repostería & Moldes</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">320 contactos</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutboundSegment('indumentaria')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      outboundSegment === 'indumentaria'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-extrabold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="text-xs">🛍️ Locales de Ropa</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">290 contactos</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutboundSegment('abandoned_carts')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      outboundSegment === 'abandoned_carts'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-extrabold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="text-xs">🛒 Carritos Abandonados</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">160 contactos</div>
                  </button>
                </div>
              </div>

              {/* Step 2: Select HSM Approved Template */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  2. Plantilla Pre-Aprobada HSM (Meta Cloud API):
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOutboundTemplate('oferta_polietileno');
                      setOutboundCustomMsg('¡Hola! 🐨 Te escribimos de Fábrica Koala Lo Tiene. Lanzamos precios especiales en Bolsas de Polietileno por Bulto Cerrado con envío en 24h a Roca y Neuquén. Ver catálogo: https://koalalotiene.com.ar/?src=outbound_wa');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border w-full sm:w-auto transition-all cursor-pointer ${
                      outboundTemplate === 'oferta_polietileno'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    Lanzamiento Fábrica Polietileno
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOutboundTemplate('carrito_abandonado');
                      setOutboundCustomMsg('¡Hola! 🐨 Notamos que dejaste pendiente tu pedido de cotización en Koala Lo Tiene. Si confirmás tu compra hoy te mantenemos el 5% OFF por transferencia. Finalizar pedido: https://koalalotiene.com.ar/?src=outbound_cart');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border w-full sm:w-auto transition-all cursor-pointer ${
                      outboundTemplate === 'carrito_abandonado'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    Recuperación de Cotización Pendiente
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOutboundTemplate('cupon_club');
                      setOutboundCustomMsg('¡Hola! 🐨 ¡Tus Puntos Club Koala están activos! Acumulás beneficios en cada compra en General Roca y Neuquén. Tenés un cupón disponible. Ver tus puntos: https://koalalotiene.com.ar/?src=outbound_club');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border w-full sm:w-auto transition-all cursor-pointer ${
                      outboundTemplate === 'cupon_club'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    Fidelización Club Koala
                  </button>
                </div>
              </div>

              {/* Message Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  3. Contenido del Mensaje Masivo Outbound:
                </label>
                <textarea
                  rows={4}
                  value={outboundCustomMsg}
                  onChange={(e) => setOutboundCustomMsg(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Dispatch Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Total destinatarios: <strong>1.250 contactos verificados</strong>
                </span>

                <button
                  type="button"
                  disabled={isDispatchingOutbound}
                  onClick={() => {
                    setIsDispatchingOutbound(true);
                    setTimeout(() => {
                      setIsDispatchingOutbound(false);
                      setOutboundDispatchedSuccess(true);
                      setTimeout(() => setOutboundDispatchedSuccess(false), 4000);
                    }, 1800);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                    outboundDispatchedSuccess
                      ? 'bg-emerald-600 text-white'
                      : isDispatchingOutbound
                      ? 'bg-blue-400 text-white animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                  }`}
                >
                  {outboundDispatchedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 animate-bounce" />
                      <span>¡Campaña Outbound Disparada con Éxito!</span>
                    </>
                  ) : isDispatchingOutbound ? (
                    <>
                      <Radio className="w-4 h-4 animate-spin" />
                      <span>Enviando Broadcast por WhatsApp API...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>🚀 Disparar Campaña Outbound</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Outbound Recovery & Analytics Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xs">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Métricas de Campañas Outbound</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                    <span className="text-slate-500">Tasa de Entrega:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">99.2%</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                    <span className="text-slate-500">Tasa de Lectura:</span>
                    <strong className="text-blue-600 dark:text-blue-400">91.5%</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                    <span className="text-slate-500">Clicks en Catálogo:</span>
                    <strong className="text-purple-600 dark:text-purple-400">42.8%</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                    <span className="text-slate-500">Conversión en Ventas:</span>
                    <strong className="text-amber-600 dark:text-amber-400">18.6%</strong>
                  </div>
                </div>
              </div>

              {/* Abandoned Cart Quick Trigger List */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xs">
                  <ShoppingCart className="w-4 h-4 text-orange-500" />
                  <span>Carritos Pendientes de Recuperación</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Panadería San Martín</div>
                      <div className="text-[10px] text-slate-500">15.000 u. Bolsas Camiseta ($142.000)</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://wa.me/5492984508899?text=Hola!%20Te%20contactamos%20de%20Koala%20Lo%20Tiene%20para%20finalizar%20tu%20pedido`, '_blank');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 shrink-0 cursor-pointer"
                    >
                      Recordar WA
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Pastelería Neuquén</div>
                      <div className="text-[10px] text-slate-500">Moldes Silicona + Mangas ($38.500)</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://wa.me/5492994102030?text=Hola!%20Te%20contactamos%20de%20Koala%20Lo%20Tiene%20para%20finalizar%20tu%20pedido`, '_blank');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 shrink-0 cursor-pointer"
                    >
                      Recordar WA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SIMULATOR & AUTOMATION */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Box (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-fredoka">
                    Simulador Interactivo de Instagram DM & ManyChat
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Probá disparar respuestas automáticas escribiendo consultas reales de clientes
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Webhook Conectado
              </span>
            </div>

            {/* Quick Trigger Test Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Probar disparadores:</span>
              {triggers.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSendSimulated(t.keyword)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-orange-950 dark:hover:text-orange-300 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  "{t.keyword}"
                </button>
              ))}
            </div>

            {/* Simulated Chat Feed */}
            <div className="h-80 bg-slate-950 rounded-2xl p-4 overflow-y-auto space-y-3 font-sans border border-slate-800">
              {chatLog.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] opacity-75 mb-1 font-semibold">
                      {m.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-orange-400" />}
                      <span>{m.sender === 'user' ? 'Cliente Instagram' : 'Bot Oficial @koalalotiene'}</span>
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
                placeholder="Escribí un mensaje o palabra clave (ej: PRECIO, REPOSTERIA, STOCK, COTILLON)..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
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

          {/* Quick Trigger Info & Shortcuts (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Lógica de Automatización
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Cada vez que un cliente comenta un reel o envía un DM con palabras como <strong>PRECIO</strong>, <strong>STOCK</strong> o <strong>REPOSTERIA</strong>, el webhook procesa la solicitud en &lt;50ms y envía el catálogo con UTM tracking específico.
              </p>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-orange-600" />
                  <span>Sincronización con ERP</span>
                </div>
                <p className="text-[11px]">
                  Las respuestas consultan stock en Roca (DEP-01) y Neuquén (DEP-02) antes de derivar el pedido a WhatsApp.
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab('triggers')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Todas las Reglas de Palabras Clave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TRIGGERS & KEYWORDS MANAGER */}
      {activeSubTab === 'triggers' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-fredoka flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Palabras Clave & Reglas de Automatización Activas</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Respuestas preconfiguradas para comentarios en reels, publicaciones y mensajes directos.
              </p>
            </div>

            <button
              onClick={() => setShowAddTrigger(!showAddTrigger)}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Palabra Clave</span>
            </button>
          </div>

          {/* Add Trigger Form */}
          {showAddTrigger && (
            <form onSubmit={handleCreateTrigger} className="p-4 bg-orange-50/60 dark:bg-slate-900 rounded-2xl border border-orange-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Palabra Clave (Trigger)</label>
                  <input
                    type="text"
                    required
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Ej: COTIZAR, DESCUENTO, MAYORISTA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Canal de Disparo</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="instagram_dm">Instagram Direct Message (DM)</option>
                    <option value="instagram_comment">Comentario en Reel / Post</option>
                    <option value="manychat">ManyChat Webhook Global</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Plantilla de Respuesta Automática</label>
                  <textarea
                    rows={2}
                    required
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="¡Hola! 🐨 Te compartimos el catálogo con stock y precios en vivo: https://koalalotiene.com.ar"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrigger(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          )}

          {/* Trigger Rules List */}
          <div className="space-y-2.5">
            {triggers.map(rule => (
              <div
                key={rule.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-mono font-black text-xs">
                      {rule.keyword}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                      Canal: {rule.platform}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md font-bold">
                      {rule.matchCount} disparos ejecutados
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {rule.responseTemplate}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopy(rule.responseTemplate, rule.id)}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Copiar plantilla"
                  >
                    {copiedId === rule.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleSendSimulated(rule.keyword)}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-xs border border-orange-200 dark:border-orange-800 cursor-pointer"
                  >
                    Probar en Simulador
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LEADS & CRM */}
      {activeSubTab === 'leads' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-fredoka flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Bandeja de Leads de Instagram & Meta Ads</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prospectos capturados desde mensajes directos, comentarios y link en bio listos para derivación y cierre comercial.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {['all', 'nuevo', 'contactado_whatsapp', 'presupuesto_enviado', 'cerrado_erp'].map(status => (
                <button
                  key={status}
                  onClick={() => setLeadStatusFilter(status)}
                  className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                    leadStatusFilter === status
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'Todos' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <span>{lead.handleOrName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold uppercase">
                        {lead.source}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{lead.date}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    lead.status === 'cerrado_erp'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : lead.status === 'presupuesto_enviado'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : lead.status === 'contactado_whatsapp'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-slate-700 dark:text-slate-300 text-xs font-medium bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong>Interés:</strong> {lead.requestedProduct || lead.interestCategory}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Sucursal: <strong>{lead.branchPreference === 'roca' ? 'General Roca' : 'Neuquén'}</strong></span>
                  {lead.estimatedValue && (
                    <span className="font-bold text-slate-900 dark:text-white">
                      Estimado: {formatCurrency(lead.estimatedValue)}
                    </span>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                  {lead.phone && (
                    <a
                      href={`https://wa.me/549${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${lead.handleOrName}! Te escribimos de Koala Lo Tiene por tu consulta en Instagram sobre ${lead.requestedProduct || 'nuestro catálogo'}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Abrir WhatsApp</span>
                    </a>
                  )}

                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                    className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold"
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
      )}

      {/* SUB-TAB 5: CAMPAIGNS & BIO LINKS */}
      {activeSubTab === 'campaigns' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-700/80 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-fredoka flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span>Métricas de Enlaces de Campaña & Bio Link</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Rendimiento de URLs con UTM tags para medir ventas generadas desde historias, reels y perfil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map(c => (
              <div
                key={c.id}
                className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{c.targetUrl}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 uppercase">
                    {c.campaignSource}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Clicks</span>
                    <strong className="text-sm font-black text-slate-900 dark:text-white">{c.clicksCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Pedidos</span>
                    <strong className="text-sm font-black text-emerald-600">{c.ordersGenerated}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Conversión</span>
                    <strong className="text-sm font-black text-orange-600">
                      {((c.ordersGenerated / c.clicksCount) * 100).toFixed(1)}%
                    </strong>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleCopy(c.targetUrl, c.id)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Enlace UTM</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
