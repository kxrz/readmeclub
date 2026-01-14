# Plan d'implémentation : Dark Mode + PWA

## 🌙 Dark Mode avec palette personnalisée

### Objectifs
- Implémenter un dark mode avec toggle utilisateur
- Remplacer `#FFFFFF` par `#FAF9F6` (blanc chaud)
- Éviter `#000000` (noir pur) - utiliser des gris foncés
- Gérer toute la palette de couleurs de manière cohérente
- Préserver l'identité visuelle existante

### Phase 1 : Configuration de la palette de couleurs

#### 1.1 Mise à jour de `src/styles/global.css`

**Modifications à apporter :**

```css
/* Nouvelle palette Light Mode */
:root {
  /* Blanc chaud au lieu de #FFF */
  --color-white: oklch(98.5% 0.005 85); /* #FAF9F6 approximatif en OKLCH */
  
  /* Noir doux au lieu de #000 */
  --color-black: oklch(8% 0 0); /* Gris très foncé au lieu de noir pur */
  
  /* Palette base ajustée pour light mode */
  --color-base-50: oklch(98.5% 0.005 85); /* #FAF9F6 - fond principal */
  --color-base-100: oklch(96% 0.005 85); /* Légèrement plus foncé */
  --color-base-200: oklch(91% 0.005 85);
  --color-base-300: oklch(85% 0.005 85);
  --color-base-400: oklch(78% 0.005 85);
  --color-base-500: oklch(63% 0.005 85);
  --color-base-600: oklch(54% 0.005 85);
  --color-base-700: oklch(46% 0.005 85);
  --color-base-800: oklch(35% 0.005 85);
  --color-base-900: oklch(20% 0.005 85); /* Texte principal - pas noir pur */
  --color-base-950: oklch(12% 0.005 85); /* Texte très foncé - pas noir pur */
  
  /* Palette accent reste identique (vert olive) */
  /* ... */
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    /* Inversion intelligente de la palette */
    --color-white: oklch(12% 0.005 85); /* Fond sombre */
    --color-black: oklch(98.5% 0.005 85); /* Texte clair */
    
    /* Base palette inversée */
    --color-base-50: oklch(12% 0.005 85); /* Fond très sombre */
    --color-base-100: oklch(15% 0.005 85);
    --color-base-200: oklch(20% 0.005 85);
    --color-base-300: oklch(25% 0.005 85);
    --color-base-400: oklch(35% 0.005 85);
    --color-base-500: oklch(50% 0.005 85);
    --color-base-600: oklch(65% 0.005 85);
    --color-base-700: oklch(75% 0.005 85);
    --color-base-800: oklch(85% 0.005 85);
    --color-base-900: oklch(95% 0.005 85); /* Texte clair */
    --color-base-950: oklch(98.5% 0.005 85); /* Texte très clair */
    
    /* Accent - légèrement ajusté pour dark mode */
    --color-accent-50: oklch(20% 0.015 158.25);
    --color-accent-100: oklch(25% 0.032 155.36);
    /* ... ajuster les autres nuances */
  }
}

/* Classe pour forcer dark mode */
.dark {
  /* Mêmes valeurs que prefers-color-scheme: dark */
}
```

**Fichiers à modifier :**
- `src/styles/global.css` - Ajouter les variables dark mode

**Estimation :** 2-3 heures
- Conversion #FAF9F6 en OKLCH précis
- Ajustement de toute la palette base
- Tests de contraste pour accessibilité

---

#### 1.2 Création d'un composant ThemeToggle

**Nouveau fichier : `src/components/global/ThemeToggle.astro`**

```astro
---
// Composant pour basculer entre light/dark mode
// Stocke la préférence dans localStorage
// Respecte prefers-color-scheme par défaut
---

<button
  id="theme-toggle"
  class="theme-toggle-button"
  aria-label="Toggle dark mode"
>
  <!-- Icône soleil pour light mode -->
  <!-- Icône lune pour dark mode -->
</button>

<script>
  // Logique de toggle avec localStorage
  // Détection de prefers-color-scheme
  // Application de la classe .dark sur <html>
</script>
```

**Fichiers à créer :**
- `src/components/global/ThemeToggle.astro`

