import { NextRequest, NextResponse } from 'next/server';

// API para gerenciar créditos do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const credits = await getUserCredits(userId);
    const transactions = await getCreditTransactions(userId);

    return NextResponse.json({
      userId,
      credits,
      transactions
    });

  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

// Adicionar créditos
export async function POST(request: NextRequest) {
  try {
    const { userId, amount, reason, transactionId } = await request.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: 'User ID and amount required' }, { status: 400 });
    }

    const currentCredits = await getUserCredits(userId);
    const newCredits = currentCredits + amount;

    await updateUserCredits(userId, newCredits);
    await logCreditTransaction(userId, amount, reason || 'Credits added', transactionId);

    return NextResponse.json({
      userId,
      previousCredits: currentCredits,
      newCredits,
      amountAdded: amount,
      reason
    });

  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
  }
}

// Debitar créditos
export async function PUT(request: NextRequest) {
  try {
    const { userId, amount, action, description } = await request.json();

    if (!userId || !amount || !action) {
      return NextResponse.json({ error: 'User ID, amount and action required' }, { status: 400 });
    }

    const currentCredits = await getUserCredits(userId);

    if (currentCredits < amount) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        currentCredits,
        requiredCredits: amount
      }, { status: 400 });
    }

    const newCredits = currentCredits - amount;
    await updateUserCredits(userId, newCredits);
    await logCreditTransaction(userId, -amount, `${action}: ${description}`, null);

    return NextResponse.json({
      userId,
      previousCredits: currentCredits,
      newCredits,
      amountDebited: amount,
      action,
      description
    });

  } catch (error) {
    console.error('Error debiting credits:', error);
    return NextResponse.json({ error: 'Failed to debit credits' }, { status: 500 });
  }
}

// Funções auxiliares
async function getUserCredits(userId: string): Promise<number> {
  // Em produção, buscar do banco de dados
  // Por enquanto, usar localStorage simulado
  
  // Simular busca no banco
  // const user = await db.users.findOne({ id: userId });
  // return user?.credits || 0;
  
  // Simulação
  const mockCredits = {
    'user1': 150,
    'user2': 75,
    'user3': 200
  };
  
  return mockCredits[userId as keyof typeof mockCredits] || 0;
}

async function updateUserCredits(userId: string, credits: number): Promise<void> {
  // Em produção, atualizar no banco de dados
  console.log(`Updating credits for user ${userId}: ${credits}`);
  
  // await db.users.update({ id: userId }, { credits });
}

async function getCreditTransactions(userId: string) {
  // Em produção, buscar do banco de dados
  // Simular histórico de transações
  return [
    {
      id: '1',
      userId,
      amount: 100,
      type: 'credit',
      reason: 'Purchase - 100 credits package',
      transactionId: 'kiwify_123456',
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: '2',
      userId,
      amount: -25,
      type: 'debit',
      reason: 'change_workout: Alteração de treino solicitada',
      transactionId: null,
      createdAt: '2024-01-16T14:30:00.000Z'
    },
    {
      id: '3',
      userId,
      amount: -50,
      type: 'debit',
      reason: 'generate_new_plan: Geração de novo plano',
      transactionId: null,
      createdAt: '2024-01-18T09:15:00.000Z'
    }
  ];
}

async function logCreditTransaction(
  userId: string, 
  amount: number, 
  reason: string, 
  transactionId: string | null
): Promise<void> {
  // Em produção, salvar no banco de dados
  console.log(`Logging credit transaction for user ${userId}:`, {
    amount,
    reason,
    transactionId,
    timestamp: new Date().toISOString()
  });
  
  // await db.creditTransactions.create({
  //   userId,
  //   amount,
  //   type: amount > 0 ? 'credit' : 'debit',
  //   reason,
  //   transactionId,
  //   createdAt: new Date()
  // });
}

// Constantes de custos
export const CREDIT_COSTS = {
  CHANGE_WORKOUT: 25,
  CHANGE_DIET: 25,
  CHANGE_GOAL: 25,
  GENERATE_NEW_PLAN: 50,
  EXTRA_CONSULTATION: 75,
  CUSTOM_MEAL_PLAN: 40,
  PERSONAL_TRAINER_SESSION: 100
};

// Função para verificar se o usuário tem créditos suficientes
export async function checkCredits(userId: string, action: keyof typeof CREDIT_COSTS): Promise<boolean> {
  const currentCredits = await getUserCredits(userId);
  const requiredCredits = CREDIT_COSTS[action];
  
  return currentCredits >= requiredCredits;
}

// Função para debitar créditos por ação específica
export async function debitCreditsForAction(
  userId: string, 
  action: keyof typeof CREDIT_COSTS,
  description?: string
): Promise<{ success: boolean; newCredits?: number; error?: string }> {
  try {
    const requiredCredits = CREDIT_COSTS[action];
    const currentCredits = await getUserCredits(userId);

    if (currentCredits < requiredCredits) {
      return {
        success: false,
        error: `Créditos insuficientes. Necessário: ${requiredCredits}, Disponível: ${currentCredits}`
      };
    }

    const newCredits = currentCredits - requiredCredits;
    await updateUserCredits(userId, newCredits);
    await logCreditTransaction(
      userId, 
      -requiredCredits, 
      `${action}: ${description || 'Ação executada'}`, 
      null
    );

    return {
      success: true,
      newCredits
    };

  } catch (error) {
    console.error('Error debiting credits for action:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
}