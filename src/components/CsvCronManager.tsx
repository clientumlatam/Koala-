import React, { useState } from 'react';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Terminal,
  Check,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Eye,
  Layers,
  Zap,
  Copy,
  Calendar,
  X,
  Server,
  Database,
  ArrowRight
} from 'lucide-react';
import { 
  CsvCronTask, 
  CsvCronExecutionLog, 
  ProductInventoryRecord 
} from '../types';
import { formatCurrency } from '../utils/helpers';

interface CsvCronManagerProps {
  tasks: CsvCronTask[];
  onUpdateTasks: (tasks: CsvCronTask[]) => void;
  logs: CsvCronExecutionLog[];
  onAddLog: (log: CsvCronExecutionLog) => void;
  inventory: ProductInventoryRecord[];
  onUpdateInventoryPrices: (updatedItems: { sku: string; price?: number; wholesalePrice?: number; stockRoca?: number; stockNeuquen?: number }[]) => void;
  onTriggerErpSync: () => void;
}

export const CsvCronManager: React.FC<CsvCronManagerProps> = ({
  tasks,
  onUpdateTasks,
  logs,
  onAddLog,
  inventory,
  onUpdateInventoryPrices,
  onTriggerErpSync,
}) => {
  // Active sub-view within CSV Cron tab
  const [subView, setSubView] = useState<'tasks' | 'tester_parser' | 'logs' | 'templates'>('tasks');
  
  // Running simulation state
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New / Edit task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<CsvCronTask | null>(null);
  
  // Form states for Cron Task
  const [taskName, setTaskName] = useState('');
  const [taskCronExp, setTaskCronExp] = useState('0 */2 * * *');
  const [taskHumanSchedule, setTaskHumanSchedule] = useState('Cada 2 horas en punto');
  const [taskType, setTaskType] = useState<CsvCronTask['type']>('import_prices_stock');
  const [taskSourceType, setTaskSourceType] = useState<CsvCronTask['sourceType']>('http_url');
  const [taskSourceUrl, setTaskSourceUrl] = useState('https://erp.koalalotiene.com.ar/cron/precios_actualizados.csv');
  const [taskDelimiter, setTaskDelimiter] = useState<CsvCronTask['delimiter']>(',');
  const [taskEncoding, setTaskEncoding] = useState<CsvCronTask['encoding']>('UTF-8');

  // Interactive CSV Tester/Parser state
  const [rawCsvInput, setRawCsvInput] = useState<string>(
    'SKU,NOMBRE,PRECIO_LISTA,PRECIO_MAYORISTA,STOCK_ROCA,STOCK_NEUQUEN\n' +
    'KOA-POL-101,Film Stretch Cristal Virgen 50cm,34500,28900,120,85\n' +
    'KOA-POL-102,Bolsas Camiseta Reforzadas 40x50,12800,10500,200,150\n' +
    'KOA-PAP-103,Resma Fotocopia A4 75g Autor,42000,36000,80,65\n' +
    'KOA-CAR-104,Cajas de Cartón Corrugado 40x30x30,1850,1490,300,210\n' +
    'KOA-DES-105,Vasos Plásticos Descartables 220cc x100,2800,2250,150,110'
  );
  const [parserDelimiter, setParserDelimiter] = useState<string>(',');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parserStats, setParserStats] = useState<{ total: number; validSkus: number; matchedInventory: number } | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Cron schedule presets helper
  const cronPresets = [
    { label: 'Cada 15 minutos', exp: '*/15 * * * *', human: 'Cada 15 minutos' },
    { label: 'Cada 30 minutos', exp: '*/30 * * * *', human: 'Cada 30 minutos' },
    { label: 'Cada 1 hora', exp: '0 * * * *', human: 'Cada 1 hora en punto' },
    { label: 'Cada 2 horas', exp: '0 */2 * * *', human: 'Cada 2 horas en punto' },
    { label: 'Diario 04:00 AM (Cierre)', exp: '0 4 * * *', human: 'Todos los días a las 04:00 AM' },
    { label: 'Lunes a Viernes 20:00 hs', exp: '0 20 * * 1-5', human: 'Lunes a Viernes a las 20:00 hs' },
    { label: 'Lunes a las 08:00 AM', exp: '0 8 * * 1', human: 'Todos los Lunes a las 08:00 AM' },
  ];

  const handleApplyPreset = (preset: typeof cronPresets[0]) => {
    setTaskCronExp(preset.exp);
    setTaskHumanSchedule(preset.human);
  };

  // Toggle active state of task
  const handleToggleTaskActive = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, active: !t.active } : t));
    onUpdateTasks(updated);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      showNotification(`Tarea ${task.id} ${!task.active ? 'activada' : 'pausada'}.`);
    }
  };

  // Execute Cron Task immediately (Simulated background job runner)
  const handleRunTask = (task: CsvCronTask) => {
    setRunningTaskId(task.id);
    const startTime = Date.now();

    setTimeout(() => {
      const duration = Date.now() - startTime;
      const count = Math.floor(Math.random() * 20) + 30;
      const nowStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Simulate pricing/stock update on items
      const sampleUpdates = inventory.slice(0, 10).map((item) => ({
        sku: item.sku,
        price: item.price + (Math.random() > 0.5 ? 500 : 0),
        wholesalePrice: item.wholesalePrice ? item.wholesalePrice + (Math.random() > 0.5 ? 400 : 0) : undefined,
        stockRoca: item.stockRoca + Math.floor(Math.random() * 10 - 3),
        stockNeuquen: item.stockNeuquen + Math.floor(Math.random() * 8 - 2),
      }));

      onUpdateInventoryPrices(sampleUpdates);

      // Create new execution log
      const newLog: CsvCronExecutionLog = {
        id: `log-cron-${Date.now()}`,
        taskId: task.id,
        taskName: task.name,
        timestamp: `Hoy ${nowStr} hs`,
        status: 'success',
        durationMs: duration + 180,
        rowsProcessed: count,
        rowsUpdated: count,
        errorsCount: 0,
        summary: `Cron ejecutado exitosamente vía ${task.sourceType.toUpperCase()}. Se procesaron ${count} filas de archivo CSV (${task.delimiter === ',' ? 'coma' : 'punto y coma'}). Catálogo y Stock actualizados.`,
        csvSnippet: `SKU${task.delimiter}PRECIO_LISTA${task.delimiter}STOCK_ROCA${task.delimiter}STOCK_NQN\n${inventory[0]?.sku || 'KOA-POL-101'}${task.delimiter}${inventory[0]?.price || 34500}${task.delimiter}120${task.delimiter}85\n${inventory[1]?.sku || 'KOA-POL-102'}${task.delimiter}${inventory[1]?.price || 12800}${task.delimiter}200${task.delimiter}150`,
      };

      onAddLog(newLog);

      // Update task stats
      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              lastRunTime: `Hoy, ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`,
              lastStatus: 'success' as const,
              lastProcessedCount: count,
            }
          : t
      );
      onUpdateTasks(updatedTasks);
      setRunningTaskId(null);
      showNotification(`¡Tarea Cron "${task.name}" ejecutada con éxito! (${count} artículos sincronizados)`);
    }, 1200);
  };

  // Open modal to create or edit task
  const handleOpenEditTask = (task?: CsvCronTask) => {
    if (task) {
      setEditingTask(task);
      setTaskName(task.name);
      setTaskCronExp(task.cronExpression);
      setTaskHumanSchedule(task.humanSchedule);
      setTaskType(task.type);
      setTaskSourceType(task.sourceType);
      setTaskSourceUrl(task.sourceUrl);
      setTaskDelimiter(task.delimiter);
      setTaskEncoding(task.encoding);
    } else {
      setEditingTask(null);
      setTaskName('');
      setTaskCronExp('0 */2 * * *');
      setTaskHumanSchedule('Cada 2 horas en punto');
      setTaskType('import_prices_stock');
      setTaskSourceType('http_url');
      setTaskSourceUrl('https://erp.koalalotiene.com.ar/cron/export_precios.csv');
      setTaskDelimiter(',');
      setTaskEncoding('UTF-8');
    }
    setShowTaskModal(true);
  };

  // Save Cron task
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              name: taskName.trim(),
              cronExpression: taskCronExp.trim(),
              humanSchedule: taskHumanSchedule.trim(),
              type: taskType,
              sourceType: taskSourceType,
              sourceUrl: taskSourceUrl.trim(),
              delimiter: taskDelimiter,
              encoding: taskEncoding,
            }
          : t
      );
      onUpdateTasks(updated);
      showNotification(`Tarea ${editingTask.id} actualizada correctamente.`);
    } else {
      const newTask: CsvCronTask = {
        id: `CRON-0${tasks.length + 1}`,
        name: taskName.trim(),
        cronExpression: taskCronExp.trim(),
        humanSchedule: taskHumanSchedule.trim(),
        type: taskType,
        sourceType: taskSourceType,
        sourceUrl: taskSourceUrl.trim(),
        delimiter: taskDelimiter,
        encoding: taskEncoding,
        active: true,
        lastRunTime: 'Aún no ejecutada',
        lastStatus: 'idle',
        lastProcessedCount: 0,
        nextRunEstimate: 'Próxima ejecución según cron',
      };
      onUpdateTasks([...tasks, newTask]);
      showNotification(`Nueva Tarea Cron ${newTask.id} agregada al programador.`);
    }
    setShowTaskModal(false);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    if (confirm(`¿Está seguro de eliminar la tarea ${taskId}?`)) {
      onUpdateTasks(tasks.filter((t) => t.id !== taskId));
      showNotification(`Tarea ${taskId} eliminada.`);
    }
  };

  // Parse Raw CSV text in tester
  const handleParseCsv = () => {
    if (!rawCsvInput.trim()) return;

    const lines = rawCsvInput.trim().split('\n');
    if (lines.length < 2) return;

    const header = lines[0].split(parserDelimiter).map((h) => h.trim().replace(/^"|"$/g, '').toUpperCase());
    const skuIndex = header.findIndex((h) => h.includes('SKU') || h.includes('CODIGO') || h.includes('ARTICULO'));
    const nameIndex = header.findIndex((h) => h.includes('NOMBRE') || h.includes('DESCRIP') || h.includes('DETALLE'));
    const priceIndex = header.findIndex((h) => h.includes('PRECIO_LISTA') || h.includes('PRECIO_MIN') || h.includes('PRECIO'));
    const wholesaleIndex = header.findIndex((h) => h.includes('MAYORISTA') || h.includes('BULTO') || h.includes('PRECIO_MAY'));
    const stockRocaIndex = header.findIndex((h) => h.includes('ROCA') || h.includes('STOCK_1'));
    const stockNqnIndex = header.findIndex((h) => h.includes('NEUQUEN') || h.includes('NQN') || h.includes('STOCK_2'));

    const rows: any[] = [];
    let validSkus = 0;
    let matchedInventory = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(parserDelimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      const sku = skuIndex >= 0 ? cols[skuIndex] : `ITEM-${i}`;
      const name = nameIndex >= 0 ? cols[nameIndex] : 'Artículo Importado';
      const price = priceIndex >= 0 ? parseFloat(cols[priceIndex]) || 0 : 0;
      const wholesalePrice = wholesaleIndex >= 0 ? parseFloat(cols[wholesaleIndex]) || undefined : undefined;
      const stockRoca = stockRocaIndex >= 0 ? parseInt(cols[stockRocaIndex], 10) || 0 : 0;
      const stockNeuquen = stockNqnIndex >= 0 ? parseInt(cols[stockNqnIndex], 10) || 0 : 0;

      if (sku) validSkus++;
      const existsInInv = inventory.some((item) => item.sku.toLowerCase() === sku.toLowerCase() || item.id === sku);
      if (existsInInv) matchedInventory++;

      rows.push({
        sku,
        name,
        price,
        wholesalePrice,
        stockRoca,
        stockNeuquen,
        matched: existsInInv,
      });
    }

    setParsedRows(rows);
    setParserStats({
      total: rows.length,
      validSkus,
      matchedInventory,
    });
    showNotification(`¡CSV parseado correctamente! ${rows.length} registros analizados.`);
  };

  // Apply parsed CSV to Inventory
  const handleApplyParsedToInventory = () => {
    if (parsedRows.length === 0) return;

    const updates = parsedRows.map((r) => ({
      sku: r.sku,
      price: r.price > 0 ? r.price : undefined,
      wholesalePrice: r.wholesalePrice && r.wholesalePrice > 0 ? r.wholesalePrice : undefined,
      stockRoca: r.stockRoca,
      stockNeuquen: r.stockNeuquen,
    }));

    onUpdateInventoryPrices(updates);

    const newLog: CsvCronExecutionLog = {
      id: `log-manual-csv-${Date.now()}`,
      taskId: 'MANUAL-IMPORT',
      taskName: 'Importación Manual Interactiva de Archivo CSV',
      timestamp: 'Hoy, ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      status: 'success',
      durationMs: 240,
      rowsProcessed: parsedRows.length,
      rowsUpdated: parsedRows.length,
      errorsCount: 0,
      summary: `Se importaron manualmente ${parsedRows.length} artículos del CSV. Precios y Stock actualizados.`,
    };
    onAddLog(newLog);

    showNotification(`¡${parsedRows.length} artículos del CSV fueron aplicados exitosamente al inventario de Koala!`);
  };

  // Download sample CSV template
  const handleDownloadSample = (templateType: 'tango' | 'excel' | 'flexxus') => {
    let content = '';
    let filename = '';

    if (templateType === 'tango') {
      content = 'COD_ARTICULO;DESCRIPCION;PRECIO_1;PRECIO_2;STOCK_DEPOSITO_1;STOCK_DEPOSITO_2;ALICUOTA_IVA\n' +
        'KOA-POL-101;Film Stretch Cristal 50cm;34500.00;28900.00;120;85;21.00\n' +
        'KOA-POL-102;Bolsas Camiseta Reforzadas 40x50;12800.00;10500.00;200;150;21.00\n' +
        'KOA-PAP-103;Resma Fotocopia A4 75g Autor;42000.00;36000.00;80;65;21.00';
      filename = 'plantilla_tango_gestion_precios_stock.csv';
    } else if (templateType === 'excel') {
      content = 'SKU,NOMBRE,PRECIO_LISTA,PRECIO_MAYORISTA,STOCK_ROCA,STOCK_NEUQUEN\n' +
        'KOA-POL-101,Film Stretch Cristal 50cm,34500,28900,120,85\n' +
        'KOA-POL-102,Bolsas Camiseta 40x50,12800,10500,200,150\n' +
        'KOA-CAR-104,Cajas Carton 40x30x30,1850,1490,300,210';
      filename = 'plantilla_excel_standard_koala.csv';
    } else {
      content = 'ID_PRODUCTO|RUBRO|DETALLE|PRECIO_VENTA|PRECIO_MAYOR|CANT_ROCA|CANT_NQN\n' +
        'KOA-POL-101|Polietileno|Film Stretch 50cm|34500|28900|120|85\n' +
        'KOA-PAP-103|Papeleria|Resma A4 Autor|42000|36000|80|65';
      filename = 'plantilla_flexxus_bejerman.csv';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    showNotification(`Plantilla CSV descargada (${filename}).`);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Cron Daemon Status & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-fredoka text-white">
                  Motor de Automatización & CSV Cron Tasks
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Daemon Activo (Tick 60s)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ejecución periódica programada de importación/exportación de archivos CSV con ERP, SFTP y Webhooks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenEditTask()}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Tarea Cron</span>
            </button>

            <button
              onClick={() => {
                const activeTasks = tasks.filter((t) => t.active);
                if (activeTasks.length === 0) {
                  showNotification('No hay tareas activas para ejecutar.');
                  return;
                }
                activeTasks.forEach((t) => handleRunTask(t));
                showNotification(`Ejecutando lote de ${activeTasks.length} tareas programadas...`);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Ejecutar Todas Ahora</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Tareas Programadas</span>
            <strong className="text-sm font-bold text-white">
              {tasks.filter((t) => t.active).length} activas <span className="text-slate-500 font-normal">/ {tasks.length}</span>
            </strong>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Frecuencia Principal</span>
            <strong className="text-sm font-bold text-orange-400">Cada 2 horas</strong>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Última Ejecución</span>
            <strong className="text-sm font-bold text-emerald-400">{tasks[0]?.lastRunTime || 'Hoy 16:00 hs'}</strong>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold block">Registros Procesados Hoy</span>
            <strong className="text-sm font-bold text-white">
              {tasks.reduce((acc, t) => acc + (t.lastProcessedCount || 0), 0)} items
            </strong>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-2xs">
        <button
          onClick={() => setSubView('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subView === 'tasks'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Tareas Cron Programadas ({tasks.length})</span>
        </button>

        <button
          onClick={() => setSubView('tester_parser')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subView === 'tester_parser'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Probador & Parser CSV Interactivo</span>
        </button>

        <button
          onClick={() => setSubView('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subView === 'logs'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Historial de Ejecuciones ({logs.length})</span>
        </button>

        <button
          onClick={() => setSubView('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto ${
            subView === 'templates'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Plantillas ERP</span>
        </button>
      </div>

      {/* Toast message */}
      {toastMessage && (
        <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-emerald-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SUB-VIEW 1: CRON TASKS LIST */}
      {subView === 'tasks' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border p-4 transition-all shadow-xs flex flex-col justify-between ${
                  task.active
                    ? 'border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500'
                    : 'border-slate-200/50 dark:border-slate-800 opacity-70 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 font-mono font-bold text-[11px]">
                        {task.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          task.active
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {task.active ? 'Activa' : 'En Pausa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleTaskActive(task.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                          task.active
                            ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                            : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={task.active ? 'Pausar tarea' : 'Activar tarea'}
                      >
                        {task.active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleOpenEditTask(task)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="Editar tarea"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {task.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span>{task.humanSchedule}</span>
                    </p>
                  </div>

                  {/* Cron Expression & Source */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Expresión Cron:</span>
                      <code className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] font-bold">
                        {task.cronExpression}
                      </code>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Origen / Protocolo:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Server className="w-3 h-3 text-blue-500" />
                        {task.sourceType.toUpperCase()} ({task.delimiter === ',' ? 'Comas' : task.delimiter === ';' ? 'Punto y Coma' : 'Tabs'})
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      {task.sourceUrl}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    <div>Última: <strong className="text-slate-800 dark:text-slate-200">{task.lastRunTime}</strong></div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ {task.lastProcessedCount} items sincronizados
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunTask(task)}
                    disabled={runningTaskId === task.id}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${runningTaskId === task.id ? 'animate-spin' : ''}`} />
                    <span>{runningTaskId === task.id ? 'Ejecutando...' : 'Ejecutar Cron'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: TESTER & PARSER CSV */}
      {subView === 'tester_parser' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <span>Probador & Analizador de Archivos CSV (Live Parser)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pegue el contenido CSV del ERP o cargue un archivo para validar columnas, precios y existencias
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={parserDelimiter}
                  onChange={(e) => setParserDelimiter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value=",">Separador: Coma (,)</option>
                  <option value=";">Separador: Punto y Coma (;)</option>
                  <option value="&#9;">Separador: Tabulación (\t)</option>
                  <option value="|">Separador: Pipe (|)</option>
                </select>

                <button
                  onClick={handleParseCsv}
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Parsear & Validar</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 dark:text-slate-300 font-bold">
                Datos CSV de entrada (Encabezados reconocidos: SKU, NOMBRE, PRECIO_LISTA, PRECIO_MAYORISTA, STOCK_ROCA, STOCK_NEUQUEN):
              </label>
              <textarea
                rows={6}
                value={rawCsvInput}
                onChange={(e) => setRawCsvInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Parsed Results Grid */}
            {parserStats && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50 dark:bg-purple-950/60 p-3 rounded-xl border border-purple-200 dark:border-purple-800 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] block">Total Filas</span>
                      <strong className="text-purple-700 dark:text-purple-300 font-bold text-sm">{parserStats.total}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] block">SKUs Válidos</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{parserStats.validSkus}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] block">Coincidencias en Catálogo</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold text-sm">{parserStats.matchedInventory}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyParsedToInventory}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aplicar {parsedRows.length} Artículos al Inventario</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-64">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] sticky top-0">
                      <tr>
                        <th className="p-2.5">SKU / Código</th>
                        <th className="p-2.5">Descripción / Producto</th>
                        <th className="p-2.5 text-right">Precio Minorista</th>
                        <th className="p-2.5 text-right">Precio Mayorista</th>
                        <th className="p-2.5 text-center">Stock Roca</th>
                        <th className="p-2.5 text-center">Stock Nqn</th>
                        <th className="p-2.5 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedRows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">{r.sku}</td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300 font-semibold">{r.name}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white font-mono">
                            {formatCurrency(r.price)}
                          </td>
                          <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {r.wholesalePrice ? formatCurrency(r.wholesalePrice) : '-'}
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                            {r.stockRoca}
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                            {r.stockNeuquen}
                          </td>
                          <td className="p-2.5 text-center">
                            {r.matched ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]">
                                Vinculado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[9px]">
                                Nuevo SKU
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: EXECUTION LOGS */}
      {subView === 'logs' && (
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Auditoría de Ejecuciones Cron & Tareas de Fondo</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Últimos {logs.length} eventos registrados
              </span>
            </div>

            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          log.status === 'success'
                            ? 'bg-emerald-500'
                            : log.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <strong className="text-slate-900 dark:text-white font-bold">{log.taskName}</strong>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {log.taskId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                      <span>⏱️ {log.durationMs} ms</span>
                      <span>📊 {log.rowsProcessed} filas</span>
                      <span className="text-slate-400">{log.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 font-normal">{log.summary}</p>

                  {log.csvSnippet && (
                    <pre className="p-2.5 rounded-lg bg-slate-950 text-emerald-400 font-mono text-[10px] overflow-x-auto border border-slate-800">
                      {log.csvSnippet}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: TEMPLATES & DOWNLOADS */}
      {subView === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold text-xs">
                T
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tango Gestión ERP</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formato plano con separador de punto y coma (;), codificación Windows-1252 y columnas oficiales de lista de precios y stock.
              </p>
            </div>
            <button
              onClick={() => handleDownloadSample('tango')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Plantilla Tango</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                X
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Excel & Google Sheets</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formato estándar CSV delimitado por comas (,) en UTF-8 para edición en hojas de cálculo masivas.
              </p>
            </div>
            <button
              onClick={() => handleDownloadSample('excel')}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Plantilla Excel</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                B
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bejerman / Flexxus</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Layout delimitado por pipes (|) para importación en lote de maestros de artículos y listas de precios bulto cerrado.
              </p>
            </div>
            <button
              onClick={() => handleDownloadSample('flexxus')}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Plantilla Bejerman</span>
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CRON TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-xl w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-fredoka text-slate-900 dark:text-white">
                  {editingTask ? `Editar Tarea Cron ${editingTask.id}` : 'Programar Nueva Tarea CSV Cron'}
                </h3>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Nombre descriptivo de la tarea
                </label>
                <input
                  type="text"
                  required
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Ej: Sincronización Lista de Precios Tango ERP (Cada 2 hs)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                />
              </div>

              {/* Cron Expression & Presets */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Frecuencia de Ejecución (Sintaxis Cron Estándar)
                </label>
                
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {cronPresets.map((p) => (
                    <button
                      key={p.exp}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        taskCronExp === p.exp
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      required
                      value={taskCronExp}
                      onChange={(e) => setTaskCronExp(e.target.value)}
                      placeholder="0 */2 * * *"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={taskHumanSchedule}
                      onChange={(e) => setTaskHumanSchedule(e.target.value)}
                      placeholder="Explicación legible"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Protocol / Source Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tipo de Operación
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="import_prices_stock">Importar Precios y Stock (ERP a Web)</option>
                    <option value="export_sales_quotes">Exportar Cotizaciones & Facturas (Web a ERP)</option>
                    <option value="sync_inventory_levels">Sincronizar Niveles de Depósito</option>
                    <option value="backup_catalog">Backup CSV de Seguridad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Protocolo / Origen de Datos
                  </label>
                  <select
                    value={taskSourceType}
                    onChange={(e) => setTaskSourceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="http_url">HTTP / HTTPS GET Endpoint</option>
                    <option value="sftp_ftp">SFTP / FTP Servidor Seguro</option>
                    <option value="webhook_pull">Webhook Pull / API Gateway</option>
                    <option value="local_folder">Carpeta Compartida de Red (SMB)</option>
                  </select>
                </div>
              </div>

              {/* Source URL */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  URL / Ruta de Archivo CSV
                </label>
                <input
                  type="text"
                  required
                  value={taskSourceUrl}
                  onChange={(e) => setTaskSourceUrl(e.target.value)}
                  placeholder="https://erp.koalalotiene.com.ar/cron/precios.csv"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Delimiter & Encoding */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Delimitador CSV
                  </label>
                  <select
                    value={taskDelimiter}
                    onChange={(e) => setTaskDelimiter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  >
                    <option value=",">Coma (,)</option>
                    <option value=";">Punto y Coma (; - Tango ERP)</option>
                    <option value="&#9;">Tabulación (\t)</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Codificación de Caracteres
                  </label>
                  <select
                    value={taskEncoding}
                    onChange={(e) => setTaskEncoding(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="UTF-8">UTF-8 (Estándar Web)</option>
                    <option value="Windows-1252">Windows-1252 (ANSI Tango/Bejerman)</option>
                    <option value="ISO-8859-1 (Latin1)">ISO-8859-1 (Latin1)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingTask ? 'Guardar Cambios' : 'Crear Tarea Cron'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
