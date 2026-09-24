import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchService } from '../../../core/services/research.service';

@Component({
  selector: 'app-research-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research-tab.html',
})
export class ResearchTabComponent {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  public researchService = inject(ResearchService);
}
