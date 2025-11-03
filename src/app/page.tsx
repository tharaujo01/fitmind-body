'use client';

import { ArrowRight, Zap, Target, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTransformation = () => {
    setIsLoading(true);
    console.log('event: start_quiz'); // Rastreamento de evento

    // Pequeno delay para mostrar loading
    setTimeout(() => {
      router.push('/quiz');
    }, 500);
  };

  const handleGetPlan = () => {
    router.push('/pricing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] relative overflow-hidden">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Subtle geometric patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">

          {/* Main Logo Container */}
          <div className="relative mb-12">
            <div className="w-40 h-40 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-black/30 border border-white/10 p-2">
              <img
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26273719-f3e3-4694-b735-4e3abe7ea0d0.jpg"
                alt="FitMind Body Logo"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-40 h-40 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-3xl mx-auto blur-xl opacity-30 -z-10"></div>
          </div>

          {/* Title Section */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-[#FFFFFF] mb-6 tracking-tight">
              FitMind
              <span className="bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] bg-clip-text text-transparent"> Body</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#FFFFFF]/80 mb-4 font-light">
              Transforme seu corpo. Eleve sua mente.
            </p>
            <p className="text-lg text-[#FFFFFF]/60 max-w-2xl mx-auto leading-relaxed">
              Sua jornada fitness premium começa aqui
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#FFFFFF] font-semibold mb-2">Energia</h3>
              <p className="text-[#FFFFFF]/70 text-sm">Maximize sua performance</p>
            </div>

            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#FFFFFF] font-semibold mb-2">Foco</h3>
              <p className="text-[#FFFFFF]/70 text-sm">Resultados personalizados</p>
            </div>

            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D22] to-[#FF6B47] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#FFFFFF] font-semibold mb-2">Conquista</h3>
              <p className="text-[#FFFFFF]/70 text-sm">Supere seus limites</p>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-[#0D0D0D]/60 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-6">
              Pronto para sua transformação?
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-[#FFFFFF]/90">
                <div className="w-2 h-2 bg-[#FF4D22] rounded-full"></div>
                <span>Treinos personalizados de calistenia e força</span>
              </div>
              <div className="flex items-center space-x-3 text-[#FFFFFF]/90">
                <div className="w-2 h-2 bg-[#FF4D22] rounded-full"></div>
                <span>Dietas personalizadas para seu objetivo</span>
              </div>
              <div className="flex items-center space-x-3 text-[#FFFFFF]/90">
                <div className="w-2 h-2 bg-[#FF4D22] rounded-full"></div>
                <span>Sistema de créditos para personalização</span>
              </div>
              <div className="flex items-center space-x-3 text-[#FFFFFF]/90">
                <div className="w-2 h-2 bg-[#FF4D22] rounded-full"></div>
                <span>Acompanhamento e análise de progresso</span>
              </div>
              <div className="flex items-center space-x-3 text-[#FFFFFF]/90">
                <div className="w-2 h-2 bg-[#FF4D22] rounded-full"></div>
                <span>Planos flexíveis de assinatura</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <div className="relative">
              <button
                onClick={handleStartTransformation}
                disabled={isLoading}
                className="group relative bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] text-[#FFFFFF] px-12 py-5 rounded-2xl font-bold text-xl hover:from-[#FF6B47] hover:to-[#FF4D22] transition-all duration-500 flex items-center justify-center space-x-3 mx-auto shadow-2xl shadow-[#FF4D22]/30 border border-white/10 hover:scale-105 hover:shadow-[#FF4D22]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Iniciar Minha Transformação</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}

                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D22] to-[#FF6B47] rounded-2xl blur-xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-500"></div>
              </button>
            </div>

            {/* Secondary CTA */}
            <div className="relative">
              <button
                onClick={handleGetPlan}
                className="group relative bg-white/10 backdrop-blur-sm text-[#FFFFFF] px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto border border-white/20 hover:border-white/40"
              >
                <span>Ver Planos e Preços</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Subtle hint text */}
            <p className="text-[#FFFFFF]/50 text-sm mt-6 font-light">
              • Quiz personalizado • Treinos de calistenia • Sistema de créditos • Dietas personalizadas
            </p>
          </div>

        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1C0632] to-transparent"></div>
    </div>
  );
}