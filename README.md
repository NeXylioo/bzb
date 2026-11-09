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

**Page Auto** : volontairement courte, tout mène à la réservation.

| Section | Contenu |
|---|---|
| Hero | Bouton « Réserver un créneau » |
| Réservation | Le client compose son lavage (prix et durée calculés en direct), puis choisit son créneau et paie l'acompte |
| Réalisations | Galerie qui se glisse à la souris |
| Passerelle | Lien vers BLV Wash Service |
| Contact | Formulaire, email, secteur (pas de téléphone) |

Les prestations et leurs prix n'apparaissent **qu'au moment de réserver**, dans la section `#reservation` d'`auto.html`. Chaque choix porte son prix et sa durée : `data-price="95"` (en euros) et `data-min="180"` (en minutes). Modifier ces deux attributs suffit, le total, la durée et le reste à payer se recalculent tout seuls. L'abonnement (100 € le premier passage, 4 h) se règle dans `js/main.js`, fonction `panier`.

**Page Service** : hero, arguments, prestations (prix sur demande), secteurs, protocole, réalisations, appel et contact. Le téléphone n'apparaît que sur cette page.

## À personnaliser en priorité

| Élément | Où le modifier |
|---|---|
| **Numéro de téléphone** | `service.html` uniquement : `+33776690722` (le lien) et `07 76 69 07 22` (l'affichage). La page Auto n'affiche plus de numéro : tout passe par la réservation en ligne |
| **Réservation en ligne** | `auto.html`, attribut `data-cal-link` du bloc `#booking` (voir plus bas) |
| **Logo** | Reconstruit en texte : `.logo__lockup` (BLV, le L en or serif, « Wash » dessous). Pour poser le vrai fichier, remplacez le contenu de `.logo__lockup` par `<img src="assets/img/logo.png" alt="BLV WASH">` |
| Email `oscar.bellavia2026@outlook.fr` | Les trois fichiers HTML et `js/main.js` (destinataire du formulaire) |
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
| `fx-int-basic.jpg`, `fx-int-royal.jpg`, `fx-ext.jpg`, `fx-abo.jpg` | Choix de prestation dans la réservation Auto | paysage 16:10 ~1400px |
| `srv-vitres.jpg`, `srv-bureaux.jpg`, `srv-cuisine.jpg`, `service-ext.jpg`, `s4.jpg`, `s1.jpg` | Cartes de prestation Service | paysage 4:3 ~1400px |
| `v1`–`v6.jpg` | Galerie Auto | paysage ~1100px |
| `s1`–`s5.jpg` | Galerie Service | paysage ~900px |
| `cta.jpg` | Bandeau d'appel | paysage ~1600px |

Les photos sont désaturées et assombries par le CSS pour tenir ensemble malgré des origines différentes. Elles reprennent leurs couleurs au survol. Si vous mettez vos propres photos et que ce traitement ne vous plaît pas, les filtres se règlent sur `.card__media img`, `.shot img` et `.split__media img`.

### Formulaire de contact

Par défaut, le formulaire ouvre le client mail du visiteur avec la demande pré-remplie (`mailto:`). L'objet du message indique de quelle branche vient la demande, via l'attribut `data-branch` du formulaire.

Pour un envoi direct sans client mail, branchez un service gratuit type [Web3Forms](https://web3forms.com) ou [Formspree](https://formspree.io) dans `js/main.js` — le point d'accroche est commenté.

## Réservation en ligne avec acompte (page Auto)

La section **Réservation** d'`auto.html` intègre un calendrier [Cal.com](https://cal.com) : le client choisit sa formule et son créneau, paie l'acompte par carte, et le rendez-vous arrive dans votre agenda (Google ou Outlook) avec une confirmation par email des deux côtés. Tant que rien n'est configuré, la section affiche un message d'attente qui renvoie vers le formulaire de contact.

### Mise en place (une fois)

1. **Créer le compte** sur [cal.com](https://cal.com) (offre gratuite suffisante), pseudo par exemple `blvwash`.
2. **Relier l'agenda** : *Settings → Calendars* → Google Agenda ou Outlook. Les créneaux déjà pris disparaissent automatiquement, et chaque réservation y est inscrite.
3. **Fixer les disponibilités** : *Availability* → jours et heures de travail.
4. **Le type de rendez-vous** (*Event Types*) : ajoutez un délai entre deux rendez-vous (*Limits → Buffer time*) pour le trajet, et dans *Advanced* une question obligatoire « Adresse du lavage » et « Modèle du véhicule ».
5. **Brancher l'acompte** : *Apps → Stripe* → connecter (ou créer) un compte [Stripe](https://stripe.com). Puis, dans le type de rendez-vous, onglet *Apps → Stripe* : activez le paiement et mettez **20 €** (le montant de l'acompte, pas le prix total). Le rendez-vous n'est confirmé qu'une fois payé. L'argent arrive sur votre compte Stripe puis sur votre banque.
6. **Une seule formule suffit** : comme le client compose son lavage sur le site, créez dans Cal.com **un seul** type de rendez-vous, par exemple « Lavage » (`blvwash/lavage`), et cochez dans *Duration → Allow multiple durations* toutes les durées possibles : 1 h, 1 h 30, 2 h, 2 h 30, 3 h, 3 h 30, 4 h, 4 h 30, 5 h. Le site ouvre automatiquement le calendrier sur la bonne durée, et recopie le détail de la commande (prestations, total, reste à payer) dans les notes du rendez-vous.
7. **Activer sur le site** : dans `auto.html`, remplissez l'attribut du bloc :

   ```html
   <div class="booking" id="booking" data-cal-link="blvwash/lavage" ...>
   ```

   Tant que l'attribut est vide, le bouton « Choisir mon créneau » recopie la sélection dans le formulaire de contact.

Le montant de l'acompte et les conditions d'annulation affichés sur le site (20 €, gratuit jusqu'à 48 h avant) se modifient dans la section `#reservation` d'`auto.html` : gardez-les alignés avec Cal.com.

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
