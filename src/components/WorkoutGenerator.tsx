"use client";

import React, { useState, useMemo } from 'react';
import { Target, Clock, MapPin, Dumbbell, Users, Zap, RotateCcw, Play, Plus, Minus, Save, Download, Share2 } from 'lucide-react';
import { 
  Exercise, 
  WorkoutPlan,
  generateCustomWorkout,
  categories,
  searchExercises,
  suggestAlternatives
} from '@/lib/exercises-database';
import { creditSystem, ACTION_COSTS } from '@/lib/credit-system';
import ExerciseVideoPlayer from './ExerciseVideoPlayer';
import CreditConfirmation from './CreditConfirmation';

interface WorkoutGeneratorProps {
  onSaveWorkout?: (workout: WorkoutPlan) => void;
}

export default function WorkoutGenerator({ onSaveWorkout }: WorkoutGeneratorProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    level: 'intermediario' as 'iniciante' | 'intermediario' | 'avancado',
    duration: 60,
    muscleGroups: [] as string[],
    equipment: [] as string[],
    location: 'academia' as string,
    objective: 'hipertrofia' as string,
    workoutType: 'full-body' as 'full-body' | 'A/B' | 'ABC' | 'ABCD' | 'push-pull-legs' | 'upper-lower'
  });
  
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedExerciseForVideo, setSelectedExerciseForVideo] = useState<Exercise | null>(null);
  const [customizedExercises, setCustomizedExercises] = useState<{[key: string]: any}>({});
  const [showCreditConfirmation, setShowCreditConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<'generate' | 'save' | null>(null);

  const user = creditSystem.getCurrentUser();

  // Gerar treino baseado nas preferências
  const generateWorkout = async () => {
    const canConsume = await creditSystem.consumeCredits('GENERATE_WORKOUT', {
      preferences,
      timestamp: new Date().toISOString()
    });

    if (!canConsume) {
      setPendingAction('generate');
      setShowCreditConfirmation(true);
      return;
    }

    const workout = generateCustomWorkout(preferences);
    setGeneratedWorkout(workout);
    setStep(3);
  };

  // Salvar treino
  const handleSaveWorkout = async () => {
    if (!generatedWorkout) return;

    const canConsume = await creditSystem.consumeCredits('SAVE_WORKOUT', {
      workoutName: generatedWorkout.name,
      timestamp: new Date().toISOString()
    });

    if (!canConsume) {
      setPendingAction('save');
      setShowCreditConfirmation(true);
      return;
    }

    // Salvar no sistema de créditos
    const savedWorkout = creditSystem.saveWorkout({
      name: generatedWorkout.name,
      exercises: generatedWorkout.exercises,
      duration: generatedWorkout.duration,
      level: generatedWorkout.level,
      category: generatedWorkout.category
    });

    // Callback para o componente pai
    onSaveWorkout?.(generatedWorkout);

    alert('✅ Treino salvo com sucesso!');
  };

  const handleCreditConfirmation = async () => {
    setShowCreditConfirmation(false);
    
    if (pendingAction === 'generate') {
      const workout = generateCustomWorkout(preferences);
      setGeneratedWorkout(workout);
      setStep(3);
    } else if (pendingAction === 'save' && generatedWorkout) {
      const savedWorkout = creditSystem.saveWorkout({
        name: generatedWorkout.name,
        exercises: generatedWorkout.exercises,
        duration: generatedWorkout.duration,
        level: generatedWorkout.level,
        category: generatedWorkout.category
      });
      onSaveWorkout?.(generatedWorkout);
      alert('✅ Treino salvo com sucesso!');
    }
    
    setPendingAction(null);
  };

  // Buscar exercício por ID
  const findExerciseById = (id: string): Exercise | undefined => {
    const allExercises = searchExercises('');
    return allExercises.find(ex => ex.id === id);
  };

  // Substituir exercício
  const replaceExercise = (exerciseId: string, newExerciseId: string) => {
    if (!generatedWorkout) return;
    
    const updatedExercises = generatedWorkout.exercises.map(ex => 
      ex.exerciseId === exerciseId 
        ? { ...ex, exerciseId: newExerciseId }
        : ex
    );
    
    setGeneratedWorkout({
      ...generatedWorkout,
      exercises: updatedExercises
    });
  };

  // Customizar sets/reps de um exercício
  const customizeExercise = (exerciseId: string, field: string, value: any) => {
    if (!generatedWorkout) return;
    
    const updatedExercises = generatedWorkout.exercises.map(ex => 
      ex.exerciseId === exerciseId 
        ? { ...ex, [field]: value }
        : ex
    );
    
    setGeneratedWorkout({
      ...generatedWorkout,
      exercises: updatedExercises
    });
  };

  // Calcular tempo total estimado
  const estimatedDuration = useMemo(() => {
    if (!generatedWorkout) return 0;
    
    return generatedWorkout.exercises.reduce((total, ex) => {
      const exercise = findExerciseById(ex.exerciseId);
      if (!exercise) return total;
      
      const exerciseTime = (exercise.duration || 30) * ex.sets;
      const restTime = ex.restTime * (ex.sets - 1);
      return total + exerciseTime + restTime;
    }, 0) / 60; // converter para minutos
  }, [generatedWorkout]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-500 hover:bg-green-600';
      case 'intermediario': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'avancado': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getObjectiveIcon = (objective: string) => {
    switch (objective) {
      case 'hipertrofia': return <Dumbbell className="w-5 h-5" />;
      case 'emagrecimento': return <Zap className="w-5 h-5" />;
      case 'forca': return <Target className="w-5 h-5" />;
      case 'resistencia': return <RotateCcw className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com saldo de créditos */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              🎯 Gerador de Treinos Personalizados
            </h1>
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-600">{user.creditsBalance} créditos</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600">
            Crie seu treino ideal baseado em suas preferências e objetivos
          </p>
          <p className="text-sm text-gray-500 mt-2">
            💡 Gerar treino: {ACTION_COSTS.GENERATE_WORKOUT} crédito | Salvar treino: {ACTION_COSTS.SAVE_WORKOUT} crédito
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Preferências Básicas */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Preferências</h2>
            
            <div className="space-y-8">
              {/* Nível */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Qual seu nível de experiência?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.niveis.map((level) => (
                    <button
                      key={level}
                      onClick={() => setPreferences(prev => ({ ...prev, level: level as any }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.level === level
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white ${getLevelColor(level)}`}>
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="font-semibold capitalize">{level}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {level === 'iniciante' && 'Começando agora'}
                          {level === 'intermediario' && '6+ meses de treino'}
                          {level === 'avancado' && '2+ anos de experiência'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duração */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Quanto tempo você tem disponível?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[30, 45, 60, 90].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setPreferences(prev => ({ ...prev, duration }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.duration === duration
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="font-semibold">{duration} min</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Local */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Onde você vai treinar?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {categories.locais.map((location) => (
                    <button
                      key={location}
                      onClick={() => setPreferences(prev => ({ ...prev, location }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.location === location
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="font-semibold capitalize">{location}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Qual seu objetivo principal?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['hipertrofia', 'emagrecimento', 'forca', 'resistencia'].map((objective) => (
                    <button
                      key={objective}
                      onClick={() => setPreferences(prev => ({ ...prev, objective }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.objective === objective
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white">
                          {getObjectiveIcon(objective)}
                        </div>
                        <div className="font-semibold capitalize">{objective}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Grupos Musculares e Equipamentos */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalhes do Treino</h2>
            
            <div className="space-y-8">
              {/* Grupos Musculares */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Quais grupos musculares você quer treinar?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.gruposMusculares.map((muscle) => (
                    <button
                      key={muscle}
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          muscleGroups: prev.muscleGroups.includes(muscle)
                            ? prev.muscleGroups.filter(m => m !== muscle)
                            : [...prev.muscleGroups, muscle]
                        }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        preferences.muscleGroups.includes(muscle)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium capitalize">{muscle}</div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Selecione pelo menos 2 grupos musculares
                </p>
              </div>

              {/* Equipamentos Disponíveis */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Quais equipamentos você tem disponível?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.equipamentos.slice(0, 12).map((equipment) => (
                    <button
                      key={equipment}
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          equipment: prev.equipment.includes(equipment)
                            ? prev.equipment.filter(e => e !== equipment)
                            : [...prev.equipment, equipment]
                        }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        preferences.equipment.includes(equipment)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium capitalize">{equipment}</div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Deixe vazio para exercícios apenas com peso corporal
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
                onClick={generateWorkout}
                disabled={preferences.muscleGroups.length < 2}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Gerar Treino 🎯 ({ACTION_COSTS.GENERATE_WORKOUT} crédito)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Treino Gerado */}
        {step === 3 && generatedWorkout && (
          <div className="space-y-6">
            {/* Header do treino */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {generatedWorkout.name}
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.round(estimatedDuration)} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span className="capitalize">{preferences.objective}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">{preferences.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveWorkout}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar ({ACTION_COSTS.SAVE_WORKOUT} crédito)
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                </div>
              </div>

              {/* Resumo do treino */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{generatedWorkout.exercises.length}</div>
                  <div className="text-sm text-gray-600">Exercícios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {generatedWorkout.exercises.reduce((total, ex) => total + ex.sets, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Séries Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(estimatedDuration)}</div>
                  <div className="text-sm text-gray-600">Minutos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 capitalize">{generatedWorkout.level}</div>
                  <div className="text-sm text-gray-600">Nível</div>
                </div>
              </div>
            </div>

            {/* Lista de exercícios */}
            <div className="space-y-4">
              {generatedWorkout.exercises.map((workoutExercise, index) => {
                const exercise = findExerciseById(workoutExercise.exerciseId);
                if (!exercise) return null;

                return (
                  <div key={`${workoutExercise.exerciseId}-${index}`} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-6">
                      {/* Número do exercício */}
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>

                      {/* Thumbnail e play button */}
                      <div className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90" />
                        <button
                          onClick={() => setSelectedExerciseForVideo(exercise)}
                          className="absolute inset-0 flex items-center justify-center group"
                        >
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                        </button>
                      </div>

                      {/* Informações do exercício */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exercise.muscleGroup.slice(0, 3).map((muscle) => (
                            <span key={muscle} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium capitalize">
                              {muscle}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Nível: <span className="capitalize font-medium">{exercise.level}</span></span>
                          <span>Duração: {exercise.duration}s</span>
                          {exercise.equipment.length > 0 && (
                            <span>Equipamento: {exercise.equipment.slice(0, 2).join(', ')}</span>
                          )}
                        </div>
                      </div>

                      {/* Configurações do exercício */}
                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {/* Séries */}
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Séries</label>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => customizeExercise(workoutExercise.exerciseId, 'sets', Math.max(1, workoutExercise.sets - 1))}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-bold">{workoutExercise.sets}</span>
                              <button
                                onClick={() => customizeExercise(workoutExercise.exerciseId, 'sets', workoutExercise.sets + 1)}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Repetições */}
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Reps</label>
                            <input
                              type="text"
                              value={workoutExercise.reps}
                              onChange={(e) => customizeExercise(workoutExercise.exerciseId, 'reps', e.target.value)}
                              className="w-16 text-center text-sm border border-gray-200 rounded px-1 py-1"
                            />
                          </div>

                          {/* Descanso */}
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Descanso</label>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => customizeExercise(workoutExercise.exerciseId, 'restTime', Math.max(15, workoutExercise.restTime - 15))}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{workoutExercise.restTime}s</span>
                              <button
                                onClick={() => customizeExercise(workoutExercise.exerciseId, 'restTime', workoutExercise.restTime + 15)}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Botão de substituir */}
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Substituir exercício
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                onClick={generateWorkout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Gerar Novo Treino ({ACTION_COSTS.GENERATE_WORKOUT} crédito)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedExerciseForVideo && (
        <ExerciseVideoPlayer
          exercise={selectedExerciseForVideo}
          isOpen={!!selectedExerciseForVideo}
          onClose={() => setSelectedExerciseForVideo(null)}
        />
      )}

      {/* Credit Confirmation Modal */}
      <CreditConfirmation
        isOpen={showCreditConfirmation}
        onClose={() => {
          setShowCreditConfirmation(false);
          setPendingAction(null);
        }}
        onConfirm={handleCreditConfirmation}
        action={pendingAction === 'generate' ? 'GENERATE_WORKOUT' : 'SAVE_WORKOUT'}
        currentCredits={user.creditsBalance}
        actionDescription={
          pendingAction === 'generate' 
            ? 'gerar um treino personalizado baseado nas suas preferências'
            : 'salvar este treino na sua biblioteca pessoal'
        }
      />
    </div>
  );
}