# Road Survey Acquisition

PWA mobile-first pour l'acquisition terrain routière.

## Objectif

Cette application sert à :

- afficher la caméra du téléphone en direct ;
- lancer / mettre en pause / terminer une session ;
- capturer des images à cadence fixe (1, 2 ou 5 fps) ;
- enregistrer la position GPS, la précision et l'horodatage ;
- visualiser les rues déjà couvertes sur une carte ;
- fonctionner hors ligne avec stockage local dans IndexedDB.

## Stack

- React + TypeScript
- Vite
- vite-plugin-pwa
- Dexie (IndexedDB)
- MapLibre GL JS

## Démarrage

Prérequis : Node.js 20.19+ ou 22.12+ d'après la documentation Vite. Si tu es sur une machine d'entreprise, utilise une version portable de Node si besoin.

```bash
npm install
npm run dev
```

Puis :

```bash
npm run build
npm run preview
```

## Déploiement

Cette application est conçue pour être déployée sur un hébergement statique.
GitHub Pages convient pour le front PWA.

## Pages

- `/` : acquisition terrain
- `/map` : carte des traces GPS
- `/sessions` : historique local et export JSON
- `/settings` : réglages de capture

## Limitations du MVP

- l'écriture EXIF dans chaque JPEG n'est pas encore implémentée ;
- l'export actuel concerne surtout les métadonnées JSON ;
- la carte utilise un style distant MapLibre de démonstration ; hors ligne, seules les traces locales restent visibles ;
- la détection de dommages n'est pas encore branchée.

## Étapes suivantes suggérées

1. Ajouter l'écriture EXIF/XMP dans les JPEG.
2. Ajouter un export ZIP complet images + métadonnées.
3. Brancher un backend de synchronisation.
4. Ajouter la détection automatique des dommages après acquisition.
5. Ajouter une vue de couverture par rue / segment.