**Estimation :** 1-2 heures
- Composant toggle avec icônes SVG
- Logique JavaScript pour persistance
- Gestion des préférences système

---

#### 1.3 Intégration dans la navigation

**Modifications à apporter :**
- `src/components/navigation/Navigation.astro`
  - Ajouter `<ThemeToggle />` dans le menu burger
  - Positionner près des autres contrôles

**Estimation :** 30 minutes

---

#### 1.4 Remplacement des couleurs hardcodées

**Recherche et remplacement :**

1. **`bg-white` → `bg-base-50`** (nouveau blanc chaud)
   - Fichiers concernés : ~50+ occurrences
   - Composants : forms, cards, modals, etc.

2. **`text-white` → `text-base-950`** (dans dark mode)
   - Utiliser des classes conditionnelles ou variables CSS

3. **`bg-black` → `bg-base-900`** (gris très foncé)
   - Fichiers concernés : boutons, éléments sombres

4. **`text-black` → `text-base-900`** (gris très foncé)
   - Fichiers concernés : textes

5. **Couleurs hexadécimales hardcodées**
   - Rechercher `#fff`, `#FFF`, `#000`, `rgb(255`, `rgb(0`
   - Remplacer par les variables de palette

**Fichiers principaux à modifier :**
- `src/layouts/BaseLayout.astro` - `bg-white` → `bg-base-50`
- Tous les composants avec `bg-white` ou `text-white`
- Formulaires, modals, cartes

**Estimation :** 4-6 heures
- Recherche systématique
- Remplacement avec vérification visuelle
- Tests sur chaque composant

---

#### 1.5 Ajustements spécifiques par composant

**Composants nécessitant des ajustements spéciaux :**

1. **Images et logos**
   - `src/components/global/Logo.astro`
   - Adapter les logos pour dark mode (peut nécessiter des variantes)

2. **Code blocks (Shiki)**
   - Variables déjà définies dans `global.css`
   - Vérifier l'adaptation dark mode

3. **Gradients**
   - `src/lib/utils/gradients.ts`
   - Adapter les gradients pour dark mode si nécessaire

4. **Borders et shadows**
   - Ajuster les opacités pour dark mode
   - `--shadow-hover` dans `global.css`

**Estimation :** 2-3 heures

---

#### 1.6 Tests et validation

**Checklist de tests :**
- [ ] Toggle fonctionne correctement
- [ ] Préférence sauvegardée dans localStorage
- [ ] Respect de `prefers-color-scheme` au premier chargement
- [ ] Tous les composants s'affichent correctement en dark mode
- [ ] Contraste suffisant pour accessibilité (WCAG AA minimum)
- [ ] Images/logos adaptés
- [ ] Formulaires lisibles
- [ ] Modals et overlays corrects
- [ ] Navigation claire
- [ ] Pas de flash de contenu incorrect (FOUC)

**Estimation :** 2-3 heures

---

### Phase 2 : Optimisations et polish

#### 2.1 Transitions fluides
- Ajouter `transition-colors` sur les éléments qui changent
- Éviter les transitions trop rapides/lentes

**Estimation :** 1 heure

#### 2.2 Documentation
- Documenter la nouvelle palette dans `designsystem.md`
- Ajouter des exemples dark mode

**Estimation :** 1 heure

---

### 📊 Estimation totale Dark Mode

| Phase | Temps estimé |
|-------|-------------|
| Configuration palette | 2-3h |
| Composant ThemeToggle | 1-2h |
| Intégration navigation | 0.5h |
| Remplacement couleurs | 4-6h |
| Ajustements composants | 2-3h |
| Tests et validation | 2-3h |
| Optimisations | 1h |
| Documentation | 1h |
| **TOTAL** | **13-20 heures** |

---

## 📱 PWA (Progressive Web App)

### Objectifs
- Rendre le site installable sur mobile et desktop
- Fonctionner offline (cache des assets statiques)
- Expérience native-like
- Support des notifications push (optionnel)

### Phase 1 : Configuration de base

#### 1.1 Création du manifest.json

**Nouveau fichier : `public/manifest.json`**

