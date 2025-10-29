// Tipos para o sistema de treinos e usuários
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  streak: number;
  completedWorkouts: number;
  waterIntake: number;
  dailyWaterGoal: number;
  preferences: {
    objetivo: string;
    nivel: string;
    tempo: string;
    equipamentos: string[];
    restricoes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Todos os níveis';
  type: 'Calistenia' | 'HIIT' | 'Força' | 'Cardio' | 'Mobilidade' | 'Yoga';
  thumbnail: string;
  videoUrl: string;
  exercises: Exercise[];
  targetMuscles: string[];
  equipment: string[];
  calories: number;
  points: number;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  restTime?: string;
  instructions: string[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  pointsEarned: number;
  caloriesBurned: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'water' | 'meal' | 'workout' | 'achievement';
  title: string;
  message: string;
  scheduled: Date;
  sent: boolean;
  read: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  condition: {
    type: 'streak' | 'workouts' | 'points' | 'water';
    value: number;
  };
}

export interface RankingUser {
  id: string;
  name: string;
  points: number;
  level: number;
  avatar: string;
  streak: number;
  completedWorkouts: number;
  position: number;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  meals: Meal[];
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  waterGoal: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Food {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface QuizResponse {
  objetivo: 'perder_peso' | 'ganhar_massa' | 'condicionamento' | 'tonificar';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tempo: '15-30min' | '30-45min' | '45-60min' | '60min+';
  equipamentos: string[];
  restricoes: string[];
}

// Tipos para a Biblioteca de Treinos
export interface LibraryExercise {
  id: string;
  name: string;
  modality: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  objective: string[];
  duration: string;
  equipment: string[];
  videoUrl: string;
  thumbnail: string;
  shortDescription: string;
  fullDescription: string;
  targetMuscles: string[];
  instructions: string[];
  variations: string[];
  tags: string[];
  calories: number;
  points: number;
  isFavorite?: boolean;
  isCompleted?: boolean;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  modality: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  exercises: LibraryExercise[];
  description: string;
  thumbnail: string;
  targetMuscles: string[];
  equipment: string[];
  calories: number;
  points: number;
  isFavorite?: boolean;
  isCompleted?: boolean;
}

export interface Modality {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  exercises: LibraryExercise[];
  plans: WorkoutPlan[];
}