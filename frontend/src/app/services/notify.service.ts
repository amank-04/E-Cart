import { Injectable, signal } from '@angular/core';

interface Notification {
  message: string;
  type?: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  notification = signal<null | Notification>(null);

  setNotification(message: string, type: 'success' | 'error') {
    this.notification.set({ message, type });

    setTimeout(() => {
      this.notification.set(null);
    }, 2000);
  }
}
