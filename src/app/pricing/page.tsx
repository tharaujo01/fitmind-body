'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, Zap, Trophy, Crown, Gift, ArrowRight, Clock, Target, Users, Shield } from 'lucide-react';

const plans = [
  {
    id: 'weekly',
    name: 'Plano Semanal',
    subtitle: 'Teste por 1 semana',
    price: 'R$ 9,90',
    period: 'por semana',
    originalPrice: null,
    discount: null,
    color: 'from-green-400 to-emerald-500',
    icon: <Gift className="w-6 h-6" />,
    badge: 'TESTE',
    badgeColor: 'bg-green-500',
    link: 'https://pay.kiwify.com.br/1TDRVxj',
    features: [
      'Plano de treino personalizado',
      'Dieta personalizada',
      'Acesso ao app por 7 dias',
      'Suporte básico'
    ],
    popular: false
  },
  {
    id: 'monthly',
    name: 'Plano Mensal',
    subtitle: 'Ideal para começar',
    price: 'R$ 39,90',
    period: 'por mês',
    originalPrice: null,
    discount: null,
    color: 'from-blue-400 to-cyan-500',
    icon: <Zap className="w-6 h-6" />,
    badge: 'POPULAR',
    badgeColor: 'bg-blue-500',
    link: 'https://pay.kiwify.com.br/uQbG74T',
    features: [
      'Tudo do plano semanal',
      'Novos treinos mensais',
      'Acompanhamento de progresso',
      'Suporte prioritário',
      'Acesso a desafios'
    ],
    popular: true
  },
  {
    id: 'quarterly',
    name: 'Plano Trimestral',
    subtitle: 'Melhor custo-benefício',
    price: 'R$ 89,90',
    period: 'por 3 meses',
    originalPrice: 'R$ 119,70',
    discount: '25% OFF',
    color: 'from-purple-400 to-pink-500',
    icon: <Trophy className="w-6 h-6" />,
    badge: 'ECONOMIA',
    badgeColor: 'bg-purple-500',
    link: 'https://pay.kiwify.com.br/fZoZcUt',
    features: [
      'Tudo do plano mensal',
      'Variação automática de treinos',
      'Planos nutricionais avançados',
      'Análise corporal mensal',
      'Grupo VIP no WhatsApp'
    ],
    popular: false
  },
  {
    id: 'biannual',
    name: 'Plano Semestral',
    subtitle: 'Transformação completa',
    price: 'R$ 149,90',
    period: 'por 6 meses',
    originalPrice: 'R$ 239,40',
    discount: '37% OFF',
    color: 'from-orange-400 to-red-500',
    icon: <Target className="w-6 h-6" />,
    badge: 'TRANSFORMAÇÃO',
    badgeColor: 'bg-orange-500',
    link: 'https://pay.kiwify.com.br/GZGgEB2',
    features: [
      'Tudo do plano trimestral',
      'Consultoria nutricional',
      'Planos de treino evolutivos',
      'Acompanhamento semanal',
      'Acesso a masterclasses',
      'Suporte 24/7'
    ],
    popular: false
  },
  {
    id: 'annual',
    name: 'Plano Anual',
    subtitle: 'Máximo resultado',
    price: 'R$ 239,90',
    period: 'por 12 meses',
    originalPrice: 'R$ 478,80',
    discount: '50% OFF',
    color: 'from-yellow-400 to-orange-500',
    icon: <Crown className="w-6 h-6" />,
    badge: 'PREMIUM',
    badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    link: 'https://pay.kiwify.com.br/fnIR5MA',
    features: [
      'Tudo dos planos anteriores',
      'Coach pessoal dedicado',
      'Planos 100% personalizados',
      'Reavaliação trimestral',
      'Acesso vitalício ao conteúdo',
      'Certificado de conclusão',
      'Garantia de resultados'
    ],
    popular: false
  }
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Carregar dados do quiz
    const savedQuizData = localStorage.getItem('userQuizData');
    if (savedQuizData) {
      setQuizData(JSON.parse(savedQuizData));
    }
  }, []);

  const handlePlanSelection = async (plan) => {
    setIsLoading(true);
    
    try {
      // Salvar plano selecionado
      const planData = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        period: plan.period,
        selectedAt: new Date().toISOString(),
        quizData: quizData
      };
      
      localStorage.setItem('selectedPlan', JSON.stringify(planData));
      
      // Redirecionar para o link da Kiwify
      window.open(plan.link, '_blank');
      
      // Aguardar um pouco e redirecionar para dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao processar plano:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalizedRecommendation = () => {
    if (!quizData) return 'monthly';
    
    // Lógica para recomendar plano baseado no quiz
    const goal = quizData.goal?.toLowerCase() || '';
    const commitment = quizData.commitment?.toLowerCase() || '';
    
    if (goal.includes('perder peso') && commitment.includes('hoje')) {
      return 'quarterly';
    }
    if (goal.includes('ganhar massa') || goal.includes('musculoso')) {
      return 'biannual';
    }
    if (commitment.includes('não estou pronto')) {
      return 'weekly';
    }
    
    return 'monthly';
  };

  const recommendedPlan = getPersonalizedRecommendation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">Seu plano personalizado está pronto!</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Escolha Seu
            <span className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] bg-clip-text text-transparent"> Plano</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Baseado no seu quiz, recomendamos o <strong>Plano {plans.find(p => p.id === recommendedPlan)?.name}</strong> para seus objetivos
          </p>
          
          {quizData && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-white font-semibold mb-4">Resumo do seu perfil:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90">
                <div className="text-center">
                  <div className="font-semibold text-[#FF4D22]">Objetivo</div>
                  <div>{quizData.goal || 'Não informado'}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-[#FF4D22]">Nível</div>
                  <div>{quizData.fitnessLevel?.category || 'Não informado'}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-[#FF4D22]">Local</div>
                  <div>{quizData.workoutLocation || 'Não informado'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {plans.map((plan) => {
            const isRecommended = plan.id === recommendedPlan;
            const isPopular = plan.popular;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
                  isRecommended ? 'ring-4 ring-[#FF4D22] ring-opacity-50' : ''
                } ${isPopular ? 'transform scale-105' : ''}`}
              >
                {/* Badge */}
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} text-white px-4 py-1 rounded-full text-xs font-bold`}>
                  {isRecommended ? 'RECOMENDADO' : plan.badge}
                </div>
                
                {/* Discount */}
                {plan.discount && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.discount}
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.subtitle}</p>
                  
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-gray-400 line-through text-sm">{plan.originalPrice}</div>
                    )}
                    <div className="text-3xl font-bold text-gray-800">{plan.price}</div>
                    <div className="text-gray-600 text-sm">{plan.period}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection(plan)}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                    isRecommended || isPopular
                      ? 'bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] hover:from-[#FF6B47] hover:to-[#FF4D22]'
                      : `bg-gradient-to-r ${plan.color}`
                  }`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Escolher Plano</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Credits Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-16">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Sistema de Créditos</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Personalize ainda mais seu plano com créditos para alterações extras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Como funciona?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <div className="text-white font-semibold">Compre Créditos</div>
                    <div className="text-white/70 text-sm">100 créditos por R$ 29,90</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <div className="text-white font-semibold">Use para Personalizar</div>
                    <div className="text-white/70 text-sm">Troque treinos, dietas, objetivos</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <div className="text-white font-semibold">Receba Instantaneamente</div>
                    <div className="text-white/70 text-sm">Alterações aplicadas automaticamente</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Tabela de Créditos</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/90">
                  <span>Trocar treino completo</span>
                  <span className="font-semibold">20 créditos</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Alterar dieta</span>
                  <span className="font-semibold">15 créditos</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Mudar objetivo</span>
                  <span className="font-semibold">25 créditos</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Exercício específico</span>
                  <span className="font-semibold">5 créditos</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Refeição específica</span>
                  <span className="font-semibold">3 créditos</span>
                </div>
              </div>
              
              <button
                onClick={() => window.open('https://pay.kiwify.com.br/k88c9zn', '_blank')}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Comprar 100 Créditos - R$ 29,90
              </button>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Garantia de 7 dias</h3>
            <p className="text-white/70 text-sm">Não gostou? Devolvemos seu dinheiro</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">+10.000 usuários</h3>
            <p className="text-white/70 text-sm">Transformações reais comprovadas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Suporte 24/7</h3>
            <p className="text-white/70 text-sm">Estamos aqui para te ajudar sempre</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Como funciona a renovação automática?</h4>
                <p className="text-white/70 text-sm">Para planos de longa duração, novos treinos são gerados automaticamente a cada mês, mantendo seu objetivo inicial mas variando exercícios.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
                <p className="text-white/70 text-sm">Sim! Você pode cancelar sua assinatura a qualquer momento através do seu painel de controle.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Como usar os créditos?</h4>
                <p className="text-white/70 text-sm">Os créditos são debitados automaticamente quando você solicita alterações no app. Você sempre verá o custo antes de confirmar.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Há garantia de resultados?</h4>
                <p className="text-white/70 text-sm">Oferecemos garantia de 7 dias para todos os planos. Para o plano anual, temos garantia de resultados em 90 dias.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}