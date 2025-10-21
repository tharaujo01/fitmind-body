"use client";

import React from 'react';
import { AlertTriangle, CreditCard, X } from 'lucide-react';
import { ACTION_COSTS } from '@/lib/credit-system';

interface CreditConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: keyof typeof ACTION_COSTS;
  currentCredits: number;
  actionDescription?: string;
}

export default function CreditConfirmation({
  isOpen,
  onClose,
  onConfirm,
  action,
  currentCredits,
  actionDescription
}: CreditConfirmationProps) {
  if (!isOpen) return null;

  const cost = ACTION_COSTS[action];
  const hasEnoughCredits = currentCredits >= cost;

  const actionDescriptions = {
    CREATE_WORKOUT: 'criar um novo treino personalizado',
    EDIT_WORKOUT: 'editar este treino',
    CREATE_DIET: 'criar uma nova dieta personalizada',
    EDIT_DIET: 'editar esta dieta',
    GENERATE_WORKOUT: 'gerar um treino automático',
    GENERATE_DIET: 'gerar uma dieta automática',
    SAVE_WORKOUT: 'salvar este treino',
    SAVE_DIET: 'salvar esta dieta'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            hasEnoughCredits ? 'bg-blue-100' : 'bg-red-100'
          }`}>
            {hasEnoughCredits ? (
              <CreditCard className={`w-8 h-8 text-blue-600`} />
            ) : (
              <AlertTriangle className={`w-8 h-8 text-red-600`} />
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {hasEnoughCredits ? 'Confirmar Ação' : 'Créditos Insuficientes'}
          </h3>

          {hasEnoughCredits ? (
            <>
              <p className="text-gray-600 mb-4">
                Esta ação irá {actionDescription || actionDescriptions[action]} e consumirá{' '}
                <span className="font-semibold text-blue-600">{cost} crédito{cost > 1 ? 's' : ''}</span>.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Saldo atual:</span>
                  <span className="font-semibold">{currentCredits} créditos</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-600">Após a ação:</span>
                  <span className="font-semibold text-blue-600">{currentCredits - cost} créditos</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Confirmar ({cost} crédito{cost > 1 ? 's' : ''})
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Você precisa de <span className="font-semibold text-red-600">{cost} crédito{cost > 1 ? 's' : ''}</span> para {actionDescriptions[action]}, 
                mas possui apenas <span className="font-semibold">{currentCredits} crédito{currentCredits !== 1 ? 's' : ''}</span>.
              </p>

              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  💡 <strong>Dica:</strong> Recarregue seus créditos ou faça upgrade do seu plano para continuar aproveitando todas as funcionalidades!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    // Aqui você pode navegar para a tela de recarga
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Recarregar Créditos
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}