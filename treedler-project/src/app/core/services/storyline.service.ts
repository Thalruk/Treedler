import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';

@Injectable({ providedIn: 'root' })
export class StorylineService {
  private upgradeService = inject(UpgradeService);

  public isMutationUnlocked = signal<boolean>(false);

  public hasReachedFirstGrowth = signal<boolean>(false);
  public hasReached10Leaves = signal<boolean>(false);
  public hasReached10Branches = signal<boolean>(false);
  public hasReachedLeafMilestone = signal<boolean>(false);
  public isBloomUnlocked = signal<boolean>(false);

  public checkMilestones(): void {
    const leaves = this.upgradeService.leaf.level();
    const branches = this.upgradeService.branch.level();

    if (
      !this.hasReachedFirstGrowth() &&
      this.upgradeService.hasFirstStem() &&
      this.upgradeService.hasFirstRoot()
    ) {
      this.hasReachedFirstGrowth.set(true);
    }

    if (!this.hasReached10Leaves() && leaves >= 10) {
      this.hasReached10Leaves.set(true);
    }

    if (!this.hasReached10Branches() && branches >= 10) {
      this.hasReached10Branches.set(true);
      this.upgradeService.hasPermanentLeafDiscount.set(true);
    }

    if (!this.hasReachedLeafMilestone() && leaves >= 100) {
      this.hasReachedLeafMilestone.set(true);
      this.isMutationUnlocked.set(true);
    }
    if (!this.isBloomUnlocked() && leaves >= 250) {
      this.isBloomUnlocked.set(true);
    }
  }
}
