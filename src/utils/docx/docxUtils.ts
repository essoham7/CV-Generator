import {
  Paragraph,
  TextRun,
  AlignmentType,
  ExternalHyperlink,
  ImageRun,
} from "docx";
import { stripTags, sanitizeHTML } from "../sanitize";

export const para = (text: string, options: any = {}) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new Paragraph({
    children: [new TextRun({ text, ...options })],
    spacing: { after: 120 },
    ...options,
  });

export const bullet = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text })],
    bullet: { level: 0 },
  });

export const parseHtmlToParagraphs = (html: string): Paragraph[] => {
  if (!html) return [];
  const clean = sanitizeHTML(html);
  const doc = new DOMParser().parseFromString(clean, "text/html");
  const result: Paragraph[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === "P") {
        const text = (el.textContent || "").trim();
        if (text) result.push(para(text));
        return;
      }
      if (el.tagName === "UL" || el.tagName === "OL") {
        Array.from(el.querySelectorAll("li")).forEach((li) => {
          const text = (li.textContent || "").trim();
          if (text) result.push(bullet(text));
        });
        return;
      }
      Array.from(el.childNodes).forEach(walk);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || "").trim();
      if (text) result.push(para(text));
    }
  };
  Array.from(doc.body.childNodes).forEach(walk);
  return result.length ? result : [para(stripTags(clean))];
};

export const base64ToArrayBuffer = (dataUrl: string): ArrayBuffer | null => {
  try {
    const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  } catch {
    return null;
  }
};

export const detectProvider = (url: string) => {
  const u = url.toLowerCase();
  if (u.includes("github.com")) return "GitHub";
  if (u.includes("linkedin.com")) return "LinkedIn";
  if (u.includes("twitter.com") || u.includes("x.com")) return "X";
  if (u.includes("facebook.com")) return "Facebook";
  if (u.includes("instagram.com")) return "Instagram";
  if (u.includes("dribbble.com")) return "Dribbble";
  if (u.includes("gitlab.com")) return "GitLab";
  if (u.includes("youtube.com")) return "YouTube";
  return "Lien";
};
