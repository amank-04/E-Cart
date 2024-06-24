import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { PrivacyComponent } from '../modalsTemplates/privacy/privacy.component';
import { TermsComponent } from '../modalsTemplates/terms/terms.component';
import { ContactComponent } from '../modalsTemplates/contact/contact.component';
import { FaqComponent } from '../modalsTemplates/faq/faq.component';
import { ReturnComponent } from '../modalsTemplates/return/return.component';
import { ShippingComponent } from '../modalsTemplates/shipping/shipping.component';
import { TeamComponent } from '../modalsTemplates/team/team.component';
import { TechComponent } from '../modalsTemplates/tech/tech.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    PrivacyComponent,
    TermsComponent,
    ContactComponent,
    FaqComponent,
    ReturnComponent,
    ShippingComponent,
    TermsComponent,
    TechComponent,
    TeamComponent,
  ],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  modalService = inject(ModalService);

  closeModal() {
    this.modalService.modalType.set(null);
  }
}
