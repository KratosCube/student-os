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
    // ZMĚNA POZADÍ: Žlutá (#fffbeb) pro světlý režim, Slate pro tmavý
    <div className="bg-[#fffbeb] dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-amber-100 dark:border-slate-700 min-h-[200px] h-fit flex flex-col relative group transition-colors">
       <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-amber-800 dark:text-slate-200 flex items-center gap-2 text-sm">
            <PenLine className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
            Rychlé poznámky
          </h3>
          <span className="text-[10px] text-amber-600/50 dark:text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Automaticky uloženo
          </span>
       </div>
       
       <textarea 
         ref={textareaRef}
         value={note}
         onChange={handleChange}
         placeholder="Napiš si sem cokoli... (odkazy se objeví dole)"
         rows={1}
         // ZMĚNA TEXTU: Amber pro světlý režim, Slate pro tmavý
         className="w-full bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-sm text-amber-900 dark:text-slate-300 placeholder-amber-900/30 dark:placeholder-slate-600 font-medium overflow-hidden block leading-[32px]"
         style={{ 
           // Linky berou barvu z globals.css (--notes-line-color)
           backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, var(--notes-line-color) 31px, var(--notes-line-color) 32px)',
           backgroundAttachment: 'local',
           paddingTop: '0px', 
           minHeight: '160px'
         }}
       />

       {/* Zobrazení odkazů - ODSTRANĚNA ČÁRA (border-t) */}
       {links.length > 0 && (
         <div className="mt-3 pt-1 flex flex-wrap gap-2">
           {links.map((link, i) => (
             <a 
               key={i}
               href={link}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1 text-xs bg-amber-100 dark:bg-indigo-900/30 text-amber-700 dark:text-indigo-400 px-2 py-1 rounded-md hover:underline truncate max-w-full border border-amber-200 dark:border-indigo-800"
               title={link}
             >
               <ExternalLink className="w-3 h-3" />
               {new URL(link).hostname}
             </a>
           ))}
         </div>
       )}
    </div>
  );
}