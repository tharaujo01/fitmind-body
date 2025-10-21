"use client";

import React, { useState } from 'react';
import { CreditCard, Zap, Crown, Star, ArrowLeft, Check } from 'lucide-react';
import { PLANS, CREDIT_PACKAGES, creditSystem } from '@/lib/credit-system';

interface CreditRechargeProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreditRecharge({ onClose, onSuccess }: CreditRechargeProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'plans'>('packages');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = creditSystem.getCurrentUser();
  const currentPlan = creditSystem.getCurrentPlan();

  const handlePurchaseCredits = async (credits: number, price: number) => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    creditSystem.addCredits(credits, 'purchased', `Compra de ${credits} créditos`);
    
    setIsProcessing(false);
    onSuccess?.();
    
    // Mostrar feedback de sucesso
    alert(`✅ Compra realizada com sucesso! ${credits} créditos adicionados à sua conta.`);
  };

  const handleUpgradePlan = async (planId: string) => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPlan = PLANS.find(p => p.id === planId);
    if (newPlan) {
      const updatedUser = { ...user, planId: newPlan.id };
      creditSystem.saveUser(updatedUser);
      creditSystem.addCredits(newPlan.monthlyCredits, 'earned', `Upgrade para plano ${newPlan.name}`);
    }
    
    setIsProcessing(false);
    onSuccess?.();
    
    alert(`✅ Plano atualizado com sucesso! Bem-vindo ao plano ${newPlan?.name}!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recarregar Créditos</h2>
                <p className="text-gray-600">Saldo atual: <span className="font-semibold text-blue-600">{user.creditsBalance} créditos</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Plano atual</p>
              <p className="font-semibold text-gray-900">{currentPlan.name}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'packages'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Pacotes de Créditos
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'plans'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Crown className="w-4 h-4 inline mr-2" />
              Upgrade de Plano
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'packages' ? (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comprar Créditos Extras</h3>
                <p className="text-gray-600">Recarregue seus créditos e continue aproveitando todas as funcionalidades</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CREDIT_PACKAGES.map((pkg, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                      selectedPackage === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(index)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">+{pkg.credits} Créditos</h4>
                      <p className="text-3xl font-bold text-blue-600 mb-4">R$ {pkg.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        R$ {(pkg.price / pkg.credits).toFixed(2)} por crédito
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchaseCredits(pkg.credits, pkg.price);
                        }}
                        disabled={isProcessing}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-colors"
                      >
                        {isProcessing ? 'Processando...' : 'Comprar Agora'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-800">Pagamento 100% Seguro</h4>
                </div>
                <p className="text-green-700 text-sm">
                  Seus dados estão protegidos com criptografia de ponta. Aceitamos cartão de crédito, débito e PIX.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Upgrade seu Plano</h3>
                <p className="text-gray-600">Mais créditos mensais e funcionalidades exclusivas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan) => {
                  const isCurrentPlan = plan.id === currentPlan.id;
                  const isUpgrade = PLANS.findIndex(p => p.id === plan.id) > PLANS.findIndex(p => p.id === currentPlan.id);
                  
                  return (
                    <div
                      key={plan.id}
                      className={`border-2 rounded-2xl p-6 relative ${
                        isCurrentPlan
                          ? 'border-blue-500 bg-blue-50'
                          : selectedPlan === plan.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isCurrentPlan ? 'cursor-pointer' : ''}`}
                      onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                    >
                      {plan.id === 'premium' && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                            MAIS POPULAR
                          </div>
                        </div>
                      )}

                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                            PLANO ATUAL
                          </div>
                        </div>
                      )}

                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                          plan.id === 'basic' ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                          plan.id === 'pro' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                          'bg-gradient-to-r from-purple-500 to-pink-600'
                        }`}>
                          {plan.id === 'premium' ? (
                            <Crown className="w-8 h-8 text-white" />
                          ) : (
                            <Star className="w-8 h-8 text-white" />
                          )}
                        </div>
                        
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                        <p className="text-3xl font-bold text-purple-600 mb-2">R$ {plan.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mb-4">{plan.monthlyCredits} créditos/mês</p>

                        <ul className="text-left space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {isCurrentPlan ? (
                          <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
                          >
                            Plano Atual
                          </button>
                        ) : isUpgrade ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpgradePlan(plan.id);
                            }}
                            disabled={isProcessing}
                            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-colors"
                          >
                            {isProcessing ? 'Processando...' : 'Fazer Upgrade'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
                          >
                            Downgrade não disponível
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-800">Benefícios do Upgrade</h4>
                </div>
                <p className="text-purple-700 text-sm">
                  Ao fazer upgrade, você recebe imediatamente todos os créditos do novo plano e acesso às funcionalidades exclusivas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}