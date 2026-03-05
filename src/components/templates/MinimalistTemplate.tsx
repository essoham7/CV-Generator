import React from "react";
import { CVData } from "../../types/cv.types";

import { sanitizeHTML } from "../../utils/sanitize";

interface TemplateProps {
  cvData: CVData;
}

const MinimalistTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const { personalInfo, experiences, skills, education, languages, interests } =
    cvData;

  const fontStyle = { fontFamily: cvData.fontFamily || "Inter, sans-serif" };

  return (
    <div
      className="bg-white p-12 md:p-16 shadow-xl min-h-[297mm] max-w-4xl mx-auto"
      style={fontStyle}
    >
      {/* Header - Left Aligned, Name Big */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter leading-none">
          {personalInfo.name.split(" ").map((n, i) => (
            <span key={i} className={i === 1 ? "text-gray-400" : ""}>
              {n}{" "}
            </span>
          ))}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-light mb-8">
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400 uppercase tracking-widest font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.socials?.map((s) => (
            <a
              key={s.id}
              href={s.url}
              className="hover:text-gray-900 transition-colors"
            >
              {new URL(s.url).hostname}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column (Main Content) */}
        <div className="md:col-span-8 space-y-16">
          {personalInfo.summary && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                À propos
              </h3>
              <p className="text-lg text-gray-800 leading-relaxed font-light">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
                Expérience
              </h3>
              <div className="space-y-12">
                {experiences.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {exp.position}
                      </h4>
                      <span className="text-sm text-gray-400 font-medium">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <div className="text-base text-gray-500 font-medium mb-4">
                      {exp.company}
                    </div>
                    <div
                      className="text-gray-600 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(exp.description),
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
                Formation
              </h3>
              <div className="space-y-8">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        {edu.institution}
                      </h4>
                      <span className="text-sm text-gray-400">
                        {edu.period}
                      </span>
                    </div>
                    <div className="text-gray-500">{edu.degree}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Skills & Meta) */}
        <div className="md:col-span-4 space-y-12 border-l border-gray-100 pl-8 md:pl-12">
          {skills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Compétences
              </h3>
              <ul className="space-y-3">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="text-sm text-gray-600 font-medium flex justify-between"
                  >
                    <span>{skill.name}</span>
                    <span className="text-gray-300">{skill.level}%</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Langues
              </h3>
              <ul className="space-y-3">
                {languages.map((lang) => (
                  <li
                    key={lang.id}
                    className="text-sm text-gray-600 font-medium"
                  >
                    {lang.name}{" "}
                    <span className="text-gray-300 ml-1">/ {lang.level}%</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {interests.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Intérêts
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span
                    key={i.id}
                    className="text-sm text-gray-500 border border-gray-200 px-2 py-1 rounded-md"
                  >
                    {i.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistTemplate;