```json
{
  "name": "readme.club - Xteink Community Hub",
  "short_name": "readme.club",
  "description": "Community-driven resource sharing for Xteink users",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF9F6",
  "theme_color": "#606c38",
  "orientation": "any",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "productivity"],
  "screenshots": [],
  "shortcuts": [
    {
      "name": "Resources",
      "short_name": "Resources",
      "description": "Browse community resources",
      "url": "/resources",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "News",
      "short_name": "News",
      "description": "Latest updates",
      "url": "/news",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

**Fichiers à créer :**
- `public/manifest.json`

**Estimation :** 1 heure
- Configuration du manifest
- Définition des shortcuts

---

#### 1.2 Génération des icônes PWA

**Icônes nécessaires :**
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `apple-touch-icon.png` (180x180px) - déjà présent
- `favicon.ico` - déjà présent

**Options :**
1. Utiliser l'icône existante (`public/icon.svg`)
2. Générer les PNG à partir du SVG
3. Créer des variantes pour dark mode si nécessaire

**Script à créer : `scripts/generate-pwa-icons.ts`**
- Convertir SVG en PNG aux différentes tailles
- Utiliser `sharp` (déjà dans les dépendances)

**Estimation :** 1-2 heures
- Script de génération
- Génération des icônes
- Tests sur différents appareils

---

#### 1.3 Création du Service Worker

**Nouveau fichier : `public/sw.js` ou `src/pages/sw.js`**

**Stratégie de cache :**
- **Cache First** : Assets statiques (CSS, JS, images, fonts)
- **Network First** : Pages HTML (pour avoir le contenu à jour)
- **Stale While Revalidate** : API calls, données dynamiques

**Fonctionnalités :**
- Installation automatique
- Cache des assets au premier chargement
- Mise à jour du cache en arrière-plan
- Gestion des versions de cache

**Fichiers à créer :**
- `public/sw.js` ou `src/pages/sw.js`
- `src/lib/pwa/service-worker.ts` (logique TypeScript)

**Estimation :** 3-4 heures
- Configuration du service worker
- Stratégies de cache
- Gestion des mises à jour
- Tests offline

---

#### 1.4 Intégration dans Astro

**Modifications à apporter :**

1. **`src/layouts/BaseLayout.astro`**
   - Ajouter `<link rel="manifest" href="/manifest.json">`
   - Ajouter meta tags pour iOS/Android
   - Enregistrer le service worker

2. **Meta tags PWA :**
```html
<meta name="theme-color" content="#606c38">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="readme.club">
```

**Fichiers à modifier :**
- `src/layouts/BaseLayout.astro`
- `src/components/fundations/head/BaseHead.astro`

**Estimation :** 1 heure

---

### Phase 2 : Fonctionnalités avancées (optionnel)

#### 2.1 Notifications push PWA ⭐

**Qu'est-ce que c'est ?**
Les notifications push PWA sont des notifications natives du navigateur qui apparaissent même quand l'utilisateur n'est pas sur le site. Elles sont différentes des emails Resend :
- **Emails Resend** : Envoyés par email (déjà implémenté)
- **Notifications push PWA** : Notifications natives du système d'exploitation (à implémenter)

**Cas d'usage pour readme.club :**
- Nouvelle ressource publiée
- Nouvelle news importante
- Nouveau wallpaper ajouté
- Mise à jour importante du site

**Architecture nécessaire :**

1. **Service Worker avec gestion des notifications**
   - Écouter les événements `push` du navigateur
   - Afficher les notifications même quand le site est fermé
   - Gérer les clics sur les notifications

2. **Backend pour envoyer les notifications**
   - API endpoint pour déclencher les notifications
   - Stockage des subscriptions (tokens push) dans Supabase
   - Intégration avec les événements existants (nouvelle ressource, news, etc.)

3. **Interface utilisateur**
   - Bouton "Activer les notifications" dans les paramètres
   - Gestion des permissions navigateur
   - Préférences utilisateur (types de notifications)

4. **Intégration avec Supabase**
   - Table `push_subscriptions` pour stocker les tokens
   - Fonction serverless ou cron pour envoyer les notifications
   - Webhook ou trigger sur création de ressource/news

**Fichiers à créer/modifier :**
- `src/lib/pwa/push-notifications.ts` - Logique côté client
- `src/pages/api/push/subscribe.ts` - API pour enregistrer les subscriptions
- `src/pages/api/push/send.ts` - API pour envoyer les notifications (admin)
- `supabase/migrations/006_create_push_subscriptions.sql` - Table pour stocker les subscriptions
- `public/sw.js` - Service worker avec gestion push
- `src/components/tools/dashboard/Settings.astro` - UI pour activer/désactiver

**Dépendances à ajouter :**
- Aucune nouvelle dépendance nécessaire (Web Push API native)
- Utiliser Supabase pour stocker les subscriptions

**Estimation détaillée :**
- Service Worker push : 2-3h
- API subscribe/unsubscribe : 1-2h
- Interface utilisateur : 1-2h
- Intégration avec événements existants : 1-2h
- Tests et debugging : 1-2h
- **TOTAL : 6-11 heures**

**Note importante :**
Les notifications push nécessitent HTTPS (déjà géré par Vercel) et fonctionnent mieux sur Chrome/Edge/Firefox. Safari iOS a un support limité.

#### 2.2 Installation prompt
- Détecter si l'app peut être installée
- Afficher un prompt personnalisé
- Gérer les événements d'installation

**Estimation :** 2-3 heures

#### 2.3 Offline page
- Page personnalisée quand offline
- Liste des pages en cache
- Option pour retenter la connexion

**Estimation :** 1-2 heures

---

### Phase 3 : Tests et optimisation

#### 3.1 Tests multi-plateformes
- Chrome/Edge (Desktop)
- Safari (Desktop + iOS)
- Firefox (Desktop)
- Chrome Mobile (Android)
- Tests d'installation
- Tests offline

**Estimation :** 2-3 heures

#### 3.2 Optimisations
- Compression des assets
- Lazy loading du service worker
- Gestion de la taille du cache
- Nettoyage des anciens caches

**Estimation :** 1-2 heures

---

### 📊 Estimation totale PWA

| Phase | Temps estimé |
|-------|-------------|
| Manifest.json | 1h |
| Génération icônes | 1-2h |
| Service Worker | 3-4h |
| Intégration Astro | 1h |
| Tests multi-plateformes | 2-3h |
| Optimisations | 1-2h |
| **TOTAL (base)** | **9-13 heures** |
| **+ Notifications push PWA** | **+6-11h** ⭐ |
| **+ Installation prompt** | **+2-3h** |
| **+ Offline page** | **+1-2h** |

---

## 🎯 Plan d'action recommandé

### Priorité 1 : Dark Mode (13-20h)
1. Configuration palette (2-3h)
2. Composant ThemeToggle (1-2h)
3. Remplacement couleurs (4-6h)
4. Tests (2-3h)

### Priorité 2 : PWA Base (9-13h)
1. Manifest + icônes (2-3h)
2. Service Worker (3-4h)
3. Intégration (1h)
4. Tests (2-3h)

### Priorité 3 : PWA Avancé (optionnel)
- **Notifications push PWA** ⭐ (6-11h) - Notifications natives du navigateur
- Installation prompt (2-3h)
- Offline page (1-2h)

---

## 📝 Notes importantes

### Dark Mode
- **Contraste** : S'assurer que tous les textes respectent WCAG AA (ratio 4.5:1 minimum)
- **Images** : Certaines images peuvent nécessiter des variantes dark mode
- **Performance** : Les transitions de couleur peuvent impacter les performances sur mobile
- **Accessibilité** : Toujours permettre à l'utilisateur de choisir (toggle)

### PWA
- **HTTPS requis** : Les PWA nécessitent HTTPS en production (Vercel le gère)
- **Service Worker** : Peut être complexe à déboguer
- **Cache** : Gérer la taille du cache pour éviter de remplir l'espace disque
- **Mises à jour** : Stratégie claire pour les mises à jour de contenu
- **Notifications push** : Nécessitent une clé VAPID (à générer), fonctionnent mieux sur Chrome/Edge/Firefox, support limité sur Safari iOS

---

## 🚀 Démarrage rapide

### Dark Mode
1. Commencer par `src/styles/global.css`
2. Créer le composant `ThemeToggle`
3. Tester sur une page simple
4. Étendre progressivement

### PWA
1. Créer `manifest.json`
2. Générer les icônes
3. Créer un service worker basique
4. Tester l'installation sur Chrome
5. Étendre les fonctionnalités
