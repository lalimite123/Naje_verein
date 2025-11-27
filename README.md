# NaJe

## Description générale
NaJe est un site vitrine développé avec Next.js (App Router), React et TypeScript. Il présente les activités, les ressources et les outils de l’organisation NaJe, avec une navigation moderne, des composants UI réutilisables et une mise en page responsive.

Le projet propose une expérience claire et accessible, adaptée aux mobiles, et met en avant les informations essentielles de l’association ainsi que des fonctionnalités utiles comme les menus déroulants et une modale de don.

## Ce que présente le site
- Page d’accueil avec sections « Hero » et mise en avant des messages clés.
- Présentation des domaines d’intervention (« Work Areas » / « Activities »).
- Menus « Resources » et « Tools » pour accéder rapidement aux contenus.
- Modale de don pour soutenir l’organisation.
- Barre de navigation responsive, menu mobile et pied de page complet.

## Pile technique
- Next.js, React, TypeScript
- PostCSS et styles globaux (`styles/globals.css`)
- Composants UI dédiés (`components/ui/*`) et composants métier (`components/*`)
- Configuration Next (`next.config.mjs`) et TypeScript (`tsconfig.json`)

## Exécution en local

### Prérequis
- Node.js 18+ (recommandé)
- Git
- Un gestionnaire de paquets (npm ou pnpm)

### Installation des dépendances
Utilisez l’un des gestionnaires de paquets ci-dessous (choisissez npm ou pnpm) :

npm (option 1) :
```bash
npm install
```

pnpm (option 2) :
```bash
pnpm install
```

### Démarrer le serveur de développement
npm :
```bash
npm run dev
```

pnpm :
```bash
pnpm dev
```

Puis ouvrez `http://localhost:3000/` dans votre navigateur.

### Build de production
npm :
```bash
npm run build
```

pnpm :
```bash
pnpm build
```

### Lancer la version buildée
npm :
```bash
npm run start
```

pnpm :
```bash
pnpm start
```

## Structure du projet (extrait)
- `app/` — Pages et layout (App Router)
- `components/` — Composants UI et sections (ex. `hero-section`, `navbar`, `donation-modal`)
- `components/ui/` — Design system de composants réutilisables (dialog, dropdown, table, etc.)
- `public/` — Images et assets
- `styles/` — Styles globaux
- `lib/` — Utilitaires (helpers)
- `hooks/` — Hooks partagés (`use-toast`, `use-mobile`)

## Notes
- Si des variables d’environnement sont nécessaires, créez un fichier `.env.local` à la racine et renseignez les clés requises.
- Les scripts `dev`, `build` et `start` doivent être disponibles dans `package.json`. Si besoin, adaptez-les à votre gestionnaire de paquets.