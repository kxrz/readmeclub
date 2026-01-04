# Design System - Readme.club

Documentation complète du système de design pour réutilisation dans d'autres projets ou applications mobiles.

## 🎨 Identité Visuelle

### Logo & Favicons

**Logo principal :**
- Format SVG : `/public/icon.svg`
- URL : `https://readme.club/icon.svg`

**Favicons disponibles :**
- `/public/favicon.ico` - Favicon principal
- `/public/favicon-16x16.png` - 16x16px
- `/public/favicon-32x32.png` - 32x32px
- `/public/favicon-48x48.png` - 48x48px
- `/public/apple-touch-icon.png` - Apple Touch Icon (180x180px)

**URLs complètes :**
- Logo SVG : `https://readme.club/icon.svg`
- Favicon ICO : `https://readme.club/favicon.ico`
- Favicon 16px : `https://readme.club/favicon-16x16.png`
- Favicon 32px : `https://readme.club/favicon-32x32.png`
- Favicon 48px : `https://readme.club/favicon-48x48.png`
- Apple Touch Icon : `https://readme.club/apple-touch-icon.png`

---

## 🔤 Typographie

### Police de caractères

**Famille :** Inter  
**Source :** Google Fonts / Self-hosted  
**Fichiers locaux :**
- `/public/fonts/inter-400.woff` - Regular (400)
- `/public/fonts/inter-700.woff` - Bold (700)

**URLs :**
- Regular : `https://readme.club/fonts/inter-400.woff`
- Bold : `https://readme.club/fonts/inter-700.woff`

**CSS :**
```css
font-family: "Inter", system-ui, -apple-system, sans-serif;
```

**Features typographiques activées :**
- `liga` - Ligatures standard
- `calt` - Alternates contextuelles
- `dlig` - Ligatures discrétionnaires
- `ss07` - Ponctuation carrée
- `ss08` - Guillemets carrés
- `zero` - Zéro barré
- `tnum` - Chiffres tabulaires
- `cv03` - Six ouvert
- `cv04` - Neuf ouvert
- `cv01` - Un alternatif
- `cv09` - Trois à sommet plat
- `cv02` - Quatre ouvert

### Échelle typographique

#### Variantes Display (Titres)
- **display6XL** : `text-5xl` → `sm:text-7xl` → `md:text-8xl` → `lg:text-[12rem]`
- **display5XL** : `text-5xl` → `sm:text-7xl` → `md:text-8xl` → `lg:text-[10rem]`
- **display4XL** : `text-5xl` → `sm:text-7xl` → `md:text-8xl` → `lg:text-9xl`
- **display3XL** : `text-5xl` → `sm:text-6xl` → `md:text-7xl` → `lg:text-8xl`
- **display2XL** : `text-5xl` → `sm:text-5xl` → `md:text-6xl` → `lg:text-7xl`
- **displayXL** : `text-5xl` → `sm:text-4xl` → `md:text-5xl` → `lg:text-6xl`
- **displayLG** : `text-4xl` → `sm:text-3xl` → `md:text-4xl` → `lg:text-5xl`
- **displayMD** : `text-2xl` → `sm:text-2xl` → `md:text-3xl` → `lg:text-4xl`
- **displaySM** : `text-lg` → `sm:text-xl` → `md:text-2xl` → `lg:text-3xl`
- **displayXS** : `text-base` → `sm:text-lg` → `md:text-xl` → `lg:text-2xl`

#### Variantes Text (Corps de texte)
- **textXL** : `text-lg` → `sm:text-xl` → `md:text-2xl`
- **textLG** : `text-base` → `sm:text-lg` → `md:text-xl`
- **textBase** : `text-base` (16px)
- **textSM** : `text-sm` (14px)
- **textXS** : `text-xs` (12px)

**Tous les styles utilisent :**
- `leading-tight` - Line height serré
- `tracking-tight` - Letter spacing serré

---

## 🎨 Palette de Couleurs

### Couleurs Accent (Vert olive)

Couleur principale de la marque, utilisée pour les actions et éléments interactifs.

