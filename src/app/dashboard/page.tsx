'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Dumbbell, 
  Utensils, 
  Zap, 
  Trophy, 
  Settings, 
  CreditCard, 
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Star,
  Plus,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';
import { fitnessService } from '@/lib/fitness-service';
import { UserProfile, WorkoutPlan, DietPlan, CreditTransaction, CustomizationRequest } from '@/lib/types';
import { useNotifications } from '@/hooks/useNotifications';

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [currentDiet, setCurrentDiet] = useState<DietPlan | null>(null);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [customizationRequests, setCustomizationRequests] = useState<CustomizationRequest[]>([]);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizationType, setCustomizationType] = useState<CustomizationRequest['type']>('workout');
  const [customizationDescription, setCustomizationDescription] = useState('');
  const { showNotification, notifyCreditsLow, notifyCustomizationComplete } = useNotifications();
  
  const router = useRouter();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setIsLoading(true);
    
    try {
      // Verificar se usuário existe
      let userData = fitnessService.getUser();
      
      if (!userData) {
        // Criar usuário baseado nos dados do quiz
        const quizData = localStorage.getItem('userQuizData');
        const selectedPlan = localStorage.getItem('selectedPlan');
        
        if (quizData) {
          const parsedQuizData = JSON.parse(quizData);
          userData = fitnessService.createUser({
            name: parsedQuizData.name || 'Usuário',
            email: parsedQuizData.email || '',
            birthDate: parsedQuizData.birthDate || '',
            quizData: parsedQuizData
          });

          // Se há plano selecionado, ativar
          if (selectedPlan) {
            const planData = JSON.parse(selectedPlan);
            fitnessService.subscribeToPlan(planData);
            userData = fitnessService.getUser(); // Recarregar com plano
          }
        } else {
          // Redirecionar para quiz se não há dados
          router.push('/quiz');
          return;
        }
      }

      setUser(userData);

      // Carregar dados do dashboard
      const workout = fitnessService.getCurrentWorkout();
      const diet = fitnessService.getCurrentDiet();
      const transactions = fitnessService.getCreditTransactions();

      // Se não há treino/dieta, gerar baseado no quiz
      if (!workout && userData.quizData) {
        const newWorkout = fitnessService.generateWorkoutPlan(userData.quizData);
        setCurrentWorkout(newWorkout);
      } else {
        setCurrentWorkout(workout);
      }

      if (!diet && userData.quizData) {
        const newDiet = fitnessService.generateDietPlan(userData.quizData);
        setCurrentDiet(newDiet);
      } else {
        setCurrentDiet(diet);
      }

      setCreditTransactions(transactions);

    } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyCredits = () => {
    window.open('https://pay.kiwify.com.br/k88c9zn', '_blank');
    
    // Simular compra de créditos após um tempo
    setTimeout(() => {
      fitnessService.addCredits(100, 'Compra de 100 créditos - R$ 29,90');
      const updatedUser = fitnessService.getUser();
      setUser(updatedUser);
      setCreditTransactions(fitnessService.getCreditTransactions());
      showNotification('Créditos Adicionados! 🎉', '100 créditos foram adicionados à sua conta.', 'success');
    }, 3000);
  };

  const handleCustomizationRequest = async () => {
    if (!customizationDescription.trim()) return;

    const request = fitnessService.requestCustomization(customizationType, customizationDescription);
    
    if (!request) {
      notifyCreditsLow();
      return;
    }

    // Processar personalização
    const success = fitnessService.processCustomization(request.id);
    
    if (success) {
      setShowCustomizationModal(false);
      setCustomizationDescription('');
      
      // Notificar sucesso
      notifyCustomizationComplete(customizationType);
      
      // Atualizar dados
      setTimeout(() => {
        initializeDashboard();
      }, 2500);
    }
  };

  const getCreditCost = (type: CustomizationRequest['type']) => {
    const costs = {
      workout: 20,
      diet: 15,
      goal: 25,
      exercise: 5,
      meal: 3
    };
    return costs[type];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Erro ao carregar dados do usuário</p>
          <button
            onClick={() => router.push('/quiz')}
            className="px-6 py-3 bg-[#FF4D22] text-white rounded-xl font-semibold hover:bg-[#FF6B47] transition-colors"
          >
            Refazer Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Olá, {user.name}!</h1>
                <p className="text-white/70 text-sm">
                  {user.selectedPlan ? `Plano ${user.selectedPlan.planName}` : 'Sem plano ativo'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{user.credits} créditos</span>
              </div>
              
              <button
                onClick={handleBuyCredits}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar Créditos</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'workout', label: 'Treino', icon: <Dumbbell className="w-4 h-4" /> },
            { id: 'diet', label: 'Dieta', icon: <Utensils className="w-4 h-4" /> },
            { id: 'credits', label: 'Créditos', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'profile', label: 'Perfil', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/70 text-sm">Dias Ativos</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {user.selectedPlan ? Math.floor((Date.now() - new Date(user.selectedPlan.selectedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/70 text-sm">Objetivo</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {user.quizData?.goal || 'Não definido'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/70 text-sm">Créditos</span>
                </div>
                <div className="text-2xl font-bold text-white">{user.credits}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white/70 text-sm">Nível</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {user.quizData?.fitnessLevel?.category || 'Iniciante'}
                </div>
              </div>
            </div>

            {/* Current Plans */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Workout */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Dumbbell className="w-6 h-6" />
                    <span>Treino Atual</span>
                  </h3>
                  <button
                    onClick={() => setShowCustomizationModal(true)}
                    className="bg-[#FF4D22] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#FF6B47] transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Personalizar</span>
                  </button>
                </div>
                
                {currentWorkout ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Duração:</span>
                      <span className="text-white font-semibold">{currentWorkout.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Dificuldade:</span>
                      <span className="text-white font-semibold">{currentWorkout.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Exercícios:</span>
                      <span className="text-white font-semibold">{currentWorkout.exercises.length}</span>
                    </div>
                    <div className="space-y-2">
                      {currentWorkout.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3">
                          <div className="font-semibold text-white">{exercise.name}</div>
                          <div className="text-white/70 text-sm">{exercise.sets} séries × {exercise.reps}</div>
                        </div>
                      ))}
                      {currentWorkout.exercises.length > 3 && (
                        <div className="text-center text-white/70 text-sm">
                          +{currentWorkout.exercises.length - 3} exercícios
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white/70 py-8">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum treino ativo</p>
                  </div>
                )}
              </div>

              {/* Current Diet */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Utensils className="w-6 h-6" />
                    <span>Dieta Atual</span>
                  </h3>
                  <button
                    onClick={() => {
                      setCustomizationType('diet');
                      setShowCustomizationModal(true);
                    }}
                    className="bg-[#FF4D22] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#FF6B47] transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Personalizar</span>
                  </button>
                </div>
                
                {currentDiet ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Calorias Totais:</span>
                      <span className="text-white font-semibold">{currentDiet.totalCalories} kcal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-white font-semibold">{currentDiet.macros.protein}g</div>
                        <div className="text-white/70 text-sm">Proteína</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{currentDiet.macros.carbs}g</div>
                        <div className="text-white/70 text-sm">Carboidratos</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{currentDiet.macros.fat}g</div>
                        <div className="text-white/70 text-sm">Gorduras</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentDiet.meals.slice(0, 3).map((meal, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div className="font-semibold text-white">{meal.name}</div>
                            <div className="text-white/70 text-sm">{meal.calories} kcal</div>
                          </div>
                          <div className="text-white/70 text-sm">{meal.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white/70 py-8">
                    <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma dieta ativa</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workout' && currentWorkout && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">{currentWorkout.name}</h2>
              <div className="flex items-center space-x-4">
                <div className="text-white/70">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {currentWorkout.duration} min
                </div>
                <div className="text-white/70">
                  <Target className="w-4 h-4 inline mr-1" />
                  {currentWorkout.difficulty}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentWorkout.exercises.map((exercise, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{exercise.name}</h3>
                  <div className="space-y-2 text-white/80">
                    <div className="flex justify-between">
                      <span>Séries:</span>
                      <span className="font-semibold">{exercise.sets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repetições:</span>
                      <span className="font-semibold">{exercise.reps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Descanso:</span>
                      <span className="font-semibold">{exercise.rest}</span>
                    </div>
                    <div className="mt-4 p-3 bg-white/10 rounded-lg">
                      <div className="text-sm text-white/70 mb-1">Instruções:</div>
                      <div className="text-sm text-white">{exercise.instructions}</div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {exercise.muscleGroups.map((muscle, idx) => (
                        <span key={idx} className="bg-[#FF4D22] text-white px-2 py-1 rounded-full text-xs">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diet' && currentDiet && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">{currentDiet.name}</h2>
              <div className="text-white/70">
                <span className="font-semibold">{currentDiet.totalCalories}</span> kcal/dia
              </div>
            </div>

            {/* Macros Overview */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{currentDiet.macros.protein}g</div>
                <div className="text-white/70">Proteína</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{currentDiet.macros.carbs}g</div>
                <div className="text-white/70">Carboidratos</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{currentDiet.macros.fat}g</div>
                <div className="text-white/70">Gorduras</div>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-6">
              {currentDiet.meals.map((meal, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{meal.name}</h3>
                    <div className="text-white/70">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {meal.time} • {meal.calories} kcal
                    </div>
                  </div>
                  <div className="space-y-3">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                        <div>
                          <div className="text-white font-medium">{food.name}</div>
                          <div className="text-white/70 text-sm">{food.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{food.calories} kcal</div>
                          <div className="text-white/70 text-xs">
                            P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-8">
            {/* Credits Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{user.credits}</div>
                <div className="text-white/70">Créditos Disponíveis</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {creditTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <div className="text-white/70">Total Comprado</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {Math.abs(creditTransactions.filter(t => t.type === 'usage').reduce((sum, t) => sum + t.amount, 0))}
                </div>
                <div className="text-white/70">Total Usado</div>
              </div>
            </div>

            {/* Buy Credits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Comprar Mais Créditos</h3>
              <p className="text-white/70 mb-6">
                Use créditos para personalizar seus treinos, dietas e muito mais!
              </p>
              <button
                onClick={handleBuyCredits}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Comprar 100 Créditos - R$ 29,90
              </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Histórico de Transações</h3>
              {creditTransactions.length > 0 ? (
                <div className="space-y-4">
                  {creditTransactions.slice(-10).reverse().map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                      <div>
                        <div className="text-white font-medium">{transaction.description}</div>
                        <div className="text-white/70 text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} créditos
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/70 py-8">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma transação ainda</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Perfil do Usuário</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nome</label>
                  <div className="bg-white/10 rounded-lg p-3 text-white">{user.name}</div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email</label>
                  <div className="bg-white/10 rounded-lg p-3 text-white">{user.email || 'Não informado'}</div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Data de Nascimento</label>
                  <div className="bg-white/10 rounded-lg p-3 text-white">{user.birthDate || 'Não informado'}</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Objetivo</label>
                  <div className="bg-white/10 rounded-lg p-3 text-white">{user.quizData?.goal || 'Não definido'}</div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nível de Fitness</label>
                  <div className="bg-white/10 rounded-lg p-3 text-white">
                    {user.quizData?.fitnessLevel?.category || 'Não definido'}
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Local de Treino</label>
                  <div className="bg-white/10 rounded-lg p-3 text-white">
                    {user.quizData?.workoutLocation || 'Não definido'}
                  </div>
                </div>
              </div>
            </div>

            {user.selectedPlan && (
              <div className="mt-8 p-6 bg-white/10 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">Plano Ativo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-white/70 text-sm">Plano</div>
                    <div className="text-white font-semibold">{user.selectedPlan.planName}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm">Preço</div>
                    <div className="text-white font-semibold">{user.selectedPlan.price}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm">Renovações</div>
                    <div className="text-white font-semibold">{user.selectedPlan.renewalCount}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customization Modal */}
      {showCustomizationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Personalizar Plano</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-2">Tipo de Personalização</label>
                <select
                  value={customizationType}
                  onChange={(e) => setCustomizationType(e.target.value as CustomizationRequest['type'])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF4D22] focus:outline-none"
                >
                  <option value="workout">Treino Completo (20 créditos)</option>
                  <option value="diet">Dieta Completa (15 créditos)</option>
                  <option value="goal">Mudar Objetivo (25 créditos)</option>
                  <option value="exercise">Exercício Específico (5 créditos)</option>
                  <option value="meal">Refeição Específica (3 créditos)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-2">Descrição da Personalização</label>
                <textarea
                  value={customizationDescription}
                  onChange={(e) => setCustomizationDescription(e.target.value)}
                  placeholder="Descreva o que você gostaria de alterar..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF4D22] focus:outline-none h-24 resize-none"
                />
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Custo:</span>
                  <span className="font-bold text-[#FF4D22]">{getCreditCost(customizationType)} créditos</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Seus créditos:</span>
                  <span className={`font-bold ${user.credits >= getCreditCost(customizationType) ? 'text-green-600' : 'text-red-600'}`}>
                    {user.credits} créditos
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowCustomizationModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCustomizationRequest}
                disabled={!customizationDescription.trim() || user.credits < getCreditCost(customizationType)}
                className="flex-1 py-3 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-lg hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Personalização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}