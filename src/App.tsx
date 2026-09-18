import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { PresupuestadorModal } from './components/PresupuestadorModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { StoreLocationsSection } from './components/StoreLocationsSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { LoyaltyProgramModal } from './components/LoyaltyProgramModal';
import { DocumentationViewer } from './components/DocumentationViewer';
import { KoalaLogo } from './components/KoalaLogo';
import { MobileCartBar } from './components/MobileCartBar';
import { CartToast, CartToastItem } from './components/CartToast';

import { STORES_DATA, CATEGORIES, PRODUCTS_CATALOG } from './data/products';
import { DEFAULT_DEMO_LOYALTY_PROFILE } from './data/loyaltyData';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_ERP_STATUS, 
  INITIAL_INVENTORY, 
  INITIAL_QUOTES,
  INITIAL_ERP_CONFIG,
  INITIAL_INVOICES,
  INITIAL_TRANSFERS,
  INITIAL_CSV_CRON_TASKS,
  INITIAL_CSV_CRON_LOGS
} from './data/adminData';
import { 
  BranchId, 
  CategoryId, 
  CartItem, 
  Product, 
  EmployeeUser, 
  ErpSyncStatus, 
  QuoteRecord, 
  ProductInventoryRecord,
  ErpConnectionConfig,
  ErpInvoice,
  StockTransferOrder,
  CsvCronTask,
  CsvCronExecutionLog,
  LoyaltyProfile,
  LoyaltyReward,
  LoyaltyPointTransaction
} from './types';

