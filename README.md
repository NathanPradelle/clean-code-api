# API

## Démarrer le projet en local

### Prérequis

- Node.js 18
- Git

### Installation

```bash
git clone https://github.com/NathanPradelle/clean-code-api.git
cd clean-code-api
npm install
npm run dev
```

## Branching strategy

Ce dépôt utilise une stratégie inspirée de GitFlow :

- `main` : branche **stable** (versions finales / rendu)
- `develop` : branche **d’intégration** (travail en cours)
- `feature/*` : branches de développement de fonctionnalités
- `fix/*` : branches de correction (optionnel)
- `chore/*` : maintenance/outillage (optionnel)

✅ Règle : **aucun push direct sur `main` et `develop`**   
✅ Tout passe par des Pull Requests (PR).

## Architecture du projet

L’API est structurée selon une **architecture hexagonale** avec une approche **DDD simplifiée**.  
L’objectif est de séparer clairement la logique métier des détails techniques afin d’améliorer la lisibilité, la maintenabilité et la testabilité du code.

### Arborescence principale

```txt
src/
├── domain/
├── application/
├── infrastructure/
└── main/
```

### Description des dossiers
```domain/``` — Cœur métier
Contient la logique métier pure :
- entités métier
- value objects
- règles métier
Aucune dépendance à Express, à la base de données ou à des librairies techniques.

```application/``` — Cas d’usage
Contient les use cases et les ports (interfaces) :
- orchestration de la logique métier
- définition des dépendances nécessaires (repositories, services, etc.)
Cette couche dépend du domain mais ne dépend pas de l’infrastructure.

```infrastructure/``` — Détails techniques
Contient les implémentations concrètes :
- controllers HTTP (Express)
- repositories (in-memory, base de données, etc.)
- adaptateurs techniques
Cette couche peut évoluer sans impacter le métier.

```main/``` — Point d’entrée / composition
Responsable de :
- l’initialisation de l’application
- l’assemblage des dépendances (composition root)
- la configuration d’Express
- Aucun code métier ne doit se trouver dans ce dossier.

## Bonnes pratiques de développement

Ce projet suit volontairement des règles strictes afin de garantir un code propre et cohérent.

Règles générales:
- ❌ Pas de logique métier dans les controllers
- ❌ Pas de commentaires
- ✅ Une responsabilité par fichier (Single Responsibility Principle)

## Nommage

- Classes : PascalCase 
- Fichiers : kebab-case.ts
- Use cases : Verbe + Nom (ex : CreateCard)
- Interfaces : NomDuConcept ou NomRepository
- Variables / fonctions : camelCase

## Imports

Utilisation de l’alias @/ pour éviter les chemins relatifs complexes
Ordre des imports strictement contrôlé par ESLint

## Qualité du code

Avant chaque push :
- npm run lint
- npm run format