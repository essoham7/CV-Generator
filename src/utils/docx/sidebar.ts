import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ExternalHyperlink,
  ImageRun,
  BorderStyle,
} from "docx";
import { CVData } from "../../types/cv.types";
import {
  para,
  parseHtmlToParagraphs,
  base64ToArrayBuffer,
  detectProvider,
} from "./docxUtils";

export const buildSidebarLayout = (cvData: CVData) => {
  const primary = (cvData.primaryColor || "#1e293b")
    .replace("#", "")
    .toUpperCase();
  const white = "FFFFFF";
  const gray = "666666";

  const photoArray = cvData.personalInfo.photo
    ? base64ToArrayBuffer(cvData.personalInfo.photo)
    : null;

  // Sidebar Content (Left Column)
  const sidebarContent: any[] = [];

  // Photo
  if (photoArray) {
    sidebarContent.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: photoArray as ArrayBuffer,
            transformation: { width: 120, height: 120 },
          }),
        ],
        spacing: { after: 200 },
      }),
    );
  }

  // Name & Title in Sidebar
  sidebarContent.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (cvData.personalInfo.name || "Votre Nom").toUpperCase(),
          bold: true,
          size: 40, // 20pt
          color: white,
        }),
      ],
      spacing: { after: 100 },
    }),
  );

  sidebarContent.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (cvData.personalInfo.title || "").toUpperCase(),
          size: 24, // 12pt
          color: white,
        }),
      ],
      spacing: { after: 400 },
    }),
  );

  // Contact Info
  sidebarContent.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "CONTACT",
          bold: true,
          size: 28, // 14pt
          color: white,
        }),
      ],
      spacing: { after: 100 },
      border: {
        bottom: { color: "FFFFFF", space: 1, value: BorderStyle.SINGLE, size: 6 },
      },
    }),
  );

  const contactDetails = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
  ].filter(Boolean);

  contactDetails.forEach((detail) => {
    sidebarContent.push(
      new Paragraph({
        children: [new TextRun({ text: detail!, color: white, size: 18 })],
        spacing: { after: 100 },
      }),
    );
  });

  if (cvData.personalInfo.socials && cvData.personalInfo.socials.length) {
    cvData.personalInfo.socials.forEach((s) => {
      if (!s.url) return;
      const label = detectProvider(s.url);
      sidebarContent.push(
        new Paragraph({
          children: [
            new ExternalHyperlink({
              link: s.url,
              children: [
                new TextRun({ text: `${label}`, color: white, size: 18 }),
              ],
            }),
          ],
          spacing: { after: 100 },
        }),
      );
    });
  }
  sidebarContent.push(new Paragraph({ spacing: { after: 400 } }));

  // Skills in Sidebar
  if (cvData.skills.length) {
    sidebarContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "COMPÉTENCES",
            bold: true,
            size: 28, // 14pt
            color: white,
          }),
        ],
        spacing: { after: 100 },
        border: {
          bottom: { color: "FFFFFF", space: 1, value: BorderStyle.SINGLE, size: 6 },
        },
      }),
    );

    cvData.skills.forEach((skill) => {
      sidebarContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: skill.name, color: white, size: 18, bold: true }),
          ],
        }),
      );
      sidebarContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Niveau: ${skill.level}%`,
              color: white,
              size: 16,
            }),
          ],
          spacing: { after: 100 },
        }),
      );
    });
    sidebarContent.push(new Paragraph({ spacing: { after: 400 } }));
  }

  // Languages in Sidebar
  if (cvData.languages.length) {
    sidebarContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "LANGUES",
            bold: true,
            size: 28, // 14pt
            color: white,
          }),
        ],
        spacing: { after: 100 },
        border: {
          bottom: { color: "FFFFFF", space: 1, value: BorderStyle.SINGLE, size: 6 },
        },
      }),
    );
    cvData.languages.forEach((l) => {
      sidebarContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: l.name, color: white, size: 18 }),
            new TextRun({ text: ` (${l.level}%)`, color: white, size: 16 }),
          ],
          spacing: { after: 80 },
        }),
      );
    });
  }

  // Main Content (Right Column)
  const mainContent: any[] = [];

  // Summary
  if (cvData.personalInfo.summary?.trim()) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFIL",
            bold: true,
            size: 28,
            color: primary,
          }),
        ],
        spacing: { after: 100 },
        border: {
          bottom: { color: primary, space: 1, value: BorderStyle.SINGLE, size: 12 },
        },
      }),
    );
    mainContent.push(
      new Paragraph({
        children: [new TextRun({ text: cvData.personalInfo.summary.trim() })],
        spacing: { after: 300 },
      }),
    );
  }

  // Experience
  if (cvData.experiences.length) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "EXPÉRIENCE PROFESSIONNELLE",
            bold: true,
            size: 28,
            color: primary,
          }),
        ],
        spacing: { after: 200 },
        border: {
          bottom: { color: primary, space: 1, value: BorderStyle.SINGLE, size: 12 },
        },
      }),
    );

    cvData.experiences.forEach((exp) => {
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
          ],
        }),
      );
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, bold: true, size: 20, color: gray }),
            new TextRun({ text: " | ", color: gray }),
            new TextRun({
              text: `${exp.startDate} - ${exp.endDate}`,
              size: 20,
              color: gray,
            }),
          ],
          spacing: { after: 100 },
        }),
      );
      parseHtmlToParagraphs(exp.description).forEach((p) => mainContent.push(p));
      mainContent.push(new Paragraph({ spacing: { after: 200 } }));
    });
  }

  // Education
  if (cvData.education.length) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "FORMATION",
            bold: true,
            size: 28,
            color: primary,
          }),
        ],
        spacing: { after: 200 },
        border: {
          bottom: { color: primary, space: 1, value: BorderStyle.SINGLE, size: 12 },
        },
      }),
    );

    cvData.education.forEach((edu) => {
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 24 }),
          ],
        }),
      );
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, size: 22 }),
            new TextRun({ text: ` | ${edu.period}`, color: gray, size: 20 }),
          ],
          spacing: { after: 120 },
        }),
      );
    });
    mainContent.push(new Paragraph({ spacing: { after: 200 } }));
  }

  // Certifications
  if (cvData.certifications.length) {
    mainContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "CERTIFICATIONS",
            bold: true,
            size: 28,
            color: primary,
          }),
        ],
        spacing: { after: 200 },
        border: {
          bottom: { color: primary, space: 1, value: BorderStyle.SINGLE, size: 12 },
        },
      }),
    );
    cvData.certifications.forEach((c) => {
      mainContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.date ? ` (${c.date})` : ""}`,
            }),
          ],
          spacing: { after: 100 },
        }),
      );
    });
  }

  // Layout Table
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: primary },
              children: sidebarContent,
              margins: { top: 400, bottom: 400, left: 200, right: 200 },
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: mainContent,
              margins: { top: 400, bottom: 400, left: 400, right: 400 },
            }),
          ],
        }),
      ],
    }),
  ];
};
