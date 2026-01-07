/**
 * Système de batch processing pour les resources
 * 
 * Ce module gère :
 * 1. La publication automatique par batch (tous les X heures ou N resources)
 * 2. Le déclenchement de rebuild uniquement quand un batch est prêt
 * 3. L'export automatique des resources en attente
 */

import { getSupabaseAdmin } from '../supabase/admin';

// Configuration du batch
const BATCH_CONFIG = {
  // Nombre minimum de resources en attente pour déclencher un batch
  MIN_PENDING_COUNT: 5,
  // Délai maximum avant de déclencher un batch même si < MIN_PENDING_COUNT (en heures)
  MAX_DELAY_HOURS: 24,
};

/**
 * Vérifie si un batch doit être déclenché
 */
export async function shouldTriggerBatch(): Promise<{
  shouldTrigger: boolean;
  reason: string;
  pendingCount: number;
}> {
  const supabaseAdmin = getSupabaseAdmin();
  
  // Compter les resources en attente d'export
  const { data: pendingResources, error } = await supabaseAdmin
    .from('resources')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved')
    .eq('hidden', false)
    .eq('exported_to_static', false)
    .eq('pending_export', true);
  
  if (error) {
    console.error('Error checking batch status:', error);
    return {
      shouldTrigger: false,
      reason: 'Error checking status',
      pendingCount: 0,
    };
  }
  
  const pendingCount = pendingResources || 0;
  
  // Vérifier si on a assez de resources pour un batch
  if (pendingCount >= BATCH_CONFIG.MIN_PENDING_COUNT) {
    return {
      shouldTrigger: true,
      reason: `Batch ready: ${pendingCount} resources pending (>= ${BATCH_CONFIG.MIN_PENDING_COUNT})`,
      pendingCount,
    };
  }
  
  // Vérifier si le délai maximum est dépassé
  const { data: oldestPending } = await supabaseAdmin
    .from('resources')
    .select('created_at')
    .eq('status', 'approved')
    .eq('hidden', false)
    .eq('exported_to_static', false)
    .eq('pending_export', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  
  if (oldestPending) {
    const oldestDate = new Date(oldestPending.created_at);
    const now = new Date();
    const hoursSinceOldest = (now.getTime() - oldestDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceOldest >= BATCH_CONFIG.MAX_DELAY_HOURS) {
      return {
        shouldTrigger: true,
        reason: `Batch ready: Max delay reached (${hoursSinceOldest.toFixed(1)}h >= ${BATCH_CONFIG.MAX_DELAY_HOURS}h)`,
        pendingCount,
      };
    }
  }
  
  return {
    shouldTrigger: false,
    reason: `Not ready: ${pendingCount} pending (< ${BATCH_CONFIG.MIN_PENDING_COUNT} and delay < ${BATCH_CONFIG.MAX_DELAY_HOURS}h)`,
    pendingCount,
  };
}

/**
 * Marque les resources comme en attente d'export (sans déclencher rebuild)
 */
export async function markResourcePendingExport(resourceId: string): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  
  await supabaseAdmin
    .from('resources')
    .update({ pending_export: true })
    .eq('id', resourceId);
}

/**
 * Vérifie et déclenche un batch si nécessaire
 * 
 * Cette fonction doit être appelée :
 * - Après chaque soumission de resource
 * - Via un cron job périodique (ex: toutes les heures)
 */
export async function checkAndTriggerBatch(): Promise<{
  triggered: boolean;
  reason: string;
  pendingCount: number;
}> {
  const batchStatus = await shouldTriggerBatch();
  
  if (!batchStatus.shouldTrigger) {
    return {
      triggered: false,
      reason: batchStatus.reason,
      pendingCount: batchStatus.pendingCount,
    };
  }
  
  // Déclencher le rebuild Vercel
  const { triggerVercelRebuild } = await import('./vercel-rebuild');
  await triggerVercelRebuild();
  
  console.log(`🔄 Batch triggered: ${batchStatus.reason}`);
  
  return {
    triggered: true,
    reason: batchStatus.reason,
    pendingCount: batchStatus.pendingCount,
  };
}
