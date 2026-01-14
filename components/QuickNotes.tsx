'use client';

import { useState, useEffect, useRef } from 'react';
import { PenLine } from 'lucide-react';

export default function QuickNotes() {
  const [note, setNote] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Načtení poznámky při startu
  useEffect(() => {
    const savedNote = localStorage.getItem('userQuickNotes');
    if (savedNote) setNote(savedNote);
    setIsMounted(true);
  }, []);

  // Funkce pro změnu výšky
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 1. Reset výšky na 'auto' (aby se mohla zmenšit)
      textarea.style.height = 'auto';
      // 2. Nastavení nové výšky podle obsahu + malá rezerva
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Změna výšky při načtení a při změně textu
  useEffect(() => {
    if (isMounted) {
      adjustHeight();
    }
  }, [note, isMounted]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNote(newVal);
    localStorage.setItem('userQuickNotes', newVal);
    // adjustHeight se zavolá automaticky díky useEffectu výše
  };

  if (!isMounted) return null;

  return (
    <div className="bg-[#fffbeb] rounded-2xl p-5 shadow-sm border border-amber-100 min-h-[200px] h-auto flex flex-col relative group transition-all">
       <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-amber-800 flex items-center gap-2 text-sm">
            <PenLine className="w-4 h-4" />
            Rychlé poznámky
          </h3>
          <span className="text-[10px] text-amber-600/50 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Automaticky uloženo
          </span>
       </div>
       
       <textarea 
         ref={textareaRef}
         value={note}
         onChange={handleChange}
         placeholder="Napiš si sem cokoli..."
         rows={1}
         // Změny v CSS:
         // - w-full: plná šířka
         // - overflow-hidden: skryje posuvník (protože se to bude natahovat)
         // - focus:outline-none: pryč s černým rámečkem
         // - bg-transparent: aby bylo vidět řádkování
         className="w-full bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-sm text-amber-900 placeholder-amber-900/30 font-medium overflow-hidden block leading-[32px]"
         style={{ 
           // Linky
           backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #fcd34d 31px, #fcd34d 32px)',
           backgroundAttachment: 'local',
           paddingTop: '0px', 
           minHeight: '160px' // Základní výška (cca 5 řádků)
         }}
       />
    </div>
  );
}