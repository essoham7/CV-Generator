import React from "react";
import { CVData } from "../../types/cv.types";
import { Mail, Phone, Calendar, MapPin, Globe } from "lucide-react";
import { sanitizeHTML } from "../../utils/sanitize";

interface TemplateProps {
  cvData: CVData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const {
    personalInfo,
    experiences,
    skills,
    education,
    certifications,
    languages,
    interests,
    primaryColor,
  } = cvData;

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-4 border-b-2 pb-1" style={{ borderColor: primaryColor }}>
      <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
        {title}
      </h2>
    </div>
  );

  return (
    <div
      className="bg-white p-8 md:p-12 shadow-xl min-h-[297mm]"
      style={{ fontFamily: cvData.fontFamily || "Georgia, serif" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 uppercase">
          {personalInfo.name}
        </h1>
        <p className="text-xl text-gray-600 mb-4 font-medium">
          {personalInfo.title}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.socials?.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex items-center hover:text-gray-900">
              <Globe className="w-4 h-4 mr-1" />
              <span>{new URL(s.url).hostname}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <SectionTitle title="Profil Professionnel" />
          <p className="text-gray-700 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <SectionTitle title="Expérience Professionnelle" />
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-base font-medium text-gray-700 mb-2 italic">
                  {exp.company}
                </div>
                <div
                  className="text-gray-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(exp.description) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <SectionTitle title="Formation" />
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-bold text-gray-900">
                    {edu.institution}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {edu.period}
                  </span>
                </div>
                <div className="text-gray-700">
                  {edu.degree}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skills.length > 0 && (
          <div>
            <SectionTitle title="Compétences" />
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {skills.map((skill) => (
                <li key={skill.id}>
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-gray-500 text-sm ml-2">({skill.level}%)</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <SectionTitle title="Langues" />
            <ul className="space-y-2">
              {languages.map((lang) => (
                <li key={lang.id} className="flex justify-between items-center text-gray-700">
                  <span>{lang.name}</span>
                  <div className="w-24 bg-gray-200 h-1.5 rounded-full">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${lang.level}%`, backgroundColor: primaryColor }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Interests */}
      {interests.length > 0 && (
        <div className="mt-8">
           <SectionTitle title="Centres d'intérêt" />
           <p className="text-gray-700">
             {interests.map(i => i.name).join(" • ")}
           </p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;