| Nom | OKLCH | Usage |
|-----|-------|-------|
| **accent-50** | `oklch(96% 0.015 158.25)` | Fond très clair, hover subtil |
| **accent-100** | `oklch(92.17% 0.032 155.36)` | Fond clair |
| **accent-200** | `oklch(84.4% 0.065 154.46)` | Bordure claire |
| **accent-300** | `oklch(76.02% 0.1 153.86)` | Bordure |
| **accent-400** | `oklch(68.65% 0.13 151.92)` | Texte secondaire |
| **accent-500** | `oklch(56.56% 0.108 151.62)` | **Couleur principale** - Boutons, liens actifs |
| **accent-600** | `oklch(48.31% 0.091 151.89)` | Hover, états actifs |
| **accent-700** | `oklch(39.44% 0.071 152.24)` | Texte sur fond clair |
| **accent-800** | `oklch(31.05% 0.052 151.99)` | Texte foncé |
| **accent-900** | `oklch(20.92% 0.029 154.01)` | Texte très foncé |
| **accent-950** | `oklch(15.3% 0.017 157.97)` | Texte le plus foncé |

**Couleur principale (accent-500) :**
- Hex approximatif : `#606c38` (olive-leaf)
- Usage : Boutons primaires, liens, éléments interactifs

### Couleurs Base (Gris neutres)

Palette de gris pour les textes, fonds et bordures.

| Nom | OKLCH | Usage |
|-----|-------|-------|
| **base-50** | `oklch(0.98 0 0)` | Fond très clair (presque blanc) |
| **base-100** | `oklch(0.96 0 0)` | Fond clair, cartes |
| **base-200** | `oklch(0.91 0 0)` | Bordures légères |
| **base-300** | `oklch(0.85 0 0)` | Bordures |
| **base-400** | `oklch(0.78 0 0)` | Texte secondaire |
| **base-500** | `oklch(0.63 0 0)` | Texte moyen |
| **base-600** | `oklch(0.54 0 0)` | Texte |
| **base-700** | `oklch(0.46 0 0)` | Texte foncé |
| **base-800** | `oklch(0.35 0 0)` | Texte très foncé |
| **base-900** | `oklch(0.25 0 0)` | Texte principal, titres |
| **base-950** | `oklch(0.15 0 0)` | Texte le plus foncé |

**Couleurs utilitaires :**
- **white** : `oklch(99% 0 0)` - Blanc pur
- **black** : `oklch(0 0 0)` - Noir pur
- **transparent** : `oklch(99% 0 0 / 0)` - Transparent

---

## 🌈 Gradients

Collection de gradients élégants basés sur une palette naturelle (olive-leaf, black-forest, cornsilk, sunlit-clay, copperwood).

### Palette de gradients

| ID | From | To | Text Color | Usage |
|----|------|-----|-----------|-------|
| 1 | `#606c38` (olive-leaf) | `#283618` (black-forest) | `#fefae0` (cornsilk) | Gradients sombres |
| 2 | `#fefae0` (cornsilk) | `#dda15e` (sunlit-clay) | `#283618` (black-forest) | Gradients clairs |
| 3 | `#dda15e` (sunlit-clay) | `#bc6c25` (copperwood) | `#fefae0` (cornsilk) | Gradients chauds |
| 4 | `#283618` (black-forest) | `#606c38` (olive-leaf) | `#fefae0` (cornsilk) | Gradients inversés |
| 5 | `#bc6c25` (copperwood) | `#dda15e` (sunlit-clay) | `#fefae0` (cornsilk) | Gradients terreux |
| 6 | `#606c38` (olive-leaf) | `#dda15e` (sunlit-clay) | `#283618` (black-forest) | Gradients naturels |
| 7 | `#283618` (black-forest) | `#bc6c25` (copperwood) | `#fefae0` (cornsilk) | Gradients sombres-chauds |
| 8 | `#fefae0` (cornsilk) | `#606c38` (olive-leaf) | `#283618` (black-forest) | Gradients clairs-verts |
| 9 | `#dda15e` (sunlit-clay) | `#283618` (black-forest) | `#fefae0` (cornsilk) | Gradients contrastés |
| 10 | `#bc6c25` (copperwood) | `#606c38` (olive-leaf) | `#fefae0` (cornsilk) | Gradients terreux-verts |

**Direction :** `135deg` (diagonal)

**CSS :**
```css
background: linear-gradient(135deg, #from 0%, #to 100%);
```

**Palette de couleurs complète :**
- **olive-leaf** : `#606c38`
- **black-forest** : `#283618`
- **cornsilk** : `#fefae0`
- **sunlit-clay** : `#dda15e`
- **copperwood** : `#bc6c25`

---

## 🔘 Composants Boutons

### Variantes

#### Default (Noir)
- **Couleur de fond** : `bg-black` (`#000000`)
- **Couleur de texte** : `text-white`
- **Hover** : `hover:bg-base-800`
- **Focus** : `focus:ring-black`

