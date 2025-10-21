import { WorkoutVideo, QuizResponse } from './types';

// Biblioteca completa de vídeos de treino com foco em calistenia
export const workoutLibrary: WorkoutVideo[] = [
  // CALISTENIA - INICIANTE
  {
    id: 'cal-init-1',
    title: 'Calistenia Básica - Primeiros Passos',
    description: 'Introdução aos movimentos fundamentais da calistenia',
    duration: '20 min',
    difficulty: 'Iniciante',
    type: 'Calistenia',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    exercises: [
      {
        name: 'Flexões de joelho',
        sets: 3,
        reps: 8,
        restTime: '60s',
        instructions: ['Apoie os joelhos no chão', 'Mantenha o core contraído', 'Desça controladamente']
      },
      {
        name: 'Agachamento livre',
        sets: 3,
        reps: 12,
        restTime: '45s',
        instructions: ['Pés na largura dos ombros', 'Desça até 90 graus', 'Suba explosivamente']
      },
      {
        name: 'Prancha',
        sets: 3,
        duration: '30s',
        restTime: '60s',
        instructions: ['Mantenha o corpo alinhado', 'Contraia o abdômen', 'Respire normalmente']
      }
    ],
    targetMuscles: ['Peito', 'Pernas', 'Core'],
    equipment: ['peso_corporal'],
    calories: 150,
    points: 80
  },
  
  {
    id: 'cal-init-2',
    title: 'Força Funcional Iniciante',
    description: 'Desenvolvimento de força básica usando peso corporal',
    duration: '25 min',
    difficulty: 'Iniciante',
    type: 'Calistenia',
    thumbnail: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
    exercises: [
      {
        name: 'Flexões inclinadas',
        sets: 3,
        reps: 10,
        restTime: '60s',
        instructions: ['Use um banco ou parede', 'Mantenha o corpo reto', 'Controle a descida']
      },
      {
        name: 'Agachamento com salto',
        sets: 3,
        reps: 8,
        restTime: '90s',
        instructions: ['Agache normalmente', 'Salte explosivamente', 'Aterrisse suavemente']
      },
      {
        name: 'Mountain Climbers',
        sets: 3,
        duration: '30s',
        restTime: '60s',
        instructions: ['Posição de prancha', 'Alterne as pernas rapidamente', 'Mantenha o core estável']
      }
    ],
    targetMuscles: ['Peito', 'Pernas', 'Core', 'Cardio'],
    equipment: ['peso_corporal'],
    calories: 180,
    points: 90
  },

  // CALISTENIA - INTERMEDIÁRIO
  {
    id: 'cal-inter-1',
    title: 'Calistenia Intermediária - Progressões',
    description: 'Movimentos mais desafiadores para desenvolvimento muscular',
    duration: '30 min',
    difficulty: 'Intermediário',
    type: 'Calistenia',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/UBMk30rjy0o',
    exercises: [
      {
        name: 'Flexões diamante',
        sets: 4,
        reps: 8,
        restTime: '90s',
        instructions: ['Forme um diamante com as mãos', 'Foque no tríceps', 'Movimento controlado']
      },
      {
        name: 'Pistol Squat assistido',
        sets: 3,
        reps: 5,
        restTime: '2min',
        instructions: ['Use apoio se necessário', 'Uma perna por vez', 'Desça controladamente']
      },
      {
        name: 'Pull-ups negativos',
        sets: 3,
        reps: 5,
        restTime: '2min',
        instructions: ['Salte para posição alta', 'Desça lentamente', 'Controle total do movimento']
      }
    ],
    targetMuscles: ['Peito', 'Tríceps', 'Pernas', 'Costas'],
    equipment: ['peso_corporal', 'barra_fixa'],
    calories: 220,
    points: 120
  },

  {
    id: 'cal-inter-2',
    title: 'Força e Resistência Calistênica',
    description: 'Combinação de força e resistência muscular',
    duration: '35 min',
    difficulty: 'Intermediário',
    type: 'Calistenia',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    exercises: [
      {
        name: 'Flexões archer',
        sets: 3,
        reps: 6,
        restTime: '2min',
        instructions: ['Transfira peso para um braço', 'Alterne os lados', 'Movimento lento e controlado']
      },
      {
        name: 'Burpees',
        sets: 4,
        reps: 10,
        restTime: '90s',
        instructions: ['Movimento completo', 'Salto no final', 'Ritmo constante']
      },
      {
        name: 'L-Sit hold',
        sets: 3,
        duration: '15s',
        restTime: '2min',
        instructions: ['Levante as pernas', 'Mantenha os braços retos', 'Core contraído']
      }
    ],
    targetMuscles: ['Corpo todo', 'Core', 'Braços'],
    equipment: ['peso_corporal'],
    calories: 280,
    points: 140
  },

  // CALISTENIA - AVANÇADO
  {
    id: 'cal-avanc-1',
    title: 'Calistenia Avançada - Movimentos Complexos',
    description: 'Movimentos avançados para atletas experientes',
    duration: '40 min',
    difficulty: 'Avançado',
    type: 'Calistenia',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/UBMk30rjy0o',
    exercises: [
      {
        name: 'Muscle-ups',
        sets: 4,
        reps: 3,
        restTime: '3min',
        instructions: ['Movimento explosivo', 'Transição suave', 'Controle total']
      },
      {
        name: 'Handstand push-ups',
        sets: 3,
        reps: 5,
        restTime: '3min',
        instructions: ['Parada de mão na parede', 'Flexão invertida', 'Força de ombros']
      },
      {
        name: 'Pistol Squat completo',
        sets: 3,
        reps: 8,
        restTime: '2min',
        instructions: ['Sem apoio', 'Amplitude completa', 'Controle e equilíbrio']
      }
    ],
    targetMuscles: ['Corpo todo', 'Ombros', 'Pernas'],
    equipment: ['peso_corporal', 'barra_fixa'],
    calories: 350,
    points: 200
  },

  // HIIT E CARDIO
  {
    id: 'hiit-1',
    title: 'HIIT Queima Gordura Extremo',
    description: 'Treino intervalado de alta intensidade',
    duration: '20 min',
    difficulty: 'Intermediário',
    type: 'HIIT',
    thumbnail: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI',
    exercises: [
      {
        name: 'Burpees',
        duration: '45s',
        restTime: '15s',
        instructions: ['Máxima intensidade', 'Movimento completo', 'Não pare']
      },
      {
        name: 'Mountain Climbers',
        duration: '45s',
        restTime: '15s',
        instructions: ['Velocidade máxima', 'Core contraído', 'Respiração controlada']
      },
      {
        name: 'Jump Squats',
        duration: '45s',
        restTime: '15s',
        instructions: ['Saltos explosivos', 'Aterrissagem suave', 'Ritmo constante']
      }
    ],
    targetMuscles: ['Corpo todo', 'Cardio'],
    equipment: ['peso_corporal'],
    calories: 300,
    points: 150
  },

  // MOBILIDADE E FLEXIBILIDADE
  {
    id: 'mob-1',
    title: 'Mobilidade e Flexibilidade Completa',
    description: 'Melhore sua amplitude de movimento e recuperação',
    duration: '25 min',
    difficulty: 'Todos os níveis',
    type: 'Mobilidade',
    thumbnail: 'https://images.unsplash.com/photo-1506629905607-d9c297d3f5f9?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/L_xrDAtykMI',
    exercises: [
      {
        name: 'Cat-Cow Stretch',
        sets: 2,
        reps: 10,
        restTime: '30s',
        instructions: ['Movimento fluido', 'Respire profundamente', 'Sinta a coluna']
      },
      {
        name: 'Hip Circles',
        sets: 2,
        reps: 10,
        restTime: '30s',
        instructions: ['Círculos amplos', 'Ambas as direções', 'Mobilidade do quadril']
      },
      {
        name: 'Shoulder Rolls',
        sets: 2,
        reps: 15,
        restTime: '30s',
        instructions: ['Movimentos lentos', 'Amplitude completa', 'Relaxe os ombros']
      }
    ],
    targetMuscles: ['Coluna', 'Quadril', 'Ombros'],
    equipment: ['peso_corporal'],
    calories: 80,
    points: 60
  }
];

