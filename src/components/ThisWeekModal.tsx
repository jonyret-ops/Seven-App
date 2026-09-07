import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, BarChart2, Edit3, Target } from 'lucide-react';
import { mountainPeaks } from '../assets/images';
import { useApp } from '../context/AppContext';

interface ThisWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThisWeekModal: React.FC<ThisWeekModalProps> = ({ isOpen, onClose }) => {
  const { currentArc, currentLog, activeTodayDate } = useApp();

  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: '1', title: 'Work out 5x', current: 5, target: 5, unit: 'times', completed: true },
    { id: '2', title: '10,000+ steps daily', current: 4, target: 7, unit: 'days', completed: false },
    { id: '3', title: 'Stay within calorie goal', current: 4, target: 7, unit: 'days', completed: false },
    { id: '4', title: 'Read Bible daily', current: 5, target: 7, unit: 'days', completed: false },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const daysCompleted = 5;
  const totalDays = 7;
  const overallPercent = 72;

  const daysOfWeek = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: false },
    { day: 'T', completed: false },
    { day: 'F', completed: false },
    { day: 'S', completed: false },
    { day: 'S', completed: false },
  ];

  const toggleGoal = (id: string) => {
    setWeeklyGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextCompleted = !g.completed;
          return {
            ...g,
            completed: nextCompleted,
            current: nextCompleted ? g.target : Math.max(0, g.target - 2),
          };
        }
        return g;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 relative">
        {/* Scenic Alpine Mountain Header with This Week Information */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden p-5 flex flex-col justify-between text-white">
          <img
            src={mountainPeaks}
            alt="Mountains"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

          {/* Top Bar inside Mountain Banner */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-white/80">
              Weekly Arc
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Week Selector */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  This Week
                </h2>
                <p className="text-xs font-medium text-slate-200 mt-0.5">
                  Sep 8 – Sep 14
                </p>
              </div>

              {/* Prev / Next Week Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Circles */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
              {daysOfWeek.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      d.completed
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white/20 text-white/80'
                    }`}
                  >
                    {d.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : d.day}
                  </div>
                  <span className="text-[9px] text-white/70 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* 2 Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Days Completed Ring */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeDasharray="87.96"
                    strokeDashoffset={87.96 * (1 - daysCompleted / totalDays)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-slate-800">
                  {daysCompleted}/{totalDays}
                </span>
              </div>
              <div>
                <span className="text-base font-black text-slate-900 leading-tight block">
                  {daysCompleted}/{totalDays}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Days Completed
                </span>
              </div>
            </div>

            {/* Weekly Goal Percent */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 leading-tight block">
                  {overallPercent}%
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Weekly Goal
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Goals Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-black text-slate-900">Weekly Goals</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {weeklyGoals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));

                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/70 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            goal.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {goal.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            goal.completed ? 'text-slate-900 font-extrabold' : 'text-slate-700'
                          }`}
                        >
                          {goal.title}
                        </span>
                      </div>

                      <span className="text-xs font-black text-slate-500">
                        {goal.current}/{goal.target}
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
