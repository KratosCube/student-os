'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Ticket } from 'lucide-react';

type Reward = {
  id: string;
  name: string;
  cost: number;
};

// Výchozí odměny pro start
const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: 'Epizoda seriálu 📺', cost: 1 },
  { id: '2', name: 'Sladkost / Snack 🍫', cost: 1 },
  { id: '3', name: 'Hraní her (30 min) 🎮', cost: 2 },
  { id: '4', name: 'Pivo / Drink 🍺', cost: 3 },
  { id: '5', name: 'Kino / Akce 🎬', cost: 6 },
];

export default function RewardShop({ totalLifetimeCredits }: { totalLifetimeCredits: number }) {
  const [spentCredits, setSpentCredits] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>(DEFAULT_REWARDS);
  const [isMounted, setIsMounted] = useState(false);
  
  // Stavy pro přidávání nové odměny
  const [isAdding, setIsAdding] = useState(false);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(1);

  // Načtení dat z prohlížeče
  useEffect(() => {
    const savedSpent = localStorage.getItem('userSpentCredits');
    const savedRewards = localStorage.getItem('userCustomRewards');
    
    if (savedSpent) setSpentCredits(parseInt(savedSpent));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    
    setIsMounted(true);
  }, []);

  // Uložení dat
  const updateSpent = (newAmount: number) => {
    setSpentCredits(newAmount);
    localStorage.setItem('userSpentCredits', newAmount.toString());
  };

  const saveRewards = (newRewards: Reward[]) => {
    setRewards(newRewards);
    localStorage.setItem('userCustomRewards', JSON.stringify(newRewards));
  };

  // Logika nákupu
  const currentBalance = totalLifetimeCredits - spentCredits;

  const buyReward = (reward: Reward) => {
    if (currentBalance >= reward.cost) {
      const confirmBuy = window.confirm(`Opravdu si chceš koupit "${reward.name}" za ${reward.cost} kredity?`);
      if (confirmBuy) {
        updateSpent(spentCredits + reward.cost);
      }
    } else {
      alert("Na tohle nemáš dost kreditů! Musíš se víc učit. 📚");
    }
  };

  const handleAddReward = () => {
    if (!newRewardName.trim()) return;
    const newReward: Reward = {
      id: Date.now().toString(),
      name: newRewardName,
      cost: newRewardCost
    };
    saveRewards([...rewards, newReward]);
    setIsAdding(false);
    setNewRewardName('');
    setNewRewardCost(1);
  };

  const deleteReward = (id: string) => {
    saveRewards(rewards.filter(r => r.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col w-full">
      {/* Hlavička s peněženkou */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold flex items-center gap-2 text-sm md:text-base">
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            Obchod odměn
          </h3>
          <div className="text-[10px] md:text-xs bg-white/20 px-2 py-0.5 rounded font-medium">
            Celkem: {totalLifetimeCredits}
          </div>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold tracking-tight">{currentBalance}</span>
          <span className="text-indigo-200 font-medium uppercase text-[10px] md:text-xs">Kreditů</span>
        </div>
      </div>

      {/* Seznam odměn - ZDE JE ZMĚNA VÝŠKY (max-h-[35vh]) */}
      <div className="p-3 flex-1 overflow-y-auto max-h-[35vh] min-h-[200px]">
        <div className="space-y-2">
          {rewards.map(reward => (
            <div key={reward.id} className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentBalance >= reward.cost ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {reward.cost}
                </div>
                <span className="font-medium text-slate-700 text-sm truncate">{reward.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => buyReward(reward)}
                  disabled={currentBalance < reward.cost}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 ${
                    currentBalance >= reward.cost 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Ticket className="w-3 h-3" />
                </button>
                <button onClick={() => deleteReward(reward.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Přidání nové odměny */}
        {isAdding ? (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2">
            <input 
              autoFocus
              placeholder="Název..." 
              value={newRewardName}
              onChange={e => setNewRewardName(e.target.value)}
              className="w-full text-xs p-2 rounded border border-slate-200 mb-2 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                min="1"
                value={newRewardCost}
                onChange={e => setNewRewardCost(parseInt(e.target.value))}
                className="w-16 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleAddReward} className="flex-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700">
                OK
              </button>
              <button onClick={() => setIsAdding(false)} className="px-3 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300">
                X
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full mt-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" /> Vytvořit
          </button>
        )}
      </div>
    </div>
  );
}