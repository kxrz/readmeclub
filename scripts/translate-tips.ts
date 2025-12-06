import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

if (!DEEPL_API_KEY) {
  console.error('❌ Veuillez configurer DEEPL_API_KEY dans votre .env');
  process.exit(1);
}

interface Tip {
  id: number;
  category: string;
  tip: string;
}

interface TipsData {
  metadata: {
    title: string;
    version: string;
    language: string;
    total_tips: number;
    last_updated: string;
    source: string;
    community_hub: string;
    official_subreddit: string;
    support_email: string;
    official_website: string;
  };
  tips: Tip[];
}

const languages: Record<string, string> = {
  fr: 'FR',
  es: 'ES',
  ru: 'RU',
  cn: 'ZH',
};

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        source_lang: 'EN',
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('  ⏳ Rate limit atteint, attente de 60 secondes...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        // Réessayer une fois
        return translateText(text, targetLang);
      }
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error(`Erreur lors de la traduction de "${text.substring(0, 50)}..."`, error);
    throw error;
  }
}

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  // DeepL permet jusqu'à 50 textes par requête
  const batchSize = 50;
  const results: string[] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(texts.length / batchSize);
    console.log(`  Traduction du batch ${batchNum}/${totalBatches} (${batch.length} textes)...`);

    try {
      const formData = new URLSearchParams();
      batch.forEach(text => {
        formData.append('text', text);
      });
      formData.append('target_lang', targetLang);
      formData.append('source_lang', 'EN');

      const response = await fetch(DEEPL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      results.push(...data.translations.map((t: any) => t.text));
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
        console.log(`  ⏳ Rate limit atteint, attente de 60 secondes...`);
        await new Promise(resolve => setTimeout(resolve, 60000));
        // Réessayer le batch
        i -= batchSize; // Revenir en arrière pour réessayer
        continue;
      }
      console.error(`Erreur lors de la traduction du batch ${batchNum}`, error);
      throw error;
    }

    // Attendre entre les batches pour éviter de dépasser les limites de taux
    // DeepL gratuit: 5 req/s max, donc on attend au moins 1 seconde entre chaque batch
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
  }

  return results;
}

