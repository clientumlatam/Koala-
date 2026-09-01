import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';

export const OfflineStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnectedAlert, setShowReconnectedAlert] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedAlert(true);
      setIsDismissed(false);

      const timer = setTimeout(() => {
        setShowReconnectedAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // When back online and showing reconnected alert
  if (isOnline && showReconnectedAlert) {
    return (
      <aside aria-label="Notificaciones de conexión" className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 shadow-md flex items-center justify-between transition-all duration-300 sticky top-0 z-50">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-200 animate-pulse shrink-0" />
            <span>
              <strong>¡Conexión reestablecida!</strong> Se sincronizaron los últimos datos de precios y stock.
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
      <aside aria-label="Notificaciones de conexión" className="bg-amber-600 dark:bg-amber-700 text-white text-xs font-medium px-4 py-2.5 shadow-lg border-b border-amber-500/50 sticky top-0 z-50 animate-in slide-in-from-top-2 duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/40 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 text-amber-100" />
            </div>
            <div>
              <span className="font-bold text-white">Modo Fuera de Línea Activado (Service Worker): </span>
              <span className="text-amber-100">
                Podés seguir navegando el catálogo de productos, sucursales y armando presupuestos con datos en caché.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-amber-700/60 px-2 py-1 rounded-lg text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Caché Local Listo</span>
            </div>

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
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
