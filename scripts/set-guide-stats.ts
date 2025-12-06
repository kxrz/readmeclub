import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const NEW_SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setGuideStats() {
  console.log('📊 Mise à jour des statistiques des guides...\n');

  try {
    // Récupérer les analytics actuels
    const { data: analytics, error: fetchError } = await newSupabase
      .from('analytics')
      .select('*')
      .single();

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des analytics:', fetchError);
      process.exit(1);
    }

    if (!analytics) {
      console.error('❌ Aucune ligne analytics trouvée');
      process.exit(1);
    }

    // Mettre à jour avec les valeurs spécifiées
    const updates = {
      pdf_v2_downloads: 800,
      epub_v2_downloads: 200,
    };

    const { error: updateError } = await newSupabase
      .from('analytics')
      .update(updates)
      .eq('id', analytics.id);

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError);
      process.exit(1);
    }

    console.log('✅ Statistiques des guides mises à jour:');
    console.log(`   📄 PDF v2 downloads: ${updates.pdf_v2_downloads}`);
    console.log(`   📚 EPUB v2 downloads: ${updates.epub_v2_downloads}`);
    console.log(`   📊 Total guides: ${updates.pdf_v2_downloads + updates.epub_v2_downloads}`);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

setGuideStats();

