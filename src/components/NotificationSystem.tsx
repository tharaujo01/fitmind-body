'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Simular notificações do sistema
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Pagamento Aprovado!',
        message: 'Seu plano mensal foi ativado com sucesso. Bem-vindo ao FitMind Body!',
        timestamp: new Date(),
        read: false,
        action: {
          label: 'Ver Plano',
          onClick: () => console.log('Navegando para plano')
        }
      },
      {
        id: '2',
        type: 'info',
        title: 'Novo Treino Disponível',
        message: 'Seu plano foi atualizado automaticamente com novos exercícios para este mês.',
        timestamp: new Date(Date.now() - 86400000), // 1 dia atrás
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'Créditos Baixos',
        message: 'Você tem apenas 15 créditos restantes. Considere comprar mais para continuar personalizando.',
        timestamp: new Date(Date.now() - 172800000), // 2 dias atrás
        read: true,
        action: {
          label: 'Comprar Créditos',
          onClick: () => window.open('https://pay.kiwify.com.br/k88c9zn', '_blank')
        }
      }
    ];

    setNotifications(mockNotifications);

    // Verificar atualizações automáticas
    checkForAutomaticUpdates();
  }, []);

  const checkForAutomaticUpdates = () => {
    // Verificar se é hora de gerar novo plano
    const lastUpdate = localStorage.getItem('lastPlanUpdate');
    const planType = localStorage.getItem('userPlanType');
    
    if (lastUpdate && planType) {
      const daysSinceUpdate = Math.floor(
        (Date.now() - parseInt(lastUpdate)) / (1000 * 60 * 60 * 24)
      );
      
      const updateInterval = getUpdateInterval(planType);
      
      if (daysSinceUpdate >= updateInterval) {
        addNotification({
          type: 'info',
          title: 'Atualização Automática',
          message: 'Seu plano foi atualizado automaticamente com novos exercícios e progressões!',
          action: {
            label: 'Ver Novo Plano',
            onClick: () => console.log('Ver novo plano')
          }
        });
        
        // Atualizar timestamp
        localStorage.setItem('lastPlanUpdate', Date.now().toString());
      }
    }
  };

  const getUpdateInterval = (planType: string): number => {
    const intervals: Record<string, number> = {
      'weekly': 7,
      'monthly': 30,
      'quarterly': 30,
      'biannual': 30,
      'annual': 30
    };
    return intervals[planType] || 30;
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notificações</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getBgColor(notification.type)} ${
                      !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                        <p className={`text-sm mt-1 ${
                          !notification.read ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">
                            {notification.timestamp.toLocaleDateString('pt-BR')}
                          </span>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                              className="text-xs bg-[#FF4D22] text-white px-3 py-1 rounded-full hover:bg-[#FF6B47] transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Hook para usar o sistema de notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove após 5 segundos para notificações de sucesso
    if (notification.type === 'success') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Notificações específicas do sistema
  const notifyPaymentSuccess = (planName: string) => {
    addNotification({
      type: 'success',
      title: 'Pagamento Aprovado!',
      message: `Seu ${planName} foi ativado com sucesso. Bem-vindo ao FitMind Body!`,
      action: {
        label: 'Ver Dashboard',
        onClick: () => window.location.href = '/dashboard'
      }
    });
  };

  const notifyPaymentFailure = (error: string) => {
    addNotification({
      type: 'error',
      title: 'Falha no Pagamento',
      message: `Não foi possível processar seu pagamento: ${error}`,
      action: {
        label: 'Tentar Novamente',
        onClick: () => window.location.reload()
      }
    });
  };

  const notifyPlanUpdate = () => {
    addNotification({
      type: 'info',
      title: 'Plano Atualizado!',
      message: 'Seu treino foi atualizado automaticamente com novos exercícios e progressões.',
      action: {
        label: 'Ver Novo Plano',
        onClick: () => window.location.href = '/dashboard?tab=workout'
      }
    });
  };

  const notifyLowCredits = (currentCredits: number) => {
    addNotification({
      type: 'warning',
      title: 'Créditos Baixos',
      message: `Você tem apenas ${currentCredits} créditos restantes. Compre mais para continuar personalizando.`,
      action: {
        label: 'Comprar Créditos',
        onClick: () => window.open('https://pay.kiwify.com.br/k88c9zn', '_blank')
      }
    });
  };

  const notifyCreditsAdded = (amount: number) => {
    addNotification({
      type: 'success',
      title: 'Créditos Adicionados!',
      message: `${amount} créditos foram adicionados à sua conta com sucesso.`
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    notifyPaymentSuccess,
    notifyPaymentFailure,
    notifyPlanUpdate,
    notifyLowCredits,
    notifyCreditsAdded
  };
}