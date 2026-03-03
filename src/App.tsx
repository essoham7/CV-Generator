import React, { useReducer, useState, useRef } from "react";
import { CVData, ChatMessage } from "./types/cv.types";
import CVPreview from "./components/CVPreview";
import ChatInterface from "./components/ChatInterface";
import ScoreBoard from "./components/ScoreBoard";
import PersonalForm from "./components/PersonalForm";
import ExperienceForm from "./components/ExperienceForm";
import SkillsForm from "./components/SkillsForm";
import EducationForm from "./components/EducationForm";
import CertificationsForm from "./components/CertificationsForm";
import LanguagesForm from "./components/LanguagesForm";
import ReferencesForm from "./components/ReferencesForm";
import InterestsForm from "./components/InterestsForm";
import ExportButtons from "./components/ExportButtons";
import { parseAICommand } from "./utils/aiCommandParser";
import { calculateScore } from "./utils/scoreCalculator";
import {
  User,
  Briefcase,
  Brain,
  GraduationCap,
  Award,
  Languages,
  Users,
  Heart,
} from "lucide-react";

type CVAction =
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<CVData["personalInfo"]> }
  | { type: "ADD_EXPERIENCE"; payload: CVData["experiences"][0] }
  | {
      type: "UPDATE_EXPERIENCE";
      payload: { id: string; data: Partial<CVData["experiences"][0]> };
    }
  | { type: "DELETE_EXPERIENCE"; payload: string }
  | { type: "ADD_SKILL"; payload: CVData["skills"][0] }
  | {
      type: "UPDATE_SKILL";
      payload: { id: string; data: Partial<CVData["skills"][0]> };
    }
  | { type: "DELETE_SKILL"; payload: string }
  | { type: "ADD_EDUCATION"; payload: CVData["education"][0] }
  | {
      type: "UPDATE_EDUCATION";
      payload: { id: string; data: Partial<CVData["education"][0]> };
    }
  | { type: "DELETE_EDUCATION"; payload: string }
  | { type: "ADD_CERTIFICATION"; payload: CVData["certifications"][0] }
  | {
      type: "UPDATE_CERTIFICATION";
      payload: { id: string; data: Partial<CVData["certifications"][0]> };
    }
  | { type: "DELETE_CERTIFICATION"; payload: string }
  | { type: "ADD_REFERENCE"; payload: CVData["references"][0] }
  | {
      type: "UPDATE_REFERENCE";
      payload: { id: string; data: Partial<CVData["references"][0]> };
    }
  | { type: "DELETE_REFERENCE"; payload: string }
  | { type: "ADD_LANGUAGE"; payload: CVData["languages"][0] }
  | {
      type: "UPDATE_LANGUAGE";
      payload: { id: string; data: Partial<CVData["languages"][0]> };
    }
  | { type: "DELETE_LANGUAGE"; payload: string }
  | { type: "ADD_INTEREST"; payload: CVData["interests"][0] }
  | { type: "DELETE_INTEREST"; payload: string }
  | { type: "UPDATE_PRIMARY_COLOR"; payload: string };

const initialCVData: CVData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    photo: null,
    socials: [],
  },
  experiences: [],
  skills: [],
  education: [],
  certifications: [],
  references: [],
  languages: [],
  interests: [],
  primaryColor: "#1e293b",
};

