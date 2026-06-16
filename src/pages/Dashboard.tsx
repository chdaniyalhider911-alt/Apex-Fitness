import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Heart, ChevronRight, Play, Clock } from 'lucide-react';
import ScrambleText from '@/components/ScrambleText';
import { getWorkouts } from '@/lib/storage';
import type { WorkoutSession, WorkoutExercise, WorkoutSet } from '@/types';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  const stats = useMemo(() => {
    const thisWeek = workouts.filter(w => {
      const d = new Date(w.date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      return diff < 7 * 86400000;
    });

    const totalVolume = thisWeek.reduce((sum: number, w: WorkoutSession) => {
      return sum + w.exercises.reduce((es: number, e: WorkoutExercise) => {
        return es + e.sets.reduce((ss: number, s: WorkoutSet) => ss + s.reps * s.weight, 0);
      }, 0);
    }, 0);

    let streak = 0;
    const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    for (const w of sorted) {
      const wd = new Date(w.date);
      wd.setHours(0, 0, 0, 0);
      const diff = Math.floor((checkDate.getTime() - wd.getTime()) / 86400000);
      if (diff <= 1) {
        streak++;
        checkDate = wd;
      } else {
        break;
      }
    }

    return {
      weeklyVolume: Math.round(totalVolume / 1000),
      streak,
      avgHR: 142,
      workoutCount: thisWeek.length,
    };
  }, [workouts]);

  const recentWorkouts = workouts.slice(0, 3);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-sm text-[#888888] uppercase tracking-widest">Welcome back</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mt-1">
          <ScrambleText text="APEX MODE" className="text-gradient" mountDelay={200} />
        </h1>
      </div>

      {/* Stats Row */}
      <div className="px-5 mt-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {/* Weekly Volume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative flex-shrink-0 w-36 bg-[#1a1a1a] rounded-2xl p-4 overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl border-glow opacity-30" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            <TrendingUp size={18} className="text-[#ff6600] mb-2" />
            <div className="text-2xl font-black text-white">{stats.weeklyVolume}k</div>
            <div className="text-[11px] text-[#888888] uppercase tracking-wider mt-0.5">Week Volume</div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative flex-shrink-0 w-36 bg-[#1a1a1a] rounded-2xl p-4"
          >
            <Flame size={18} className="text-[#ff0080] mb-2" />
            <div className="text-2xl font-black text-white">{stats.streak}</div>
            <div className="text-[11px] text-[#888888] uppercase tracking-wider mt-0.5">Day Streak</div>
          </motion.div>

          {/* Avg HR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative flex-shrink-0 w-36 bg-[#1a1a1a] rounded-2xl p-4"
          >
            <Heart size={18} className="text-[#ff6600] mb-2" />
            <div className="text-2xl font-black text-white">{stats.avgHR}</div>
            <div className="text-[11px] text-[#888888] uppercase tracking-wider mt-0.5">Avg BPM</div>
          </motion.div>

          {/* Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative flex-shrink-0 w-36 bg-[#1a1a1a] rounded-2xl p-4"
          >
            <Clock size={18} className="text-[#ff0080] mb-2" />
            <div className="text-2xl font-black text-white">{stats.workoutCount}</div>
            <div className="text-[11px] text-[#888888] uppercase tracking-wider mt-0.5">This Week</div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <motion.a
          href="#/workout"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-between w-full gradient-cta rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Play size={18} className="text-white ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-white">Start Workout</div>
              <div className="text-xs text-white/70">Log your next session</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/70" />
        </motion.a>
      </div>

      {/* Recent History */}
      <div className="px-5 mt-8">
        <h2 className="text-lg font-bold text-white mb-3">Recent Workouts</h2>
        <div className="space-y-3">
          {recentWorkouts.map((workout, idx) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white">{workout.name}</div>
                <div className="text-xs text-[#888888] mt-0.5">
                  {workout.exercises.length} exercises · {workout.duration} min · {formatDate(workout.date)}
                </div>
              </div>
              <ChevronRight size={18} className="text-[#888888]" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Summary Chart */}
      <div className="px-5 mt-8">
        <h2 className="text-lg font-bold text-white mb-3">This Week</h2>
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-end justify-between h-28 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [60, 85, 0, 70, 90, 45, 0];
              const hasWorkout = heights[i] > 0;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heights[i]}%` }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
                      className={`w-full rounded-t-md ${hasWorkout ? 'bg-gradient-to-t from-[#ff4800] to-[#ff0080]' : 'bg-[#222]'}`}
                    />
                  </div>
                  <span className="text-[10px] text-[#888888] uppercase">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
