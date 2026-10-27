import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapService } from '../../../core/services/roadmap.service';

@Component({
  selector: 'app-roadmap-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap-modal.html',
})
export class RoadmapModalComponent {
  public roadmapService = inject(RoadmapService);
}
