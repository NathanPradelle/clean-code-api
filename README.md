# API

API backend du projet Leitner (Clean Code).
Stack recommandée : Node.js + Express + TypeScript.

## Branching strategy

Ce dépôt utilise une stratégie inspirée de GitFlow :

- `main` : branche **stable** (versions finales / rendu)
- `develop` : branche **d’intégration** (travail en cours)
- `feature/*` : branches de développement de fonctionnalités
- `fix/*` : branches de correction (optionnel)
- `chore/*` : maintenance/outillage (optionnel)

✅ Règle : **aucun push direct sur `main`** (et idéalement pas sur `develop`).  
✅ Tout passe par des Pull Requests (PR).

## Démarrer le projet en local

### Prérequis

- Node.js LTS
- Git

### Installation

```bash
git clone https://github.com/NathanPradelle/clean-code-api.git
cd clean-code-api
npm install
```
