// Sistema de geração automática de planos
export interface UserProfile {
  goal: string;
  fitnessLevel: any;
  bodyType: string;
  age: string;
  workoutLocation: string;
  workoutDuration: string;
  diet: string;
  problemAreas: string[];
  exercisePreferences: Record<string, string>;
  sportsInterest: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  duration: string;
  exercises: Exercise[];
  frequency: string;
  difficulty: string;
  focus: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
  muscleGroups: string[];
}

export interface DietPlan {
  id: string;
  name: string;
  calories: number;
  meals: Meal[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  restrictions: string[];
}

export interface Meal {
  name: string;
  time: string;
  foods: string[];
  calories: number;
}

export class PlanGenerator {
  static generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
    const baseExercises = this.getBaseExercises(profile);
    const difficulty = this.calculateDifficulty(profile.fitnessLevel);
    const focus = this.determineFocus(profile.goal, profile.problemAreas);
    
    return {
      id: `workout_${Date.now()}`,
      name: `Plano ${profile.goal} - ${difficulty}`,
      duration: profile.workoutDuration || '45 minutos',
      exercises: baseExercises,
      frequency: this.getFrequency(profile.fitnessLevel),
      difficulty,
      focus
    };
  }

  static generateDietPlan(profile: UserProfile): DietPlan {
    const calories = this.calculateCalories(profile);
    const macros = this.calculateMacros(profile.goal);
    const meals = this.generateMeals(profile, calories);
    
    return {
      id: `diet_${Date.now()}`,
      name: `Dieta ${profile.goal}`,
      calories,
      meals,
      macros,
      restrictions: this.getDietRestrictions(profile.diet)
    };
  }

  static generateMonthlyUpdate(currentPlan: WorkoutPlan, profile: UserProfile): WorkoutPlan {
    // Gerar variações do plano atual mantendo o mesmo objetivo
    const updatedExercises = this.varyExercises(currentPlan.exercises, profile);
    const progressedDifficulty = this.progressDifficulty(currentPlan.difficulty);
    
    return {
      ...currentPlan,
      id: `workout_${Date.now()}`,
      name: `${currentPlan.name} - Mês ${this.getMonthNumber()}`,
      exercises: updatedExercises,
      difficulty: progressedDifficulty
    };
  }

  private static getBaseExercises(profile: UserProfile): Exercise[] {
    const exercises: Exercise[] = [];
    
    // Exercícios baseados no local de treino
    if (profile.workoutLocation?.includes('Casa')) {
      exercises.push(
        {
          name: 'Flexões',
          sets: 3,
          reps: '8-12',
          rest: '60s',
          instructions: 'Mantenha o corpo alinhado, desça até o peito quase tocar o chão',
          muscleGroups: ['Peito', 'Tríceps', 'Core']
        },
        {
          name: 'Agachamentos',
          sets: 3,
          reps: '12-15',
          rest: '60s',
          instructions: 'Desça como se fosse sentar, mantenha os joelhos alinhados',
          muscleGroups: ['Quadríceps', 'Glúteos', 'Core']
        }
      );
    } else if (profile.workoutLocation?.includes('Academia')) {
      exercises.push(
        {
          name: 'Supino Reto',
          sets: 3,
          reps: '8-10',
          rest: '90s',
          instructions: 'Controle a descida, empurre com força',
          muscleGroups: ['Peito', 'Tríceps', 'Ombros']
        },
        {
          name: 'Agachamento Livre',
          sets: 3,
          reps: '10-12',
          rest: '90s',
          instructions: 'Mantenha a coluna ereta, desça até 90 graus',
          muscleGroups: ['Quadríceps', 'Glúteos', 'Core']
        }
      );
    }

    // Adicionar exercícios baseados no objetivo
    if (profile.goal?.includes('Massa')) {
      exercises.push({
        name: 'Rosca Direta',
        sets: 3,
        reps: '8-10',
        rest: '60s',
        instructions: 'Movimento controlado, contraia o bíceps no topo',
        muscleGroups: ['Bíceps']
      });
    } else if (profile.goal?.includes('peso')) {
      exercises.push({
        name: 'Burpees',
        sets: 3,
        reps: '5-8',
        rest: '45s',
        instructions: 'Movimento explosivo, mantenha o ritmo',
        muscleGroups: ['Corpo todo']
      });
    }

    return exercises;
  }

  private static calculateDifficulty(fitnessLevel: any): string {
    const level = fitnessLevel?.level || 5;
    if (level <= 3) return 'Iniciante';
    if (level <= 7) return 'Intermediário';
    return 'Avançado';
  }

