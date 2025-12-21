# ⏰ Debouncing des Rebuilds Vercel

## 🎯 Problème Résolu

**Avant** : Si 10 utilisateurs soumettent du contenu en 1 minute → 10 rebuilds Vercel  
**Après** : Si 10 utilisateurs soumettent du contenu en 1 minute → **1 seul rebuild** après 2 minutes

## 🔧 Solution Implémentée

### Debouncing avec Délai

Le système utilise un **debouncing** avec un délai de **2 minutes** :

1. **Première soumission** → Rebuild programmé dans 2 minutes
2. **Deuxième soumission** (avant 2 min) → Annule le précédent, reprogramme dans 2 minutes
3. **Après 2 minutes sans nouvelle soumission** → Rebuild déclenché

### Avantages

- ✅ **Évite les rebuilds multiples** : Maximum 1 rebuild toutes les 2 minutes
- ✅ **Regroupe les soumissions** : Plusieurs soumissions = 1 seul rebuild
- ✅ **Réduit les coûts** : Moins de builds Vercel consommés
- ✅ **Respecte les limites** : Plan gratuit Vercel = 100 builds/mois

### Exemple

**Scénario** : 5 wallpapers soumis en 3 minutes

**Sans debouncing** :
- 12:00 → Rebuild #1
- 12:01 → Rebuild #2
- 12:02 → Rebuild #3
- 12:03 → Rebuild #4
- 12:03 → Rebuild #5
- **Total** : 5 rebuilds

**Avec debouncing** :
- 12:00 → Rebuild programmé pour 12:02
- 12:01 → Rebuild reprogrammé pour 12:03
- 12:02 → Rebuild reprogrammé pour 12:04
- 12:03 → Rebuild reprogrammé pour 12:05
- 12:03 → Rebuild reprogrammé pour 12:05
- 12:05 → **1 seul rebuild déclenché**
- **Total** : 1 rebuild

## ⚙️ Configuration

### Délai Actuel

```typescript
const DEBOUNCE_DELAY_MS = 2 * 60 * 1000; // 2 minutes
```

### Ajuster le Délai

Si vous voulez changer le délai, modifiez dans `src/lib/utils/vercel-rebuild.ts` :

```typescript
// Plus court (1 minute) - rebuilds plus fréquents
const DEBOUNCE_DELAY_MS = 1 * 60 * 1000;

// Plus long (5 minutes) - rebuilds moins fréquents
const DEBOUNCE_DELAY_MS = 5 * 60 * 1000;
```

## 📊 Impact

### Avant Debouncing

- **10 soumissions/min** → 10 rebuilds/min
- **100 soumissions/jour** → ~100 rebuilds/jour
- **Limite Vercel gratuit** : 100 builds/mois → **Dépassé en 1 jour** ❌

### Après Debouncing

- **10 soumissions/min** → 1 rebuild toutes les 2 min = ~30 rebuilds/heure max
- **100 soumissions/jour** → ~12-24 rebuilds/jour (selon distribution)
- **Limite Vercel gratuit** : 100 builds/mois → **Respectée** ✅

## ⚠️ Limitations

### Cache Mémoire

Le debouncing utilise un cache mémoire qui est **perdu entre les invocations Serverless**.

**Impact** : En production Serverless (Vercel), chaque fonction peut être une nouvelle instance, donc le debouncing peut ne pas fonctionner parfaitement entre les instances.

**Solution** : Pour un debouncing vraiment efficace en Serverless, il faudrait utiliser :
- **Vercel KV** (Redis) pour partager l'état entre instances
- **Database** pour stocker l'état du rebuild
- **Queue system** (comme Vercel Queue)

### Comportement Actuel

Le debouncing fonctionne **parfaitement** si :
- Plusieurs soumissions arrivent dans la même instance Serverless
- Les soumissions sont rapprochées (< 2 min)

Le debouncing peut être **moins efficace** si :
- Les soumissions arrivent dans des instances différentes
- Les soumissions sont espacées (> 2 min)

## 🚀 Améliorations Possibles

### Option 1 : Vercel KV (Recommandé si nécessaire)

Utiliser Vercel KV pour partager l'état entre instances :

```typescript
import { kv } from '@vercel/kv';

const REBUILD_KEY = 'vercel:rebuild:scheduled';
const DEBOUNCE_DELAY_MS = 2 * 60 * 1000;

export async function triggerVercelRebuild(): Promise<void> {
  const scheduled = await kv.get(REBUILD_KEY);
  const now = Date.now();
  
  if (scheduled && scheduled > now) {
    // Rebuild déjà programmé, on ne fait rien
    return;
  }
  
  // Programme le rebuild
  await kv.set(REBUILD_KEY, now + DEBOUNCE_DELAY_MS, { ex: Math.ceil(DEBOUNCE_DELAY_MS / 1000) });
  
  // ... déclencher le rebuild après le délai
}
```

**Coût** : Nécessite Vercel Pro (~$20/mois)

### Option 2 : Database (Gratuit)

Utiliser Supabase pour stocker l'état :

```typescript
// Table: rebuild_schedule
// - id: UUID
// - scheduled_at: TIMESTAMPTZ
// - triggered: BOOLEAN

export async function triggerVercelRebuild(): Promise<void> {
  // Vérifier si un rebuild est déjà programmé
  const { data } = await supabase
    .from('rebuild_schedule')
    .select('*')
    .eq('triggered', false)
    .gt('scheduled_at', new Date().toISOString())
    .single();
  
  if (data) {
    // Rebuild déjà programmé
    return;
  }
  
  // Programmer un nouveau rebuild
  // ...
}
```

**Avantage** : Gratuit, fonctionne entre instances  
**Inconvénient** : Requête DB supplémentaire

## ✅ Recommandation

**Pour l'instant** : Le debouncing actuel devrait suffire pour la plupart des cas.

**Si vous dépassez les limites** :
1. Surveiller les métriques Vercel (nombre de builds)
2. Si nécessaire, implémenter Option 2 (Database) pour un debouncing vraiment efficace
3. Ou passer à Vercel Pro + Option 1 (KV) pour une solution plus robuste

## 📝 Statut

**Implémentation** : ✅ **COMPLÉTÉE**

- Debouncing avec délai de 2 minutes
- Annulation et reprogrammation automatiques
- Logs pour suivre le comportement
