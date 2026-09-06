import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Calendar, 
  Target, 
  Footprints, 
  Zap, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SevenLogo } from './SevenLogo';
import { addDays, formatDate } from '../lib/calculations';

const ONBOARDING_STORAGE_KEY = 'seven_onboarding_completed';

export const OnboardingModal: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    updateArc, 
    addWeightEntry, 
    activeTodayDate 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [name, setName] = useState('');
  
  // Step 2: Weight tracking
  const [trackWeight, setTrackWeight] = useState(true);
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');
  const [startingWeight, setStartingWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [bodyMode, setBodyMode] = useState<'lose' | 'maintain' | 'gain' | 'track'>('lose');

  // Step 3: Arc configuration
  const [arcName, setArcName] = useState('First Arc');
  const [arcDurationDays, setArcDurationDays] = useState<number>(90);
  const [stepTarget, setStepTarget] = useState<number>(10000);
  const [dailyXpGoal, setDailyXpGoal] = useState<number>(100);

  useEffect(() => {
    const isCompleted = profile.onboardingCompleted || localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, [profile.onboardingCompleted]);

  const handleFinish = async () => {
    const today = activeTodayDate || formatDate(new Date());
    const endDate = addDays(today, arcDurationDays);
    const parsedStartWeight = parseFloat(startingWeight);
    const parsedGoalWeight = parseFloat(goalWeight);

    const hasValidStartWeight = trackWeight && !isNaN(parsedStartWeight) && parsedStartWeight > 0;
    const hasValidGoalWeight = trackWeight && !isNaN(parsedGoalWeight) && parsedGoalWeight > 0;

    // 1. Update user profile
    await updateProfile({
      name: name.trim() || 'Athlete',
      onboardingCompleted: true,
      trackWeight,
      weightUnit,
      bodyMode,
      memberSince: today,
      lifetimeBaselineDate: hasValidStartWeight ? today : '',
      lifetimeBaselineWeight: hasValidStartWeight ? parsedStartWeight : 0,
    });

    // 2. Configure initial Arc
    await updateArc({
      name: arcName.trim() || 'First Arc',
      startDate: today,
      endDate,
      stepTarget: stepTarget || 10000,
      dailyXpGoal: dailyXpGoal || 100,
      startingWeight: hasValidStartWeight ? parsedStartWeight : 0,
      goalWeight: hasValidGoalWeight ? parsedGoalWeight : 0,
      isActive: true,
      isCompleted: false,
    });

    // 3. Register first weigh-in if provided
    if (hasValidStartWeight) {
      await addWeightEntry(parsedStartWeight, today, 'Lifetime baseline weigh-in');
    }

    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-[#14171D] rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-6 border border-white/[0.1] shadow-2xl relative text-white"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-emerald-400'
                    : s < step
                    ? 'w-4 bg-emerald-700'
                    : 'w-3 bg-zinc-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Step {step} of 3
          </span>
        </div>

        {/* STEP 1: WELCOME & PHILOSOPHY */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-3">
                <SevenLogo size="lg" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                SEVEN
              </h1>
              <p className="text-xs font-semibold text-emerald-400 italic mt-0.5">
                "Each day is a step towards greatness."
              </p>
            </div>

            {/* Core Philosophy Banner */}
            <div className="bg-[#181C23] p-3.5 rounded-2xl border border-white/[0.07] text-center space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                CORE PHILOSOPHY
              </span>
              <p className="text-xs font-black text-white tracking-wide">
                7 DAYS <span className="text-emerald-400">→</span> 7 STEPS <span className="text-emerald-400">→</span> PROGRESS <span className="text-emerald-400">→</span> DISCIPLINE <span className="text-emerald-400">→</span> BECOMING BETTER
              </p>
              <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                Level up your character by leveling up yourself. Everything starts from zero: earn your XP, unlock achievements, and conquer each day.
              </p>
            </div>

            {/* User Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                What should we call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex, Champion, David"
                className="w-full h-11 px-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            {/* Privacy Promise */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>100% Private & Local.</strong> All your stats and records remain on this device. No cloud tracking.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: BODY & WEIGHT TRACKING SETUP */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  BODY METRICS & COMPOSITION
                </span>
              </div>
              <h2 className="text-xl font-black text-white">Weight Tracking Setup</h2>
              <p className="text-xs text-zinc-400">
                Track body transformation across your discipline seasons.
              </p>
            </div>

            {/* Toggle Track Weight */}
            <div className="bg-[#181C23] p-3 rounded-2xl border border-white/[0.07] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Track Body Weight</span>
                <span className="text-[10px] text-zinc-400">Log weigh-ins and baseline progress</span>
              </div>
              <button
                type="button"
                onClick={() => setTrackWeight(!trackWeight)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  trackWeight ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    trackWeight ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {trackWeight ? (
              <div className="space-y-3 pt-1">
                {/* Unit Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400">Preferred Unit:</span>
                  <div className="flex bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('lb')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'lb' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      LB
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'kg' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      KG
                    </button>
                  </div>
                </div>

                {/* Starting Weight / Baseline */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      Starting Weight ({weightUnit})
                    </label>
                    <span className="text-[9px] font-extrabold text-emerald-400">LIFETIME BASELINE</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={startingWeight}
                    onChange={(e) => setStartingWeight(e.target.value)}
                    placeholder={weightUnit === 'lb' ? 'e.g. 215.0' : 'e.g. 97.5'}
                    className="w-full h-11 px-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-all"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Your first entry establishes your lifetime starting baseline.
                  </p>
                </div>

                {/* Body Mode Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                    Current Focus Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'lose', label: 'Fat Loss' },
                      { id: 'maintain', label: 'Maintain' },
                      { id: 'gain', label: 'Bulk / Muscle' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setBodyMode(m.id as any)}
                        className={`h-9 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          bodyMode === m.id
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-black'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Weight */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                    Target Goal Weight ({weightUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder={weightUnit === 'lb' ? 'e.g. 195.0' : 'e.g. 88.0'}
                    className="w-full h-11 px-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-1 text-zinc-400">
                <CheckCircle2 className="w-6 h-6 text-zinc-500 mx-auto" />
                <p className="text-xs font-bold text-zinc-300">Weight tracking disabled for now</p>
                <p className="text-[11px] text-zinc-500">
                  You can enable weight tracking at any time in Settings.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-12 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>NEXT: INITIAL ARC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INITIAL ARC CONFIGURATION */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  PROGRESSION ARC
                </span>
              </div>
              <h2 className="text-xl font-black text-white">Configure Your First Arc</h2>
              <p className="text-xs text-zinc-400">
                An Arc is a dedicated season of discipline, daily quests, and focused momentum.
              </p>
            </div>

            {/* Arc Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                Arc Title
              </label>
              <input
                type="text"
                value={arcName}
                onChange={(e) => setArcName(e.target.value)}
                placeholder="e.g. Arc 1, Winter Arc, Rise Season"
                className="w-full h-11 px-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            {/* Arc Duration */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                Arc Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 30, label: '30 Days', desc: 'Sprint' },
                  { days: 60, label: '60 Days', desc: 'Standard' },
                  { days: 90, label: '90 Days', desc: 'Transform' },
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setArcDurationDays(d.days)}
                    className={`p-2.5 rounded-2xl text-center border transition-all cursor-pointer ${
                      arcDurationDays === d.days
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-black block">{d.label}</span>
                    <span className="text-[9px] text-zinc-500">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Daily Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                  Daily Step Goal
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="500"
                    value={stepTarget}
                    onChange={(e) => setStepTarget(parseInt(e.target.value) || 10000)}
                    className="w-full h-11 px-3 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                  />
                  <Footprints className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                  Daily XP Goal
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="10"
                    value={dailyXpGoal}
                    onChange={(e) => setDailyXpGoal(parseInt(e.target.value) || 100)}
                    className="w-full h-11 px-3 bg-zinc-900 border border-zinc-700/80 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                  />
                  <Zap className="w-3.5 h-3.5 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-zinc-900/90 rounded-2xl p-3 border border-white/[0.06] text-xs text-zinc-400 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Start Date:</span>
                <span className="text-white">{activeTodayDate} (Day 1)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>End Date:</span>
                <span className="text-white">{addDays(activeTodayDate, arcDurationDays)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Initial State:</span>
                <span className="text-emerald-400">0 XP • Level 1 Novice • 0 Days</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-12 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>START YOUR JOURNEY</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
