# 🌍 SDG Connect — Guide de Collaboration

> **Projet réalisé par deux étudiants en collaboration.**
> Ce fichier est votre **bible de projet** — lisez-le entièrement avant de commencer.

---

## 📑 Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Outils requis](#2-outils-requis)
3. [Structure complète des fichiers](#3-structure-complète-des-fichiers)
4. [Mise en place de l'environnement](#4-mise-en-place-de-lenvironnement)
5. [Workflow GitHub (collaboration)](#5-workflow-github-collaboration)
6. [Règles de collaboration](#6-règles-de-collaboration)
7. [Utiliser Antigravity (IA assistant)](#7-utiliser-antigravity-ia-assistant)
8. [Diagrammes UML](#8-diagrammes-uml)
9. [Bonnes pratiques industrielles](#9-bonnes-pratiques-industrielles)
10. [FAQ pour débutants](#10-faq-pour-débutants)

---

## 1. Vue d'ensemble du projet

**SDG Connect** est une plateforme web qui connecte des candidats à des offres d'emploi et des événements alignés sur les Objectifs de Développement Durable (ODD / SDGs) de l'ONU.

| Détail          | Info                                      |
|-----------------|-------------------------------------------|
| **Type**        | Application Web Full-Stack                |
| **Frontend**    | HTML, CSS (Vanilla), JavaScript           |
| **Backend**     | Node.js (ou framework au choix)           |
| **Base de données** | À définir (ex: MongoDB / PostgreSQL)  |
| **Versioning**  | Git + GitHub                              |
| **IA assistant**| Antigravity, claude, copilot                              |

---

## 2. Outils requis

Installez ces outils **avant de commencer** (les deux étudiants):

| Outil | Lien | Pourquoi |
|-------|------|----------|
| **Git** | https://git-scm.com/downloads | Versioning local |
| **VS Code** | https://code.visualstudio.com | Éditeur de code |
| **Node.js** (LTS) | https://nodejs.org | Exécuter JavaScript côté serveur |
| **GitHub Desktop** *(optionnel)* | https://desktop.github.com | Interface graphique Git pour débutants |
| **Antigravity** | *(fourni par votre institution)* | IA pour générer du code et des guides |

### Extensions VS Code recommandées

Installez-les via l'onglet Extensions (`Ctrl+Shift+X`) :
- `GitLens` — visualiser l'historique Git
- `Prettier` — formater le code automatiquement
- `ESLint` — détecter les erreurs JavaScript
- `Live Share` — coder à deux en temps réel

---

## 3. Structure complète des fichiers

Voici l'arborescence **officielle** du projet. **Ne modifiez pas cette structure sans discussion préalable avec votre coéquipier.**

```
SDGconnect/
│
├── 📄 README.md                  ← Ce fichier (guide principal)
├── 📄 .gitignore                 ← Fichiers à ignorer par Git
├── 📄 package.json               ← Dépendances Node.js du projet
│
├── 📁 frontend/                  ← Tout ce qui est visible par l'utilisateur
│   ├── 📁 pages/                 ← Pages HTML principales
│   │   ├── index.html            ← Page d'accueil
│   │   ├── login.html            ← Connexion / Inscription
│   │   ├── jobs.html             ← Liste des offres d'emploi
│   │   ├── events.html           ← Liste des événements
│   │   ├── profile.html          ← Profil utilisateur
│   │   └── admin.html            ← Tableau de bord administrateur
│   │
│   ├── 📁 css/                   ← Styles visuels
│   │   ├── global.css            ← Variables CSS, typographie, couleurs
│   │   ├── components.css        ← Styles des composants réutilisables
│   │   └── pages/                ← Styles spécifiques à chaque page
│   │       ├── home.css
│   │       ├── jobs.css
│   │       └── events.css
│   │
│   ├── 📁 js/                    ← Scripts JavaScript
│   │   ├── main.js               ← Script global (navigation, thème...)
│   │   ├── auth.js               ← Connexion / Déconnexion
│   │   ├── jobs.js               ← Logique des offres d'emploi
│   │   └── events.js             ← Logique des événements
│   │
│   └── 📁 assets/                ← Ressources statiques
│       ├── 📁 images/            ← Images du site
│       ├── 📁 icons/             ← Icônes SVG ou PNG
│       └── 📁 fonts/             ← Polices locales (si non CDN)
│
├── 📁 backend/                   ← Logique serveur (API)
│   ├── 📁 routes/                ← Points d'entrée de l'API
│   │   ├── auth.routes.js        ← Routes /api/auth
│   │   ├── jobs.routes.js        ← Routes /api/jobs
│   │   └── events.routes.js      ← Routes /api/events
│   │
│   ├── 📁 controllers/           ← Logique métier
│   │   ├── auth.controller.js
│   │   ├── jobs.controller.js
│   │   └── events.controller.js
│   │
│   ├── 📁 models/                ← Modèles de données (base de données)
│   │   ├── User.model.js
│   │   ├── Job.model.js
│   │   └── Event.model.js
│   │
│   ├── 📁 middleware/            ← Fonctions intermédiaires (auth, logs...)
│   │   └── auth.middleware.js
│   │
│   └── server.js                 ← Point d'entrée du serveur
│
├── 📁 diagrams/                  ← Sources des diagrammes UML (Mermaid)
│   ├── usecase.md                ← Diagramme de cas d'utilisation
│   ├── class.md                  ← Diagramme de classes
│   ├── sequence.md               ← Diagramme de séquence
│   ├── activity.md               ← Diagramme d'activité
│   └── deployment.md             ← Diagramme de déploiement
│
├── 📁 docs/                      ← Documentation exportée
│   ├── usecase.png
│   ├── class.png
│   ├── sequence.png
│   ├── activity.png
│   └── deployment.png
│
└── 📁 .github/                   ← Configuration GitHub
    └── 📁 ISSUE_TEMPLATE/        ← Modèles de tickets GitHub
        └── bug_report.md
```

---

## 4. Mise en place de l'environnement

### Étape A — Étudiant 1 : Créer le dépôt GitHub (à faire UNE SEULE FOIS)

```bash
# 1. Créer un compte sur https://github.com si ce n'est pas déjà fait

# 2. Sur GitHub.com → "New repository"
#    Nom : SDGconnect
#    Visibilité : Private (ou Public selon votre choix)
#    ☑ Add a README file : NON (on a déjà le nôtre)
#    Créer le dépôt

# 3. Dans votre terminal (ouvrir dans VS Code avec Ctrl+`)
git init
git add .
git commit -m "feat: initial project structure"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/SDGconnect.git
git push -u origin main
```

### Étape B — Étudiant 2 : Cloner le dépôt

```bash
# 1. Se faire inviter sur le dépôt par l'Étudiant 1
#    GitHub → Settings → Collaborators → Add people → entrer l'email/username

# 2. Cloner le projet
git clone https://github.com/USERNAME_ETUDIANT1/SDGconnect.git

# 3. Ouvrir le dossier dans VS Code
cd SDGconnect
code .
```

### Étape C — Les deux étudiants : Initialiser Node.js

```bash
# Dans le dossier racine du projet
npm init -y
```

---

## 5. Workflow GitHub (collaboration)

> ⚠️ **Règle d'or** : Ne jamais travailler directement sur la branche `main`. Toujours utiliser des branches.

### Schéma de travail simplifié

```
main (branche principale — toujours fonctionnelle)
  └── feature/ma-fonctionnalite (votre branche de travail)
```

### Cycle de travail quotidien

#### Début de session (chaque matin / avant toute modification)

```bash
# 1. Se mettre à jour avec le travail de l'autre
git checkout main
git pull origin main

# 2. Créer votre branche de travail (nommée selon ce que vous faites)
git checkout -b feature/page-accueil
#                     ↑ Exemples de noms :
#                       feature/systeme-login
#                       feature/liste-offres
#                       fix/bug-navigation
```

#### Pendant le travail (sauvegarder régulièrement)

```bash
# Voir ce qui a changé
git status

# Ajouter vos modifications
git add .

# Sauvegarder avec un message clair
git commit -m "feat: ajoute la page d'accueil avec navigation"
#                ↑ Structure du message :
#                  feat:  nouvelle fonctionnalité
#                  fix:   correction de bug
#                  docs:  modification de documentation
#                  style: changements visuels sans logique
```

#### Fin de session (envoyer votre travail sur GitHub)

```bash
# Envoyer votre branche sur GitHub
git push origin feature/page-accueil

# Sur GitHub.com → Ouvrir une Pull Request (PR)
# → "Compare & pull request"
# → Écrire ce que vous avez fait
# → Demander à l'autre étudiant de relire (review)
# → Merger dans main une fois approuvé
```

#### Après le merge (nettoyer)

```bash
# Revenir sur main et récupérer les changements
git checkout main
git pull origin main

# Supprimer l'ancienne branche (optionnel)
git branch -d feature/page-accueil
```

---

## 6. Règles de collaboration

Ces règles évitent les conflits et le chaos dans le code.

### Division des tâches suggérée

| Zone | Étudiant 1 | Étudiant 2 |
|------|-----------|-----------|
| **Frontend** | Pages & CSS | JavaScript & interactions |
| **Backend** | Routes & Serveur | Contrôleurs & Modèles |
| **Diagrammes** | Use Case & Classes | Séquence & Activité |
| **Documentation** | Mis à jour README | Commentaires dans le code |

> 💡 Discutez et ajustez cette répartition selon vos points forts.

### Règles de communication

- ✅ Toujours **prévenir l'autre** avant de modifier un fichier partagé
- ✅ Faire une **Pull Request** pour tout ajout de code, même petit
- ✅ Se synchroniser **au minimum une fois par jour** (message ou appel)
- ✅ En cas de conflit Git, **résoudre ensemble**, jamais seul
- ❌ Ne jamais faire `git push --force` sur `main`
- ❌ Ne jamais `merge` sa propre Pull Request sans que l'autre l'ait lue

---

## 7. Utiliser Antigravity (IA assistant)

**Antigravity** est votre assistant IA intégré qui vous aide à coder, déboguer et documenter.

### Comment bien l'utiliser

```
✅ BON  → "Génère le HTML de la page d'accueil avec une navbar et une section hero 
           qui suit la structure /frontend/pages/index.html de notre projet SDG Connect"

✅ BON  → "Explique-moi comment fonctionne ce code : [coller le code]"

✅ BON  → "Crée le fichier /backend/routes/jobs.routes.js avec 4 routes REST 
           (GET all, GET by id, POST, DELETE)"

❌ MAUVAIS → "Fais le projet pour moi"
❌ MAUVAIS → "Corrige tout" (sans préciser quoi)
```

### Commandes utiles avec Antigravity

| Ce que vous voulez faire | Ce que vous demandez à Antigravity |
|--------------------------|-------------------------------------|
| Créer un fichier | *"Crée le fichier [chemin] avec [contenu décrit]"* |
| Déboguer une erreur | *"J'ai cette erreur : [coller l'erreur]. Voici mon code : [coller le code]"* |
| Comprendre un concept | *"Explique-moi [concept] avec un exemple simple"* |
| Générer un diagramme | *"Génère le code Mermaid pour un diagramme de classes de..."* |
| Améliorer le design CSS | *"Améliore le CSS de [page] pour qu'il soit moderne et professionnel"* |

### Workflow Antigravity + Git (exemple)

```
1. [Antigravity] génère le code → vous le vérifiez
2. Vous testez dans le navigateur / terminal
3. git add . && git commit -m "feat: [ce qui a été fait]"
4. git push origin votre-branche
5. Pull Request → review → merge
```

---

## 8. Diagrammes UML

Les diagrammes sont stockés en deux endroits :

| Dossier | Contenu |
|---------|---------|
| `/diagrams/` | Code source Mermaid (`.md`) — **modifier ici** |
| `/docs/` | Images PNG exportées — **utiliser dans le rapport** |

### Comment modifier un diagramme

1. Ouvrir le fichier `.md` dans `/diagrams/`
2. Modifier le code Mermaid
3. Aller sur **https://mermaid.live**
4. Coller le code, exporter en PNG
5. Remplacer le fichier PNG dans `/docs/`
6. Commiter les **deux fichiers** (`.md` + `.png`)

### Diagrammes du projet

| Diagramme | Fichier source | Image |
|-----------|---------------|-------|
| Cas d'utilisation | `diagrams/usecase.md` | `docs/usecase.png` |
| Classes | `diagrams/class.md` | `docs/class.png` |
| Séquence (Candidature) | `diagrams/sequence.md` | `docs/sequence.png` |
| Activité (Événement) | `diagrams/activity.md` | `docs/activity.png` |
| Déploiement | `diagrams/deployment.md` | `docs/deployment.png` |

---

## 9. Bonnes pratiques industrielles

Ces pratiques sont utilisées dans **toutes les entreprises tech**. Adoptez-les dès maintenant.

### 🔤 Nommage des fichiers et variables

```javascript
// ✅ Bon : camelCase pour les variables/fonctions
const userName = "Alice";
function getUserById(id) { ... }

// ✅ Bon : PascalCase pour les classes
class UserModel { ... }

// ✅ Bon : kebab-case pour les fichiers CSS et HTML
// jobs-list.html, global-styles.css

// ❌ Mauvais
const UN = "Alice";
const Nom_utilisateur = "Alice";
```

### 💬 Commentaires dans le code

```javascript
// ✅ Expliquer le "pourquoi", pas le "quoi"
// On limite à 10 résultats pour éviter de surcharger la page
const MAX_RESULTS = 10;

// ❌ Éviter les commentaires inutiles
// On ajoute 1 à i
i = i + 1;
```

### 🔒 Sécurité de base

```bash
# Ne JAMAIS commiter ces fichiers
.env          ← mots de passe, clés API
node_modules/ ← dépendances (trop lourd)
```

Votre fichier `.gitignore` doit contenir :

```
node_modules/
.env
.DS_Store
*.log
dist/
```

### 📝 Messages de commit clairs

```bash
# ✅ Bons exemples
git commit -m "feat: ajoute le formulaire de candidature"
git commit -m "fix: corrige l'affichage sur mobile"
git commit -m "docs: met à jour le README"
git commit -m "style: améliore les couleurs du header"

# ❌ Mauvais exemples
git commit -m "modif"
git commit -m "aaaaaa"
git commit -m "ca marche plus"
```

---

## 10. FAQ pour débutants

**Q : Git me dit "merge conflict", que faire ?**
> Ne paniquez pas ! Ouvrez le fichier concerné dans VS Code. Il affichera les deux versions (la vôtre et celle de l'autre). Décidez ensemble quelle version garder, puis sauvegardez et faites un nouveau commit.

**Q : J'ai cassé quelque chose, comment revenir en arrière ?**
> ```bash
> # Annuler les modifications non sauvegardées
> git checkout -- nom-du-fichier.js
> 
> # Revenir au dernier commit
> git reset --hard HEAD
> ```
> ⚠️ Ces commandes sont irréversibles. Utilisez-les avec précaution.

**Q : Comment voir ce que l'autre a changé ?**
> ```bash
> git log --oneline   # Liste tous les commits
> git diff main       # Voir les différences avec main
> ```

**Q : Antigravity a généré du code que je ne comprends pas. Que faire ?**
> Demandez-lui d'expliquer : *"Explique-moi ce code ligne par ligne"*. Ne soumettez jamais du code que vous ne comprenez pas sans l'avoir analysé.

**Q : Quel étudiant fait quoi en premier ?**
> Étudiant 1 crée le dépôt et la structure de fichiers. Étudiant 2 clone et commence à travailler sur sa première branche. Communiquez toujours avant de modifier des fichiers partagés.

---

## 🚀 Prochaines étapes recommandées

- [ ] Étudiant 1 : Crée le dépôt GitHub et pousse cette structure
- [ ] Étudiant 2 : Clone le dépôt et vérifie que tout fonctionne
- [ ] Les deux : Installez les extensions VS Code recommandées
- [ ] Les deux : Créez votre première branche et faites un commit de test
- [ ] Définissez ensemble qui travaille sur quelle partie en premier

---

<div align="center">

**Bon courage à vous deux ! 💪**

*SDG Connect — Contribuer aux Objectifs de Développement Durable*

</div>