// Função para gerar treinos personalizados baseados no quiz
export function generatePersonalizedWorkouts(quizData: QuizResponse): WorkoutVideo[] {
  let filteredWorkouts = [...workoutLibrary];

  // Filtrar por nível
  if (quizData.nivel === 'iniciante') {
    filteredWorkouts = filteredWorkouts.filter(w => 
      w.difficulty === 'Iniciante' || w.difficulty === 'Todos os níveis'
    );
  } else if (quizData.nivel === 'intermediario') {
    filteredWorkouts = filteredWorkouts.filter(w => 
      w.difficulty === 'Iniciante' || w.difficulty === 'Intermediário' || w.difficulty === 'Todos os níveis'
    );
  }

  // Filtrar por equipamentos disponíveis
  filteredWorkouts = filteredWorkouts.filter(workout => 
    workout.equipment.some(eq => quizData.equipamentos.includes(eq))
  );

  // Filtrar por duração preferida
  const maxDuration = parseInt(quizData.tempo.split('-')[1] || quizData.tempo.replace('min+', ''));
  filteredWorkouts = filteredWorkouts.filter(workout => {
    const workoutDuration = parseInt(workout.duration);
    return workoutDuration <= maxDuration + 10; // Margem de 10 minutos
  });

  // Priorizar por objetivo
  if (quizData.objetivo === 'perder_peso') {
    filteredWorkouts.sort((a, b) => {
      const aIsHIIT = a.type === 'HIIT' ? 1 : 0;
      const bIsHIIT = b.type === 'HIIT' ? 1 : 0;
      return bIsHIIT - aIsHIIT || b.calories - a.calories;
    });
  } else if (quizData.objetivo === 'ganhar_massa') {
    filteredWorkouts.sort((a, b) => {
      const aIsStrength = a.type === 'Calistenia' || a.type === 'Força' ? 1 : 0;
      const bIsStrength = b.type === 'Calistenia' || b.type === 'Força' ? 1 : 0;
      return bIsStrength - aIsStrength;
    });
  } else if (quizData.objetivo === 'condicionamento') {
    filteredWorkouts.sort((a, b) => {
      const aIsCardio = a.type === 'HIIT' || a.type === 'Cardio' ? 1 : 0;
      const bIsCardio = b.type === 'HIIT' || b.type === 'Cardio' ? 1 : 0;
      return bIsCardio - aIsCardio;
    });
  }

  // Garantir variedade - incluir pelo menos um treino de mobilidade
  const mobilityWorkout = workoutLibrary.find(w => w.type === 'Mobilidade');
  if (mobilityWorkout && !filteredWorkouts.includes(mobilityWorkout)) {
    filteredWorkouts.push(mobilityWorkout);
  }

  // Garantir que sempre tenha calistenia se peso_corporal estiver disponível
  if (quizData.equipamentos.includes('peso_corporal')) {
    const calisteniaWorkouts = workoutLibrary.filter(w => 
      w.type === 'Calistenia' && 
      w.difficulty === quizData.nivel.charAt(0).toUpperCase() + quizData.nivel.slice(1)
    );
    
    calisteniaWorkouts.forEach(workout => {
      if (!filteredWorkouts.includes(workout)) {
        filteredWorkouts.unshift(workout); // Adiciona no início
      }
    });
  }

  return filteredWorkouts.slice(0, 8); // Retorna até 8 treinos personalizados
}

