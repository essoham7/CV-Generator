export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  photo: string | null;
  socials?: SocialLink[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-100
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string; // YYYY-MM or YYYY
}

export interface ReferenceContact {
  id: string;
  name: string;
  contact: string; // email ou téléphone
}

export interface Language {
  id: string;
  name: string;
  level: number; // 1-100
}

export interface Interest {
  id: string;
  name: string;
}

export interface SocialLink {
  id: string;
  url: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string; // "YYYY - YYYY" ou "YYYY - Présent"
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
  certifications: Certification[];
  references: ReferenceContact[];
  languages: Language[];
  interests: Interest[];
  primaryColor: string;
}

export interface ScoreBoardProps {
  score: number;
  tips: string[];
  compact?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AICommand {
  type: 'color' | 'rephrase' | 'add' | 'remove';
  target: string;
  value: string;
}

export interface CVPreviewProps {
  cvData: CVData;
  cvRef: React.RefObject<HTMLDivElement>;
}

export interface ChatInterfaceProps {
  onAICommand: (message: string) => Promise<void>;
  messages: ChatMessage[];
}
