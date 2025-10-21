import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { UserProfile, WorkoutPlan, NutritionPlan, HydrationPlan } from './types';

// Função para gerar plano de treino baseado no perfil do usuário
export function generateWorkoutPlan(profile: Partial<UserProfile>): WorkoutPlan {
  const workoutTypes = {
    'lose-weight': ['cardio', 'hiit'],
    'gain-muscle': ['strength', 'calisthenics'],
    'maintain': ['strength', 'cardio', 'yoga'],
    'improve-health': ['cardio', 'yoga', 'hiit']
  };

  const difficultyMap = {
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced'
  } as const;

  const timeMap = {
    '15-30': 25,
    '30-45': 40,
    '45-60': 55,
    '60+': 70
  };

  const goal = profile.goal || 'improve-health';
  const level = profile.level || 'beginner';
  const timeAvailable = profile.timeAvailable || '30-45';

  const availableTypes = workoutTypes[goal];
  const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)] as any;

  return {
    id: `workout_${Date.now()}`,
    userId: profile.id || 'temp_user',
    name: `Treino ${selectedType.toUpperCase()} Personalizado`,
    description: `Plano de treino ${selectedType} adaptado para ${goal.replace('-', ' ')}`,
    duration: timeMap[timeAvailable],
    difficulty: difficultyMap[level],
    type: selectedType,
    exercises: generateExercises(selectedType, level, profile.equipment || []),
    createdAt: new Date(),
    isActive: true
  };
}

// Função para gerar exercícios baseados no tipo de treino
function generateExercises(type: string, level: string, equipment: string[]) {
  const exerciseDatabase = {
    cardio: [
      {
        id: 'cardio_1',
        name: 'Corrida no Lugar',
        description: 'Corrida estacionária para aquecimento cardiovascular',
        duration: 300, // 5 minutos
        equipment: [],
        muscleGroups: ['cardio'],
        instructions: [
          'Mantenha postura ereta',
          'Eleve os joelhos alternadamente',
          'Mantenha ritmo constante',
          'Respire de forma controlada'
        ]
      },
      {
        id: 'cardio_2',
        name: 'Jumping Jacks',
        description: 'Exercício cardiovascular de corpo inteiro',
        reps: 20,
        sets: 3,
        restTime: 30,
        equipment: [],
        muscleGroups: ['cardio', 'pernas', 'braços'],
        instructions: [
          'Comece com pés juntos e braços ao lado',
          'Pule abrindo pernas e elevando braços',
          'Retorne à posição inicial',
          'Mantenha ritmo constante'
        ]
      }
    ],
    strength: [
      {
        id: 'strength_1',
        name: 'Flexão de Braço',
        description: 'Exercício fundamental para peitoral e tríceps',
        reps: level === 'beginner' ? 8 : level === 'intermediate' ? 12 : 15,
        sets: level === 'beginner' ? 2 : 3,
        restTime: 60,
        equipment: [],
        muscleGroups: ['peitoral', 'tríceps', 'core'],
        instructions: [
          'Posição de prancha com mãos na largura dos ombros',
          'Desça o corpo mantendo linha reta',
          'Empurre de volta à posição inicial',
          'Mantenha core contraído'
        ]
      },
      {
        id: 'strength_2',
        name: 'Agachamento',
        description: 'Exercício fundamental para pernas e glúteos',
        reps: level === 'beginner' ? 10 : level === 'intermediate' ? 15 : 20,
        sets: level === 'beginner' ? 2 : 3,
        restTime: 45,
        equipment: [],
        muscleGroups: ['quadríceps', 'glúteos', 'core'],
        instructions: [
          'Pés na largura dos ombros',
          'Desça como se fosse sentar',
          'Mantenha joelhos alinhados com pés',
          'Suba empurrando pelos calcanhares'
        ]
      }
    ],
    hiit: [
      {
        id: 'hiit_1',
        name: 'Burpees',
        description: 'Exercício de alta intensidade para corpo inteiro',
        reps: level === 'beginner' ? 5 : level === 'intermediate' ? 8 : 12,
        sets: 4,
        restTime: 30,
        equipment: [],
        muscleGroups: ['corpo inteiro'],
        instructions: [
          'Comece em pé',
          'Agache e coloque mãos no chão',
          'Pule para posição de prancha',
          'Faça flexão (opcional)',
          'Pule pés de volta e salte para cima'
        ]
      }
    ],
    yoga: [
      {
        id: 'yoga_1',
        name: 'Saudação ao Sol',
        description: 'Sequência clássica de yoga para alongamento e força',
        duration: 600, // 10 minutos
        equipment: [],
        muscleGroups: ['corpo inteiro'],
        instructions: [
          'Comece em pé com palmas juntas',
          'Eleve braços inspirando',
          'Dobre para frente expirando',
          'Continue a sequência fluida',
          'Respire profundamente'
        ]
      }
    ]
  };

  return exerciseDatabase[type as keyof typeof exerciseDatabase] || exerciseDatabase.cardio;
}