// Função para obter treinos recomendados para hoje
export function getTodaysRecommendedWorkouts(userPreferences: QuizResponse): WorkoutVideo[] {
  const personalizedWorkouts = generatePersonalizedWorkouts(userPreferences);
  
  // Lógica para variar os treinos por dia da semana
  const dayOfWeek = new Date().getDay();
  
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Fim de semana - treinos mais leves
    return personalizedWorkouts.filter(w => 
      w.type === 'Mobilidade' || w.difficulty === 'Iniciante'
    ).slice(0, 2);
  } else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) { // Segunda, quarta, sexta - força
    return personalizedWorkouts.filter(w => 
      w.type === 'Calistenia' || w.type === 'Força'
    ).slice(0, 2);
  } else { // Terça e quinta - cardio/HIIT
    return personalizedWorkouts.filter(w => 
      w.type === 'HIIT' || w.type === 'Cardio'
    ).slice(0, 2);
  }
}

// Função para calcular pontos baseado na performance
export function calculateWorkoutPoints(
  workout: WorkoutVideo, 
  completionTime: number, 
  difficulty: string
): number {
  let basePoints = workout.points;
  
  // Bonus por completar mais rápido que o esperado
  const expectedTime = parseInt(workout.duration) * 60; // em segundos
  if (completionTime < expectedTime * 0.9) {
    basePoints *= 1.2;
  }
  
  // Bonus por nível de dificuldade
  const difficultyMultiplier = {
    'Iniciante': 1.0,
    'Intermediário': 1.3,
    'Avançado': 1.6,
    'Todos os níveis': 1.1
  };
  
  basePoints *= difficultyMultiplier[workout.difficulty as keyof typeof difficultyMultiplier];
  
  return Math.round(basePoints);
}