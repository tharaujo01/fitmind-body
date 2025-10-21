'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Shuffle, Play, Heart, Clock, Target } from 'lucide-react';

// Mock data for exercises
const exercises = [
  {
    id: 1,
    name: 'Flexão de Braço',
    shortDescription: 'Exercício clássico para peito e tríceps',
    level: 'Iniciante',
    duration: '5 min',
    thumbnail: '/api/placeholder/150/150',
    category: 'Peito'
  },
  {
    id: 2,
    name: 'Agachamento',
    shortDescription: 'Exercício fundamental para pernas',
    level: 'Intermediário',
    duration: '10 min',
    thumbnail: '/api/placeholder/150/150',
    category: 'Pernas'
  },
  {
    id: 3,
    name: 'Barra Fixa',
    shortDescription: 'Exercício para costas e bíceps',
    level: 'Avançado',
    duration: '8 min',
    thumbnail: '/api/placeholder/150/150',
    category: 'Costas'
  },
  // Add more exercises as needed
];

export default function LibraryPage() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showExerciseSwap, setShowExerciseSwap] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const getSimilarExercises = (exercise) => {
    return exercises.filter(ex => ex.category === exercise.category && ex.id !== exercise.id);
  };

  const toggleFavorite = (exerciseId) => {
    setFavorites(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Biblioteca de Exercícios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={exercise.thumbnail}
                alt={exercise.name}
                className="w-full h-48 object-cover"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(exercise.id)}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(exercise.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {exercise.name}
                <Button
                  size="sm"
                  onClick={() => setCurrentVideo(exercise)}
                  className="ml-2"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Ver
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{exercise.shortDescription}</p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  {exercise.level}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.duration}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentVideo(exercise);
                  setShowExerciseSwap(true);
                }}
                className="w-full"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Trocar Exercício
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Modal */}
      {currentVideo && !showExerciseSwap && (
        <Dialog open={!!currentVideo} onOpenChange={() => setCurrentVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{currentVideo.name}</DialogTitle>
              <DialogDescription>{currentVideo.shortDescription}</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Vídeo do exercício: {currentVideo.name}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCurrentVideo(null)}>
                Fechar
              </Button>
              <Button onClick={() => setShowExerciseSwap(true)}>
                <Shuffle className="w-4 h-4 mr-2" />
                Trocar Exercício
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Troca de Exercício */}
      <Dialog open={showExerciseSwap} onOpenChange={setShowExerciseSwap}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              Trocar Exercício
            </DialogTitle>
            <DialogDescription>
              Escolha um exercício alternativo da mesma categoria
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {currentVideo && getSimilarExercises(currentVideo).map((exercise) => (
              <Card key={exercise.id} className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={() => {
                setCurrentVideo(exercise);
                setShowExerciseSwap(false);
              }}>
                <div className="flex items-center gap-4">
                  <img
                    src={exercise.thumbnail}
                    alt={exercise.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">{exercise.shortDescription}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{exercise.level}</Badge>
                      <Badge variant="outline" className="text-xs">{exercise.duration}</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExerciseSwap(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}