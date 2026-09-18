export type BranchId = 
  | 'roca' 
  | 'neuquen';

export interface BranchInfo {
  id: BranchId;
  name: string;
  shortName?: string;
  city: string;
  province: string;
  address: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  whatsappFormatted: string;
  email: string;
  badge?: string;
  depotCode?: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  mapsUrl: string;
}

export type CategoryId = 
  | 'all' 
  | 'polietileno' 
  | 'descartables' 
  | 'cotillon' 
  | 'reposteria' 
  | 'envases' 
  | 'libreria' 
  | 'bazar';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  badge?: string;
  gradient: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  description: string;
  price: number;
  unit: string;
  packageQuantity: number; // e.g., 50 units per pack
  wholesalePrice?: number;
  wholesaleMinPack?: number;
  isBestSeller?: boolean;
  isManufacturer?: boolean; // Fabricación propia Koala
  isNew?: boolean;
  image?: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  isWholesale: boolean;
}

export type EmployeeRole = 'admin' | 'ventas' | 'deposito' | 'facturacion' | 'backend';

export type ErpSystemType = 'ICXN ERP (https://icxn.com.ar/)' | 'Tango Gestión ERP' | 'Bejerman ERP' | 'SAP Business One' | 'Dragonfish' | 'API REST Koala Directa' | (string & {});

export interface EmployeeUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: EmployeeRole;
  branchId: BranchId | 'todas';
  avatar?: string;
  active: boolean;
  lastLogin?: string;
}

export interface ErpConnectionConfig {
  systemType: ErpSystemType;
  serverUrl: string;
  apiBearerToken: string;
  companyId: string;
  pointOfSaleRoca: string;
  pointOfSaleNeuquen: string;
  autoSyncOrders: boolean;
  autoSyncStock: boolean;
  syncIntervalMinutes: number;
  webhookUrl: string;
  webhookSecret: string;
  lastSuccessfulPing?: string;
  environment: 'production' | 'testing_sandbox';
}

export interface ErpWebhookEventRecord {
  id: string;
  timestamp: string;
  eventType: 'stock_update' | 'order_sync' | 'price_update' | 'ping_test';
  status: 'success' | 'error';
  source: string;
  payload: string;
  errorMessage?: string;
  retryCount?: number;
}

export interface ErpInvoice {
  id: string;
  quoteId: string;
  invoiceType: 'Factura A' | 'Factura B' | 'Remito R';
  invoiceNumber: string;
  caeNumber: string;
  caeExpiration: string;
  clientName: string;
  clientCuit: string;
  branchId: BranchId;
  totalNet: number;
  totalIva: number;
  totalAmount: number;
  date: string;
  status: 'emitida_afip' | 'anulada' | 'pendiente';
}

export interface StockTransferOrder {
  id: string;
  remitoNumber: string;
  date: string;
  fromBranch: BranchId;
  toBranch: BranchId;
  status: 'en_transito' | 'recibido' | 'preparando';
  authorizedBy: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface ErpSyncStatus {
  isConnected: boolean;
  systemName: string;
  lastSyncTime: string;
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  pendingRecordsCount: number;
  lastSyncLogs: {
    id: string;
    timestamp: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    itemCount?: number;
  }[];
}

export interface ProductInventoryRecord extends Product {
  stockRoca: number;
  stockNeuquen: number;
  minStockAlert: number;
  sku: string;
  erpCode: string;
  lastErpSync?: string;
}

export interface QuoteRecord extends OrderQuote {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  status: 'nueva' | 'en_preparacion' | 'facturado_erp' | 'despachado' | 'cancelado';
  assignedEmployee?: string;
  erpSyncId?: string;
}

export interface CsvCronTask {
  id: string;
  name: string;
  cronExpression: string;
  humanSchedule: string;
  type: 'import_prices_stock' | 'export_sales_quotes' | 'sync_inventory_levels' | 'backup_catalog';
  sourceType: 'sftp_ftp' | 'http_url' | 'webhook_pull' | 'local_folder';
  sourceUrl: string;
  delimiter: ',' | ';' | '\t' | '|';
  encoding: 'UTF-8' | 'ISO-8859-1 (Latin1)' | 'Windows-1252';
  active: boolean;
  lastRunTime: string;
  lastStatus: 'success' | 'failed' | 'running' | 'idle';
  lastProcessedCount: number;
  nextRunEstimate: string;
}

export interface CsvCronExecutionLog {
  id: string;
  taskId: string;
  taskName: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  durationMs: number;
  rowsProcessed: number;
  rowsUpdated: number;
  errorsCount: number;
  summary: string;
  csvSnippet?: string;
}

export interface StockMovementRecord {
  id: string;
  timestamp: string;
  branchId: BranchId;
  sku: string;
  productName: string;
  type: 'ingreso_proveedor' | 'venta_mostrador_pos' | 'venta_ecommerce_web' | 'transferencia_salida' | 'transferencia_entrada' | 'ajuste_inventario';
  quantityChange: number; // positive or negative
  previousStock: number;
  newStock: number;
  operator: string;
  documentRef: string; // e.g. "REM-PROV-9912", "TKT-POS-00129", "COT-8842", "TRF-2026-081"
  notes?: string;
  erpSyncStatus: 'sincronizado' | 'pendiente' | 'contingencia';
}

export interface StockReconciliationItem {
  sku: string;
  productName: string;
  erpPhysicalRoca: number;
  webStockRoca: number;
  committedRoca: number;
  erpPhysicalNeuquen: number;
  webStockNeuquen: number;
  committedNeuquen: number;
  discrepancyType: 'perfect_match' | 'minor_difference' | 'critical_understock';
  differenceRoca: number;
  differenceNeuquen: number;
  lastChecked: string;
}

export interface ErpSyncEvent {
  id: string;
  timestamp: string;
  eventType: 'pos_sale' | 'supplier_receipt' | 'price_change' | 'stock_transfer' | 'manual_audit';
  source: string;
  description: string;
  affectedSkus: string[];
  latencyMs: number;
  status: 'applied' | 'queued' | 'error';
}

export interface OrderQuote {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientCuitOrDni?: string;
  invoiceType?: 'Factura B (Consumidor Final)' | 'Factura A (Responsable Inscripto)';
  branchId: BranchId;
  deliveryType: 'retiro' | 'envio';
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryFee?: number;
  paymentMethod: 'efectivo' | 'transferencia' | 'mercadopago' | 'tarjeta' | 'whatsapp';
  appliedLoyaltyDiscount?: number;
  appliedRewardCode?: string;
  appliedRewardName?: string;
  pointsToEarn?: number;
  notes?: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountAmount?: number;
  discountPercentage?: number;
  freeProductSku?: string;
  type: 'points_discount' | 'free_product' | 'punch_card_reward';
  code: string;
  minOrderAmount?: number;
}

export interface LoyaltyPointTransaction {
  id: string;
  date: string;
  description: string;
  pointsDelta: number;
  type: 'earned' | 'redeemed' | 'bonus' | 'punch_stamp';
  orderId?: string;
}

export interface LoyaltyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cuitOrDni?: string;
  pointsBalance: number;
  totalSpent: number;
  tier: 'Bronce' | 'Plata' | 'Oro' | 'VIP Koala';
  punchCardStamps: number; // 0 to 6 stamps
  punchCardsCompleted: number;
  joinedDate: string;
  activeRewards: LoyaltyReward[];
  pointsHistory: LoyaltyPointTransaction[];
}