// Função para gerar plano nutricional
export function generateNutritionPlan(profile: Partial<UserProfile>): NutritionPlan {
  const baseCalories = calculateDailyCalories(profile);
  const macros = calculateMacros(profile.goal || 'maintain', baseCalories);

  return {
    id: `nutrition_${Date.now()}`,
    userId: profile.id || 'temp_user',
    name: 'Plano Nutricional Personalizado',
    dailyCalories: baseCalories,
    macros,
    meals: generateMeals(baseCalories, macros),
    createdAt: new Date(),
    isActive: true
  };
}

// Calcular calorias diárias baseado no perfil
function calculateDailyCalories(profile: Partial<UserProfile>): number {
  const weight = profile.weight || 70;
  const age = profile.age || 30;
  const goal = profile.goal || 'maintain';

  // Fórmula básica (simplificada)
  let baseCalories = weight * 24; // Metabolismo basal aproximado

  // Ajustar baseado no objetivo
  switch (goal) {
    case 'lose-weight':
      return Math.round(baseCalories * 0.8); // Déficit calórico
    case 'gain-muscle':
      return Math.round(baseCalories * 1.2); // Superávit calórico
    case 'maintain':
      return Math.round(baseCalories);
    case 'improve-health':
      return Math.round(baseCalories);
    default:
      return Math.round(baseCalories);
  }
}

// Calcular distribuição de macronutrientes
function calculateMacros(goal: string, totalCalories: number) {
  const macroDistribution = {
    'lose-weight': { protein: 0.35, carbs: 0.35, fat: 0.30 },
    'gain-muscle': { protein: 0.30, carbs: 0.45, fat: 0.25 },
    'maintain': { protein: 0.25, carbs: 0.45, fat: 0.30 },
    'improve-health': { protein: 0.25, carbs: 0.50, fat: 0.25 }
  };

  const distribution = macroDistribution[goal as keyof typeof macroDistribution] || macroDistribution.maintain;

  return {
    protein: Math.round((totalCalories * distribution.protein) / 4), // 4 cal/g
    carbs: Math.round((totalCalories * distribution.carbs) / 4), // 4 cal/g
    fat: Math.round((totalCalories * distribution.fat) / 9) // 9 cal/g
  };
}

