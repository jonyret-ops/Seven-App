import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Dumbbell, Zap, Apple, Eye, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SevenLogo } from './SevenLogo';

interface CharacterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterCardModal: React.FC<CharacterCardModalProps> = ({ isOpen, onClose }) => {
  const { profile, levelInfo, totalCumulativeXp, characterStats, streakStats, weightStats } = useApp();

  const statConfig = [
    { label: 'Faith', value: characterStats.faith, icon: Shield, color: 'text-indigo-400', bar: 'bg-indigo-500' },
    { label: 'Fitness', value: characterStats.fitness, icon: Dumbbell, color: 'text-emerald-400', bar: 'bg-emerald-500' },
    { label: 'Discipline', value: characterStats.discipline, icon: Zap, color: 'text-amber-400', bar: 'bg-amber-500' },
    { label: 'Nutrition', value: characterStats.nutrition, icon: Apple, color: 'text-rose-400', bar: 'bg-rose-500' },
    { label: 'Focus', value: characterStats.focus, icon: Eye, color: 'text-cyan-400', bar: 'bg-cyan-500' },
    { label: 'Character', value: characterStats.character, icon: HeartHandshake, color: 'text-purple-400', bar: 'bg-purple-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#14171D] border border-white/[0.1] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-white shadow-2xl space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <SevenLogo size="sm" />
                <div>
                  <h3 className="text-base font-black text-white">Character Dossier</h3>
                  <p className="text-[11px] text-zinc-400">Progression attributes & RPG stats</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile banner */}
            <div className="bg-[#181C23] p-4 rounded-2xl border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">
                  LEVEL {levelInfo.currentLevel} • {levelInfo.currentTitle}
                </span>
                <h2 className="text-xl font-black text-white">{profile.name}</h2>
                <p className="text-xs text-zinc-400">
                  {totalCumulativeXp.toLocaleString()} Lifetime XP • {streakStats.longestStreak} Day Best Streak
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl">
                {profile.name ? profile.name[0].toUpperCase() : '7'}
              </div>
            </div>

            {/* 6 Character Stats */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
                CORE ATTRIBUTES (1–100)
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {statConfig.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                          <span className="text-xs font-bold text-zinc-300">{stat.label}</span>
                        </div>
                        <span className="text-sm font-black text-white">{stat.value}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
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
            <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">Weight Lost</span>
                <span className="text-sm font-black text-emerald-400">
                  {weightStats.weightLostLifetime > 0
                    ? `-${weightStats.weightLostLifetime} ${weightStats.unit || 'lb'}`
                    : `0 ${weightStats.unit || 'lb'}`}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">Conquered</span>
                <span className="text-sm font-black text-white">{streakStats.totalSuccessfulDays} d</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase block">100% Days</span>
                <span className="text-sm font-black text-cyan-400">{streakStats.totalPerfectDays} d</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
