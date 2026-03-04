import React, { useReducer, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
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
  | { type: "UPDATE_PRIMARY_COLOR"; payload: string }
  | { type: "UPDATE_FONT_FAMILY"; payload: string }
  | { type: "LOAD_TEMPLATE"; payload: CVData };

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
  fontFamily: "Inter, system-ui, sans-serif",
  templateId: "modern",
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
    case "UPDATE_FONT_FAMILY":
      return {
        ...state,
        fontFamily: action.payload,
      };
    case "LOAD_TEMPLATE":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

function EditorView({
  cvData,
  dispatch,
  chatMessages,
  setChatMessages,
  cvRef,
  isLoading,
  setIsLoading,
}: {
  cvData: CVData;
  dispatch: React.Dispatch<CVAction>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  cvRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
  const scoreResult = calculateScore(cvData);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Brand & Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:bg-blue-700 transition-colors">
                  CV
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-none">
                    CV Generator
                  </h1>
                  <span className="text-xs text-blue-600 font-medium">
                    Ultra Moderne
                  </span>
                </div>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/templates"
                  className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Modèles
                </Link>
              </nav>
            </div>

            {/* Right: Tools & Actions */}
            <div className="flex items-center gap-4">
              {/* Style Tools */}
              <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Police</span>
                  <select
                    value={cvData.fontFamily || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FONT_FAMILY",
                        payload: e.target.value,
                      })
                    }
                    className="text-sm bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-medium cursor-pointer min-w-[100px]"
                    aria-label="Police"
                  >
                    <option value="Inter, system-ui, sans-serif">Inter</option>
                    <option value="Arial, Helvetica, sans-serif">Arial</option>
                    <option value="Roboto, Arial, sans-serif">Roboto</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Couleur</span>
                  <div className="relative flex items-center">
                    <input
                      type="color"
                      value={cvData.primaryColor}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PRIMARY_COLOR",
                          payload: e.target.value,
                        })
                      }
                      className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden cursor-pointer shadow-sm"
                      title="Couleur principale"
                    />
                    <div 
                      className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Score & Export */}
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden sm:block">
                  <ScoreBoard
                    score={scoreResult.score}
                    tips={scoreResult.tips}
                    compact
                  />
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <ExportButtons cvRef={cvRef} cvData={cvData} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Left Panel - Editor */}
        <div className="w-full lg:w-1/2 bg-white/95 backdrop-blur border-r overflow-y-auto">
          <div className="p-6 md:p-8 lg:p-10">
            {/* Section Navigation */}
            <div className="sticky top-0 z-10 mb-8 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm">
              <div className="flex gap-1 flex-wrap md:flex-nowrap overflow-x-auto">
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
        <div className="w-full lg:w-1/2 bg-gray-50 overflow-y-auto">
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

function App() {
  const [cvData, dispatch] = useReducer(cvReducer, initialCVData);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <EditorView
              cvData={cvData}
              dispatch={dispatch}
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              cvRef={cvRef}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route
          path="/templates"
          element={
            <TemplatesPage
              onUseTemplate={(tpl) => {
                dispatch({ type: "LOAD_TEMPLATE", payload: tpl });
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}

import TemplatesPage from "./pages/TemplatesPage";

export default App;
