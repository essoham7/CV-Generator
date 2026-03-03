import { AICommand } from '../types/cv.types';

const colorMap: { [key: string]: string } = {
  'bleu': '#3b82f6',
  'bleu nuit': '#1e293b',
  'rouge': '#ef4444',
  'vert': '#10b981',
  'violet': '#8b5cf6',
  'orange': '#f97316',
  'rose': '#ec4899',
  'gris': '#6b7280',
  'noir': '#000000',
  'blanc': '#ffffff'
};

export const parseAICommand = (message: string): AICommand | null => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Commande pour changer la couleur
  const colorPatterns = [
    /change.*couleur.*principale.*en\s+(.+)/i,
    /modifie.*couleur.*principale.*en\s+(.+)/i,
    /mets.*couleur.*principale.*en\s+(.+)/i,
    /couleur.*principale\s+(.+)/i
  ];
  
  for (const pattern of colorPatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      const colorName = match[1].toLowerCase().trim();
      const colorHex = colorMap[colorName] || getHexColor(colorName);
      
      return {
        type: 'color',
        target: 'primaryColor',
        value: colorHex
      };
    }
  }
  
  // Commande pour reformuler une expérience
  const rephrasePatterns = [
    /reformule.*mon.*expérience.*chez\s+(.+)/i,
    /améliore.*mon.*expérience.*chez\s+(.+)/i,
    /modifie.*mon.*expérience.*chez\s+(.+)/i,
    /rewrite.*experience.*at\s+(.+)/i
  ];
  
  for (const pattern of rephrasePatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      const company = match[1].trim();
      
      // Générer une reformulation automatique (simulée)
      const rephrasedText = generateRephrasedExperience(company);
      
      return {
        type: 'rephrase',
        target: company,
        value: rephrasedText
      };
    }
  }
  
  return null;
};

const getHexColor = (colorName: string): string => {
  // Si c'est déjà une couleur hex
  if (colorName.match(/^#[0-9a-f]{6}$/i)) {
    return colorName;
  }
  
  // Couleurs par défaut
  const defaultColors: { [key: string]: string } = {
    'blue': '#3b82f6',
    'red': '#ef4444',
    'green': '#10b981',
    'purple': '#8b5cf6',
    'orange': '#f97316',
    'pink': '#ec4899',
    'gray': '#6b7280',
    'black': '#000000',
    'white': '#ffffff'
  };
  
  return defaultColors[colorName] || '#1e293b'; // Couleur par défaut
};

const generateRephrasedExperience = (company: string): string => {
  const templates = [
    `Chez ${company}, j'ai occupé un rôle clé dans le développement de solutions innovantes, contribuant significativement à la croissance de l'entreprise.`,
    `Mon expérience chez ${company} m'a permis de développer des compétences avancées en gestion de projet et en leadership technique.`,
    `Au sein de ${company}, j'ai mené à bien plusieurs projets complexes, démontrant mon aptitude à résoudre des problématiques techniques avancées.`,
    `Mon parcours chez ${company} témoigne de ma capacité à m'adapter rapidement à des environnements technologiques en constante évolution.`,
    `J'ai su faire preuve d'innovation et de créativité pendant mon expérience chez ${company}, en proposant des solutions qui ont eu un impact mesurable.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};