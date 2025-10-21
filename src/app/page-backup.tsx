'use client';

import { useState } from 'react';
import { ChevronRight, Check, X, Heart, Droplets, Calendar, Trophy, Star, Home, Dumbbell, Clock, User, Target, Scale, Utensils, Zap, Award, Users } from 'lucide-react';

export default function FitnessQuiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updatesAccepted, setUpdatesAccepted] = useState(false);
  const [showWaterEngagement, setShowWaterEngagement] = useState(false);
  const [showProblemEngagement, setShowProblemEngagement] = useState(false);
  const [showTrainingEngagement, setShowTrainingEngagement] = useState(false);

  const handleAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < 50) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Função para gerar dieta personalizada baseada nos objetivos
  const generatePersonalizedDiet = () => {
    const goal = answers.goal;
    const diet = answers.diet;
    const sugar = answers.sugar;
    const currentWeight = answers.currentWeight || 80;
    const targetWeight = answers.targetWeight || 75;
    const height = answers.height || 175;
    
    // Calcular necessidades calóricas básicas
    const bmr = 88.362 + (13.397 * currentWeight) + (4.799 * height) - (5.677 * 30); // Aproximação para 30 anos
    const dailyCalories = goal === 'perder_peso' ? bmr * 1.2 : goal === 'ganhar_massa' ? bmr * 1.6 : bmr * 1.4;
    
    return {
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(currentWeight * 2.2), // 2.2g por kg
      carbs: Math.round(dailyCalories * 0.4 / 4), // 40% das calorias
      fats: Math.round(dailyCalories * 0.3 / 9), // 30% das calorias
      water: 2.5 + (currentWeight * 0.035) // Litros por dia
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              FitMind Body
            </h1>
            <p className="text-xl text-gray-600">
              Transforme seu corpo e mente com nosso quiz personalizado
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bem-vindo ao FitMind Body!
              </h2>
              <p className="text-gray-600 mb-8">
                Vamos começar sua jornada de transformação
              </p>
              
              <button 
                onClick={nextStep}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Começar Quiz
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}