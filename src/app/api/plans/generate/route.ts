import { NextRequest, NextResponse } from 'next/server';
import { PlanGenerator, PlanAutomation } from '@/lib/planSystem';

// API para gerar novos planos automaticamente
export async function POST(request: NextRequest) {
  try {
    const { userId, forceGenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Buscar dados do usuário (em produção, do banco de dados)
    const userData = await getUserData(userId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verificar se precisa gerar novo plano
    const shouldGenerate = forceGenerate || PlanAutomation.shouldGenerateNewPlan(
      userData.lastPlanUpdate, 
      userData.planType
    );

    if (!shouldGenerate) {
      return NextResponse.json({ 
        message: 'Plan is up to date',
        nextUpdate: userData.nextUpdate 
      });
    }

    // Gerar novo plano de treino
    const newWorkoutPlan = userData.currentWorkoutPlan 
      ? PlanGenerator.generateMonthlyUpdate(userData.currentWorkoutPlan, userData.profile)
      : PlanGenerator.generateWorkoutPlan(userData.profile);

    // Gerar nova dieta (se necessário)
    const newDietPlan = PlanGenerator.generateDietPlan(userData.profile);

    // Salvar novos planos
    await saveUserPlans(userId, {
      workoutPlan: newWorkoutPlan,
      dietPlan: newDietPlan,
      generatedAt: new Date().toISOString(),
      nextUpdate: calculateNextUpdate(userData.planType)
    });

    // Enviar notificação
    await notifyPlanUpdate(userId, userData.email);

    return NextResponse.json({
      message: 'New plan generated successfully',
      workoutPlan: newWorkoutPlan,
      dietPlan: newDietPlan,
      nextUpdate: calculateNextUpdate(userData.planType)
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}

// API para buscar plano atual do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const userData = await getUserData(userId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      workoutPlan: userData.currentWorkoutPlan,
      dietPlan: userData.currentDietPlan,
      lastUpdate: userData.lastPlanUpdate,
      nextUpdate: userData.nextUpdate,
      planType: userData.planType
    });

  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
  }
}

// Funções auxiliares
async function getUserData(userId: string) {
  // Em produção, buscar do banco de dados
  // Por enquanto, simular dados
  return {
    id: userId,
    email: 'user@example.com',
    profile: {
      goal: 'Ganhar Massa Muscular',
      fitnessLevel: { level: 5, category: 'Intermediário' },
      bodyType: 'Médio',
      age: '25-35',
      workoutLocation: 'Academia',
      workoutDuration: '45 minutos',
      diet: 'Nenhuma das anteriores',
      problemAreas: ['Braços magros'],
      exercisePreferences: {
        'Flexão': 'gosto',
        'Agachamento': 'gosto',
        'Corrida': 'nao-gosto'
      },
      sportsInterest: ['Treinos de Academia', 'Funcional']
    },
    planType: 'monthly',
    lastPlanUpdate: '2024-01-01T00:00:00.000Z',
    nextUpdate: '2024-02-01T00:00:00.000Z',
    currentWorkoutPlan: null,
    currentDietPlan: null
  };
}

async function saveUserPlans(userId: string, plans: any) {
  // Em produção, salvar no banco de dados
  console.log(`Saving plans for user ${userId}:`, plans);
  
  // Simular salvamento
  // await db.users.update(
  //   { id: userId },
  //   {
  //     currentWorkoutPlan: plans.workoutPlan,
  //     currentDietPlan: plans.dietPlan,
  //     lastPlanUpdate: plans.generatedAt,
  //     nextUpdate: plans.nextUpdate
  //   }
  // );
}

async function notifyPlanUpdate(userId: string, email: string) {
  // Enviar notificação por email e push
  console.log(`Notifying plan update for ${email}`);
  
  // Em produção, usar serviço de notificação
  // await notificationService.send({
  //   userId,
  //   type: 'plan_update',
  //   title: 'Novo Plano Disponível!',
  //   message: 'Seu plano foi atualizado com novos exercícios e progressões.',
  //   email
  // });
}

function calculateNextUpdate(planType: string): string {
  const now = new Date();
  const intervals = {
    'weekly': 7,
    'monthly': 30,
    'quarterly': 30,
    'biannual': 30,
    'annual': 30
  };
  
  const days = intervals[planType as keyof typeof intervals] || 30;
  now.setDate(now.getDate() + days);
  
  return now.toISOString();
}