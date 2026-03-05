import React from "react";
import { CVPreviewProps } from "../types/cv.types";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import SidebarTemplate from "./templates/SidebarTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, cvRef }) => {
  const renderTemplate = () => {
    // Mapping of template IDs to components
    // "classic", "traditional", "polished", "calligraphic", "elegant" -> ClassicTemplate
    // "professional", "corporate", "industrial", "authority" -> SidebarTemplate
    // "minimalist", "clear", "essential" -> MinimalistTemplate
    // "modern", "prime-ats", "balanced", "header-ats" (and fallback) -> ModernTemplate

    const id = cvData.templateId || "modern";

    switch (id) {
      case "classic":
      case "traditional":
      case "polished":
      case "calligraphic":
      case "elegant":
        return <ClassicTemplate cvData={cvData} />;

      case "professional":
      case "corporate":
      case "industrial":
      case "authority":
        return <SidebarTemplate cvData={cvData} />;

      case "minimalist":
      case "clear":
      case "essential":
        return <MinimalistTemplate cvData={cvData} />;

      case "modern":
      case "prime-ats":
      case "balanced":
      case "header-ats":
      default:
        return <ModernTemplate cvData={cvData} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div ref={cvRef} className="print:m-0">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CVPreview;
