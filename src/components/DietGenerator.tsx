"use client";

import React, { useState } from 'react';
import { ChefHat, Clock, Target, Zap, Save, Plus, Minus, ArrowLeft } from 'lucide-react';
import { creditSystem, ACTION_COSTS } from '@/lib/credit-system';
import CreditConfirmation from './CreditConfirmation';

interface Meal {
  id: string;
  name: string;
  time: string;
  foods: {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
}

interface DietPlan {
  id: string;
  name: string;
  objective: string;
  totalCalories: number;
  meals: Meal[];
  duration: string;
  type: string;
}

interface DietGeneratorProps {
  onClose: () => void;
}

export default function DietGenerator({ onClose }: DietGeneratorProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    objective: 'emagrecimento' as 'emagrecimento' | 'ganho_massa' | 'manutencao',
    restrictions: [] as string[],
    mealsPerDay: 5,
    targetCalories: 2000,
    activityLevel: 'moderado' as 'sedentario' | 'leve' | 'moderado' | 'intenso'
  });
  
  const [generatedDiet, setGeneratedDiet] = useState<DietPlan | null>(null);
  const [showCreditConfirmation, setShowCreditConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<'generate' | 'save' | null>(null);

  const user = creditSystem.getCurrentUser();

  // Gerar dieta baseada nas preferências
  const generateDiet = async () => {
    const canConsume = await creditSystem.consumeCredits('CREATE_DIET', {
      preferences,
      timestamp: new Date().toISOString()
    });

    if (!canConsume) {
      setPendingAction('generate');
      setShowCreditConfirmation(true);
      return;
    }

    // Simular geração de dieta
    const mockDiet: DietPlan = {
      id: Date.now().toString(),
      name: `Dieta para ${preferences.objective.replace('_', ' ')}`,
      objective: preferences.objective,
      totalCalories: preferences.targetCalories,
      duration: '30 dias',
      type: 'personalizada',
      meals: [
        {
          id: '1',
          name: 'Café da Manhã',
          time: '07:00',
          totalCalories: Math.round(preferences.targetCalories * 0.25),
          foods: [
            { name: 'Aveia', quantity: '50g', calories: 190, protein: 6.5, carbs: 32, fat: 3.5 },
            { name: 'Banana', quantity: '1 unidade', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
            { name: 'Leite desnatado', quantity: '200ml', calories: 70, protein: 7, carbs: 10, fat: 0.2 }
          ]
        },
        {
          id: '2',
          name: 'Lanche da Manhã',
          time: '10:00',
          totalCalories: Math.round(preferences.targetCalories * 0.1),
          foods: [
            { name: 'Iogurte natural', quantity: '150g', calories: 90, protein: 5, carbs: 6, fat: 4.5 },
            { name: 'Castanha do Pará', quantity: '3 unidades', calories: 110, protein: 2.5, carbs: 2, fat: 11 }
          ]
        },
        {
          id: '3',
          name: 'Almoço',
          time: '12:30',
          totalCalories: Math.round(preferences.targetCalories * 0.35),
          foods: [
            { name: 'Peito de frango grelhado', quantity: '150g', calories: 250, protein: 47, carbs: 0, fat: 5.5 },
            { name: 'Arroz integral', quantity: '100g', calories: 125, protein: 2.5, carbs: 25, fat: 1 },
            { name: 'Brócolis refogado', quantity: '100g', calories: 35, protein: 3, carbs: 7, fat: 0.4 },
            { name: 'Salada verde', quantity: '1 prato', calories: 20, protein: 1, carbs: 4, fat: 0.1 }
          ]
        },
        {
          id: '4',
          name: 'Lanche da Tarde',
          time: '15:30',
          totalCalories: Math.round(preferences.targetCalories * 0.15),
          foods: [
            { name: 'Maçã', quantity: '1 unidade', calories: 80, protein: 0.4, carbs: 21, fat: 0.3 },
            { name: 'Amendoim', quantity: '20g', calories: 115, protein: 5, carbs: 3, fat: 10 }
          ]
        },
        {
          id: '5',
          name: 'Jantar',
          time: '19:00',
          totalCalories: Math.round(preferences.targetCalories * 0.15),
          foods: [
            { name: 'Salmão grelhado', quantity: '120g', calories: 210, protein: 28, carbs: 0, fat: 10 },
            { name: 'Batata doce', quantity: '100g', calories: 90, protein: 2, carbs: 21, fat: 0.1 },
            { name: 'Aspargos', quantity: '100g', calories: 20, protein: 2.2, carbs: 4, fat: 0.1 }
          ]
        }
      ]
    };

    setGeneratedDiet(mockDiet);
    setStep(3);
  };

  // Salvar dieta
  const handleSaveDiet = async () => {
    if (!generatedDiet) return;

    const canConsume = await creditSystem.consumeCredits('SAVE_DIET', {
      dietName: generatedDiet.name,
      timestamp: new Date().toISOString()
    });

    if (!canConsume) {
      setPendingAction('save');
      setShowCreditConfirmation(true);
      return;
    }

    // Salvar no sistema de créditos
    const savedDiet = creditSystem.saveDiet({
      name: generatedDiet.name,
      meals: generatedDiet.meals,
      calories: generatedDiet.totalCalories,
      type: generatedDiet.type
    });

    alert('✅ Dieta salva com sucesso!');
  };

  const handleCreditConfirmation = async () => {
    setShowCreditConfirmation(false);
    
    if (pendingAction === 'generate') {
      await generateDiet();
    } else if (pendingAction === 'save' && generatedDiet) {
      await handleSaveDiet();
    }
    
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold text-gray-900">
              🥗 Gerador de Dietas Personalizadas
            </h1>
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-600">{user.creditsBalance} créditos</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600">
            Crie sua dieta ideal baseada em seus objetivos e preferências
          </p>
          <p className="text-sm text-gray-500 mt-2">
            💡 Gerar dieta: {ACTION_COSTS.CREATE_DIET} créditos | Salvar dieta: {ACTION_COSTS.SAVE_DIET} crédito
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Objetivos */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Objetivos</h2>
            
            <div className="space-y-8">
              {/* Objetivo Principal */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Qual seu objetivo principal?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'emagrecimento', label: 'Emagrecimento', icon: '🔥', desc: 'Perder peso e gordura' },
                    { key: 'ganho_massa', label: 'Ganho de Massa', icon: '💪', desc: 'Aumentar massa muscular' },
                    { key: 'manutencao', label: 'Manutenção', icon: '⚖️', desc: 'Manter peso atual' }
                  ].map((obj) => (
                    <button
                      key={obj.key}
                      onClick={() => setPreferences(prev => ({ ...prev, objective: obj.key as any }))}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        preferences.objective === obj.key
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{obj.icon}</div>
                        <div className="font-semibold text-lg">{obj.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{obj.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nível de Atividade */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Qual seu nível de atividade física?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { key: 'sedentario', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                    { key: 'leve', label: 'Leve', desc: '1-3 dias por semana' },
                    { key: 'moderado', label: 'Moderado', desc: '3-5 dias por semana' },
                    { key: 'intenso', label: 'Intenso', desc: '6-7 dias por semana' }
                  ].map((level) => (
                    <button
                      key={level.key}
                      onClick={() => setPreferences(prev => ({ ...prev, activityLevel: level.key as any }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.activityLevel === level.key
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{level.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{level.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Número de Refeições */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Quantas refeições por dia?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, mealsPerDay: Math.max(3, prev.mealsPerDay - 1) }))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">{preferences.mealsPerDay}</span>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, mealsPerDay: Math.min(7, prev.mealsPerDay + 1) }))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Restrições e Preferências */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Restrições e Preferências</h2>
            
            <div className="space-y-8">
              {/* Restrições Alimentares */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Você tem alguma restrição alimentar?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose',
                    'Diabetes', 'Hipertensão', 'Low Carb', 'Cetogênica'
                  ].map((restriction) => (
                    <button
                      key={restriction}
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          restrictions: prev.restrictions.includes(restriction)
                            ? prev.restrictions.filter(r => r !== restriction)
                            : [...prev.restrictions, restriction]
                        }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        preferences.restrictions.includes(restriction)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta de Calorias */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Meta de calorias diárias
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, targetCalories: Math.max(1200, prev.targetCalories - 100) }))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{preferences.targetCalories}</div>
                    <div className="text-sm text-gray-600">calorias</div>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, targetCalories: Math.min(4000, prev.targetCalories + 100) }))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Recomendação baseada no seu objetivo e nível de atividade
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={generateDiet}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Gerar Dieta 🥗 ({ACTION_COSTS.CREATE_DIET} créditos)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dieta Gerada */}
        {step === 3 && generatedDiet && (
          <div className="space-y-6">
            {/* Header da dieta */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {generatedDiet.name}
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span className="capitalize">{generatedDiet.objective.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>{generatedDiet.totalCalories} kcal/dia</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{generatedDiet.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDiet}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar ({ACTION_COSTS.SAVE_DIET} crédito)
                  </button>
                </div>
              </div>

              {/* Resumo nutricional */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{generatedDiet.totalCalories}</div>
                  <div className="text-sm text-gray-600">Calorias</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(generatedDiet.totalCalories * 0.3 / 4)}g
                  </div>
                  <div className="text-sm text-gray-600">Proteínas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(generatedDiet.totalCalories * 0.45 / 4)}g
                  </div>
                  <div className="text-sm text-gray-600">Carboidratos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(generatedDiet.totalCalories * 0.25 / 9)}g
                  </div>
                  <div className="text-sm text-gray-600">Gorduras</div>
                </div>
              </div>
            </div>

            {/* Lista de refeições */}
            <div className="space-y-4">
              {generatedDiet.meals.map((meal, index) => (
                <div key={meal.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{meal.name}</h3>
                        <p className="text-gray-600">{meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{meal.totalCalories} kcal</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-600">{food.quantity}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold">{food.calories} kcal</div>
                          <div className="text-gray-600">
                            P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                ← Modificar Preferências
              </button>
              <button
                onClick={generateDiet}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <ChefHat className="w-5 h-5" />
                Gerar Nova Dieta ({ACTION_COSTS.CREATE_DIET} créditos)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Credit Confirmation Modal */}
      <CreditConfirmation
        isOpen={showCreditConfirmation}
        onClose={() => {
          setShowCreditConfirmation(false);
          setPendingAction(null);
        }}
        onConfirm={handleCreditConfirmation}
        action={pendingAction === 'generate' ? 'CREATE_DIET' : 'SAVE_DIET'}
        currentCredits={user.creditsBalance}
        actionDescription={
          pendingAction === 'generate' 
            ? 'gerar uma dieta personalizada baseada nas suas preferências'
            : 'salvar esta dieta na sua biblioteca pessoal'
        }
      />
    </div>
  );
}