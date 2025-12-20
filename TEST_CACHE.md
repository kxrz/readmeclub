# 🧪 Test du Cache - Guide Simple

## Méthode 1 : Endpoint de Debug (Le plus simple)

J'ai créé un endpoint spécial pour tester le cache directement depuis votre navigateur.

### Étape 1 : Ouvrir dans le navigateur

Ouvrez cette URL dans votre navigateur :
```
http://localhost:4321/api/debug/cache?type=resources
```

Ou pour tester avec d'autres types :
- `http://localhost:4321/api/debug/cache?type=wallpapers`
- `http://localhost:4321/api/debug/cache?type=news`

### Étape 2 : Lire les résultats

Vous verrez un JSON avec :

```json
{
  "cache": {
    "available": true,        // Le cache est disponible
    "type": "resources"
  },
  "test1": {
    "fromCache": false,       // ❌ Premier appel = Cache MISS (normal)
    "duration": "245ms",      // Temps de réponse
    "hasData": true,
    "key": "latest:resources:v1:all"
  },
  "test2": {
    "fromCache": true,        // ✅ Deuxième appel = Cache HIT (cache fonctionne!)
    "duration": "12ms",       // Beaucoup plus rapide!
    "hasData": true,
    "key": "latest:resources:v1:all"
  },
  "result": {
    "cacheWorking": true,     // ✅ Le cache fonctionne!
    "performanceGain": "95% plus rapide"
  }
}
```

### Interprétation :

- ✅ **`cacheWorking: true`** → Le cache fonctionne parfaitement !
- ❌ **`cacheWorking: false`** → Problème à investiguer

---

## Méthode 2 : DevTools du Navigateur (Performance)

### Étape 1 : Ouvrir DevTools

1. Ouvrez votre navigateur
2. Appuyez sur **F12** (ou Cmd+Option+I sur Mac)
3. Allez dans l'onglet **Network**

### Étape 2 : Tester une page

1. Allez sur `http://localhost:4321/wallpapers`
2. Regardez les requêtes dans Network
3. Rechargez la page (F5)

### Résultats attendus :

- **Première visite** : Temps ~200-300ms
- **Rechargement** : Temps ~10-50ms (si le cache fonctionne)

---

## Méthode 3 : Vérifier les Headers HTTP

### Avec curl (terminal) :

```bash
# Tester une API route
curl -I http://localhost:4321/api/news/index

# Devrait retourner :
# Cache-Control: public, s-maxage=86400, stale-while-revalidate=3600
```

### Dans le navigateur (DevTools) :

1. Ouvrez DevTools (F12)
2. Network tab
3. Cliquez sur une requête API
4. Regardez l'onglet "Headers"
5. Cherchez `Cache-Control` dans "Response Headers"

---

## 🎯 Test Rapide (30 secondes)

1. **Ouvrir** : `http://localhost:4321/api/debug/cache?type=resources`
2. **Vérifier** : `result.cacheWorking` doit être `true`
3. **Si `true`** → ✅ Le cache fonctionne !
4. **Si `false`** → ❌ Il y a un problème

---

## 🔍 Que faire si ça ne fonctionne pas ?

### Si `cache.available: false` :

Le cache Astro n'est pas disponible. Cela peut arriver si :
- Vous êtes en mode build (pas dev)
- Configuration Astro spéciale

### Si `test1.fromCache: true` :

Le cache était déjà rempli d'une visite précédente. C'est normal et bon signe !

### Si `test2.fromCache: false` :

Le deuxième appel devrait être depuis le cache mais ne l'est pas. Problème à investiguer :
- Vérifier que les clés sont identiques (`test1.key === test2.key`)
- Vérifier que `Astro.cache` est disponible

---

## 📊 Indicateurs de Succès

✅ **Le cache fonctionne si :**
- `cache.available: true`
- `test1.fromCache: false` (premier appel)
- `test2.fromCache: true` (deuxième appel)
- `result.cacheWorking: true`
- `test2.duration` < `test1.duration` (généralement 5-10x plus rapide)

---

## 💡 Astuce

L'endpoint `/api/debug/cache` exécute automatiquement deux requêtes :
1. Une première (qui devrait être un MISS)
2. Une deuxième immédiatement après (qui devrait être un HIT)

Cela vous permet de voir en un seul appel si le cache fonctionne, sans avoir à recharger la page !
