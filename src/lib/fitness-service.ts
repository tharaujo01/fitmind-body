import { UserProfile, PlanData, CreditTransaction, WorkoutPlan, DietPlan, CustomizationRequest } from './types';

// Simulação de banco de dados local
class FitnessAppService {
  private storageKey = 'fitnessApp_';

  // User Management
  createUser(userData: Partial<UserProfile>): UserProfile {
    const user: UserProfile = {
      id: this.generateId(),
      name: userData.name || '',
      email: userData.email || '',
      birthDate: userData.birthDate || '',
      quizData: userData.quizData || {},
      selectedPlan: null,
      credits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`${this.storageKey}user`, JSON.stringify(user));
    return user;
  }

  getUser(): UserProfile | null {
    const userData = localStorage.getItem(`${this.storageKey}user`);
    return userData ? JSON.parse(userData) : null;
  }

  updateUser(updates: Partial<UserProfile>): UserProfile | null {
    const user = this.getUser();
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`${this.storageKey}user`, JSON.stringify(updatedUser));
    return updatedUser;
  }

  // Plan Management
  subscribeToPlan(planData: Omit<PlanData, 'expiresAt' | 'isActive' | 'renewalCount'>): boolean {
    const user = this.getUser();
    if (!user) return false;

    const plan: PlanData = {
      ...planData,
      expiresAt: this.calculateExpirationDate(planData.planId),
      isActive: true,
      renewalCount: 0
    };

    this.updateUser({ selectedPlan: plan });
    return true;
  }

  renewPlan(): boolean {
    const user = this.getUser();
    if (!user || !user.selectedPlan) return false;

    const updatedPlan: PlanData = {
      ...user.selectedPlan,
      expiresAt: this.calculateExpirationDate(user.selectedPlan.planId),
      renewalCount: user.selectedPlan.renewalCount + 1
    };

    this.updateUser({ selectedPlan: updatedPlan });
    this.generateNewWorkoutAndDiet();
    return true;
  }

  // Credits Management
  addCredits(amount: number, description: string = 'Compra de créditos'): boolean {
    const user = this.getUser();
    if (!user) return false;

    const transaction: CreditTransaction = {
      id: this.generateId(),
      userId: user.id,
      type: 'purchase',
      amount,
      description,
      createdAt: new Date().toISOString()
    };

    this.saveTransaction(transaction);
    this.updateUser({ credits: user.credits + amount });
    return true;
  }

  useCredits(amount: number, description: string): boolean {
    const user = this.getUser();
    if (!user || user.credits < amount) return false;

    const transaction: CreditTransaction = {
      id: this.generateId(),
      userId: user.id,
      type: 'usage',
      amount: -amount,
      description,
      createdAt: new Date().toISOString()
    };

    this.saveTransaction(transaction);
    this.updateUser({ credits: user.credits - amount });
    return true;
  }

  getCreditTransactions(): CreditTransaction[] {
    const transactions = localStorage.getItem(`${this.storageKey}transactions`);
    return transactions ? JSON.parse(transactions) : [];
  }

  // Workout Management
  generateWorkoutPlan(quizData: any): WorkoutPlan {
    const exercises = this.generateExercises(quizData);
    
    const workout: WorkoutPlan = {
      id: this.generateId(),
      userId: this.getUser()?.id || '',
      name: `Treino Personalizado - ${new Date().toLocaleDateString()}`,
      exercises,
      duration: 60,
      difficulty: this.getDifficultyFromQuiz(quizData),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    this.saveWorkout(workout);
    return workout;
  }

  getCurrentWorkout(): WorkoutPlan | null {
    const workouts = this.getWorkouts();
    return workouts.find(w => w.isActive) || null;
  }

  // Diet Management
  generateDietPlan(quizData: any): DietPlan {
    const meals = this.generateMeals(quizData);
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    
    const diet: DietPlan = {
      id: this.generateId(),
      userId: this.getUser()?.id || '',
      name: `Dieta Personalizada - ${new Date().toLocaleDateString()}`,
      meals,
      totalCalories,
      macros: this.calculateMacros(meals),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    this.saveDiet(diet);
    return diet;
  }

  getCurrentDiet(): DietPlan | null {
    const diets = this.getDiets();
    return diets.find(d => d.isActive) || null;
  }

  // Customization Requests
  requestCustomization(type: CustomizationRequest['type'], description: string): CustomizationRequest | null {
    const creditCosts = {
      workout: 20,
      diet: 15,
      goal: 25,
      exercise: 5,
      meal: 3
    };

    const cost = creditCosts[type];
    const user = this.getUser();

    if (!user || user.credits < cost) {
      return null;
    }

    const request: CustomizationRequest = {
      id: this.generateId(),
      userId: user.id,
      type,
      description,
      creditCost: cost,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.saveCustomizationRequest(request);
    return request;
  }

  processCustomization(requestId: string): boolean {
    const requests = this.getCustomizationRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request || request.status !== 'pending') return false;

    // Simular processamento
    request.status = 'processing';
    this.updateCustomizationRequest(request);

    // Usar créditos
    if (!this.useCredits(request.creditCost, `Personalização: ${request.description}`)) {
      request.status = 'failed';
      this.updateCustomizationRequest(request);
      return false;
    }

    // Simular conclusão após delay
    setTimeout(() => {
      request.status = 'completed';
      request.completedAt = new Date().toISOString();
      this.updateCustomizationRequest(request);
      
      // Gerar novo conteúdo baseado no tipo
      this.generateCustomizedContent(request);
    }, 2000);

    return true;
  }

  // Private helper methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private calculateExpirationDate(planId: string): string {
    const now = new Date();
    const durations = {
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      biannual: 180,
      annual: 365
    };

    const days = durations[planId as keyof typeof durations] || 30;
    now.setDate(now.getDate() + days);
    return now.toISOString();
  }

  private generateNewWorkoutAndDiet(): void {
    const user = this.getUser();
    if (!user) return;

    // Desativar planos atuais
    const workouts = this.getWorkouts();
    const diets = this.getDiets();
    
    workouts.forEach(w => w.isActive = false);
    diets.forEach(d => d.isActive = false);
    
    localStorage.setItem(`${this.storageKey}workouts`, JSON.stringify(workouts));
    localStorage.setItem(`${this.storageKey}diets`, JSON.stringify(diets));

    // Gerar novos planos
    this.generateWorkoutPlan(user.quizData);
    this.generateDietPlan(user.quizData);
  }

  private generateExercises(quizData: any): any[] {
    // Exercícios baseados nas preferências do quiz
    const baseExercises = [
      { name: 'Flexões', sets: 3, reps: '10-15', rest: '60s', instructions: 'Mantenha o corpo alinhado', muscleGroups: ['Peito', 'Tríceps'] },
      { name: 'Agachamentos', sets: 3, reps: '15-20', rest: '60s', instructions: 'Desça até 90 graus', muscleGroups: ['Pernas', 'Glúteos'] },
      { name: 'Prancha', sets: 3, reps: '30-60s', rest: '45s', instructions: 'Mantenha o core contraído', muscleGroups: ['Core'] },
      { name: 'Burpees', sets: 3, reps: '8-12', rest: '90s', instructions: 'Movimento explosivo', muscleGroups: ['Corpo todo'] }
    ];

    return baseExercises.map(ex => ({ ...ex, id: this.generateId() }));
  }

  private generateMeals(quizData: any): any[] {
    const baseMeals = [
      {
        id: this.generateId(),
        name: 'Café da Manhã',
        time: '07:00',
        foods: [
          { id: this.generateId(), name: 'Aveia', quantity: '50g', calories: 190, protein: 7, carbs: 32, fat: 4 },
          { id: this.generateId(), name: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fat: 0 }
        ],
        calories: 295
      },
      {
        id: this.generateId(),
        name: 'Almoço',
        time: '12:00',
        foods: [
          { id: this.generateId(), name: 'Frango grelhado', quantity: '150g', calories: 231, protein: 43, carbs: 0, fat: 5 },
          { id: this.generateId(), name: 'Arroz integral', quantity: '100g', calories: 111, protein: 3, carbs: 23, fat: 1 }
        ],
        calories: 342
      }
    ];

    return baseMeals;
  }

  private calculateMacros(meals: any[]): { protein: number; carbs: number; fat: number } {
    return meals.reduce((totals, meal) => {
      const mealMacros = meal.foods.reduce((mealTotals: any, food: any) => ({
        protein: mealTotals.protein + food.protein,
        carbs: mealTotals.carbs + food.carbs,
        fat: mealTotals.fat + food.fat
      }), { protein: 0, carbs: 0, fat: 0 });

      return {
        protein: totals.protein + mealMacros.protein,
        carbs: totals.carbs + mealMacros.carbs,
        fat: totals.fat + mealMacros.fat
      };
    }, { protein: 0, carbs: 0, fat: 0 });
  }

  private getDifficultyFromQuiz(quizData: any): string {
    const level = quizData.fitnessLevel?.level || 1;
    if (level <= 3) return 'Iniciante';
    if (level <= 7) return 'Intermediário';
    return 'Avançado';
  }

  private saveTransaction(transaction: CreditTransaction): void {
    const transactions = this.getCreditTransactions();
    transactions.push(transaction);
    localStorage.setItem(`${this.storageKey}transactions`, JSON.stringify(transactions));
  }

  private saveWorkout(workout: WorkoutPlan): void {
    const workouts = this.getWorkouts();
    workouts.forEach(w => w.isActive = false); // Desativar outros
    workouts.push(workout);
    localStorage.setItem(`${this.storageKey}workouts`, JSON.stringify(workouts));
  }

  private saveDiet(diet: DietPlan): void {
    const diets = this.getDiets();
    diets.forEach(d => d.isActive = false); // Desativar outros
    diets.push(diet);
    localStorage.setItem(`${this.storageKey}diets`, JSON.stringify(diets));
  }

  private getWorkouts(): WorkoutPlan[] {
    const workouts = localStorage.getItem(`${this.storageKey}workouts`);
    return workouts ? JSON.parse(workouts) : [];
  }

  private getDiets(): DietPlan[] {
    const diets = localStorage.getItem(`${this.storageKey}diets`);
    return diets ? JSON.parse(diets) : [];
  }

  private saveCustomizationRequest(request: CustomizationRequest): void {
    const requests = this.getCustomizationRequests();
    requests.push(request);
    localStorage.setItem(`${this.storageKey}customizations`, JSON.stringify(requests));
  }

  private getCustomizationRequests(): CustomizationRequest[] {
    const requests = localStorage.getItem(`${this.storageKey}customizations`);
    return requests ? JSON.parse(requests) : [];
  }

  private updateCustomizationRequest(updatedRequest: CustomizationRequest): void {
    const requests = this.getCustomizationRequests();
    const index = requests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      requests[index] = updatedRequest;
      localStorage.setItem(`${this.storageKey}customizations`, JSON.stringify(requests));
    }
  }

  private generateCustomizedContent(request: CustomizationRequest): void {
    const user = this.getUser();
    if (!user) return;

    switch (request.type) {
      case 'workout':
        this.generateWorkoutPlan(user.quizData);
        break;
      case 'diet':
        this.generateDietPlan(user.quizData);
        break;
      // Outros tipos de personalização...
    }
  }
}

export const fitnessService = new FitnessAppService();