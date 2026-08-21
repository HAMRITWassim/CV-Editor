# 📄 Éditeur de CV en ligne assisté par IA

Un éditeur de CV en ligne mono-utilisateur, développé autour de l'architecture MERN. Cette application permet de créer, personnaliser et exporter un CV au format PDF tout en s'appuyant sur l'intelligence artificielle pour optimiser la rédaction.

## ✨ Fonctionnalités Principales

*   **Édition en temps réel (WYSIWYG) :** Saisie directe sur l'aperçu du CV ou via les formulaires de la barre latérale, avec une synchronisation en temps réel.
*   **Mise en page dynamique :** 4 templates (Classique, Moderne, Élégant, Inverse) et un mode de réorganisation des blocs par glisser-déposer.
*   **Personnalisation visuelle :** Thèmes colorés, sélecteur de couleurs hexadécimales, choix de polices et alignements.
*   **Assistance IA intégrée :**
    *   **Reformulation :** Réécriture professionnelle des descriptions d'expérience via l'API Groq (GPT-OSS-20B).
    *   **Traduction :** Passage instantané du CV d'une langue à l'autre (français/anglais) via l'API DeepL.
    *   **Correction :** Vérification orthographique et grammaticale via LanguageTool.
*   **Historique :** Système de « capsule temporelle » avec fonctions Annuler / Rétablir (raccourcis clavier `CTRL+Z` / `CTRL+Y` ou `CTRL+MAJ+Z`).
*   **Export PDF :** Génération côté serveur via Puppeteer pour un rendu fidèle à l'aperçu web.

## 🛠️ Stack Technique

**Frontend (Client)**
*   React & TailwindCSS
*   Tiptap (Éditeur de texte riche)

**Backend (Serveur)**
*   Node.js & Express
*   Puppeteer (Génération PDF)

**Base de données & APIs**
*   MongoDB (Mongoose)
*   Groq, DeepL, LanguageTool

## 🚀 Installation et Lancement

### Prérequis
*   Node.js (v18+)
*   Une instance MongoDB (locale ou Atlas)
*   Clés d'API : Groq et DeepL

### 1. Configuration du Serveur
```bash
cd server
npm install
```
Créez un fichier .env à la racine du dossier server/ avec les variables suivantes :  
```bash
MONGODB_URI=votre_uri_mongodb
GROQ_API_KEY=votre_cle_api_groq
DEEPL_API_KEY=votre_cle_api_deepl
PORT=5000
```
Lancez le serveur :
```bash
npm run dev
```

### 2. Configuration du Client
Ouvrez un nouveau terminal :
```bash
cd client
npm install
npm run dev
```
L'application sera accessible sur http://localhost:5173.