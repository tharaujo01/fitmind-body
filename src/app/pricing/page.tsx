'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Trophy, Zap, Crown, Gift, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: 'weekly',
    name: 'Plano Semanal',
    price: 'R$ 9,90',
    period: 'por semana',
    description: 'Teste por 1 semana',
    color: 'from-green-400 to-emerald-500',
    popular: false,
    kiwifyUrl: 'https://pay.kiwify.com.br/1TDRVxj',
    features: [
      'Plano de treino personalizado',
      'Dieta personalizada',
      'Acesso ao app por 7 dias',
      'Suporte básico'
    ]
  },
  {
    id: 'monthly',
    name: 'Plano Mensal',
    price: 'R$ 39,90',
    period: 'por mês',
    description: 'Ideal para começar',
    color: 'from-blue-400 to-cyan-500',
    popular: true,
    kiwifyUrl: 'https://pay.kiwify.com.br/uQbG74T',
    features: [
      'Plano de treino personalizado',
      'Dieta personalizada',
      'Atualizações mensais',
      'Suporte prioritário',
      'Relatórios de progresso'
    ]
  },
  {
    id: 'quarterly',
    name: 'Plano Trimestral',
    price: 'R$ 89,90',
    period: '3 meses',
    description: 'Melhor custo-benefício',
    color: 'from-purple-400 to-pink-500',
    popular: false,
    kiwifyUrl: 'https://pay.kiwify.com.br/fZoZcUt',
    features: [
      'Tudo do plano mensal',
      'Novos treinos a cada mês',
      'Variação automática de exercícios',
      'Progressão de carga inteligente',
      'Suporte premium'
    ]
  },
  {
    id: 'biannual',
    name: 'Plano Semestral',
    price: 'R$ 149,90',
    period: '6 meses',
    description: 'Transformação completa',
    color: 'from-orange-400 to-red-500',
    popular: false,
    kiwifyUrl: 'https://pay.kiwify.com.br/GZGgEB2',
    features: [
      'Tudo do plano trimestral',
      'Renovação automática mensal',
      'Planos evolucionários',
      'Análise corporal detalhada',
      'Coach virtual personalizado'
    ]
  },
  {
    id: 'annual',
    name: 'Plano Anual',
    price: 'R$ 239,90',
    period: '12 meses',
    description: 'Máximo resultado',
    color: 'from-red-400 to-pink-500',
    popular: false,
    kiwifyUrl: 'https://pay.kiwify.com.br/fnIR5MA',
    features: [
      'Tudo do plano semestral',
      'Acompanhamento anual completo',
      'Planos adaptativos mensais',
      'Suporte VIP 24/7',
      'Garantia de resultados'
    ]
  }
];

export default function PricingPage() {
  const [quizData, setQuizData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Carregar dados do quiz
    const savedQuizData = localStorage.getItem('userQuizData');
    if (savedQuizData) {
      setQuizData(JSON.parse(savedQuizData));
    }
  }, []);

  const handlePlanClick = (plan: any) => {
    // Salvar plano selecionado
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    
    // Abrir link externo da Kiwify em nova aba
    window.open(plan.kiwifyUrl, '_blank', 'noopener,noreferrer');
    
    // Redirecionar para dashboard após um delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleCreditsClick = () => {
    // Abrir link de compra de créditos
    window.open('https://pay.kiwify.com.br/k88c9zn', '_blank', 'noopener,noreferrer');
    
    // Adicionar créditos ao usuário (simulação)
    setTimeout(() => {
      localStorage.setItem('userCredits', '100');
      router.push('/dashboard');
    }, 2000);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToHome}
          className="mb-8 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao início</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Escolha Seu Plano de
            <span className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] bg-clip-text text-transparent"> Transformação</span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Seu plano personalizado está pronto! Escolha a duração ideal para seus objetivos.
          </p>
          
          {/* Resumo do Quiz */}
          {quizData && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Seu Perfil Personalizado:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-[#FF4D22] font-bold">Objetivo</div>
                  <div className="text-white/80">{quizData.goal || 'Definido'}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#FF4D22] font-bold">Nível</div>
                  <div className="text-white/80">{quizData.fitnessLevel?.category || 'Avaliado'}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#FF4D22] font-bold">Local</div>
                  <div className="text-white/80">{quizData.workoutLocation || 'Definido'}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#FF4D22] font-bold">Duração</div>
                  <div className="text-white/80">{quizData.workoutDuration || '45 min'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-4 ring-[#FF4D22] ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>MAIS POPULAR</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {plan.id === 'weekly' && <Gift className="w-8 h-8 text-white" />}
                  {plan.id === 'monthly' && <Zap className="w-8 h-8 text-white" />}
                  {plan.id === 'quarterly' && <Trophy className="w-8 h-8 text-white" />}
                  {plan.id === 'biannual' && <Star className="w-8 h-8 text-white" />}
                  {plan.id === 'annual' && <Crown className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-800">{plan.price}</div>
                  <div className="text-gray-600 text-sm">{plan.period}</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanClick(plan)}
                className={`block w-full p-4 bg-gradient-to-r ${plan.color} text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center cursor-pointer`}
              >
                Obter meu plano
              </button>
            </div>
          ))}
        </div>

        {/* Credits Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Sistema de <span className="text-[#FF4D22]">Créditos</span>
            </h2>
            <p className="text-white/80 text-lg">
              Personalize ainda mais seu plano com alterações extras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Como Funciona:</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <div className="text-white font-semibold">Compre Créditos</div>
                    <div className="text-white/70 text-sm">100 créditos por R$ 29,90</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <div className="text-white font-semibold">Use para Alterações</div>
                    <div className="text-white/70 text-sm">Troque treinos, dietas ou objetivos</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <div className="text-white font-semibold">Débito Automático</div>
                    <div className="text-white/70 text-sm">Créditos são descontados automaticamente</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">100</div>
              <div className="text-white/80 mb-4">Créditos</div>
              <div className="text-2xl font-bold text-[#FF4D22] mb-4">R$ 29,90</div>
              <button
                onClick={handleCreditsClick}
                className="block w-full p-3 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
              >
                Comprar Créditos
              </button>
            </div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Garantia de Satisfação</h3>
          <p className="text-white/80 mb-6">
            Não ficou satisfeito? Oferecemos garantia de 7 dias para todos os planos.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-white/70">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancelamento fácil</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Reembolso integral</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Sem taxas ocultas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}