# BLV WASH — Site vitrine

Site vitrine professionnel pour **BLV WASH** : lavage automobile (intérieur / extérieur, detailing) et nettoyage extérieur (terrasses, façades, toitures, allées).

## Aperçu

Site statique en HTML / CSS / JavaScript pur — aucun framework, aucune dépendance à installer. Il peut être hébergé n'importe où (GitHub Pages, Netlify, Vercel, OVH, o2switch…).

### Sections

- **Accueil** — hero animé avec illustration, statistiques et appels à l'action
- **Services** — lavage auto & nettoyage extérieur détaillés
- **Méthode** — le parcours client en 4 étapes
- **Tarifs** — grilles à onglets (auto / extérieurs) avec 3 formules chacune
- **Réalisations** — comparateurs avant / après interactifs (curseur)
- **Avis clients** — témoignages
- **FAQ** — questions fréquentes (accordéon)
- **Contact** — coordonnées + formulaire de demande de devis
- Design responsive (mobile / tablette / desktop), animations au scroll, menu mobile

## Lancer le site en local

Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
npx serve .
# ou
python3 -m http.server 8000
```

## Publier sur GitHub Pages

1. Dépôt → **Settings** → **Pages**
2. Source : *Deploy from a branch*, branche `main` (ou la branche de votre choix), dossier `/ (root)`
3. Le site sera disponible à `https://<utilisateur>.github.io/<repo>/`

## Personnalisation

Tout le contenu à adapter est dans `index.html` :

| Élément | Où le modifier |
|---|---|
| Téléphone `06 00 00 00 00` | Rechercher `+33600000000` et `06 00 00 00 00` |
| Email `contact@blvwash.fr` | Rechercher `contact@blvwash.fr` (aussi dans `js/main.js`) |
| Zone d'intervention | Section Contact (`#contact`) |
| Tarifs et formules | Section Tarifs (`#tarifs`) |
| Avis clients | Section Avis (`#avis`) |
| Réseaux sociaux | Footer (liens `#` à remplacer par vos URLs) |
| Couleurs / thème | Variables CSS en tête de `css/style.css` (`:root`) |

### Photos avant / après

La section Réalisations utilise des illustrations SVG en attendant vos vraies photos. Pour les remplacer, insérez deux `<img>` (avant / après) dans chaque bloc `.ba__side` à la place des `<svg>`.

### Formulaire de contact

Par défaut, le formulaire ouvre le client mail du visiteur avec la demande pré-remplie (`mailto:`). Pour un envoi direct sans client mail, branchez un service gratuit type [Web3Forms](https://web3forms.com) ou [Formspree](https://formspree.io) dans `js/main.js` (le point d'accroche est commenté).

## Structure

```
├── index.html      # Page unique du site
├── css/style.css   # Styles (variables, composants, responsive)
└── js/main.js      # Interactions (menu, onglets, avant/après, formulaire…)
```
