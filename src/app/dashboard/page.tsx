'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Target, 
  Calendar, 
  Trophy, 
  Settings, 
  CreditCard, 
  Bell, 
  Activity,
  Dumbbell,
  Apple,
  TrendingUp,
  Clock,
  Star,
  Gift,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import NotificationSystem from '@/components/NotificationSystem';

interface UserData {
  name?: string;
  email?: string;
  goal?: string;
  fitnessLevel?: any;
  workoutLocation?: string;
  workoutDuration?: string;
  selectedPlan?: any;
  credits?: number;
  planStartDate?: string;
  nextUpdate?: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [credits, setCredits] = useState(0);
  const [showCreditAlert, setShowCreditAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Carregar dados do usuário
    const quizData = localStorage.getItem('userQuizData');
    const selectedPlan = localStorage.getItem('selectedPlan');
    const userCredits = localStorage.getItem('userCredits');

    if (quizData) {
      const parsedQuizData = JSON.parse(quizData);
      setUserData(prev => ({ ...prev, ...parsedQuizData }));
    }

    if (selectedPlan) {
      const parsedPlan = JSON.parse(selectedPlan);
      setUserData(prev => ({ 
        ...prev, 
        selectedPlan: parsedPlan,
        planStartDate: new Date().toISOString(),
        nextUpdate: getNextUpdateDate(parsedPlan.id)
      }));
    }

    if (userCredits) {
      setCredits(parseInt(userCredits));
    }
  }, []);

  const getNextUpdateDate = (planId: string) => {
    const now = new Date();
    if (planId === 'weekly') {
      now.setDate(now.getDate() + 7);
    } else {
      now.setMonth(now.getMonth() + 1);
    }
    return now.toISOString();
  };

  const generateNewPlan = () => {
    if (credits < 50) {
      setShowCreditAlert(true);
      return;
    }

    // Simular geração de novo plano
    const newCredits = credits - 50;
    setCredits(newCredits);
    localStorage.setItem('userCredits', newCredits.toString());

    // Atualizar próxima data de atualização
    const nextUpdate = getNextUpdateDate(userData.selectedPlan?.id || 'monthly');
    setUserData(prev => ({ ...prev, nextUpdate }));

    alert('Novo plano gerado com sucesso! 50 créditos foram descontados.');
  };

  const buyCredits = () => {
    window.open('https://pay.kiwify.com.br/k88c9zn', '_blank');
  };

  const requestChange = (changeType: string) => {
    const creditCost = 25;
    if (credits < creditCost) {
      setShowCreditAlert(true);
      return;
    }

    const newCredits = credits - creditCost;
    setCredits(newCredits);
    localStorage.setItem('userCredits', newCredits.toString());

    alert(`Alteração de ${changeType} solicitada! ${creditCost} créditos foram descontados.`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Bem-vindo, {userData.name || 'Atleta'}! 🔥
        </h2>
        <p className="text-white/90">
          Seu plano personalizado está ativo e pronto para transformar seu corpo!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-[#FF4D22]" />
            <span className="text-2xl font-bold text-gray-800">
              {userData.goal?.includes('Massa') ? '💪' : userData.goal?.includes('peso') ? '🔥' : '⚡'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">Objetivo</h3>
          <p className="text-gray-600 text-sm">{userData.goal || 'Definido'}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">
              {userData.fitnessLevel?.level || 5}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">Nível Fitness</h3>
          <p className="text-gray-600 text-sm">{userData.fitnessLevel?.category || 'Avaliado'}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">
              {userData.workoutDuration?.replace(' minutos', 'min') || '45min'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">Duração</h3>
          <p className="text-gray-600 text-sm">Por treino</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Gift className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">{credits}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Créditos</h3>
          <p className="text-gray-600 text-sm">Disponíveis</p>
        </div>
      </div>

      {/* Current Plan */}
      {userData.selectedPlan && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Plano Atual</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-[#FF4D22] mb-2">
                {userData.selectedPlan.name}
              </div>
              <div className="text-gray-600">{userData.selectedPlan.price}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Próxima Atualização</div>
              <div className="font-semibold text-gray-800">
                {userData.nextUpdate ? new Date(userData.nextUpdate).toLocaleDateString('pt-BR') : 'Em breve'}
              </div>
            </div>
            <div>
              <button
                onClick={generateNewPlan}
                className="w-full p-3 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Gerar Novo Plano (50 créditos)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => requestChange('treino')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF4D22] hover:bg-[#FF4D22]/5 transition-all duration-300 text-left"
          >
            <Dumbbell className="w-6 h-6 text-[#FF4D22] mb-2" />
            <div className="font-semibold">Alterar Treino</div>
            <div className="text-sm text-gray-600">25 créditos</div>
          </button>

          <button
            onClick={() => requestChange('dieta')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF4D22] hover:bg-[#FF4D22]/5 transition-all duration-300 text-left"
          >
            <Apple className="w-6 h-6 text-green-500 mb-2" />
            <div className="font-semibold">Alterar Dieta</div>
            <div className="text-sm text-gray-600">25 créditos</div>
          </button>

          <button
            onClick={() => requestChange('objetivo')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF4D22] hover:bg-[#FF4D22]/5 transition-all duration-300 text-left"
          >
            <Target className="w-6 h-6 text-blue-500 mb-2" />
            <div className="font-semibold">Alterar Objetivo</div>
            <div className="text-sm text-gray-600">25 créditos</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderWorkout = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Treino de Hoje</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Aquecimento (10 min)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Corrida leve - 5 minutos</li>
              <li>• Alongamento dinâmico - 5 minutos</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Treino Principal (30 min)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Flexões - 3x12</li>
              <li>• Agachamentos - 3x15</li>
              <li>• Prancha - 3x30s</li>
              <li>• Burpees - 3x8</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Relaxamento (5 min)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Alongamento estático</li>
              <li>• Respiração profunda</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Plano Alimentar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Café da Manhã</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 2 ovos mexidos</li>
              <li>• 1 fatia de pão integral</li>
              <li>• 1 banana</li>
              <li>• Café sem açúcar</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Almoço</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 150g peito de frango</li>
              <li>• 1 xícara de arroz integral</li>
              <li>• Salada verde</li>
              <li>• 1 colher de azeite</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Jantar</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 120g salmão grelhado</li>
              <li>• Legumes no vapor</li>
              <li>• 1 batata doce pequena</li>
              <li>• Chá verde</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCredits = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Meus Créditos</h3>
          <div className="text-3xl font-bold text-[#FF4D22]">{credits}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Como Usar</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Alterar treino: 25 créditos</li>
              <li>• Alterar dieta: 25 créditos</li>
              <li>• Alterar objetivo: 25 créditos</li>
              <li>• Gerar novo plano: 50 créditos</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Comprar Mais</h4>
            <div className="text-2xl font-bold text-green-600 mb-2">100 Créditos</div>
            <div className="text-lg font-semibold text-gray-800 mb-3">R$ 29,90</div>
            <button
              onClick={buyCredits}
              className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FitMind Body</h1>
                <p className="text-white/70 text-sm">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{credits} créditos</span>
              </div>
              <NotificationSystem />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
              { id: 'workout', label: 'Treino', icon: Dumbbell },
              { id: 'nutrition', label: 'Nutrição', icon: Apple },
              { id: 'credits', label: 'Créditos', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#FF4D22] text-white'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'workout' && renderWorkout()}
        {activeTab === 'nutrition' && renderNutrition()}
        {activeTab === 'credits' && renderCredits()}
      </div>

      {/* Credit Alert Modal */}
      {showCreditAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Créditos Insuficientes</h3>
              <p className="text-gray-600 mb-6">
                Você não tem créditos suficientes para esta ação. Compre mais créditos para continuar personalizando seu plano.
              </p>
              <div className="space-y-3">
                <button
                  onClick={buyCredits}
                  className="w-full p-3 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-lg font-semibold"
                >
                  Comprar Créditos (R$ 29,90)
                </button>
                <button
                  onClick={() => setShowCreditAlert(false)}
                  className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}