#### Accent (Vert olive)
- **Couleur de fond** : `bg-accent-500`
- **Couleur de texte** : `text-white`
- **Hover** : `hover:bg-accent-600`
- **Focus** : `focus:ring-accent-600`

#### Muted (Blanc avec bordure)
- **Couleur de fond** : `bg-white`
- **Couleur de texte** : `text-base-700`
- **Bordure** : `ring ring-base-200`
- **Hover** : `hover:text-accent-500`
- **Focus** : `focus:ring-base-500`

#### Ghost (Transparent)
- **Couleur de fond** : `bg-base-50`
- **Couleur de texte** : `text-base-600`
- **Bordure** : `ring ring-base-50`
- **Hover** : `hover:text-black`
- **Focus** : `focus:bg-base-200`

### Tailles

| Taille | Hauteur | Padding Horizontal | Padding Vertical | Taille de texte | Font Weight |
|--------|---------|-------------------|------------------|-----------------|-------------|
| **xs** | `h-8` (32px) | `px-4` (16px) | `py-2` (8px) | `text-xs` (12px) | `font-medium` |
| **sm** | `h-9` (36px) | `px-4` (16px) | `py-2` (8px) | `text-sm` (14px) | `font-medium` |
| **base** | `h-10` (40px) | `px-6` (24px) | `py-3` (12px) | `text-base` (16px) | `font-medium` |
| **md** | `h-11` (44px) | `px-6` (24px) | `py-3` (12px) | `text-base` (16px) | `font-medium` |
| **lg** | `h-12` (48px) | `px-6` (24px) | `py-3` (12px) | `text-base` (16px) | `font-medium` |
| **xl** | `h-14` (56px) | `px-6` (24px) | `py-3` (12px) | `text-lg` (18px) | `font-medium` |

**Styles communs :**
- `rounded-full` - Bordures arrondies complètes
- `transition duration-300` - Transitions fluides
- `focus:ring-2 focus:ring-offset-2` - Anneau de focus
- `cursor-pointer` - Curseur pointeur

---

## 🔗 Composants Liens

### Variantes

#### Default
- **Couleur** : `text-base-600`
- **Hover** : `hover:text-accent-500`
- **Transition** : `transition-colors`

#### Ghost
- **Couleur** : `text-base-600`
- **Fond** : `bg-base-50`
- **Bordure** : `ring-2 ring-base-400`
- **Hover** : `hover:ring-accent-400 hover:bg-accent-50`

**Tailles disponibles :** xs, sm, base, md, lg, xl (mêmes que les boutons)

---

## 📐 Espacements & Layout

### Conteneurs

#### Wrapper Hero
- Padding vertical : `pt-6 pb-24`
- Largeur maximale : Contenu centré
- Usage : Sections hero, en-têtes de page

#### Wrapper Standard
- Padding vertical : `py-6`
- Largeur maximale : Contenu centré
- Usage : Contenu principal, sections standards

### Grilles

#### Grille de ressources (Desktop)
- Mobile : `grid-cols-1`
- Tablet : `md:grid-cols-2`
- Desktop : `xl:grid-cols-3` ou `xl:grid-cols-4`
- Gap : `gap-4`

#### Grille de wallpapers
- Mobile : `grid-cols-2`
- Tablet : `md:grid-cols-3`
- Desktop : `xl:grid-cols-4`
- Large Desktop : `2xl:grid-cols-5`
- Gap : `gap-3 sm:gap-4`

---

## 🎯 États & Interactions

### Hover States

**Boutons :**
- Transition : `transition-all duration-300`
- Scale : `group-hover:scale-105` (pour images)
- Couleur : Changement vers `accent-500` ou `accent-600`

**Cartes :**
- Bordure : `hover:border-accent-300`
- Ombre : `hover:shadow-lg` ou `hover:shadow-xl`
- Scale : `group-hover:scale-105` (pour images)

**Liens :**
- Couleur : `hover:text-accent-500`
- Transition : `transition-colors`

### Focus States

- Ring : `focus:ring-2 focus:ring-offset-2`
- Couleur du ring : Selon la variante (accent ou base)
- Outline : `focus:outline-none`

---

## 📱 Responsive Breakpoints

Basé sur Tailwind CSS :

- **sm** : 640px
- **md** : 768px
- **lg** : 1024px
- **xl** : 1280px
- **2xl** : 1536px

---

## 🎨 Ombres

