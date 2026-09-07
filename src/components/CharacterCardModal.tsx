import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Dumbbell, Zap, Apple, Eye, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProfileIcon } from './ProfileIcon';

interface CharacterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterCardModal: React.FC<CharacterCardModalProps> = ({ isOpen, onClose }) => {
  const { profile, levelInfo, totalCumulativeXp, characterStats, streakStats, weightStats } = useApp();

  const statConfig = [
    { label: 'Faith', value: characterStats.faith, icon: Shield, color: 'text-[#12324A]', bar: 'bg-[#12324A]' },
    { label: 'Fitness', value: characterStats.fitness, icon: Dumbbell, color: 'text-[#4A90C2]', bar: 'bg-[#4A90C2]' },
    { label: 'Discipline', value: characterStats.discipline, icon: Zap, color: 'text-[#12324A]', bar: 'bg-[#12324A]' },
    { label: 'Nutrition', value: characterStats.nutrition, icon: Apple, color: 'text-[#4A90C2]', bar: 'bg-[#4A90C2]' },
    { label: 'Focus', value: characterStats.focus, icon: Eye, color: 'text-[#12324A]', bar: 'bg-[#12324A]' },
    { label: 'Character', value: characterStats.character, icon: HeartHandshake, color: 'text-[#4A90C2]', bar: 'bg-[#4A90C2]' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-[#EEEDE9] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 text-[#0D1B2A] shadow-2xl space-y-4 no-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEDE9]">
              <div>
                <h3 className="text-base font-black text-[#0D1B2A]">Character Dossier</h3>
                <p className="text-[11px] text-[#68727D]">Progression attributes & RPG stats</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#F7F6F2] text-[#68727D] hover:text-[#0D1B2A] flex items-center justify-center cursor-pointer border border-[#EEEDE9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile banner */}
            <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-[#EEEDE9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-[#4A90C2]">
                  LEVEL {levelInfo.currentLevel} • {levelInfo.currentTitle}
                </span>
                <h2 className="text-xl font-black text-[#0D1B2A]">{profile.name}</h2>
                <p className="text-xs text-[#68727D]">
                  {totalCumulativeXp.toLocaleString()} Lifetime XP • {streakStats.longestStreak} Day Best Streak
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F6F2] border border-[#EEEDE9] flex items-center justify-center shrink-0 shadow-xs">
                <ProfileIcon size="md" />
              </div>
            </div>

            {/* 6 Character Stats */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-[#68727D] block">
                CORE ATTRIBUTES (1–100)
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {statConfig.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-[#F7F6F2] p-3 rounded-2xl border border-[#EEEDE9] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                          <span className="text-xs font-bold text-[#0D1B2A]">{stat.label}</span>
                        </div>
                        <span className="text-sm font-black text-[#0D1B2A]">{stat.value}</span>
                      </div>
                      <div className="w-full bg-[#EEEDE9] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stat.bar}`}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lifetime metrics */}
            <div className="bg-[#F7F6F2] p-3.5 rounded-2xl border border-[#EEEDE9] grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[9px] font-bold text-[#68727D] uppercase block">Weight Lost</span>
                <span className="text-sm font-black text-[#12324A]">
                  {weightStats.weightLostLifetime > 0
                    ? `-${weightStats.weightLostLifetime} ${weightStats.unit || 'lb'}`
                    : `0 ${weightStats.unit || 'lb'}`}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-[#68727D] uppercase block">Conquered</span>
                <span className="text-sm font-black text-[#0D1B2A]">{streakStats.totalSuccessfulDays} d</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-[#68727D] uppercase block">100% Days</span>
                <span className="text-sm font-black text-[#4A90C2]">{streakStats.totalPerfectDays} d</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
