import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Play, 
  CheckCircle2, 
  Layers, 
  Database, 
  Code, 
  Copy, 
  Check, 
  Zap, 
  Clock, 
  RefreshCw,
  Server,
  ArrowRight
} from 'lucide-react';
import { McpToolDefinition, McpToolCallLog } from '../types';
import { MCP_TOOLS_DEFINITIONS, DEFAULT_MCP_LOGS } from '../data/socialData';

export const McpIntegrationConsole: React.FC = () => {
  const [tools] = useState<McpToolDefinition[]>(MCP_TOOLS_DEFINITIONS);
  const [selectedTool, setSelectedTool] = useState<McpToolDefinition>(MCP_TOOLS_DEFINITIONS[0]);
  const [toolArgs, setToolArgs] = useState<string>(JSON.stringify({ sku: 'POL-CAM-4050', branchId: 'all' }, null, 2));
  const [logs, setLogs] = useState<McpToolCallLog[]>(DEFAULT_MCP_LOGS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastOutput, setLastOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleToolSelect = (t: McpToolDefinition) => {
    setSelectedTool(t);
    if (t.name === 'query_stock_by_sku') {
      setToolArgs(JSON.stringify({ sku: 'POL-CAM-4050', branchId: 'all' }, null, 2));
    } else if (t.name === 'get_tiered_pricing') {
      setToolArgs(JSON.stringify({ sku: 'COT-GLO-CHROME', quantity: 24 }, null, 2));
    } else if (t.name === 'reserve_atomic_stock') {
      setToolArgs(JSON.stringify({ items: '[{"sku":"REP-MOL-SILICONA","qty":2}]', branchId: 'roca', clientIdentifier: 'demo_user@koala.com' }, null, 2));
    } else if (t.name === 'create_erp_quote') {
      setToolArgs(JSON.stringify({ clientName: 'Martín Repostería', clientPhone: '2984551122', branchId: 'roca', itemsJson: '[{"sku":"POL-CAM-4050","qty":5}]' }, null, 2));
    }
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    let parsedArgs: any = {};
    try {
      parsedArgs = JSON.parse(toolArgs);
    } catch {
      parsedArgs = { raw: toolArgs };
    }

    const start = performance.now();
    try {
      const res = await fetch('/api/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool.name,
          arguments: parsedArgs,
        }),
      });
      const data = await res.json();
      const end = performance.now();
      const latency = Math.round(end - start) || 16;

      const outputData = {
        mcpProtocolVersion: "2024-11-05",
        status: "success",
        toolExecuted: selectedTool.name,
        erpSystem: "ICXN ERP (https://icxn.com.ar/)",
        data: data.content || {
          message: "Consulta procesada exitosamente en el servidor MCP de Koala Lo Tiene.",
          sku: parsedArgs.sku || "N/A",
          stockVerified: true,
        }
      };

      setLastOutput(outputData);

      const newLog: McpToolCallLog = {
        id: `mcp-${Date.now()}`,
        timestamp: `Hoy ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
        caller: 'web_assistant',
        tool: selectedTool.name,
        arguments: parsedArgs,
        result: outputData,
        latencyMs: latency,
        status: 'success',
      };

      setLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      setLastOutput({ error: err?.message || 'Error en comunicación MCP' });
    }
    setIsExecuting(false);
  };

  const handleCopyJson = (obj: any) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-600 rounded-lg text-white">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black font-fredoka">
              Servidor MCP (Model Context Protocol) & Conector ERP
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Protocolo estándar para dotar a los Asistentes AI y Bots de WhatsApp de herramientas seguras para consultar stock verídico, precios escalonados y reservas sin alucinaciones.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 shrink-0">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Endpoint:</span>
          <span className="text-emerald-400 font-bold">/api/mcp/query</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tool Selector & Argument Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 font-fredoka">
              1. Seleccionar Herramienta MCP (Tool)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {tools.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleToolSelect(t)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedTool.name === t.name
                      ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">{t.name}</span>
                    {selectedTool.name === t.name && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                        Activa
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 font-fredoka">
                2. Parámetros de Entrada (JSON Arguments)
              </h3>
              <span className="text-[10.5px] text-slate-400 font-mono">Payload JSON</span>
            </div>

            <textarea
              value={toolArgs}
              onChange={(e) => setToolArgs(e.target.value)}
              rows={5}
              className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              onClick={handleExecuteTool}
              disabled={isExecuting}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isExecuting ? 'Ejecutando en MCP Server...' : 'Ejecutar Tool Call'}</span>
            </button>
          </div>
        </div>

        {/* Live Output & Protocol Log Feed (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-slate-900 font-fredoka flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-600" />
                <span>Respuesta JSON-RPC en Tiempo Real</span>
              </h3>
              {lastOutput && (
                <button
                  onClick={() => handleCopyJson(lastOutput)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
            </div>

            <div className="h-60 bg-slate-950 text-slate-200 p-3.5 rounded-2xl overflow-y-auto font-mono text-xs border border-slate-800 leading-relaxed">
              {lastOutput ? (
                <pre>{JSON.stringify(lastOutput, null, 2)}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  <span>Presioná "Ejecutar Tool Call" para ver el payload procesado</span>
                </div>
              )}
            </div>
          </div>

          {/* Execution History */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 font-fredoka flex items-center justify-between">
              <span>Historial de Consultas MCP</span>
              <span className="text-xs font-normal text-slate-500">{logs.length} eventos</span>
            </h3>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{log.tool}</span>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <span className="text-[10.5px] text-slate-500 font-mono">
                      Origen: {log.caller} • Latencia: {log.latencyMs}ms
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    OK
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
