'use client';

import { useState } from 'react';
import { Plus, X, GraduationCap } from 'lucide-react';
import { addSubject } from '@/app/actions';

const PRESET_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Purple', value: '#a855f7' },
];

export default function NewSubjectModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await addSubject(formData); // Zavolá server action
    setIsOpen(false); // Zavře okno
  };

  return (
    <>
      {/* Tlačítko pro otevření */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-2"
      >
        <GraduationCap className="w-4 h-4" />
        Nový předmět
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Hlavička okna */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Přidat nový předmět</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulář */}
            <form action={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Název</label>
                <input name="name" autoFocus placeholder="Např. Lineární Algebra" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Barva</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c, index) => (
                    <label key={c.value} className="cursor-pointer group relative">
                      <input type="radio" name="color" value={c.value} defaultChecked={index === 0} className="peer sr-only" />
                      <div className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-slate-800 peer-checked:scale-110 transition-all shadow-sm flex items-center justify-center text-white" style={{ backgroundColor: c.value }} title={c.name}>
                        {/* Checkmark jen v CSS */}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex justify-center gap-2 items-center mt-4">
                <Plus className="w-5 h-5" /> Vytvořit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}