import re

with open('src/components/AdminPanelModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add grouped tabs replacement string
new_tabs = """
        {/* Split Layout Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 lg:w-72 shrink-0 bg-slate-50/80 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden md:block select-none">
            <div className="p-4 space-y-6">
              {/* Group 1: Demo & System */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">Sistema & Demo</h3>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab('enterprise_demo')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                      activeTab === 'enterprise_demo'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                        : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${activeTab === 'enterprise_demo' ? 'text-amber-200' : ''}`} />
                      <span className="truncate">DEMO EN VIVO</span>
                    </div>
                  </button>
                  {canAccess('sync_health') && (
                    <button
                      onClick={() => setActiveTab('sync_health')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                        activeTab === 'sync_health'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Activity className={`w-4 h-4 ${activeTab === 'sync_health' ? 'text-emerald-500' : 'text-emerald-500/70'}`} />
                        <span className="truncate">Salud & Sync ERP</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </button>
                  )}
                  {canAccess('mcp_protocol') && (
                    <button
                      onClick={() => setActiveTab('mcp_protocol')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                        activeTab === 'mcp_protocol'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className={`w-4 h-4 ${activeTab === 'mcp_protocol' ? 'text-indigo-500' : 'text-indigo-500/70'}`} />
                        <span className="truncate">MCP Protocol Server</span>
                      </div>
                      <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono font-black">v1.0</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Group 2: Operations */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">Operaciones ERP</h3>
                <div className="space-y-0.5">
                  {canAccess('dashboard') && (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'dashboard'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      <span className="truncate">Dashboard Analytics</span>
                    </button>
                  )}
                  {canAccess('inventory') && (
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'inventory'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <PackageCheck className="w-4 h-4 mr-2" />
                      <span className="truncate">Control de Inventario</span>
                    </button>
                  )}
                  {canAccess('transfers') && (
                    <button
                      onClick={() => setActiveTab('transfers')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                        activeTab === 'transfers'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4" />
                        <span className="truncate">Traspasos</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-black">{transfers.length}</span>
                    </button>
                  )}
                  {canAccess('prices_import') && (
                    <button
                      onClick={() => setActiveTab('prices_import')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'prices_import'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Percent className="w-4 h-4 mr-2" />
                      <span className="truncate">Ajustes & Precios</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Group 3: Ventas & Facturación */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">Ventas & Docs</h3>
                <div className="space-y-0.5">
                  {canAccess('quotes') && (
                    <button
                      onClick={() => setActiveTab('quotes')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                        activeTab === 'quotes'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">Cotizaciones</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-black">{quotes.length}</span>
                    </button>
                  )}
                  {canAccess('invoices') && (
                    <button
                      onClick={() => setActiveTab('invoices')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                        activeTab === 'invoices'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        <span className="truncate">Facturación AFIP</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-black">{invoices.length}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Group 4: Advanced */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">Sistema & Admin</h3>
                <div className="space-y-0.5">
                  {canAccess('staff') && (
                    <button
                      onClick={() => setActiveTab('staff')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'staff'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span className="truncate">Gestión de Personal</span>
                    </button>
                  )}
                  {canAccess('erp_config') && (
                    <button
                      onClick={() => setActiveTab('erp_config')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'erp_config'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      <span className="truncate">Configuración ERP</span>
                    </button>
                  )}
                  {canAccess('csv_cron') && (
                    <button
                      onClick={() => setActiveTab('csv_cron')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'csv_cron'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="truncate">Automatización Cron</span>
                    </button>
                  )}
                  {canAccess('api_tester') && (
                    <button
                      onClick={() => setActiveTab('api_tester')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'api_tester'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Terminal className="w-4 h-4 mr-2" />
                      <span className="truncate">Tester API REST</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Group 5: Marketing & Social */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">Marketing</h3>
                <div className="space-y-0.5">
                  {canAccess('social_commerce') && (
                    <button
                      onClick={() => setActiveTab('social_commerce')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                        activeTab === 'social_commerce'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Instagram className={`w-4 h-4 ${activeTab === 'social_commerce' ? 'text-purple-500' : 'text-purple-500/70'}`} />
                        <span className="truncate">Social Commerce</span>
                      </div>
                    </button>
                  )}
                  {canAccess('docs') && (
                    <button
                      onClick={() => setActiveTab('docs')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all ${
                        activeTab === 'docs'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <BookOpen className={`w-4 h-4 mr-2 ${activeTab === 'docs' ? 'text-blue-500' : 'text-blue-500/70'}`} />
                      <span className="truncate">Documentación</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950/40 flex flex-col relative">
          
          {/* Mobile Select - Only visible on small screens */}
          <div className="md:hidden sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none shadow-xs"
            >
              <optgroup label="Sistema & Demo">
                <option value="enterprise_demo">🚀 DEMO EN VIVO</option>
                {canAccess('sync_health') && <option value="sync_health">Salud & Sync ERP</option>}
                {canAccess('mcp_protocol') && <option value="mcp_protocol">MCP Protocol Server</option>}
              </optgroup>
              <optgroup label="Operaciones ERP">
                {canAccess('dashboard') && <option value="dashboard">Dashboard Analytics</option>}
                {canAccess('inventory') && <option value="inventory">Control de Inventario</option>}
                {canAccess('transfers') && <option value="transfers">Traspasos entre Sucursales</option>}
                {canAccess('prices_import') && <option value="prices_import">Ajustes & Precios</option>}
              </optgroup>
              <optgroup label="Ventas & Docs">
                {canAccess('quotes') && <option value="quotes">Cotizaciones</option>}
                {canAccess('invoices') && <option value="invoices">Facturación AFIP</option>}
              </optgroup>
              <optgroup label="Sistema & Admin">
                {canAccess('staff') && <option value="staff">Gestión de Personal</option>}
                {canAccess('erp_config') && <option value="erp_config">Configuración ERP</option>}
                {canAccess('csv_cron') && <option value="csv_cron">Automatización Cron</option>}
                {canAccess('api_tester') && <option value="api_tester">Tester API REST</option>}
              </optgroup>
              <optgroup label="Marketing">
                {canAccess('social_commerce') && <option value="social_commerce">Social Commerce (IG)</option>}
                {canAccess('docs') && <option value="docs">Documentación</option>}
              </optgroup>
            </select>
          </div>
          
          <div className="flex-1 p-4 sm:p-6">
"""

start_pattern = r'\{\/\* Main Tabs Navigation \*\/\}.*?<div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900\/60">.*?<\/button>\s*<\/div>'
end_pattern = r'\{\/\* Tab Content Body \*\/\}\s*<div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50\/60 dark:bg-slate-950\/40">'

# Find start
match_start = re.search(start_pattern, code, re.DOTALL)
match_end = re.search(end_pattern, code, re.DOTALL)

if match_start and match_end:
    new_code = code[:match_start.start()] + new_tabs + code[match_end.end():]
    
    # Finally we need to close the outer div for the split layout.
    # The whole modal is wrapped in a main div. 
    # We replaced the Tab content div but left it open (it will be closed by the original closing tag of the Tab Content Body)
    # BUT we added an extra outer `<div className="flex flex-1 overflow-hidden">` that needs closing.
    
    # We find the end of the modal return statement:
    # </div>
    # </div>
    # </div>
    # </Dialog.Panel>
    # The last div is the outermost flex-col container.
    # So we can just replace the last closing </div> before </Dialog.Panel> or just find the end of the file.
    
    # Actually, we can just insert `</div>` before the end of the main container.
    # Let's replace the last `</div>` before `</Dialog.Panel>` with `</div></div>`
    new_code = re.sub(r'<\/div>\s*<\/Dialog\.Panel>', '</div>\n        </div>\n      </Dialog.Panel>', new_code)
    
    with open('src/components/AdminPanelModal.tsx', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print("Successfully replaced layout.")
else:
    print("Could not find the exact bounds.")
    if not match_start: print("match_start failed")
    if not match_end: print("match_end failed")
