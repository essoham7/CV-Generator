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
} from "docx";
import { CVData } from "../../types/cv.types";
import {
  parseHtmlToParagraphs,
  base64ToArrayBuffer,
  detectProvider,
} from "./docxUtils";

export const buildModernLayout = (cvData: CVData) => {
  const sections: (Paragraph | Table)[] = [];
  const primary = (cvData.primaryColor || "#1e293b")
    .replace("#", "")
    .toUpperCase();
  const white = "FFFFFF";
  const gray = "666666";

  const nameText = cvData.personalInfo.name || "Votre Nom";
  const titleText = cvData.personalInfo.title || "";
  const contactsText = [cvData.personalInfo.email, cvData.personalInfo.phone]
    .filter(Boolean)
    .join(" • ");

  const socialParagraph =
    cvData.personalInfo.socials && cvData.personalInfo.socials.length
      ? new Paragraph({
          alignment: AlignmentType.CENTER,
          children: cvData.personalInfo.socials
            .filter((s) => !!s.url)
            .flatMap((s, idx) => {
              const label = detectProvider(s.url);
              const link = new ExternalHyperlink({
                link: s.url,
                children: [
                  new TextRun({ text: label, bold: true, color: white }),
                ],
              });
              const spacer =
                idx < (cvData.personalInfo.socials?.length || 0) - 1
                  ? [new TextRun({ text: "   " })]
                  : [];
              return [link, ...spacer];
            }),
          spacing: { after: 80 },
        })
      : new Paragraph({});

  const photoArray = cvData.personalInfo.photo
    ? base64ToArrayBuffer(cvData.personalInfo.photo)
    : null;

  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: primary },
              children: [
                photoArray
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: photoArray.buffer,
                          transformation: { width: 128, height: 128 },
                        } as any), // eslint-disable-line @typescript-eslint/no-explicit-any
                      ],
                      spacing: { after: 80 },
                    })
                  : new Paragraph({}),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              shading: { fill: primary },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: nameText,
                      bold: true,
                      size: 52, // 26pt
                      color: white,
                    }),
                  ],
                  spacing: { after: 60 },
                }),
                titleText
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: titleText,
                          italics: true,
                          size: 32, // 16pt
                          color: white,
                        }),
                      ],
                      spacing: { after: 40 },
                    })
                  : new Paragraph({}),
                contactsText
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: contactsText,
                          size: 20,
                          color: white,
                        }),
                      ],
                      spacing: { after: 40 },
                    })
                  : new Paragraph({}),
                socialParagraph,
              ],
            }),
          ],
        }),
      ],
    }),
  );
  sections.push(new Paragraph({ spacing: { after: 200 } }));

  // Summary
  if (cvData.personalInfo.summary?.trim()) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "À propos",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: cvData.personalInfo.summary.trim() })],
        spacing: { after: 120 },
      }),
    );
  }

  // Experience
  if (cvData.experiences.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Expérience Professionnelle",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    cvData.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 28 }), // 14pt
            new TextRun({ text: ` — ${exp.company}`, size: 28 }), // 14pt
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} - ${exp.endDate}`,
              size: 18,
              color: gray,
            }),
          ],
        }),
      );
      parseHtmlToParagraphs(exp.description).forEach((p) => sections.push(p));
      sections.push(new Paragraph({})); // spacer
    });
  }

  // Skills
  if (cvData.skills.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Compétences",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    const text = cvData.skills
      .map((s) => `${s.name} (${s.level}%)`)
      .join(" • ");
    sections.push(
      new Paragraph({
        children: [new TextRun({ text })],
        spacing: { after: 120 },
      }),
    );
  }

  // Education
  if (cvData.education.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Formation",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    cvData.education.forEach((e) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.degree, bold: true, size: 28 }), // 14pt
            new TextRun({ text: ` — ${e.institution}`, size: 28 }), // 14pt
            new TextRun({ text: ` (${e.period})`, size: 24, color: gray }), // 12pt
          ],
          spacing: { after: 120 },
        }),
      );
    });
  }

  // Certifications
  if (cvData.certifications.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Certifications",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    cvData.certifications.forEach((c) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.date ? ` (${c.date})` : ""}`,
            }),
          ],
          spacing: { after: 120 },
        }),
      );
    });
  }

  // Languages
  if (cvData.languages.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Langues",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.languages
              .map((l) => `${l.name} (${l.level}%)`)
              .join(" • "),
          }),
        ],
        spacing: { after: 120 },
      }),
    );
  }

  // References
  if (cvData.references.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Références",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    cvData.references.forEach((r) =>
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `${r.name} — ${r.contact}` })],
          spacing: { after: 120 },
        }),
      ),
    );
  }

  // Interests
  if (cvData.interests.length) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Centres d’intérêt",
            bold: true,
            size: 32, // 16pt
            color: primary,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.interests.map((i) => i.name).join(" • "),
          }),
        ],
        spacing: { after: 120 },
      }),
    );
  }

  return sections;
};
