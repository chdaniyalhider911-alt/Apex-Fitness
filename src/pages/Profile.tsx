import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Award, Trophy, Zap, Star, Target, Flame, TrendingUp } from 'lucide-react';
import ScrambleText from '@/components/ScrambleText';
import { getProfile, saveProfile, getWorkouts } from '@/lib/storage';
import type { UserProfile } from '@/types';

const achievements = [
  { id: 'a1', title: 'First Workout', desc: 'Complete your first session', icon: Zap, unlocked: true },
  { id: 'a2', title: 'Week Warrior', desc: '7 day streak', icon: Flame, unlocked: true },
  { id: 'a3', title: 'Heavy Lifter', desc: 'Lift 10,000 lbs total', icon: TrendingUp, unlocked: true },
  { id: 'a4', title: 'Century Club', desc: '100 workouts completed', icon: Trophy, unlocked: false },
  { id: 'a5', title: 'Goal Crusher', desc: 'Complete 5 goals', icon: Target, unlocked: false },
  { id: 'a6', title: 'Elite Athlete', desc: '30 day streak', icon: Star, unlocked: false },
];

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({ name: 'Athlete', weight: 180, height: 72, unit: 'lbs', weeklyGoal: 4 });
  const [showSettings, setShowSettings] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    const workouts = getWorkouts();
    setWorkoutCount(workouts.length);
    const vol = workouts.reduce((sum, w) => {
      return sum + w.exercises.reduce((es, e) => es + e.sets.reduce((ss, s) => ss + s.reps * s.weight, 0), 0);
    }, 0);
    setTotalVolume(Math.round(vol));
  }, []);

  const handleSaveProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfile(updated);
  };

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <ScrambleText text="PROFILE" className="text-4xl sm:text-5xl font-black tracking-tighter text-white" mountDelay={200} />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center"
          >
            <Settings size={18} className="text-[#888888]" />
          </motion.button>
        </div>
      </div>

      {/* User Card */}
      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] rounded-2xl p-5 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full gradient-cta flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white">{profile.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[#888888]">{profile.weight} {profile.unit}</span>
              <span className="text-xs text-[#888888]">{Math.floor(profile.height / 12)}&apos;{profile.height % 12}&quot;</span>
              <span className="text-xs text-[#888888]">{profile.weeklyGoal}x/week goal</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lifetime Stats */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1a1a] rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-gradient">{workoutCount}</div>
            <div className="text-[10px] text-[#888888] uppercase tracking-wider mt-1">Workouts</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a1a1a] rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-gradient">{(totalVolume / 1000000).toFixed(1)}M</div>
            <div className="text-[10px] text-[#888888] uppercase tracking-wider mt-1">Lbs Lifted</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1a1a1a] rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-gradient">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-[10px] text-[#888888] uppercase tracking-wider mt-1">Badges</div>
          </motion.div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-5 mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-[#ff6600]" />
          <h3 className="text-sm font-bold text-white">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              whileHover={ach.unlocked ? { scale: 1.02 } : {}}
              className={`relative bg-[#1a1a1a] rounded-2xl p-4 ${
                ach.unlocked ? '' : 'opacity-50'
              }`}
            >
              {ach.unlocked && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff6600]" />
              )}
              <ach.icon
                size={22}
                className={ach.unlocked ? 'text-[#ff6600]' : 'text-[#444]'}
              />
              <div className={`text-sm font-bold mt-2 ${ach.unlocked ? 'text-white' : 'text-[#666]'}`}>
                {ach.title}
              </div>
              <div className="text-[10px] text-[#888888] mt-0.5">{ach.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 mt-6"
        >
          <div className="bg-[#1a1a1a] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-4">Settings</h3>

            {/* Name */}
            <div className="mb-4">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleSaveProfile({ name: e.target.value })}
                className="w-full mt-1 bg-[#222] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-[#ff6600]"
              />
            </div>

            {/* Weight */}
            <div className="mb-4">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Body Weight</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => handleSaveProfile({ weight: Number(e.target.value) })}
                  className="flex-1 bg-[#222] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-[#ff6600]"
                />
                <button
                  onClick={() => handleSaveProfile({ unit: profile.unit === 'lbs' ? 'kg' : 'lbs' })}
                  className="px-4 bg-[#222] rounded-xl text-sm font-bold text-[#ff6600]"
                >
                  {profile.unit}
                </button>
              </div>
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Height (inches)</label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => handleSaveProfile({ height: Number(e.target.value) })}
                className="w-full mt-1 bg-[#222] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-[#ff6600]"
              />
            </div>

            {/* Weekly Goal */}
            <div className="mb-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Weekly Workout Goal</label>
              <div className="flex gap-2 mt-1">
                {[2, 3, 4, 5, 6].map(n => (
                  <button
                    key={n}
                    onClick={() => handleSaveProfile({ weeklyGoal: n })}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold ${
                      profile.weeklyGoal === n ? 'gradient-cta text-white' : 'bg-[#222] text-[#888888]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* App Info */}
      <div className="px-5 mt-8 pb-4 text-center">
        <p className="text-[10px] text-[#888888]">Apex Fitness v1.0</p>
      </div>
    </div>
  );
}
