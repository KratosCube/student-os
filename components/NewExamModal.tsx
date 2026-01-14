'use client';

import { useState } from 'react';
import { Plus, X, CalendarPlus } from 'lucide-react';
import { addExam } from '@/app/actions';

type Subject = {
  id: number;
  name: string;
};

export default function NewExamModal({ subjects }: { subjects: Subject[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await addExam(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
      >
        <CalendarPlus className="w-4 h-4" />
        Naplánovat termín
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Naplánovat zkoušku</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Předmět</label>
                <select name="subjectId" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all">
                  <option value="">-- Vyber předmět --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Datum a čas</label>
                <input name="date" type="datetime-local" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Typ</label>
                <select name="type" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all">
                  <option value="confirmed">Zápis (Potvrzeno)</option>
                  <option value="potential">Možná (Jen v kalendáři)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex justify-center gap-2 items-center mt-2">
                <Plus className="w-5 h-5" /> Přidat do kalendáře
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}