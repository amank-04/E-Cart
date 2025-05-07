import { Component, inject } from '@angular/core';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-notification',
    imports: [],
    templateUrl: './notification.component.html'
})
export class NotificationComponent {
  notifyService = inject(NotifyService);
}
