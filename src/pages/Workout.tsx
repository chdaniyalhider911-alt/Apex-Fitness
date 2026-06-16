import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RotateCcw, Plus, CheckCircle2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import MorphingRing from '@/components/MorphingRing';
import ScrambleText from '@/components/ScrambleText';
import { getExercises, saveWorkout, getActiveWorkout, saveActiveWorkout } from '@/lib/storage';
import type { Exercise, WorkoutSession, WorkoutExercise, WorkoutSet } from '@/types';

export default function Workout() {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState('All');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setExercises(getExercises());
    const saved = getActiveWorkout();
    if (saved) {
      setActiveWorkout(saved);
      setTimer(saved.duration * 60);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const startWorkout = () => {
    const newWorkout: WorkoutSession = {
      id: `w_${Date.now()}`,
      name: 'New Workout',
      date: new Date().toISOString(),
      duration: 0,
      exercises: [],
      completed: false,
    };
    setActiveWorkout(newWorkout);
    setTimer(0);
    setIsRunning(true);
    saveActiveWorkout(newWorkout);
  };

  const stopWorkout = () => {
    setIsRunning(false);
    if (activeWorkout) {
      const finalWorkout = { ...activeWorkout, duration: Math.floor(timer / 60) };
      setActiveWorkout(finalWorkout);
      saveWorkout(finalWorkout);
      saveActiveWorkout(null);
    }
  };

  const resetWorkout = () => {
    setIsRunning(false);
    setTimer(0);
    setActiveWorkout(null);
    saveActiveWorkout(null);
  };

  const addExercise = (exercise: Exercise) => {
    if (!activeWorkout) return;
    const newEx: WorkoutExercise = {
      id: `we_${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: [{ id: `s_${Date.now()}`, reps: 0, weight: 0, completed: false }],
    };
    const updated = {
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newEx],
    };
    setActiveWorkout(updated);
    saveActiveWorkout(updated);
    setShowExercisePicker(false);
    setExpandedExercises(prev => new Set(prev).add(newEx.id));
  };

  const addSet = (exerciseId: string) => {
    if (!activeWorkout) return;
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex: WorkoutExercise) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: [...ex.sets, { id: `s_${Date.now()}`, reps: 0, weight: 0, completed: false }],
        };
      }),
    };
    setActiveWorkout(updated);
    saveActiveWorkout(updated);
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!activeWorkout) return;
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex: WorkoutExercise) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s: WorkoutSet) => s.id === setId ? { ...s, [field]: value } : s),
        };
      }),
    };
    setActiveWorkout(updated);
    saveActiveWorkout(updated);
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    if (!activeWorkout) return;
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex: WorkoutExercise) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s: WorkoutSet) => s.id === setId ? { ...s, completed: !s.completed } : s),
        };
      }),
    };
    setActiveWorkout(updated);
    saveActiveWorkout(updated);
  };

  const removeExercise = (exerciseId: string) => {
    if (!activeWorkout) return;
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((ex: WorkoutExercise) => ex.id !== exerciseId),
    };
    setActiveWorkout(updated);
    saveActiveWorkout(updated);
  };

  const toggleExpand = (id: string) => {
    setExpandedExercises(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const filteredExercises = exercises.filter(e => filter === 'All' || e.muscleGroup === filter);
  const muscleGroups = ['All', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))];

  if (!activeWorkout) {
    return (
      <div className="min-h-full pb-24 flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <ScrambleText text="WORKOUT" className="text-4xl sm:text-5xl font-black tracking-tighter text-white" mountDelay={200} />
          <p className="text-sm text-[#888888] mt-2">Ready to push your limits?</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <MorphingRing seconds={0} label="READY" />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={startWorkout}
            className="mt-8 gradient-cta text-white font-bold text-lg px-10 py-4 rounded-2xl flex items-center gap-3"
            style={{ boxShadow: '0 0 24px rgba(255,102,0,0.4)' }}
          >
            <Play size={22} className="ml-0.5" />
            START WORKOUT
          </motion.button>

          <p className="text-xs text-[#888888] mt-4 text-center">Tap to begin tracking your session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24">
      {/* Timer Section */}
      <div className="px-5 pt-6 pb-4 flex flex-col items-center">
        <ScrambleText text={isRunning ? 'ACTIVE SESSION' : 'PAUSED'} className="text-xs uppercase tracking-widest text-[#ff6600] mb-4" />
        <div onClick={toggleTimer} className="cursor-pointer">
          <MorphingRing seconds={timer} label={isRunning ? 'ACTIVE' : 'PAUSED'} />
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTimer} className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            {isRunning ? <Square size={18} className="text-[#ff0080]" /> : <Play size={18} className="text-[#ff6600] ml-0.5" />}
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={resetWorkout} className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <RotateCcw size={18} className="text-[#888888]" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={stopWorkout} className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <CheckCircle2 size={18} className="text-green-500" />
          </motion.button>
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Exercises</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowExercisePicker(true)}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center"
          >
            <Plus size={16} className="text-[#ff6600]" />
          </motion.button>
        </div>

        <div className="space-y-3">
          {activeWorkout.exercises.map((exercise: WorkoutExercise) => (
            <motion.div
              key={exercise.id}
              layout
              className="bg-[#1a1a1a] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(exercise.id)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{exercise.exerciseName}</div>
                  <div className="text-xs text-[#888888]">{exercise.muscleGroup} · {exercise.sets.length} sets</div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); removeExercise(exercise.id); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    <Trash2 size={14} className="text-[#888888]" />
                  </motion.button>
                  {expandedExercises.has(exercise.id) ? (
                    <ChevronUp size={16} className="text-[#888888]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#888888]" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedExercises.has(exercise.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3">
                      {/* Set Headers */}
                      <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-wider text-[#888888]">
                        <span className="w-8">Set</span>
                        <span className="flex-1">Lbs</span>
                        <span className="flex-1">Reps</span>
                        <span className="w-8"></span>
                      </div>
                      {/* Sets */}
                      {exercise.sets.map((set: WorkoutSet, idx: number) => (
                        <div key={set.id} className="flex items-center gap-2 mb-1.5">
                          <span className="w-8 text-xs text-[#888888]">{idx + 1}</span>
                          <input
                            type="number"
                            value={set.weight || ''}
                            onChange={(e) => updateSet(exercise.id, set.id, 'weight', Number(e.target.value))}
                            placeholder="0"
                            className="flex-1 bg-[#222] rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:ring-1 focus:ring-[#ff6600]"
                          />
                          <input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(exercise.id, set.id, 'reps', Number(e.target.value))}
                            placeholder="0"
                            className="flex-1 bg-[#222] rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:ring-1 focus:ring-[#ff6600]"
                          />
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => toggleSetComplete(exercise.id, set.id)}
                            className="w-8 h-8 flex items-center justify-center"
                          >
                            <CheckCircle2
                              size={18}
                              className={set.completed ? 'text-green-500' : 'text-[#333]'}
                            />
                          </motion.button>
                        </div>
                      ))}
                      {/* Add Set */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addSet(exercise.id)}
                        className="w-full mt-2 py-2 rounded-xl bg-[#222] text-xs font-semibold text-[#888888] flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        Add Set
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exercise Picker Sheet */}
      <AnimatePresence>
        {showExercisePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            onClick={() => setShowExercisePicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl max-h-[70vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#333]" />
              </div>
              <div className="px-5 pb-3">
                <h3 className="text-lg font-bold text-white mb-3">Add Exercise</h3>
                {/* Filter */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {muscleGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => setFilter(group)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        filter === group
                          ? 'gradient-cta text-white'
                          : 'bg-[#222] text-[#888888]'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-y-auto max-h-[45vh] px-5 pb-8">
                <div className="space-y-2">
                  {filteredExercises.map((ex) => (
                    <motion.button
                      key={ex.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addExercise(ex)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#222] text-left"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{ex.name}</div>
                        <div className="text-xs text-[#888888]">{ex.muscleGroup} · {ex.equipment}</div>
                      </div>
                      <Plus size={16} className="text-[#ff6600]" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
