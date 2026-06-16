import type { WorkoutSession, Exercise, BodyMeasurement, FitnessGoal, UserProfile, WorkoutExercise, WorkoutSet } from '@/types';

export type { WorkoutSession, Exercise, BodyMeasurement, FitnessGoal, UserProfile, WorkoutExercise, WorkoutSet };

const KEYS = {
  workouts: 'apex_workouts',
  exercises: 'apex_exercises',
  measurements: 'apex_measurements',
  goals: 'apex_goals',
  profile: 'apex_profile',
  activeWorkout: 'apex_active_workout',
};

// Workout Sessions
export function getWorkouts(): WorkoutSession[] {
  const data = localStorage.getItem(KEYS.workouts);
  return data ? JSON.parse(data) : getDefaultWorkouts();
}

export function saveWorkout(workout: WorkoutSession): void {
  const workouts = getWorkouts();
  const existing = workouts.findIndex(w => w.id === workout.id);
  if (existing >= 0) {
    workouts[existing] = workout;
  } else {
    workouts.unshift(workout);
  }
  localStorage.setItem(KEYS.workouts, JSON.stringify(workouts));
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts().filter(w => w.id !== id);
  localStorage.setItem(KEYS.workouts, JSON.stringify(workouts));
}

// Active Workout
export function getActiveWorkout(): WorkoutSession | null {
  const data = localStorage.getItem(KEYS.activeWorkout);
  return data ? JSON.parse(data) : null;
}

export function saveActiveWorkout(workout: WorkoutSession | null): void {
  if (workout) {
    localStorage.setItem(KEYS.activeWorkout, JSON.stringify(workout));
  } else {
    localStorage.removeItem(KEYS.activeWorkout);
  }
}

// Exercises Library
export function getExercises(): Exercise[] {
  const data = localStorage.getItem(KEYS.exercises);
  return data ? JSON.parse(data) : getDefaultExercises();
}

// Measurements
export function getMeasurements(): BodyMeasurement[] {
  const data = localStorage.getItem(KEYS.measurements);
  return data ? JSON.parse(data) : getDefaultMeasurements();
}

export function saveMeasurement(measurement: BodyMeasurement): void {
  const measurements = getMeasurements();
  measurements.unshift(measurement);
  localStorage.setItem(KEYS.measurements, JSON.stringify(measurements));
}

// Goals
export function getGoals(): FitnessGoal[] {
  const data = localStorage.getItem(KEYS.goals);
  return data ? JSON.parse(data) : getDefaultGoals();
}

export function updateGoal(goal: FitnessGoal): void {
  const goals = getGoals();
  const idx = goals.findIndex(g => g.id === goal.id);
  if (idx >= 0) goals[idx] = goal;
  localStorage.setItem(KEYS.goals, JSON.stringify(goals));
}

export function addGoal(goal: FitnessGoal): void {
  const goals = getGoals();
  goals.push(goal);
  localStorage.setItem(KEYS.goals, JSON.stringify(goals));
}

