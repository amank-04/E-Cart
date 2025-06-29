import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-banner',
    imports: [],
    templateUrl: './banner.component.html'
})
export class BannerComponent {
  modalService = inject(ModalService);
}
