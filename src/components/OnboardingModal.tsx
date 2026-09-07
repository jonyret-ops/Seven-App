import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Scale, 
  Calendar, 
  Footprints, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { addDays, formatDate, formatOrdinalDate } from '../lib/calculations';

const ONBOARDING_STORAGE_KEY = 'seven_onboarding_completed';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToOpeningScreen?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose,
  onBackToOpeningScreen 
}) => {
  const { 
    profile,
    currentArc,
    updateProfile, 
    updateArc, 
    addWeightEntry, 
    activeTodayDate 
  } = useApp();

  // Setup questions steps: 1 = Name/Identity, 2 = Weight, 3 = First Arc
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state - initialize with empty if placeholder
  const [name, setName] = useState(profile.name === 'Athlete' ? '' : (profile.name || ''));
  
  // Step 2: Weight tracking
  const [trackWeight, setTrackWeight] = useState(true);
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');
  const [startingWeight, setStartingWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [bodyMode, setBodyMode] = useState<'lose' | 'maintain' | 'gain' | 'track'>('lose');

  // Step 3: Arc configuration
  const [arcName, setArcName] = useState(currentArc.name === 'FIRST ARC' ? 'Arc 1' : (currentArc.name || 'Arc 1'));
  const [arcDurationDays, setArcDurationDays] = useState<number>(90);
  const [stepTarget, setStepTarget] = useState<number>(10000);

  // Reset step to 1 whenever opened and populate if user has entered data
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (profile.name && profile.name !== 'Athlete') {
        setName(profile.name);
      }
      if (currentArc.name && currentArc.name !== 'FIRST ARC') {
        setArcName(currentArc.name);
      }
    }
  }, [isOpen, profile.name, currentArc.name]);

  const handleFinish = async () => {
    const today = activeTodayDate || formatDate(new Date());
    const endDate = addDays(today, arcDurationDays);
    const parsedStartWeight = parseFloat(startingWeight);
    const parsedGoalWeight = parseFloat(goalWeight);

    const hasValidStartWeight = trackWeight && !isNaN(parsedStartWeight) && parsedStartWeight > 0;
    const hasValidGoalWeight = trackWeight && !isNaN(parsedGoalWeight) && parsedGoalWeight > 0;

    // 1. Update user profile - persist exact user name
    const finalUserName = name.trim() || profile.name || '';
    await updateProfile({
      name: finalUserName,
      onboardingCompleted: true,
      trackWeight,
      weightUnit,
      bodyMode,
      memberSince: today,
      lifetimeBaselineDate: hasValidStartWeight ? today : '',
      lifetimeBaselineWeight: hasValidStartWeight ? parsedStartWeight : 0,
    });

    // 2. Configure initial Arc - persist exact Arc title
    const finalArcTitle = arcName.trim() || currentArc.name || 'Arc 1';
    await updateArc({
      name: finalArcTitle,
      startDate: today,
      endDate,
      stepTarget: stepTarget || 10000,
      dailyXpGoal: 100,
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-6 border border-[#EEEDE9] shadow-2xl relative text-[#0D1B2A] no-scrollbar"
      >
        {/* Step Indicator (Steps 1 to 3) */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-[#12324A]'
                    : s < step
                    ? 'w-4 bg-[#4A90C2]'
                    : 'w-3 bg-[#EEEDE9]'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#68727D]">
            Step {step} of 3
          </span>
        </div>

        {/* STEP 1: WELCOME & IDENTITY SETUP */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0D1B2A] tracking-tight">
                Welcome to SEVEN.
              </h2>
              <div className="mt-3 space-y-2 text-xs text-[#68727D] font-medium leading-relaxed">
                <p>
                  Every week gives you seven days to improve.
                  <br />
                  Seven days. Seven steps toward greatness.
                </p>
                <p className="text-[#0D1B2A] font-bold">
                  Let’s see how far you can go.
                </p>
              </div>
            </div>

            {/* User Name Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-black text-[#0D1B2A] block">
                What’s your name?
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-12 px-4 bg-[#F7F6F2] border border-[#EEEDE9] rounded-2xl text-sm font-bold text-[#0D1B2A] placeholder:text-[#68727D]/60 focus:outline-none focus:border-[#4A90C2] transition-all"
              />
            </div>

            <div className="flex gap-2 pt-3">
              {onBackToOpeningScreen && (
                <button
                  type="button"
                  onClick={onBackToOpeningScreen}
                  className="h-12 px-4 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] hover:bg-[#EEEDE9] text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
                  <span>Back</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 h-12 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black tracking-wider uppercase shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BODY & WEIGHT TRACKING SETUP */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 text-[#4A90C2] mb-1">
                <Scale className="w-4 h-4 stroke-[1.75]" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  BODY METRICS & COMPOSITION
                </span>
              </div>
              <h2 className="text-xl font-black text-[#0D1B2A]">Weight Tracking Setup</h2>
              <p className="text-xs text-[#68727D]">
                Track body transformation across your discipline seasons.
              </p>
            </div>

            {/* Toggle Track Weight */}
            <div className="bg-[#F7F6F2] p-3.5 rounded-2xl border border-[#EEEDE9] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0D1B2A] block">Track Body Weight</span>
                <span className="text-[10px] text-[#68727D]">Log weigh-ins and baseline progress</span>
              </div>
              <button
                type="button"
                onClick={() => setTrackWeight(!trackWeight)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  trackWeight ? 'bg-[#12324A]' : 'bg-[#EEEDE9]'
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
                  <span className="text-[11px] font-bold text-[#68727D]">Preferred Unit:</span>
                  <div className="flex bg-[#F7F6F2] p-0.5 rounded-xl border border-[#EEEDE9]">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('lb')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'lb' ? 'bg-[#12324A] text-white' : 'text-[#68727D]'
                      }`}
                    >
                      LB
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        weightUnit === 'kg' ? 'bg-[#12324A] text-white' : 'text-[#68727D]'
                      }`}
                    >
                      KG
                    </button>
                  </div>
                </div>

                {/* Starting Weight / Baseline */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#68727D]">
                      Starting Weight ({weightUnit})
                    </label>
                    <span className="text-[9px] font-extrabold text-[#4A90C2]">LIFETIME BASELINE</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={startingWeight}
                    onChange={(e) => setStartingWeight(e.target.value)}
                    placeholder={weightUnit === 'lb' ? 'e.g. 215.0' : 'e.g. 97.5'}
                    className="w-full h-11 px-4 bg-[#F7F6F2] border border-[#EEEDE9] rounded-2xl text-sm font-bold text-[#0D1B2A] placeholder:text-[#68727D]/60 focus:outline-none focus:border-[#4A90C2] transition-all"
                  />
                  <p className="text-[10px] text-[#68727D]">
                    Your first entry establishes your lifetime starting baseline.
                  </p>
                </div>

                {/* Body Mode Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#68727D] block">
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
                            ? 'bg-[#12324A] text-white border-[#12324A]'
                            : 'bg-[#F7F6F2] text-[#68727D] border-[#EEEDE9]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Weight */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#68727D] block">
                    Target Goal Weight ({weightUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder={weightUnit === 'lb' ? 'e.g. 195.0' : 'e.g. 88.0'}
                    className="w-full h-11 px-4 bg-[#F7F6F2] border border-[#EEEDE9] rounded-2xl text-sm font-bold text-[#0D1B2A] placeholder:text-[#68727D]/60 focus:outline-none focus:border-[#4A90C2] transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] text-center space-y-1 text-[#68727D]">
                <CheckCircle2 className="w-6 h-6 text-[#68727D] mx-auto stroke-[1.75]" />
                <p className="text-xs font-bold text-[#0D1B2A]">Weight tracking disabled for now</p>
                <p className="text-[11px] text-[#68727D]">
                  You can enable weight tracking at any time in Settings.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-12 px-4 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] hover:bg-[#EEEDE9] text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 h-12 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black tracking-wider uppercase shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>NEXT: INITIAL ARC</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INITIAL ARC CONFIGURATION */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2 text-[#4A90C2] mb-1">
                <Calendar className="w-4 h-4 stroke-[1.75]" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  PROGRESSION ARC
                </span>
              </div>
              <h2 className="text-xl font-black text-[#0D1B2A]">Configure Your First Arc</h2>
              <p className="text-xs text-[#68727D]">
                An Arc is a dedicated season of discipline, daily quests, and focused momentum.
              </p>
            </div>

            {/* Arc Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#68727D] block">
                Arc Title
              </label>
              <input
                type="text"
                value={arcName}
                onChange={(e) => setArcName(e.target.value)}
                placeholder="e.g. Arc 1, Winter Arc, Rise Season"
                className="w-full h-11 px-4 bg-[#F7F6F2] border border-[#EEEDE9] rounded-2xl text-sm font-bold text-[#0D1B2A] placeholder:text-[#68727D]/60 focus:outline-none focus:border-[#4A90C2] transition-all"
              />
            </div>

            {/* Arc Duration */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#68727D] block">
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
                        ? 'bg-[#12324A] text-white border-[#12324A]'
                        : 'bg-[#F7F6F2] text-[#68727D] border-[#EEEDE9]'
                    }`}
                  >
                    <span className="text-xs font-black block">{d.label}</span>
                    <span className={`text-[9px] ${arcDurationDays === d.days ? 'text-[#DCEAF4]' : 'text-[#68727D]'}`}>
                      {d.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Daily Steps */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#68727D] block">
                  Daily Step Goal
                </label>
                <span className="text-[10px] font-bold text-[#4A90C2]">10,000 baseline</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  value={stepTarget}
                  onChange={(e) => setStepTarget(parseInt(e.target.value) || 10000)}
                  className="w-full h-11 px-4 bg-[#F7F6F2] border border-[#EEEDE9] rounded-2xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#4A90C2]"
                />
                <Footprints className="w-4 h-4 text-[#68727D] absolute right-4 top-1/2 -translate-y-1/2 stroke-[1.75]" />
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-[#F7F6F2] rounded-2xl p-3.5 border border-[#EEEDE9] text-xs text-[#68727D] space-y-1.5">
              <div className="flex justify-between font-bold">
                <span>Start Date:</span>
                <span className="text-[#0D1B2A]">{formatOrdinalDate(activeTodayDate)} (Day 1)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>End Date:</span>
                <span className="text-[#0D1B2A]">{formatOrdinalDate(addDays(activeTodayDate, arcDurationDays))}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Initial State:</span>
                <span className="text-[#12324A]">0 XP • Level 1 Novice • 0 Days</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-12 px-4 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] hover:bg-[#EEEDE9] text-[#0D1B2A] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 h-12 rounded-2xl bg-[#12324A] hover:bg-[#0D1B2A] text-white text-xs font-black tracking-wider uppercase shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>START YOUR JOURNEY</span>
                <Sparkles className="w-4 h-4 text-[#DCEAF4] stroke-[1.75]" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
