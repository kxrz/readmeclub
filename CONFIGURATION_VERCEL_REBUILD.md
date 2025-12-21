# 🔄 Configuration : Rebuild Automatique Vercel

## 🎯 Objectif

Déclencher automatiquement un rebuild Vercel après chaque soumission de nouveau contenu (wallpaper, resource, news) pour que les pages pré-rendues soient mises à jour immédiatement.

## 📋 Configuration Requise

### Étape 1 : Créer un Build Hook dans Vercel

1. **Aller dans Vercel Dashboard** → Votre projet
2. **Settings** → **Git** → **Deploy Hooks**
3. **Create Hook**
4. **Nom** : `content-update` (ou autre nom)
5. **Branch** : `main` (ou votre branche de production)
6. **Copier l'URL du webhook** (format : `https://api.vercel.com/v1/integrations/deploy/...`)

### Étape 2 : Ajouter la Variable d'Environnement

1. **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**
2. **Ajouter une nouvelle variable** :
   - **Key** : `VERCEL_REBUILD_WEBHOOK_URL`
   - **Value** : L'URL du webhook copiée à l'étape 1
   - **Environments** : ✅ Production (et Development si vous voulez tester)

### Étape 3 : Redéployer

Après avoir ajouté la variable d'environnement, **redéployer** le projet pour que la variable soit disponible.

## ✅ Fonctionnement

### Quand le Rebuild est Déclenché

Le rebuild est automatiquement déclenché après :

1. **Soumission d'un nouveau wallpaper** (`POST /api/wallpapers`)
2. **Soumission d'une nouvelle resource** (`POST /api/resources`)
3. **Publication d'un nouvel article** (`POST /api/admin/news` avec `status: 'published'`)

### Processus

1. **Utilisateur soumet** un nouveau contenu
2. **Contenu inséré** dans Supabase
3. **Cache invalidé** (pour les pages SSR)
4. **Webhook Vercel appelé** (déclenche rebuild)
5. **Vercel rebuild** le projet (30s-2min)
6. **Pages pré-rendues mises à jour** avec le nouveau contenu

### Délai

- **Temps de rebuild** : 30 secondes à 2 minutes (selon la taille du projet)
- **Nouveau contenu visible** : Immédiatement après le rebuild

## 🔍 Vérification

### Tester le Rebuild

1. **Soumettre un nouveau wallpaper** via le formulaire
2. **Vérifier dans Vercel Dashboard** → **Deployments**
3. **Un nouveau déploiement devrait apparaître** automatiquement
4. **Attendre la fin du build** (30s-2min)
5. **Vérifier que le nouveau wallpaper apparaît** sur `/wallpapers`

### Logs

Dans les logs Vercel (Functions), vous devriez voir :
```
✅ Vercel rebuild triggered successfully
```

Si le webhook n'est pas configuré :
```
⚠️  VERCEL_REBUILD_WEBHOOK_URL not set - rebuild would be triggered in production
```

## ⚠️ Points d'Attention

### 1. Limites Vercel

- **Plan gratuit** : 100 builds/mois
- **Plan Pro** : Builds illimités
- **Attention** : Chaque soumission = 1 build

### 2. Coût

Si vous avez beaucoup de soumissions :
- **Option A** : Accepter le délai (rebuild seulement après plusieurs soumissions)
- **Option B** : Passer au plan Pro Vercel
- **Option C** : Implémenter un système de batch (rebuild seulement toutes les X soumissions)

### 3. Délai Acceptable

- **30s-2min** de délai est généralement acceptable
- Les utilisateurs voient leur soumission immédiatement (via message de succès)
- Le contenu apparaît sur le site après le rebuild

## 🛠️ Désactiver Temporairement

Si vous voulez désactiver les rebuilds automatiques :

1. **Supprimer la variable** `VERCEL_REBUILD_WEBHOOK_URL` dans Vercel
2. **Ou** commenter les appels à `triggerVercelRebuild()` dans le code

## 📊 Alternative : ISR (Incremental Static Regeneration)

Si les rebuilds automatiques sont trop coûteux, vous pouvez utiliser **ISR** :

- Les pages sont régénérées à la demande
- Pas de rebuild complet
- Plus économique

**Mais** : Nécessite une configuration plus complexe et peut avoir des limites sur Vercel.

## ✅ Statut

**Implémentation** : ✅ **COMPLÉTÉE**

- Fonction `triggerVercelRebuild()` créée
- Intégrée dans les routes POST de soumission
- Documentation créée

**Action requise** : Configurer le webhook Vercel (voir Étape 1 et 2 ci-dessus)
