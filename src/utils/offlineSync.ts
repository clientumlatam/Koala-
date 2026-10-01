import { CartItem, OrderQuote, BranchInfo } from '../types';

export interface PendingOfflineQuote {
  id: string;
  createdAt: string;
  cartItems: CartItem[];
  quote: OrderQuote;
  branch: BranchInfo;
  totalCalculated: number;
  synced: boolean;
  syncedAt?: string;
}

const STORAGE_KEY = 'koala_offline_pending_quotes';

// Get all offline pending quotes from LocalStorage
export function getOfflinePendingQuotes(): PendingOfflineQuote[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Error reading offline pending quotes:', err);
    return [];
  }
}

// Save a new quote created while offline
export function saveQuoteOffline(
  cartItems: CartItem[],
  quote: OrderQuote,
  branch: BranchInfo,
  totalCalculated: number
): PendingOfflineQuote {
  const offlineQuotes = getOfflinePendingQuotes();
  
  const newPendingQuote: PendingOfflineQuote = {
    id: `OFFLINE-COT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    cartItems,
    quote,
    branch,
    totalCalculated,
    synced: false,
  };

  const updatedQueue = [newPendingQuote, ...offlineQuotes];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQueue));

  // Request Background Sync from Service Worker if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((reg) => {
      (reg as any).sync?.register('sync-offline-quotes').catch((err: any) => {
        console.warn('Background sync registration failed:', err);
      });
    });
  }

  return newPendingQuote;
}

// Sync all unsynced quotes when back online
export async function syncPendingOfflineQuotes(): Promise<{
  syncedCount: number;
  failedCount: number;
  syncedQuotes: PendingOfflineQuote[];
}> {
  const queue = getOfflinePendingQuotes();
  const unsynced = queue.filter((q) => !quoteIsSynced(q));

  if (unsynced.length === 0) {
    return { syncedCount: 0, failedCount: 0, syncedQuotes: [] };
  }

  const syncedQuotes: PendingOfflineQuote[] = [];
  let failedCount = 0;

  for (const item of unsynced) {
    try {
      // Simulate / perform backend or ERP sync payload
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedItem: PendingOfflineQuote = {
        ...item,
        id: item.id.replace('OFFLINE-COT', 'COT'),
        synced: true,
        syncedAt: new Date().toISOString(),
      };

      syncedQuotes.push(updatedItem);
    } catch (err) {
      console.error(`Failed to sync quote ${item.id}:`, err);
      failedCount++;
    }
  }

  // Update storage with synced status
  const finalQueue = queue.map((item) => {
    const matched = syncedQuotes.find((s) => s.createdAt === item.createdAt);
    return matched || item;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(finalQueue));

  return {
    syncedCount: syncedQuotes.length,
    failedCount,
    syncedQuotes,
  };
}

function quoteIsSynced(quote: PendingOfflineQuote): boolean {
  return quote.synced === true;
}

// Remove or clear synced quotes
export function clearSyncedQuotesHistory(): void {
  const queue = getOfflinePendingQuotes();
  const pendingOnly = queue.filter((q) => !q.synced);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingOnly));
}
