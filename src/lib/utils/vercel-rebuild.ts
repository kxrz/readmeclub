/**
 * Déclenche un rebuild Vercel via webhook avec debouncing via Supabase
 * 
 * Cette fonction appelle le webhook Vercel pour déclencher un rebuild automatique
 * après qu'un nouveau contenu ait été soumis (wallpaper, resource, news).
 * 
 * **Debouncing via Supabase** : Utilise la table `rebuild_schedule` pour partager
 * l'état entre toutes les instances Serverless. Si un rebuild est déjà programmé,
 * on ne programme pas un nouveau. Délai par défaut : 2 minutes.
 * 
 * Usage:
 * ```typescript
 * await triggerVercelRebuild();
 * ```
 */

import { getSupabaseAdmin } from '../supabase/admin';

// Délai de debouncing : attendre 2 minutes après la dernière soumission
const DEBOUNCE_DELAY_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Déclenche réellement le rebuild (appel interne)
 */
async function executeRebuild(): Promise<void> {
  const vercelWebhookUrl = import.meta.env.VERCEL_REBUILD_WEBHOOK_URL;
  
  if (!vercelWebhookUrl) {
    // En développement ou si le webhook n'est pas configuré, on log juste
    if (import.meta.env.DEV) {
      console.log('⚠️  VERCEL_REBUILD_WEBHOOK_URL not set - rebuild would be triggered in production');
    }
    return;
  }

  try {
    console.log('🔄 Triggering Vercel rebuild...');
    
    const response = await fetch(vercelWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'content-updated',
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log('✅ Vercel rebuild triggered successfully');
      
      // Marque le rebuild comme déclenché dans la DB
      const supabaseAdmin = getSupabaseAdmin();
      await supabaseAdmin
        .from('rebuild_schedule')
        .update({ triggered: true })
        .eq('triggered', false)
        .gt('scheduled_at', new Date(Date.now() - DEBOUNCE_DELAY_MS).toISOString());
    } else {
      console.warn(`⚠️  Vercel rebuild webhook returned status ${response.status}`);
    }
  } catch (error) {
    // Ne fait pas échouer la soumission si le webhook échoue
    console.error('❌ Failed to trigger Vercel rebuild:', error);
  }
}

/**
 * Déclenche un rebuild Vercel avec debouncing via Supabase
 * 
 * Vérifie dans la DB si un rebuild est déjà programmé. Si oui, ne fait rien.
 * Si non, programme un nouveau rebuild dans DEBOUNCE_DELAY_MS.
 * 
 * Cette approche fonctionne entre toutes les instances Serverless car l'état
 * est partagé dans Supabase.
 * 
 * @returns Promise qui se résout immédiatement (ne bloque pas)
 */
export async function triggerVercelRebuild(): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  const now = new Date();
  const scheduledAt = new Date(now.getTime() + DEBOUNCE_DELAY_MS);

  try {
    // Vérifie si un rebuild est déjà programmé (non déclenché et dans le futur)
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('rebuild_schedule')
      .select('*')
      .eq('triggered', false)
      .gt('scheduled_at', now.toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .maybeSingle(); // maybeSingle() retourne null si aucune entrée au lieu d'erreur

    if (checkError) {
      console.error('Error checking rebuild schedule:', checkError);
      // Continue pour créer un nouveau rebuild même en cas d'erreur
    } else if (existing) {
      // Un rebuild est déjà programmé, on ne fait rien
      console.log(`⏰ Rebuild already scheduled at ${existing.scheduled_at} (debouncing active)`);
      return;
    }

    // Aucun rebuild programmé, on en crée un nouveau
    const { error } = await supabaseAdmin
      .from('rebuild_schedule')
      .insert({
        scheduled_at: scheduledAt.toISOString(),
        triggered: false,
      });

    if (error) {
      console.error('❌ Failed to schedule rebuild:', error);
      return;
    }

    console.log(`⏰ Rebuild scheduled at ${scheduledAt.toISOString()} (${DEBOUNCE_DELAY_MS / 1000}s delay)`);

    // Programme l'exécution du rebuild après le délai
    setTimeout(() => {
      executeRebuild().catch(err => {
        console.error('Error executing rebuild:', err);
      });
    }, DEBOUNCE_DELAY_MS);

  } catch (error) {
    // Ne fait pas échouer la soumission si le debouncing échoue
    console.error('❌ Error checking rebuild schedule:', error);
    // En cas d'erreur, on déclenche quand même le rebuild (fallback)
    setTimeout(() => {
      executeRebuild().catch(err => {
        console.error('Error executing rebuild (fallback):', err);
      });
    }, DEBOUNCE_DELAY_MS);
  }
}
