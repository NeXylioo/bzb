# BLV WASH — Site vitrine

Site vitrine pour **BLV WASH** : lavage automobile (intérieur / extérieur, detailing) et nettoyage extérieur (terrasses, façades, toitures, allées).

## Aperçu

Site statique en HTML / CSS / JavaScript pur — aucun framework, aucune dépendance à installer. Il peut être hébergé n'importe où (GitHub Pages, Netlify, Vercel, OVH, o2switch…).

### Sections

- **Accueil** — hero photo plein écran avec parallaxe, barre d'engagements
- **Bandeau défilant** — marquee des prestations
- **Services** — deux cartes photo : detailing auto & nettoyage extérieur
- **Méthode** — le parcours client en 4 étapes
- **Galerie** — carousel 3D : 7 photos sur un cylindre, rotation à la souris ou au doigt, clic pour agrandir
- **Contact** — téléphone, email, réseaux sociaux + formulaire (les prix ne sont communiqués que sur demande)

Design responsive, apparitions au scroll, barre de progression de lecture, menu mobile.

## À personnaliser en priorité

| Élément | Où le modifier |
|---|---|
| **Numéro de téléphone** | `index.html` : rechercher `+33612345678` (header, hero, footer) et `06 12 34 56 78` pour l'affichage |
| **Logo** | `index.html` : les deux `<svg>` de `.logo__icon` (header et footer) + le `<link rel="icon">` |
| Email `contact@blvwash.fr` | `index.html` et `js/main.js` |
| Zone d'intervention | Section Contact (`#contact`) |
| Réseaux sociaux | Footer (liens `#` à remplacer par vos URLs) |
| Couleurs / thème | Variables CSS en tête de `css/style.css` (`:root`) |

### Thème

Une seule couleur d'accent pilote tout le site, définie dans `:root` :

```css
--accent: #4d8bff;        /* bleu électrique — textes, filets, liens */
--accent-strong: #2a63f0; /* fonds de bouton (contraste suffisant avec du blanc) */
--accent-cyan: #22c7d9;   /* seconde comète du border-beam */
```

Changer `--accent` suffit à retourner tout le site. Attention si vous partez sur une teinte claire : `--on-accent` (le texte posé sur l'accent) est blanc et devra passer en sombre.

Police unique : **Inter**, chargée depuis Google Fonts.

### Photos

Les photos (`assets/img/`) proviennent d'[Unsplash](https://unsplash.com/license) (licence libre, usage commercial autorisé). **Remplacez-les par vos propres photos** en gardant les mêmes noms de fichiers :

| Fichier | Usage | Format conseillé |
|---|---|---|
| `hero.jpg` | Grand fond d'accueil | paysage ~1920px |
| `service-auto.jpg`, `service-ext.jpg` | Cartes services | paysage 16:9 ~1200px |
| `g1.jpg` … `g7.jpg` | Galerie (carousel 3D) | portrait 3:4 ~900px |
| `cta.jpg` | Fond du bandeau d'appel à l'action | paysage ~1600px |

`fondateur.jpg` n'est plus utilisé depuis la suppression de la section « À propos ».

### Formulaire de contact

Par défaut, le formulaire ouvre le client mail du visiteur avec la demande pré-remplie (`mailto:`). Pour un envoi direct sans client mail, branchez un service gratuit type [Web3Forms](https://web3forms.com) ou [Formspree](https://formspree.io) dans `js/main.js` (le point d'accroche est commenté).

## Lancer le site en local

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
# ou
npx serve .
```

## Publier sur GitHub Pages

1. Dépôt → **Settings** → **Pages**
2. Source : *Deploy from a branch*, branche de votre choix, dossier `/ (root)`
3. Le site sera disponible à `https://<utilisateur>.github.io/<repo>/`

## Structure

```
├── index.html      # Page unique du site
├── css/style.css   # Styles (variables, composants, responsive)
└── js/main.js      # Interactions (menu, carousel 3D, formulaire…)
```
