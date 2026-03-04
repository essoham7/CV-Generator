import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ExternalHyperlink, ImageRun } from 'docx';
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
  const gray = '666666';

  const base64ToArrayBuffer = (dataUrl: string): ArrayBuffer | null => {
    try {
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      return bytes.buffer;
    } catch {
      return null;
    }
  };

  const detectProvider = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes('github.com')) return 'GitHub';
    if (u.includes('linkedin.com')) return 'LinkedIn';
    if (u.includes('twitter.com') || u.includes('x.com')) return 'X';
    if (u.includes('facebook.com')) return 'Facebook';
    if (u.includes('instagram.com')) return 'Instagram';
    if (u.includes('dribbble.com')) return 'Dribbble';
    if (u.includes('gitlab.com')) return 'GitLab';
    if (u.includes('youtube.com')) return 'YouTube';
    return 'Lien';
  };

  // Header with colored band (table for background color)
  const nameText = cvData.personalInfo.name || 'Votre Nom';
  const titleText = cvData.personalInfo.title || '';
  const contactsText = [cvData.personalInfo.email, cvData.personalInfo.phone].filter(Boolean).join(' • ');

  // Build social hyperlinks as label buttons (text-only, clickable)
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
                children: [new TextRun({ text: label, bold: true, color: white })],
              });
              const spacer = idx < (cvData.personalInfo.socials?.length || 0) - 1 ? [new TextRun({ text: '   ' })] : [];
              return [link, ...spacer];
            }),
          spacing: { after: 80 },
        })
      : new Paragraph({});

  const photoArray =
    cvData.personalInfo.photo ? base64ToArrayBuffer(cvData.personalInfo.photo) : null;

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
                          data: photoArray,
                          transformation: { width: 128, height: 128 },
                        }),
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
                  children: [new TextRun({ text: nameText, bold: true, size: 48, color: white })],
                  spacing: { after: 60 },
                }),
                titleText
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: titleText, italics: true, size: 28, color: white })],
                      spacing: { after: 40 },
                    })
                  : new Paragraph({}),
                contactsText
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: contactsText, size: 20, color: white })],
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
          children: [new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 18, color: gray })],
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
            new TextRun({ text: ` (${e.period})`, size: 22, color: gray }),
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