export interface CompletedOrderReceipt {
  orderId: string;
  date: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  deliveryType: 'retiro' | 'envio';
  deliveryAddress?: string;
  branchName: string;
  paymentMethod: string;
  invoiceType: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  loyaltyDiscount: number;
  paymentMethodDiscount: number;
  total: number;
  pointsEarned: number;
  stampsEarned: number;
  status: 'confirmado' | 'en_preparacion' | 'listo_retiro' | 'en_camino';
}

// Social Commerce & Instagram Automation Types
export interface SocialTriggerRule {
  id: string;
  keyword: string;
  platform: 'instagram_dm' | 'instagram_comment' | 'manychat' | 'facebook_messenger' | 'whatsapp';
  actionType: 'reply_catalog_link' | 'reply_product_quote' | 'apply_coupon' | 'transfer_to_human';
  responseTemplate: string;
  targetCategoryId?: CategoryId;
  targetProductSku?: string;
  discountPromoCode?: string;
  active: boolean;
  matchCount: number;
}

export interface SocialLead {
  id: string;
  source: 'instagram_dm' | 'instagram_comment' | 'meta_ads' | 'link_in_bio' | 'whatsapp_direct';
  handleOrName: string;
  phone?: string;
  email?: string;
  interestCategory?: CategoryId | string;
  requestedProduct?: string;
  branchPreference: BranchId | 'ambas';
  status: 'nuevo' | 'contactado_whatsapp' | 'presupuesto_enviado' | 'cerrado_erp' | 'descartado';
  date: string;
  estimatedValue?: number;
  quoteCode?: string;
  notes?: string;
}

export interface SocialCampaignLink {
  id: string;
  name: string;
  slug: string;
  targetUrl: string;
  category?: CategoryId;
  productSku?: string;
  campaignSource: 'instagram_bio' | 'instagram_story' | 'instagram_reel' | 'meta_ad' | 'qr_store';
  clicksCount: number;
  ordersGenerated: number;
  active: boolean;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export interface McpToolCallLog {
  id: string;
  timestamp: string;
  caller: 'whatsapp_gemini_bot' | 'web_assistant' | 'icxn_erp_bridge' | 'manychat_agent';
  tool: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
  latencyMs: number;
  status: 'success' | 'error';
}

export interface InstagramCarouselSlide {
  title: string;
  subtitle?: string;
  badge?: string;
  bgColor?: string;
  imageUrl?: string;
  bulletPoints?: string[];
  priceBadge?: string;
  highlightOffer?: string;
}

export interface InstagramPost {
  id: string;
  type: 'image' | 'carousel' | 'reel';
  title?: string;
  caption: string;
  category: 'todos' | 'ofertas' | 'polietileno' | 'cotillon' | 'reposteria' | 'descartables' | 'locales';
  date: string;
  likes: number;
  commentsCount: number;
  mediaUrl: string;
  carouselSlides?: InstagramCarouselSlide[];
  taggedProductSkus?: string[];
  suggestedKeyword?: string;
  permalink?: string;
  isPinned?: boolean;
}



