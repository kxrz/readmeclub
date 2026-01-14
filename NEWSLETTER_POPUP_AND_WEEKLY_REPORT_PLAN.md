# Plan : Newsletter Popup + Rapport Hebdomadaire

## 🎯 Objectifs

1. **Popup d'invitation à la newsletter** : Afficher une notification de temps en temps pour inviter les visiteurs à s'inscrire
2. **Rapport hebdomadaire** : Générer un rapport des nouveautés de la semaine pour préparer la newsletter

---

## 📢 Partie 1 : Popup d'invitation à la newsletter

### Objectifs
- Afficher une popup/modal de manière non intrusive
- Respecter les préférences utilisateur (ne pas spammer)
- Design moderne et adaptatif (dark mode)
- Intégration avec le système existant (`/api/newsletter/subscribe`)

### Phase 1 : Composant NewsletterPopup

#### 1.1 Création du composant

**Nouveau fichier : `src/components/newsletter/NewsletterPopup.astro`**

**Fonctionnalités :**
- Modal/popup avec design moderne
- Formulaire d'inscription intégré
- Gestion du localStorage pour éviter le spam :
  - `newsletter_popup_dismissed` : date de dernière fermeture
  - `newsletter_popup_subscribed` : si l'utilisateur s'est déjà inscrit
- Affichage conditionnel :
  - Ne pas afficher si déjà inscrit
  - Ne pas afficher si fermé récemment (ex: dans les 7 derniers jours)
  - Afficher après X secondes sur la page ou après scroll
- Support dark mode
- Animation d'entrée/sortie fluide

**Estimation :** 2-3 heures

#### 1.2 Intégration dans BaseLayout

**Modifications à apporter :**
- `src/layouts/BaseLayout.astro`
  - Ajouter `<NewsletterPopup />` à la fin du layout
  - Script pour gérer l'affichage conditionnel

**Estimation :** 30 minutes

#### 1.3 Personnalisation et tests

- Tests sur différentes pages
- Ajustement des délais d'affichage
- Tests de localStorage
- Vérification dark mode

**Estimation :** 1 heure

**TOTAL Partie 1 : 3.5-4.5 heures**

---

## 📊 Partie 2 : Rapport hebdomadaire

### Objectifs
- Générer un rapport automatique des nouveautés de la semaine
- Format facilement copiable pour préparer la newsletter
- Inclure : nouvelles ressources, news, wallpapers
- Page admin accessible

### Phase 1 : API de génération du rapport

#### 1.1 Création de l'endpoint API

**Nouveau fichier : `src/pages/api/admin/newsletter/weekly-report.ts`**

**Fonctionnalités :**
- Requête Supabase pour récupérer les nouveautés de la semaine :
  - **Ressources** : `created_at >= NOW() - INTERVAL '7 days'` et `status = 'approved'` et `hidden = false`
  - **News** : `published_at >= NOW() - INTERVAL '7 days'` et `status = 'published'` et `hidden = false`
  - **Wallpapers** : `created_at >= NOW() - INTERVAL '7 days'` et `status = 'published'` et `hidden = false`
- Formatage des données pour la newsletter
- Statistiques de la semaine (nombre total par type)
- Retour JSON structuré

**Estimation :** 2-3 heures

#### 1.2 Page admin pour visualiser le rapport

**Nouveau fichier : `src/pages/admin/newsletter-report.astro`**

**Fonctionnalités :**
- Page admin protégée (même système que les autres pages admin)
- Affichage du rapport hebdomadaire :
  - Période (date de début et fin)
  - Statistiques (X ressources, Y news, Z wallpapers)
  - Liste détaillée de chaque nouveauté avec :
    - Titre
    - Description/excerpt
    - Lien direct
    - Date de publication
    - Type/catégorie
- Format markdown prêt à copier pour la newsletter
- Bouton "Copier le rapport" pour copier le contenu formaté
- Option pour sélectionner une période personnalisée (pas seulement cette semaine)

**Estimation :** 3-4 heures

#### 1.3 Formatage pour newsletter

**Format suggéré :**

