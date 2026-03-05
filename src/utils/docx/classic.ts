import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { CVData } from "../../types/cv.types";
import { parseHtmlToParagraphs, detectProvider } from "./docxUtils";

export const buildClassicLayout = (cvData: CVData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: any[] = [];
  const primary = (cvData.primaryColor || "#2c3e50")
    .replace("#", "")
    .toUpperCase();
  // const white = "FFFFFF"; // Unused
  const gray = "666666";

  // const photoArray = cvData.personalInfo.photo // Unused in classic layout
  //   ? base64ToArrayBuffer(cvData.personalInfo.photo)
  //   : null;

  // Header
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (cvData.personalInfo.name || "Votre Nom").toUpperCase(),
          bold: true,
          size: 52, // 26pt
          color: primary,
        }),
      ],
      spacing: { after: 120 },
    }),
  );

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (cvData.personalInfo.title || "").toUpperCase(),
          size: 28, // 14pt
          color: gray,
        }),
      ],
      spacing: { after: 200 },
    }),
  );

  // Contacts
  const contacts = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    ...(cvData.personalInfo.socials || [])
      .filter((s) => s.url)
      .map((s) => detectProvider(s.url)),
  ]
    .filter(Boolean)
    .join(" • ");

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: contacts, size: 20, color: gray })],
      spacing: { after: 400 },
      border: {
        bottom: {
          color: primary,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
    }),
  );

  // Summary
  if (cvData.personalInfo.summary?.trim()) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFIL PROFESSIONNEL",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 120 },
      }),
    );
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: cvData.personalInfo.summary.trim() })],
        spacing: { after: 300 },
      }),
    );
  }

  // Experience
  if (cvData.experiences.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "EXPÉRIENCE PROFESSIONNELLE",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 120, before: 200 },
        border: {
          bottom: {
            color: primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    );

    cvData.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: ` | ${exp.company}`,
              italics: true,
              size: 24,
              color: gray,
            }),
          ],
          spacing: { before: 120 },
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} - ${exp.endDate}`,
              size: 20,
              color: gray,
            }),
          ],
          spacing: { after: 80 },
        }),
      );
      parseHtmlToParagraphs(exp.description).forEach((p) => sections.push(p));
    });
  }

  // Education
  if (cvData.education.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "FORMATION",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 120, before: 300 },
        border: {
          bottom: {
            color: primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    );

    cvData.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 24 }),
            new TextRun({ text: ` | ${edu.period}`, size: 22, color: gray }),
          ],
          spacing: { before: 120 },
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, italics: true, size: 22 }),
          ],
        }),
      );
    });
  }

  // Skills & Languages (2 Columns)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const skillsContent: any[] = [];
  if (cvData.skills.length) {
    skillsContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "COMPÉTENCES",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 120 },
        border: {
          bottom: {
            color: primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    );
    const text = cvData.skills
      .map((s) => `${s.name} (${s.level}%)`)
      .join(" • ");
    skillsContent.push(new Paragraph({ children: [new TextRun({ text })] }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languagesContent: any[] = [];
  if (cvData.languages.length) {
    languagesContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "LANGUES",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 120 },
        border: {
          bottom: {
            color: primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    );
    const text = cvData.languages
      .map((l) => `${l.name} (${l.level}%)`)
      .join(" • ");
    languagesContent.push(new Paragraph({ children: [new TextRun({ text })] }));
  }

  if (skillsContent.length || languagesContent.length) {
    sections.push(new Paragraph({ spacing: { before: 300 } }));
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: skillsContent,
                margins: { right: 200 },
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: languagesContent,
                margins: { left: 200 },
              }),
            ],
          }),
        ],
      }),
    );
  }

  return sections;
};
