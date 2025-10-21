"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, Play, Heart, RotateCcw, Clock, Target, MapPin, Dumbbell, Users, ChevronDown, ChevronRight, Star, Zap } from 'lucide-react';
import { 
  Exercise, 
  categories, 
  searchExercises, 
  suggestAlternatives,
  generateCustomWorkout,
  coachTips,
  musculationExercises,
  cardioExercises,
  functionalExercises,
  calisthenicsExercises,
  mobilityExercises
} from '@/lib/exercises-database';

interface ExerciseLibraryProps {
  onSelectExercise?: (exercise: Exercise) => void;
  selectedExercises?: string[];
  showFavorites?: boolean;
}

export default function ExerciseLibrary({ 
  onSelectExercise, 
  selectedExercises = [], 
  showFavorites = true 
}: ExerciseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedObjective, setSelectedObjective] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Todos os exercícios combinados
  const allExercises = useMemo(() => [
    ...musculationExercises,
    ...cardioExercises,
    ...functionalExercises,
    ...calisthenicsExercises,
    ...mobilityExercises
  ], []);

  // Exercícios filtrados
  const filteredExercises = useMemo(() => {
    return searchExercises(searchQuery, {
      category: selectedCategory || undefined,
      muscleGroup: selectedMuscleGroup || undefined,
      equipment: selectedEquipment.length > 0 ? selectedEquipment : undefined,
      level: selectedLevel || undefined,
      location: selectedLocation || undefined,
      objective: selectedObjective || undefined
    });
  }, [searchQuery, selectedCategory, selectedMuscleGroup, selectedEquipment, selectedLevel, selectedLocation, selectedObjective]);

  // Estatísticas da biblioteca
  const stats = useMemo(() => {
    const total = allExercises.length;
    const byCategory = {
      musculacao: musculationExercises.length,
      cardio: cardioExercises.length,
      funcional: functionalExercises.length,
      calistenia: calisthenicsExercises.length,
      mobilidade: mobilityExercises.length
    };
    return { total, byCategory };
  }, [allExercises]);

  const toggleFavorite = (exerciseId: string) => {
    setFavorites(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMuscleGroup('');
    setSelectedLevel('');
    setSelectedLocation('');
    setSelectedObjective('');
    setSelectedEquipment([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'musculacao': return <Dumbbell className="w-5 h-5" />;
      case 'cardio': return <Zap className="w-5 h-5" />;
      case 'funcional': return <Target className="w-5 h-5" />;
      case 'calistenia': return <Users className="w-5 h-5" />;
      case 'mobilidade': return <RotateCcw className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediario': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'avancado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'musculacao': return 'from-blue-500 to-blue-600';
      case 'cardio': return 'from-red-500 to-red-600';
      case 'funcional': return 'from-green-500 to-green-600';
      case 'calistenia': return 'from-purple-500 to-purple-600';
      case 'mobilidade': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏋️‍♂️ Biblioteca de Exercícios
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Catálogo completo com {stats.total} exercícios profissionais
          </p>
          
          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getCategoryColor(category)} flex items-center justify-center text-white mx-auto mb-2`}>
                  {getCategoryIcon(category)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Barra de busca */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar exercícios por nome ou grupo muscular..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Toggle de filtros */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros Avançados
              {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredExercises.length} exercícios encontrados
              </span>
              {(searchQuery || selectedCategory || selectedMuscleGroup || selectedLevel || selectedLocation || selectedObjective || selectedEquipment.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Modalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalidade</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {categories.modalidades.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Grupo Muscular */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Muscular</label>
                <select
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {categories.gruposMusculares.map(muscle => (
                    <option key={muscle} value={muscle} className="capitalize">{muscle}</option>
                  ))}
                </select>
              </div>

              {/* Nível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {categories.niveis.map(level => (
                    <option key={level} value={level} className="capitalize">{level}</option>
                  ))}
                </select>
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {categories.locais.map(location => (
                    <option key={location} value={location} className="capitalize">{location}</option>
                  ))}
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
                <select
                  value={selectedObjective}
                  onChange={(e) => setSelectedObjective(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {categories.objetivos.map(obj => (
                    <option key={obj} value={obj} className="capitalize">{obj}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Exercícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Thumbnail do vídeo */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(exercise.category)} opacity-90`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    {getCategoryIcon(exercise.category)}
                    <div className="mt-2 text-sm font-medium capitalize">{exercise.category}</div>
                  </div>
                </div>
                
                {/* Play button */}
                <button className="absolute inset-0 flex items-center justify-center group">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>

                {/* Favorite button */}
                {showFavorites && (
                  <button
                    onClick={() => toggleFavorite(exercise.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(exercise.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                    />
                  </button>
                )}

                {/* Duration */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs">
                  {exercise.duration}s
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{exercise.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(exercise.level)}`}>
                    {exercise.level}
                  </span>
                </div>

                {/* Grupos musculares */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.muscleGroup.slice(0, 3).map((muscle) => (
                    <span key={muscle} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium capitalize">
                      {muscle}
                    </span>
                  ))}
                  {exercise.muscleGroup.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs">
                      +{exercise.muscleGroup.length - 3}
                    </span>
                  )}
                </div>

                {/* Informações rápidas */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="capitalize">{exercise.location}</span>
                  </div>
                  {exercise.sets && (
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{exercise.sets}x{exercise.reps}</span>
                    </div>
                  )}
                  {exercise.restTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.restTime}s</span>
                    </div>
                  )}
                  {exercise.calories && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>{exercise.calories} cal/min</span>
                    </div>
                  )}
                </div>

                {/* Equipamentos */}
                {exercise.equipment.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Equipamentos:</div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.slice(0, 2).map((eq) => (
                        <span key={eq} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                          {eq}
                        </span>
                      ))}
                      {exercise.equipment.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{exercise.equipment.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {expandedExercise === exercise.id ? 'Menos detalhes' : 'Ver detalhes'}
                  </button>
                  {onSelectExercise && (
                    <button
                      onClick={() => onSelectExercise(exercise)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedExercises.includes(exercise.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {selectedExercises.includes(exercise.id) ? '✓' : '+'}
                    </button>
                  )}
                </div>

                {/* Detalhes expandidos */}
                {expandedExercise === exercise.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Instruções */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">📋 Execução:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        {exercise.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Respiração */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🫁 Respiração:</h4>
                      <p className="text-sm text-gray-700">{exercise.breathing}</p>
                    </div>

                    {/* Erros comuns */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">⚠️ Erros Comuns:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {exercise.commonMistakes.map((mistake, index) => (
                          <li key={index}>{mistake}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Variações */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🔄 Variações:</h4>
                      <div className="space-y-2">
                        {exercise.variations.map((variation, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(variation.level)}`}>
                              {variation.level}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{variation.name}</div>
                              <div className="text-xs text-gray-600">{variation.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dicas */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">💡 Dicas do Coach:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {exercise.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum exercício encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar os filtros ou buscar por outros termos</p>
            <button
              onClick={clearFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Dicas do Coach */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Dicas do Coach</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(coachTips).map(([level, tips]) => (
              <div key={level} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold mb-3 capitalize">{level}</h4>
                <ul className="space-y-2 text-sm">
                  {tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-300 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}