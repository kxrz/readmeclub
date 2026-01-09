# Font Finder - Guide de Setup

## ✅ Ce qui est déjà fait

- ✅ Structure de la page créée (`/[lang]/font-finder`)
- ✅ 5 composants MVP créés
- ✅ Converter Lakafior adapté pour Node.js
- ✅ 3 fonts ebook-fonts copiées (nv-garamond, nv-charter, nv-literata)
- ✅ Dépendances ajoutées au package.json

## 📋 Prochaines étapes

### 1. Télécharger les Google Fonts manquantes

Les fonts suivantes doivent être téléchargées depuis https://fonts.google.com et placées dans `public/fonts/` :

**Priorité haute (déjà dans fonts.ts) :**
- `literata.ttf` - Literata
- `eb-garamond.ttf` - EB Garamond  
- `merriweather.ttf` - Merriweather
- `bitter.ttf` - Bitter
- `lato.ttf` - Lato

**Autres fonts (optionnel pour MVP) :**
- `crimson-text.ttf`, `lora.ttf`, `source-serif-pro.ttf`, `noto-serif.ttf`, etc.

**Comment télécharger :**
1. Aller sur https://fonts.google.com
2. Rechercher la font (ex: "Literata")
3. Cliquer "Download family"
4. Extraire le fichier Regular (ex: `Literata-Regular.ttf`)
5. Renommer et copier dans `public/fonts/` (ex: `literata.ttf`)

### 2. Tester la page

```bash
npm run dev
# Visiter: http://localhost:4321/en/font-finder
```

### 3. Générer les previews (optionnel)

```bash
npm run generate-font-previews
```

Cela génère des images WebP dans `public/previews/` pour chaque font.

### 4. Convertir en BIN (optionnel)

```bash
npm run convert-fonts-to-bin
```

⚠️ **Note**: Le converter nécessite `opentype.js` installé. Si vous avez des erreurs, vérifiez que la dépendance est bien installée.

## 🐛 Dépannage

### Le preview ne s'affiche pas
- Vérifiez que les fonts TTF sont bien dans `public/fonts/`
- Ouvrez la console du navigateur pour voir les erreurs
- Vérifiez que le nom du fichier correspond à `fonts.ts`

### Le converter ne fonctionne pas
- Vérifiez que `opentype.js` est installé : `npm list opentype.js`
- Le converter est une adaptation Node.js, il peut différer légèrement de Lakafior
- Pour un converter exact, utilisez l'outil web de Lakafior : https://lakafior.github.io/xteink/

### Les fonts ne se chargent pas
- Vérifiez les chemins dans `fonts.ts` (doivent correspondre aux fichiers dans `public/fonts/`)
- Vérifiez les permissions des fichiers
- Vérifiez la console du navigateur pour les erreurs 404

## 📝 Notes

- Le MVP fonctionne avec seulement les 3 fonts ebook-fonts déjà copiées
- Les Google Fonts peuvent être ajoutées progressivement
- Le converter BIN est optionnel pour le MVP (le preview fonctionne sans)

