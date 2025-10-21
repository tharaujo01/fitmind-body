// 🏋️‍♂️ BIBLIOTECA DE EXERCÍCIOS - BANCO DE DADOS CENTRAL
// Catálogo profissional e completo de exercícios para todas as modalidades

export interface Exercise {
  id: string;
  name: string;
  category: 'musculacao' | 'cardio' | 'funcional' | 'calistenia' | 'mobilidade';
  muscleGroup: string[];
  equipment: string[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  location: 'academia' | 'casa' | 'ao-ar-livre' | 'qualquer';
  objective: string[];
  videoUrl: string;
  duration: number; // em segundos
  instructions: string[];
  breathing: string;
  commonMistakes: string[];
  variations: {
    level: 'iniciante' | 'intermediario' | 'avancado';
    name: string;
    description: string;
  }[];
  sets?: number;
  reps?: string;
  restTime?: number; // em segundos
  calories?: number; // por minuto
  tips: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: 'A/B' | 'ABC' | 'ABCD' | 'full-body' | 'push-pull-legs' | 'upper-lower';
  level: 'iniciante' | 'intermediario' | 'avancado';
  duration: number; // em minutos
  exercises: {
    exerciseId: string;
    sets: number;
    reps: string;
    restTime: number;
    notes?: string;
  }[];
}

// 🏋️‍♂️ MUSCULAÇÃO - Exercícios por Grupo Muscular
export const musculationExercises: Exercise[] = [
  // PEITO
  {
    id: 'supino-reto-barra',
    name: 'Supino Reto com Barra',
    category: 'musculacao',
    muscleGroup: ['peito', 'triceps', 'ombros'],
    equipment: ['barra', 'banco', 'anilhas'],
    level: 'intermediario',
    location: 'academia',
    objective: ['hipertrofia', 'forca'],
    videoUrl: 'https://example.com/supino-reto-barra.mp4',
    duration: 25,
    instructions: [
      'Deite no banco com os pés firmes no chão',
      'Segure a barra com pegada um pouco mais larga que os ombros',
      'Desça a barra controladamente até tocar o peito',
      'Empurre a barra para cima até extensão completa dos braços'
    ],
    breathing: 'Inspire na descida, expire no esforço (subida)',
    commonMistakes: [
      'Arquear excessivamente as costas',
      'Não tocar a barra no peito',
      'Usar pegada muito larga ou muito fechada',
      'Não manter os pés no chão'
    ],
    variations: [
      { level: 'iniciante', name: 'Supino com Halteres', description: 'Maior estabilidade e amplitude' },
      { level: 'intermediario', name: 'Supino Reto Barra', description: 'Versão clássica' },
      { level: 'avancado', name: 'Supino com Pausa', description: 'Pausa de 2s no peito' }
    ],
    sets: 4,
    reps: '8-12',
    restTime: 90,
    tips: [
      'Mantenha os ombros retraídos durante todo movimento',
      'Controle a descida em 2-3 segundos',
      'Use um spotter para cargas pesadas'
    ]
  },
  {
    id: 'supino-inclinado-halter',
    name: 'Supino Inclinado com Halteres',
    category: 'musculacao',
    muscleGroup: ['peito-superior', 'ombros', 'triceps'],
    equipment: ['halteres', 'banco-inclinado'],
    level: 'intermediario',
    location: 'academia',
    objective: ['hipertrofia', 'definicao'],
    videoUrl: 'https://example.com/supino-inclinado-halter.mp4',
    duration: 30,
    instructions: [
      'Ajuste o banco em 30-45 graus de inclinação',
      'Segure os halteres com pegada neutra',
      'Desça os halteres até a linha do peito',
      'Empurre para cima contraindo o peito'
    ],
    breathing: 'Inspire na descida, expire na subida',
    commonMistakes: [
      'Inclinar o banco muito alto (acima de 45°)',
      'Não manter os cotovelos alinhados',
      'Usar carga excessiva comprometendo a técnica'
    ],
    variations: [
      { level: 'iniciante', name: 'Inclinado Máquina', description: 'Maior estabilidade' },
      { level: 'intermediario', name: 'Inclinado Halteres', description: 'Versão padrão' },
      { level: 'avancado', name: 'Inclinado Unilateral', description: 'Um braço por vez' }
    ],
    sets: 3,
    reps: '10-15',
    restTime: 75,
    tips: [
      'Foque na contração do peito superior',
      'Mantenha o core ativado',
      'Não deixe os halteres se tocarem no alto'
    ]
  },
  {
    id: 'flexao-tradicional',
    name: 'Flexão Tradicional',
    category: 'musculacao',
    muscleGroup: ['peito', 'triceps', 'ombros', 'core'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['forca', 'resistencia', 'definicao'],
    videoUrl: 'https://example.com/flexao-tradicional.mp4',
    duration: 20,
    instructions: [
      'Posicione as mãos no chão, largura dos ombros',
      'Mantenha o corpo reto da cabeça aos pés',
      'Desça até o peito quase tocar o chão',
      'Empurre para cima até extensão completa'
    ],
    breathing: 'Inspire na descida, expire na subida',
    commonMistakes: [
      'Deixar o quadril cair ou subir muito',
      'Não descer completamente',
      'Posicionar as mãos muito à frente',
      'Não manter o core contraído'
    ],
    variations: [
      { level: 'iniciante', name: 'Flexão no Joelho', description: 'Apoio nos joelhos' },
      { level: 'intermediario', name: 'Flexão Tradicional', description: 'Versão clássica' },
      { level: 'avancado', name: 'Flexão com Palmas', description: 'Explosiva com palmas' }
    ],
    sets: 3,
    reps: '10-20',
    restTime: 60,
    tips: [
      'Mantenha o corpo alinhado como uma prancha',
      'Controle a descida em 2 segundos',
      'Olhe para baixo mantendo pescoço neutro'
    ]
  },

  // COSTAS
  {
    id: 'puxada-frente',
    name: 'Puxada pela Frente',
    category: 'musculacao',
    muscleGroup: ['latissimo', 'romboides', 'biceps'],
    equipment: ['polia-alta', 'barra-larga'],
    level: 'intermediario',
    location: 'academia',
    objective: ['hipertrofia', 'forca'],
    videoUrl: 'https://example.com/puxada-frente.mp4',
    duration: 25,
    instructions: [
      'Sente no equipamento com coxas fixas',
      'Segure a barra com pegada larga pronada',
      'Puxe a barra até a linha do peito',
      'Retorne controladamente à posição inicial'
    ],
    breathing: 'Inspire no início, expire ao puxar',
    commonMistakes: [
      'Usar muito o bíceps em vez das costas',
      'Inclinar muito o tronco para trás',
      'Não retrair as escápulas',
      'Soltar a barra muito rápido'
    ],
    variations: [
      { level: 'iniciante', name: 'Puxada Assistida', description: 'Com auxílio de peso' },
      { level: 'intermediario', name: 'Puxada Frente', description: 'Versão padrão' },
      { level: 'avancado', name: 'Puxada com Peso Extra', description: 'Carga adicional no cinto' }
    ],
    sets: 4,
    reps: '8-12',
    restTime: 90,
    tips: [
      'Inicie o movimento retraindo as escápulas',
      'Foque em "quebrar" a barra com as mãos',
      'Mantenha o peito estufado durante todo movimento'
    ]
  },
  {
    id: 'remada-curvada-barra',
    name: 'Remada Curvada com Barra',
    category: 'musculacao',
    muscleGroup: ['latissimo', 'romboides', 'trapezio', 'biceps'],
    equipment: ['barra', 'anilhas'],
    level: 'avancado',
    location: 'academia',
    objective: ['hipertrofia', 'forca', 'postura'],
    videoUrl: 'https://example.com/remada-curvada-barra.mp4',
    duration: 30,
    instructions: [
      'Segure a barra com pegada pronada, largura dos ombros',
      'Incline o tronco 45° mantendo costas retas',
      'Puxe a barra até tocar o abdômen',
      'Desça controladamente até extensão completa'
    ],
    breathing: 'Inspire antes de puxar, expire no esforço',
    commonMistakes: [
      'Arredondar as costas durante o movimento',
      'Usar muito impulso das pernas',
      'Não manter o core contraído',
      'Puxar muito alto (linha do peito)'
    ],
    variations: [
      { level: 'iniciante', name: 'Remada Máquina', description: 'Com apoio para as costas' },
      { level: 'intermediario', name: 'Remada Halteres', description: 'Unilateral com apoio' },
      { level: 'avancado', name: 'Remada Curvada Barra', description: 'Versão livre mais desafiadora' }
    ],
    sets: 4,
    reps: '6-10',
    restTime: 120,
    tips: [
      'Mantenha joelhos levemente flexionados',
      'Aperte as escápulas no final do movimento',
      'Use cinto se necessário para cargas pesadas'
    ]
  },

  // OMBROS
  {
    id: 'desenvolvimento-ombros',
    name: 'Desenvolvimento de Ombros',
    category: 'musculacao',
    muscleGroup: ['deltoide-anterior', 'deltoide-medio', 'triceps'],
    equipment: ['halteres', 'banco'],
    level: 'intermediario',
    location: 'academia',
    objective: ['hipertrofia', 'forca'],
    videoUrl: 'https://example.com/desenvolvimento-ombros.mp4',
    duration: 25,
    instructions: [
      'Sente no banco com encosto a 90°',
      'Segure halteres na altura dos ombros',
      'Empurre para cima até extensão completa',
      'Desça controladamente até posição inicial'
    ],
    breathing: 'Inspire na descida, expire na subida',
    commonMistakes: [
      'Arquear excessivamente as costas',
      'Não descer completamente os halteres',
      'Usar impulso das pernas',
      'Juntar os halteres no alto'
    ],
    variations: [
      { level: 'iniciante', name: 'Desenvolvimento Máquina', description: 'Maior estabilidade' },
      { level: 'intermediario', name: 'Desenvolvimento Halteres', description: 'Versão padrão' },
      { level: 'avancado', name: 'Desenvolvimento Arnold', description: 'Com rotação dos punhos' }
    ],
    sets: 3,
    reps: '10-15',
    restTime: 75,
    tips: [
      'Mantenha o core contraído',
      'Não tranque completamente os cotovelos',
      'Controle a descida em 2-3 segundos'
    ]
  },
  {
    id: 'elevacao-lateral',
    name: 'Elevação Lateral',
    category: 'musculacao',
    muscleGroup: ['deltoide-medio'],
    equipment: ['halteres'],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['hipertrofia', 'definicao'],
    videoUrl: 'https://example.com/elevacao-lateral.mp4',
    duration: 20,
    instructions: [
      'Fique em pé com halteres nas mãos',
      'Mantenha braços levemente flexionados',
      'Eleve os braços até altura dos ombros',
      'Desça controladamente'
    ],
    breathing: 'Inspire ao subir, expire ao descer',
    commonMistakes: [
      'Elevar os braços acima da linha dos ombros',
      'Usar impulso do corpo',
      'Não manter leve flexão dos cotovelos',
      'Descer muito rápido'
    ],
    variations: [
      { level: 'iniciante', name: 'Elevação Lateral', description: 'Versão básica' },
      { level: 'intermediario', name: 'Elevação com Cabo', description: 'Tensão constante' },
      { level: 'avancado', name: 'Elevação 21s', description: '7 parciais baixo + 7 alto + 7 completas' }
    ],
    sets: 3,
    reps: '12-20',
    restTime: 45,
    tips: [
      'Imagine que está despejando água dos halteres',
      'Mantenha ombros para baixo',
      'Use carga moderada priorizando técnica'
    ]
  },

  // BÍCEPS
  {
    id: 'rosca-direta-barra',
    name: 'Rosca Direta com Barra',
    category: 'musculacao',
    muscleGroup: ['biceps', 'antebraco'],
    equipment: ['barra', 'anilhas'],
    level: 'intermediario',
    location: 'academia',
    objective: ['hipertrofia', 'forca'],
    videoUrl: 'https://example.com/rosca-direta-barra.mp4',
    duration: 20,
    instructions: [
      'Fique em pé com barra nas mãos, pegada supinada',
      'Mantenha cotovelos fixos ao lado do corpo',
      'Flexione os braços levando a barra ao peito',
      'Desça controladamente até extensão completa'
    ],
    breathing: 'Inspire na descida, expire na subida',
    commonMistakes: [
      'Balançar o corpo para ajudar',
      'Não estender completamente os braços',
      'Afastar os cotovelos do corpo',
      'Usar carga excessiva'
    ],
    variations: [
      { level: 'iniciante', name: 'Rosca Halteres', description: 'Alternada ou simultânea' },
      { level: 'intermediario', name: 'Rosca Barra', description: 'Versão clássica' },
      { level: 'avancado', name: 'Rosca 21s', description: '7 parciais + 7 parciais + 7 completas' }
    ],
    sets: 3,
    reps: '10-15',
    restTime: 60,
    tips: [
      'Mantenha punhos firmes e alinhados',
      'Contraia o bíceps no topo do movimento',
      'Evite usar impulso das pernas'
    ]
  },

  // TRÍCEPS
  {
    id: 'triceps-testa',
    name: 'Tríceps Testa',
    category: 'musculacao',
    muscleGroup: ['triceps'],
    equipment: ['barra-w', 'banco'],
    level: 'intermediario',
    location: 'academia',
    objective: ['hipertrofia', 'definicao'],
    videoUrl: 'https://example.com/triceps-testa.mp4',
    duration: 25,
    instructions: [
      'Deite no banco segurando barra W',
      'Mantenha braços perpendiculares ao chão',
      'Flexione apenas os antebraços descendo a barra',
      'Estenda os braços contraindo o tríceps'
    ],
    breathing: 'Inspire na descida, expire na extensão',
    commonMistakes: [
      'Mover os braços durante o exercício',
      'Descer a barra muito rápido',
      'Não manter cotovelos fixos',
      'Usar carga excessiva'
    ],
    variations: [
      { level: 'iniciante', name: 'Tríceps Halteres', description: 'Com halter único' },
      { level: 'intermediario', name: 'Tríceps Barra W', description: 'Versão padrão' },
      { level: 'avancado', name: 'Tríceps Pegada Fechada', description: 'Com barra reta' }
    ],
    sets: 3,
    reps: '12-18',
    restTime: 60,
    tips: [
      'Mantenha cotovelos apontando para cima',
      'Controle total na fase excêntrica',
      'Não tranque completamente os cotovelos'
    ]
  },

  // PERNAS
  {
    id: 'agachamento-livre',
    name: 'Agachamento Livre',
    category: 'musculacao',
    muscleGroup: ['quadriceps', 'gluteos', 'isquiotibiais'],
    equipment: ['barra', 'rack', 'anilhas'],
    level: 'avancado',
    location: 'academia',
    objective: ['hipertrofia', 'forca', 'funcional'],
    videoUrl: 'https://example.com/agachamento-livre.mp4',
    duration: 30,
    instructions: [
      'Posicione a barra no trapézio superior',
      'Pés na largura dos ombros, pontas levemente abertas',
      'Desça flexionando quadril e joelhos simultaneamente',
      'Suba empurrando o chão com os pés'
    ],
    breathing: 'Inspire antes de descer, expire no esforço',
    commonMistakes: [
      'Joelhos caindo para dentro',
      'Não descer até paralelo das coxas',
      'Inclinar muito o tronco à frente',
      'Não manter o core contraído'
    ],
    variations: [
      { level: 'iniciante', name: 'Agachamento Goblet', description: 'Com halter no peito' },
      { level: 'intermediario', name: 'Agachamento Smith', description: 'Na máquina Smith' },
      { level: 'avancado', name: 'Agachamento Livre', description: 'Versão mais desafiadora' }
    ],
    sets: 4,
    reps: '6-12',
    restTime: 120,
    tips: [
      'Mantenha o peso nos calcanhares',
      'Imagine sentar numa cadeira',
      'Mantenha joelhos alinhados com os pés'
    ]
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'musculacao',
    muscleGroup: ['quadriceps', 'gluteos'],
    equipment: ['leg-press'],
    level: 'iniciante',
    location: 'academia',
    objective: ['hipertrofia', 'forca'],
    videoUrl: 'https://example.com/leg-press.mp4',
    duration: 25,
    instructions: [
      'Sente no equipamento com costas apoiadas',
      'Posicione pés na plataforma, largura dos ombros',
      'Desça até joelhos formarem 90°',
      'Empurre a plataforma até quase extensão completa'
    ],
    breathing: 'Inspire na descida, expire ao empurrar',
    commonMistakes: [
      'Descer além de 90° sem flexibilidade',
      'Trancar completamente os joelhos',
      'Posicionar pés muito baixo na plataforma',
      'Não manter costas apoiadas'
    ],
    variations: [
      { level: 'iniciante', name: 'Leg Press Padrão', description: 'Pés na largura dos ombros' },
      { level: 'intermediario', name: 'Leg Press Pés Altos', description: 'Mais ênfase nos glúteos' },
      { level: 'avancado', name: 'Leg Press Unilateral', description: 'Uma perna por vez' }
    ],
    sets: 3,
    reps: '12-20',
    restTime: 90,
    tips: [
      'Não solte completamente o peso',
      'Mantenha joelhos alinhados',
      'Use amplitude completa respeitando limites'
    ]
  },

  // ABDÔMEN
  {
    id: 'abdominal-tradicional',
    name: 'Abdominal Tradicional',
    category: 'musculacao',
    muscleGroup: ['reto-abdominal'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['definicao', 'resistencia'],
    videoUrl: 'https://example.com/abdominal-tradicional.mp4',
    duration: 15,
    instructions: [
      'Deite com joelhos flexionados, pés no chão',
      'Mãos atrás da cabeça sem entrelaçar dedos',
      'Eleve o tronco contraindo o abdômen',
      'Desça controladamente sem relaxar'
    ],
    breathing: 'Expire ao subir, inspire ao descer',
    commonMistakes: [
      'Puxar o pescoço com as mãos',
      'Subir muito alto (sentar completamente)',
      'Fazer movimento muito rápido',
      'Não manter tensão no abdômen'
    ],
    variations: [
      { level: 'iniciante', name: 'Abdominal Tradicional', description: 'Versão básica' },
      { level: 'intermediario', name: 'Abdominal com Peso', description: 'Anilha no peito' },
      { level: 'avancado', name: 'Abdominal Declinado', description: 'Em banco declinado' }
    ],
    sets: 3,
    reps: '15-25',
    restTime: 30,
    tips: [
      'Foque na contração do abdômen',
      'Mantenha queixo afastado do peito',
      'Qualidade do movimento > quantidade'
    ]
  },
  {
    id: 'prancha',
    name: 'Prancha',
    category: 'musculacao',
    muscleGroup: ['core', 'reto-abdominal', 'transverso'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['resistencia', 'estabilidade'],
    videoUrl: 'https://example.com/prancha.mp4',
    duration: 20,
    instructions: [
      'Apoie antebraços e pontas dos pés no chão',
      'Mantenha corpo reto da cabeça aos pés',
      'Contraia abdômen e glúteos',
      'Mantenha respiração normal'
    ],
    breathing: 'Respiração normal e controlada',
    commonMistakes: [
      'Deixar quadril cair ou subir muito',
      'Não manter ombros sobre cotovelos',
      'Prender a respiração',
      'Não contrair o core'
    ],
    variations: [
      { level: 'iniciante', name: 'Prancha Joelhos', description: 'Apoio nos joelhos' },
      { level: 'intermediario', name: 'Prancha Tradicional', description: 'Versão padrão' },
      { level: 'avancado', name: 'Prancha com Elevação', description: 'Alternando braços/pernas' }
    ],
    sets: 3,
    reps: '30-60s',
    restTime: 45,
    tips: [
      'Imagine uma linha reta do topo da cabeça aos calcanhares',
      'Aperte glúteos para manter alinhamento',
      'Comece com tempos menores e progrida'
    ]
  }
];

// 🏃‍♂️ CARDIO - Exercícios Cardiovasculares
export const cardioExercises: Exercise[] = [
  {
    id: 'corrida-esteira',
    name: 'Corrida na Esteira',
    category: 'cardio',
    muscleGroup: ['pernas', 'gluteos', 'core'],
    equipment: ['esteira'],
    level: 'intermediario',
    location: 'academia',
    objective: ['emagrecimento', 'resistencia'],
    videoUrl: 'https://example.com/corrida-esteira.mp4',
    duration: 1800, // 30 minutos
    instructions: [
      'Ajuste velocidade gradualmente',
      'Mantenha postura ereta',
      'Aterrisse com meio do pé',
      'Mantenha braços relaxados'
    ],
    breathing: 'Respiração ritmada e profunda',
    commonMistakes: [
      'Começar muito rápido',
      'Segurar nas laterais da esteira',
      'Passadas muito longas',
      'Não aquecer adequadamente'
    ],
    variations: [
      { level: 'iniciante', name: 'Caminhada Rápida', description: '5-6 km/h' },
      { level: 'intermediario', name: 'Corrida Moderada', description: '8-10 km/h' },
      { level: 'avancado', name: 'Corrida Intensa', description: '12+ km/h' }
    ],
    calories: 12, // por minuto
    tips: [
      'Aumente intensidade gradualmente',
      'Hidrate-se durante o exercício',
      'Use tênis adequado para corrida'
    ]
  },
  {
    id: 'hiit-burpees',
    name: 'HIIT com Burpees',
    category: 'cardio',
    muscleGroup: ['corpo-todo'],
    equipment: [],
    level: 'avancado',
    location: 'qualquer',
    objective: ['emagrecimento', 'resistencia', 'forca'],
    videoUrl: 'https://example.com/hiit-burpees.mp4',
    duration: 900, // 15 minutos
    instructions: [
      'Agache e apoie mãos no chão',
      'Salte pernas para trás (prancha)',
      'Faça uma flexão (opcional)',
      'Salte pernas para frente e pule'
    ],
    breathing: 'Respiração intensa, não prenda',
    commonMistakes: [
      'Não manter forma na flexão',
      'Não saltar completamente',
      'Fazer movimento muito rápido perdendo técnica',
      'Não descansar nos intervalos'
    ],
    variations: [
      { level: 'iniciante', name: 'Burpee sem Flexão', description: 'Sem a flexão no meio' },
      { level: 'intermediario', name: 'Burpee Tradicional', description: 'Com flexão' },
      { level: 'avancado', name: 'Burpee com Salto Alto', description: 'Salto mais explosivo' }
    ],
    calories: 15, // por minuto
    tips: [
      'Mantenha ritmo constante',
      'Foque na técnica mesmo cansado',
      'Descanse completamente nos intervalos'
    ]
  },
  {
    id: 'bike-ergometrica',
    name: 'Bike Ergométrica',
    category: 'cardio',
    muscleGroup: ['quadriceps', 'gluteos', 'panturrilhas'],
    equipment: ['bike-ergometrica'],
    level: 'iniciante',
    location: 'academia',
    objective: ['emagrecimento', 'resistencia'],
    videoUrl: 'https://example.com/bike-ergometrica.mp4',
    duration: 2400, // 40 minutos
    instructions: [
      'Ajuste altura do selim (perna quase estendida)',
      'Mantenha postura ereta',
      'Pedale com movimento circular',
      'Varie intensidade durante treino'
    ],
    breathing: 'Respiração profunda e ritmada',
    commonMistakes: [
      'Selim muito alto ou muito baixo',
      'Apoiar muito peso no guidão',
      'Pedalar apenas com ponta dos pés',
      'Manter mesma intensidade todo tempo'
    ],
    variations: [
      { level: 'iniciante', name: 'Bike Leve', description: 'Resistência baixa, 60-70% FCM' },
      { level: 'intermediario', name: 'Bike Moderada', description: 'Resistência média, 70-80% FCM' },
      { level: 'avancado', name: 'Bike Intervalada', description: 'Alternando alta/baixa intensidade' }
    ],
    calories: 8, // por minuto
    tips: [
      'Mantenha joelhos alinhados',
      'Use toda a sola do pé no pedal',
      'Hidrate-se regularmente'
    ]
  },
  {
    id: 'pular-corda',
    name: 'Pular Corda',
    category: 'cardio',
    muscleGroup: ['panturrilhas', 'core', 'ombros'],
    equipment: ['corda'],
    level: 'intermediario',
    location: 'qualquer',
    objective: ['emagrecimento', 'coordenacao', 'agilidade'],
    videoUrl: 'https://example.com/pular-corda.mp4',
    duration: 600, // 10 minutos
    instructions: [
      'Segure corda com punhos relaxados',
      'Mantenha cotovelos próximos ao corpo',
      'Salte apenas o necessário para passar a corda',
      'Aterrisse na ponta dos pés'
    ],
    breathing: 'Respiração ritmada com os saltos',
    commonMistakes: [
      'Saltar muito alto',
      'Mover braços inteiros em vez dos punhos',
      'Aterrissar com pé inteiro',
      'Corda muito longa ou muito curta'
    ],
    variations: [
      { level: 'iniciante', name: 'Saltos Simples', description: 'Um salto por giro' },
      { level: 'intermediario', name: 'Alternando Pés', description: 'Como corrida no lugar' },
      { level: 'avancado', name: 'Saltos Duplos', description: 'Dois giros por salto' }
    ],
    calories: 13, // por minuto
    tips: [
      'Comece com sessões curtas',
      'Mantenha ritmo constante',
      'Use superfície adequada (não muito dura)'
    ]
  }
];

// 🤸‍♂️ FUNCIONAL - Exercícios Funcionais
export const functionalExercises: Exercise[] = [
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    category: 'funcional',
    muscleGroup: ['gluteos', 'isquiotibiais', 'core', 'ombros'],
    equipment: ['kettlebell'],
    level: 'intermediario',
    location: 'academia',
    objective: ['forca', 'resistencia', 'queima-gordura'],
    videoUrl: 'https://example.com/kettlebell-swing.mp4',
    duration: 30,
    instructions: [
      'Segure kettlebell com ambas as mãos',
      'Pés na largura dos ombros',
      'Flexione quadril levando kettlebell entre pernas',
      'Estenda quadril explosivamente elevando kettlebell'
    ],
    breathing: 'Expire no movimento explosivo para cima',
    commonMistakes: [
      'Usar braços para levantar o peso',
      'Não estender completamente o quadril',
      'Elevar kettlebell acima da cabeça',
      'Arredondar as costas'
    ],
    variations: [
      { level: 'iniciante', name: 'Swing com Halter', description: 'Usando halter no lugar' },
      { level: 'intermediario', name: 'Kettlebell Swing', description: 'Versão tradicional' },
      { level: 'avancado', name: 'Swing Unilateral', description: 'Uma mão por vez' }
    ],
    sets: 4,
    reps: '15-20',
    restTime: 60,
    calories: 12,
    tips: [
      'Movimento vem do quadril, não dos braços',
      'Mantenha core contraído',
      'Kettlebell deve flutuar no ponto mais alto'
    ]
  },
  {
    id: 'thruster',
    name: 'Thruster',
    category: 'funcional',
    muscleGroup: ['pernas', 'ombros', 'core'],
    equipment: ['halteres'],
    level: 'avancado',
    location: 'qualquer',
    objective: ['forca', 'resistencia', 'funcional'],
    videoUrl: 'https://example.com/thruster.mp4',
    duration: 25,
    instructions: [
      'Segure halteres na altura dos ombros',
      'Agache mantendo halteres na posição',
      'Suba explosivamente',
      'Continue movimento empurrando halteres acima da cabeça'
    ],
    breathing: 'Inspire na descida, expire no movimento explosivo',
    commonMistakes: [
      'Pausar entre agachamento e desenvolvimento',
      'Não descer completamente no agachamento',
      'Usar carga excessiva',
      'Não manter core estável'
    ],
    variations: [
      { level: 'iniciante', name: 'Thruster com Peso Corporal', description: 'Sem peso adicional' },
      { level: 'intermediario', name: 'Thruster Halteres', description: 'Com halteres leves' },
      { level: 'avancado', name: 'Thruster Pesado', description: 'Com carga desafiadora' }
    ],
    sets: 3,
    reps: '8-15',
    restTime: 90,
    calories: 14,
    tips: [
      'Movimento deve ser fluido e contínuo',
      'Use impulso das pernas para ajudar os ombros',
      'Mantenha joelhos alinhados'
    ]
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'funcional',
    muscleGroup: ['core', 'ombros', 'pernas'],
    equipment: [],
    level: 'intermediario',
    location: 'qualquer',
    objective: ['cardio', 'resistencia', 'agilidade'],
    videoUrl: 'https://example.com/mountain-climber.mp4',
    duration: 20,
    instructions: [
      'Inicie em posição de prancha',
      'Traga joelho direito em direção ao peito',
      'Retorne e repita com joelho esquerdo',
      'Alterne rapidamente mantendo forma'
    ],
    breathing: 'Respiração rápida e ritmada',
    commonMistakes: [
      'Elevar muito o quadril',
      'Não manter mãos fixas no chão',
      'Movimento muito lento',
      'Não manter core contraído'
    ],
    variations: [
      { level: 'iniciante', name: 'Mountain Climber Lento', description: 'Movimento controlado' },
      { level: 'intermediario', name: 'Mountain Climber Rápido', description: 'Ritmo acelerado' },
      { level: 'avancado', name: 'Mountain Climber Cross', description: 'Joelhos cruzados' }
    ],
    sets: 3,
    reps: '20-30',
    restTime: 45,
    calories: 10,
    tips: [
      'Mantenha ombros sobre as mãos',
      'Core sempre contraído',
      'Comece devagar e acelere gradualmente'
    ]
  },
  {
    id: 'turkish-getup',
    name: 'Turkish Get-Up',
    category: 'funcional',
    muscleGroup: ['corpo-todo'],
    equipment: ['kettlebell'],
    level: 'avancado',
    location: 'academia',
    objective: ['estabilidade', 'mobilidade', 'forca'],
    videoUrl: 'https://example.com/turkish-getup.mp4',
    duration: 45,
    instructions: [
      'Deite com kettlebell estendido acima do peito',
      'Role para o lado e apoie no cotovelo',
      'Sente e depois fique em pé',
      'Retorne pela mesma sequência'
    ],
    breathing: 'Respiração controlada em cada fase',
    commonMistakes: [
      'Tirar olhos do kettlebell',
      'Fazer movimento muito rápido',
      'Não estabilizar em cada posição',
      'Usar carga excessiva'
    ],
    variations: [
      { level: 'iniciante', name: 'Get-Up sem Peso', description: 'Apenas movimento corporal' },
      { level: 'intermediario', name: 'Get-Up com Halter', description: 'Halter leve' },
      { level: 'avancado', name: 'Turkish Get-Up', description: 'Com kettlebell' }
    ],
    sets: 2,
    reps: '3-5 cada lado',
    restTime: 120,
    calories: 8,
    tips: [
      'Aprenda movimento sem peso primeiro',
      'Mantenha braço sempre estendido',
      'Cada fase deve ser estável antes de continuar'
    ]
  }
];

// 🤸‍♂️ CALISTENIA - Exercícios com Peso Corporal
export const calisthenicsExercises: Exercise[] = [
  {
    id: 'pull-up',
    name: 'Pull-Up (Barra Fixa)',
    category: 'calistenia',
    muscleGroup: ['latissimo', 'biceps', 'romboides'],
    equipment: ['barra-fixa'],
    level: 'avancado',
    location: 'qualquer',
    objective: ['forca', 'hipertrofia'],
    videoUrl: 'https://example.com/pull-up.mp4',
    duration: 20,
    instructions: [
      'Segure barra com pegada pronada, largura dos ombros',
      'Pendure com braços estendidos',
      'Puxe corpo até queixo passar da barra',
      'Desça controladamente até extensão completa'
    ],
    breathing: 'Expire ao subir, inspire ao descer',
    commonMistakes: [
      'Não fazer amplitude completa',
      'Balançar o corpo para ajudar',
      'Não controlar a descida',
      'Cruzar pernas ou flexionar joelhos'
    ],
    variations: [
      { level: 'iniciante', name: 'Negativas', description: 'Apenas fase excêntrica' },
      { level: 'intermediario', name: 'Pull-Up Assistido', description: 'Com elástico ou apoio' },
      { level: 'avancado', name: 'Pull-Up Completo', description: 'Peso corporal completo' }
    ],
    sets: 3,
    reps: '3-12',
    restTime: 120,
    tips: [
      'Desenvolva força gradualmente',
      'Foque na técnica perfeita',
      'Use pegadas diferentes para variar'
    ]
  },
  {
    id: 'dips',
    name: 'Dips (Paralelas)',
    category: 'calistenia',
    muscleGroup: ['triceps', 'peito', 'ombros'],
    equipment: ['paralelas'],
    level: 'intermediario',
    location: 'academia',
    objective: ['forca', 'hipertrofia'],
    videoUrl: 'https://example.com/dips.mp4',
    duration: 25,
    instructions: [
      'Apoie nas paralelas com braços estendidos',
      'Desça flexionando cotovelos até 90°',
      'Empurre para cima até extensão completa',
      'Mantenha corpo ligeiramente inclinado à frente'
    ],
    breathing: 'Inspire na descida, expire na subida',
    commonMistakes: [
      'Descer além de 90° sem flexibilidade',
      'Inclinar muito o tronco',
      'Não manter ombros estáveis',
      'Fazer movimento muito rápido'
    ],
    variations: [
      { level: 'iniciante', name: 'Dips Assistido', description: 'Com apoio dos pés' },
      { level: 'intermediario', name: 'Dips Completo', description: 'Peso corporal' },
      { level: 'avancado', name: 'Dips com Peso', description: 'Carga adicional' }
    ],
    sets: 3,
    reps: '5-15',
    restTime: 90,
    tips: [
      'Mantenha ombros para baixo',
      'Não tranque completamente cotovelos',
      'Controle total na descida'
    ]
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squat',
    category: 'calistenia',
    muscleGroup: ['quadriceps', 'gluteos', 'core'],
    equipment: [],
    level: 'avancado',
    location: 'qualquer',
    objective: ['forca', 'equilibrio', 'mobilidade'],
    videoUrl: 'https://example.com/pistol-squat.mp4',
    duration: 30,
    instructions: [
      'Fique em pé numa perna só',
      'Estenda outra perna à frente',
      'Agache numa perna até máximo possível',
      'Suba controladamente'
    ],
    breathing: 'Inspire na descida, expire na subida',
    commonMistakes: [
      'Não manter perna estendida à frente',
      'Perder equilíbrio por falta de mobilidade',
      'Não descer completamente',
      'Usar impulso para subir'
    ],
    variations: [
      { level: 'iniciante', name: 'Agachamento Búlgaro', description: 'Pé traseiro apoiado' },
      { level: 'intermediario', name: 'Pistol Assistido', description: 'Com apoio das mãos' },
      { level: 'avancado', name: 'Pistol Squat', description: 'Versão completa' }
    ],
    sets: 3,
    reps: '3-8 cada perna',
    restTime: 90,
    tips: [
      'Desenvolva mobilidade de tornozelo primeiro',
      'Pratique equilíbrio numa perna',
      'Use progressões para chegar ao movimento completo'
    ]
  },
  {
    id: 'handstand-pushup',
    name: 'Handstand Push-Up',
    category: 'calistenia',
    muscleGroup: ['ombros', 'triceps', 'core'],
    equipment: [],
    level: 'avancado',
    location: 'qualquer',
    objective: ['forca', 'equilibrio'],
    videoUrl: 'https://example.com/handstand-pushup.mp4',
    duration: 20,
    instructions: [
      'Posicione em handstand contra parede',
      'Desça cabeça em direção ao chão',
      'Empurre para cima até extensão completa',
      'Mantenha core contraído'
    ],
    breathing: 'Respiração controlada e ritmada',
    commonMistakes: [
      'Não ter força suficiente para handstand',
      'Não manter alinhamento corporal',
      'Amplitude incompleta',
      'Perder equilíbrio'
    ],
    variations: [
      { level: 'iniciante', name: 'Pike Push-Up', description: 'Pés no chão, mãos elevadas' },
      { level: 'intermediario', name: 'Wall Walk', description: 'Caminhada na parede' },
      { level: 'avancado', name: 'Handstand Push-Up', description: 'Versão completa' }
    ],
    sets: 3,
    reps: '2-8',
    restTime: 120,
    tips: [
      'Domine handstand antes de tentar push-ups',
      'Use parede para apoio inicial',
      'Desenvolva força de ombros progressivamente'
    ]
  }
];

// 🧘‍♂️ MOBILIDADE E ALONGAMENTO
export const mobilityExercises: Exercise[] = [
  {
    id: 'alongamento-isquiotibiais',
    name: 'Alongamento de Isquiotibiais',
    category: 'mobilidade',
    muscleGroup: ['isquiotibiais'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['flexibilidade', 'mobilidade'],
    videoUrl: 'https://example.com/alongamento-isquiotibiais.mp4',
    duration: 60,
    instructions: [
      'Sente com uma perna estendida',
      'Flexione tronco à frente mantendo costas retas',
      'Alcance o pé da perna estendida',
      'Mantenha posição por 30-60 segundos'
    ],
    breathing: 'Respiração profunda e relaxada',
    commonMistakes: [
      'Arredondar as costas',
      'Forçar além do confortável',
      'Prender a respiração',
      'Fazer movimento brusco'
    ],
    variations: [
      { level: 'iniciante', name: 'Alongamento Sentado', description: 'Versão básica' },
      { level: 'intermediario', name: 'Alongamento em Pé', description: 'Pé apoiado elevado' },
      { level: 'avancado', name: 'Alongamento Dinâmico', description: 'Com movimento' }
    ],
    sets: 2,
    reps: '30-60s cada perna',
    restTime: 15,
    tips: [
      'Nunca force além do desconforto leve',
      'Respire profundamente durante alongamento',
      'Seja consistente para ver resultados'
    ]
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow (Gato-Vaca)',
    category: 'mobilidade',
    muscleGroup: ['coluna', 'core'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['mobilidade', 'flexibilidade'],
    videoUrl: 'https://example.com/cat-cow.mp4',
    duration: 45,
    instructions: [
      'Posicione em quatro apoios',
      'Arqueie coluna olhando para cima (vaca)',
      'Arredonde coluna olhando para baixo (gato)',
      'Alterne movimentos fluidamente'
    ],
    breathing: 'Inspire na extensão, expire na flexão',
    commonMistakes: [
      'Fazer movimento muito rápido',
      'Não usar amplitude completa',
      'Não coordenar respiração',
      'Apoiar peso nos punhos'
    ],
    variations: [
      { level: 'iniciante', name: 'Cat-Cow Básico', description: 'Movimento lento' },
      { level: 'intermediario', name: 'Cat-Cow Ritmado', description: 'Movimento fluido' },
      { level: 'avancado', name: 'Cat-Cow com Extensão', description: 'Braço/perna opostos' }
    ],
    sets: 2,
    reps: '10-15',
    restTime: 30,
    tips: [
      'Movimento deve ser suave e controlado',
      'Sinta alongamento em toda coluna',
      'Ótimo para aquecimento ou relaxamento'
    ]
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Alongamento de Flexores do Quadril',
    category: 'mobilidade',
    muscleGroup: ['flexores-quadril', 'psoas'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['mobilidade', 'postura'],
    videoUrl: 'https://example.com/hip-flexor-stretch.mp4',
    duration: 60,
    instructions: [
      'Posicione numa estocada baixa',
      'Joelho traseiro no chão',
      'Empurre quadril à frente',
      'Mantenha tronco ereto'
    ],
    breathing: 'Respiração profunda e constante',
    commonMistakes: [
      'Inclinar tronco à frente',
      'Não empurrar quadril suficientemente',
      'Apoiar peso no joelho traseiro',
      'Tensionar ombros'
    ],
    variations: [
      { level: 'iniciante', name: 'Estocada Básica', description: 'Mãos no joelho da frente' },
      { level: 'intermediario', name: 'Estocada com Elevação', description: 'Braços para cima' },
      { level: 'avancado', name: 'Estocada com Rotação', description: 'Rotação de tronco' }
    ],
    sets: 2,
    reps: '30-60s cada lado',
    restTime: 15,
    tips: [
      'Essencial para quem fica muito sentado',
      'Sinta alongamento na frente do quadril',
      'Mantenha core ativado'
    ]
  },
  {
    id: 'shoulder-rolls',
    name: 'Rotação de Ombros',
    category: 'mobilidade',
    muscleGroup: ['ombros', 'trapezio'],
    equipment: [],
    level: 'iniciante',
    location: 'qualquer',
    objective: ['mobilidade', 'relaxamento'],
    videoUrl: 'https://example.com/shoulder-rolls.mp4',
    duration: 30,
    instructions: [
      'Fique em pé com braços relaxados',
      'Eleve ombros em direção às orelhas',
      'Role para trás fazendo círculos',
      'Repita movimento para frente'
    ],
    breathing: 'Respiração natural e relaxada',
    commonMistakes: [
      'Fazer movimento muito rápido',
      'Tensionar pescoço',
      'Não fazer amplitude completa',
      'Esquecer de fazer nos dois sentidos'
    ],
    variations: [
      { level: 'iniciante', name: 'Rotação Simples', description: 'Movimento básico' },
      { level: 'intermediario', name: 'Rotação Alternada', description: 'Um ombro por vez' },
      { level: 'avancado', name: 'Rotação com Resistência', description: 'Com elástico' }
    ],
    sets: 2,
    reps: '10 cada direção',
    restTime: 15,
    tips: [
      'Ótimo para aliviar tensão',
      'Pode fazer várias vezes ao dia',
      'Especialmente útil para trabalho de escritório'
    ]
  }
];

// 📋 PLANOS DE TREINO PRÉ-DEFINIDOS
export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'iniciante-full-body',
    name: 'Full Body Iniciante',
    type: 'full-body',
    level: 'iniciante',
    duration: 45,
    exercises: [
      { exerciseId: 'flexao-tradicional', sets: 3, reps: '8-12', restTime: 60 },
      { exerciseId: 'agachamento-livre', sets: 3, reps: '12-15', restTime: 60 },
      { exerciseId: 'puxada-frente', sets: 3, reps: '10-12', restTime: 75 },
      { exerciseId: 'desenvolvimento-ombros', sets: 3, reps: '10-12', restTime: 60 },
      { exerciseId: 'prancha', sets: 3, reps: '30-45s', restTime: 45 }
    ]
  },
  {
    id: 'intermediario-abc',
    name: 'ABC Intermediário',
    type: 'ABC',
    level: 'intermediario',
    duration: 60,
    exercises: [
      // Treino A - Peito, Ombros, Tríceps
      { exerciseId: 'supino-reto-barra', sets: 4, reps: '8-10', restTime: 90 },
      { exerciseId: 'supino-inclinado-halter', sets: 3, reps: '10-12', restTime: 75 },
      { exerciseId: 'desenvolvimento-ombros', sets: 4, reps: '10-12', restTime: 75 },
      { exerciseId: 'elevacao-lateral', sets: 3, reps: '12-15', restTime: 45 },
      { exerciseId: 'triceps-testa', sets: 3, reps: '12-15', restTime: 60 }
    ]
  },
  {
    id: 'avancado-push-pull-legs',
    name: 'Push/Pull/Legs Avançado',
    type: 'push-pull-legs',
    level: 'avancado',
    duration: 75,
    exercises: [
      // Push Day
      { exerciseId: 'supino-reto-barra', sets: 5, reps: '6-8', restTime: 120 },
      { exerciseId: 'supino-inclinado-halter', sets: 4, reps: '8-10', restTime: 90 },
      { exerciseId: 'desenvolvimento-ombros', sets: 4, reps: '8-10', restTime: 90 },
      { exerciseId: 'elevacao-lateral', sets: 4, reps: '12-15', restTime: 60 },
      { exerciseId: 'triceps-testa', sets: 4, reps: '10-12', restTime: 75 }
    ]
  }
];

// 🎯 FILTROS E CATEGORIAS
export const categories = {
  modalidades: ['musculacao', 'cardio', 'funcional', 'calistenia', 'mobilidade'],
  gruposMusculares: [
    'peito', 'costas', 'ombros', 'biceps', 'triceps', 
    'quadriceps', 'isquiotibiais', 'gluteos', 'panturrilhas',
    'core', 'reto-abdominal', 'obliquos'
  ],
  equipamentos: [
    'barra', 'halteres', 'anilhas', 'banco', 'polia-alta', 'polia-baixa',
    'kettlebell', 'medicine-ball', 'elastico', 'bola-suica', 'step',
    'esteira', 'bike-ergometrica', 'eliptico', 'remo', 'corda',
    'barra-fixa', 'paralelas', 'aneis', 'trx'
  ],
  niveis: ['iniciante', 'intermediario', 'avancado'],
  locais: ['academia', 'casa', 'ao-ar-livre', 'qualquer'],
  objetivos: [
    'hipertrofia', 'forca', 'resistencia', 'emagrecimento', 
    'definicao', 'funcional', 'flexibilidade', 'mobilidade',
    'coordenacao', 'agilidade', 'equilibrio', 'postura'
  ]
};

// 🔄 SISTEMA DE SUBSTITUIÇÕES INTELIGENTES
export const exerciseSubstitutions = {
  // Se não tem equipamento específico
  'supino-reto-barra': ['flexao-tradicional', 'supino-inclinado-halter'],
  'puxada-frente': ['pull-up', 'remada-curvada-barra'],
  'agachamento-livre': ['leg-press', 'agachamento-goblet'],
  'desenvolvimento-ombros': ['elevacao-lateral', 'desenvolvimento-arnold'],
  
  // Por nível de dificuldade
  'pull-up': ['puxada-frente', 'remada-curvada-barra'], // mais fácil
  'pistol-squat': ['agachamento-livre', 'leg-press'], // mais fácil
  'handstand-pushup': ['desenvolvimento-ombros', 'pike-pushup'] // mais fácil
};

// 💡 DICAS DO COACH
export const coachTips = {
  iniciante: [
    'Foque na técnica perfeita antes de aumentar carga',
    'Descanse adequadamente entre treinos',
    'Hidrate-se bem durante exercícios',
    'Comece com cargas leves e progrida gradualmente'
  ],
  intermediario: [
    'Varie exercícios para evitar adaptação',
    'Implemente técnicas avançadas ocasionalmente',
    'Monitore sua recuperação entre treinos',
    'Mantenha diário de treinos para acompanhar progresso'
  ],
  avancado: [
    'Use técnicas de intensificação com moderação',
    'Periodize seus treinos para evitar overtraining',
    'Foque em pontos fracos específicos',
    'Considere trabalhar com profissional para otimizar resultados'
  ]
};

// 📊 MÉTRICAS E ACOMPANHAMENTO
export interface WorkoutMetrics {
  exerciseId: string;
  date: string;
  sets: number;
  reps: number[];
  weight: number[];
  restTime: number[];
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = muito fácil, 5 = muito difícil
  notes?: string;
}

// 🎥 URLs DE VÍDEOS (Placeholder - substituir por URLs reais)
export const videoPlaceholders = {
  baseUrl: 'https://example.com/exercise-videos/',
  thumbnailUrl: 'https://example.com/exercise-thumbnails/',
  duration: '10-30s cada vídeo'
};

// 🔍 FUNÇÃO DE BUSCA E FILTROS
export function searchExercises(
  query: string,
  filters: {
    category?: string;
    muscleGroup?: string;
    equipment?: string[];
    level?: string;
    location?: string;
    objective?: string;
  } = {}
): Exercise[] {
  const allExercises = [
    ...musculationExercises,
    ...cardioExercises,
    ...functionalExercises,
    ...calisthenicsExercises,
    ...mobilityExercises
  ];

  return allExercises.filter(exercise => {
    // Filtro por texto
    const matchesQuery = !query || 
      exercise.name.toLowerCase().includes(query.toLowerCase()) ||
      exercise.muscleGroup.some(muscle => 
        muscle.toLowerCase().includes(query.toLowerCase())
      );

    // Filtros específicos
    const matchesCategory = !filters.category || exercise.category === filters.category;
    const matchesMuscleGroup = !filters.muscleGroup || 
      exercise.muscleGroup.includes(filters.muscleGroup);
    const matchesEquipment = !filters.equipment?.length || 
      filters.equipment.some(eq => exercise.equipment.includes(eq));
    const matchesLevel = !filters.level || exercise.level === filters.level;
    const matchesLocation = !filters.location || 
      exercise.location === filters.location || exercise.location === 'qualquer';
    const matchesObjective = !filters.objective || 
      exercise.objective.includes(filters.objective);

    return matchesQuery && matchesCategory && matchesMuscleGroup && 
           matchesEquipment && matchesLevel && matchesLocation && matchesObjective;
  });
}

// 🎯 FUNÇÃO PARA SUGERIR EXERCÍCIOS ALTERNATIVOS
export function suggestAlternatives(exerciseId: string, reason: 'equipment' | 'difficulty' | 'variety'): Exercise[] {
  const alternatives = exerciseSubstitutions[exerciseId] || [];
  const allExercises = [
    ...musculationExercises,
    ...cardioExercises,
    ...functionalExercises,
    ...calisthenicsExercises,
    ...mobilityExercises
  ];

  return alternatives
    .map(altId => allExercises.find(ex => ex.id === altId))
    .filter(Boolean) as Exercise[];
}

// 📈 FUNÇÃO PARA GERAR TREINO PERSONALIZADO
export function generateCustomWorkout(
  preferences: {
    level: 'iniciante' | 'intermediario' | 'avancado';
    duration: number; // em minutos
    muscleGroups: string[];
    equipment: string[];
    location: string;
    objective: string;
  }
): WorkoutPlan {
  const availableExercises = searchExercises('', {
    level: preferences.level,
    equipment: preferences.equipment,
    location: preferences.location,
    objective: preferences.objective
  });

  // Selecionar exercícios baseado nos grupos musculares desejados
  const selectedExercises = preferences.muscleGroups.flatMap(muscleGroup => {
    const exercisesForMuscle = availableExercises.filter(ex => 
      ex.muscleGroup.includes(muscleGroup)
    );
    return exercisesForMuscle.slice(0, 2); // Máximo 2 exercícios por grupo muscular
  });

  // Calcular sets e reps baseado no nível
  const getSetsReps = (level: string) => {
    switch (level) {
      case 'iniciante': return { sets: 3, reps: '12-15', restTime: 60 };
      case 'intermediario': return { sets: 4, reps: '8-12', restTime: 75 };
      case 'avancado': return { sets: 4, reps: '6-10', restTime: 90 };
      default: return { sets: 3, reps: '10-12', restTime: 60 };
    }
  };

  const defaultSetsReps = getSetsReps(preferences.level);

  return {
    id: `custom-${Date.now()}`,
    name: `Treino Personalizado ${preferences.level}`,
    type: 'full-body',
    level: preferences.level,
    duration: preferences.duration,
    exercises: selectedExercises.map(ex => ({
      exerciseId: ex.id,
      sets: ex.sets || defaultSetsReps.sets,
      reps: ex.reps || defaultSetsReps.reps,
      restTime: ex.restTime || defaultSetsReps.restTime
    }))
  };
}

export default {
  musculationExercises,
  cardioExercises,
  functionalExercises,
  calisthenicsExercises,
  mobilityExercises,
  workoutPlans,
  categories,
  exerciseSubstitutions,
  coachTips,
  searchExercises,
  suggestAlternatives,
  generateCustomWorkout
};