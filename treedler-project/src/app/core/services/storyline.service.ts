import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';
import { MutationService } from './mutation.service';

@Injectable({ providedIn: 'root' })
export class StorylineService {
  private upgradeService = inject(UpgradeService);
  private mutationService = inject(MutationService);

  // UNLOCK FLAGS FOR TABS
  public isMutationUnlocked = signal<boolean>(false);
  public isBloomUnlocked = signal<boolean>(false);

  // MILESTONE FLAGS
  public hasReachedFirstGrowth = signal<boolean>(false);
  public hasReached10Leaves = signal<boolean>(false);
  public hasReached10Branches = signal<boolean>(false);
  public hasReachedLeafMilestone = signal<boolean>(false);
  public hasReachedDeepAnchorage = signal<boolean>(false);
  public hasReachedAncientTimber = signal<boolean>(false);
  public hasReachedBloomMilestone = signal<boolean>(false);
  public hasReachedApexFlora = signal<boolean>(false);

  public checkMilestones(): void {
    const leaves = this.upgradeService.leaf.level();
    const branches = this.upgradeService.branch.level();
    const rootW = this.upgradeService.rootWidth.level();
    const rootD = this.upgradeService.rootDepth.level();
    const bark = this.upgradeService.barkThickness.level();
    const completedMutationsCount = Object.values(this.mutationService.completed()).filter(
      Boolean,
    ).length;

    // 1. First Growth
    if (
      !this.hasReachedFirstGrowth() &&
      this.upgradeService.hasFirstStem() &&
      this.upgradeService.hasFirstRoot()
    ) {
      this.hasReachedFirstGrowth.set(true);
    }

    // 2. Small Canopy (10 Leaves)
    if (!this.hasReached10Leaves() && leaves >= 10) {
      this.hasReached10Leaves.set(true);
    }

    // 3. Sturdy Framework (10 Branches) -> -1% Leaf Cost per Branch
    if (!this.hasReached10Branches() && branches >= 10) {
      this.hasReached10Branches.set(true);
      this.upgradeService.hasPermanentLeafDiscount.set(true);
    }

    // 4. Biological Adaptation (100 Leaves) -> Unlocks Mutations
    if (!this.hasReachedLeafMilestone() && leaves >= 100) {
      this.hasReachedLeafMilestone.set(true);
      this.isMutationUnlocked.set(true);
    }

    // 5. Deep Anchorage (Root Width 10 & Root Depth 10) -> x1.25 Root Production
    if (!this.hasReachedDeepAnchorage() && rootW >= 10 && rootD >= 10) {
      this.hasReachedDeepAnchorage.set(true);
      this.upgradeService.hasDeepAnchorageBonus.set(true);
    }

    // 6. Ancient Timber (Bark 10 & 3 Mutations) -> x1.25 Max Capacity
    if (!this.hasReachedAncientTimber() && bark >= 10 && completedMutationsCount >= 3) {
      this.hasReachedAncientTimber.set(true);
      this.upgradeService.hasAncientTimberBonus.set(true);
    }

    // 7. The Awakening (300 Leaves) -> Unlocks Life Cycle (Bloom)
    if (!this.hasReachedBloomMilestone() && leaves >= 300) {
      this.hasReachedBloomMilestone.set(true);
      this.isBloomUnlocked.set(true);
    }

    // 8. Apex Flora (500 Leaves & All 6 Mutations) -> x1.5 Total Energy
    if (!this.hasReachedApexFlora() && leaves >= 500 && completedMutationsCount >= 6) {
      this.hasReachedApexFlora.set(true);
      this.upgradeService.hasApexFloraBonus.set(true);
    }
  }
}
