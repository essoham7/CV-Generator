import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { CVData } from '../types/cv.types';
import { stripTags, sanitizeHTML } from './sanitize';

const heading = (text: string, level: HeadingLevel) =>
  new Paragraph({ text, heading: level, spacing: { after: 200 } });

const para = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text })],
    spacing: { after: 120 },
  });

const bullet = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text })],
    bullet: { level: 0 },
  });

const parseHtmlToParagraphs = (html: string): Paragraph[] => {
  if (!html) return [];
  const clean = sanitizeHTML(html);
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  const result: Paragraph[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === 'P') {
        const text = (el.textContent || '').trim();
        if (text) result.push(para(text));
        return;
      }
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        Array.from(el.querySelectorAll('li')).forEach((li) => {
          const text = (li.textContent || '').trim();
          if (text) result.push(bullet(text));
        });
        return;
      }
      Array.from(el.childNodes).forEach(walk);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').trim();
      if (text) result.push(para(text));
    }
  };
  Array.from(doc.body.childNodes).forEach(walk);
  return result.length ? result : [para(stripTags(clean))];
};

export const buildCVDoc = async (cvData: CVData): Promise<Blob> => {
  const sections: any[] = [];
  const primary = (cvData.primaryColor || '#1e293b').replace('#', '').toUpperCase();
  const white = 'FFFFFF';

  // Header with colored band (table for background color)
  const nameText = cvData.personalInfo.name || 'Votre Nom';
  const titleText = cvData.personalInfo.title || '';
  const contacts = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    ...(cvData.personalInfo.socials || []).map((s) => s.url),
  ]
    .filter(Boolean)
    .join(' • ');

  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: primary },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: nameText, bold: true, size: 48, color: white })],
                  spacing: { after: 80 },
                }),
                titleText
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: titleText, italics: true, size: 28, color: white })],
                      spacing: { after: 80 },
                    })
                  : new Paragraph({}),
                contacts
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: contacts, size: 20, color: white })],
                      spacing: { after: 120 },
                    })
                  : new Paragraph({}),
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
        children: [new TextRun({ text: 'À propos', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    sections.push(para(cvData.personalInfo.summary.trim()));
  }

  // Experience
  if (cvData.experiences.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Expérience Professionnelle', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    cvData.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
            new TextRun({ text: ` — ${exp.company}`, size: 24 }),
          ],
        }),
      );
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 18, color: '666666' })],
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
        children: [new TextRun({ text: 'Compétences', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    const text = cvData.skills.map((s) => `${s.name} (${s.level}%)`).join(' • ');
    sections.push(para(text));
  }

  // Education
  if (cvData.education.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Formation', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    cvData.education.forEach((e) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.degree, bold: true, size: 24 }),
            new TextRun({ text: ` — ${e.institution}`, size: 24 }),
            new TextRun({ text: ` (${e.period})`, size: 22, color: '666666' }),
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
        children: [new TextRun({ text: 'Certifications', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    cvData.certifications.forEach((c) => {
      sections.push(para(`${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`));
    });
  }

  // Languages
  if (cvData.languages.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Langues', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    sections.push(para(cvData.languages.map((l) => `${l.name} (${l.level}%)`).join(' • ')));
  }

  // References
  if (cvData.references.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Références', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    cvData.references.forEach((r) => sections.push(para(`${r.name} — ${r.contact}`)));
  }

  // Interests
  if (cvData.interests.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Centres d’intérêt', bold: true, size: 28, color: primary })],
        spacing: { after: 200 },
      }),
    );
    sections.push(para(cvData.interests.map((i) => i.name).join(' • ')));
  }

  const doc = new Document({
    sections: [{ children: sections }],
  });
  return Packer.toBlob(doc);
};
