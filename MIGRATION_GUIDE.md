# Guide de Migration des Ressources

## 📋 Analyse des Ressources Existantes

Pour analyser les ressources de l'ancien Supabase et identifier les assets à migrer :

1. **Configurer les variables d'environnement** dans votre `.env` :
   ```bash
   OLD_PUBLIC_SUPABASE_URL=https://ancien-projet.supabase.co
   OLD_PUBLIC_SUPABASE_ANON_KEY=votre-ancienne-cle-anon
   OLD_SUPABASE_SERVICE_ROLE_KEY=votre-ancienne-cle-service-role
   ```

2. **Lancer l'analyse** :
   ```bash
   npm run analyze-migration
   ```

   Cela génère :
   - Un rapport `migration-analysis.json` avec les statistiques
   - Un script `scripts/migrate-resources.ts` prêt à être utilisé

## 🔍 Ce que l'analyse détecte

- ✅ Ressources avec assets externes (à télécharger et uploader)
- ✅ Ressources avec thumbnails externes
- ✅ Champs manquants (description, tags, etc.)
- ✅ Distribution par type
- ✅ Ressources nécessitant un nettoyage

## 🚀 Migration

Une fois l'analyse terminée et les données vérifiées :

1. **Vérifier le script généré** (`scripts/migrate-resources.ts`)
   - Ajuster les mappings de types si nécessaire
   - Vérifier la logique de téléchargement/upload

2. **Vérifier les variables dans `.env`** :
   ```bash
   # Ancien Supabase
   OLD_PUBLIC_SUPABASE_URL=...
   OLD_PUBLIC_SUPABASE_ANON_KEY=...
   OLD_SUPABASE_SERVICE_ROLE_KEY=...
   
   # Nouveau Supabase (déjà configuré)
   PUBLIC_SUPABASE_URL=...
   PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

3. **Lancer la migration** :
   ```bash
   npm run migrate-resources
   ```

## ⚠️ Points d'attention

- Les assets externes sont téléchargés puis uploadés vers Supabase Storage
- Les ressources sont migrées avec `status = 'approved'` par défaut
- Les thumbnails sont également migrés si externes
- Le script fait une pause de 100ms entre chaque ressource pour éviter la surcharge

## 📝 Après la migration

1. Vérifier les ressources dans `/admin/resources`
2. Vérifier les assets dans Supabase Storage
3. Tester quelques ressources sur le site
4. Nettoyer les données si nécessaire

