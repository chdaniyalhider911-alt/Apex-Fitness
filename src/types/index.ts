export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
}

export interface FitnessGoal {
  id: string;
  title: string;
  target: string;
  current: string;
  deadline: string;
  completed: boolean;
  category: string;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  unit: 'lbs' | 'kg';
  weeklyGoal: number;
}
