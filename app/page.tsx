import { prisma } from '@/lib/prisma';
import { toggleExam, deleteExam } from './actions';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMinutes, getDay, startOfDay, subDays, isAfter } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, CheckCircle, Trash2, BarChart3, ListTodo, LayoutDashboard } from 'lucide-react';
import FocusTimer from '@/components/FocusTimer';
import GoalTracker from '@/components/GoalTracker';
import NewSubjectModal from '@/components/NewSubjectModal';
import NewExamModal from '@/components/NewExamModal';
import RewardShop from '@/components/RewardShop';
import HydrationTracker from '@/components/HydrationTracker';
import QuickNotes from '@/components/QuickNotes'; // 👈 Import poznámek
export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  // 1. Načtení dat
  const subjects = await prisma.subject.findMany({ include: { exams: true, sessions: true } });
  const exams = await prisma.exam.findMany({ orderBy: { date: 'asc' }, include: { subject: true } });
  const activeExams = exams.filter(e => !e.isDone);
  
  // 2. Data pro Kalendář
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start, end });
  const startDayOfWeek = getDay(start);
  const firstDayColumn = (startDayOfWeek === 0 ? 7 : startDayOfWeek);
  const getExamsForDay = (day: Date) => activeExams.filter(e => isSameDay(new Date(e.date), day));

  // 3. Výpočty
  const startOfTodayVal = startOfDay(today);
  const startOfWeekVal = subDays(today, 7);
  let todayTotalMinutes = 0;
  let weekTotalMinutes = 0;
  let lifetimeMinutes = 0;
  
  const subjectsStats = subjects.map(sub => {
    const todaySessions = sub.sessions.filter(s => isAfter(new Date(s.createdAt), startOfTodayVal));
    const weekSessions = sub.sessions.filter(s => isAfter(new Date(s.createdAt), startOfWeekVal));
    const totalSubMinutes = sub.sessions.reduce((acc, s) => acc + s.duration, 0);

    const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
    const weekMinutes = weekSessions.reduce((acc, s) => acc + s.duration, 0);

    todayTotalMinutes += todayMinutes;
    weekTotalMinutes += weekMinutes;
    lifetimeMinutes += totalSubMinutes;
    return { ...sub, todayMinutes, weekMinutes };
  });

  const totalLifetimeCredits = Math.floor(lifetimeMinutes / 45);

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HLAVIČKA */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-indigo-600">
               <LayoutDashboard className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student OS</h1>
                <p className="text-slate-500 text-sm font-medium">Dashboard</p>
             </div>
          </div>
          <div className="flex gap-4 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
             <span>📅 {format(today, 'd. MMMM yyyy', { locale: cs })}</span>
          </div>
        </header>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-start">
          
          {/* --- OBLAST 1: FOCUS & BIO (Levý panel) [3/12] --- */}
          <div className="xl:col-span-3 space-y-6 flex flex-col">
            <FocusTimer subjects={subjects} />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
               <GoalTracker todayMinutes={todayTotalMinutes} />
               <HydrationTracker />
            </div>
          </div>

          {/* --- OBLAST 2: GAMIFIKACE & DATA (Střed) [4/12] --- */}
          <div className="xl:col-span-4 space-y-6 flex flex-col">
            <RewardShop totalLifetimeCredits={totalLifetimeCredits} />

            {/* Statistiky */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  Statistiky
                </h3>
                <span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">
                  Týden: {Math.round(weekTotalMinutes / 60)}h
                </span>
              </div>
              <div className="space-y-3">
                {subjectsStats.map(sub => {
                  if (sub.weekMinutes === 0) return null;
                  return (
                    <div key={sub.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold truncate max-w-[120px]" style={{ color: sub.color }}>{sub.name}</span>
                        <div className="flex gap-2 text-slate-500 text-[10px]">
                          <span className="font-medium text-slate-700">Dnes: {sub.todayMinutes}m</span>
                          <span>Týden: {sub.weekMinutes}m</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden flex shadow-inner">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((sub.todayMinutes / 120) * 100, 100)}%`, backgroundColor: sub.color }}></div>
                      </div>
                    </div>
                  )
                })}
                {weekTotalMinutes === 0 && (
                   <p className="text-xs text-slate-400 text-center py-4 italic">Zatím žádná aktivita.</p>
                )}
              </div>
            </div>

            {/* 👇 ZDE JSME PŘIDALI RYCHLÉ POZNÁMKY, ABY ZAPLNILY PRÁZDNÉ MÍSTO */}
            <QuickNotes />

          </div>

          {/* --- OBLAST 3: AGENDA & KALENDÁŘ (Pravý panel) [5/12] --- */}
          <div className="xl:col-span-5 space-y-6 md:col-span-2 xl:col-span-auto">
            
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <ListTodo className="w-5 h-5 text-indigo-500" />
                 Plánovač
               </h2>
               <div className="flex gap-2">
                 <NewSubjectModal />
                 <NewExamModal subjects={subjects} />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-500" />
                    <span className="capitalize">{format(today, 'MMMM yyyy', { locale: cs })}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(d => (
                      <div key={d} className="text-slate-400 text-[10px] font-bold py-1 uppercase tracking-wider">{d}</div>
                    ))}
                    {daysInMonth.map((day, i) => {
                      const dayExams = getExamsForDay(day);
                      const style = i === 0 ? { gridColumnStart: firstDayColumn } : {};
                      const isCurrentDay = isToday(day);
                      return (
                        <div key={i} style={style} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs relative transition-colors ${isCurrentDay ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 bg-white border border-slate-50'}`}>
                          <span className={isCurrentDay ? 'font-bold' : ''}>{format(day, 'd')}</span>
                          <div className="flex gap-0.5 mt-1">
                            {dayExams.map(ex => (
                              <div key={ex.id} className={`w-1.5 h-1.5 rounded-full ${isCurrentDay ? 'border border-indigo-300 bg-white' : ''}`} style={{ backgroundColor: isCurrentDay ? 'white' : (ex.subject?.color || '#cbd5e1') }} title={ex.subject?.name}></div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {exams.map((exam) => {
                    const endDate = addMinutes(new Date(exam.date), exam.duration);
                    return (
                      <div key={exam.id} className={`group bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md hover:border-indigo-100 ${exam.isDone ? 'opacity-60 grayscale bg-slate-50' : ''}`}>
                        <div className="flex flex-col items-center justify-center min-w-[50px] text-center border-r border-slate-100 pr-4">
                          <span className="text-xl font-bold text-slate-800 tracking-tighter">{format(new Date(exam.date), 'd')}</span>
                          <span className="text-slate-400 text-[9px] font-bold uppercase">{format(new Date(exam.date), 'MMM', { locale: cs })}</span>
                        </div>
                        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: exam.subject?.color || '#cbd5e1' }}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-sm text-slate-800 truncate">{exam.subject?.name || 'Neznámý'}</h4>
                            {exam.type === 'potential' && (<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">MOŽNÁ</span>)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{format(new Date(exam.date), 'HH:mm')} - {format(endDate, 'HH:mm')}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <form action={toggleExam.bind(null, exam.id, exam.isDone)}>
                            <button className="p-1.5 text-slate-300 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                          </form>
                          <form action={deleteExam.bind(null, exam.id)}>
                            <button className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                  {exams.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium text-sm">Žádné plány. 🏝️</p>
                    </div>
                  )}
                </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}