  private static determineFocus(goal: string, problemAreas: string[]): string[] {
    const focus: string[] = [];
    
    if (goal?.includes('Massa')) {
      focus.push('Hipertrofia', 'Força');
    } else if (goal?.includes('peso')) {
      focus.push('Queima de gordura', 'Cardio');
    } else {
      focus.push('Definição', 'Resistência');
    }

    // Adicionar foco baseado nas áreas problemáticas
    if (problemAreas?.includes('Peito fraco')) focus.push('Peito');
    if (problemAreas?.includes('Braços magros')) focus.push('Braços');
    if (problemAreas?.includes('Pernas magras')) focus.push('Pernas');

    return focus;
  }

  private static getFrequency(fitnessLevel: any): string {
    const level = fitnessLevel?.level || 5;
    if (level <= 3) return '3x por semana';
    if (level <= 7) return '4x por semana';
    return '5x por semana';
  }

  private static calculateCalories(profile: UserProfile): number {
    // Cálculo básico baseado no objetivo
    let baseCalories = 2000;
    
    if (profile.goal?.includes('Massa')) {
      baseCalories = 2500;
    } else if (profile.goal?.includes('peso')) {
      baseCalories = 1800;
    }

    // Ajustar baseado na idade
    if (profile.age?.includes('18-29')) {
      baseCalories += 200;
    } else if (profile.age?.includes('50+')) {
      baseCalories -= 200;
    }

    return baseCalories;
  }

  private static calculateMacros(goal: string) {
    if (goal?.includes('Massa')) {
      return { protein: 30, carbs: 45, fat: 25 };
    } else if (goal?.includes('peso')) {
      return { protein: 35, carbs: 35, fat: 30 };
    }
    return { protein: 25, carbs: 50, fat: 25 };
  }

  private static generateMeals(profile: UserProfile, calories: number): Meal[] {
    const meals: Meal[] = [
      {
        name: 'Café da Manhã',
        time: '07:00',
        foods: ['2 ovos mexidos', '1 fatia de pão integral', '1 banana'],
        calories: Math.round(calories * 0.25)
      },
      {
        name: 'Almoço',
        time: '12:00',
        foods: ['150g peito de frango', '1 xícara de arroz integral', 'Salada verde'],
        calories: Math.round(calories * 0.35)
      },
      {
        name: 'Lanche',
        time: '15:30',
        foods: ['1 iogurte grego', '1 punhado de castanhas'],
        calories: Math.round(calories * 0.15)
      },
      {
        name: 'Jantar',
        time: '19:00',
        foods: ['120g salmão grelhado', 'Legumes no vapor', '1 batata doce'],
        calories: Math.round(calories * 0.25)
      }
    ];

    // Ajustar baseado na dieta
    if (profile.diet?.includes('Vegetariano')) {
      meals[1].foods = ['150g tofu grelhado', '1 xícara de quinoa', 'Salada verde'];
      meals[3].foods = ['120g tempeh', 'Legumes no vapor', '1 batata doce'];
    } else if (profile.diet?.includes('Vegano')) {
      meals[0].foods = ['Smoothie de proteína vegana', '1 fatia de pão integral', '1 banana'];
      meals[1].foods = ['150g grão-de-bico', '1 xícara de arroz integral', 'Salada verde'];
      meals[2].foods = ['1 iogurte de coco', '1 punhado de castanhas'];
      meals[3].foods = ['120g lentilhas', 'Legumes no vapor', '1 batata doce'];
    }

    return meals;
  }

  private static getDietRestrictions(diet: string): string[] {
    const restrictions: string[] = [];
    
    if (diet?.includes('Vegetariano')) {
      restrictions.push('Sem carne');
    }
    if (diet?.includes('Vegano')) {
      restrictions.push('Sem produtos animais');
    }
    if (diet?.includes('Cetogênica')) {
      restrictions.push('Baixo carboidrato');
    }

    return restrictions;
  }

  private static varyExercises(currentExercises: Exercise[], profile: UserProfile): Exercise[] {
    // Criar variações dos exercícios atuais
    return currentExercises.map(exercise => {
      const variations = this.getExerciseVariations(exercise.name);
      const newExercise = variations[Math.floor(Math.random() * variations.length)];
      
      return {
        ...exercise,
        name: newExercise,
        sets: exercise.sets + (Math.random() > 0.5 ? 1 : 0), // Possível progressão
        reps: this.progressReps(exercise.reps)
      };
    });
  }

  private static getExerciseVariations(exerciseName: string): string[] {
    const variations: Record<string, string[]> = {
      'Flexões': ['Flexões', 'Flexões Diamante', 'Flexões Inclinadas', 'Flexões Declinadas'],
      'Agachamentos': ['Agachamentos', 'Agachamento Sumo', 'Agachamento Búlgaro', 'Agachamento Jump'],
      'Supino Reto': ['Supino Reto', 'Supino Inclinado', 'Supino com Halteres', 'Supino Declinado'],
      'Burpees': ['Burpees', 'Burpees com Jump', 'Half Burpees', 'Burpees com Flexão']
    };

    return variations[exerciseName] || [exerciseName];
  }

