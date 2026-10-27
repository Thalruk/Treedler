import { Injectable, signal, computed, inject } from '@angular/core';
import { MutationService } from './mutation.service';
import { UpgradeService } from './upgrade.service';
import { BloomService } from './bloom.service';
import { ROADMAP_CONFIG, RoadmapConfig } from '../config/roadmap.config';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  private mutationService = inject(MutationService);
  private bloomService = inject(BloomService);

  public isModalOpen = signal<boolean>(false);
  public config: RoadmapConfig = ROADMAP_CONFIG;

  public isEndGameReached = computed(() => {
    const allMutationsCompleted =
      this.mutationService.completedCount() >= this.config.requiredCompletedMutations;

    return allMutationsCompleted && this.bloomService.isFullyComplete();
  });

  public openModal(): void {
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
  }
}
