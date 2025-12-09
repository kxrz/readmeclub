# News API - Guide d'utilisation

{
  "title": "Xteink X4 Community News Digest - Last Days",
  "slug": "xteink-x4-community-news-digest-last-days",
  "excerpt": "Key highlights from r/xteinkereader (Dec 5-9): XTC Converter v2, hub redesign, firmware XT 3.1.0, user arrivals & accessories.",
  "content": "## Tool & Software Updates\n\n- **[XTC Converter Update #2](https://www.reddit.com/r/xteinkereader/comments/1pf8p44/xtc_converter_update2/)** (Dec 5): CREngine for sharper EPUBs, 100+ pages/sec, precise progress. Praised by official Xteink team.\n\n- **[Community Hub Redesign Live](https://www.reddit.com/r/xteinkereader/comments/1pf0xvs/the_hub_is_now_live_with_a_complete_redesign/)** (Dec 5): 5 languages, interactive map, web tools incoming.\n\n## Firmware Releases\n\n- **[XT V3.1.0 Overseas](https://www.reddit.com/r/xteinkereader/comments/1pd12wm/system_update_xt_v310_overseas_version/)** (Dec 3): Better text/fonts, EPUB covers, +15% JPG speed, battery accuracy. Rebuild index recommended.\n\n## User Milestones & Accessories\n\n- **[Finally Ordered Mine](https://www.reddit.com/r/xteinkereader/comments/1pgtues/finally_ordered_mine/)** (Dec 8): Growing hype.\n\n- **[Arrived & Works OOTB](https://www.reddit.com/r/xteinkereader/comments/1pgijkf/arrived_yesterday_works_out_of_the_box/)** (Dec 7): Seamless setup.\n\n- **[Nice Clip Light Found](https://www.reddit.com/r/xteinkereader/comments/1phaxby/found_a_nice_little_clip_light/)** (Dec 8): Accessory share.\n\n- **[New Case Design](https://www.reddit.com/r/xteinkereader/comments/1peyhw1/new_case_design/)** (Dec 5): Community accessory.",[1][2][3][4][5][6][7]
  "status": "published",
  "featured": true
}

[1](https://www.reddit.com/r/xteinkereader/comments/1pf8p44/xtc_converter_update2/)
[2](https://www.reddit.com/r/xteinkereader/comments/1pf0xvs/the_hub_is_now_live_with_a_complete_redesign/)
[3](https://www.reddit.com/r/xteinkereader/comments/1pd12wm/system_update_xt_v310_overseas_version/)
[4](https://www.reddit.com/r/xteinkereader/comments/1pgtues/finally_ordered_mine/)
[5](https://www.reddit.com/r/xteinkereader/comments/1pgijkf/arrived_yesterday_works_out_of_the_box/)
[6](https://www.reddit.com/r/xteinkereader/comments/1phaxby/found_a_nice_little_clip_light/)
[7](https://www.reddit.com/r/xteinkereader/comments/1peyhw1/new_case_design/)

## Exemple d'article JSON

Voir `news-article-example.json` pour un exemple complet.

## Structure d'un article

```json
{
  "title": "Titre de l'article (obligatoire, max 255 caractères)",
  "slug": "titre-de-l-article-en-minuscules-avec-tirets (obligatoire, uniquement lettres minuscules, chiffres et tirets)",
  "excerpt": "Résumé court de l'article (optionnel, max 500 caractères)",
  "content": "## Contenu Markdown\n\nLe contenu de l'article en **Markdown** (obligatoire). Supporte les titres, le texte en gras/italique, les listes, les liens, les blocs de code, etc.",
  "featured_image_url": "https://example.com/image.jpg (optionnel, URL de l'image)",
  "author_name": "Nom de l'auteur (optionnel, max 100 caractères)",
  "author_email": "email@example.com (optionnel, format email valide)",
  "status": "draft|published|archived (par défaut: draft)",
  "featured": true|false (par défaut: false)",
  "published_at": "2025-01-15T10:00:00Z (optionnel, format ISO 8601)"
}
```

## Créer un article (POST)

**Endpoint:** `POST /api/admin/news`

**Headers:**
```
Content-Type: application/json
Cookie: admin_session=authenticated
```

**Body:** JSON avec la structure ci-dessus

**Exemple avec curl:**
```bash
curl -X POST https://readme.club/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=authenticated" \
  -d @examples/news-article-example.json
```

## Modifier un article (PUT)

**Endpoint:** `PUT /api/admin/news/[id]/update`

**Headers:**
```
Content-Type: application/json
Cookie: admin_session=authenticated
```

**Body:** JSON avec les champs à modifier (tous optionnels sauf si requis par la validation)

**Exemple:**
```json
{
  "status": "published",
  "featured": true,
  "published_at": "2025-01-15T10:00:00Z"
}
```

## Supprimer un article (DELETE)

**Endpoint:** `DELETE /api/admin/news/[id]/delete`

**Headers:**
```
Cookie: admin_session=authenticated
```

**Note:** La suppression est "soft delete" (l'article est marqué comme `hidden: true`)

## Interface Admin

Une interface graphique est disponible à `/admin/news` pour :
- Créer de nouveaux articles
- Lister tous les articles
- Modifier les articles existants
- Supprimer des articles

## Notes importantes

1. **Slug:** Doit être unique et en minuscules avec uniquement des lettres, chiffres et tirets
2. **Content:** Accepte du **Markdown** (pas de HTML). Supporte :
   - Titres (`# H1`, `## H2`, etc.)
   - Texte en **gras** et *italique*
   - Listes à puces et numérotées
   - [Liens](https://example.com)
   - Blocs de code avec syntaxe
   - Citations, tableaux, etc.
3. **Published_at:** Si non fourni et que le statut est "published", la date actuelle sera utilisée automatiquement
4. **Featured:** Les articles featured apparaissent en premier dans les listes
5. **Status:** 
   - `draft`: Brouillon (non visible publiquement)
   - `published`: Publié (visible publiquement)
   - `archived`: Archivé (non visible publiquement)

