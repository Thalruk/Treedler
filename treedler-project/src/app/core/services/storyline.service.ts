import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';
import { MutationService } from './mutation.service';
import { MilestoneId } from '../config/storyline.config';

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
  public isOverMutationUnlocked = signal<boolean>(false);

  public isMilestoneUnlocked(id: MilestoneId): boolean {
    switch (id) {
      case MilestoneId.FirstGrowth:
        return this.hasReachedFirstGrowth();
      case MilestoneId.Leaves10:
        return this.hasReached10Leaves();
      case MilestoneId.Branches10:
        return this.hasReached10Branches();
      case MilestoneId.MutationUnlocked:
        return this.hasReachedLeafMilestone();
      case MilestoneId.DeepAnchorage:
        return this.hasReachedDeepAnchorage();
      case MilestoneId.AncientTimber:
        return this.hasReachedAncientTimber();
      case MilestoneId.BloomUnlocked:
        return this.hasReachedBloomMilestone();
      case MilestoneId.ApexFlora:
        return this.hasReachedApexFlora();
      case MilestoneId.MetabolicOverdrive:
        return this.isOverMutationUnlocked();
    }
  }

  public checkMilestones(): void {
    const leaves = this.upgradeService.leaf.level();
    const branches = this.upgradeService.branch.level();
    const rootW = this.upgradeService.rootWidth.level();
    const rootD = this.upgradeService.rootDepth.level();
    const bark = this.upgradeService.barkThickness.level();
    const completedMutationsCount = Object.values(this.mutationService.completed()).filter(
      Boolean,
    ).length;

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

    if (!this.hasReachedDeepAnchorage() && rootW >= 10 && rootD >= 10) {
      this.hasReachedDeepAnchorage.set(true);
      this.upgradeService.hasDeepAnchorageBonus.set(true);
    }

    if (!this.hasReachedAncientTimber() && bark >= 10 && completedMutationsCount >= 3) {
      this.hasReachedAncientTimber.set(true);
      this.upgradeService.hasAncientTimberBonus.set(true);
    }

    if (!this.hasReachedBloomMilestone() && leaves >= 300) {
      this.hasReachedBloomMilestone.set(true);
      this.isBloomUnlocked.set(true);
    }

    if (!this.hasReachedApexFlora() && leaves >= 500 && completedMutationsCount >= 6) {
      this.hasReachedApexFlora.set(true);
      this.upgradeService.hasApexFloraBonus.set(true);
    }
    if (!this.isOverMutationUnlocked() && leaves >= 200) {
      this.isOverMutationUnlocked.set(true);
    }
  }
}
