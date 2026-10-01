import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle, RefreshCw, X, ShieldCheck, FileCheck, Zap } from 'lucide-react';
import { getOfflinePendingQuotes, syncPendingOfflineQuotes } from '../utils/offlineSync';

export const OfflineStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnectedAlert, setShowReconnectedAlert] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [syncedCount, setSyncedCount] = useState<number>(0);
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(() => {
    return getOfflinePendingQuotes().filter(q => !q.synced).length;
  });

  const triggerSync = async () => {
    const result = await syncPendingOfflineQuotes();
    if (result.syncedCount > 0) {
      setSyncedCount(result.syncedCount);
      setPendingOfflineCount(0);
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setShowReconnectedAlert(true);
      setIsDismissed(false);

      // Trigger automatic background sync of unsynced offline quotes
      await triggerSync();

      const timer = setTimeout(() => {
        setShowReconnectedAlert(false);
      }, 6000);

      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
      setPendingOfflineCount(getOfflinePendingQuotes().filter(q => !q.synced).length);
    };

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_OFFLINE_QUOTES') {
        triggerSync();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  // When back online and showing reconnected alert
  if (isOnline && showReconnectedAlert) {
    return (
      <aside aria-label="Notificaciones de conexión" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-semibold px-4 py-2.5 shadow-md flex items-center justify-between transition-all duration-300 sticky top-0 z-50">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between flex-wrap">
          <div className="flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-emerald-200 animate-pulse shrink-0" />
            <span>
              <strong>¡Conexión restablecida!</strong>
              {syncedCount > 0 ? (
                <span className="ml-1 text-emerald-100 bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  ✓ {syncedCount} presupuesto{syncedCount > 1 ? 's' : ''} creado{syncedCount > 1 ? 's' : ''} offline {syncedCount > 1 ? 'fueron sincronizados' : 'fue sincronizado'} con éxito
                </span>
              ) : (
                <span className="ml-1">Se verificaron precios y stock en tiempo real con el ERP.</span>
              )}
            </span>
          </div>

          <button
            onClick={() => setShowReconnectedAlert(false)}
            className="p-1 rounded hover:bg-emerald-700/60 text-emerald-100 transition-colors cursor-pointer"
            aria-label="Cerrar aviso de conexión"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  // When offline and not dismissed
  if (!isOnline && !isDismissed) {
    return (
      <aside aria-label="Notificaciones de conexión" className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-medium px-4 py-2.5 shadow-lg border-b border-amber-500/50 sticky top-0 z-50 animate-in slide-in-from-top-2 duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-amber-500/40 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 text-amber-100" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white">Modo Fuera de Línea Activado (Service Worker): </span>
              <span className="text-amber-100">
                Podés crear presupuestos completos sin conexión. Se guardarán localmente y se sincronizarán al recuperar señal.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pendingOfflineCount > 0 ? (
              <span className="flex items-center gap-1 text-[11px] bg-amber-900/80 px-2.5 py-1 rounded-lg text-amber-200 font-bold border border-amber-400/40 animate-pulse">
                <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{pendingOfflineCount} guardado{pendingOfflineCount > 1 ? 's' : ''} offline</span>
              </span>
            ) : (
              <div className="hidden sm:flex items-center gap-1 text-[11px] bg-amber-800/60 px-2 py-1 rounded-lg text-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Caché Local Listo</span>
              </div>
            )}

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Intentar reconectar"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reintentar</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Ocultar aviso de conexión"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