function cvReducer(state: CVData, action: CVAction): CVData {
  switch (action.type) {
    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };
    case "ADD_EXPERIENCE":
      return {
        ...state,
        experiences: [...state.experiences, action.payload],
      };
    case "UPDATE_EXPERIENCE":
      return {
        ...state,
        experiences: state.experiences.map((exp) =>
          exp.id === action.payload.id
            ? { ...exp, ...action.payload.data }
            : exp,
        ),
      };
    case "DELETE_EXPERIENCE":
      return {
        ...state,
        experiences: state.experiences.filter(
          (exp) => exp.id !== action.payload,
        ),
      };
    case "ADD_SKILL":
      return {
        ...state,
        skills: [...state.skills, action.payload],
      };
    case "UPDATE_SKILL":
      return {
        ...state,
        skills: state.skills.map((skill) =>
          skill.id === action.payload.id
            ? { ...skill, ...action.payload.data }
            : skill,
        ),
      };
    case "DELETE_SKILL":
      return {
        ...state,
        skills: state.skills.filter((skill) => skill.id !== action.payload),
      };
    case "ADD_EDUCATION":
      return {
        ...state,
        education: [...state.education, action.payload],
      };
    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: state.education.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.data } : e,
        ),
      };
    case "DELETE_EDUCATION":
      return {
        ...state,
        education: state.education.filter((e) => e.id !== action.payload),
      };
    case "ADD_CERTIFICATION":
      return {
        ...state,
        certifications: [...state.certifications, action.payload],
      };
    case "UPDATE_CERTIFICATION":
      return {
        ...state,
        certifications: state.certifications.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c,
        ),
      };
    case "DELETE_CERTIFICATION":
      return {
        ...state,
        certifications: state.certifications.filter(
          (c) => c.id !== action.payload,
        ),
      };
    case "ADD_REFERENCE":
      return {
        ...state,
        references: [...state.references, action.payload],
      };
    case "UPDATE_REFERENCE":
      return {
        ...state,
        references: state.references.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload.data } : r,
        ),
      };
    case "DELETE_REFERENCE":
      return {
        ...state,
        references: state.references.filter((r) => r.id !== action.payload),
      };
    case "ADD_LANGUAGE":
      return {
        ...state,
        languages: [...state.languages, action.payload],
      };
    case "UPDATE_LANGUAGE":
      return {
        ...state,
        languages: state.languages.map((l) =>
          l.id === action.payload.id ? { ...l, ...action.payload.data } : l,
        ),
      };
    case "DELETE_LANGUAGE":
      return {
        ...state,
        languages: state.languages.filter((l) => l.id !== action.payload),
      };
    case "ADD_INTEREST":
      return {
        ...state,
        interests: [...state.interests, action.payload],
      };
    case "DELETE_INTEREST":
      return {
        ...state,
        interests: state.interests.filter((i) => i.id !== action.payload),
      };
    case "UPDATE_PRIMARY_COLOR":
      return {
        ...state,
        primaryColor: action.payload,
      };
    default:
      return state;
  }
}

