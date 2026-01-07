/**
 * API Route pour cron job Vercel
 * 
 * Cette route peut être appelée périodiquement (ex: toutes les heures)
 * pour vérifier et déclencher des batches de wallpapers.
 * 
 * Configuration Vercel Cron:
 * {
 *   "crons": [{
 *     "path": "/api/cron/wallpaper-batch",
 *     "schedule": "0 * * * *"  // Toutes les heures
 *   }]
 * }
 */

import type { APIRoute } from 'astro';
import { checkAndTriggerBatch } from '@/lib/utils/wallpaper-batch';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Vérifier que la requête vient de Vercel Cron (optionnel mais recommandé)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    // Vérifier et déclencher batch si nécessaire
    const batchResult = await checkAndTriggerBatch();
    
    return new Response(JSON.stringify({
      success: true,
      batch_triggered: batchResult.triggered,
      batch_reason: batchResult.reason,
      pending_count: batchResult.pendingCount,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
