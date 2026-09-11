# BLV WASH — Site vitrine

Site vitrine pour **BLV WASH**, organisé autour de deux activités :

- **BLV Wash Auto** — lavage et detailing automobile, réalisés **à domicile**
- **BLV Wash Service** — nettoyage de locaux professionnels (entreprises, commerces, restauration)

Site statique en HTML / CSS / JavaScript pur : aucun framework, aucune dépendance à installer. Il s'héberge n'importe où (GitHub Pages, Netlify, Vercel, OVH, o2switch…).

## Structure

```
index.html      # Accueil : l'écran coupé en deux, on choisit son univers
auto.html       # BLV Wash Auto
service.html    # BLV Wash Service
css/style.css   # Feuille de style commune aux trois pages
js/main.js      # Script commun aux trois pages
assets/img/     # Photos
```

Les trois pages partagent la même feuille de style et le même script. Chaque bloc du JavaScript sort de lui-même si son élément n'existe pas sur la page courante : l'accueil n'a ni navigation, ni formulaire, ni carrousel, et le script ne s'en plaint pas.

### L'accueil

L'accueil ne fait qu'une chose : proposer le choix entre les deux activités. Deux moitiés plein écran, chacune avec sa photo, qui s'élargissent au survol. On clique, on entre dans l'univers correspondant.

### Les pages d'activité

Les deux pages suivent le même squelette :

| Section | Contenu |
|---|---|
| Hero | Photo plein cadre, accroche, appel au téléphone |
| Intention | Une phrase forte, puis trois arguments |
| Prestations | Cartes photo, chacune avec son détail |
| Secteurs / Zone | Liste éditoriale numérotée |
| Protocole | Étapes dans une piste horizontale qui se glisse à la souris |
| Réalisations | Galerie dans la même piste horizontale |
| Passerelle | Renvoi vers l'autre activité |
| Appel | Bandeau photo avec le numéro |
| Contact | Coordonnées + formulaire |

## À personnaliser en priorité

| Élément | Où le modifier |
|---|---|
| **Numéro de téléphone** | Les trois fichiers HTML : rechercher `+33612345678` (le lien) et `06 12 34 56 78` (l'affichage) |
| **Logo** | Les `<svg class="logo__mark">` dans l'en-tête et le pied de page, plus le `<link rel="icon">`. Pour un fichier image, remplacez le `<svg>` par `<img src="assets/img/logo.svg" alt="BLV WASH">` |
| Email `contact@blvwash.fr` | Les trois fichiers HTML et `js/main.js` |
| Zone d'intervention | Section Contact de chaque page |
| Réseaux sociaux | Pied de page (liens `#` à remplacer par vos URLs) |
| Couleurs | Variables CSS en tête de `css/style.css` (`:root`) |

### Thème

Le site est sombre. Une seule couleur d'accent le pilote :

```css
--accent: #4b8dff;        /* liens, libellés, boutons */
--accent-strong: #2f6ae0; /* survol des boutons */
```

Changer `--accent` suffit à retourner tout le site. Les fonds vont de `--ink-950` (le plus sombre, fond de page) à `--ink-700`, et les sections alternent entre `--ink-950` et `--ink-900` via la classe `section--alt`.

Police unique : **Inter**, chargée depuis Google Fonts.

### Photos

Les photos (`assets/img/`) proviennent d'[Unsplash](https://unsplash.com/license) — licence libre, usage commercial autorisé. **Remplacez-les par les vôtres** en gardant les mêmes noms de fichiers.

| Fichier | Usage | Format conseillé |
|---|---|---|
| `split-auto.jpg`, `split-service.jpg` | Les deux moitiés de l'accueil | portrait ou carré ~1600px |
| `hero.jpg` | Hero de la page Auto | paysage ~1920px |
| `srv-hero.jpg` | Hero de la page Service | paysage ~1920px |
| `service-auto.jpg`, `auto-int.jpg`, `g5.jpg` | Cartes de prestation Auto | paysage 4:3 ~1400px |
| `srv-vitres.jpg`, `srv-bureaux.jpg`, `srv-cuisine.jpg`, `service-ext.jpg`, `s4.jpg`, `s1.jpg` | Cartes de prestation Service | paysage 4:3 ~1400px |
| `g1`–`g7.jpg` | Galerie Auto | paysage ~900px |
| `s1`–`s5.jpg` | Galerie Service | paysage ~900px |
| `cta.jpg` | Bandeau d'appel | paysage ~1600px |

Les photos sont désaturées et assombries par le CSS pour tenir ensemble malgré des origines différentes. Elles reprennent leurs couleurs au survol. Si vous mettez vos propres photos et que ce traitement ne vous plaît pas, les filtres se règlent sur `.card__media img`, `.shot img` et `.split__media img`.

### Formulaire de contact

Par défaut, le formulaire ouvre le client mail du visiteur avec la demande pré-remplie (`mailto:`). L'objet du message indique de quelle branche vient la demande, via l'attribut `data-branch` du formulaire.

Pour un envoi direct sans client mail, branchez un service gratuit type [Web3Forms](https://web3forms.com) ou [Formspree](https://formspree.io) dans `js/main.js` — le point d'accroche est commenté.

## Lancer le site en local

Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
npx serve .
# ou
python3 -m http.server 8000
```

## Publier sur GitHub Pages

1. Dépôt → **Settings** → **Pages**
2. Source : *Deploy from a branch*, branche de votre choix, dossier `/ (root)`
3. Le site est servi à `https://<utilisateur>.github.io/<repo>/`
