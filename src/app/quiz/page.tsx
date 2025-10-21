'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Scale, Target, Dumbbell, Heart, Utensils, Droplets, Trophy, Activity, User, Zap, Star, CheckCircle, BarChart3, TrendingUp, Clock, MapPin, Home, Building, Trees, Beef, Apple, Carrot, Wheat, Egg, Fish, Pill, Award, UserCheck, Mail, Cake } from 'lucide-react';

const questions = [
  {
    id: 'age',
    question: 'Qual é a sua idade?',
    type: 'single',
    options: ['18-29', '30-39', '40-49', '50+'],
    icon: <User className="w-6 h-6" />,
    showTerms: true
  },
  {
    id: 'bodyType',
    question: 'Escolha o seu tipo de corpo',
    type: 'single',
    options: ['Magro', 'Médio', 'Pesado'],
    icon: <Scale className="w-6 h-6" />
  },
  {
    id: 'goal',
    question: 'Escolha seu objetivo',
    type: 'single',
    options: ['Perder peso', 'Ganhar Massa Muscular', 'Ficar Musculoso'],
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'desiredBody',
    question: 'Escolha o corpo que você deseja',
    type: 'single',
    options: ['Corpo esbelto', 'Corpo esbelto e musculoso'],
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: 'bodyFat',
    question: 'Escolha o seu nível de gordura corporal',
    subtitle: 'Escala para escolher o índice corporal',
    type: 'body-fat-slider',
    min: 5,
    max: 35,
    icon: <Scale className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'problemAreas',
    question: 'Selecione as áreas problemáticas',
    type: 'multiple',
    options: ['Peito fraco', 'Braços magros', 'Barriga de cerveja', 'Pernas magras'],
    icon: <Target className="w-6 h-6" />,
    webhook: {
      title: '81% dos seus resultados são sobre nutrição',
      content: 'Para obter os maiores ganhos em massa muscular e força, você precisa:\n• Total de calorias suficientes a cada dia.\n• Proteína adequada para realmente reconstruir mais tecido muscular.',
      animated: true
    }
  },
  {
    id: 'diet',
    question: 'Você segue alguma dessas dietas?',
    type: 'single',
    options: [
      'Vegetariano 🍆\nExclui carne',
      'Vegano 🥕\nExclui todos os produtos de origem animal',
      'Cetogênica 🥑\nBaixo teor de carboidratos e alto teor de gordura',
      'Mediterrâneo 🌾\nRico em alimentos à base de plantas',
      'Nenhuma das anteriores ❌'
    ],
    icon: <Utensils className="w-6 h-6" />
  },
  {
    id: 'sugar',
    question: 'Com que frequência você come ou bebe alimentos ou bebidas açucaradas?',
    type: 'single',
    options: [
      'Não com frequência. Não sou grande fã de doces 😎',
      '3-5 vezes por semana 🍪',
      'Praticamente todos os dias 🤤'
    ],
    icon: <Utensils className="w-6 h-6" />
  },
  {
    id: 'water',
    question: 'Quanta água você bebe diariamente?',
    type: 'single',
    options: [
      'Só café ou chá ☕️',
      'Menos de 2 copos 💧\naté 0,5 l / 17 onças',
      '2-6 copos 💧💧\n0,5-1,5 l / 17-50 onças',
      '7-10 copos 💧💧💧\n1,5-2,5 l / 50-85 onças',
      'Mais de 10 copos 🐳\nmais de 2,5 l / 85 onças'
    ],
    icon: <Droplets className="w-6 h-6" />,
    webhook: {
      title: 'Uau! Impressionante!',
      content: 'Você bebe mais água do que 92% dos usuários*. Continue assim!',
      small: true
    }
  },
  {
    id: 'height',
    question: 'Qual é a sua altura?',
    type: 'input',
    inputType: 'number',
    placeholder: 'Digite sua altura em cm',
    icon: <Scale className="w-6 h-6" />,
    gamified: true
  },
  {
    id: 'weight',
    question: 'Qual é o seu peso atual e alvo?',
    type: 'dual-input',
    inputs: [
      { key: 'current', placeholder: 'Peso atual (kg)', type: 'number' },
      { key: 'target', placeholder: 'Peso desejado (kg)', type: 'number' }
    ],
    icon: <Scale className="w-6 h-6" />,
    gamified: true
  },
  {
    id: 'motivation',
    question: 'Ter algo pelo qual ansiar pode ser um grande motivador para atingir sua meta',
    type: 'single',
    options: [
      'Férias ✈️',
      'Férias 🏝',
      'Aniversário 🎂',
      'Evento em família 👨‍👩‍👦',
      'Dados importantes 📆',
      'Reunião 🎉',
      'Casamento 🥂',
      'Competição 🏆',
      'Esportes radicais 🧗‍♀️',
      'Outro 🌟',
      'Nenhum evento especial em breve'
    ],
    icon: <Trophy className="w-6 h-6" />
  },
  {
    id: 'eventDate',
    question: 'Quando será o seu evento?',
    subtitle: 'Vamos manter este evento importante em mente para sua jornada',
    type: 'date',
    skipOption: true,
    icon: <Calendar className="w-6 h-6" />,
    gamified: true,
    webhook: {
      title: 'O último plano que você precisa para finalmente entrar em forma',
      content: 'Com base em nossos cálculos, você atingirá seu peso ideal de 80 kg 🎉 até\n11 de dez. de 2025',
      subtitle: 'baseado na resposta do quiz da pergunta anterior',
      illustration: true
    }
  },
  {
    id: 'fitnessLevel',
    question: 'Qual é o seu nível de condicionamento físico?',
    subtitle: 'Escolha seu nível atual de condicionamento físico para treino o plano de treino.',
    type: 'fitness-level-graph',
    min: 1,
    max: 10,
    levels: [
      { level: 1, category: 'Recém chegado', description: 'Sempre que eu sento no chão, é difícil me levantar.' },
      { level: 2, category: 'Recém chegado', description: 'Depois de subir ou descer várias escadas, preciso recuperar a respiração.' },
      { level: 3, category: 'Recém chegado', description: 'Posso fazer caminhadas como cardio, mas correr é difícil.' },
      { level: 4, category: 'Recém chegado', description: 'Eu me exercito algumas vezes por ano, o suficiente para suar.' },
      { level: 5, category: 'Amador', description: 'Tento me exercitar uma vez por semana, mas ainda não é regular' },
      { level: 6, category: 'Amador', description: 'Comecei a treinar pelo menos uma vez por semana regularmente' },
      { level: 7, category: 'Amador', description: 'Eu me exercito duas vezes por semana, pelo menos, nos últimos 3 meses.' },
      { level: 8, category: 'Pró', description: 'Tenho compromisso com o condicionamento físico e treino sempre que posso.' },
      { level: 9, category: 'Pro', description: 'Ah, confie em mim. Estou em ótima forma, mas ainda quero ir um nível acima.' },
      { level: 10, category: 'Pro', description: 'Estou pegando fogo! Estou na melhor forma da minha vida.' }
    ],
    icon: <Activity className="w-6 h-6" />,
    gamified: true
  },
  {
    id: 'exerciseBar',
    question: 'Gosto ou não gosto',
    subtitle: 'Exercício barra para costas',
    type: 'like-dislike',
    exerciseType: 'Barra',
    icon: <Dumbbell className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'exerciseSquat',
    question: 'Gosto ou não gosto',
    subtitle: 'Agachamento com halteres',
    type: 'like-dislike',
    exerciseType: 'Agachamento',
    icon: <Dumbbell className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'exercisePushup',
    question: 'Gosto ou não gosto',
    subtitle: 'Flexão para peito',
    type: 'like-dislike',
    exerciseType: 'Flexão',
    icon: <Dumbbell className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'exerciseDips',
    question: 'Gosto ou não gosto',
    subtitle: 'Mergulho na barra paralela',
    type: 'like-dislike',
    exerciseType: 'Mergulho',
    icon: <Dumbbell className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'exerciseCardio',
    question: 'Gosto ou não gosto',
    subtitle: 'Cardio',
    type: 'like-dislike',
    exerciseType: 'Corrida',
    icon: <Heart className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'sportsInterest',
    question: 'Quais são os esportes de seu interesse?',
    type: 'multiple',
    options: [
      'Treinos de Academia',
      'Treinos em casa',
      'Corrida',
      'Calistenia',
      'Funcional',
      'Treino funcional',
      'Nenhuma das opções acima'
    ],
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: 'fitnessProblems',
    question: 'Você tem algum desses problemas em seus exercícios anteriores de condicionamento físico?',
    type: 'multiple',
    options: [
      'Falta de motivação',
      'Tentei várias vezes, mas não senti nenhum progresso',
      'Senti-me inseguro na academia',
      'Não tinha um plano claro',
      'Meus treinos eram muito duros',
      'Treinamento Mau',
      'Nenhuma das acima'
    ],
    icon: <Target className="w-6 h-6" />,
    webhook: {
      title: 'Obrigado por compartilhar!',
      content: 'Aprendemos que muitas pessoas enfrentaram os mesmos contratempos. A FitMind Body tem um plano de exercícios claro e fácil de seguir. Além disso, o programa o ajudará a se motivar durante essa jornada.',
      small: true
    },
    progressWebhook: {
      title: 'Pare de adivinhar por onde começar',
      subtitle: '85% concluído',
      content: 'A FitMind Body, usando tecnologia de IA, analisa sua idade, tipo de corpo, dietas e metas. Você não precisa gastar muito dinheiro para descobrir o que funciona.',
      question: 'Gostaria de adicionar um treinador de IA ao seu programa?',
      options: ['Sim', 'Não']
    }
  },
  // CONTINUAÇÃO DO QUIZ - NOVAS PERGUNTAS
  {
    id: 'additionalGoals',
    question: 'Marque seus objetivos adicionais abaixo:',
    type: 'multiple',
    options: [
      'Melhorar o sono',
      'Criar um hábito físico',
      'Autodisciplina',
      'Reduzir o estresse',
      'Nenhuma das opções acima'
    ],
    icon: <Target className="w-6 h-6" />,
    webhook: {
      title: '93% dos nossos usuários consideram o coach de IA útil para atingir suas metas',
      content: 'Usar o treinador de IA foi muito fácil! Simplifiquei minha rotina de exercícios e os resultados falam por si. Altamente recomendado!',
      testimonial: true,
      animated: true
    },
    midwayWebhook: {
      title: 'No meio do caminho!',
      subtitle: 'Por que as pessoas desistem dos exercícios?',
      content: 'A razão #1 é começar grande demais rápido demais\nVocê conseguirá muito mais do que apenas algumas semanas de exercício.\nNão prometemos resultados rápidos. O principal objetivo do nosso programa é mudar seu estilo de vida para melhor.',
      animated: true
    }
  },
  {
    id: 'healthConditions',
    question: 'Aviso Médico',
    subtitle: 'Se você tiver alguma das seguintes condições:\n• Doença cardíaca\n• Túmulo de Escoliose\n• Lesões na coluna vertebral\n• Tumor benigno ou maligno\n• Hipertensão\n\nEntre em contato com seu médico antes de começar a seguir o programa FitMind Body.',
    type: 'acknowledgment',
    icon: <Heart className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'pushups',
    question: 'Quantas flexões você consegue fazer em uma rodada?',
    type: 'single',
    options: [
      'Menos de 10 💪',
      '10 a 20 💪💪',
      '21 a 30 💪💪💪',
      'Mais de 30 😤'
    ],
    icon: <Dumbbell className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'pullups',
    question: 'Quantos pull-ups você consegue fazer em uma rodada?',
    type: 'single',
    options: [
      'Não consigo fazer um único pull-up',
      'Menos de 5 🔥',
      '5 a 10 🔥🔥',
      'Mais de 10 🔥🔥🔥'
    ],
    icon: <Dumbbell className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'workoutLocation',
    question: 'Escolha o local para seus treinos',
    type: 'single',
    options: [
      'Casa 🏠',
      'Academia 🏋️',
      'Ar livre 🌳'
    ],
    icon: <MapPin className="w-6 h-6" />,
    animated: true
  },
  {
    id: 'trainingFrequency',
    question: 'Quantas vezes por semana você treinou nos últimos 3 meses?',
    type: 'single',
    options: [
      'Nenhuma 😔',
      'Não treinei, mas vou treinar depois de reivindicar meu programa de exercícios!',
      '1-2 vezes por semana 💪',
      '3 vezes por semana 💪⚡️',
      'Mais de 3 vezes por semana 🏆'
    ],
    icon: <Calendar className="w-6 h-6" />,
    webhook: {
      title: 'Você treinou mais de 82% dos usuários*',
      content: 'Será mais fácil para você manter um plano de treino.',
      small: true,
      gamified: true
    }
  },
  {
    id: 'workoutDuration',
    question: 'Quanto tempo você está disposto a gastar em um treino?',
    type: 'single',
    options: [
      '30 minutos ⏰',
      '45 minutos ⏰',
      '1 hora 🕐',
      'Deixe FitMind Body decidir'
    ],
    icon: <Clock className="w-6 h-6" />,
    hormonesWebhook: {
      title: 'Equilíbrio Hormonal',
      content: 'Nosso plano de exercícios foi criado para garantir uma relação equilibrada entre testosterona e cortisol.\n\nTanto os níveis de cortisol quanto os de testosterona aumentem linearmente em resposta ao exercício físico.\n\nNo entanto, é de vital importância considerá-los atingir um limite específico de intensidade de exercício.\n\nCaso contrário, os fatores de estresse físico podem resultar em sobrecarga excessiva de cortisol, ou que diminua a produção de testosterona.',
      chart: true,
      animated: true
    }
  },
  {
    id: 'mealPrepTime',
    question: 'Quanto tempo você está disposto a gastar por preparação de refeição?',
    type: 'single',
    options: [
      'Menos de 30 minutos 🥑',
      '30-60 minutos 🥑🥑',
      'Mais de 1 hora 🥑🥑🥑',
      'Prefiro pedir refeições ou sair para comer fora 📦'
    ],
    icon: <Utensils className="w-6 h-6" />
  },
  {
    id: 'mealPlan',
    question: 'Vamos criar um plano alimentar com base nas suas preferências',
    subtitle: 'Você sempre pode ajustar o plano de refeições posteriormente',
    type: 'food-selection',
    categories: [
      {
        name: 'Leguminosas',
        items: ['Brócolis', 'Couve-flor', 'Cebola', 'Pimentão', 'Berinjela', 'Repolho', 'Aspargos', 'Espinafre', 'Pepino', 'Tomate']
      },
      {
        name: 'Cereais',
        items: ['Arroz', 'Quinoa', 'Cuscuz', 'Trigo-sarraceno', 'Sêmola de painço', 'Amaranto', 'Sêmola', 'Farinha de milho', 'Triguilho']
      },
      {
        name: 'Ingredientes',
        items: ['Abacate', 'Feijão', 'Ovos', 'Cogumelos', 'Queijo', 'Leite', 'Tofu', 'Húmus', 'Leite vegetal', 'Proteína em pó', 'Proteína vegana em pó']
      },
      {
        name: 'Carne e Peixe (Opcional)',
        items: ['Peru', 'Carne Bovina', 'Frango', 'Marisco', 'Carne de porco', 'Peixe']
      },
      {
        name: 'Frutas e Bagas (Opcional)',
        items: ['Citrinos', 'Maçã', 'Pera', 'Kiwi', 'Bananas', 'Caqui', 'Pêssego', 'Bagas', 'Uvas', 'Romã', 'Frutas tropicais (abacaxi, manga, mamão, pitahaya)']
      }
    ],
    icon: <Utensils className="w-6 h-6" />,
    macronutrientsWebhook: {
      title: 'Perca peso e ganhe músculos ao mesmo tempo',
      content: 'Aprenda como melhorar sua nutrição e ingestão de suplementos para obter resultados máximos.',
      question: 'Deseja obter um guia para suplementos?',
      options: ['Sim', 'Não'],
      macros: ['Carboidratos', 'Gorduras', 'Proteínas'],
      animated: true
    }
  },
  {
    id: 'challenges',
    question: 'Além do seu objetivo, qual desafio você gostaria de participar?',
    type: 'single',
    options: [
      'Caminhada!\nCaminhe 10.000 passos por 7 dias seguidos.',
      'Monstro Burpee\nFaça 25 burpees por 10 dias seguidos.',
      '21 dias sem açúcar\nCorte todo o açúcar orgânico por 21 dias.',
      'Aceitarei todos os desafios! 🙌',
      'Nenhuma das anteriores ❌'
    ],
    icon: <Trophy className="w-6 h-6" />,
    webhook: {
      title: '91% dos nossos usuários afirmaram que o guia de suplementos ajudou a aumentar a massa muscular',
      content: 'O guia de complementos mudou o jogo! Tem sido fundamental para me ajudar a construir massa muscular. Graças a este programa, obtive ganhos significativos e não pude estar mais satisfeito!',
      testimonial: true
    }
  },
  {
    id: 'accountCreation',
    question: 'Vamos criar sua conta FitMind Body',
    subtitle: 'Seu plano de treino personalizado está pronto!',
    type: 'account-form',
    fields: [
      { key: 'name', placeholder: 'Como devemos chamá-lo?', type: 'text', icon: <User className="w-5 h-5" /> },
      { key: 'birthDate', placeholder: 'Qual é a sua data de nascimento?', type: 'date', icon: <Cake className="w-5 h-5" /> },
      { key: 'email', placeholder: 'E-mail', type: 'email', icon: <Mail className="w-5 h-5" /> }
    ],
    icon: <UserCheck className="w-6 h-6" />
  },
  {
    id: 'fitnessAge',
    question: 'Análise do Perfil',
    type: 'fitness-analysis',
    icon: <BarChart3 className="w-6 h-6" />,
    gamified: true
  },
  {
    id: 'commitment',
    question: 'Você está pronto para assumir o compromisso?',
    type: 'single',
    options: [
      'Sim, farei meu primeiro treino amanhã 👌',
      'Sim! Vou fazer meu primeiro treino hoje! 😎',
      'Não estou pronto para assumir o compromisso'
    ],
    icon: <CheckCircle className="w-6 h-6" />,
    showDuringAnalysis: true
  },
  {
    id: 'finalResults',
    question: 'Seus Resultados Personalizados',
    type: 'final-results',
    icon: <TrendingUp className="w-6 h-6" />
  }
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState({});
  const [showWebhook, setShowWebhook] = useState(false);
  const [webhookData, setWebhookData] = useState(null);
  const [showProgressWebhook, setShowProgressWebhook] = useState(false);
  const [progressWebhookData, setProgressWebhookData] = useState(null);
  const [showMidwayWebhook, setShowMidwayWebhook] = useState(false);
  const [midwayWebhookData, setMidwayWebhookData] = useState(null);
  const [showHormonesWebhook, setShowHormonesWebhook] = useState(false);
  const [hormonesWebhookData, setHormonesWebhookData] = useState(null);
  const [showMacronutrientsWebhook, setShowMacronutrientsWebhook] = useState(false);
  const [macronutrientsWebhookData, setMacronutrientsWebhookData] = useState(null);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showCommitmentQuestion, setShowCommitmentQuestion] = useState(false);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(15);
  const router = useRouter();

  useEffect(() => {
    // Carregar progresso salvo
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
      const { step, data } = JSON.parse(savedProgress);
      setCurrentStep(step);
      setQuizData(data);
    }
  }, []);

  const saveProgress = (step, data) => {
    localStorage.setItem('quizProgress', JSON.stringify({ step, data }));
  };

  const getBodyFatDescription = (percentage) => {
    if (percentage <= 8) return 'Extremamente baixo - Atleta de elite';
    if (percentage <= 12) return 'Muito baixo - Atleta';
    if (percentage <= 16) return 'Baixo - Fitness';
    if (percentage <= 20) return 'Saudável - Ativo';
    if (percentage <= 25) return 'Moderado - Média';
    if (percentage <= 30) return 'Alto - Acima da média';
    return 'Muito alto - Requer atenção';
  };

  const getBodyFatColor = (percentage) => {
    if (percentage <= 12) return 'from-green-400 to-emerald-500';
    if (percentage <= 20) return 'from-blue-400 to-cyan-500';
    if (percentage <= 25) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getAvatarStyle = (percentage) => {
    // Simula diferentes níveis de gordura corporal através de estilos visuais
    const opacity = Math.min(percentage / 30, 1);
    const scale = 1 + (percentage / 100);
    
    return {
      transform: `scale(${scale})`,
      filter: `brightness(${1 - opacity * 0.3})`,
    };
  };

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentStep];
    const newData = { ...quizData, [currentQuestion.id]: answer };
    setQuizData(newData);
    
    // Lógica específica para pergunta da água
    if (currentQuestion.id === 'water') {
      const lowWaterOptions = [
        'Só café ou chá ☕️',
        'Menos de 2 copos 💧\naté 0,5 l / 17 onças',
        '2-6 copos 💧💧\n0,5-1,5 l / 17-50 onças'
      ];
      
      const goodWaterOptions = [
        '7-10 copos 💧💧💧\n1,5-2,5 l / 50-85 onças',
        'Mais de 10 copos 🐳\nmais de 2,5 l / 85 onças'
      ];
      
      if (lowWaterOptions.includes(answer)) {
        // Mostrar alerta de pouca água
        setWebhookData({
          title: '⚠️ Atenção!',
          content: 'Você está bebendo pouca água! É importante aumentar sua hidratação para melhores resultados no seu programa de fitness.',
          small: true
        });
        setShowWebhook(true);
        setTimeout(() => {
          setShowWebhook(false);
          handleNext(newData);
        }, 2500);
        return;
      } else if (goodWaterOptions.includes(answer)) {
        // Mostrar mensagem positiva existente
        setWebhookData(currentQuestion.webhook);
        setShowWebhook(true);
        setTimeout(() => {
          setShowWebhook(false);
          handleNext(newData);
        }, 2000);
        return;
      }
    }
    
    // Mostrar webhook se existir
    if (currentQuestion.webhook) {
      setWebhookData(currentQuestion.webhook);
      setShowWebhook(true);
      setTimeout(() => {
        setShowWebhook(false);
        if (currentQuestion.midwayWebhook) {
          setMidwayWebhookData(currentQuestion.midwayWebhook);
          setShowMidwayWebhook(true);
          setTimeout(() => {
            setShowMidwayWebhook(false);
            handleNext(newData);
          }, 4000);
        } else {
          handleNext(newData);
        }
      }, currentQuestion.webhook.small ? 2000 : 3000);
    } else if (currentQuestion.hormonesWebhook) {
      setHormonesWebhookData(currentQuestion.hormonesWebhook);
      setShowHormonesWebhook(true);
      setTimeout(() => {
        setShowHormonesWebhook(false);
        handleNext(newData);
      }, 5000);
    } else {
      handleNext(newData);
    }
  };

  const handleBodyFatSlider = () => {
    const currentQuestion = questions[currentStep];
    const newData = { ...quizData, [currentQuestion.id]: bodyFatPercentage };
    setQuizData(newData);
    handleNext(newData);
  };

  const handleMultipleAnswer = () => {
    const currentQuestion = questions[currentStep];
    const newData = { ...quizData, [currentQuestion.id]: selectedMultiple };
    setQuizData(newData);
    setSelectedMultiple([]);
    
    // Mostrar webhook se existir
    if (currentQuestion.webhook) {
      setWebhookData(currentQuestion.webhook);
      setShowWebhook(true);
      setTimeout(() => {
        setShowWebhook(false);
        if (currentQuestion.progressWebhook) {
          setProgressWebhookData(currentQuestion.progressWebhook);
          setShowProgressWebhook(true);
        } else if (currentQuestion.midwayWebhook) {
          setMidwayWebhookData(currentQuestion.midwayWebhook);
          setShowMidwayWebhook(true);
          setTimeout(() => {
            setShowMidwayWebhook(false);
            handleNext(newData);
          }, 4000);
        } else {
          handleNext(newData);
        }
      }, currentQuestion.webhook.small ? 2000 : 3000);
    } else if (currentQuestion.progressWebhook) {
      setProgressWebhookData(currentQuestion.progressWebhook);
      setShowProgressWebhook(true);
    } else {
      handleNext(newData);
    }
  };

  const handleInputAnswer = () => {
    const currentQuestion = questions[currentStep];
    const newData = { ...quizData, [currentQuestion.id]: inputValues };
    setQuizData(newData);
    setInputValues({});
    
    if (currentQuestion.webhook) {
      setWebhookData(currentQuestion.webhook);
      setShowWebhook(true);
      setTimeout(() => {
        setShowWebhook(false);
        handleNext(newData);
      }, 3000);
    } else {
      handleNext(newData);
    }
  };

  const handleFitnessLevelAnswer = (level) => {
    const currentQuestion = questions[currentStep];
    const selectedLevel = currentQuestion.levels.find(l => l.level === level);
    const newData = { ...quizData, [currentQuestion.id]: { level, ...selectedLevel } };
    setQuizData(newData);
    handleNext(newData);
  };

  const handleLikeDislike = (preference) => {
    const currentQuestion = questions[currentStep];
    const newData = { ...quizData, [currentQuestion.id]: preference };
    setQuizData(newData);
    handleNext(newData);
  };

  const handleProgressWebhookAnswer = (answer) => {
    const newData = { ...quizData, aiTrainer: answer };
    setQuizData(newData);
    setShowProgressWebhook(false);
    handleNext(newData);
  };

  const handleMacronutrientsWebhookAnswer = (answer) => {
    const newData = { ...quizData, supplementGuide: answer };
    setQuizData(newData);
    setShowMacronutrientsWebhook(false);
    handleNext(newData);
  };

  const handleAcknowledgment = () => {
    handleNext();
  };

  const handleFoodSelection = () => {
    const currentQuestion = questions[currentStep];
    const newData = { ...quizData, [currentQuestion.id]: selectedFoods };
    setQuizData(newData);
    setSelectedFoods({});
    
    if (currentQuestion.macronutrientsWebhook) {
      setMacronutrientsWebhookData(currentQuestion.macronutrientsWebhook);
      setShowMacronutrientsWebhook(true);
    } else {
      handleNext(newData);
    }
  };

  const handleFitnessAnalysis = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 40 && !showCommitmentQuestion) {
          setShowCommitmentQuestion(true);
        }
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleNext();
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleCommitmentAnswer = (answer) => {
    const newData = { ...quizData, commitment: answer };
    setQuizData(newData);
    setShowCommitmentQuestion(false);
  };

  const handleNext = (data = quizData) => {
    if (currentStep < questions.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep, data);
    } else {
      // Salvar dados do quiz e redirecionar para dashboard
      localStorage.setItem('userQuizData', JSON.stringify(data));
      localStorage.removeItem('quizProgress');
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const toggleMultipleOption = (option) => {
    setSelectedMultiple(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const toggleFoodItem = (category, item) => {
    setSelectedFoods(prev => ({
      ...prev,
      [category]: prev[category] 
        ? (prev[category].includes(item) 
          ? prev[category].filter(i => i !== item)
          : [...prev[category], item])
        : [item]
    }));
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Webhook de macronutrientes
  if (showMacronutrientsWebhook && macronutrientsWebhookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-pulse">
          <div className="mb-6">
            <div className="flex justify-center space-x-4 mb-6">
              {macronutrientsWebhookData.macros.map((macro, index) => (
                <div key={index} className="w-16 h-16 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                  <span className="text-white font-bold text-xs">{macro}</span>
                </div>
              ))}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{macronutrientsWebhookData.title}</h3>
            <p className="text-gray-600 mb-6">{macronutrientsWebhookData.content}</p>
            <p className="text-lg font-semibold text-gray-800 mb-6">{macronutrientsWebhookData.question}</p>
          </div>
          
          <div className="space-y-3">
            {macronutrientsWebhookData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMacronutrientsWebhookAnswer(option)}
                className="w-full p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Webhook de hormônios
  if (showHormonesWebhook && hormonesWebhookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center animate-pulse">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{hormonesWebhookData.title}</h3>
            
            {/* Gráfico simulado */}
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-end h-32 mb-4">
                <div className="flex flex-col items-center">
                  <div className="bg-red-400 w-8 h-16 rounded-t mb-2"></div>
                  <span className="text-xs">Cortisol Agora</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-400 w-8 h-12 rounded-t mb-2"></div>
                  <span className="text-xs">Testosterona Agora</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-400 w-8 h-20 rounded-t mb-2"></div>
                  <span className="text-xs">Cortisol 6 meses</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-400 w-8 h-24 rounded-t mb-2"></div>
                  <span className="text-xs">Testosterona 6 meses</span>
                </div>
              </div>
            </div>
            
            <div className="text-gray-600 text-sm whitespace-pre-line text-left">{hormonesWebhookData.content}</div>
          </div>
        </div>
      </div>
    );
  }

  // Webhook intermediário
  if (showMidwayWebhook && midwayWebhookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-pulse">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{midwayWebhookData.title}</h3>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{midwayWebhookData.subtitle}</h4>
          <div className="text-gray-600 whitespace-pre-line">{midwayWebhookData.content}</div>
        </div>
      </div>
    );
  }

  // Webhook de progresso
  if (showProgressWebhook && progressWebhookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-pulse">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="text-sm text-gray-500 mb-2 font-semibold">{progressWebhookData.subtitle}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{progressWebhookData.title}</h3>
            <p className="text-gray-600 mb-6">{progressWebhookData.content}</p>
            <p className="text-lg font-semibold text-gray-800 mb-6">{progressWebhookData.question}</p>
          </div>
          
          <div className="space-y-3">
            {progressWebhookData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleProgressWebhookAnswer(option)}
                className="w-full p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Webhook normal
  if (showWebhook && webhookData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center p-4">
        <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center ${webhookData.animated ? 'animate-pulse' : ''}`}>
          <div className={`w-20 h-20 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto mb-6 ${webhookData.animated ? 'animate-bounce' : ''}`}>
            {webhookData.illustration ? <Calendar className="w-10 h-10 text-white" /> : 
             webhookData.testimonial ? <Star className="w-10 h-10 text-white" /> :
             <Trophy className="w-10 h-10 text-white" />}
          </div>
          {webhookData.subtitle && (
            <div className="text-sm text-gray-500 mb-2">{webhookData.subtitle}</div>
          )}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{webhookData.title}</h3>
          <div className={`text-gray-600 whitespace-pre-line ${webhookData.testimonial ? 'italic' : ''}`}>{webhookData.content}</div>
          {webhookData.illustration && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">Peso Atual</div>
                  <div className="text-lg text-gray-600">75 kg</div>
                </div>
                <div className="text-3xl">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">Peso Ideal</div>
                  <div className="text-lg text-green-600">80 kg</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Pergunta {currentStep + 1} de {questions.length}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white ${currentQuestion.animated ? 'animate-pulse' : ''}`}>
            {currentQuestion.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h2>
          {currentQuestion.subtitle && (
            <p className="text-gray-600 whitespace-pre-line">{currentQuestion.subtitle}</p>
          )}
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          {/* Body Fat Slider */}
          {currentQuestion.type === 'body-fat-slider' && (
            <div className="space-y-6">
              {/* Avatar 3D */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div 
                    className={`w-48 h-64 bg-gradient-to-b ${getBodyFatColor(bodyFatPercentage)} rounded-3xl flex items-center justify-center transition-all duration-500 animate-pulse`}
                    style={getAvatarStyle(bodyFatPercentage)}
                  >
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto"></div>
                      <div className="w-12 h-20 bg-white/30 rounded-lg mb-2 mx-auto"></div>
                      <div className="flex justify-center space-x-2">
                        <div className="w-3 h-12 bg-white/25 rounded"></div>
                        <div className="w-3 h-12 bg-white/25 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
                    <span className="text-sm font-bold text-gray-800">{bodyFatPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Percentage Display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-2">{bodyFatPercentage}%</div>
                <div className={`text-lg font-semibold bg-gradient-to-r ${getBodyFatColor(bodyFatPercentage)} bg-clip-text text-transparent`}>
                  {getBodyFatDescription(bodyFatPercentage)}
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500 px-2">
                  <span>5% - Extremamente baixo</span>
                  <span>35% - Muito alto</span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="35"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${((bodyFatPercentage - 5) / 30) * 40}%, #F59E0B ${((bodyFatPercentage - 5) / 30) * 40}%, #F59E0B ${((bodyFatPercentage - 5) / 30) * 70}%, #EF4444 ${((bodyFatPercentage - 5) / 30) * 70}%, #EF4444 100%)`
                    }}
                  />
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-4 border-[#FF4D22] rounded-full shadow-lg transition-all duration-300"
                    style={{ left: `calc(${((bodyFatPercentage - 5) / 30) * 100}% - 12px)` }}
                  ></div>
                </div>

                {/* Scale markers */}
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                  <span>20%</span>
                  <span>25%</span>
                  <span>30%</span>
                  <span>35%</span>
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${bodyFatPercentage <= 12 ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                  <div className="font-semibold text-green-600">Atlético</div>
                  <div className="text-gray-600">5-12%</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${bodyFatPercentage > 12 && bodyFatPercentage <= 20 ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="font-semibold text-blue-600">Fitness</div>
                  <div className="text-gray-600">13-20%</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${bodyFatPercentage > 20 && bodyFatPercentage <= 25 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                  <div className="font-semibold text-yellow-600">Saudável</div>
                  <div className="text-gray-600">21-25%</div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${bodyFatPercentage > 25 ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <div className="font-semibold text-red-600">Alto</div>
                  <div className="text-gray-600">26%+</div>
                </div>
              </div>

              <button
                onClick={handleBodyFatSlider}
                className="w-full mt-6 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continuar com {bodyFatPercentage}%
              </button>
            </div>
          )}

          {/* Single Choice */}
          {currentQuestion.type === 'single' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF4D22] hover:bg-[#FF4D22]/5 transition-all duration-300 transform hover:scale-[1.02] whitespace-pre-line"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Multiple Choice */}
          {currentQuestion.type === 'multiple' && (
            <>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => toggleMultipleOption(option)}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedMultiple.includes(option)
                        ? 'border-[#FF4D22] bg-[#FF4D22]/10'
                        : 'border-gray-200 hover:border-[#FF4D22] hover:bg-[#FF4D22]/5'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleMultipleAnswer}
                disabled={selectedMultiple.length === 0}
                className="w-full mt-6 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Continuar ({selectedMultiple.length} selecionado{selectedMultiple.length !== 1 ? 's' : ''})
              </button>
            </>
          )}

          {/* Acknowledgment */}
          {currentQuestion.type === 'acknowledgment' && (
            <div className="text-center">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 text-left">
                <div className="flex">
                  <Heart className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                  <div className="text-yellow-800 whitespace-pre-line">{currentQuestion.subtitle}</div>
                </div>
              </div>
              <button
                onClick={handleAcknowledgment}
                className="w-full p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Entendi, continuar
              </button>
            </div>
          )}

          {/* Food Selection */}
          {currentQuestion.type === 'food-selection' && (
            <>
              <div className="mb-6 text-center">
                <button className="px-6 py-3 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Deixe FitMind Body escolher
                </button>
                <p className="text-sm text-gray-600 mt-2">Criamos um plano alimentar equilibrado para você, que fornece os nutrientes que seu corpo precisa para se exercitar de maneira eficaz</p>
              </div>
              
              <div className="space-y-6">
                {currentQuestion.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{category.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={() => toggleFoodItem(category.name, item)}
                          className={`p-2 text-sm rounded-lg border transition-all duration-300 ${
                            selectedFoods[category.name]?.includes(item)
                              ? 'border-[#FF4D22] bg-[#FF4D22]/10 text-[#FF4D22]'
                              : 'border-gray-200 hover:border-[#FF4D22] hover:bg-[#FF4D22]/5'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleFoodSelection}
                className="w-full mt-6 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continuar com seleção
              </button>
            </>
          )}

          {/* Account Form */}
          {currentQuestion.type === 'account-form' && (
            <>
              <div className="space-y-4">
                {currentQuestion.fields.map((field, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={inputValues[field.key] || ''}
                      onChange={(e) => setInputValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF4D22] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleInputAnswer}
                disabled={!Object.values(inputValues).every(val => val)}
                className="w-full mt-6 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Criar Conta
              </button>
            </>
          )}

          {/* Fitness Analysis */}
          {currentQuestion.type === 'fitness-analysis' && (
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-white text-2xl font-bold">{analysisProgress}%</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Analisando seu perfil...</h3>
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Sua idade de condicionamento físico é</h4>
                  <div className="text-4xl font-bold text-[#FF4D22] mb-2">34 anos</div>
                  <p className="text-gray-600 text-sm">Isso indica um nível de envelhecimento do corpo. Exercícios irregulares e dormir tarde da noite podem levar ao envelhecimento metabólico.</p>
                  <p className="text-gray-600 text-sm mt-2">Pessoas com baixo metabolismo têm maior probabilidade de ganhar peso e se cansar mais rapidamente.</p>
                  
                  <div className="mt-4 p-3 bg-white/50 rounded-lg">
                    <div className="text-sm font-semibold text-gray-700">Sua idade corporal é maior do que sua idade real</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">Idade Real: 28</span>
                      <span className="text-xs text-gray-600">Idade Corporal: 34</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {analysisProgress === 0 && (
                <button
                  onClick={handleFitnessAnalysis}
                  className="w-full p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Iniciar Análise
                </button>
              )}
              
              {showCommitmentQuestion && (
                <div className="bg-white/80 rounded-xl p-6 border-2 border-[#FF4D22]">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Você está pronto para assumir o compromisso?</h4>
                  <div className="space-y-3">
                    {['Sim, farei meu primeiro treino amanhã 👌', 'Sim! Vou fazer meu primeiro treino hoje! 😎', 'Não estou pronto para assumir o compromisso'].map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleCommitmentAnswer(option)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-[#FF4D22] hover:bg-[#FF4D22]/5 transition-all duration-300 text-sm"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Results */}
          {currentQuestion.type === 'final-results' && (
            <div className="space-y-6">
              {/* Comparação Agora vs 6 meses */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-6 text-center">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Agora</h4>
                  <div className="space-y-2 text-sm">
                    <div>Gordura corporal: <span className="font-semibold">20-24%</span></div>
                    <div>Idade de condicionamento físico: <span className="font-semibold">34</span></div>
                    <div>Músculos do corpo: <span className="font-semibold">Baixo</span></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6 text-center">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">6 meses</h4>
                  <div className="space-y-2 text-sm">
                    <div>Gordura corporal: <span className="font-semibold text-green-600">12-14%</span></div>
                    <div>Idade de condicionamento físico: <span className="font-semibold text-green-600">29</span></div>
                    <div>Músculos do corpo: <span className="font-semibold text-green-600">Alto</span></div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center">*A imagem não pretende representar o usuário. Os resultados variam por pessoa e não são garantidos.</p>
              
              {/* IMC */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-2">IMC atual</h4>
                <div className="text-2xl font-bold text-blue-600 mb-2">22.09 IMC</div>
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Abaixo do peso</span>
                  <span className="font-semibold">Normal</span>
                  <span>Obeso</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">O índice de massa corporal (IMC) é uma medida que usa sua altura e peso para determinar se seu peso é saudável.</p>
              </div>
              
              {/* Recomendações */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🍔</span>
                    <span className="font-semibold">Ingestão diária de calorias</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">2594 kcal</div>
                  <div className="text-xs text-gray-600">1000 kcal ←→ 5000 kcal</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">💧</span>
                    <span className="font-semibold">Ingestão diária de água</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">2.2 l</div>
                </div>
              </div>
              
              {/* Plano Personalizado */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">O plano personalizado está pronto!</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Duração do Treino</div>
                      <div>1 hora</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Nível de Aptidão</div>
                      <div>Avançado</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Local para Treinar</div>
                      <div>Academia</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Frequência de Treino</div>
                      <div>3 vezes por semana</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Os objetivos do seu programa também incluem:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reduzir o estresse</li>
                    <li>• Sentir-se mais saudável</li>
                    <li>• Autodisciplina</li>
                    <li>• Criar um hábito físico</li>
                    <li>• Melhorar o sono</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800 mb-2">O que você recebe:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Programa de treino personalizado</li>
                    <li>• Plano de treino claro e fácil de seguir</li>
                    <li>• Resultados visíveis após o primeiro mês</li>
                    <li>• Acompanhamento e análise do progresso</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => {
                  // Salvar dados do quiz antes de ir para pricing
                  localStorage.setItem('userQuizData', JSON.stringify(quizData));
                  router.push('/pricing');
                }}
                className="w-full p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-bold text-lg hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                OBTER MEU PLANO
              </button>
              
              {/* Planos de Preço */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-800 text-center">Escolha o melhor plano para você</h4>
                {[
                  { name: '1 SEMANA DE TESTE', price: 'R$ 9,90' },
                  { name: 'Plano 1 mês', price: 'R$ 39,90' },
                  { name: 'PLANO DE 3 meses', price: 'R$ 89,90' },
                  { name: 'PLANO DE 6 meses', price: 'R$ 149,90' },
                  { name: 'Plano de 12 meses', price: 'R$ 239,90' }
                ].map((plan, index) => (
                  <button
                    key={index}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#FF4D22] hover:bg-[#FF4D22]/5 transition-all duration-300 flex justify-between items-center"
                  >
                    <span className="font-semibold">{plan.name}</span>
                    <span className="text-[#FF4D22] font-bold">{plan.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fitness Level Graph */}
          {currentQuestion.type === 'fitness-level-graph' && (
            <div className="space-y-6">
              {/* Gráfico gamificado de 1 a 10 */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {currentQuestion.levels.map((levelData) => {
                    const getCategoryColor = (category) => {
                      if (category === 'Recém chegado') return 'from-red-400 to-red-500';
                      if (category === 'Amador') return 'from-yellow-400 to-orange-500';
                      return 'from-green-400 to-green-500';
                    };

                    return (
                      <button
                        key={levelData.level}
                        onClick={() => handleFitnessLevelAnswer(levelData.level)}
                        className={`relative group aspect-square bg-gradient-to-br ${getCategoryColor(levelData.category)} rounded-xl flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse`}
                        style={{ animationDelay: `${levelData.level * 0.1}s` }}
                      >
                        <span className="text-2xl">{levelData.level}</span>
                        
                        {/* Tooltip com descrição */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <div className="bg-gray-800 text-white text-xs rounded-lg p-3 max-w-xs whitespace-normal shadow-xl">
                            <div className="font-semibold text-yellow-300 mb-1">{levelData.category}</div>
                            <div>{levelData.description}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legenda das categorias */}
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded"></div>
                    <span className="font-semibold text-gray-700">Recém chegado (1-4)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
                    <span className="font-semibold text-gray-700">Amador (5-7)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded"></div>
                    <span className="font-semibold text-gray-700">Pró (8-10)</span>
                  </div>
                </div>
              </div>

              {/* Instruções */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Clique no número que melhor representa seu nível atual de condicionamento físico
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Passe o mouse sobre cada número para ver a descrição detalhada
                </p>
              </div>
            </div>
          )}

          {/* Input */}
          {currentQuestion.type === 'input' && (
            <>
              <div className={`relative ${currentQuestion.gamified ? 'animate-pulse' : ''}`}>
                <input
                  type={currentQuestion.inputType}
                  placeholder={currentQuestion.placeholder}
                  value={inputValues.value || ''}
                  onChange={(e) => setInputValues({ value: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FF4D22] focus:outline-none transition-colors duration-300 text-center text-lg font-semibold"
                />
                {currentQuestion.gamified && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Scale className="w-5 h-5 text-[#FF4D22]" />
                  </div>
                )}
              </div>
              <button
                onClick={handleInputAnswer}
                disabled={!inputValues.value}
                className="w-full mt-4 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Continuar
              </button>
            </>
          )}

          {/* Dual Input */}
          {currentQuestion.type === 'dual-input' && (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${currentQuestion.gamified ? 'animate-pulse' : ''}`}>
                {currentQuestion.inputs.map((input, index) => (
                  <div key={index} className="relative">
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      value={inputValues[input.key] || ''}
                      onChange={(e) => setInputValues(prev => ({ ...prev, [input.key]: e.target.value }))}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FF4D22] focus:outline-none transition-colors duration-300 text-center font-semibold"
                    />
                    {currentQuestion.gamified && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Scale className="w-5 h-5 text-[#FF4D22]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleInputAnswer}
                disabled={!Object.values(inputValues).every(val => val)}
                className="w-full mt-4 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Continuar
              </button>
            </>
          )}

          {/* Date */}
          {currentQuestion.type === 'date' && (
            <>
              <div className={`relative ${currentQuestion.gamified ? 'animate-pulse' : ''}`}>
                <input
                  type="date"
                  value={inputValues.date || ''}
                  onChange={(e) => setInputValues({ date: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FF4D22] focus:outline-none transition-colors duration-300 text-center font-semibold"
                />
                {currentQuestion.gamified && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Calendar className="w-5 h-5 text-[#FF4D22]" />
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleInputAnswer}
                  disabled={!inputValues.date}
                  className="flex-1 p-4 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white rounded-xl font-semibold hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Continuar
                </button>
                {currentQuestion.skipOption && (
                  <button
                    onClick={handleSkip}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-gray-400 transition-colors duration-300"
                  >
                    Pular
                  </button>
                )}
              </div>
            </>
          )}

          {/* Like/Dislike */}
          {currentQuestion.type === 'like-dislike' && (
            <div className="text-center space-y-6">
              <div className={`w-32 h-32 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto ${currentQuestion.animated ? 'animate-bounce' : ''}`}>
                {currentQuestion.exerciseType === 'Corrida' ? (
                  <Heart className="w-16 h-16 text-white" />
                ) : (
                  <Dumbbell className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleLikeDislike('gosto')}
                  className="px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  👍 Gosto
                </button>
                <button
                  onClick={() => handleLikeDislike('nao-gosto')}
                  className="px-8 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  👎 Não Gosto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Terms and Privacy (only on first question) */}
        {currentQuestion.showTerms && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-[#FF4D22] border-gray-300 rounded focus:ring-[#FF4D22]" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>Ao continuar, você concorda com nossos <span className="text-[#FF4D22] underline">Termos de serviço</span> e verifica nossa <span className="text-[#FF4D22] underline">Política de privacidade</span> e <span className="text-[#FF4D22] underline">Política de cookies</span></span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-[#FF4D22] border-gray-300 rounded focus:ring-[#FF4D22]"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                />
                <span>Desejo receber atualizações sobre produtos, serviços e ofertas especiais da FitMind Body por e-mail</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF4D22;
          border: 4px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF4D22;
          border: 4px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}