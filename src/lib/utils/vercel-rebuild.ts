/**
 * Déclenche un rebuild Vercel via webhook avec debouncing via Supabase
 * 
 * Cette fonction appelle le webhook Vercel pour déclencher un rebuild automatique
 * après qu'un nouveau contenu ait été soumis (wallpaper, resource, news).
 * 
 * **Debouncing via Supabase** : Utilise la table `rebuild_schedule` pour partager
 * l'état entre toutes les instances Serverless. Si un rebuild a été déclenché
 * récemment (dans les 2 dernières minutes), on ne déclenche pas un nouveau.
 * 
 * **Note** : En Serverless, setTimeout ne fonctionne pas car la fonction se termine.
 * On utilise donc un système de verrou : on déclenche immédiatement si aucun rebuild
 * n'a été déclenché dans les 2 dernières minutes.
 * 
 * Usage:
 * ```typescript
 * await triggerVercelRebuild();
 * ```
 */

import { getSupabaseAdmin } from '../supabase/admin';

// Délai de debouncing : ne pas déclencher si un rebuild a été déclenché dans les 2 dernières minutes
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
 * Vérifie dans la DB si un rebuild a été déclenché récemment (dans les 2 dernières minutes).
 * Si oui, ne fait rien (debouncing actif).
 * Si non, déclenche immédiatement le rebuild et enregistre dans la DB.
 * 
 * Cette approche fonctionne entre toutes les instances Serverless car l'état
 * est partagé dans Supabase. Contrairement à setTimeout, cette approche fonctionne
 * en Serverless car on déclenche immédiatement avec un verrou.
 * 
 * @returns Promise qui se résout immédiatement (ne bloque pas)
 */
export async function triggerVercelRebuild(): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  const now = new Date();
  const debounceThreshold = new Date(now.getTime() - DEBOUNCE_DELAY_MS);

  try {
    // Vérifie si un rebuild a été déclenché récemment (dans les 2 dernières minutes)
    const { data: recentRebuild, error: checkError } = await supabaseAdmin
      .from('rebuild_schedule')
      .select('*')
      .eq('triggered', true)
      .gt('updated_at', debounceThreshold.toISOString())
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking rebuild schedule:', checkError);
      // En cas d'erreur, on déclenche quand même le rebuild (fallback)
      executeRebuild().catch(err => {
        console.error('Error executing rebuild (fallback):', err);
      });
      return;
    }

    if (recentRebuild) {
      // Un rebuild a été déclenché récemment, on ne fait rien (debouncing actif)
      console.log(`⏰ Rebuild was triggered recently at ${recentRebuild.updated_at} (debouncing active, skipping)`);
      return;
    }

    // Aucun rebuild récent, on déclenche immédiatement
    // On enregistre d'abord dans la DB pour éviter les doublons
    const { data: newSchedule, error: insertError } = await supabaseAdmin
      .from('rebuild_schedule')
      .insert({
        scheduled_at: now.toISOString(),
        triggered: true, // On marque comme déclenché immédiatement
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to record rebuild schedule:', insertError);
      // On déclenche quand même le rebuild même si l'enregistrement échoue
    } else {
      console.log(`⏰ Rebuild scheduled and triggered immediately (debouncing: no recent rebuild)`);
    }

    // Déclenche le rebuild immédiatement (en arrière-plan, ne bloque pas)
    executeRebuild().catch(err => {
      console.error('Error executing rebuild:', err);
    });

  } catch (error) {
    // Ne fait pas échouer la soumission si le debouncing échoue
    console.error('❌ Error in triggerVercelRebuild:', error);
    // En cas d'erreur, on déclenche quand même le rebuild (fallback)
    executeRebuild().catch(err => {
      console.error('Error executing rebuild (fallback):', err);
    });
  }
}
