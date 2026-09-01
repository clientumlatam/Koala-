import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Users,
  Database
} from 'lucide-react';
import { EmployeeUser, EmployeeRole } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeUser[];
  onLoginSuccess: (user: EmployeeUser) => void;
  isStandalonePage?: boolean;
  onNavigateToStore?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  employees,
  onLoginSuccess,
  isStandalonePage = false,
  onNavigateToStore,
}) => {
  const [email, setEmail] = useState('gonzalo@koalalotiene.com.ar');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const roleMeta: Record<EmployeeRole, { title: string; color: string; badge: string }> = {
    admin: { title: 'Super Admin / Gerencia', color: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800', badge: '👑 Gerencia' },
    ventas: { title: 'Ejecutivo de Ventas', color: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-800', badge: '💼 Ventas' },
    deposito: { title: 'Logística y Depósito', color: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800', badge: '📦 Depósito' },
    facturacion: { title: 'Administración y ERP', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800', badge: '🧾 Facturación' },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const user = employees.find(
        (emp) => emp.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        setErrorMessage('No se encontró ningún usuario con ese correo electrónico.');
        setIsLoading(false);
        return;
      }

      if (!user.active) {
        setErrorMessage('Esta cuenta de empleado ha sido deshabilitada por la gerencia.');
        setIsLoading(false);
        return;
      }

      // Password check
      const expectedPassword = user.password || 'admin';
      if (password !== expectedPassword) {
        setErrorMessage('Contraseña incorrecta. Por favor, verifíquela.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLoginSuccess(user);
    }, 450);
  };

  const handleQuickSelect = (emp: EmployeeUser) => {
    setEmail(emp.email);
    setPassword(emp.password || 'admin');
    setErrorMessage(null);
  };

  const containerClasses = isStandalonePage
    ? 'min-h-screen bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 py-12'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto';

  return (
    <div className={containerClasses} id="admin-login-container">
      {isStandalonePage && onNavigateToStore && (
        <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
          <button
            onClick={onNavigateToStore}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 border border-slate-800 hover:border-orange-500 shadow-sm"
          >
            <span>← Volver a la Tienda Pública</span>
          </button>
          <div className="text-xs text-slate-400 font-mono">
            Ruta directa: <strong className="text-orange-400">/admin</strong>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black font-fredoka text-white">
                  Acceso de Personal & ERP
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                  Koala Lo Tiene
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold">
                  /admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Portal interno para sucursales General Roca y Neuquén Capital
              </p>
            </div>
          </div>

          {!isStandalonePage && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Quick Access Account Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                <span>Cuentas de Acceso Rápido por Rol:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Click para autocompletar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {employees.map((emp) => {
                const isSelected = email.toLowerCase() === emp.email.toLowerCase();
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleQuickSelect(emp)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-500 ring-2 ring-orange-500/30 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {emp.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${roleMeta[emp.role].color}`}>
                        {roleMeta[emp.role].badge}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span className="uppercase font-mono font-semibold">📍 {emp.branchId}</span>
                      <span className="text-orange-600 dark:text-orange-400 font-bold">Usar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico Corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@koalalotiene.com.ar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contraseña / Clave de Acceso
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Autenticación sincronizada con Tango ERP Server</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verificando credenciales...</span>
                ) : (
                  <>
                    <span>Ingresar al Panel de Control</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
