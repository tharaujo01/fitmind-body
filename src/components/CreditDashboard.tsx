"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  ArrowLeft,
  Zap,
  Crown,
  Plus,
  Minus
} from 'lucide-react';
import { creditSystem, CreditTransaction, ActionLog } from '@/lib/credit-system';
import CreditRecharge from './CreditRecharge';

interface CreditDashboardProps {
  onClose: () => void;
}

export default function CreditDashboard({ onClose }: CreditDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'logs'>('overview');
  const [showRecharge, setShowRecharge] = useState(false);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent' | 'purchased'>('all');

  const user = creditSystem.getCurrentUser();
  const currentPlan = creditSystem.getCurrentPlan();

  useEffect(() => {
    setTransactions(creditSystem.getTransactions());
    setActionLogs(creditSystem.getActionLogs());
  }, []);

  const refreshData = () => {
    setTransactions(creditSystem.getTransactions());
    setActionLogs(creditSystem.getActionLogs());
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.type === filter
  );

  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPurchased = transactions
    .filter(t => t.type === 'purchased')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showRecharge) {
    return (
      <CreditRecharge
        onClose={() => setShowRecharge(false)}
        onSuccess={() => {
          setShowRecharge(false);
          refreshData();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                <h2 className="text-2xl font-bold text-gray-900">Painel de Créditos</h2>
                <p className="text-gray-600">Gerencie seus créditos e acompanhe o histórico</p>
              </div>
            </div>
            <button
              onClick={() => setShowRecharge(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Recarregar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Transações
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                activeTab === 'logs'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              Histórico de Ações
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Saldo Atual</p>
                      <p className="text-3xl font-bold">{user.creditsBalance}</p>
                    </div>
                    <Zap className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Ganho</p>
                      <p className="text-3xl font-bold">{totalEarned}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Total Gasto</p>
                      <p className="text-3xl font-bold">{totalSpent}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Comprados</p>
                      <p className="text-3xl font-bold">{totalPurchased}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Plano Atual */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Plano {currentPlan.name}</h3>
                      <p className="text-gray-600">{currentPlan.monthlyCredits} créditos mensais</p>
                      <p className="text-sm text-gray-500">R$ {currentPlan.price.toFixed(2)}/mês</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRecharge(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Fazer Upgrade
                  </button>
                </div>
              </div>

              {/* Funcionalidades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Custos por Ação</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Criar treino</span>
                      <span className="font-semibold text-blue-600">1 crédito</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Editar treino</span>
                      <span className="font-semibold text-blue-600">1 crédito</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Criar dieta</span>
                      <span className="font-semibold text-blue-600">2 créditos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Editar dieta</span>
                      <span className="font-semibold text-blue-600">1 crédito</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Dicas de Economia</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>💡 Planeje seus treinos antes de criar para evitar edições</p>
                    <p>💡 Use a biblioteca de exercícios para inspiração</p>
                    <p>💡 Salve seus treinos favoritos para reutilizar</p>
                    <p>💡 Considere fazer upgrade para mais créditos mensais</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'Todas' },
                    { key: 'earned', label: 'Ganhos' },
                    { key: 'spent', label: 'Gastos' },
                    { key: 'purchased', label: 'Compras' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === key
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Transações */}
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma transação encontrada</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earned' ? 'bg-green-100' :
                          transaction.type === 'spent' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {transaction.type === 'earned' ? (
                            <Plus className={`w-5 h-5 text-green-600`} />
                          ) : transaction.type === 'spent' ? (
                            <Minus className={`w-5 h-5 text-red-600`} />
                          ) : (
                            <CreditCard className={`w-5 h-5 text-blue-600`} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'earned' ? 'text-green-600' :
                          transaction.type === 'spent' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {transaction.type === 'spent' ? '-' : '+'}
                          {Math.abs(transaction.amount)} crédito{Math.abs(transaction.amount) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Histórico de Ações</h3>
                <p className="text-gray-600">Acompanhe todas as ações que consumiram créditos</p>
              </div>

              <div className="space-y-3">
                {actionLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma ação registrada ainda</p>
                  </div>
                ) : (
                  actionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{log.action.replace(/_/g, ' ').toLowerCase()}</h4>
                        <span className="text-red-600 font-semibold">-{log.creditsConsumed} crédito{log.creditsConsumed !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{formatDate(log.createdAt)}</p>
                      {log.details && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}