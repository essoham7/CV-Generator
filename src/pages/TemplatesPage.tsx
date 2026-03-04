import React from "react";
import { CVData } from "../types/cv.types";
import {
  Palette,
  LayoutGrid,
  Sparkles,
  Briefcase,
  FileText,
  CheckCircle,
  AlignLeft,
  Type,
  Feather,
  Monitor,
  Star,
  Award,
  BookOpen,
  Globe,
  Layers,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CVPreview from "../components/CVPreview";

interface TemplatesPageProps {
  onUseTemplate: (tpl: CVData) => void;
}

const makeId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2, 6);

// Helper to create base CV data
const createBaseData = (overrides: Partial<CVData> = {}): CVData => ({
  personalInfo: {
    name: "Alexandre Dupont",
    title: "Expert en Stratégie",
    email: "alex.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    summary:
      "Professionnel orienté résultats avec 5+ ans d'expérience dans la gestion de projets complexes et l'optimisation de processus. Expert en communication et leadership d'équipe.",
    photo: null,
    socials: [],
  },
  experiences: [
    {
      id: "exp1",
      company: "Tech Solutions Inc.",
      position: "Chef de Projet Senior",
      startDate: "2020-01",
      endDate: "Présent",
      description:
        "<p>Direction d'une équipe de 10 personnes. Augmentation de la productivité de 20%.</p>",
    },
    {
      id: "exp2",
      company: "Global Services",
      position: "Analyste Commercial",
      startDate: "2017-06",
      endDate: "2019-12",
      description:
        "<p>Analyse de données de marché et recommandations stratégiques.</p>",
    },
  ],
  skills: [
    { id: "sk1", name: "Gestion de Projet", level: 90 },
    { id: "sk2", name: "Analyse de Données", level: 85 },
    { id: "sk3", name: "Leadership", level: 88 },
  ],
  education: [
    {
      id: "edu1",
      institution: "École de Commerce de Paris",
      degree: "Master en Management",
      period: "2015 - 2017",
      description: "Spécialisation en Stratégie d'Entreprise",
    },
  ],
  certifications: [],
  references: [],
  languages: [
    { id: "lang1", name: "Français", level: 100 },
    { id: "lang2", name: "Anglais", level: 80 },
  ],
  interests: [
    { id: "int1", name: "Voyages" },
    { id: "int2", name: "Nouvelles Technologies" },
  ],
  primaryColor: "#1e293b",
  fontFamily: "Inter, system-ui, sans-serif",
  ...overrides,
});

