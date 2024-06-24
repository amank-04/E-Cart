import { Component, inject } from '@angular/core';
import { NotifyService } from '../../../services/notify.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  notifyService = inject(NotifyService);
  modalService = inject(ModalService);

  sendEmail() {
    this.modalService.modalType.set(null);
    this.notifyService.setNotification('Email Sent Successfully', 'success');
  }
}
