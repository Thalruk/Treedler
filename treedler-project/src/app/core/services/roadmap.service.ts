import { Injectable, signal, computed, inject } from '@angular/core';
import { MutationService } from './mutation.service';
import { UpgradeService } from './upgrade.service';
import { ROADMAP_CONFIG, RoadmapConfig } from '../config/roadmap.config';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  private mutationService = inject(MutationService);
  private upgradeService = inject(UpgradeService);

  public isModalOpen = signal<boolean>(false);
  public config: RoadmapConfig = ROADMAP_CONFIG;

  public isEndGameReached = computed(() => {
    const allMutationsCompleted =
      this.mutationService.completedCount() >= this.config.requiredCompletedMutations;
    const highLevelBranch = this.upgradeService.branch.level() >= this.config.requiredBranchLevel;

    return allMutationsCompleted || highLevelBranch;
  });

  public openModal(): void {
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
  }
}
