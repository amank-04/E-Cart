import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html'
})
export class FooterComponent {
  modalService = inject(ModalService);
}
