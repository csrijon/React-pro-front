import { useEffect } from 'react';

export function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title.includes('Domus') ? title : `${title} — Domus Studio`;
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = description;
    }
  }, [title, description]);
}
