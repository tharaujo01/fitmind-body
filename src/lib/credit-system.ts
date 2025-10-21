// Sistema de créditos e planos (localStorage para demonstração)
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  objectives?: string;
  planId: string;
  creditsBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyCredits: number;
  price: number;
  features: string[];
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'purchased';
  amount: number;
  description: string;
  actionType?: string;
  createdAt: string;
}

export interface SavedWorkout {
  id: string;
  userId: string;
  name: string;
  exercises: any[];
  duration: number;
  level: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedDiet {
  id: string;
  userId: string;
  name: string;
  meals: any[];
  calories: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionLog {
  id: string;
  userId: string;
  action: string;
  creditsConsumed: number;
  details: any;
  createdAt: string;
}

// Planos disponíveis
export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyCredits: 10,
    price: 19.90,
    features: [
      '10 créditos mensais',
      'Biblioteca de exercícios',
      'Treinos básicos',
      'Suporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyCredits: 25,
    price: 39.90,
    features: [
      '25 créditos mensais',
      'Biblioteca completa',
      'Treinos personalizados',
      'Dietas básicas',
      'Análise de progresso',
      'Suporte prioritário'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyCredits: 50,
    price: 59.90,
    features: [
      '50 créditos mensais',
      'Acesso total',
      'Treinos avançados',
      'Dietas personalizadas',
      'Coach virtual',
      'Suporte 24/7',
      'Relatórios detalhados'
    ]
  }
];

// Pacotes de recarga
export const CREDIT_PACKAGES = [
  { credits: 10, price: 9.90 },
  { credits: 25, price: 19.90 },
  { credits: 50, price: 29.90 }
];

// Custos de ações
export const ACTION_COSTS = {
  CREATE_WORKOUT: 1,
  EDIT_WORKOUT: 1,
  CREATE_DIET: 2,
  EDIT_DIET: 1,
  GENERATE_WORKOUT: 1,
  GENERATE_DIET: 2,
  SAVE_WORKOUT: 1,
  SAVE_DIET: 1
};

class CreditSystem {
  private static instance: CreditSystem;
  
  static getInstance(): CreditSystem {
    if (!CreditSystem.instance) {
      CreditSystem.instance = new CreditSystem();
    }
    return CreditSystem.instance;
  }

  // Usuário padrão para demonstração
  getCurrentUser(): User {
    const stored = localStorage.getItem('fitMindUser');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultUser: User = {
      id: 'demo-user',
      name: 'Usuário Demo',
      email: 'demo@fitmind.com',
      planId: 'pro',
      creditsBalance: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.saveUser(defaultUser);
    return defaultUser;
  }

  saveUser(user: User): void {
    localStorage.setItem('fitMindUser', JSON.stringify(user));
  }

  getCurrentPlan(): Plan {
    const user = this.getCurrentUser();
    return PLANS.find(p => p.id === user.planId) || PLANS[1];
  }

  async consumeCredits(action: keyof typeof ACTION_COSTS, details?: any): Promise<boolean> {
    const user = this.getCurrentUser();
    const cost = ACTION_COSTS[action];
    
    if (user.creditsBalance < cost) {
      return false;
    }

    // Deduzir créditos
    user.creditsBalance -= cost;
    user.updatedAt = new Date().toISOString();
    this.saveUser(user);

    // Registrar transação
    this.addTransaction({
      id: Date.now().toString(),
      userId: user.id,
      type: 'spent',
      amount: -cost,
      description: this.getActionDescription(action),
      actionType: action,
      createdAt: new Date().toISOString()
    });

    // Registrar log
    this.addActionLog({
      id: Date.now().toString(),
      userId: user.id,
      action,
      creditsConsumed: cost,
      details,
      createdAt: new Date().toISOString()
    });

    return true;
  }

  addCredits(amount: number, type: 'earned' | 'purchased', description: string): void {
    const user = this.getCurrentUser();
    user.creditsBalance += amount;
    user.updatedAt = new Date().toISOString();
    this.saveUser(user);

    this.addTransaction({
      id: Date.now().toString(),
      userId: user.id,
      type,
      amount,
      description,
      createdAt: new Date().toISOString()
    });
  }

  private addTransaction(transaction: CreditTransaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    localStorage.setItem('creditTransactions', JSON.stringify(transactions.slice(0, 100)));
  }

  getTransactions(): CreditTransaction[] {
    const stored = localStorage.getItem('creditTransactions');
    return stored ? JSON.parse(stored) : [];
  }

  private addActionLog(log: ActionLog): void {
    const logs = this.getActionLogs();
    logs.unshift(log);
    localStorage.setItem('actionLogs', JSON.stringify(logs.slice(0, 100)));
  }

  getActionLogs(): ActionLog[] {
    const stored = localStorage.getItem('actionLogs');
    return stored ? JSON.parse(stored) : [];
  }

  private getActionDescription(action: keyof typeof ACTION_COSTS): string {
    const descriptions = {
      CREATE_WORKOUT: 'Criação de treino personalizado',
      EDIT_WORKOUT: 'Edição de treino existente',
      CREATE_DIET: 'Criação de dieta personalizada',
      EDIT_DIET: 'Edição de dieta existente',
      GENERATE_WORKOUT: 'Geração automática de treino',
      GENERATE_DIET: 'Geração automática de dieta',
      SAVE_WORKOUT: 'Salvamento de treino',
      SAVE_DIET: 'Salvamento de dieta'
    };
    return descriptions[action];
  }

  // Salvar treino
  saveWorkout(workout: Omit<SavedWorkout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): SavedWorkout {
    const user = this.getCurrentUser();
    const savedWorkout: SavedWorkout = {
      ...workout,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const workouts = this.getSavedWorkouts();
    workouts.unshift(savedWorkout);
    localStorage.setItem('savedWorkouts', JSON.stringify(workouts));

    return savedWorkout;
  }

  getSavedWorkouts(): SavedWorkout[] {
    const stored = localStorage.getItem('savedWorkouts');
    return stored ? JSON.parse(stored) : [];
  }

  // Salvar dieta
  saveDiet(diet: Omit<SavedDiet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): SavedDiet {
    const user = this.getCurrentUser();
    const savedDiet: SavedDiet = {
      ...diet,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const diets = this.getSavedDiets();
    diets.unshift(savedDiet);
    localStorage.setItem('savedDiets', JSON.stringify(diets));

    return savedDiet;
  }

  getSavedDiets(): SavedDiet[] {
    const stored = localStorage.getItem('savedDiets');
    return stored ? JSON.parse(stored) : [];
  }

  // Renovar créditos mensais (simulação)
  renewMonthlyCredits(): void {
    const user = this.getCurrentUser();
    const plan = this.getCurrentPlan();
    
    user.creditsBalance = plan.monthlyCredits;
    user.updatedAt = new Date().toISOString();
    this.saveUser(user);

    this.addTransaction({
      id: Date.now().toString(),
      userId: user.id,
      type: 'earned',
      amount: plan.monthlyCredits,
      description: `Renovação mensal - Plano ${plan.name}`,
      createdAt: new Date().toISOString()
    });
  }
}

export const creditSystem = CreditSystem.getInstance();