import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Flame, Dumbbell, Calendar, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ScrambleText from '@/components/ScrambleText';
import { getWorkouts, getGoals, updateGoal } from '@/lib/storage';
import type { WorkoutSession, FitnessGoal, WorkoutExercise, WorkoutSet } from '@/types';

const COLORS = ['#ff6600', '#ff0080', '#ff4800', '#ff0066', '#ff8800', '#ff3366'];

export default function Analytics() {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [goals, setGoals] = useState<FitnessGoal[]>([]);

  useEffect(() => {
    setWorkouts(getWorkouts());
    setGoals(getGoals());
  }, []);

  const strengthData = useMemo(() => {
    const data: { week: string; chest: number; back: number; legs: number; shoulders: number; arms: number }[] = [];
    const weekMap = new Map<string, { chest: number; back: number; legs: number; shoulders: number; arms: number }>();

    workouts.forEach((w: WorkoutSession) => {
      const d = new Date(w.date);
      const weekKey = `W${Math.ceil((d.getDate()) / 7)}`;
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0 });
      }
      const week = weekMap.get(weekKey)!;
      w.exercises.forEach((ex: WorkoutExercise) => {
        const volume = ex.sets.reduce((s: number, set: WorkoutSet) => s + set.reps * set.weight, 0);
        switch (ex.muscleGroup) {
          case 'Chest': week.chest += volume; break;
          case 'Back': week.back += volume; break;
          case 'Legs': week.legs += volume; break;
          case 'Shoulders': week.shoulders += volume; break;
          case 'Arms': week.arms += volume; break;
        }
      });
    });

    weekMap.forEach((val, key) => {
      data.push({ week: key, ...val });
    });

    if (data.length === 0) {
      for (let i = 1; i <= 8; i++) {
        data.push({
          week: `W${i}`,
          chest: 5000 + i * 300 + Math.random() * 500,
          back: 4500 + i * 250 + Math.random() * 400,
          legs: 6000 + i * 400 + Math.random() * 600,
          shoulders: 3000 + i * 150 + Math.random() * 300,
          arms: 2500 + i * 100 + Math.random() * 200,
        });
      }
    }
    return data;
  }, [workouts]);

  const muscleDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    workouts.forEach((w: WorkoutSession) => {
      w.exercises.forEach((ex: WorkoutExercise) => {
        const volume = ex.sets.reduce((s: number, set: WorkoutSet) => s + set.reps * set.weight, 0);
        dist[ex.muscleGroup] = (dist[ex.muscleGroup] || 0) + volume;
      });
    });
    const result = Object.entries(dist).map(([name, value]) => ({ name, value: Math.round(value) }));
    if (result.length === 0) {
      return [
        { name: 'Chest', value: 35000 },
        { name: 'Back', value: 30000 },
        { name: 'Legs', value: 42000 },
        { name: 'Shoulders', value: 20000 },
        { name: 'Arms', value: 15000 },
      ];
    }
    return result;
  }, [workouts]);

  const toggleGoal = (goal: FitnessGoal) => {
    const updated = { ...goal, completed: !goal.completed };
    updateGoal(updated);
    setGoals(goals.map(g => g.id === goal.id ? updated : g));
  };

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum: number, w: WorkoutSession) => {
    return sum + w.exercises.reduce((es: number, e: WorkoutExercise) => es + e.sets.reduce((ss: number, s: WorkoutSet) => ss + s.reps * s.weight, 0), 0);
  }, 0);

  const statsCards = [
    { icon: Dumbbell, label: 'Total Workouts', value: totalWorkouts, color: '#ff6600' },
    { icon: Flame, label: 'Total Volume', value: `${(totalVolume / 1000000).toFixed(1)}M`, color: '#ff0080' },
    { icon: Calendar, label: 'This Month', value: workouts.filter(w => {
      const d = new Date(w.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length, color: '#ff4800' },
    { icon: Award, label: 'Goals Met', value: `${goals.filter(g => g.completed).length}/${goals.length}`, color: '#ff0066' },
  ];

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <ScrambleText text="ANALYTICS" className="text-4xl sm:text-5xl font-black tracking-tighter text-white" mountDelay={200} />
        <p className="text-sm text-[#888888] mt-2">Track your progress over time</p>
      </div>

      {/* Stats Row */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {statsCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl p-4"
            >
              <stat.icon size={16} style={{ color: stat.color }} className="mb-2" />
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-[#888888] uppercase tracking-wider mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strength Chart */}
      <div className="px-5 mt-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#ff6600]" />
            <h3 className="text-sm font-bold text-white">Volume by Muscle Group</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={strengthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="week" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value.toLocaleString()} lbs`, '']}
              />
              <Line type="monotone" dataKey="chest" stroke="#ff6600" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="back" stroke="#ff0080" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="legs" stroke="#ff4800" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="shoulders" stroke="#ff3366" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3">
            {['Chest', 'Back', 'Legs', 'Shoulders'].map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-[#888888]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Muscle Distribution */}
      <div className="px-5 mt-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white mb-3">Volume Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={muscleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  stroke="none"
                >
                  {muscleDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {muscleDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-[#c8c8c8]">{entry.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{((entry.value / muscleDistribution.reduce((s, m) => s + m.value, 0)) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-[#ff0080]" />
          <h3 className="text-sm font-bold text-white">Goals</h3>
        </div>
        <div className="space-y-2">
          {goals.map((goal, idx) => (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleGoal(goal)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                goal.completed ? 'bg-[#1a2a1a]' : 'bg-[#1a1a1a]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                goal.completed ? 'border-green-500 bg-green-500/20' : 'border-[#444]'
              }`}>
                {goal.completed && <div className="w-2 h-2 rounded-full bg-green-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${goal.completed ? 'text-[#888888] line-through' : 'text-white'}`}>
                  {goal.title}
                </div>
                <div className="text-[10px] text-[#888888] mt-0.5">
                  {goal.current} / {goal.target} · {goal.category}
                </div>
              </div>
              <div className="w-16 h-1.5 bg-[#222] rounded-full overflow-hidden flex-shrink-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (parseFloat(goal.current) / parseFloat(goal.target)) * 100)}%` }}
                  transition={{ delay: 0.6 + idx * 0.05, duration: 0.5 }}
                  className="h-full rounded-full gradient-cta"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
