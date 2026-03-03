# CV Generator - Application Ultra-Moderne

Une application web SPA de génération de CV professionnels avec interface épurée, assistant IA intégré et export PDF/PNG.

## 🚀 Fonctionnalités

- **Interface Split-Screen** : Éditeur à gauche, aperçu en temps réel à droite
- **Design Ultra-Moderne** : Photo circulaire, timeline élégante, jauges de compétences
- **Assistant IA** : Chatbot intelligent pour modifications rapides
- **Système de Scoring** : Jauge animée avec conseils personnalisés
- **Export PDF/PNG** : Téléchargement haute qualité
- **Upload Photo** : Conversion base64 avec validation
- **Responsive Design** : Adaptation mobile et tablette

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS 3
- **Icons** : Lucide React
- **Export** : html2canvas + jsPDF
- **State Management** : React useReducer

## 📦 Installation

```bash
# Cloner le projet
git clone <url>

# Installer les dépendances
npm install

# Démarrer le serveur de développenement
npm run dev

# Build pour la production
npm run build
```

## 🎯 Utilisation

### Interface Principale

1. **Panneau Gauche** : Remplissez vos informations via les onglets :
   - **Personnel** : Nom, titre, contact, photo, résumé
   - **Expérience** : Ajoutez vos expériences professionnelles
   - **Compétences** : Gérez vos compétences avec niveaux

2. **Panneau Droit** : Aperçu en temps réel de votre CV

### Assistant IA

Cliquez sur le bouton chat en bas à droite et essayez :

- `"Change la couleur principale en bleu"`
- `"Reformule mon expérience chez Google"`
- `"Modifie la couleur en violet"`

### Export

Utilisez les boutons d'export dans le header :
- **PDF** : Export haute résolution, multi-pages si nécessaire
- **PNG** : Image PNG haute qualité

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── CVPreview.tsx   # Aperçu du CV
│   ├── ChatInterface.tsx # Interface chatbot
│   ├── ScoreBoard.tsx  # Jauge de score
│   ├── PersonalForm.tsx # Formulaire personnel
│   ├── ExperienceForm.tsx # Gestion expériences
│   ├── SkillsForm.tsx  # Gestion compétences
│   └── ExportButtons.tsx # Boutons d'export
├── types/              # Interfaces TypeScript
│   └── cv.types.ts    # Types CV et composants
├── utils/              # Fonctions utilitaires
│   ├── aiCommandParser.ts # Parser commandes IA
│   └── scoreCalculator.ts # Calculateur de score
└── App.tsx            # Composant principal
```

## 🎨 Design System

### Couleurs
- **Primary** : Bleu nuit (#1e293b)
- **Secondary** : Gris clair (#f8fafc)
- **Accent** : Violet (#6366f1)

### Typographie
- **Police** : Inter (system-ui fallback)
- **Tailles** : 14-16px corps, 24-32px titres

### Composants
- Cards avec ombres subtiles
- Boutons arrondis avec hover states
- Timeline élégante pour expériences
- Jauges animées pour compétences

## 🧪 Algorithmes

### Scoring CV
- Photo : +10 points
- Informations de contact : +15 points
- Résumé (50+ mots) : +20 points
- Expériences : +5 points par expérience (max 20)
- Compétences : +4 points par compétence (max 20)
- Éducation : +5 points par diplôme (max 10)
- Bonus complétion : jusqu'à +5 points

### Parser IA
- Reconnaissance de commandes couleur
- Extraction d'entreprises pour reformulation
- Génération automatique de textes professionnels

## 📱 Responsive

- **Desktop** : 1400px+ (50/50 split)
- **Tablet** : 768-1399px (60/40 ou full width)
- **Mobile** : <768px (interface empilée)

## 🔒 Sécurité

- Validation des uploads (type MIME, taille 5MB max)
- Sanitization des inputs utilisateur
- Pas de backend - données client-side uniquement

## 🚀 Déploiement

L'application est prête pour le déploiement sur :
- Vercel
- Netlify
- GitHub Pages
- Tout hébergeur static

## 📄 License

MIT License - Voir fichier LICENSE pour détails.