```markdown
# Newsletter - Semaine du [DATE] au [DATE]

## 📊 Statistiques
- X nouvelles ressources
- Y articles publiés
- Z nouveaux wallpapers

## 🛠️ Nouvelles ressources

### [Titre] - [Type]
[Description]
👉 [Lien]

## 📰 Actualités

### [Titre]
[Excerpt]
👉 [Lien]

## 🖼️ Nouveaux wallpapers

### [Titre] - [Catégorie]
Par [Auteur]
👉 [Lien]
```

**Estimation :** 1-2 heures

**TOTAL Partie 2 : 6-9 heures**

---

## 🎨 Détails techniques

### NewsletterPopup - Stratégie d'affichage

**Options d'affichage :**
1. **Après délai** : Afficher après 30-60 secondes sur la page
2. **Après scroll** : Afficher après avoir scrollé 50-70% de la page
3. **Sur sortie** : Afficher quand la souris quitte la fenêtre (exit intent)
4. **Combinaison** : Utiliser plusieurs déclencheurs avec priorité

**Gestion localStorage :**
```javascript
// Vérifier si on doit afficher
const lastDismissed = localStorage.getItem('newsletter_popup_dismissed');
const subscribed = localStorage.getItem('newsletter_popup_subscribed');
const daysSinceDismissed = lastDismissed ? (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : Infinity;

if (subscribed === 'true' || daysSinceDismissed < 7) {
  // Ne pas afficher
} else {
  // Afficher après conditions
}
```

### Rapport hebdomadaire - Requêtes SQL

**Ressources :**
```sql
SELECT * FROM resources 
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND status = 'approved'
  AND hidden = false
ORDER BY created_at DESC;
```

**News :**
```sql
SELECT * FROM news 
WHERE published_at >= NOW() - INTERVAL '7 days'
  AND status = 'published'
  AND hidden = false
ORDER BY published_at DESC;
```

**Wallpapers :**
```sql
SELECT * FROM wallpapers 
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND status = 'published'
  AND hidden = false
ORDER BY created_at DESC;
```

---

## 📋 Checklist d'implémentation

### NewsletterPopup
- [ ] Créer le composant avec design moderne
- [ ] Implémenter la gestion localStorage
- [ ] Ajouter les animations d'entrée/sortie
- [ ] Intégrer le formulaire d'inscription existant
- [ ] Support dark mode
- [ ] Tests sur différentes pages
- [ ] Ajuster les délais d'affichage

### Rapport hebdomadaire
- [ ] Créer l'endpoint API `/api/admin/newsletter/weekly-report`
- [ ] Créer la page admin `/admin/newsletter-report`
- [ ] Implémenter les requêtes Supabase
- [ ] Formater les données pour la newsletter
- [ ] Ajouter le bouton "Copier le rapport"
- [ ] Ajouter option période personnalisée
- [ ] Tests avec différentes périodes

---

## 📊 Estimation totale

| Tâche | Temps estimé |
|-------|-------------|
| NewsletterPopup composant | 2-3h |
| Intégration BaseLayout | 0.5h |
| Tests et ajustements | 1h |
| API weekly-report | 2-3h |
| Page admin rapport | 3-4h |
| Formatage newsletter | 1-2h |
| **TOTAL** | **9.5-13.5 heures** |

---

## 🚀 Démarrage rapide

### Ordre recommandé :
1. **NewsletterPopup** (3.5-4.5h)
   - Créer le composant
   - Intégrer dans BaseLayout
   - Tester et ajuster

2. **Rapport hebdomadaire** (6-9h)
   - Créer l'API endpoint
   - Créer la page admin
   - Formater pour newsletter

---

## 💡 Améliorations futures (optionnel)

- **Rapport automatique par email** : Envoyer le rapport directement par email chaque semaine
- **Templates de newsletter** : Générer directement le HTML de la newsletter
- **Analytics** : Suivre les conversions du popup (taux de clic, inscriptions)
- **A/B testing** : Tester différents designs/messages du popup
- **Personnalisation** : Différents messages selon la page visitée (ressources, news, etc.)
