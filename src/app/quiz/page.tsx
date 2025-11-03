'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Activity, 
  MapPin, 
  Calendar,
  Utensils,
  Target,
  User,
  Dumbbell,
  Apple,
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface QuizData {
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goal?: string;
  fitnessLevel?: {
    level: number;
    category: string;
  };
  workoutLocation?: string;
  workoutDuration?: string;
  trainingFrequency?: string;
  additionalGoals?: string[];
  dietaryRestrictions?: string[];
  dietType?: string;
  mealPlan?: any;
  dietCreatedBy?: string;
}

const questions = [
  {
    id: 1,
    title: "Qual é o seu nome?",
    type: "text",
    field: "name",
    placeholder: "Digite seu nome completo"
  },
  {
    id: 2,
    title: "Qual é a sua idade?",
    type: "number",
    field: "age",
    placeholder: "Digite sua idade"
  },
  {
    id: 3,
    title: "Qual é o seu gênero?",
    type: "radio",
    field: "gender",
    options: ["Masculino", "Feminino", "Prefiro não informar"]
  },
  {
    id: 4,
    title: "Qual é a sua altura? (em cm)",
    type: "number",
    field: "height",
    placeholder: "Ex: 175"
  },
  {
    id: 5,
    title: "Qual é o seu peso atual? (em kg)",
    type: "number",
    field: "weight",
    placeholder: "Ex: 70"
  },
  {
    id: 6,
    title: "Qual é o seu principal objetivo?",
    type: "radio",
    field: "goal",
    options: [
      "Perder peso e definir",
      "Ganhar massa muscular",
      "Melhorar condicionamento físico",
      "Manter a forma atual",
      "Reabilitação/Fisioterapia"
    ]
  },
  {
    id: 7,
    title: "Como você avalia seu nível de condicionamento físico atual?",
    type: "scale",
    field: "fitnessLevel",
    min: 1,
    max: 10,
    labels: {
      1: "Sedentário",
      5: "Moderado", 
      10: "Atlético"
    }
  },
  {
    id: 8,
    title: "Onde você prefere treinar?",
    type: "radio",
    field: "workoutLocation",
    options: [
      "Em casa",
      "Academia",
      "Parque/Ar livre",
      "Estúdio especializado"
    ]
  },
  {
    id: 9,
    title: "Quanto tempo você tem disponível para treinar?",
    type: "radio",
    field: "workoutDuration",
    options: [
      "30 minutos",
      "45 minutos",
      "60 minutos",
      "90 minutos ou mais"
    ]
  },
  {
    id: 10,
    title: "Com que frequência você pode treinar por semana?",
    type: "radio",
    field: "trainingFrequency",
    options: [
      "2 vezes por semana",
      "3 vezes por semana",
      "4 vezes por semana",
      "5 ou mais vezes por semana"
    ]
  },
  // Pergunta 20 - modalidades de treino (sem "funcional")
  {
    id: 20,
    title: "Que modalidades de treino mais te interessam?",
    type: "radio",
    field: "trainingModalities",
    options: [
      "Musculação",
      "Cardio/Aeróbico",
      "Yoga/Pilates",
      "Crossfit",
      "Dança",
      "Artes marciais",
      "Natação"
    ]
  },
  // Pergunta 30 - onde está o botão "Deixe FitMind Body escolher"
  {
    id: 30,
    title: "Que tipo de dieta você prefere seguir?",
    type: "radio_with_auto",
    field: "dietType",
    options: [
      "Dieta balanceada tradicional",
      "Low carb",
      "Cetogênica",
      "Vegetariana",
      "Vegana",
      "Intermitente"
    ],
    autoOption: "Deixe FitMind Body escolher"
  },
  // Pergunta 31 - próxima pergunta após a 30
  {
    id: 31,
    title: "Você tem alguma restrição alimentar?",
    type: "radio",
    field: "dietaryRestrictions",
    options: [
      "Nenhuma restrição",
      "Intolerância à lactose",
      "Intolerância ao glúten",
      "Diabetes",
      "Hipertensão",
      "Outras restrições"
    ]
  },
  // Pergunta final - 35
  {
    id: 35,
    title: "Resultado Final",
    type: "result",
    field: "result"
  }
];

