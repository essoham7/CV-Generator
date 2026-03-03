import React from "react";
import { CVData, CVPreviewProps } from "../types/cv.types";
import { Mail, Phone, Calendar, Award, Users, Globe } from "lucide-react";
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
import { sanitizeHTML } from "../utils/sanitize";

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, cvRef }) => {
  const {
    personalInfo,
    experiences,
    skills,
    education,
    certifications,
    references,
    languages,
    interests,
    primaryColor,
  } = cvData;

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={cvRef}
        className="bg-white rounded-lg shadow-xl overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header Section */}
        <div
          className="relative px-8 md:px-10 lg:px-12 py-12 md:py-14 lg:py-16 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center space-x-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              {personalInfo.photo ? (
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white bg-opacity-20 border-4 border-white border-opacity-50 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white opacity-60">
                    {personalInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {personalInfo.name || "Votre Nom"}
              </h1>
              <p className="text-xl mb-4 opacity-90">
                {personalInfo.title || "Votre Poste"}
              </p>

              <div className="space-y-2 text-sm opacity-80">
                {personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.socials && personalInfo.socials.length > 0 && (
                  <div className="flex items-center space-x-3 mt-2">
                    {personalInfo.socials.map((s) => {
                      const u = s.url.toLowerCase();
                      const icon = u.includes("github.com")
                        ? SiGithub
                        : u.includes("linkedin.com")
                          ? FaLinkedin
                          : u.includes("twitter.com") || u.includes("x.com")
                            ? SiX
                            : u.includes("facebook.com")
                              ? SiFacebook
                              : u.includes("instagram.com")
                                ? SiInstagram
                                : u.includes("dribbble.com")
                                  ? SiDribbble
                                  : u.includes("gitlab.com")
                                    ? SiGitlab
                                    : u.includes("youtube.com")
                                      ? SiYoutube
                                      : Globe;
                      const I = icon;
                      return (
                        <a
                          key={s.id}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/90 hover:text-white"
                          title={s.url}
                        >
                          <I className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 md:px-10 lg:px-12 py-10 md:py-12">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                À propos
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience Timeline */}
          {experiences.length > 0 && (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Expérience Professionnelle
              </h2>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative pl-8">
                    {/* Timeline line */}
                    {index !== experiences.length - 1 && (
                      <div
                        className="absolute left-3 top-8 bottom-0 w-0.5"
                        style={{ backgroundColor: primaryColor, opacity: 0.3 }}
                      />
                    )}

                    {/* Timeline dot */}
                    <div
                      className="absolute left-1 top-2 w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: primaryColor }}
                    />

                    <div className="bg-gray-50 rounded-lg p-6 ml-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-gray-600 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                      </div>
                      <div
                        className="text-gray-700 text-sm leading-relaxed mt-3 space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHTML(exp.description),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Compétences
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {skill.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${skill.level}%`,
                            backgroundColor: primaryColor,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Formation
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between"
                  >
                    <div className="flex items-start">
                      <div
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {edu.degree}
                        </p>
                        <p className="text-sm text-gray-600">
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{edu.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Certifications
              </h2>
              <div className="space-y-4">
                {certifications.map((c) => (
                  <div key={c.id} className="flex items-start">
                    <Award className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {c.issuer || ""} {c.date ? `• ${c.date}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Langues
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((l) => (
                  <div key={l.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {l.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${l.level}%`,
                            backgroundColor: primaryColor,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {l.level}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Références */}
          {references.length > 0 && (
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Références
              </h2>
              <div className="space-y-3">
                {references.map((r) => (
                  <div key={r.id} className="flex items-start">
                    <Users className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {r.name}
                      </p>
                      <p className="text-xs text-gray-600">{r.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centres d’intérêt */}
          {interests.length > 0 && (
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Centres d’intérêt
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span
                    key={i.id}
                    className="px-3 py-1.5 text-sm bg-gray-100 border rounded-full text-gray-700"
                  >
                    {i.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
