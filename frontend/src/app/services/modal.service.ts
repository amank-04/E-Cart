import { Injectable, signal } from '@angular/core';

type ModalType =
  | 'privacy'
  | 'terms'
  | 'tech'
  | 'contact'
  | 'team'
  | 'shipping'
  | 'return'
  | 'faq';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalType = signal<null | ModalType>(null);

  setModal(type: ModalType) {
    setTimeout(() => {
      this.modalType.set(type);
    }, 1);
  }
}
