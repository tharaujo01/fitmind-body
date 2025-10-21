import { useEffect } from 'react';
import { notificationService } from '@/lib/notification-service';

export function useNotifications() {
  useEffect(() => {
    // Iniciar monitoramento de notificações
    notificationService.startMonitoring();

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup ao desmontar
    return () => {
      notificationService.stopMonitoring();
    };
  }, []);

  return {
    showNotification: notificationService.showNotification.bind(notificationService),
    notifyPaymentSuccess: notificationService.notifyPaymentSuccess.bind(notificationService),
    notifyPaymentFailure: notificationService.notifyPaymentFailure.bind(notificationService),
    notifyCreditsLow: notificationService.notifyCreditsLow.bind(notificationService),
    notifyCustomizationComplete: notificationService.notifyCustomizationComplete.bind(notificationService)
  };
}