function App() {
  const [cvData, dispatch] = useReducer(cvReducer, initialCVData);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeSection, setActiveSection] = useState<
    | "personal"
    | "experience"
    | "skills"
    | "education"
    | "certifications"
    | "languages"
    | "references"
    | "interests"
  >("personal");
  const [isLoading, setIsLoading] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const handleAICommand = async (message: string): Promise<void> => {
    setIsLoading(true);

    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    // Parser la commande IA
    const command = parseAICommand(message);

    if (command) {
      // Simuler un délai de traitement IA
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let responseText = "";

      switch (command.type) {
        case "color":
          dispatch({ type: "UPDATE_PRIMARY_COLOR", payload: command.value });
          responseText = `Couleur principale changée en ${command.value}`;
          break;
        case "rephrase":
          // Trouver et mettre à jour l'expérience
          const experience = cvData.experiences.find((exp) =>
            exp.company.toLowerCase().includes(command.target.toLowerCase()),
          );
          if (experience) {
            dispatch({
              type: "UPDATE_EXPERIENCE",
              payload: {
                id: experience.id,
                data: { description: command.value },
              },
            });
            responseText = `Expérience chez ${experience.company} reformulée avec succès`;
          } else {
            responseText = `Aucune expérience trouvée pour ${command.target}`;
          }
          break;
        default:
          responseText = "Commande non reconnue";
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } else {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Je ne comprends pas cette commande. Essayez "Change la couleur principale en bleu" ou "Reformule mon expérience chez Google"',
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const scoreResult = calculateScore(cvData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CV Generator</h1>
              <span className="ml-3 text-sm text-gray-500">Ultra Moderne</span>
            </div>
            <div className="flex items-center space-x-4">
              <ScoreBoard
                score={scoreResult.score}
                tips={scoreResult.tips}
                compact
              />
              <ExportButtons cvRef={cvRef} cvData={cvData} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Editor */}
        <div className="w-1/2 bg-white border-r overflow-y-auto">
          <div className="p-6 md:p-8 lg:p-10">
            {/* Section Navigation */}
            <div className="flex gap-1 flex-wrap md:flex-nowrap mb-8 bg-gray-100 rounded-lg p-1 overflow-x-auto">
              <button
                onClick={() => setActiveSection("personal")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "personal"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Personnel
              </button>
              <button
                onClick={() => setActiveSection("experience")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "experience"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Expérience
              </button>
              <button
                onClick={() => setActiveSection("skills")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "skills"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Brain className="w-4 h-4 mr-2" />
                Compétences
              </button>
              <button
                onClick={() => setActiveSection("education")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "education"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Formation
              </button>
              <button
                onClick={() => setActiveSection("certifications")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "certifications"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Award className="w-4 h-4 mr-2" />
                Certifications
              </button>
              <button
                onClick={() => setActiveSection("languages")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "languages"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Languages className="w-4 h-4 mr-2" />
                Langues
              </button>
              <button
                onClick={() => setActiveSection("references")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "references"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Références
              </button>
              <button
                onClick={() => setActiveSection("interests")}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === "interests"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Centres d’intérêt
              </button>
            </div>

            {/* Forms */}
            {activeSection === "personal" && (
              <PersonalForm
                personalInfo={cvData.personalInfo}
                onUpdate={(data) =>
                  dispatch({ type: "UPDATE_PERSONAL_INFO", payload: data })
                }
              />
            )}
            {activeSection === "experience" && (
              <ExperienceForm
                experiences={cvData.experiences}
                onAdd={(exp) =>
                  dispatch({ type: "ADD_EXPERIENCE", payload: exp })
                }
                onUpdate={(id, data) =>
                  dispatch({ type: "UPDATE_EXPERIENCE", payload: { id, data } })
                }
                onDelete={(id) =>
                  dispatch({ type: "DELETE_EXPERIENCE", payload: id })
                }
              />
            )}
            {activeSection === "skills" && (
              <SkillsForm
                skills={cvData.skills}
                onAdd={(skill) =>
                  dispatch({ type: "ADD_SKILL", payload: skill })
                }
                onUpdate={(id, data) =>
                  dispatch({ type: "UPDATE_SKILL", payload: { id, data } })
                }
                onDelete={(id) =>
                  dispatch({ type: "DELETE_SKILL", payload: id })
                }
              />
            )}
            {activeSection === "education" && (
              <EducationForm
                education={cvData.education}
                onAdd={(e) => dispatch({ type: "ADD_EDUCATION", payload: e })}
                onUpdate={(id, data) =>
                  dispatch({ type: "UPDATE_EDUCATION", payload: { id, data } })
                }
                onDelete={(id) =>
                  dispatch({ type: "DELETE_EDUCATION", payload: id })
                }
              />
            )}
            {activeSection === "certifications" && (
              <CertificationsForm
                certifications={cvData.certifications}
                onAdd={(c) =>
                  dispatch({ type: "ADD_CERTIFICATION", payload: c })
                }
                onUpdate={(id, data) =>
                  dispatch({
                    type: "UPDATE_CERTIFICATION",
                    payload: { id, data },
                  })
                }
                onDelete={(id) =>
                  dispatch({ type: "DELETE_CERTIFICATION", payload: id })
                }
              />
            )}
            {activeSection === "languages" && (
              <LanguagesForm
                languages={cvData.languages}
                onAdd={(l) => dispatch({ type: "ADD_LANGUAGE", payload: l })}
                onUpdate={(id, data) =>
                  dispatch({ type: "UPDATE_LANGUAGE", payload: { id, data } })
                }
                onDelete={(id) =>
                  dispatch({ type: "DELETE_LANGUAGE", payload: id })
                }
              />
            )}
            {activeSection === "references" && (
              <ReferencesForm
                references={cvData.references}
                onAdd={(r) => dispatch({ type: "ADD_REFERENCE", payload: r })}
                onUpdate={(id, data) =>
                  dispatch({ type: "UPDATE_REFERENCE", payload: { id, data } })
                }
                onDelete={(id) =>
                  dispatch({ type: "DELETE_REFERENCE", payload: id })
                }
              />
            )}
            {activeSection === "interests" && (
              <InterestsForm
                interests={cvData.interests}
                onAdd={(i) => dispatch({ type: "ADD_INTEREST", payload: i })}
                onDelete={(id) =>
                  dispatch({ type: "DELETE_INTEREST", payload: id })
                }
              />
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6 md:p-8 lg:p-10">
            <CVPreview cvData={cvData} cvRef={cvRef} />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface onAICommand={handleAICommand} messages={chatMessages} />
    </div>
  );
}

export default App;