const templates = [
  {
    id: "classic",
    name: "Classic",
    color: "#2c3e50",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Intemporel et structuré, idéal pour tous les secteurs.",
    data: createBaseData({
      primaryColor: "#2c3e50",
      fontFamily: "Georgia, serif",
      templateId: "classic",
    }),
  },
  {
    id: "traditional",
    name: "Traditional",
    color: "#34495e",
    icon: <FileText className="w-5 h-5" />,
    description: "Le standard éprouvé pour les profils conservateurs.",
    data: createBaseData({
      primaryColor: "#34495e",
      fontFamily: "'Times New Roman', Times, serif",
      templateId: "traditional",
    }),
  },
  {
    id: "professional",
    name: "Professional",
    color: "#0f172a",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Sobre et efficace, met en avant l'expérience.",
    data: createBaseData({
      primaryColor: "#0f172a",
      fontFamily: "Arial, Helvetica, sans-serif",
      templateId: "professional",
    }),
  },
  {
    id: "prime-ats",
    name: "Prime ATS",
    color: "#2563eb",
    icon: <CheckCircle className="w-5 h-5" />,
    description: "Optimisé pour les logiciels de recrutement (ATS).",
    data: createBaseData({
      primaryColor: "#2563eb",
      fontFamily: "Inter, system-ui, sans-serif",
      templateId: "prime-ats",
    }),
  },
  {
    id: "corporate",
    name: "Corporate",
    color: "#1e3a8a",
    icon: <LayoutGrid className="w-5 h-5" />,
    description: "Parfait pour les grandes entreprises et la finance.",
    data: createBaseData({
      primaryColor: "#1e3a8a",
      fontFamily: "Roboto, Arial, sans-serif",
      templateId: "corporate",
    }),
  },
  {
    id: "clear",
    name: "Clear",
    color: "#059669",
    icon: <AlignLeft className="w-5 h-5" />,
    description: "Une mise en page aérée pour une lecture facile.",
    data: createBaseData({
      primaryColor: "#059669",
      fontFamily: "Arial, Helvetica, sans-serif",
      templateId: "clear",
    }),
  },
  {
    id: "balanced",
    name: "Balanced",
    color: "#475569",
    icon: <Layers className="w-5 h-5" />,
    description: "L'équilibre parfait entre texte et espace blanc.",
    data: createBaseData({
      primaryColor: "#475569",
      fontFamily: "Inter, system-ui, sans-serif",
      templateId: "balanced",
    }),
  },
  {
    id: "header-ats",
    name: "Header ATS",
    color: "#dc2626",
    icon: <Type className="w-5 h-5" />,
    description: "En-tête distinctif tout en restant compatible ATS.",
    data: createBaseData({
      primaryColor: "#dc2626",
      fontFamily: "Roboto, Arial, sans-serif",
      templateId: "header-ats",
    }),
  },
  {
    id: "essential",
    name: "Essential",
    color: "#000000",
    icon: <Feather className="w-5 h-5" />,
    description: "Va droit au but, sans distractions inutiles.",
    data: createBaseData({
      primaryColor: "#000000",
      fontFamily: "Arial, Helvetica, sans-serif",
      templateId: "essential",
    }),
  },
  {
    id: "polished",
    name: "Polished",
    color: "#7c3aed",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Une touche de raffinement pour se démarquer.",
    data: createBaseData({
      primaryColor: "#7c3aed",
      fontFamily: "Georgia, serif",
      templateId: "polished",
    }),
  },
  {
    id: "calligraphic",
    name: "Calligraphic",
    color: "#be185d",
    icon: <Palette className="w-5 h-5" />,
    description: "Élégant avec des touches typographiques soignées.",
    data: createBaseData({
      primaryColor: "#be185d",
      fontFamily: "'Times New Roman', Times, serif",
      templateId: "calligraphic",
    }),
  },
  {
    id: "minimalist",
    name: "Minimalist",
    color: "#57534e",
    icon: <Monitor className="w-5 h-5" />,
    description: "Less is more. Design épuré et moderne.",
    data: createBaseData({
      primaryColor: "#57534e",
      fontFamily: "Inter, system-ui, sans-serif",
      templateId: "minimalist",
    }),
  },
  {
    id: "industrial",
    name: "Industrial",
    color: "#374151",
    icon: <SettingsIcon className="w-5 h-5" />,
    description: "Robuste et direct, pour les secteurs techniques.",
    data: createBaseData({
      primaryColor: "#374151",
      fontFamily: "Roboto, Arial, sans-serif",
      templateId: "industrial",
    }),
  },
  {
    id: "elegant",
    name: "Elegant",
    color: "#0f766e",
    icon: <Star className="w-5 h-5" />,
    description: "Sophistiqué pour les profils haut de gamme.",
    data: createBaseData({
      primaryColor: "#0f766e",
      fontFamily: "Georgia, serif",
      templateId: "elegant",
    }),
  },
  {
    id: "authority",
    name: "Authority",
    color: "#1c1917",
    icon: <Award className="w-5 h-5" />,
    description: "Impose le respect et démontre l'expertise.",
    data: createBaseData({
      primaryColor: "#1c1917",
      fontFamily: "Arial, Helvetica, sans-serif",
      templateId: "authority",
    }),
  },
];

// Fallback icon component if needed
function SettingsIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ onUseTemplate }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
            >
              CV
            </Link>
            <h2 className="text-xl font-semibold text-gray-900">
              Modèles de CV
            </h2>
          </div>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Retour à l'éditeur
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choisissez votre style
          </h1>
          <p className="text-gray-600">
            Sélectionnez un modèle pour commencer. Vous pourrez personnaliser
            les couleurs et les polices par la suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-[400px]"
            >
              {/* Live Preview Background */}
              <div className="absolute inset-0 overflow-hidden bg-gray-50">
                <div className="transform scale-[0.35] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none opacity-90">
                  <CVPreview cvData={tpl.data} cvRef={{ current: null }} />
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content Layer */}
              <div className="relative z-10 p-6 flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white/80 backdrop-blur shadow-sm text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {tpl.icon}
                  </div>
                  {tpl.id.includes("ats") && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 rounded-full shadow-sm">
                      ATS Friendly
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                  {tpl.description}
                </p>

                <button
                  onClick={() => {
                    // Deep copy and generate new IDs
                    const data = {
                      ...tpl.data,
                      experiences: tpl.data.experiences.map((e) => ({
                        ...e,
                        id: makeId(),
                      })),
                      skills: tpl.data.skills.map((s) => ({
                        ...s,
                        id: makeId(),
                      })),
                      languages: tpl.data.languages.map((l) => ({
                        ...l,
                        id: makeId(),
                      })),
                      interests: tpl.data.interests.map((i) => ({
                        ...i,
                        id: makeId(),
                      })),
                    };
                    onUseTemplate(data);
                    navigate("/");
                  }}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span>Utiliser ce modèle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
