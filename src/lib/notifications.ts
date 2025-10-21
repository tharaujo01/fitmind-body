import { Notification } from './types';

// Sistema de notificações inteligente
export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Notification[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Solicitar permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Configurar notificações de hidratação
  setupWaterReminders(userId: string, intervalHours: number = 1): void {
    this.clearWaterReminders(userId);

    const waterTimer = setInterval(() => {
      this.scheduleNotification({
        id: `water-${Date.now()}`,
        userId,
        type: 'water',
        title: '💧 Hora de beber água!',
        message: 'Mantenha-se hidratado para melhor performance nos treinos',
        scheduled: new Date(),
        sent: false,
        read: false
      });
    }, intervalHours * 60 * 60 * 1000);

    this.timers.set(`water-${userId}`, waterTimer);
  }

  // Configurar notificações de alimentação
  setupMealReminders(userId: string): void {
    this.clearMealReminders(userId);

    // Horários das refeições
    const mealTimes = [
      { hour: 8, minute: 0, meal: 'café da manhã' },
      { hour: 12, minute: 0, meal: 'almoço' },
      { hour: 15, minute: 30, meal: 'lanche da tarde' },
      { hour: 19, minute: 0, meal: 'jantar' }
    ];

    mealTimes.forEach(({ hour, minute, meal }) => {
      this.scheduleDailyNotification(userId, hour, minute, {
        type: 'meal',
        title: `🍽️ Hora do ${meal}!`,
        message: `Siga sua dieta personalizada para melhores resultados`
      });
    });
  }

  // Configurar lembretes de treino
  setupWorkoutReminders(userId: string, preferredTime: { hour: number, minute: number }): void {
    this.clearWorkoutReminders(userId);

    this.scheduleDailyNotification(userId, preferredTime.hour, preferredTime.minute, {
      type: 'workout',
      title: '💪 Hora do treino!',
      message: 'Seu corpo está esperando por você. Vamos treinar?'
    });
  }

  // Agendar notificação diária
  private scheduleDailyNotification(
    userId: string, 
    hour: number, 
    minute: number, 
    notification: Partial<Notification>
  ): void {
    const scheduleNext = () => {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hour, minute, 0, 0);

      // Se o horário já passou hoje, agendar para amanhã
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      const timer = setTimeout(() => {
        this.scheduleNotification({
          id: `${notification.type}-${userId}-${Date.now()}`,
          userId,
          scheduled: new Date(),
          sent: false,
          read: false,
          ...notification
        } as Notification);

        // Reagendar para o próximo dia
        scheduleNext();
      }, timeUntilNotification);

      this.timers.set(`${notification.type}-${userId}`, timer);
    };

    scheduleNext();
  }

  // Agendar uma notificação específica
  scheduleNotification(notification: Notification): void {
    this.notifications.push(notification);
    this.sendNotification(notification);
  }

  // Enviar notificação
  private async sendNotification(notification: Notification): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.log('Permissão para notificações negada');
      return;
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: notification.type,
        requireInteraction: false,
        silent: false
      });

      // Marcar como enviada
      notification.sent = true;

      // Auto-fechar após 5 segundos
      setTimeout(() => {
        browserNotification.close();
      }, 5000);

      // Adicionar evento de clique
      browserNotification.onclick = () => {
        window.focus();
        notification.read = true;
        browserNotification.close();
        
        // Redirecionar baseado no tipo
        if (notification.type === 'workout') {
          window.location.href = '/dashboard?tab=treinos';
        } else if (notification.type === 'water') {
          window.location.href = '/dashboard?tab=home';
        }
      };

    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  // Limpar lembretes específicos
  clearWaterReminders(userId: string): void {
    const timer = this.timers.get(`water-${userId}`);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(`water-${userId}`);
    }
  }

  clearMealReminders(userId: string): void {
    const timer = this.timers.get(`meal-${userId}`);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(`meal-${userId}`);
    }
  }

  clearWorkoutReminders(userId: string): void {
    const timer = this.timers.get(`workout-${userId}`);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(`workout-${userId}`);
    }
  }

  // Limpar todas as notificações de um usuário
  clearAllReminders(userId: string): void {
    this.clearWaterReminders(userId);
    this.clearMealReminders(userId);
    this.clearWorkoutReminders(userId);
  }

  // Obter notificações não lidas
  getUnreadNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => 
      n.userId === userId && !n.read
    );
  }

  // Marcar notificação como lida
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Notificação de conquista
  sendAchievementNotification(userId: string, achievement: string, points: number): void {
    this.scheduleNotification({
      id: `achievement-${userId}-${Date.now()}`,
      userId,
      type: 'achievement',
      title: '🏆 Nova Conquista!',
      message: `${achievement} - Você ganhou ${points} pontos!`,
      scheduled: new Date(),
      sent: false,
      read: false
    });
  }

  // Notificação de streak
  sendStreakNotification(userId: string, streakDays: number): void {
    let message = '';
    let title = '';

    if (streakDays === 7) {
      title = '🔥 Uma semana de dedicação!';
      message = 'Parabéns! Você treinou por 7 dias seguidos!';
    } else if (streakDays === 30) {
      title = '🔥 Um mês incrível!';
      message = 'Fantástico! 30 dias de treinos consecutivos!';
    } else if (streakDays % 10 === 0) {
      title = `🔥 ${streakDays} dias de fogo!`;
      message = `Sua dedicação é inspiradora! ${streakDays} dias seguidos!`;
    } else {
      return; // Não enviar notificação para outros números
    }

    this.scheduleNotification({
      id: `streak-${userId}-${Date.now()}`,
      userId,
      type: 'achievement',
      title,
      message,
      scheduled: new Date(),
      sent: false,
      read: false
    });
  }
}

// Funções utilitárias para usar no componente
export const notificationManager = NotificationManager.getInstance();

// Hook personalizado para notificações (para usar em componentes React)
export function useNotifications(userId: string, enabled: boolean = true) {
  const setupNotifications = (waterInterval: number = 1) => {
    if (!enabled) return;
    
    notificationManager.setupWaterReminders(userId, waterInterval);
    notificationManager.setupMealReminders(userId);
  };

  const setupWorkoutReminder = (hour: number, minute: number) => {
    if (!enabled) return;
    
    notificationManager.setupWorkoutReminders(userId, { hour, minute });
  };

  const clearAll = () => {
    notificationManager.clearAllReminders(userId);
  };

  const sendAchievement = (achievement: string, points: number) => {
    notificationManager.sendAchievementNotification(userId, achievement, points);
  };

  const sendStreak = (days: number) => {
    notificationManager.sendStreakNotification(userId, days);
  };

  return {
    setupNotifications,
    setupWorkoutReminder,
    clearAll,
    sendAchievement,
    sendStreak,
    getUnread: () => notificationManager.getUnreadNotifications(userId),
    markAsRead: (id: string) => notificationManager.markAsRead(id)
  };
}