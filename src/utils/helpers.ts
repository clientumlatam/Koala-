import { CartItem, OrderQuote, BranchInfo } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface StoreOpenStatus {
  isOpen: boolean;
  statusText: string;
  nextChangeText: string;
  badgeColor: string;
}

export function checkStoreStatus(): StoreOpenStatus {
  // Argentina Timezone offset (UTC-3)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argDate = new Date(utc + (3600000 * -3));
  
  const day = argDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const hours = argDate.getHours();
  const minutes = argDate.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;

  // Schedule in minutes
  // Weekdays: 8:30 (510 min) - 12:30 (750 min) AND 16:00 (960 min) - 20:00 (1200 min)
  // Saturday: 9:00 (540 min) - 13:00 (780 min)
  // Sunday: Closed

  if (day === 0) {
    return {
      isOpen: false,
      statusText: 'Cerrado hoy Domingo',
      nextChangeText: 'Abre el Lunes a las 08:30 hs',
      badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300',
    };
  }

  if (day >= 1 && day <= 5) {
    // Mon-Fri
    const morningStart = 8 * 60 + 30; // 510
    const morningEnd = 12 * 60 + 30;  // 750
    const afternoonStart = 16 * 60;   // 960
    const afternoonEnd = 20 * 60;     // 1200

    if (currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd) {
      return {
        isOpen: true,
        statusText: 'Abierto en Turno Mañana',
        nextChangeText: 'Cierra a las 12:30 hs (Reabre 16:00 hs)',
        badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300',
      };
    }

    if (currentTimeInMinutes >= morningEnd && currentTimeInMinutes < afternoonStart) {
      return {
        isOpen: false,
        statusText: 'Cerrado al Mediodía',
        nextChangeText: 'Abre hoy a las 16:00 hs',
        badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300',
      };
    }

    if (currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd) {
      return {
        isOpen: true,
        statusText: 'Abierto en Turno Tarde',
        nextChangeText: 'Cierra a las 20:00 hs',
        badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300',
      };
    }

    if (currentTimeInMinutes < morningStart) {
      return {
        isOpen: false,
        statusText: 'Cerrado',
        nextChangeText: 'Abre hoy a las 08:30 hs',
        badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300',
      };
    }

    return {
      isOpen: false,
      statusText: 'Cerrado por hoy',
      nextChangeText: 'Abre mañana a las 08:30 hs',
      badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300',
    };
  }

  // Saturday
  const satStart = 9 * 60;  // 540
  const satEnd = 13 * 60;   // 780

  if (currentTimeInMinutes >= satStart && currentTimeInMinutes < satEnd) {
    return {
      isOpen: true,
      statusText: 'Abierto hoy Sábado',
      nextChangeText: 'Cierra a las 13:00 hs',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300',
    };
  }

  if (currentTimeInMinutes < satStart) {
    return {
      isOpen: false,
      statusText: 'Cerrado',
      nextChangeText: 'Abre hoy a las 09:00 hs',
      badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300',
    };
  }

  return {
    isOpen: false,
    statusText: 'Cerrado por hoy',
    nextChangeText: 'Abre el Lunes a las 08:30 hs',
    badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300',
  };
}

export function buildWhatsAppMessage(
  items: CartItem[],
  quote: OrderQuote,
  targetBranch: BranchInfo
): string {
  const dateStr = new Date().toLocaleDateString('es-AR');
  
  let total = 0;
  const itemLines = items.map((item, index) => {
    const itemUnitPrice = item.isWholesale && item.product.wholesalePrice 
      ? item.product.wholesalePrice 
      : item.product.price;
    const subtotal = itemUnitPrice * item.quantity;
    total += subtotal;

    const wholesaleTag = item.isWholesale ? ' *(Precio Mayorista)*' : '';
    return `${index + 1}. *${item.product.name}*\n   • Cantidad: ${item.quantity} ${item.product.unit}${wholesaleTag}\n   • Subtotal: ${formatCurrency(subtotal)}`;
  }).join('\n\n');

  const text = `🦘 *NUEVA CONSULTA / PEDIDO - KOALA LO TIENE* 🦘
------------------------------------------------
📍 *Sucursal Destino:* ${targetBranch.name} (${targetBranch.address}, ${targetBranch.city})
📅 *Fecha:* ${dateStr}

👤 *Datos del Cliente:*
• Nombre: ${quote.clientName || 'Sin especificar'}
• Teléfono: ${quote.clientPhone || 'Sin especificar'}
• Modalidad: ${quote.deliveryType === 'retiro' ? '📦 Retiro por Local' : '🚚 Envío a Domicilio'}
${quote.deliveryType === 'envio' ? `• Dirección de Envío: ${quote.deliveryAddress || 'Pendiente acordar'}\n` : ''}• Forma de Pago Estimada: ${quote.paymentMethod.toUpperCase()}

🛒 *Detalle del Pedido:*
${itemLines}

------------------------------------------------
💰 *TOTAL ESTIMADO:* ${formatCurrency(total)}
${quote.notes ? `\n💬 *Notas adicionales:* ${quote.notes}` : ''}

_Consulta generada desde el catálogo web oficial de Koala Lo Tiene._`;

  return encodeURIComponent(text);
}
