import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MutationService } from '../../../core/services/mutation.service';

@Component({
  selector: 'app-mutation-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mutation-tab.html',
})
export class MutationTabComponent {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  public mutationService = inject(MutationService);
}
