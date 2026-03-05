import { Document, Packer } from "docx";
import { CVData } from "../types/cv.types";
import { buildModernLayout } from "./docx/modern";
import { buildSidebarLayout } from "./docx/sidebar";
import { buildClassicLayout } from "./docx/classic";
import { buildMinimalistLayout } from "./docx/minimalist";

export const buildCVDoc = async (cvData: CVData): Promise<Blob> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sections: any[] = [];
  const id = cvData.templateId || "modern";

  switch (id) {
    case "professional":
    case "corporate":
    case "industrial":
    case "authority":
      sections = buildSidebarLayout(cvData);
      break;

    case "classic":
    case "traditional":
    case "polished":
    case "calligraphic":
    case "elegant":
      sections = buildClassicLayout(cvData);
      break;

    case "minimalist":
    case "clear":
    case "essential":
      sections = buildMinimalistLayout(cvData);
      break;

    case "modern":
    case "prime-ats":
    case "balanced":
    case "header-ats":
    default:
      sections = buildModernLayout(cvData);
      break;
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: sections,
      },
    ],
  });
  return Packer.toBlob(doc);
};