// Gerar refeições
function generateMeals(totalCalories: number, macros: any) {
  const calorieDistribution = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snack: 0.10
  };

  return [
    {
      id: 'breakfast_1',
      name: 'Aveia com Frutas e Castanhas',
      type: 'breakfast' as const,
      calories: Math.round(totalCalories * calorieDistribution.breakfast),
      ingredients: [
        { name: 'Aveia em flocos', quantity: 50, unit: 'g', calories: 190 },
        { name: 'Banana', quantity: 1, unit: 'unidade', calories: 90 },
        { name: 'Castanha do Pará', quantity: 3, unit: 'unidades', calories: 60 },
        { name: 'Leite desnatado', quantity: 200, unit: 'ml', calories: 70 }
      ],
      instructions: [
        'Cozinhe a aveia com o leite',
        'Adicione a banana picada',
        'Finalize com as castanhas'
      ],
      prepTime: 10
    },
    {
      id: 'lunch_1',
      name: 'Frango Grelhado com Arroz Integral',
      type: 'lunch' as const,
      calories: Math.round(totalCalories * calorieDistribution.lunch),
      ingredients: [
        { name: 'Peito de frango', quantity: 150, unit: 'g', calories: 250 },
        { name: 'Arroz integral', quantity: 80, unit: 'g', calories: 280 },
        { name: 'Brócolis', quantity: 100, unit: 'g', calories: 25 },
        { name: 'Azeite', quantity: 1, unit: 'colher de sopa', calories: 120 }
      ],
      instructions: [
        'Tempere e grelhe o frango',
        'Cozinhe o arroz integral',
        'Refogue o brócolis no azeite',
        'Sirva tudo junto'
      ],
      prepTime: 30
    },
    {
      id: 'dinner_1',
      name: 'Salmão com Salada Verde',
      type: 'dinner' as const,
      calories: Math.round(totalCalories * calorieDistribution.dinner),
      ingredients: [
        { name: 'Filé de salmão', quantity: 120, unit: 'g', calories: 250 },
        { name: 'Mix de folhas', quantity: 100, unit: 'g', calories: 20 },
        { name: 'Tomate cereja', quantity: 100, unit: 'g', calories: 18 },
        { name: 'Azeite extra virgem', quantity: 1, unit: 'colher de sopa', calories: 120 }
      ],
      instructions: [
        'Grelhe o salmão com temperos',
        'Prepare a salada com folhas e tomates',
        'Tempere com azeite e limão'
      ],
      prepTime: 20
    },
    {
      id: 'snack_1',
      name: 'Iogurte com Granola',
      type: 'snack' as const,
      calories: Math.round(totalCalories * calorieDistribution.snack),
      ingredients: [
        { name: 'Iogurte natural', quantity: 150, unit: 'g', calories: 90 },
        { name: 'Granola', quantity: 30, unit: 'g', calories: 120 }
      ],
      instructions: [
        'Sirva o iogurte em uma tigela',
        'Adicione a granola por cima'
      ],
      prepTime: 2
    }
  ];
}

// Função para calcular hidratação ideal
export function generateHydrationPlan(profile: Partial<UserProfile>): HydrationPlan {
  const weight = profile.weight || 70;
  const dailyGoal = Math.round(weight * 35); // 35ml por kg de peso corporal

  return {
    id: `hydration_${Date.now()}`,
    userId: profile.id || 'temp_user',
    dailyGoal,
    currentIntake: 0,
    reminders: [
      { id: 'reminder_1', time: '07:00', amount: 300, isActive: true },
      { id: 'reminder_2', time: '10:00', amount: 250, isActive: true },
      { id: 'reminder_3', time: '13:00', amount: 300, isActive: true },
      { id: 'reminder_4', time: '16:00', amount: 250, isActive: true },
      { id: 'reminder_5', time: '19:00', amount: 200, isActive: true },
      { id: 'reminder_6', time: '21:00', amount: 150, isActive: true }
    ],
    lastUpdated: new Date()
  };
}

// Função para formatar tempo de treino
export function formatWorkoutTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

// Função para calcular progresso semanal
export function calculateWeeklyProgress(completedWorkouts: number, plannedWorkouts: number): number {
  return Math.round((completedWorkouts / plannedWorkouts) * 100);
}

// Função para gerar dicas motivacionais
export function getMotivationalTip(): string {
  const tips = [
    "Cada treino é um passo em direção ao seu objetivo! 💪",
    "A consistência é mais importante que a perfeição. Continue! 🌟",
    "Seu corpo pode fazer isso. É sua mente que você precisa convencer! 🧠",
    "O único treino ruim é aquele que não acontece. Vamos lá! 🔥",
    "Transformação acontece fora da sua zona de conforto! 🚀",
    "Cada gota de suor é um investimento no seu futuro! 💧",
    "Você é mais forte do que pensa. Prove para si mesmo! ⚡",
    "O progresso pode ser lento, mas desistir não acelera nada! 🎯"
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}

// Função para validar se o usuário pode usar créditos
export function canUseCredits(currentCredits: number, actionCost: number): boolean {
  return currentCredits >= actionCost;
}

// Função para calcular próxima recarga de créditos
export function getNextCreditRefill(lastRefill: Date, plan: string): Date {
  const nextRefill = new Date(lastRefill);
  nextRefill.setMonth(nextRefill.getMonth() + 1);
  return nextRefill;
}