# 🔧 Guide : Configuration du Webhook Vercel

## 📋 Étapes pour Configurer le Rebuild Automatique

### Étape 1 : Créer un Deploy Hook dans Vercel

1. **Aller dans Vercel Dashboard**
   - Ouvrez https://vercel.com/dashboard
   - Sélectionnez votre projet

2. **Accéder aux Deploy Hooks**
   - Cliquez sur **Settings** (⚙️ en haut à droite)
   - Dans le menu de gauche, cliquez sur **Git**
   - Faites défiler jusqu'à la section **Deploy Hooks**

3. **Créer un nouveau Hook**
   - Cliquez sur **Create Hook**
   - **Name** : `content-update` (ou `rebuild-on-content`)
   - **Git Branch** : `main` (ou votre branche de production)
   - Cliquez sur **Create Hook**

4. **Copier l'URL du Webhook**
   - Une URL sera générée, par exemple :
     ```
     https://api.vercel.com/v1/integrations/deploy/xxxxx/yyyyy
     ```
   - **⚠️ IMPORTANT** : Copiez cette URL, vous en aurez besoin à l'étape suivante

### Étape 2 : Ajouter la Variable d'Environnement

1. **Dans Vercel Dashboard** → Votre projet → **Settings**

2. **Cliquer sur "Environment Variables"** (dans le menu de gauche)

3. **Ajouter une nouvelle variable** :
   - Cliquez sur **Add New**
   - **Key** : `VERCEL_REBUILD_WEBHOOK_URL`
   - **Value** : Collez l'URL du webhook copiée à l'étape 1
   - **Environments** : 
     - ✅ **Production** (obligatoire)
     - ✅ **Preview** (optionnel, pour tester)
     - ❌ **Development** (pas nécessaire, le code log juste un message)

4. **Sauvegarder**
   - Cliquez sur **Save**

### Étape 3 : Redéployer le Projet

**Important** : Les variables d'environnement ne sont disponibles qu'après un redéploiement.

**Option A : Redéploiement automatique**
- Faites un commit et push sur votre branche `main`
- Vercel redéploiera automatiquement avec la nouvelle variable

**Option B : Redéploiement manuel**
- Vercel Dashboard → Votre projet → **Deployments**
- Cliquez sur les **3 points** (⋯) du dernier déploiement
- Cliquez sur **Redeploy**

### Étape 4 : Vérifier que ça Fonctionne

1. **Soumettre un nouveau wallpaper** via le formulaire

2. **Vérifier les logs Vercel** :
   - Vercel Dashboard → Votre projet → **Functions**
   - Cliquez sur la fonction `/api/wallpapers` (POST)
   - Regardez les logs, vous devriez voir :
     ```
     ⏰ Rebuild scheduled at 2025-12-18T12:02:00Z (120s delay)
     ```

3. **Vérifier le rebuild** :
   - Vercel Dashboard → **Deployments**
   - Après 2 minutes, un nouveau déploiement devrait apparaître automatiquement

4. **Vérifier dans Supabase** (optionnel) :
   ```sql
   SELECT * FROM rebuild_schedule 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```
   - Devrait voir une entrée avec `triggered: false` puis `true` après le rebuild

## ⚠️ Si le Webhook n'est Pas Configuré

Si `VERCEL_REBUILD_WEBHOOK_URL` n'est pas défini :

- **En développement** : Un message sera loggé mais rien ne se passera
- **En production** : Le code fonctionnera mais ne déclenchera pas de rebuild
- **Les soumissions fonctionneront** : Seul le rebuild automatique ne se déclenchera pas

## 🔍 Vérification Rapide

### Test 1 : Vérifier la Variable

Dans Vercel Dashboard → Settings → Environment Variables :
- ✅ `VERCEL_REBUILD_WEBHOOK_URL` doit être présente
- ✅ La valeur doit être une URL Vercel (commence par `https://api.vercel.com/...`)

### Test 2 : Tester le Rebuild

1. Soumettre un nouveau wallpaper
2. Attendre 2 minutes
3. Vérifier dans Deployments qu'un nouveau build apparaît

### Test 3 : Vérifier les Logs

Dans Functions → Logs, chercher :
- `⏰ Rebuild scheduled at ...` → Le debouncing fonctionne
- `🔄 Triggering Vercel rebuild...` → Le webhook est appelé
- `✅ Vercel rebuild triggered successfully` → Tout fonctionne !

## 📝 Résumé des Étapes

1. ✅ **Créer Deploy Hook** dans Vercel → Settings → Git → Deploy Hooks
2. ✅ **Copier l'URL** du webhook
3. ✅ **Ajouter variable** `VERCEL_REBUILD_WEBHOOK_URL` dans Environment Variables
4. ✅ **Redéployer** le projet
5. ✅ **Tester** avec une soumission

## 🎯 Une Fois Configuré

Le système fonctionnera automatiquement :
- ✅ Nouveau contenu soumis → Rebuild programmé
- ✅ Debouncing actif → Maximum 1 rebuild toutes les 2 minutes
- ✅ Pages pré-rendues mises à jour → Nouveau contenu visible après rebuild

---

**Besoin d'aide ?** Si vous avez des difficultés à trouver les Deploy Hooks dans Vercel, dites-moi et je peux vous guider plus précisément !
