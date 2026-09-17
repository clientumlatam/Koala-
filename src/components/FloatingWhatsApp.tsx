import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Store, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Smartphone,
  Receipt,
  QrCode,
  Tag,
  BellRing,
  CheckCheck,
  Check,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  AlertCircle,
  PackageX,
  PackageCheck,
  RefreshCw,
  Truck,
  Layers,
  Warehouse,
  Mail,
  Bell
} from 'lucide-react';
import { BranchInfo, ProductInventoryRecord } from '../types';
import { formatCurrency } from '../utils/helpers';

interface FloatingWhatsAppProps {
  currentBranch: BranchInfo;
  inventory?: ProductInventoryRecord[];
  onUpdateStock?: (productId: string, branch: 'roca' | 'neuquen', newStock: number) => void;
  onSelectBranch?: (branchId: 'roca' | 'neuquen') => void;
}

interface InquiryMpItem {
  id: string;
  time: string;
  author: string;
  query: string;
  response: string;
  status: string;
  productName: string;
  sku: string;
  estimatedPrice: number;
  installmentsText: string;
  category: string;
}

interface ConfirmedPaymentRecord {
  inquiryId: string;
  refId: string;
  amount: number;
  time: string;
  method: string;
  author: string;
  productName: string;
}

interface PaymentToast {
  id: string;
  inquiryId: string;
  title: string;
  productName: string;
  amount: number;
  refId: string;
  author: string;
  time: string;
}

interface OutOfStockBlockData {
  item: InquiryMpItem;
  branchStock: number;
  otherBranchStock: number;
  otherBranchName: string;
  otherBranchCity: string;
  otherBranchId: 'roca' | 'neuquen';
  sku: string;
}

interface StockTransferLogisticsRecord {
  id: string;
  sku: string;
  productName: string;
  fromBranchCity: string;
  toBranchCity: string;
  step: 1 | 2 | 3 | 4;
  statusText: string;
  etaMinutes: number;
  createdAt: string;
}

