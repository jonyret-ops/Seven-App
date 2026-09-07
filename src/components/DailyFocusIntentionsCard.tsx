import React, { useState } from 'react';
import { Target, Check, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyFocusIntentionsCard: React.FC = () => {
  const {
    dailyFocusIntentions,
    addDailyFocusIntention,
    toggleDailyFocusIntention,
    deleteDailyFocusIntention,
    isDateFuture,
    selectedDate,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const isFuture = isDateFuture(selectedDate);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isFuture) return;
    await addDailyFocusIntention(inputVal);
    setInputVal('');
  };

  const completedCount = dailyFocusIntentions.filter((i) => i.isCompleted).length;

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EEEDE9] shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#DCEAF4] text-[#12324A] flex items-center justify-center">
            <Target className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#0D1B2A] uppercase tracking-wider">
              Today's Priorities
            </h3>
            <p className="text-[11px] text-[#68727D]">
              Key objectives for this day
            </p>
          </div>
        </div>

        {dailyFocusIntentions.length > 0 && (
          <span className="text-xs font-bold text-[#12324A] px-2.5 py-1 rounded-full bg-[#DCEAF4]">
            {completedCount} / {dailyFocusIntentions.length} Done
          </span>
        )}
      </div>

      {/* List of Intentions */}
      <div className="space-y-2 pt-1">
        {dailyFocusIntentions.length === 0 ? (
          <div className="py-5 text-center text-xs text-[#68727D] border border-dashed border-[#EEEDE9] rounded-2xl bg-[#F7F6F2]">
            No priorities set for this day yet. Add your main target below.
          </div>
        ) : (
          dailyFocusIntentions.map((intention) => (
            <div
              key={intention.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                intention.isCompleted
                  ? 'bg-[#F7F6F2] border-[#EEEDE9] opacity-80'
                  : 'bg-white border-[#EEEDE9] hover:border-[#4A90C2]'
              }`}
            >
              <button
                type="button"
                disabled={isFuture}
                onClick={() => toggleDailyFocusIntention(intention.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer group disabled:cursor-not-allowed"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                    intention.isCompleted
                      ? 'bg-[#12324A] border-[#12324A] text-white'
                      : 'border-[#EEEDE9] bg-[#F7F6F2] group-hover:border-[#12324A]'
                  }`}
                >
                  {intention.isCompleted && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
                <span
                  className={`text-xs font-semibold leading-relaxed truncate ${
                    intention.isCompleted ? 'line-through text-[#68727D]' : 'text-[#0D1B2A]'
                  }`}
                >
                  {intention.text}
                </span>
              </button>

              <button
                type="button"
                disabled={isFuture}
                onClick={() => deleteDailyFocusIntention(intention.id)}
                className="p-1.5 text-[#68727D]/60 hover:text-red-500 rounded-lg hover:bg-[#F7F6F2] transition-colors ml-2 cursor-pointer disabled:opacity-40"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add new intention input */}
      {!isFuture && (
        <form onSubmit={handleAdd} className="flex gap-2 pt-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Add a priority intention..."
            className="flex-1 bg-white border border-[#EEEDE9] focus:border-[#4A90C2] rounded-xl px-3.5 py-2.5 text-xs text-[#0D1B2A] placeholder:text-[#68727D]/60 outline-none transition-all"
            maxLength={80}
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Add</span>
          </button>
        </form>
      )}
    </div>
  );
};
