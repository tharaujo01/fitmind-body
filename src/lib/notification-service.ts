import { fitnessService } from './fitness-service';

class NotificationService {
  private checkInterval: NodeJS.Timeout | null = null;

  startMonitoring() {
    // Verificar a cada hora se há renovações pendentes
    this.checkInterval = setInterval(() => {
      this.checkPlanRenewals();
    }, 60 * 60 * 1000); // 1 hora

    // Verificar imediatamente
    this.checkPlanRenewals();
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private checkPlanRenewals() {
    const user = fitnessService.getUser();
    if (!user || !user.selectedPlan) return;

    const plan = user.selectedPlan;
    const now = new Date();
    const planStart = new Date(plan.selectedAt);
    const daysSinceStart = Math.floor((now.getTime() - planStart.getTime()) / (1000 * 60 * 60 * 24));

    // Verificar se é hora de renovar (a cada 30 dias para planos de longa duração)
    const shouldRenew = this.shouldRenewPlan(plan.planId, daysSinceStart);

    if (shouldRenew) {
      this.renewPlanAndNotify();
    }
  }

  private shouldRenewPlan(planId: string, daysSinceStart: number): boolean {
    // Planos que renovam automaticamente a cada mês
    const longTermPlans = ['quarterly', 'biannual', 'annual'];
    
    if (!longTermPlans.includes(planId)) return false;

    // Renovar a cada 30 dias
    return daysSinceStart > 0 && daysSinceStart % 30 === 0;
  }

  private renewPlanAndNotify() {
    const success = fitnessService.renewPlan();
    
    if (success) {
      this.showNotification(
        'Novo Ciclo Disponível! 🎉',
        'Seus novos treinos e dietas foram gerados automaticamente. Confira agora!',
        'success'
      );
    }
  }

  showNotification(title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
    // Verificar se o navegador suporta notificações
    if ('Notification' in window) {
      // Solicitar permissão se necessário
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.createNotification(title, message, type);
          }
        });
      } else if (Notification.permission === 'granted') {
        this.createNotification(title, message, type);
      }
    }

    // Também mostrar notificação in-app
    this.showInAppNotification(title, message, type);
  }

  private createNotification(title: string, message: string, type: string) {
    const notification = new Notification(title, {
      body: message,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'fitmind-notification',
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close após 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  private showInAppNotification(title: string, message: string, type: string) {
    // Criar elemento de notificação in-app
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300 translate-x-full`;
    
    // Cores baseadas no tipo
    const colors = {
      success: 'border-green-500',
      info: 'border-blue-500',
      warning: 'border-yellow-500',
      error: 'border-red-500'
    };
    
    notification.classList.add(colors[type] || colors.info);
    
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-800">${title}</h4>
          <p class="text-sm text-gray-600 mt-1">${message}</p>
        </div>
        <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Auto-remove após 5 segundos
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // Notificações específicas do sistema
  notifyPaymentSuccess(planName: string) {
    this.showNotification(
      'Pagamento Confirmado! ✅',
      `Seu ${planName} foi ativado com sucesso. Bem-vindo ao FitMind Body!`,
      'success'
    );
  }

  notifyPaymentFailure() {
    this.showNotification(
      'Falha no Pagamento ❌',
      'Houve um problema com seu pagamento. Tente novamente ou entre em contato conosco.',
      'error'
    );
  }

  notifyCreditsLow() {
    this.showNotification(
      'Créditos Baixos ⚠️',
      'Você tem poucos créditos restantes. Considere comprar mais para continuar personalizando.',
      'warning'
    );
  }

  notifyCustomizationComplete(type: string) {
    this.showNotification(
      'Personalização Concluída! 🎯',
      `Sua ${type} foi atualizada com sucesso. Confira as mudanças!`,
      'success'
    );
  }
}

export const notificationService = new NotificationService();