// Profile
export function getProfile(): UserProfile {
  const data = localStorage.getItem(KEYS.profile);
  return data ? JSON.parse(data) : { name: 'Athlete', weight: 180, height: 72, unit: 'lbs', weeklyGoal: 4 };
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

// Default data
function getDefaultWorkouts(): WorkoutSession[] {
  return [
    {
      id: 'w1',
      name: 'Upper Body Power',
      date: new Date(Date.now() - 86400000).toISOString(),
      duration: 52,
      completed: true,
      exercises: [
        { id: 'we1', exerciseId: 'e1', exerciseName: 'Bench Press', muscleGroup: 'Chest', sets: [{ id: 's1', reps: 8, weight: 185, completed: true }, { id: 's2', reps: 8, weight: 185, completed: true }, { id: 's3', reps: 6, weight: 195, completed: true }] },
        { id: 'we2', exerciseId: 'e3', exerciseName: 'Pull-Ups', muscleGroup: 'Back', sets: [{ id: 's4', reps: 10, weight: 0, completed: true }, { id: 's5', reps: 9, weight: 0, completed: true }, { id: 's6', reps: 8, weight: 0, completed: true }] },
        { id: 'we3', exerciseId: 'e5', exerciseName: 'Overhead Press', muscleGroup: 'Shoulders', sets: [{ id: 's7', reps: 10, weight: 115, completed: true }, { id: 's8', reps: 8, weight: 115, completed: true }] },
      ],
    },
    {
      id: 'w2',
      name: 'Leg Day',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      duration: 65,
      completed: true,
      exercises: [
        { id: 'we4', exerciseId: 'e8', exerciseName: 'Squats', muscleGroup: 'Legs', sets: [{ id: 's9', reps: 8, weight: 225, completed: true }, { id: 's10', reps: 8, weight: 225, completed: true }, { id: 's11', reps: 6, weight: 245, completed: true }] },
        { id: 'we5', exerciseId: 'e9', exerciseName: 'Romanian Deadlift', muscleGroup: 'Legs', sets: [{ id: 's12', reps: 10, weight: 185, completed: true }, { id: 's13', reps: 10, weight: 185, completed: true }] },
        { id: 'we6', exerciseId: 'e10', exerciseName: 'Leg Press', muscleGroup: 'Legs', sets: [{ id: 's14', reps: 12, weight: 360, completed: true }, { id: 's15', reps: 10, weight: 360, completed: true }] },
      ],
    },
    {
      id: 'w3',
      name: 'Pull Hypertrophy',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      duration: 48,
      completed: true,
      exercises: [
        { id: 'we7', exerciseId: 'e4', exerciseName: 'Barbell Rows', muscleGroup: 'Back', sets: [{ id: 's16', reps: 10, weight: 155, completed: true }, { id: 's17', reps: 10, weight: 155, completed: true }, { id: 's18', reps: 8, weight: 165, completed: true }] },
        { id: 'we8', exerciseId: 'e11', exerciseName: 'Lat Pulldown', muscleGroup: 'Back', sets: [{ id: 's19', reps: 12, weight: 140, completed: true }, { id: 's20', reps: 11, weight: 140, completed: true }] },
        { id: 'we9', exerciseId: 'e12', exerciseName: 'Face Pulls', muscleGroup: 'Shoulders', sets: [{ id: 's21', reps: 15, weight: 50, completed: true }, { id: 's22', reps: 15, weight: 50, completed: true }] },
      ],
    },
  ];
}

function getDefaultExercises(): Exercise[] {
  return [
    { id: 'e1', name: 'Bench Press', category: 'Compound', muscleGroup: 'Chest', equipment: 'Barbell' },
    { id: 'e2', name: 'Incline Dumbbell Press', category: 'Compound', muscleGroup: 'Chest', equipment: 'Dumbbell' },
    { id: 'e3', name: 'Pull-Ups', category: 'Compound', muscleGroup: 'Back', equipment: 'Bodyweight' },
    { id: 'e4', name: 'Barbell Rows', category: 'Compound', muscleGroup: 'Back', equipment: 'Barbell' },
    { id: 'e5', name: 'Overhead Press', category: 'Compound', muscleGroup: 'Shoulders', equipment: 'Barbell' },
    { id: 'e6', name: 'Dumbbell Lateral Raise', category: 'Isolation', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
    { id: 'e7', name: 'Bicep Curls', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Dumbbell' },
    { id: 'e8', name: 'Squats', category: 'Compound', muscleGroup: 'Legs', equipment: 'Barbell' },
    { id: 'e9', name: 'Romanian Deadlift', category: 'Compound', muscleGroup: 'Legs', equipment: 'Barbell' },
    { id: 'e10', name: 'Leg Press', category: 'Compound', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'e11', name: 'Lat Pulldown', category: 'Compound', muscleGroup: 'Back', equipment: 'Cable' },
    { id: 'e12', name: 'Face Pulls', category: 'Isolation', muscleGroup: 'Shoulders', equipment: 'Cable' },
    { id: 'e13', name: 'Tricep Pushdown', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Cable' },
    { id: 'e14', name: 'Leg Curls', category: 'Isolation', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'e15', name: 'Leg Extensions', category: 'Isolation', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'e16', name: 'Chest Fly', category: 'Isolation', muscleGroup: 'Chest', equipment: 'Dumbbell' },
    { id: 'e17', name: 'Deadlift', category: 'Compound', muscleGroup: 'Back', equipment: 'Barbell' },
    { id: 'e18', name: 'Dips', category: 'Compound', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  ];
}

function getDefaultMeasurements(): BodyMeasurement[] {
  const dates = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (11 - i) * 7);
    return d.toISOString().split('T')[0];
  });
  return dates.map((date, i) => ({
    id: `m${i}`,
    date,
    weight: 182 - i * 0.5 + Math.random() * 2,
    bodyFat: 16 - i * 0.1 + Math.random() * 0.5,
    chest: 42 + Math.random() * 0.5,
    waist: 34 - i * 0.05 + Math.random() * 0.3,
    arms: 15.5 + Math.random() * 0.3,
    thighs: 24 + Math.random() * 0.4,
  }));
}

function getDefaultGoals(): FitnessGoal[] {
  return [
    { id: 'g1', title: 'Bench Press 225 lbs', target: '225', current: '195', deadline: '2026-09-01', completed: false, category: 'Strength' },
    { id: 'g2', title: 'Squat 315 lbs', target: '315', current: '245', deadline: '2026-10-01', completed: false, category: 'Strength' },
    { id: 'g3', title: 'Lose 10 lbs', target: '172', current: '180', deadline: '2026-08-01', completed: false, category: 'Weight' },
    { id: 'g4', title: 'Workout 4x/week', target: '4', current: '3', deadline: '2026-12-31', completed: false, category: 'Habit' },
    { id: 'g5', title: 'Run 5K under 25 min', target: '25:00', current: '28:30', deadline: '2026-07-15', completed: false, category: 'Cardio' },
  ];
}
