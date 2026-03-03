import React, { useRef, useState } from "react";
import { PersonalInfo } from "../types/cv.types";
import {
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  Plus,
  Trash2,
  Globe,
  Link,
} from "lucide-react";
import {
  SiGithub,
  SiX,
  SiFacebook,
  SiInstagram,
  SiDribbble,
  SiGitlab,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { isValidPhone } from "../utils/scoreCalculator";
import { stripTags } from "../utils/sanitize";

interface PersonalFormProps {
  personalInfo: PersonalInfo;
  onUpdate: (data: Partial<PersonalInfo>) => void;
}

const PersonalForm: React.FC<PersonalFormProps> = ({
  personalInfo,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du type de fichier
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide");
        return;
      }

      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        onUpdate({ photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({ [field]: value });
  };

  const phoneIsInvalid =
    personalInfo.phone.trim().length > 0 && !isValidPhone(personalInfo.phone);

  const [socialUrl, setSocialUrl] = useState("");

  const detectProvider = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes("github.com")) return "github";
    if (u.includes("linkedin.com")) return "linkedin";
    if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
    if (u.includes("facebook.com")) return "facebook";
    if (u.includes("instagram.com")) return "instagram";
    if (u.includes("dribbble.com")) return "dribbble";
    if (u.includes("gitlab.com")) return "gitlab";
    if (u.includes("youtube.com")) return "youtube";
    return "globe";
  };

  const SocialIcon = ({ url }: { url: string }) => {
    const p = detectProvider(url);
    if (p === "github") return <SiGithub className="w-4 h-4" />;
    if (p === "linkedin") return <FaLinkedin className="w-4 h-4" />;
    if (p === "twitter") return <SiX className="w-4 h-4" />;
    if (p === "facebook") return <SiFacebook className="w-4 h-4" />;
    if (p === "instagram") return <SiInstagram className="w-4 h-4" />;
    if (p === "dribbble") return <SiDribbble className="w-4 h-4" />;
    if (p === "gitlab") return <SiGitlab className="w-4 h-4" />;
    if (p === "youtube") return <SiYoutube className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const addSocial = () => {
    const val = socialUrl.trim();
    if (!val) return;
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(val)) return;
    const next = [
      ...(personalInfo.socials || []),
      { id: Date.now().toString(), url: val },
    ];
    onUpdate({ socials: next });
    setSocialUrl("");
  };

  const removeSocial = (id: string) => {
    const next = (personalInfo.socials || []).filter((s) => s.id !== id);
    onUpdate({ socials: next });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informations Personnelles
        </h2>
        <p className="text-gray-600">
          Commencez par remplir vos informations de base
        </p>
      </div>

      {/* Photo Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nom complet
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Essoham SIBABI"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre professionnel
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Développeur Full Stack"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="essoham.sibabi@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Téléphone
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+228 90 12 34 56"
            inputMode="tel"
            autoComplete="tel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
              phoneIsInvalid
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {phoneIsInvalid && (
            <p className="text-xs text-red-600 mt-1">Entrez un numéro valide</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Réseaux sociaux
          </label>
          <div className="flex space-x-2 mb-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Link className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={addSocial}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              title="Ajouter"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {personalInfo.socials && personalInfo.socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {personalInfo.socials.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center px-3 py-1.5 bg-white border rounded-full text-sm text-gray-700"
                >
                  <span className="mr-2 text-gray-600">
                    <SocialIcon url={s.url} />
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline max-w-[180px] truncate"
                  >
                    {s.url.replace(/^https?:\/\/(www\.)?/i, "")}
                  </a>
                  <button
                    onClick={() => removeSocial(s.id)}
                    className="ml-2 text-gray-400 hover:text-red-600"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Summary (Rich Text) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Résumé professionnel
          </label>
          <textarea
            value={stripTags(personalInfo.summary)}
            onChange={(e) => onUpdate({ summary: e.target.value })}
            placeholder="Décrivez votre parcours professionnel et vos objectifs..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {stripTags(personalInfo.summary).length} caractères
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Astuces :</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Utilisez le chatbot pour modifier rapidement votre CV</li>
          <li>• Essayez : "Change la couleur principale en bleu"</li>
          <li>• Ou : "Reformule mon expérience chez Google"</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalForm;