interface StockAlertRegistration {
  id: string;
  sku: string;
  productName: string;
  email: string;
  requestedCount?: number;
  createdAt: string;
  branchCity?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ 
  currentBranch,
  inventory = [],
  onUpdateStock,
  onSelectBranch,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMpInquiry, setSelectedMpInquiry] = React.useState<InquiryMpItem | null>(null);
  const [checkoutStep, setCheckoutStep] = React.useState<'form' | 'processing' | 'success'>('form');
  const [paymentOption, setPaymentOption] = React.useState<'tarjeta' | 'dinero_mp' | 'efectivo'>('tarjeta');
  const [installments, setInstallments] = React.useState<number>(3);
  const [payerName, setPayerName] = React.useState('');
  const [payerEmail, setPayerEmail] = React.useState('');
  const [payerPhone, setPayerPhone] = React.useState('');
  const [paymentRefId, setPaymentRefId] = React.useState('');

  // Preventive Stock Check state & Out-of-Stock Prevention modal
  const [blockedOutOfStock, setBlockedOutOfStock] = React.useState<OutOfStockBlockData | null>(null);
  const [stockOverrides, setStockOverrides] = React.useState<Record<string, { roca?: number; neuquen?: number }>>({});
  const [stockCheckSuccess, setStockCheckSuccess] = React.useState<{ sku: string; units: number } | null>(null);
  const [transferRequested, setTransferRequested] = React.useState<string | null>(null);

  // Inter-Branch Logistics Active Transfers State
  const [activeTransfers, setActiveTransfers] = React.useState<StockTransferLogisticsRecord[]>([]);

  // Email Notifications for Out of Stock Items State
  const [stockAlerts, setStockAlerts] = React.useState<StockAlertRegistration[]>(() => [
    {
      id: 'alert-init-1',
      sku: 'INS-JURID-01',
      productName: 'Combo Carpetas Oficio + Folios x500 + Broches',
      email: 'compras@estudiojuridicod.com.ar',
      requestedCount: 5,
      createdAt: '15:20 hs',
      branchCity: currentBranch.city,
    },
    {
      id: 'alert-init-2',
      sku: 'MAY-ESC-PK100',
      productName: 'Pack Escolar Mayorista (Cartulinas, Afiches, Goma Eva x100)',
      email: 'silvia.docente@escuela42.edu.ar',
      requestedCount: 10,
      createdAt: '14:10 hs',
      branchCity: currentBranch.city,
    },
    {
      id: 'alert-init-3',
      sku: 'ART-POSCA-PC3M8',
      productName: 'Set Marcadores Uni Posca PC-3M Punta Fina x8 colores',
      email: 'taller.patagonia@gmail.com',
      requestedCount: 3,
      createdAt: '18:45 hs',
      branchCity: currentBranch.city,
    }
  ]);
  const [alertModalItem, setAlertModalItem] = React.useState<{ sku: string; productName: string } | null>(null);
  const [alertEmailInput, setAlertEmailInput] = React.useState('');
  const [alertQtyInput, setAlertQtyInput] = React.useState<number>(1);
  const [alertSuccessEmail, setAlertSuccessEmail] = React.useState<string | null>(null);

  // Dynamically confirmed Mercado Pago payments by inquiry id
  const [confirmedPayments, setConfirmedPayments] = React.useState<Record<string, ConfirmedPaymentRecord>>(() => ({
    'rec-1': {
      inquiryId: 'rec-1',
      refId: 'MP-KOALA-934821',
      amount: 28900,
      time: 'Hace 4 min',
      method: 'Tarjeta de Crédito (3 cuotas s/interés)',
      author: 'Martín G. (Roca)',
      productName: 'Caja Resma Autor A4 75g (x5 unidades 500 hjs)'
    }
  }));

  // Dynamic Toast notifications stack
  const [paymentToasts, setPaymentToasts] = React.useState<PaymentToast[]>([]);

  const addPaymentToast = (toast: PaymentToast) => {
    setPaymentToasts(prev => [toast, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setPaymentToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 6000);
  };

  const removeToast = (toastId: string) => {
    setPaymentToasts(prev => prev.filter(t => t.id !== toastId));
  };

  // Helper to resolve inventory stock for an inquiry item with preventive check
  const getStockDetails = React.useCallback((item: InquiryMpItem) => {
    const matched = inventory.find(inv => 
      (inv.sku && inv.sku.toLowerCase() === item.sku.toLowerCase()) ||
      (inv.id && inv.id.toLowerCase() === item.sku.toLowerCase()) ||
      (inv.name && inv.name.toLowerCase().includes(item.productName.toLowerCase())) ||
      (item.productName && item.productName.toLowerCase().includes(inv.name.toLowerCase()))
    );

    // Default simulation or actual inventory values
    const defaultRoca = matched ? matched.stockRoca : (item.id === 'rec-3' && currentBranch.id === 'roca' ? 0 : 42);
    const defaultNeuquen = matched ? matched.stockNeuquen : (item.id === 'rec-3' && currentBranch.id === 'neuquen' ? 0 : 28);

    const overrideRoca = stockOverrides[item.id]?.roca;
    const overrideNeuquen = stockOverrides[item.id]?.neuquen;

    const stockRoca = overrideRoca !== undefined ? overrideRoca : defaultRoca;
    const stockNeuquen = overrideNeuquen !== undefined ? overrideNeuquen : defaultNeuquen;

    const branchStock = currentBranch.id === 'roca' ? stockRoca : stockNeuquen;
    const otherBranchStock = currentBranch.id === 'roca' ? stockNeuquen : stockRoca;
    const otherBranchCity = currentBranch.id === 'roca' ? 'Neuquén' : 'General Roca';
    const otherBranchName = currentBranch.id === 'roca' ? 'Neuquén Capital (Mitre 678)' : 'General Roca (Av. Roca 1350)';
    const otherBranchId: 'roca' | 'neuquen' = currentBranch.id === 'roca' ? 'neuquen' : 'roca';

    return {
      matched,
      branchStock,
      otherBranchStock,
      otherBranchCity,
      otherBranchName,
      otherBranchId,
      isOutOfStock: branchStock <= 0,
      isLowStock: branchStock > 0 && branchStock <= 5,
    };
  }, [inventory, currentBranch, stockOverrides]);

  // Dynamic store hours check
  const status = React.useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    // Weekdays (Mon-Fri): 08:30 (510 min) - 12:30 (750 min) & 16:00 (960 min) - 20:00 (1200 min)
    if (day >= 1 && day <= 5) {
      const isMorning = currentMinutes >= 510 && currentMinutes < 750;
      const isAfternoon = currentMinutes >= 960 && currentMinutes < 1200;
      if (isMorning || isAfternoon) {
        return {
          isOpen: true,
          label: 'En línea',
          details: `Abierto hoy hasta las ${isMorning ? '12:30 hs' : '20:00 hs'}`,
        };
      }
      return {
        isOpen: false,
        label: 'Cerrado',
        details: 'Horario Lun-Vie 8:30-12:30 / 16-20hs',
      };
    }
    
    // Saturday: 09:00 (540 min) - 13:00 (780 min)
    if (day === 6) {
      const isOpenSat = currentMinutes >= 540 && currentMinutes < 780;
      if (isOpenSat) {
        return {
          isOpen: true,
          label: 'En línea',
          details: 'Abierto hoy Sábado hasta las 13:00 hs',
        };
      }
      return {
        isOpen: false,
        label: 'Cerrado',
        details: 'Reabre Lunes a las 08:30 hs',
      };
    }

    // Sunday
    return {
      isOpen: false,
      label: 'Cerrado',
      details: 'Reabre Lunes a las 08:30 hs',
    };
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hola Koala Lo Tiene! Quisiera hacer una consulta directa para la sucursal de ${currentBranch.city}.`
  );
  const whatsappUrl = `https://wa.me/${currentBranch.whatsapp}?text=${whatsappMessage}`;

  // 3 Simulated recent user inquiries contextualized with active branch + MP Item info
  const recentInquiries: InquiryMpItem[] = React.useMemo(() => {
    if (currentBranch.id === 'roca') {
      return [
        {
          id: 'rec-1',
          time: 'Hace 8 min',
          author: 'Martín G. (Roca)',
          query: '¿Tienen stock de resmas Autor A4 75g por caja en Mitre 642?',
          response: '¡Hola Martín! Sí, contamos con 42 cajas disponibles para retiro inmediato.',
          status: 'Respondido',
          productName: 'Caja Resma Autor A4 75g (x5 unidades 500 hjs)',
          sku: 'LIB-RESMA-A4-CX',
          estimatedPrice: 28900,
          installmentsText: '3 cuotas sin interés de $9.633',
          category: 'Librería Comercial',
        },
        {
          id: 'rec-2',
          time: 'Hace 24 min',
          author: 'Silvia T. (Docente)',
          query: 'Presupuesto escolar mayorista para Escuela N° 42 de Fiske Menuco.',
          response: 'Presupuesto enviado en PDF con 15% de descuento por bulto cerrado.',
          status: 'Cotizado',
          productName: 'Pack Escolar Mayorista (Cartulinas, Afiches, Goma Eva x100)',
          sku: 'MAY-ESC-PK100',
          estimatedPrice: 64500,
          installmentsText: '6 cuotas fijas de $12.300',
          category: 'Mayorista Escolar',
        },
        {
          id: 'rec-3',
          time: 'Hace 45 min',
          author: 'Estudio Jurídico D.',
          query: '¿Hacen envíos a domicilio en Barrio San Martín hoy por la tarde?',
          response: 'Sí, el reparto sale a las 16:30 hs. Coordinamos por este medio.',
          status: 'En reparto',
          productName: 'Combo Carpetas Oficio + Folios x500 + Broches',
          sku: 'INS-JURID-01',
          estimatedPrice: 38200,
          installmentsText: '3 cuotas sin interés de $12.733',
          category: 'Insumos de Oficina',
        },
      ];
    } else {
      return [
        {
          id: 'rec-1',
          time: 'Hace 11 min',
          author: 'Agustina P. (Neuquén)',
          query: '¿Tienen marcadores Posca punta fina en Sarmiento 235?',
          response: '¡Hola Agustina! Sí, ingresó la colección completa en Sarmiento y Alcorta.',
          status: 'Respondido',
          productName: 'Set Marcadores Uni Posca PC-3M Punta Fina x8 colores',
          sku: 'ART-POSCA-PC3M8',
          estimatedPrice: 36400,
          installmentsText: '3 cuotas sin interés de $12.133',
          category: 'Arte & Diseño',
        },
        {
          id: 'rec-2',
          time: 'Hace 31 min',
          author: 'Taller de Arte Patagonia',
          query: 'Consulta por bastidores entelados 40x50 y acrílicos Eterna al por mayor.',
          response: 'Stock reservado en sucursal Neuquén Capital. Listo para retirar.',
          status: 'Listo para retiro',
          productName: 'Combo 6 Bastidores 40x50 + Pack Acrílicos Eterna 250ml',
          sku: 'ART-BAST-ETERNA',
          estimatedPrice: 59800,
          installmentsText: '6 cuotas fijas de $11.450',
          category: 'Bastidores & Pinturas',
        },
        {
          id: 'rec-3',
          time: 'Hace 58 min',
          author: 'Arquitectura & Planos Nqn',
          query: '¿Disponen de rollos de papel manteca y escalímetros Faber-Castell?',
          response: 'Disponibles en góndola técnica de Sarmiento 235 con factura A.',
          status: 'Respondido',
          productName: 'Rollo Papel Vegetal 90g + Escalímetro Técnico Faber-Castell',
          sku: 'TEC-ARQ-ROLLO90',
          estimatedPrice: 31900,
          installmentsText: '3 cuotas sin interés de $10.633',
          category: 'Técnico & Planos',
        },
      ];
    }
  }, [currentBranch]);

  // 3 Popular Inquiries tailored to current branch
  const quickInquiries = [
    {
      icon: '📦',
      label: 'Consultar Stock y Precios',
      text: `Hola Koala Lo Tiene! Quisiera consultar disponibilidad de stock y precios actualizados en la sucursal de ${currentBranch.city}.`,
    },
    {
      icon: '🚚',
      label: 'Envíos y Retiros en Sede',
      text: `Hola! Quisiera consultar modalidades de entrega a domicilio o retiro por la sucursal de ${currentBranch.name} (${currentBranch.address}).`,
    },
    {
      icon: '🏭',
      label: 'Venta Mayorista / Bulto Cerrado',
      text: `Hola! Quisiera solicitar presupuesto por volumen y descuento mayorista en la sucursal de ${currentBranch.city}.`,
    },
  ];

  const handleOpenMpQuickCheckout = (item: InquiryMpItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const stockInfo = getStockDetails(item);

    // PREVENTIVE STOCK CHECK: Block checkout if item has 0 units in current branch
    if (stockInfo.isOutOfStock) {
      setBlockedOutOfStock({
        item,
        branchStock: stockInfo.branchStock,
        otherBranchStock: stockInfo.otherBranchStock,
        otherBranchName: stockInfo.otherBranchName,
        otherBranchCity: stockInfo.otherBranchCity,
        otherBranchId: stockInfo.otherBranchId,
        sku: item.sku,
      });
      return;
    }

    // Product has available stock -> allow opening Mercado Pago Checkout Pro
    setSelectedMpInquiry(item);
    setStockCheckSuccess({ sku: item.sku, units: stockInfo.branchStock });
    setCheckoutStep('form');
    setPayerName(item.author.replace(/\s*\([^)]*\)/, '')); // Pre-fill clean name
    setPayerEmail('');
    setPayerPhone('');
    setPaymentRefId(`MP-KOALA-${Date.now().toString().slice(-6)}`);
  };

  const handleProcessMpPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMpInquiry) return;

    // Secondary preventive stock check right before processing payment
    const stockInfo = getStockDetails(selectedMpInquiry);
    if (stockInfo.isOutOfStock) {
      setBlockedOutOfStock({
        item: selectedMpInquiry,
        branchStock: stockInfo.branchStock,
        otherBranchStock: stockInfo.otherBranchStock,
        otherBranchName: stockInfo.otherBranchName,
        otherBranchCity: stockInfo.otherBranchCity,
        otherBranchId: stockInfo.otherBranchId,
        sku: selectedMpInquiry.sku,
      });
      setSelectedMpInquiry(null);
      return;
    }

    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      if (selectedMpInquiry) {
        // Reserve stock in inventory
        const newBranchStock = Math.max(0, stockInfo.branchStock - 1);
        setStockOverrides(prev => ({
          ...prev,
          [selectedMpInquiry.id]: {
            ...prev[selectedMpInquiry.id],
            [currentBranch.id]: newBranchStock
          }
        }));

        if (stockInfo.matched && onUpdateStock) {
          onUpdateStock(stockInfo.matched.id, currentBranch.id, newBranchStock);
        }

        const newRecord: ConfirmedPaymentRecord = {
          inquiryId: selectedMpInquiry.id,
          refId: paymentRefId,
          amount: selectedMpInquiry.estimatedPrice,
          time: 'Hace instantes',
          method: paymentOption === 'tarjeta' ? `Tarjeta (${installments} cuotas s/interés)` : paymentOption === 'dinero_mp' ? 'Dinero en Cuenta MP' : 'Efectivo / Rapipago',
          author: payerName || selectedMpInquiry.author,
          productName: selectedMpInquiry.productName,
        };
        setConfirmedPayments(prev => ({
          ...prev,
          [selectedMpInquiry.id]: newRecord,
        }));
        addPaymentToast({
          id: `toast-${Date.now()}`,
          inquiryId: selectedMpInquiry.id,
          title: '¡Pago Acreditado con Éxito!',
          productName: selectedMpInquiry.productName,
          amount: selectedMpInquiry.estimatedPrice,
          refId: paymentRefId,
          author: payerName || selectedMpInquiry.author,
          time: 'Ahora',
        });
      }
    }, 1200);
  };

  // Helper to toggle stock simulation for testing preventive block
  const handleToggleSimulateStock = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStockOverrides(prev => {
      const currentVal = prev[itemId]?.[currentBranch.id];
      const isCurrentlyZero = currentVal === 0;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [currentBranch.id]: isCurrentlyZero ? 25 : 0
        }
      };
    });
  };

  const handleRestockSimulatedItem = (itemId: string, units = 15) => {
    setStockOverrides(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [currentBranch.id]: units
      }
    }));
    setBlockedOutOfStock(null);
  };

  const handleRequestStockTransfer = (sku: string, productName: string, fromCity?: string, toCity?: string) => {
    setTransferRequested(sku);
    const fromBranchCity = fromCity || (currentBranch.id === 'roca' ? 'Neuquén Capital' : 'General Roca');
    const toBranchCity = toCity || currentBranch.city;

    const newTransferId = `transfer-${Date.now()}`;
    const newTransfer: StockTransferLogisticsRecord = {
      id: newTransferId,
      sku,
      productName,
      fromBranchCity,
      toBranchCity,
      step: 1,
      statusText: `Solicitud registrada en depósito ${fromBranchCity}`,
      etaMinutes: 45,
      createdAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveTransfers(prev => [newTransfer, ...prev.filter(t => t.sku !== sku)]);

    // Simulate automatic progress steps
    setTimeout(() => {
      setActiveTransfers(prev => prev.map(t => t.id === newTransferId ? {
        ...t, step: 2, statusText: `Despachado en unidad de carga desde ${fromBranchCity}`, etaMinutes: 30
      } : t));
    }, 4500);

    setTimeout(() => {
      setActiveTransfers(prev => prev.map(t => t.id === newTransferId ? {
        ...t, step: 3, statusText: `En tránsito por Ruta 22 (${fromBranchCity} ➔ ${toBranchCity})`, etaMinutes: 15
      } : t));
    }, 9500);

    setTimeout(() => {
      setActiveTransfers(prev => prev.map(t => t.id === newTransferId ? {
        ...t, step: 4, statusText: `Arribado a ${toBranchCity} - Stock disponible para retiro`, etaMinutes: 0
      } : t));
    }, 15000);
  };

  const handleAdvanceTransferStep = (transferId: string) => {
    setActiveTransfers(prev => prev.map(t => {
      if (t.id !== transferId) return t;
      if (t.step === 1) {
        return { ...t, step: 2, statusText: `Despachado en unidad de carga desde ${t.fromBranchCity}`, etaMinutes: 30 };
      } else if (t.step === 2) {
        return { ...t, step: 3, statusText: `En tránsito por Ruta 22 (${t.fromBranchCity} ➔ ${t.toBranchCity})`, etaMinutes: 15 };
      } else if (t.step === 3) {
        return { ...t, step: 4, statusText: `Arribado a ${t.toBranchCity} - Stock disponible para retiro`, etaMinutes: 0 };
      }
      return t;
    }));
  };

  const handleRegisterStockAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertModalItem || !alertEmailInput.trim()) return;

    const cleanEmail = alertEmailInput.trim();
    const newAlert: StockAlertRegistration = {
      id: `alert-${Date.now()}`,
      sku: alertModalItem.sku,
      productName: alertModalItem.productName,
      email: cleanEmail,
      requestedCount: alertQtyInput || 1,
      createdAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      branchCity: currentBranch.city,
    };

    setStockAlerts(prev => [newAlert, ...prev.filter(a => !(a.sku === alertModalItem.sku && a.email === cleanEmail))]);
    setAlertSuccessEmail(cleanEmail);
    setTimeout(() => {
      setAlertSuccessEmail(null);
      setAlertModalItem(null);
      setAlertEmailInput('');
      setAlertQtyInput(1);
    }, 2200);
  };

  const handleSimulateMpWebhook = (item: InquiryMpItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const simulatedRef = `MP-API-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ConfirmedPaymentRecord = {
      inquiryId: item.id,
      refId: simulatedRef,
      amount: item.estimatedPrice,
      time: 'Hace instantes',
      method: 'Mercado Pago Webhook API (IPN Instantáneo)',
      author: item.author,
      productName: item.productName,
    };
    setConfirmedPayments(prev => ({
      ...prev,
      [item.id]: newRecord,
    }));
    addPaymentToast({
      id: `toast-${Date.now()}`,
      inquiryId: item.id,
      title: 'API Mercado Pago: Pago Acreditado',
      productName: item.productName,
      amount: item.estimatedPrice,
      refId: simulatedRef,
      author: item.author,
      time: 'Recién',
    });
  };

  const handleNotifyWhatsAppPayment = () => {
    if (!selectedMpInquiry) return;
    const msg = encodeURIComponent(
      `*¡Pago Confirmado por Mercado Pago Checkout Pro!*\n` +
      `📦 *Producto/Consulta:* ${selectedMpInquiry.productName}\n` +
      `🧾 *Comprobante MP:* ${paymentRefId}\n` +
      `💰 *Monto Abonado:* ${formatCurrency(selectedMpInquiry.estimatedPrice)}\n` +
      `💳 *Medio:* ${paymentOption === 'tarjeta' ? `Tarjeta (${installments} cuotas)` : paymentOption === 'dinero_mp' ? 'Dinero en Cuenta MP' : 'Efectivo en Rapipago'}\n` +
      `👤 *Cliente:* ${payerName || selectedMpInquiry.author}\n` +
      `📍 *Sucursal de Retiro:* ${currentBranch.name} (${currentBranch.city})\n\n` +
      `Solicito confirmar recepción y aviso de retiro. ¡Muchas gracias!`
    );
    window.open(`https://wa.me/${currentBranch.whatsapp}?text=${msg}`, '_blank');
  };

  const handleExportMpSessionCsv = () => {
    // SECTION 1: Mercado Pago Session Transactions
    const section1Header = [
      '=== SECCION 1: TRANSACCIONES Y CONSULTAS MERCADO PAGO / WHATSAPP ==='
    ];

    const headersSection1 = [
      'ID_Consulta',
      'Fecha_Hora',
      'Sucursal',
      'Cliente_Autor',
      'Producto_Consultado',
      'SKU',
      'Categoria',
      'Importe_ARS',
      'Estado_Pago_MP',
      'Referencia_Comprobante_MP',
      'Medio_Pago',
      'Plan_Cuotas',
      'Detalle_Consulta'
    ];

    const rowsSection1 = recentInquiries.map((item) => {
      const isPaid = !!confirmedPayments[item.id];
      const payment = confirmedPayments[item.id];
      const amount = payment ? payment.amount : item.estimatedPrice;
      const refId = payment ? payment.refId : 'PENDIENTE_CHECKOUT';
      const paymentMethod = payment 
        ? payment.method
        : 'A coordinar';
      const installmentsText = payment ? 'Acreditado' : item.installmentsText || '1 pago';

      return [
        `"${item.id}"`,
        `"${item.time}"`,
        `"${currentBranch.name} (${currentBranch.city})"`,
        `"${item.author.replace(/"/g, '""')}"`,
        `"${item.productName.replace(/"/g, '""')}"`,
        `"${item.sku}"`,
        `"${item.category}"`,
        amount,
        `"${isPaid ? 'ACREDITADO' : 'CONSULTA_PRESUPUESTADA'}"`,
        `"${refId}"`,
        `"${paymentMethod.replace(/"/g, '""')}"`,
        `"${installmentsText.replace(/"/g, '""')}"`,
        `"${item.query.replace(/"/g, '""')}"`
      ].join(';');
    });

    // SECTION 2: Out-of-Stock Alerts (Alertas de Stock Faltante)
    const section2Header = [
      '',
      '=== SECCION 2: ALERTAS DE STOCK FALTANTE (OUT-OF-STOCK ALERTS) ==='
    ];

    const headersSection2 = [
      'ID_Alerta',
      'SKU_Producto',
      'Nombre_Producto',
      'Cantidad_Solicitada',
      'Email_Contacto_Cliente',
      'Fecha_Registro',
      'Sucursal_Solicitud',
      'Estado_Alerta'
    ];

    const rowsSection2 = stockAlerts.map((alert) => {
      return [
        `"${alert.id}"`,
        `"${alert.sku}"`,
        `"${alert.productName.replace(/"/g, '""')}"`,
        alert.requestedCount || 1,
        `"${alert.email}"`,
        `"${alert.createdAt}"`,
        `"${alert.branchCity || currentBranch.city}"`,
        `"PENDIENTE_REPOSICION_ERP"`
      ].join(';');
    });

    const totalRecaudado = recentInquiries.reduce((acc, item) => {
      const paid = confirmedPayments[item.id];
      return acc + (paid ? paid.amount : item.estimatedPrice);
    }, 0);
    const totalAcreditados = Object.keys(confirmedPayments).length;
    const totalOutStockAlerts = stockAlerts.length;
    const totalRequestedUnitsOutStock = stockAlerts.reduce((acc, a) => acc + (a.requestedCount || 1), 0);
    const nowIso = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    // Summary lines at bottom
    const summaryRows = [
      '',
      '=== RESUMEN CONSOLIDADO GENERAL ===',
      `"Sucursal:";"${currentBranch.name} - ${currentBranch.city}"`,
      `"Fecha y Hora de Exportación:";"${nowIso}"`,
      `"Total Transacciones / Consultas:";"${recentInquiries.length}"`,
      `"Pagos Acreditados Checkout Pro:";"${totalAcreditados}"`,
      `"Consultas / Pendientes:";"${recentInquiries.length - totalAcreditados}"`,
      `"Monto Total Recaudado / Estimado ARS:";"${totalRecaudado}"`,
      `"Total Alertas Stock Faltante Registradas:";"${totalOutStockAlerts}"`,
      `"Total Unidades Demandadas sin Stock:";"${totalRequestedUnitsOutStock}"`
    ];

    const csvContent = '\uFEFF' + [
      ...section1Header,
      headersSection1.join(';'),
      ...rowsSection1,
      ...section2Header,
      headersSection2.join(';'),
      ...rowsSection2,
      ...summaryRows
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const branchCode = currentBranch.id.toUpperCase();
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `MercadoPago_y_AlertasStock_Sesion_${branchCode}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Mini Popover Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 max-w-xs w-84 sm:w-90 space-y-3 overflow-hidden text-slate-900 dark:text-white"
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-500'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-fredoka leading-tight">Atención Directa WhatsApp</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Koala Lo Tiene • {currentBranch.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  aria-label="Cerrar ventana"
                  id="close-whatsapp-popover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Branch Status */}
              <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    Sucursal:
                  </span>

                  {/* Dynamic Status Badge */}
                  {status.isOpen ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      En línea
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1.5 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-full text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Cerrado
                    </span>
                  )}
                </div>

                <div className="text-xs font-extrabold text-slate-900 dark:text-white font-fredoka pt-0.5">
                  {currentBranch.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{status.details}</span>
                </div>
              </div>

              {/* Scrollable Recent Messages Section with Mercado Pago Quick Checkout CTA */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between gap-1">
                  <span className="truncate">Últimas consultas en {currentBranch.city}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      id="btn-export-mp-csv-header"
                      onClick={handleExportMpSessionCsv}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-[9px] shadow-2xs transition-all hover:scale-102 cursor-pointer"
                      title="Exportar resumen consolidado de transacciones de Mercado Pago en archivo CSV"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>Exportar CSV</span>
                    </button>
                    <span className="text-sky-600 dark:text-sky-400 font-bold text-[9px] hidden sm:flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      MP
                    </span>
                  </div>
                </div>

                {/* Scrollable recent-messages container */}
                <div 
                  className="recent-messages max-h-56 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 relative"
                  id="recent-branch-messages"
                >
                  {/* Active Inter-Branch Logistics Tracker Progress Bar Card */}
                  <AnimatePresence>
                    {activeTransfers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        id="active-interbranch-logistics-tracker"
                        className="p-3 rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white shadow-md border border-sky-400/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-[11px] text-sky-200">
                            <Truck className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                            <span className="font-fredoka tracking-wide">Traspaso Inter-Sucursales</span>
                          </div>
                          <span className="text-[8px] bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded-full font-mono font-extrabold border border-sky-400/30">
                            {activeTransfers[0].etaMinutes > 0 ? `ETA: ~${activeTransfers[0].etaMinutes} min` : '¡Arribado!'}
                          </span>
                        </div>

                        <div className="text-[10px] space-y-0.5 bg-black/30 p-2 rounded-xl border border-sky-500/20">
                          <div className="font-bold text-white truncate">{activeTransfers[0].productName}</div>
                          <div className="flex justify-between text-[9px] text-sky-300">
                            <span>Origen: <strong>{activeTransfers[0].fromBranchCity}</strong> ➔ <strong>{activeTransfers[0].toBranchCity}</strong></span>
                            <span className="font-mono text-[8px] opacity-80">SKU: {activeTransfers[0].sku}</span>
                          </div>
                        </div>

                        {/* Interactive Visual Progress Bar (25% -> 50% -> 75% -> 100%) */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-semibold text-sky-200">
                            <span className="truncate max-w-[190px]">{activeTransfers[0].statusText}</span>
                            <span className="font-mono font-bold">{activeTransfers[0].step * 25}%</span>
                          </div>

                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-sky-600/50">
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: `${activeTransfers[0].step * 25}%` }}
                              transition={{ duration: 0.4 }}
                              className="h-full bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 rounded-full shadow-xs"
                            />
                          </div>

                          {/* 4 Step Nodes Tracker */}
                          <div className="grid grid-cols-4 gap-1 text-[7px] text-center pt-0.5 font-medium">
                            <div className={`p-0.5 rounded ${activeTransfers[0].step >= 1 ? 'bg-sky-500/40 text-sky-100 font-bold border border-sky-400/60' : 'text-slate-400 opacity-50'}`}>
                              1. Solicitado
                            </div>
                            <div className={`p-0.5 rounded ${activeTransfers[0].step >= 2 ? 'bg-sky-500/40 text-sky-100 font-bold border border-sky-400/60' : 'text-slate-400 opacity-50'}`}>
                              2. Despacho
                            </div>
                            <div className={`p-0.5 rounded ${activeTransfers[0].step >= 3 ? 'bg-sky-500/40 text-sky-100 font-bold border border-sky-400/60' : 'text-slate-400 opacity-50'}`}>
                              3. Tránsito
                            </div>
                            <div className={`p-0.5 rounded ${activeTransfers[0].step >= 4 ? 'bg-emerald-500/50 text-emerald-100 font-bold border border-emerald-400/80' : 'text-slate-400 opacity-50'}`}>
                              4. Arribado
                            </div>
                          </div>
                        </div>

                        {/* Step Advance Control Button */}
                        {activeTransfers[0].step < 4 && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceTransferStep(activeTransfers[0].id)}
                            className="w-full py-1 px-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-bold text-[8px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Simular avance del transporte inter-sucursales"
                          >
                            <span>Avanzar Paso Logístico ({activeTransfers[0].step}/4)</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Dynamic Toast Notifications Floating Stack */}
                  <AnimatePresence>
                    {paymentToasts.map((toast) => (
                      <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/50 space-y-1.5"
                        id={`toast-notification-${toast.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-[10px]">
                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                              <BellRing className="w-2.5 h-2.5 text-white animate-bounce" />
                            </div>
                            <span className="tracking-tight">{toast.title}</span>
                          </div>
                          <button
                            onClick={() => removeToast(toast.id)}
                            className="p-0.5 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
                            aria-label="Cerrar notificación"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-[9px] bg-black/15 p-1.5 rounded-lg space-y-0.5 font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-100 font-sans font-semibold truncate max-w-[150px]">{toast.productName}</span>
                            <span className="font-bold text-white text-[10px]">{formatCurrency(toast.amount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[8px] text-emerald-200">
                            <span>ID: {toast.refId}</span>
                            <span>Cliente: {toast.author}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Resumen Consolidado de Recaudación Mercado Pago en Sesión */}
                  <div
                    id="mp-session-summary-banner"
                    className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-emerald-500/10 border border-sky-300/80 dark:border-sky-700/80 text-[10px] space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-sky-800 dark:text-sky-300">
                        <div className="w-4 h-4 rounded-md bg-sky-500 text-white flex items-center justify-center">
                          <CreditCard className="w-2.5 h-2.5" />
                        </div>
                        <span className="tracking-tight">Recaudación MP (Sesión {currentBranch.city})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          id="btn-export-mp-csv-banner"
                          onClick={handleExportMpSessionCsv}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[8px] transition-colors cursor-pointer"
                          title="Descargar resumen consolidado en CSV"
                        >
                          <Download className="w-2 h-2" />
                          <span>CSV</span>
                        </button>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold text-[8px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          En Vivo
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-0.5 border-t border-sky-200/50 dark:border-sky-800/40">
                      <div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">Total recaudado:</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white font-mono">
                          {formatCurrency(
                            recentInquiries.reduce((acc, item) => {
                              const paid = confirmedPayments[item.id];
                              return acc + (paid ? paid.amount : item.estimatedPrice);
                            }, 0)
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">Acreditados MP:</div>
                        <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          {Object.keys(confirmedPayments).length} de {recentInquiries.length} confirmados
                        </div>
                      </div>
                    </div>
                  </div>

                  {recentInquiries.map((item) => {
                    const isPaid = !!confirmedPayments[item.id];
                    const paymentInfo = confirmedPayments[item.id];
                    const stockInfo = getStockDetails(item);
                    const isAlertRegistered = stockAlerts.some(a => a.sku === item.sku);

                    return (
                      <div
                        key={item.id}
                        id={`recent-inquiry-card-${item.id}`}
                        className={`p-2.5 rounded-xl border text-[10px] space-y-1.5 transition-all shadow-xs relative ${
                          isPaid
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/80 ring-1 ring-emerald-400/30'
                            : stockInfo.isOutOfStock
                            ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/70 hover:border-sky-300 dark:hover:border-sky-700'
                        }`}
                      >
                        {/* Dynamic MP Payment Status Banner on Card */}
                        {isPaid && (
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-emerald-200/70 dark:border-emerald-800/60">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[8px] tracking-wide shadow-xs animate-pulse">
                              <CheckCheck className="w-2.5 h-2.5" />
                              PAGO ACREDITADO MP
                            </span>
                            <span className="text-[8px] font-mono text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                              <span>Ref:</span>
                              <strong>{paymentInfo.refId}</strong>
                            </span>
                          </div>
                        )}

                        {/* Customer & Product Header with Real-Time Stock Status Indicator Dots */}
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                            {/* Real-Time Availability Green / Red Dot Indicator */}
                            {stockInfo.isOutOfStock ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-950 shrink-0" title="Sin Stock (0 u.)" />
                            ) : stockInfo.isLowStock ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300 dark:ring-amber-950 shrink-0" title={`Bajo Stock (${stockInfo.branchStock} u.)`} />
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-950 animate-pulse shrink-0" title={`Stock Disponible (${stockInfo.branchStock} u.)`} />
                            )}
                            <span className="truncate">{item.author}</span>
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-[9px] font-mono shrink-0 ml-1">{item.time}</span>
                        </div>

                        {/* Product Name with Availability Label Dot */}
                        <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-slate-800 dark:text-slate-200 pt-0.5 border-t border-slate-200/40 dark:border-slate-700/30">
                          <span className="truncate font-fredoka text-slate-900 dark:text-white" title={item.productName}>
                            {item.productName}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded-full font-bold text-[8px] shrink-0 flex items-center gap-1 ${
                            stockInfo.isOutOfStock
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : stockInfo.isLowStock
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${stockInfo.isOutOfStock ? 'bg-rose-500' : stockInfo.isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            {stockInfo.isOutOfStock ? 'Sin Stock' : stockInfo.isLowStock ? 'Bajo Stock' : 'Disponible'}
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 italic">
                          "{item.query}"
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/40 text-[9px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                            ✓ {item.response}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded-full font-bold shrink-0 ml-1 text-[8px] ${
                            isPaid
                              ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                              : stockInfo.isOutOfStock
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {isPaid ? 'Acreditado' : stockInfo.isOutOfStock ? 'Sin Stock' : item.status}
                          </span>
                        </div>

                        {/* Live Stock Status & Preventive Check Badge */}
                        <div className="flex items-center justify-between text-[9px] px-1.5 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center gap-1">
                            <Warehouse className="w-2.5 h-2.5 text-slate-500" />
                            <span className="text-slate-500 dark:text-slate-400">Stock {currentBranch.city}:</span>
                            {stockInfo.isOutOfStock ? (
                              <span className="font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                                <PackageX className="w-2.5 h-2.5" /> 0 u. (Agotado)
                              </span>
                            ) : (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                <PackageCheck className="w-2.5 h-2.5" /> {stockInfo.branchStock} u.
                              </span>
                            )}
                          </div>

                          {/* Quick stock test toggle button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleSimulateStock(item.id, e)}
                            className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-semibold transition-colors cursor-pointer ${
                              stockInfo.isOutOfStock
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                            title="Probar validación preventiva simulando stock 0 o con disponibilidad"
                          >
                            {stockInfo.isOutOfStock ? 'Probar +Stock' : 'Probar Stock 0'}
                          </button>
                        </div>

                        {/* 'Alert me when available' Feature Button for Out of Stock Items */}
                        {stockInfo.isOutOfStock && !isPaid && (
                          <div className="pt-0.5">
                            {isAlertRegistered ? (
                              <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  Alerta de stock activa para tu email
                                </span>
                                <span className="text-[8px] font-mono text-emerald-700 dark:text-emerald-400">Registrada</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                id={`btn-register-stock-alert-${item.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAlertModalItem({ sku: item.sku, productName: item.productName });
                                }}
                                className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-[9px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                title="Registrar tu email para recibir notificación automatizada de reingreso de stock"
                              >
                                <Bell className="w-3 h-3 text-white animate-bounce" />
                                <span>Avisarme cuando haya stock</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Item Estimated Price & Fast Checkout / Verified Action */}
                        <div className={`rounded-lg p-1.5 border flex items-center justify-between gap-2 ${
                          isPaid
                            ? 'bg-white/80 dark:bg-slate-900/80 border-emerald-200 dark:border-emerald-800/50'
                            : stockInfo.isOutOfStock
                            ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/60'
                            : 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/40'
                        }`}>
                          <div className="truncate">
                            <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                              <span>{formatCurrency(item.estimatedPrice)}</span>
                              {isPaid && (
                                <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                  (Cobrado)
                                </span>
                              )}
                              {!isPaid && stockInfo.isOutOfStock && (
                                <span className="text-[8px] font-bold text-rose-600 dark:text-rose-400 font-sans">
                                  [Agotado]
                                </span>
                              )}
                            </div>
                            <div className="text-[8px] text-sky-700 dark:text-sky-300 font-medium truncate">
                              {isPaid ? paymentInfo.method : item.installmentsText}
                            </div>
                          </div>

                          {/* Action Buttons: Fast Checkout vs Verified Receipt */}
                          <div className="flex items-center gap-1 shrink-0">
                            {isPaid ? (
                              <button
                                type="button"
                                id={`btn-mp-receipt-${item.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMpInquiry(item);
                                  setPaymentRefId(paymentInfo.refId);
                                  setPayerName(paymentInfo.author);
                                  setCheckoutStep('success');
                                }}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-[9px] shadow-xs transition-all cursor-pointer"
                                title="Ver comprobante de pago oficial de Mercado Pago"
                              >
                                <Receipt className="w-3 h-3" />
                                <span>Ver Recibo MP</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  id={`btn-mp-simulate-webhook-${item.id}`}
                                  onClick={(e) => handleSimulateMpWebhook(item, e)}
                                  className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-600 dark:text-slate-300 hover:text-amber-700 transition-colors"
                                  title="Simular webhook de confirmación de pago de la API de Mercado Pago"
                                >
                                  <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                </button>
                                <button
                                  type="button"
                                  id={`btn-mp-quick-pay-${item.id}`}
                                  onClick={(e) => handleOpenMpQuickCheckout(item, e)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[9px] shadow-xs transition-all hover:scale-102 cursor-pointer ${
                                    stockInfo.isOutOfStock
                                      ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white'
                                      : 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white'
                                  }`}
                                  title={
                                    stockInfo.isOutOfStock
                                      ? 'Validación preventiva: Sin stock disponible (bloqueará pago)'
                                      : 'Iniciar Checkout Pro de Mercado Pago validando stock disponible'
                                  }
                                >
                                  {stockInfo.isOutOfStock ? (
                                    <>
                                      <AlertTriangle className="w-3 h-3 text-white" />
                                      <span>Validar Stock MP</span>
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="w-3 h-3" />
                                      <span>Pago Rápido MP</span>
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Popular Inquiries / Quick Links */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Consultas frecuentes</span>
                  <span className="text-orange-600 dark:text-orange-400 font-extrabold flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> 3 Accesos
                  </span>
                </div>

                <div className="space-y-1.5">
                  {quickInquiries.map((inquiry, idx) => (
                    <a
                      key={idx}
                      id={`quick-link-inquiry-${idx}`}
                      href={`https://wa.me/${currentBranch.whatsapp}?text=${encodeURIComponent(inquiry.text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors group"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-xs">{inquiry.icon}</span>
                        <span className="truncate">{inquiry.label}</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 ml-1" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                id="btn-main-whatsapp-chat"
                className={`w-full py-2.5 px-3 rounded-xl ${status.isOpen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-600 hover:bg-orange-500'} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-1`}
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{status.isOpen ? `Chatear con ${currentBranch.city}` : `Dejar mensaje a ${currentBranch.city}`}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          id="btn-toggle-floating-whatsapp"
          className={`relative group ${status.isOpen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-600 hover:bg-orange-500'} text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer`}
          aria-label={`Abrir WhatsApp de ${currentBranch.name}`}
          title={`WhatsApp Koala Lo Tiene (${currentBranch.city}) - ${status.label}`}
        >
          {/* Pulsing Outer Ring */}
          {status.isOpen && (
            <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
          )}

          {/* Status indicator badge */}
          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-[9px] font-black border-2 border-white dark:border-slate-900 flex items-center justify-center`}>
            {status.isOpen ? '✓' : '!'}
          </span>

          <MessageCircle className="w-6 h-6 fill-white text-white relative z-10" />

          {/* Hover City Tooltip on Desktop */}
          <span className="hidden sm:group-hover:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-lg items-center gap-1.5 animate-in fade-in slide-in-from-right-2">
            <Store className="w-3.5 h-3.5 text-orange-400" />
            WhatsApp {currentBranch.city} ({status.label})
          </span>
        </motion.button>
      </div>

      {/* Mercado Pago Quick Checkout Modal / Dialog */}
      <AnimatePresence>
        {selectedMpInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-slate-900 dark:text-white"
              id="mp-quick-checkout-modal"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-fredoka flex items-center gap-1.5">
                      Pago Rápido Mercado Pago
                      <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                        Checkout Pro
                      </span>
                    </h3>
                    <p className="text-[11px] text-sky-100">Koala Lo Tiene • {currentBranch.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMpInquiry(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors"
                  aria-label="Cerrar modal"
                  id="btn-close-mp-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                {checkoutStep === 'form' && (
                  <form onSubmit={handleProcessMpPayment} className="space-y-4">
                    {/* Item Summary Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-sky-500" />
                          {selectedMpInquiry.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">SKU: {selectedMpInquiry.sku}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-fredoka">
                        {selectedMpInquiry.productName}
                      </h4>

                      {/* Real-time Verified Inventory Stock Check Banner in Modal */}
                      <div className="flex items-center justify-between text-[11px] bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-300 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Stock verificado en tiempo real:</span>
                        </div>
                        <span className="font-bold bg-emerald-200/80 dark:bg-emerald-900/90 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-mono">
                          {stockCheckSuccess ? stockCheckSuccess.units : getStockDetails(selectedMpInquiry).branchStock} u. disponibles en {currentBranch.city}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Total a pagar:</div>
                          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(selectedMpInquiry.estimatedPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ {selectedMpInquiry.installmentsText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Selecciona el medio de pago preferido:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentOption('tarjeta')}
                          id="btn-select-mp-card"
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            paymentOption === 'tarjeta'
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold ring-2 ring-sky-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="text-[10px]">Tarjeta Crédito / Débito</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentOption('dinero_mp')}
                          id="btn-select-mp-wallet"
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            paymentOption === 'dinero_mp'
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold ring-2 ring-sky-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Smartphone className="w-4 h-4" />
                          <span className="text-[10px]">Dinero en Mercado Pago</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentOption('efectivo')}
                          id="btn-select-mp-cash"
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            paymentOption === 'efectivo'
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold ring-2 ring-sky-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Receipt className="w-4 h-4" />
                          <span className="text-[10px]">Efectivo Pago Fácil</span>
                        </button>
                      </div>
                    </div>

                    {/* Installments selector if card selected */}
                    {paymentOption === 'tarjeta' && (
                      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>Planes de financiación:</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                            Programa Cuotas Koala
                          </span>
                        </label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          id="select-mp-installments"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                        >
                          <option value={1}>1 pago de {formatCurrency(selectedMpInquiry.estimatedPrice)}</option>
                          <option value={3}>3 cuotas sin interés de {formatCurrency(selectedMpInquiry.estimatedPrice / 3)}</option>
                          <option value={6}>6 cuotas fijas de {formatCurrency((selectedMpInquiry.estimatedPrice * 1.15) / 6)}</option>
                        </select>
                      </div>
                    )}

                    {/* Buyer Information Form */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Datos para facturación y retiro en sucursal:
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Nombre y Apellido / Razón Social"
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          id="input-mp-payer-name"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="email"
                            required
                            placeholder="Email para el comprobante"
                            value={payerEmail}
                            onChange={(e) => setPayerEmail(e.target.value)}
                            id="input-mp-payer-email"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                          />
                          <input
                            type="tel"
                            placeholder="Teléfono / WhatsApp"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            id="input-mp-payer-phone"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40 p-2.5 rounded-xl">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Transacción procesada bajo protocolo de seguridad SSL de Mercado Pago.</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      id="btn-submit-mp-payment"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirmar y Pagar {formatCurrency(selectedMpInquiry.estimatedPrice)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {checkoutStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-fredoka">
                        Conectando con Mercado Pago Checkout Pro...
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Validando scoring antifraude y preferencia de pago segura.
                      </p>
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="py-4 space-y-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-fredoka">
                        ¡Pago Acreditado Exitosamente!
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        La transacción se registró con el ID <strong className="text-sky-600 dark:text-sky-400">{paymentRefId}</strong>.
                      </p>
                    </div>

                    {/* Receipt Details */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Sucursal de Retiro:</span>
                        <strong className="text-slate-900 dark:text-white">{currentBranch.name}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Dirección:</span>
                        <span>{currentBranch.address}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Producto:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{selectedMpInquiry.productName}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                        <span>Monto Acreditado:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedMpInquiry.estimatedPrice)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={handleNotifyWhatsAppPayment}
                        id="btn-notify-whatsapp-payment"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Avisar a la Sucursal por WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMpInquiry(null)}
                        id="btn-finish-mp-checkout"
                        className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cerrar Comprobante
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Out-of-Stock Prevention Alert & Multi-Branch Resolution Modal */}
      <AnimatePresence>
        {blockedOutOfStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white dark:bg-slate-900 border-2 border-rose-500/50 dark:border-rose-600/60 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-slate-900 dark:text-white"
              id="mp-preventive-stock-check-modal"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                    <PackageX className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-fredoka flex items-center gap-1.5">
                      Validación Preventiva de Inventario
                      <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                        Stock Agotado
                      </span>
                    </h3>
                    <p className="text-[11px] text-rose-100">Operación Bloqueada • {currentBranch.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setBlockedOutOfStock(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors"
                  aria-label="Cerrar aviso"
                  id="btn-close-stock-alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Warning Card */}
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>No se puede iniciar el cobro por Mercado Pago</span>
                  </div>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed">
                    El producto solicitado actualmente <strong>no dispone de stock disponible (0 unidades)</strong> en la sucursal de <strong>{currentBranch.city}</strong>. Esta validación preventiva evita ventas sin disponibilidad y retrasos al cliente.
                  </p>
                </div>

                {/* Product Info */}
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400">SKU: {blockedOutOfStock.sku}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-fredoka">
                    {blockedOutOfStock.item.productName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Cliente solicitante: <span className="font-semibold text-slate-900 dark:text-white">{blockedOutOfStock.item.author}</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white font-mono pt-1">
                    Precio: {formatCurrency(blockedOutOfStock.item.estimatedPrice)}
                  </div>
                </div>

                {/* Multi-Branch Inventory Availability Status */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Disponibilidad en la Red Koala:</span>
                    <span className="text-[10px] text-slate-400">Red Alto Valle</span>
                  </div>

                  {/* Current Branch (0 units) */}
                  <div className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-rose-500" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{currentBranch.name}</div>
                        <div className="text-[10px] text-slate-500">{currentBranch.city} (Seleccionada)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                      0 u. (Agotado)
                    </span>
                  </div>

                  {/* Other Branch (Check availability) */}
                  <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{blockedOutOfStock.otherBranchName}</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          {blockedOutOfStock.otherBranchStock > 0 ? '¡Stock disponible en depósito!' : 'Sin stock'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded-md font-mono">
                      {blockedOutOfStock.otherBranchStock} u. listas
                    </span>
                  </div>
                </div>

                {/* Actionable Alternatives */}
                <div className="space-y-2 pt-1">
                  {blockedOutOfStock.otherBranchStock > 0 && onSelectBranch && (
                    <button
                      type="button"
                      id="btn-switch-branch-for-stock"
                      onClick={() => {
                        onSelectBranch(blockedOutOfStock.otherBranchId);
                        setBlockedOutOfStock(null);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Store className="w-4 h-4" />
                      <span>Cambiar a Sucursal {blockedOutOfStock.otherBranchCity} ({blockedOutOfStock.otherBranchStock} u.)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    id="btn-request-interbranch-transfer"
                    onClick={() => handleRequestStockTransfer(blockedOutOfStock.sku, blockedOutOfStock.item.productName)}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>
                      {transferRequested === blockedOutOfStock.sku
                        ? '✓ Solicitud de Traspaso Enviada a Logística'
                        : `Solicitar Traspaso desde ${blockedOutOfStock.otherBranchCity}`}
                    </span>
                  </button>

                  {/* Alert me when available button in modal */}
                  <button
                    type="button"
                    id="btn-alert-stock-from-modal"
                    onClick={() => {
                      const targetSku = blockedOutOfStock.sku;
                      const targetName = blockedOutOfStock.item.productName;
                      setBlockedOutOfStock(null);
                      setAlertModalItem({ sku: targetSku, productName: targetName });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-white" />
                    <span>Avisarme por email cuando haya stock</span>
                  </button>

                  {/* Restock simulation shortcut for instant testing */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      id="btn-simulate-restock"
                      onClick={() => handleRestockSimulatedItem(blockedOutOfStock.item.id, 20)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Simular ingreso de stock (+20 u.) para probar cobro</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlockedOutOfStock(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Alert Email Registration Modal */}
      <AnimatePresence>
        {alertModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/80 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-slate-900 dark:text-white"
              id="stock-alert-registration-modal"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-fredoka">Alerta de Disponibilidad</h3>
                    <p className="text-[10px] text-amber-100">Koala Lo Tiene • Avisos de Stock</p>
                  </div>
                </div>
                <button
                  onClick={() => setAlertModalItem(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <div className="p-4 space-y-3">
                {alertSuccessEmail ? (
                  <div className="py-4 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-fredoka">
                      ¡Alerta Registrada con Éxito!
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Te notificaremos a <strong className="text-amber-600 dark:text-amber-400">{alertSuccessEmail}</strong> tan pronto ingrese stock de este producto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterStockAlert} className="space-y-3">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400">SKU: {alertModalItem.sku}</div>
                      <div className="text-xs font-bold font-fredoka">{alertModalItem.productName}</div>
                      <p className="text-[10px] text-amber-800 dark:text-amber-300 pt-0.5">
                        Ingresa tu email para recibir un aviso instantáneo en tu bandeja de entrada cuando repongamos unidades en la sucursal.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          Email de Notificación:
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="ejemplo@correo.com"
                          value={alertEmailInput}
                          onChange={(e) => setAlertEmailInput(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500"
                          id="input-alert-email"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          Cant. u.:
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={999}
                          value={alertQtyInput}
                          onChange={(e) => setAlertQtyInput(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono text-center"
                          id="input-alert-qty"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-stock-alert"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Registrar Alerta de Stock</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


