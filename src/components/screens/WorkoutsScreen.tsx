import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  Dumbbell, 
  Flame, 
  Clock, 
  Check,
  Award
} from 'lucide-react';
import { workoutDumbbells } from '../../assets/images';
import { useApp } from '../../context/AppContext';

export const WorkoutsScreen: React.FC = () => {
  const { currentLog, toggleBooleanQuest } = useApp();
  const [activeCategory, setActiveCategory] = useState('for_you');
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(
    currentLog?.completedQuestIds?.includes('hit_the_gym') ?? false
  );

  const categories = [
    { id: 'for_you', label: 'For You' },
    { id: 'strength', label: 'Strength' },
    { id: 'hiit', label: 'HIIT' },
    { id: 'mobility', label: 'Mobility' },
    { id: 'yoga', label: 'Yoga' },
  ];

  const workoutsList = [
    {
      id: 'w1',
      title: 'Full Body',
      duration: '45 min',
      detail: 'Dumbbells · All Levels',
      category: 'strength',
    },
    {
      id: 'w2',
      title: 'Upper Body',
      duration: '40 min',
      detail: 'Strength',
      category: 'strength',
    },
    {
      id: 'w3',
      title: 'Lower Body',
      duration: '40 min',
      detail: 'Strength',
      category: 'strength',
    },
    {
      id: 'w4',
      title: 'Core & Abs',
      duration: '15 min',
      detail: 'No Equipment',
      category: 'strength',
    },
  ];

  const handleLogWorkout = () => {
    toggleBooleanQuest('hit_the_gym');
    setIsWorkoutCompleted(!isWorkoutCompleted);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300 select-none">
      {/* Top Header - Title & Subtitle */}
      <header className="pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Workouts
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Stronger every day.
        </p>
      </header>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Hero Workout Banner Card: Push Day */}
      <div 
        onClick={handleLogWorkout}
        className="relative h-44 sm:h-48 rounded-3xl overflow-hidden shadow-md cursor-pointer group"
      >
        <img
          src={workoutDumbbells}
          alt="Dumbbells"
          className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                Push Day
              </h2>
              <p className="text-xs font-medium text-slate-200 mt-0.5">
                Build strength. Build discipline.
              </p>
            </div>

            {/* Circular Play / Check Button */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isWorkoutCompleted ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'
            }`}>
              {isWorkoutCompleted ? (
                <Check className="w-6 h-6 stroke-[3]" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      <div className="space-y-2.5">
        {workoutsList.map((w) => (
          <div
            key={w.id}
            onClick={handleLogWorkout}
            className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {w.title} <span className="text-slate-400 font-normal">({w.duration})</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {w.detail}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};
