export const sanitizeHTML = (html: string): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || '', 'text/html');
    const allowedTags = new Set([
      'B',
      'STRONG',
      'I',
      'EM',
      'UL',
      'OL',
      'LI',
      'P',
      'BR',
      'A',
    ]);
    const allowedAttrs: Record<string, Set<string>> = {
      A: new Set(['href']),
    };

    const cleanNode = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) return node.cloneNode(true);
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const el = node as HTMLElement;
      const tag = el.tagName;
      if (!allowedTags.has(tag)) {
        const fragment = document.createDocumentFragment();
        Array.from(el.childNodes).forEach((child) => {
          const cleanChild = cleanNode(child);
          if (cleanChild) fragment.appendChild(cleanChild);
        });
        return fragment;
      }
      const cleaned = document.createElement(tag.toLowerCase());
      if (tag === 'A') {
        const href = el.getAttribute('href') || '';
        const safeHref = href.trim();
        if (
          safeHref &&
          /^(https?:|mailto:|tel:)/i.test(safeHref) &&
          !/^javascript:/i.test(safeHref)
        ) {
          cleaned.setAttribute('href', safeHref);
        }
      }
      Array.from(el.childNodes).forEach((child) => {
        const cleanChild = cleanNode(child);
        if (cleanChild) cleaned.appendChild(cleanChild);
      });
      return cleaned;
    };

    const resultFrag = document.createDocumentFragment();
    Array.from(doc.body.childNodes).forEach((child) => {
      const cleanChild = cleanNode(child);
      if (cleanChild) resultFrag.appendChild(cleanChild);
    });
    const container = document.createElement('div');
    container.appendChild(resultFrag);
    return container.innerHTML;
  } catch {
    return '';
  }
};

export const stripTags = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html || '', 'text/html');
  return (doc.body.textContent || '').trim();
};
