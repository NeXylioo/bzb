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

| Section | Auto | Service |
|---|---|---|
| Hero | ✓ | ✓ |
| Trois arguments numérotés | ✓ | ✓ |
| Prestations | Cartes tarifaires, **prix affichés** | Cartes photo, prix sur demande |
| Secteurs | — | Liste éditoriale numérotée |
| Protocole | Piste horizontale qui se glisse à la souris | idem |
| Réalisations | Galerie dans la même piste | idem |
| Passerelle vers l'autre activité | ✓ | ✓ |
| Appel + Contact | ✓ | ✓ |

Les tarifs ne figurent que sur la page Auto : ils se règlent dans le bloc `.tariffs` d'`auto.html`. Côté Service, le prix dépend des locaux et se donne au téléphone.

## À personnaliser en priorité

| Élément | Où le modifier |
|---|---|
| **Numéro de téléphone** | Les trois fichiers HTML : `+33776690722` (le lien) et `07 76 69 07 22` (l'affichage) |
| **Logo** | Reconstruit en texte : `.logo__lockup` (BLV, le L en or serif, « Wash » dessous). Pour poser le vrai fichier, remplacez le contenu de `.logo__lockup` par `<img src="assets/img/logo.png" alt="BLV WASH">` |
| Email `oscar.bellavia2026@outlook.fr` | Les trois fichiers HTML et `js/main.js` |
| Secteur (57 / 54 / Luxembourg) | Section Contact et pied de page de chaque page |
| Réseaux sociaux | Pied de page — Instagram et TikTok pointent sur `@blvwash` |
| Couleurs | Variables CSS en tête de `css/style.css` (`:root`) |

### Thème

Le site est sombre. Une seule couleur d'accent le pilote :

```css
--accent: #d4a24c;        /* or : liens, libellés, boutons, chiffres */
--accent-light: #e8c87a;  /* haut des dégradés (prix, L du logo) */
--accent-strong: #b8862f; /* bas des dégradés, survol des boutons */
--on-accent: #0b0b0e;     /* texte posé SUR l'or : il doit rester sombre */
```

Changer `--accent` suffit à retourner tout le site. Attention à `--on-accent` : l'or étant clair, le texte posé dessus est sombre. Si vous passez sur une teinte foncée, il devra redevenir blanc. Les fonds vont de `--ink-950` (le plus sombre, fond de page) à `--ink-700`, et les sections alternent entre `--ink-950` et `--ink-900` via la classe `section--alt`.

Police unique : **Inter**, chargée depuis Google Fonts.

### Photos

Les photos (`assets/img/`) proviennent d'[Unsplash](https://unsplash.com/license) — licence libre, usage commercial autorisé. **Remplacez-les par les vôtres** en gardant les mêmes noms de fichiers.

| Fichier | Usage | Format conseillé |
|---|---|---|
| `split-auto.jpg`, `split-service.jpg` | Les deux moitiés de l'accueil | portrait ou carré ~1600px |
| `hero.jpg` | Hero de la page Auto | paysage ~1920px |
| `srv-hero.jpg` | Hero de la page Service | paysage ~1920px |
| `fx-int-basic.jpg`, `fx-int-royal.jpg`, `fx-ext.jpg`, `fx-abo.jpg` | Cartes tarifaires Auto | paysage 16:10 ~1400px |
| `srv-vitres.jpg`, `srv-bureaux.jpg`, `srv-cuisine.jpg`, `service-ext.jpg`, `s4.jpg`, `s1.jpg` | Cartes de prestation Service | paysage 4:3 ~1400px |
| `v1`–`v6.jpg` | Galerie Auto | paysage ~1100px |
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
