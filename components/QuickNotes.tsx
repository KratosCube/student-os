'use client';

import { useState, useEffect, useRef } from 'react';
import { PenLine, ExternalLink } from 'lucide-react';

export default function QuickNotes() {
  const [note, setNote] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedNote = localStorage.getItem('userQuickNotes');
    if (savedNote) {
      setNote(savedNote);
      extractLinks(savedNote);
    }
    setIsMounted(true);
  }, []);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const extractLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const found = text.match(urlRegex) || [];
    setLinks([...new Set(found)]);
  };

  useEffect(() => {
    if (isMounted) {
      adjustHeight();
    }
  }, [note, isMounted]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNote(newVal);
    extractLinks(newVal);
    localStorage.setItem('userQuickNotes', newVal);
  };

  if (!isMounted) return null;

  return (
    <div className="ui-card relative flex min-h-[190px] h-fit flex-col p-5 transition-colors group">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="ui-card-title flex items-center gap-2">
          <PenLine className="h-4 w-4 text-indigo-400" />
          Rychlé poznámky
        </h3>
        <span className="ui-text-helper opacity-0 transition-opacity group-hover:opacity-100">
          Automaticky uloženo
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={note}
        onChange={handleChange}
        placeholder="Napiš si sem cokoli... (odkazy se objeví dole)"
        rows={1}
        className="ui-textarea overflow-hidden block text-slate-700 dark:text-slate-300"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent, transparent 31px, var(--notes-line-color) 31px, var(--notes-line-color) 32px)',
          backgroundAttachment: 'local',
          paddingTop: '0px',
          minHeight: '150px',
        }}
      />

      {links.length > 0 && (
        <div className="mt-3 pt-1 flex flex-wrap gap-2">
          {links.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs text-indigo-700 hover:underline dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              title={link}
            >
              <ExternalLink className="h-3 w-3" />
              {new URL(link).hostname}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}