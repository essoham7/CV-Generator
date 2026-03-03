import { CVData } from "../types/cv.types";
import { stripTags } from "./sanitize";

interface ScoreResult {
  score: number;
  tips: string[];
}

export const calculateScore = (cvData: CVData): ScoreResult => {
  let score = 0;
  const tips: string[] = [];

  // Photo (10 points)
  if (cvData.personalInfo.photo) {
    score += 10;
  } else {
    tips.push("Ajoutez une photo professionnelle pour gagner 10 points");
  }

  // Nom complet (5 points)
  if (cvData.personalInfo.name.trim().length > 0) {
    score += 5;
  } else {
    tips.push("Ajoutez votre nom complet");
  }

  // Titre professionnel (5 points)
  if (cvData.personalInfo.title.trim().length > 0) {
    score += 5;
  } else {
    tips.push("Ajoutez un titre professionnel");
  }

  // Email (5 points)
  if (isValidEmail(cvData.personalInfo.email)) {
    score += 5;
  } else {
    tips.push("Ajoutez une adresse email valide");
  }

  // Téléphone (5 points)
  if (isValidPhone(cvData.personalInfo.phone)) {
    score += 5;
  } else {
    tips.push("Ajoutez un numéro de téléphone valide");
  }

  // Résumé (20 points max)
  const summaryLength = cvData.personalInfo.summary.trim().length;
  if (summaryLength >= 200) {
    score += 20;
  } else if (summaryLength >= 100) {
    score += 15;
  } else if (summaryLength >= 50) {
    score += 10;
  } else if (summaryLength > 0) {
    score += 5;
  } else {
    tips.push("Ajoutez un résumé professionnel (50+ mots recommandés)");
  }

  // Expériences (20 points max)
  if (cvData.experiences.length > 0) {
    score += Math.min(cvData.experiences.length * 5, 20);

    // Vérifier la qualité des expériences
    const hasDetailedExperiences = cvData.experiences.some(
      (exp) => stripTags(exp.description).trim().length > 50,
    );

    if (!hasDetailedExperiences) {
      tips.push("Ajoutez des descriptions détaillées à vos expériences");
    }
  } else {
    tips.push("Ajoutez au moins une expérience professionnelle");
  }

  // Compétences (20 points max)
  if (cvData.skills.length > 0) {
    score += Math.min(cvData.skills.length * 4, 20);

    // Vérifier les niveaux de compétences
    const hasHighLevelSkills = cvData.skills.some((skill) => skill.level >= 70);
    if (!hasHighLevelSkills) {
      tips.push("Mettez en avant vos compétences de niveau avancé (70%+)");
    }
  } else {
    tips.push("Ajoutez vos compétences techniques");
  }

  // Éducation (10 points max)
  if (cvData.education.length > 0) {
    score += Math.min(cvData.education.length * 5, 10);
  } else {
    tips.push("Ajoutez votre formation éducative");
  }

  // Bonus pour la complétion
  const completionRate = calculateCompletionRate(cvData);
  if (completionRate >= 90) {
    score += 5;
    tips.push("Excellent ! Votre CV est presque parfait");
  } else if (completionRate >= 75) {
    score += 3;
    tips.push("Très bien ! Ajoutez quelques détails supplémentaires");
  }

  return {
    score: Math.min(Math.round(score), 100),
    tips: tips.slice(0, 3), // Limiter à 3 conseils maximum
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

const calculateCompletionRate = (cvData: CVData): number => {
  let totalFields = 0;
  let filledFields = 0;

  // Personal info fields
  const personalFields = ["name", "title", "email", "phone", "summary"];
  personalFields.forEach((field) => {
    totalFields++;
    if (
      cvData.personalInfo[field as keyof typeof cvData.personalInfo]
        ?.toString()
        .trim().length > 0
    ) {
      filledFields++;
    }
  });

  // Photo
  totalFields++;
  if (cvData.personalInfo.photo) {
    filledFields++;
  }

  // Experiences
  totalFields += 2; // Au moins une expérience avec description
  if (cvData.experiences.length > 0) {
    filledFields++;
    if (
      cvData.experiences.some(
        (exp) => stripTags(exp.description).trim().length > 20,
      )
    ) {
      filledFields++;
    }
  }

  // Skills
  totalFields++;
  if (cvData.skills.length > 0) {
    filledFields++;
  }

  // Education
  totalFields++;
  if (cvData.education.length > 0) {
    filledFields++;
  }

  return (filledFields / totalFields) * 100;
};