async function main() {
  const tipsPath = path.join(process.cwd(), 'src/data/tips.json');
  const tipsData: TipsData = JSON.parse(fs.readFileSync(tipsPath, 'utf-8'));

  console.log(`📚 Traduction de ${tipsData.tips.length} tips...\n`);

  // Charger les traductions existantes si elles existent
  const translationsPath = path.join(process.cwd(), 'src/i18n/tips-translations.ts');
  let existingTranslations: {
    categories: Record<string, Record<string, string>>;
    tips: Record<string, Record<number, string>>;
  } = { categories: {}, tips: {} };

  if (fs.existsSync(translationsPath)) {
    try {
      // Lire le fichier et extraire les données JSON
      const fileContent = fs.readFileSync(translationsPath, 'utf-8');
      
      // Extraire la partie JSON entre les accolades
      const categoriesMatch = fileContent.match(/categories:\s*({[\s\S]*?}),\s*tips:/);
      const tipsMatch = fileContent.match(/tips:\s*({[\s\S]*?})\s*};/);
      
      if (categoriesMatch && tipsMatch) {
        // Convertir le format TypeScript en JSON valide
        let categoriesJson = categoriesMatch[1];
        let tipsJson = tipsMatch[1];
        
        // Remplacer les clés non-quotées par des clés quotées
        categoriesJson = categoriesJson.replace(/(\w+):/g, '"$1":');
        tipsJson = tipsJson.replace(/(\w+):/g, '"$1":');
        
        // Remplacer les valeurs de chaîne simples
        categoriesJson = categoriesJson.replace(/:\s*([^",{}\[\]]+)\s*([,}])/g, ': "$1"$2');
        tipsJson = tipsJson.replace(/:\s*([^",{}\[\]]+)\s*([,}])/g, ': "$1"$2');
        
        try {
          existingTranslations.categories = JSON.parse(categoriesJson);
          existingTranslations.tips = JSON.parse(tipsJson);
          console.log('📖 Traductions existantes chargées\n');
        } catch (parseError) {
          console.log('⚠️  Format des traductions existantes invalide, nouvelle traduction complète\n');
        }
      } else {
        console.log('⚠️  Format du fichier de traductions non reconnu, nouvelle traduction complète\n');
      }
    } catch (error) {
      console.log('⚠️  Impossible de charger les traductions existantes, nouvelle traduction complète\n');
    }
  } else {
    console.log('📝 Aucune traduction existante trouvée, nouvelle traduction complète\n');
  }

  // Extraire les catégories uniques
  const categories = Array.from(new Set(tipsData.tips.map(t => t.category)));
  console.log(`📁 Catégories trouvées: ${categories.length}\n`);

  // Traduire les catégories
  const categoryTranslations: Record<string, Record<string, string>> = {};
  for (const lang of Object.keys(languages)) {
    categoryTranslations[lang] = existingTranslations.categories[lang] || {};
    console.log(`🌍 Traduction des catégories en ${lang.toUpperCase()}...`);
    
    let translatedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      // Vérifier si la traduction existe déjà
      if (categoryTranslations[lang][category]) {
        console.log(`  ⏭️  ${category} → ${categoryTranslations[lang][category]} (déjà traduit)`);
        skippedCount++;
        continue;
      }
      
      const translated = await translateText(category, languages[lang]);
      categoryTranslations[lang][category] = translated;
      console.log(`  ✨ ${category} → ${translated}`);
      translatedCount++;
      
      // Attendre entre chaque catégorie pour éviter le rate limit
      if (i < categories.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`  📊 ${translatedCount} traduites, ${skippedCount} déjà existantes\n`);
    
    // Attendre entre les langues
    if (lang !== Object.keys(languages)[Object.keys(languages).length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Traduire les tips
  const tipTranslations: Record<string, Record<number, string>> = {};
  for (const lang of Object.keys(languages)) {
    tipTranslations[lang] = existingTranslations.tips[lang] || {};
    console.log(`🌍 Traduction des tips en ${lang.toUpperCase()}...`);
    
    // Identifier les tips à traduire
    const tipsToTranslate: { index: number; tip: string; id: number }[] = [];
    tipsData.tips.forEach((tip, index) => {
      if (!tipTranslations[lang][tip.id]) {
        tipsToTranslate.push({ index, tip: tip.tip, id: tip.id });
      }
    });
    
    if (tipsToTranslate.length === 0) {
      console.log(`  ✅ Tous les tips sont déjà traduits (${tipsData.tips.length})\n`);
      continue;
    }
    
    console.log(`  📝 ${tipsToTranslate.length} tips à traduire sur ${tipsData.tips.length}`);
    
    // Traduire uniquement les tips manquants par batch
    const tipsTexts = tipsToTranslate.map(t => t.tip);
    const translatedTips = await translateBatch(tipsTexts, languages[lang]);
    
    // Ajouter les traductions au dictionnaire
    tipsToTranslate.forEach((item, index) => {
      tipTranslations[lang][item.id] = translatedTips[index];
    });
    
    console.log(`  ✅ ${tipsToTranslate.length} nouveaux tips traduits, ${tipsData.tips.length - tipsToTranslate.length} déjà existants\n`);
  }

  // Générer le fichier de traductions
  const translationsContent = `// Traductions générées automatiquement avec DeepL
// Ne pas modifier manuellement - régénérer avec: npm run translate-tips

export const tipsTranslations = {
  categories: ${JSON.stringify(categoryTranslations, null, 2)},
  tips: ${JSON.stringify(tipTranslations, null, 2)},
};
`;

  fs.writeFileSync(translationsPath, translationsContent, 'utf-8');
  console.log(`✅ Traductions sauvegardées dans ${translationsPath}\n`);

  console.log('📊 Résumé:');
  console.log(`  - ${categories.length} catégories traduites`);
  console.log(`  - ${tipsData.tips.length} tips traduits`);
  console.log(`  - ${Object.keys(languages).length} langues`);
}

main().catch(console.error);