export default function App() {
  // Client-side URL Routing State ('/' vs '/admin')
  const [currentPath, setCurrentPath] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/docs' ||
        path === '/dossier' ||
        path === '/propuesta' ||
        hash === '#docs' ||
        hash === '#dossier' ||
        hash === '#propuesta'
      ) {
        return '/docs';
      }
      if (
        path === '/admin' || 
        path === '/erp' || 
        path === '/panel' || 
        hash === '#admin' || 
        hash === '#erp' || 
        hash === '#panel'
      ) {
        return '/admin';
      }
    }
    return '/';
  });

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
  };

  React.useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/docs' ||
        path === '/dossier' ||
        path === '/propuesta' ||
        hash === '#docs' ||
        hash === '#dossier' ||
        hash === '#propuesta'
      ) {
        setCurrentPath('/docs');
      } else if (
        path === '/admin' || 
        path === '/erp' || 
        path === '/panel' || 
        hash === '#admin' || 
        hash === '#erp' || 
        hash === '#panel'
      ) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Active Branch State (Default: General Roca)
  const [currentBranchId, setCurrentBranchId] = React.useState<BranchId>(() => {
    const saved = localStorage.getItem('koala_active_branch');
    return (saved === 'neuquen' ? 'neuquen' : 'roca') as BranchId;
  });

  const currentBranch = React.useMemo(() => {
    return STORES_DATA.find((b) => b.id === currentBranchId) || STORES_DATA[0];
  }, [currentBranchId]);

  const handleSelectBranch = (branchId: BranchId) => {
    setCurrentBranchId(branchId);
    localStorage.setItem('koala_active_branch', branchId);
  };

  // Active Category State
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryId>('all');

  // Cart / Presupuestador State
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('koala_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('koala_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Customer Loyalty Program State
  const [loyaltyProfile, setLoyaltyProfile] = React.useState<LoyaltyProfile>(() => {
    try {
      const saved = localStorage.getItem('koala_loyalty_profile');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_LOYALTY_PROFILE;
    } catch {
      return DEFAULT_DEMO_LOYALTY_PROFILE;
    }
  });

  React.useEffect(() => {
    localStorage.setItem('koala_loyalty_profile', JSON.stringify(loyaltyProfile));
  }, [loyaltyProfile]);

  const [appliedReward, setAppliedReward] = React.useState<LoyaltyReward | null>(null);

  // Modals state
  const [cartOpen, setCartOpen] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loyaltyOpen, setLoyaltyOpen] = React.useState(false);
  const [cartToast, setCartToast] = React.useState<CartToastItem | null>(null);

  // Auto dismiss toast after 3.5 seconds
  React.useEffect(() => {
    if (!cartToast) return;
    const timer = setTimeout(() => {
      setCartToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [cartToast]);

  // Cart Total calculation for mobile bar
  const cartTotal = React.useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.isWholesale && item.product.wholesalePrice 
        ? item.product.wholesalePrice 
        : item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  // Authenticated Employee State
  const [currentUser, setCurrentUser] = React.useState<EmployeeUser | null>(() => {
    try {
      const saved = localStorage.getItem('koala_employee_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('koala_employee_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('koala_employee_user');
    }
  }, [currentUser]);

  // Admin ERP & Employee Roles State
  const [employees, setEmployees] = React.useState<EmployeeUser[]>(INITIAL_EMPLOYEES);
  const [erpConfig, setErpConfig] = React.useState<ErpConnectionConfig>(INITIAL_ERP_CONFIG);
  const [erpStatus, setErpStatus] = React.useState<ErpSyncStatus>(INITIAL_ERP_STATUS);
  const [quotes, setQuotes] = React.useState<QuoteRecord[]>(INITIAL_QUOTES);
  const [inventory, setInventory] = React.useState<ProductInventoryRecord[]>(INITIAL_INVENTORY);
  const [invoices, setInvoices] = React.useState<ErpInvoice[]>(INITIAL_INVOICES);
  const [transfers, setTransfers] = React.useState<StockTransferOrder[]>(INITIAL_TRANSFERS);
  const [cronTasks, setCronTasks] = React.useState<CsvCronTask[]>(INITIAL_CSV_CRON_TASKS);
  const [cronLogs, setCronLogs] = React.useState<CsvCronExecutionLog[]>(INITIAL_CSV_CRON_LOGS);

  // Loyalty Program Handlers
  const handleUpdateLoyaltyProfile = (updatedProfile: LoyaltyProfile) => {
    setLoyaltyProfile(updatedProfile);
  };

  const handleRedeemReward = (reward: LoyaltyReward) => {
    if (loyaltyProfile.pointsBalance < reward.pointsRequired) {
      setCartToast({
        id: Date.now(),
        productName: `Cupón ${reward.name} (Requiere ${reward.pointsRequired} pts. Tu saldo: ${loyaltyProfile.pointsBalance})`,
        quantity: 0,
        unit: 'puntos',
      });
      return;
    }

    const nowStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const newTx: LoyaltyPointTransaction = {
      id: `tx-redeem-${Date.now()}`,
      date: nowStr,
      description: `Canje de cupón: ${reward.name}`,
      pointsDelta: -reward.pointsRequired,
      type: 'redeemed',
    };

    setLoyaltyProfile((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance - reward.pointsRequired,
      activeRewards: [reward, ...(prev.activeRewards || [])],
      pointsHistory: [newTx, ...(prev.pointsHistory || [])],
    }));

    setAppliedReward(reward);
    setLoyaltyOpen(false);
    setCartOpen(true);

    setCartToast({
      id: Date.now(),
      productName: `Cupón "${reward.name}" aplicado a tu pedido`,
      quantity: 1,
      unit: 'beneficio',
    });
  };

  const handleCompletePurchaseLoyaltyUpdate = (pointsEarned: number, earnsStamp: boolean) => {
    const nowStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const newTx: LoyaltyPointTransaction = {
      id: `tx-earn-${Date.now()}`,
      date: nowStr,
      description: `Puntos sumados por compra online E-Commerce`,
      pointsDelta: pointsEarned,
      type: 'earned',
    };

    setLoyaltyProfile((prev) => {
      let newStamps = prev.punchCardStamps + (earnsStamp ? 1 : 0);
      let newTotalCards = prev.punchCardsCompleted;
      if (newStamps >= 6) {
        newStamps = 0;
        newTotalCards += 1;
      }

      return {
        ...prev,
        pointsBalance: prev.pointsBalance + pointsEarned,
        punchCardStamps: newStamps,
        punchCardsCompleted: newTotalCards,
        pointsHistory: [newTx, ...(prev.pointsHistory || [])],
      };
    });

    setAppliedReward(null);
  };

  // Login handler
  const handleLoginSuccess = (user: EmployeeUser) => {
    setCurrentUser(user);
    setLoginOpen(false);
    setAdminOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminOpen(false);
  };

  // Add Cron Log handler
  const handleAddCronLog = (log: CsvCronExecutionLog) => {
    setCronLogs((prev) => [log, ...prev]);
  };

  // Update Inventory Prices & Stocks from CSV or Cron
  const handleUpdateInventoryPrices = (
    updatedItems: { sku: string; price?: number; wholesalePrice?: number; stockRoca?: number; stockNeuquen?: number }[]
  ) => {
    const nowStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setInventory((prev) =>
      prev.map((item) => {
        const update = updatedItems.find(
          (u) => u.sku.toLowerCase() === item.sku.toLowerCase() || u.sku.toLowerCase() === item.id.toLowerCase()
        );
        if (update) {
          return {
            ...item,
            price: update.price !== undefined ? update.price : item.price,
            wholesalePrice: update.wholesalePrice !== undefined ? update.wholesalePrice : item.wholesalePrice,
            stockRoca: update.stockRoca !== undefined ? update.stockRoca : item.stockRoca,
            stockNeuquen: update.stockNeuquen !== undefined ? update.stockNeuquen : item.stockNeuquen,
            lastErpSync: `Hoy ${nowStr} hs`,
          };
        }
        return item;
      })
    );
  };

  // Update Single Product Branch Stock from Sales or Transfers
  const handleUpdateBranchStock = (productId: string, branch: 'roca' | 'neuquen', newStock: number) => {
    const nowStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setInventory((prev) =>
      prev.map((item) => {
        if (
          item.id.toLowerCase() === productId.toLowerCase() ||
          item.sku.toLowerCase() === productId.toLowerCase()
        ) {
          return {
            ...item,
            stockRoca: branch === 'roca' ? newStock : item.stockRoca,
            stockNeuquen: branch === 'neuquen' ? newStock : item.stockNeuquen,
            lastErpSync: `Hoy ${nowStr} hs`,
          };
        }
        return item;
      })
    );
  };

  // ERP Sync Trigger Handler
  const handleTriggerErpSync = () => {
    const nowStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setErpStatus((prev) => ({
      ...prev,
      lastSyncTime: `Hoy, ${nowStr} hs`,
      pendingRecordsCount: 0,
      lastSyncLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: `Hoy ${nowStr} hs`,
          type: 'success',
          message: `Sincronización manual de Precios, Stock y Pedidos con ${erpConfig.systemType} finalizada.`,
          itemCount: inventory.length + quotes.length,
        },
        ...prev.lastSyncLogs,
      ],
    }));
  };

  const handleUpdateQuoteStatus = (quoteId: string, newStatus: QuoteRecord['status']) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus, erpSyncId: newStatus === 'facturado_erp' ? `ERP-DOC-2026-${Math.floor(Math.random() * 900 + 100)}` : q.erpSyncId } : q))
    );
  };

  const handleUpdateStock = (productId: string, branch: 'roca' | 'neuquen', newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          return branch === 'roca' ? { ...item, stockRoca: newStock } : { ...item, stockNeuquen: newStock };
        }
        return item;
      })
    );
  };

  const handleCreateInvoice = (invoice: ErpInvoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  };

  const handleCreateTransfer = (transfer: StockTransferOrder) => {
    setTransfers((prev) => [transfer, ...prev]);
  };

  const handleBulkPriceUpdate = (percentage: number) => {
    const factor = 1 + percentage / 100;
    setInventory((prev) =>
      prev.map((item) => ({
        ...item,
        price: Math.round(item.price * factor),
        wholesalePrice: item.wholesalePrice ? Math.round(item.wholesalePrice * factor) : undefined,
        lastErpSync: 'Hoy ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      }))
    );

    const nowStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    setErpStatus((prev) => ({
      ...prev,
      lastSyncTime: `Hoy, ${nowStr} hs`,
      lastSyncLogs: [
        {
          id: `log-price-${Date.now()}`,
          timestamp: `Hoy ${nowStr} hs`,
          type: 'info',
          message: `Ajuste masivo de precios (+${percentage}%) aplicado y replicado en ${erpConfig.systemType}.`,
          itemCount: inventory.length,
        },
        ...prev.lastSyncLogs,
      ],
    }));
  };

  // Cart handlers
  const handleAddToCart = (product: Product, quantity: number, isWholesale: boolean) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          isWholesale: isWholesale || updated[existingIndex].isWholesale,
        };
        return updated;
      }
      return [...prev, { product, quantity, isWholesale }];
    });

    setCartToast({
      id: Date.now(),
      productName: product.name,
      quantity,
      unit: product.unit,
      isWholesale,
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleToggleWholesale = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const nextWholesale = !item.isWholesale;
          let newQty = item.quantity;
          if (nextWholesale && item.product.wholesaleMinPack && newQty < item.product.wholesaleMinPack) {
            newQty = item.product.wholesaleMinPack;
          }
          return { ...item, isWholesale: nextWholesale, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartItemsMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dedicated /docs and /propuesta route for direct client / stakeholder sharing
  if (currentPath === '/docs' || currentPath === '/propuesta') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
        <header className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer bg-white px-2.5 py-1 rounded-xl shadow-xs"
            >
              <KoalaLogo size="xs" />
              <span className="text-slate-500 text-xs font-bold border-l border-slate-200 pl-2">
                × Clientum
              </span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800 hidden sm:inline">
              Dossier Comercial & Documentación ERP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/admin?tab=docs')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Panel Admin
            </button>
            <button
              onClick={() => navigateTo('/')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors shadow-xs cursor-pointer"
            >
              Volver a la Tienda
            </button>
          </div>
        </header>

        <div className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
          <DocumentationViewer />
        </div>
      </div>
    );
  }

  // If active route is /admin, render the standalone Admin Panel & ERP Hub or Staff Login
  if (currentPath === '/admin') {
    if (currentUser) {
      return (
        <AdminPanelModal
          isOpen={true}
          isStandalonePage={true}
          onClose={() => navigateTo('/')}
          onNavigateToStore={() => navigateTo('/')}
          currentUser={currentUser}
          onLogout={handleLogout}
          employees={employees}
          onUpdateEmployees={setEmployees}
          erpStatus={erpStatus}
          onTriggerErpSync={handleTriggerErpSync}
          erpConfig={erpConfig}
          onUpdateErpConfig={setErpConfig}
          quotes={quotes}
          onUpdateQuoteStatus={handleUpdateQuoteStatus}
          inventory={inventory}
          onUpdateStock={handleUpdateStock}
          invoices={invoices}
          onCreateInvoice={handleCreateInvoice}
          transfers={transfers}
          onCreateTransfer={handleCreateTransfer}
          onBulkPriceUpdate={handleBulkPriceUpdate}
          cronTasks={cronTasks}
          onUpdateCronTasks={setCronTasks}
          cronLogs={cronLogs}
          onAddCronLog={handleAddCronLog}
          onUpdateInventoryPrices={handleUpdateInventoryPrices}
        />
      );
    }

    return (
      <AdminLoginModal
        isOpen={true}
        isStandalonePage={true}
        onClose={() => navigateTo('/')}
        onNavigateToStore={() => navigateTo('/')}
        employees={employees}
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Offline Status Notification (Service Worker) */}
      <OfflineStatusBanner />

      {/* Navigation Header */}
      <Navbar
        currentBranch={currentBranch}
        allBranches={STORES_DATA}
        onSelectBranch={handleSelectBranch}
        cartCount={cartCount}
        currentUser={currentUser}
        onOpenCart={() => setCartOpen(true)}
        onOpenAi={() => setAiOpen(true)}
        onOpenAdmin={() => {
          if (currentUser) {
            navigateTo('/admin');
          } else {
            setLoginOpen(true);
          }
        }}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenLoyaltyModal={() => setLoyaltyOpen(true)}
        loyaltyProfile={loyaltyProfile}
        onScrollToSection={scrollToSection}
        onOpenDossier={() => navigateTo('/dossier')}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Banner with Store Live Status */}
        <HeroBanner
          currentBranch={currentBranch}
          onScrollToCatalog={() => scrollToSection('catalog')}
          onScrollToLocations={() => scrollToSection('locations')}
          onOpenAi={() => setAiOpen(true)}
        />

        {/* Product Catalog with Search & Filter Tabs */}
        <ProductCatalog
          categories={CATEGORIES}
          products={PRODUCTS_CATALOG}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
          cartItemsMap={cartItemsMap}
          onOpenAi={() => setAiOpen(true)}
        />

        {/* Store Locations & Maps Section */}
        <StoreLocationsSection
          branches={STORES_DATA}
          currentBranch={currentBranch}
          onSelectBranch={handleSelectBranch}
        />
      </main>

      {/* Footer */}
      <Footer
        branches={STORES_DATA}
        onScrollToSection={scrollToSection}
        onOpenLoyaltyModal={() => setLoyaltyOpen(true)}
        onOpenAdmin={() => {
          if (currentUser) {
            navigateTo('/admin');
          } else {
            setLoginOpen(true);
          }
        }}
      />

      {/* Interactive E-Commerce & Loyalty Checkout Modal */}
      <PresupuestadorModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleWholesale={handleToggleWholesale}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentBranch={currentBranch}
        loyaltyProfile={loyaltyProfile}
        onOpenLoyaltyModal={() => {
          setCartOpen(false);
          setLoyaltyOpen(true);
        }}
        onCompletePurchaseLoyaltyUpdate={handleCompletePurchaseLoyaltyUpdate}
        appliedReward={appliedReward}
        onRemoveAppliedReward={() => setAppliedReward(null)}
      />

      {/* Customer Loyalty Program Modal */}
      <LoyaltyProgramModal
        isOpen={loyaltyOpen}
        onClose={() => setLoyaltyOpen(false)}
        profile={loyaltyProfile}
        onUpdateProfile={handleUpdateLoyaltyProfile}
        onRedeemReward={handleRedeemReward}
      />

      {/* Gemini AI Commercial Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        currentBranch={currentBranch}
        onAddToCart={handleAddToCart}
        products={PRODUCTS_CATALOG}
      />

      {/* Mobile Sticky Cart Bar */}
      <MobileCartBar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        cartTotal={cartTotal}
        branchCity={currentBranch.city}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Floating Add-to-Cart Toast Notification */}
      <CartToast
        toast={cartToast}
        branchCity={currentBranch.city}
        onClose={() => setCartToast(null)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Floating Quick Access WhatsApp Widget */}
      <FloatingWhatsApp 
        currentBranch={currentBranch}
        inventory={inventory}
        onUpdateStock={handleUpdateBranchStock}
        onSelectBranch={handleSelectBranch}
        hasCartItems={cartItems.length > 0}
      />

      {/* Staff & Admin Login Modal */}
      <AdminLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        employees={employees}
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
          navigateTo('/admin');
        }}
      />

      {/* Staff Admin Panel & ERP Sync Modal (if triggered in overlay mode) */}
      {currentUser && (
        <AdminPanelModal
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
          onNavigateToDedicatedRoute={() => {
            setAdminOpen(false);
            navigateTo('/admin');
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          employees={employees}
          onUpdateEmployees={setEmployees}
          erpStatus={erpStatus}
          onTriggerErpSync={handleTriggerErpSync}
          erpConfig={erpConfig}
          onUpdateErpConfig={setErpConfig}
          quotes={quotes}
          onUpdateQuoteStatus={handleUpdateQuoteStatus}
          inventory={inventory}
          onUpdateStock={handleUpdateStock}
          invoices={invoices}
          onCreateInvoice={handleCreateInvoice}
          transfers={transfers}
          onCreateTransfer={handleCreateTransfer}
          onBulkPriceUpdate={handleBulkPriceUpdate}
          cronTasks={cronTasks}
          onUpdateCronTasks={setCronTasks}
          cronLogs={cronLogs}
          onAddCronLog={handleAddCronLog}
          onUpdateInventoryPrices={handleUpdateInventoryPrices}
        />
      )}
    </div>
  );
}