### Shadow Hover
```css
box-shadow: rgba(0, 0, 0, 0.137) 0px 0px 0px 0px,
            rgba(0, 0, 0, 0.14) 0px 0px 0px 0px,
            rgba(0, 0, 0, 0.165) 0px 0px 0px 0px;
```

**Usage :** Effets hover sur les cartes et éléments interactifs

---

## 🔤 Classes Utilitaires

### Text Utilities

- `text-balance` - Équilibre du texte sur plusieurs lignes
- `line-clamp-1` - Limite à 1 ligne avec ellipsis
- `line-clamp-2` - Limite à 2 lignes avec ellipsis
- `line-clamp-3` - Limite à 3 lignes avec ellipsis

### Layout Utilities

- `flex flex-col` - Flexbox colonne
- `flex items-center` - Alignement vertical centré
- `flex justify-between` - Espacement entre éléments
- `gap-2`, `gap-4`, `gap-6`, `gap-8` - Espacements

### Border & Radius

- `rounded-lg` - Coins arrondis moyens
- `rounded-xl` - Coins arrondis larges
- `rounded-full` - Coins complètement arrondis
- `border border-base-200` - Bordure fine grise

---

## 🌐 URLs & Assets

### Base URL
```
https://readme.club
```

### Assets Principaux

**Logo & Icons :**
- Logo SVG : `https://readme.club/icon.svg`
- Favicon : `https://readme.club/favicon.ico`
- Apple Touch Icon : `https://readme.club/apple-touch-icon.png`

**Fonts :**
- Inter Regular : `https://readme.club/fonts/inter-400.woff`
- Inter Bold : `https://readme.club/fonts/inter-700.woff`

**Images :**
- Avatars : `https://readme.club/images/avatars/[1-10].jpeg`
- Blog : `https://readme.club/images/blog/[1-10].jpg`
- Thumbnails : `https://readme.club/images/thumbnail/[1-20].png`

---

## 📦 Framework & Outils

- **CSS Framework** : Tailwind CSS v4
- **Plugins Tailwind** :
  - `@tailwindcss/forms` - Styles de formulaires
  - `@tailwindcss/typography` - Styles typographiques (prose)
  - `tailwind-scrollbar-hide` - Masquer les scrollbars

---

## 🎯 Guidelines d'Usage

### Couleurs

1. **Accent-500** : Utiliser pour les actions principales (boutons primaires, liens actifs)
2. **Base-900** : Utiliser pour les titres et textes principaux
3. **Base-600** : Utiliser pour les textes secondaires
4. **Base-200** : Utiliser pour les bordures légères
5. **Base-100** : Utiliser pour les fonds de cartes

### Typographie

1. **Display variants** : Uniquement pour les titres principaux (h1)
2. **Text variants** : Pour le corps de texte et sous-titres
3. **Font weight** : `font-medium` pour les titres, `font-semibold` pour l'emphase

### Espacements

1. Utiliser les classes Tailwind standard (`gap-2`, `gap-4`, `gap-6`, etc.)
2. Padding vertical : `py-6` pour les sections standard, `pt-6 pb-24` pour les hero
3. Margin top : `mt-4`, `mt-8`, `mt-12` pour les espacements entre éléments

### Accessibilité

1. Toujours inclure `focus:outline-none` avec `focus:ring-2` pour la visibilité du focus
2. Utiliser des contrastes suffisants (base-900 sur base-50 minimum)
3. Tailles de texte minimum : `text-sm` (14px) pour le texte principal

---

## 📄 Exemples de Code

### Bouton Accent
```html
<button class="h-10 px-6 py-3 text-base font-medium rounded-full bg-accent-500 text-white hover:bg-accent-600 transition-all duration-300 focus:ring-2 focus:ring-accent-600 focus:ring-offset-2 focus:outline-none cursor-pointer">
  Action principale
</button>
```

### Titre Display
```html
<h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight text-base-900 font-medium">
  Titre principal
</h1>
```

### Carte avec hover
```html
<div class="rounded-xl border border-base-200 bg-white overflow-hidden hover:border-accent-300 hover:shadow-xl transition-all">
  <!-- Contenu -->
</div>
```

---

## 🔗 Ressources Externes

- **Inter Font** : [Google Fonts](https://fonts.google.com/specimen/Inter)
- **Tailwind CSS** : [Documentation](https://tailwindcss.com)
- **OKLCH Colors** : [OKLCH Color Picker](https://oklch.com)

---

*Dernière mise à jour : Décembre 2024*
