import { NextRequest, NextResponse } from 'next/server';

// Mapeamento dos produtos Kiwify
const PRODUCT_MAPPING = {
  '1TDRVxj': { type: 'weekly', name: 'Plano Semanal', credits: 0 },
  'uQbG74T': { type: 'monthly', name: 'Plano Mensal', credits: 0 },
  'fZoZcUt': { type: 'quarterly', name: 'Plano Trimestral', credits: 0 },
  'GZGgEB2': { type: 'biannual', name: 'Plano Semestral', credits: 0 },
  'fnIR5MA': { type: 'annual', name: 'Plano Anual', credits: 0 },
  'k88c9zn': { type: 'credits', name: 'Créditos', credits: 100 }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar assinatura do webhook (em produção, validar com secret)
    const signature = request.headers.get('x-kiwify-signature');
    
    // Processar diferentes tipos de eventos
    switch (body.event_type) {
      case 'payment.approved':
        return handlePaymentApproved(body);
      case 'payment.refused':
        return handlePaymentRefused(body);
      case 'subscription.cancelled':
        return handleSubscriptionCancelled(body);
      default:
        return NextResponse.json({ message: 'Event type not handled' }, { status: 200 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePaymentApproved(data: any) {
  const { 
    product_id, 
    customer_email, 
    customer_name,
    transaction_id,
    amount,
    payment_method 
  } = data;

  const product = PRODUCT_MAPPING[product_id as keyof typeof PRODUCT_MAPPING];
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 400 });
  }

  try {
    // Ativar plano ou adicionar créditos
    if (product.type === 'credits') {
      await addCreditsToUser(customer_email, product.credits);
    } else {
      await activatePlan(customer_email, product);
    }

    // Enviar notificação de sucesso
    await sendSuccessNotification(customer_email, product, transaction_id);

    // Log da transação
    console.log(`Payment approved: ${customer_email} - ${product.name} - ${transaction_id}`);

    return NextResponse.json({ 
      message: 'Payment processed successfully',
      customer_email,
      product_type: product.type
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}

async function handlePaymentRefused(data: any) {
  const { customer_email, product_id, refusal_reason } = data;
  
  const product = PRODUCT_MAPPING[product_id as keyof typeof PRODUCT_MAPPING];
  
  // Enviar notificação de falha
  await sendFailureNotification(customer_email, product?.name || 'Produto', refusal_reason);
  
  console.log(`Payment refused: ${customer_email} - ${refusal_reason}`);
  
  return NextResponse.json({ message: 'Payment refusal processed' });
}

async function handleSubscriptionCancelled(data: any) {
  const { customer_email, product_id } = data;
  
  // Desativar plano
  await deactivatePlan(customer_email);
  
  // Enviar notificação de cancelamento
  await sendCancellationNotification(customer_email);
  
  console.log(`Subscription cancelled: ${customer_email}`);
  
  return NextResponse.json({ message: 'Subscription cancellation processed' });
}

// Funções auxiliares (em produção, usar banco de dados)
async function addCreditsToUser(email: string, credits: number) {
  // Em produção, salvar no banco de dados
  // Por enquanto, usar localStorage no frontend via API
  
  // Simular adição de créditos
  console.log(`Adding ${credits} credits to ${email}`);
  
  // Aqui você integraria com seu banco de dados
  // await db.users.update({ email }, { $inc: { credits } });
}

async function activatePlan(email: string, product: any) {
  const planData = {
    type: product.type,
    name: product.name,
    startDate: new Date().toISOString(),
    active: true,
    nextUpdate: calculateNextUpdate(product.type)
  };

  console.log(`Activating plan for ${email}:`, planData);
  
  // Em produção, salvar no banco de dados
  // await db.users.update({ email }, { plan: planData });
  
  // Agendar atualizações automáticas
  scheduleAutomaticUpdates(email, product.type);
}

async function deactivatePlan(email: string) {
  console.log(`Deactivating plan for ${email}`);
  
  // Em produção, atualizar no banco de dados
  // await db.users.update({ email }, { 'plan.active': false });
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

function scheduleAutomaticUpdates(email: string, planType: string) {
  // Em produção, usar um sistema de filas como Bull/Agenda
  console.log(`Scheduling automatic updates for ${email} - ${planType}`);
  
  // Exemplo de agendamento (implementar com sistema de filas real)
  // agenda.schedule('in 30 days', 'generate-new-plan', { email, planType });
}

// Funções de notificação
async function sendSuccessNotification(email: string, product: any, transactionId: string) {
  // Em produção, integrar com serviço de email (SendGrid, AWS SES, etc.)
  console.log(`Sending success notification to ${email}`);
  
  const emailData = {
    to: email,
    subject: `✅ Pagamento Aprovado - ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF4D22, #FF6B47); padding: 30px; text-align: center; color: white;">
          <h1>🎉 Pagamento Aprovado!</h1>
          <p style="font-size: 18px;">Bem-vindo ao FitMind Body!</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Detalhes da Compra:</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Plano:</strong> ${product.name}</li>
            <li><strong>ID da Transação:</strong> ${transactionId}</li>
            <li><strong>Status:</strong> Ativo</li>
          </ul>
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 10px;">
            <h3>Próximos Passos:</h3>
            <ol>
              <li>Acesse seu dashboard personalizado</li>
              <li>Comece seu primeiro treino hoje</li>
              <li>Acompanhe seu progresso diariamente</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #FF4D22; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Acessar Dashboard
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>Precisa de ajuda? Entre em contato conosco!</p>
          <p>FitMind Body - Transforme seu corpo, eleve sua mente.</p>
        </div>
      </div>
    `
  };
  
  // await emailService.send(emailData);
}

async function sendFailureNotification(email: string, productName: string, reason: string) {
  console.log(`Sending failure notification to ${email}: ${reason}`);
  
  const emailData = {
    to: email,
    subject: `❌ Problema no Pagamento - ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc3545; padding: 30px; text-align: center; color: white;">
          <h1>⚠️ Problema no Pagamento</h1>
          <p>Não foi possível processar seu pagamento</p>
        </div>
        
        <div style="padding: 30px;">
          <h2>O que aconteceu?</h2>
          <p><strong>Motivo:</strong> ${reason}</p>
          
          <h3>Como resolver:</h3>
          <ul>
            <li>Verifique os dados do seu cartão</li>
            <li>Confirme se há limite disponível</li>
            <li>Tente novamente em alguns minutos</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
               style="background: #FF4D22; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Tentar Novamente
            </a>
          </div>
        </div>
      </div>
    `
  };
  
  // await emailService.send(emailData);
}

async function sendCancellationNotification(email: string) {
  console.log(`Sending cancellation notification to ${email}`);
  
  // Implementar notificação de cancelamento
}

// Endpoint para verificar status do webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/api/webhooks/kiwify',
      health: '/api/webhooks/kiwify'
    }
  });
}