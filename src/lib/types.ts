export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  quizData: any;
  selectedPlan: PlanData | null;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanData {
  planId: string;
  planName: string;
  price: string;
  period: string;
  selectedAt: string;
  expiresAt: string;
  isActive: boolean;
  renewalCount: number;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'usage';
  amount: number;
  description: string;
  createdAt: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  difficulty: string;
  createdAt: string;
  isActive: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
  muscleGroups: string[];
}

export interface DietPlan {
  id: string;
  userId: string;
  name: string;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: string;
  isActive: boolean;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  calories: number;
}

export interface Food {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CustomizationRequest {
  id: string;
  userId: string;
  type: 'workout' | 'diet' | 'goal' | 'exercise' | 'meal';
  description: string;
  creditCost: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}