// Planos disponíveis com links da Kiwify
const subscriptionPlans = [
  {
    id: 1,
    emoji: "🏋️‍♂️",
    title: "1 SEMANA DE TESTE",
    price: "R$ 9,90",
    link: "https://pay.kiwify.com.br/1TDRVxj",
    popular: false
  },
  {
    id: 2,
    emoji: "📅",
    title: "PLANO DE 1 MÊS",
    price: "R$ 39,90",
    link: "https://pay.kiwify.com.br/uQbG74T",
    popular: false
  },
  {
    id: 3,
    emoji: "🗓️",
    title: "PLANO DE 3 MESES",
    price: "R$ 89,90",
    link: "https://pay.kiwify.com.br/fZoZcUt",
    popular: true
  },
  {
    id: 4,
    emoji: "💪",
    title: "PLANO DE 6 MESES",
    price: "R$ 149,90",
    link: "https://pay.kiwify.com.br/GZGgEB2",
    popular: false
  },
  {
    id: 5,
    emoji: "🏆",
    title: "PLANO DE 12 MESES",
    price: "R$ 239,90",
    link: "https://pay.kiwify.com.br/fnIR5MA",
    popular: false
  }
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Carregar dados salvos se existirem
    const savedData = localStorage.getItem('userQuizData');
    if (savedData) {
      setQuizData(JSON.parse(savedData));
    }
  }, []);

  const saveData = (data: Partial<QuizData>) => {
    const updatedData = { ...quizData, ...data };
    setQuizData(updatedData);
    localStorage.setItem('userQuizData', JSON.stringify(updatedData));
  };

  const handleNext = () => {
    if (currentQuestion < 35) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAutoChoice = async () => {
    setIsGeneratingPlan(true);
    
    // Simular processamento de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Lógica para escolha automática baseada nas respostas anteriores
    const autoRecommendation = generateAutoRecommendation();
    saveData(autoRecommendation);
    
    setIsGeneratingPlan(false);
    
    // Avançar para a próxima pergunta (31)
    setCurrentQuestion(31);
  };

  const generateAutoRecommendation = () => {
    // Lógica inteligente baseada nas respostas do usuário
    let recommendedDiet = "Dieta balanceada tradicional";
    let recommendedDuration = "45 minutos";
    
    // Baseado no objetivo
    if (quizData.goal?.includes("peso")) {
      recommendedDiet = "Low carb";
    } else if (quizData.goal?.includes("massa")) {
      recommendedDiet = "Dieta balanceada tradicional";
    } else if (quizData.goal?.includes("condicionamento")) {
      recommendedDiet = "Dieta balanceada tradicional";
    }
    
    // Baseado no nível de fitness
    if (quizData.fitnessLevel && quizData.fitnessLevel.level < 4) {
      recommendedDuration = "30 minutos";
    } else if (quizData.fitnessLevel && quizData.fitnessLevel.level > 7) {
      recommendedDuration = "60 minutos";
    }

    // Baseado na idade
    if (quizData.age && quizData.age > 50) {
      recommendedDiet = "Dieta balanceada tradicional";
    }

    // Gerar plano de dieta personalizado
    const mealPlan = generateMealPlan(recommendedDiet);

    return {
      dietType: recommendedDiet,
      workoutDuration: recommendedDuration,
      mealPlan: mealPlan,
      dietCreatedBy: 'FitMindBody'
    };
  };

  const generateMealPlan = (dietType: string) => {
    const basePlans = {
      "Low carb": {
        "Café da Manhã": ["Ovos mexidos com queijo", "Abacate", "Café sem açúcar", "Bacon"],
        "Almoço": ["Frango grelhado", "Salada verde com azeite", "Brócolis refogado"],
        "Jantar": ["Salmão grelhado", "Aspargos", "Couve-flor gratinada"],
        "Lanches": ["Castanhas", "Queijo", "Azeitonas", "Ovos cozidos"]
      },
      "Dieta balanceada tradicional": {
        "Café da Manhã": ["Aveia com frutas", "Iogurte natural", "Granola", "Suco natural"],
        "Almoço": ["Arroz integral", "Feijão", "Carne magra", "Legumes variados"],
        "Jantar": ["Peixe grelhado", "Batata doce", "Salada colorida"],
        "Lanches": ["Frutas da estação", "Castanhas", "Iogurte", "Pão integral"]
      },
      "Cetogênica": {
        "Café da Manhã": ["Ovos com manteiga", "Abacate", "Café com óleo de coco"],
        "Almoço": ["Carne vermelha", "Salada com azeite", "Queijos"],
        "Jantar": ["Frango com pele", "Vegetais verdes", "Azeite extra"],
        "Lanches": ["Nozes", "Azeitonas", "Queijo", "Abacate"]
      },
      "Vegetariana": {
        "Café da Manhã": ["Smoothie de frutas", "Granola", "Leite vegetal"],
        "Almoço": ["Quinoa", "Leguminosas", "Vegetais grelhados"],
        "Jantar": ["Tofu grelhado", "Arroz integral", "Legumes"],
        "Lanches": ["Frutas", "Castanhas", "Hummus", "Vegetais crus"]
      },
      "Vegana": {
        "Café da Manhã": ["Aveia com leite vegetal", "Frutas", "Sementes"],
        "Almoço": ["Grão-de-bico", "Quinoa", "Vegetais variados"],
        "Jantar": ["Lentilhas", "Arroz integral", "Salada"],
        "Lanches": ["Frutas", "Castanhas", "Smoothies", "Vegetais"]
      },
      "Intermitente": {
        "Primeira Refeição": ["Ovos", "Abacate", "Vegetais"],
        "Segunda Refeição": ["Proteína magra", "Carboidratos complexos", "Gorduras boas"],
        "Terceira Refeição": ["Peixe", "Vegetais", "Oleaginosas"],
        "Janela Alimentar": ["8 horas de alimentação", "16 horas de jejum"]
      }
    };

    return basePlans[dietType as keyof typeof basePlans] || basePlans["Dieta balanceada tradicional"];
  };

  const handlePlanSelection = async (plan: typeof subscriptionPlans[0]) => {
    setRedirectingPlan(plan.title);
    
    // Mostrar mensagem de redirecionamento por 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Abrir link de pagamento em nova aba
    window.open(plan.link, '_blank');
    
    setRedirectingPlan(null);
  };

  const renderQuestion = () => {
    const question = questions.find(q => q.id === currentQuestion);
    if (!question) return null;

    if (question.type === "result") {
      return renderResult();
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-sm text-white/60 mb-2">
            Pergunta {currentQuestion} de 35
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / 35) * 100}%` }}
            ></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-8">{question.title}</h2>
        </div>

        {question.type === "text" && (
          <input
            type="text"
            placeholder={question.placeholder}
            value={quizData[question.field as keyof QuizData] as string || ''}
            onChange={(e) => saveData({ [question.field]: e.target.value })}
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FF4D22]"
          />
        )}

        {question.type === "number" && (
          <input
            type="number"
            placeholder={question.placeholder}
            value={quizData[question.field as keyof QuizData] as number || ''}
            onChange={(e) => saveData({ [question.field]: parseInt(e.target.value) })}
            className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FF4D22]"
          />
        )}

        {question.type === "radio" && (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => saveData({ [question.field]: option })}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  quizData[question.field as keyof QuizData] === option
                    ? 'border-[#FF4D22] bg-[#FF4D22]/20 text-white'
                    : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === "radio_with_auto" && (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => saveData({ [question.field]: option })}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  quizData[question.field as keyof QuizData] === option
                    ? 'border-[#FF4D22] bg-[#FF4D22]/20 text-white'
                    : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40'
                }`}
              >
                {option}
              </button>
            ))}
            
            {/* Botão especial "Deixe FitMind Body escolher" - CORRIGIDO */}
            <button
              onClick={handleAutoChoice}
              disabled={isGeneratingPlan}
              className="w-full p-4 rounded-xl border-2 border-[#FF6B47] bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gerando seu plano FitMind Body personalizado...</span>
                </>
              ) : (
                <>
                  <span>✨ {question.autoOption}</span>
                </>
              )}
            </button>
            
            {/* Mensagem explicativa */}
            {isGeneratingPlan && (
              <div className="text-center text-white/70 text-sm mt-4 animate-pulse">
                Analisando suas respostas para criar o plano perfeito para você...
              </div>
            )}
          </div>
        )}

        {question.type === "scale" && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-white/60">
              <span>{question.labels?.[1]}</span>
              <span>{question.labels?.[5]}</span>
              <span>{question.labels?.[10]}</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={quizData[question.field as keyof QuizData]?.level || 5}
              onChange={(e) => {
                const level = parseInt(e.target.value);
                const category = level <= 3 ? 'Iniciante' : level <= 7 ? 'Intermediário' : 'Avançado';
                saveData({ [question.field]: { level, category } });
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center text-white">
              Nível: {quizData[question.field as keyof QuizData]?.level || 5} - {quizData[question.field as keyof QuizData]?.category || 'Moderado'}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!quizData[question.field as keyof QuizData] && question.type !== "radio_with_auto"}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Próxima</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            🎯 Seu plano personalizado está pronto!
          </h2>
          <p className="text-white/80 text-lg mb-8">
            O seu plano Fit Mind Body inclui tudo o que você precisa para transformar seu corpo — treino, dieta personalizada, acompanhamento e evolução contínua.
          </p>
        </div>

        {/* Resumo do Perfil */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Seu Perfil Personalizado</h3>
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-[#FF4D22]" />
              <div>
                <div className="font-semibold text-white">Duração do Treino</div>
                <div className="text-white/70">{quizData.workoutDuration || '45 minutos'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-[#FF4D22]" />
              <div>
                <div className="font-semibold text-white">Nível de Aptidão</div>
                <div className="text-white/70">{quizData.fitnessLevel?.category || 'Moderado'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-[#FF4D22]" />
              <div>
                <div className="font-semibold text-white">Local para Treinar</div>
                <div className="text-white/70">{quizData.workoutLocation || 'Academia'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-[#FF4D22]" />
              <div>
                <div className="font-semibold text-white">Frequência de Treino</div>
                <div className="text-white/70">{quizData.trainingFrequency || '3 vezes por semana'}</div>
              </div>
            </div>
          </div>

          {/* O que você recebe */}
          <div className="mt-6">
            <h4 className="font-semibold text-white mb-4">O que você recebe:</h4>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Programa de treino personalizado</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>🥗 Dieta personalizada feita sob medida para o seu objetivo</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Plano de treino claro e fácil de seguir</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Resultados visíveis após o primeiro mês</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Acompanhamento e análise de progresso</span>
              </li>
            </ul>
          </div>

          {/* Dieta Personalizada */}
          {quizData.mealPlan && (
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-green-400" />
                Sua Dieta Personalizada
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(quizData.mealPlan).map(([category, items]) => (
                  <div key={category}>
                    <div className="font-semibold text-white mb-1">{category}:</div>
                    <div className="text-white/70">
                      {Array.isArray(items) ? items.slice(0, 3).join(', ') + (items.length > 3 ? '...' : '') : 'Personalizado'}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-3">
                {quizData.dietCreatedBy === 'FitMindBody' ? 
                  'Esta dieta foi criada automaticamente baseada nas suas respostas para otimizar seus resultados.' :
                  'Esta dieta foi personalizada com base nas suas preferências alimentares.'}
              </p>
            </div>
          )}
        </div>

        {/* NOVA SEÇÃO: Planos de Assinatura */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-2 text-center">
            Escolha seu plano e comece sua transformação!
          </h3>
          <p className="text-white/70 text-center mb-8">
            Selecione o plano ideal para alcançar seus objetivos
          </p>

          {/* Grid de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-[#FF4D22] bg-gradient-to-br from-[#FF4D22]/20 to-[#FF6B47]/20' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white px-3 py-1 rounded-full text-xs font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-3xl mb-3">{plan.emoji}</div>
                  <h4 className="font-bold text-white text-lg mb-2">{plan.title}</h4>
                  <div className="text-2xl font-bold text-[#FF4D22] mb-6">{plan.price}</div>
                  
                  <button
                    onClick={() => handlePlanSelection(plan)}
                    disabled={redirectingPlan === plan.title}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-white hover:shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {redirectingPlan === plan.title ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecionando...</span>
                      </>
                    ) : (
                      <>
                        <span>OBTER MEU PLANO</span>
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem de redirecionamento global */}
          {redirectingPlan && (
            <div className="mt-6 text-center">
              <div className="bg-gradient-to-r from-[#FF4D22]/20 to-[#FF6B47]/20 border border-[#FF4D22]/30 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-semibold">
                    Redirecionando para o pagamento seguro do seu plano...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Garantias e Benefícios */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Acesso Imediato</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Suporte Especializado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
          {renderQuestion()}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #FF4D22, #FF6B47);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #FF4D22, #FF6B47);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}