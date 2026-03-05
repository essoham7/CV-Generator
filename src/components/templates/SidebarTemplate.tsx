import React from "react";
import { CVData } from "../../types/cv.types";
import { Mail, Phone, Globe } from "lucide-react";
import { sanitizeHTML } from "../../utils/sanitize";

interface TemplateProps {
  cvData: CVData;
}

const SidebarTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const {
    personalInfo,
    experiences,
    skills,
    education,
    languages,
    interests,
    primaryColor,
  } = cvData;

  const SidebarSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="bg-white shadow-xl min-h-[297mm] flex flex-col md:flex-row font-sans">
      {/* Sidebar (Left) */}
      <div
        className="w-full md:w-1/3 text-white p-8"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="text-center mb-8">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/30 object-cover"
            />
          )}
          <h1 className="text-2xl font-bold uppercase leading-tight mb-2">
            {personalInfo.name}
          </h1>
          <p className="text-white/80 font-medium text-sm uppercase tracking-wide">
            {personalInfo.title}
          </p>
        </div>

        <div className="space-y-4 text-sm text-white/90 mb-8">
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.socials?.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="truncate">{new URL(s.url).hostname}</span>
            </a>
          ))}
        </div>

        {skills.length > 0 && (
          <SidebarSection title="Compétences">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-white/10 px-2 py-1 rounded text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </SidebarSection>
        )}

        {languages.length > 0 && (
          <SidebarSection title="Langues">
            <ul className="space-y-2 text-sm">
              {languages.map((lang) => (
                <li key={lang.id} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="opacity-70">{lang.level}%</span>
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {interests.length > 0 && (
          <SidebarSection title="Intérêts">
            <ul className="list-disc list-inside text-sm opacity-90">
              {interests.map((i) => (
                <li key={i.id}>{i.name}</li>
              ))}
            </ul>
          </SidebarSection>
        )}
      </div>

      {/* Main Content (Right) */}
      <div className="w-full md:w-2/3 p-8 md:p-12 bg-white text-gray-800">
        {personalInfo.summary && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold uppercase text-gray-800 mb-4 tracking-wider flex items-center gap-3">
              <span className="w-8 h-1 bg-gray-800"></span> Profil
            </h2>
            <p className="text-gray-600 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold uppercase text-gray-800 mb-6 tracking-wider flex items-center gap-3">
              <span className="w-8 h-1 bg-gray-800"></span> Expérience
            </h2>
            <div className="border-l-2 border-gray-200 ml-3 pl-6 space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-400"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-gray-600 font-semibold mb-2">
                    {exp.company}
                  </div>
                  <div
                    className="text-gray-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(exp.description),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold uppercase text-gray-800 mb-6 tracking-wider flex items-center gap-3">
              <span className="w-8 h-1 bg-gray-800"></span> Formation
            </h2>
            <div className="grid gap-6">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">
                      {edu.institution}
                    </h3>
                    <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-gray-700 font-medium">{edu.degree}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarTemplate;