  private static progressReps(currentReps: string): string {
    // Lógica simples de progressão
    const [min, max] = currentReps.split('-').map(n => parseInt(n));
    if (max) {
      return `${min + 1}-${max + 2}`;
    }
    return currentReps;
  }

  private static progressDifficulty(currentDifficulty: string): string {
    const progression = {
      'Iniciante': 'Iniciante+',
      'Iniciante+': 'Intermediário',
      'Intermediário': 'Intermediário+',
      'Intermediário+': 'Avançado',
      'Avançado': 'Avançado+'
    };

    return progression[currentDifficulty] || currentDifficulty;
  }

  private static getMonthNumber(): number {
    // Simular número do mês baseado na data de início do plano
    return Math.floor(Math.random() * 12) + 1;
  }
}

// Sistema de automação de planos
export class PlanAutomation {
  static scheduleMonthlyUpdates(userId: string, planType: string) {
    // Em um sistema real, isso seria agendado no backend
    const updateInterval = this.getUpdateInterval(planType);
    
    // Simular agendamento
    console.log(`Agendando atualizações a cada ${updateInterval} dias para usuário ${userId}`);
  }

  static getUpdateInterval(planType: string): number {
    const intervals = {
      'weekly': 7,
      'monthly': 30,
      'quarterly': 30, // Atualiza mensalmente mesmo sendo trimestral
      'biannual': 30,
      'annual': 30
    };

    return intervals[planType] || 30;
  }

  static shouldGenerateNewPlan(lastUpdateDate: string, planType: string): boolean {
    const lastUpdate = new Date(lastUpdateDate);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceUpdate >= this.getUpdateInterval(planType);
  }
}

// Sistema de créditos
export class CreditSystem {
  static readonly CREDIT_COSTS = {
    CHANGE_WORKOUT: 25,
    CHANGE_DIET: 25,
    CHANGE_GOAL: 25,
    GENERATE_NEW_PLAN: 50,
    EXTRA_CONSULTATION: 75
  };

  static deductCredits(userId: string, action: keyof typeof CreditSystem.CREDIT_COSTS): boolean {
    const cost = this.CREDIT_COSTS[action];
    const currentCredits = this.getUserCredits(userId);
    
    if (currentCredits >= cost) {
      this.setUserCredits(userId, currentCredits - cost);
      return true;
    }
    
    return false;
  }

  static getUserCredits(userId: string): number {
    return parseInt(localStorage.getItem(`credits_${userId}`) || '0');
  }

  static setUserCredits(userId: string, credits: number): void {
    localStorage.setItem(`credits_${userId}`, credits.toString());
  }

  static addCredits(userId: string, amount: number): void {
    const current = this.getUserCredits(userId);
    this.setUserCredits(userId, current + amount);
  }
}

// Webhook handlers para Kiwify
export class KiwifyWebhooks {
  static handlePaymentSuccess(data: any) {
    const { product_id, customer_email, transaction_id } = data;
    
    // Identificar o plano baseado no product_id
    const planMapping = {
      '1TDRVxj': 'weekly',
      'uQbG74T': 'monthly', 
      'fZoZcUt': 'quarterly',
      'GZGgEB2': 'biannual',
      'fnIR5MA': 'annual',
      'k88c9zn': 'credits'
    };

    const planType = planMapping[product_id];
    
    if (planType === 'credits') {
      // Adicionar 100 créditos
      CreditSystem.addCredits(customer_email, 100);
    } else {
      // Ativar plano
      this.activatePlan(customer_email, planType);
    }

    // Enviar notificação de sucesso
    this.sendSuccessNotification(customer_email, planType);
  }

  static handlePaymentFailure(data: any) {
    const { customer_email, error_message } = data;
    
    // Enviar notificação de falha
    this.sendFailureNotification(customer_email, error_message);
  }

  private static activatePlan(userEmail: string, planType: string) {
    const planData = {
      type: planType,
      startDate: new Date().toISOString(),
      active: true,
      nextUpdate: this.calculateNextUpdate(planType)
    };

    localStorage.setItem(`plan_${userEmail}`, JSON.stringify(planData));
    PlanAutomation.scheduleMonthlyUpdates(userEmail, planType);
  }

  private static calculateNextUpdate(planType: string): string {
    const now = new Date();
    const interval = PlanAutomation.getUpdateInterval(planType);
    now.setDate(now.getDate() + interval);
    return now.toISOString();
  }

  private static sendSuccessNotification(email: string, planType: string) {
    // Em um sistema real, enviaria email/push notification
    console.log(`Enviando notificação de sucesso para ${email} - Plano: ${planType}`);
  }

  private static sendFailureNotification(email: string, error: string) {
    // Em um sistema real, enviaria email/push notification
    console.log(`Enviando notificação de falha para ${email} - Erro: ${error}`);
  }
}