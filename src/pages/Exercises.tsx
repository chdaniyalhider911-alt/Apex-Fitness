import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, X, TrendingUp } from 'lucide-react';
import ScrambleText from '@/components/ScrambleText';
import { getExercises, getWorkouts } from '@/lib/storage';
import type { Exercise } from '@/types';

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseHistory, setExerciseHistory] = useState<{ date: string; maxWeight: number }[]>([]);

  useEffect(() => {
    setExercises(getExercises());
  }, []);

  const muscleGroups = ['All', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))];

  const filtered = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || e.muscleGroup === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const openDetail = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    // Build fake history data
    const workouts = getWorkouts();
    const history: { date: string; maxWeight: number }[] = [];
    workouts.forEach(w => {
      const exWork = w.exercises.find(we => we.exerciseId === exercise.id);
      if (exWork) {
        const maxWeight = Math.max(...exWork.sets.map(s => s.weight));
        history.push({ date: w.date, maxWeight });
      }
    });
    // Sort by date
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // If no real history, generate sample data
    if (history.length === 0) {
      const baseWeight = 100 + Math.random() * 100;
      for (let i = 0; i < 8; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (7 - i) * 7);
        history.push({ date: d.toISOString(), maxWeight: Math.round(baseWeight + i * 5 + Math.random() * 10) });
      }
    }
    setExerciseHistory(history);
  };

  const getCategoryColor = (category: string) => {
    return category === 'Compound' ? 'text-[#ff6600]' : 'text-[#ff0080]';
  };

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <ScrambleText text="EXERCISES" className="text-4xl sm:text-5xl font-black tracking-tighter text-white" mountDelay={200} />
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..."
            className="w-full bg-[#1a1a1a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#888888] outline-none focus:ring-1 focus:ring-[#ff6600]"
          />
        </div>
      </div>

      {/* Muscle Group Filters */}
      <div className="px-5 mt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {muscleGroups.map((group) => (
            <button
              key={group}
              onClick={() => setActiveFilter(group)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === group
                  ? 'gradient-cta text-white'
                  : 'bg-[#1a1a1a] text-[#888888]'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((exercise, idx) => (
            <motion.button
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openDetail(exercise)}
              className="bg-[#1a1a1a] rounded-2xl p-4 text-left flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white text-sm">{exercise.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium ${getCategoryColor(exercise.category)}`}>{exercise.category}</span>
                  <span className="text-xs text-[#888888]">{exercise.equipment}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#888888] flex-shrink-0" />
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888] text-sm">No exercises found</p>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#333]" />
              </div>

              <div className="px-5 pb-6 overflow-y-auto max-h-[75vh]">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedExercise.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-[#222] ${getCategoryColor(selectedExercise.category)}`}>
                        {selectedExercise.category}
                      </span>
                      <span className="text-xs text-[#888888]">{selectedExercise.muscleGroup}</span>
                      <span className="text-xs text-[#888888]">{selectedExercise.equipment}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
                    <X size={16} className="text-[#888888]" />
                  </button>
                </div>

                {/* 1RM Estimator */}
                <div className="bg-[#222] rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-[#ff6600]" />
                    <span className="text-sm font-bold text-white">1 Rep Max Estimate</span>
                  </div>
                  <div className="text-3xl font-black text-gradient">
                    {Math.round(exerciseHistory[exerciseHistory.length - 1]?.maxWeight * 1.15 || 0)} lbs
                  </div>
                  <p className="text-xs text-[#888888] mt-1">Based on your heaviest set</p>
                </div>

                {/* History Chart */}
                <div className="bg-[#222] rounded-2xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-white mb-3">Weight History</h4>
                  <div className="flex items-end gap-1 h-32">
                    {exerciseHistory.map((h, i) => {
                      const maxW = Math.max(...exerciseHistory.map(eh => eh.maxWeight));
                      const height = maxW > 0 ? (h.maxWeight / maxW) * 100 : 0;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="w-full bg-gradient-to-t from-[#ff4800] to-[#ff0080] rounded-t-sm min-h-[4px]"
                          />
                          <span className="text-[9px] text-[#888888]">
                            {new Date(h.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Records */}
                <div className="bg-[#222] rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-white mb-3">Personal Records</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">Heaviest Weight</span>
                      <span className="text-sm font-bold text-white">{Math.max(...exerciseHistory.map(h => h.maxWeight))} lbs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">Sessions Logged</span>
                      <span className="text-sm font-bold text-white">{exerciseHistory.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">Progress (8 weeks)</span>
                      <span className="text-sm font-bold text-green-400">
                        +{exerciseHistory.length > 1 ? exerciseHistory[exerciseHistory.length - 1].maxWeight - exerciseHistory[0].maxWeight : 0} lbs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
