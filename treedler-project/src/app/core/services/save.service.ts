import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource';
import { UpgradeService } from './upgrade.service';
import { StorylineService } from './storyline.service';
import { MutationService } from './mutation.service';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class SaveService {
  // ==========================================
  // 1. INJECTIONS & CONSTANTS
  // ==========================================

  private resourceService = inject(ResourceService);
  private upgradeService = inject(UpgradeService);
  private storylineService = inject(StorylineService);
  private mutationService = inject(MutationService);
  private logService = inject(LogService);
  private readonly SAVE_KEY = 'treedler_save';

  // ==========================================
  // 2. ACTIONS
  // ==========================================

  public saveGame(): void {
    const saveState = {
      resources: {
        water: this.resourceService.water(),
        minerals: this.resourceService.minerals(),
        energy: this.resourceService.energy(),
      },
      upgrades: {
        hasFirstRoot: this.upgradeService.hasFirstRoot(),
        hasFirstStem: this.upgradeService.hasFirstStem(),
        rootWidthLevel: this.upgradeService.rootWidth.level(),
        rootDepthLevel: this.upgradeService.rootDepth.level(),
        barkThicknessLevel: this.upgradeService.barkThickness.level(),
        branchLevel: this.upgradeService.branch.level(),
        leafLevel: this.upgradeService.leaf.level(),
        sunwardReachLevel: this.upgradeService.sunwardReach.level(),
        vascularTissuesLevel: this.upgradeService.vascularTissues.level(),
        rootHairsLevel: this.upgradeService.rootHairs.level(),
        canopySpreadLevel: this.upgradeService.canopySpread.level(),
        resinSecretionLevel: this.upgradeService.resinSecretion.level(),
        mycorrhizalNetworkLevel: this.upgradeService.mycorrhizalNetwork.level(),
      },
      storyline: {
        hasReachedLeafMilestone: this.storylineService.hasReachedLeafMilestone(),
        isMutationUnlocked: this.storylineService.isMutationUnlocked(),
      },
      mutations: {
        denseBranchingProgress: this.mutationService.denseBranchingProgress(),
        denseBranchingCompleted: this.mutationService.denseBranchingCompleted(),
      },
      logs: this.logService.logs(),
    };
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveState));
  }

  public loadGame(): void {
    const savedData = localStorage.getItem(this.SAVE_KEY);
    if (!savedData) return;
    try {
      const parsed = JSON.parse(savedData);

      if (parsed.resources) {
        if (parsed.resources.water) this.resourceService.water.set(parsed.resources.water);
        if (parsed.resources.minerals) this.resourceService.minerals.set(parsed.resources.minerals);
        if (parsed.resources.energy) this.resourceService.energy.set(parsed.resources.energy);
      }

      if (parsed.upgrades) {
        if (parsed.upgrades.hasFirstRoot !== undefined)
          this.upgradeService.hasFirstRoot.set(parsed.upgrades.hasFirstRoot);
        if (parsed.upgrades.hasFirstStem !== undefined)
          this.upgradeService.hasFirstStem.set(parsed.upgrades.hasFirstStem);
        if (parsed.upgrades.rootWidthLevel !== undefined)
          this.upgradeService.rootWidth.level.set(parsed.upgrades.rootWidthLevel);
        if (parsed.upgrades.rootDepthLevel !== undefined)
          this.upgradeService.rootDepth.level.set(parsed.upgrades.rootDepthLevel);
        if (parsed.upgrades.barkThicknessLevel !== undefined)
          this.upgradeService.barkThickness.level.set(parsed.upgrades.barkThicknessLevel);
        if (parsed.upgrades.branchLevel !== undefined)
          this.upgradeService.branch.level.set(parsed.upgrades.branchLevel);
        if (parsed.upgrades.leafLevel !== undefined)
          this.upgradeService.leaf.level.set(parsed.upgrades.leafLevel);
        if (parsed.upgrades.sunwardReachLevel !== undefined)
          this.upgradeService.sunwardReach.level.set(parsed.upgrades.sunwardReachLevel);
        if (parsed.upgrades.vascularTissuesLevel !== undefined)
          this.upgradeService.vascularTissues.level.set(parsed.upgrades.vascularTissuesLevel);
        if (parsed.upgrades.rootHairsLevel !== undefined)
          this.upgradeService.rootHairs.level.set(parsed.upgrades.rootHairsLevel);
        if (parsed.upgrades.canopySpreadLevel !== undefined)
          this.upgradeService.canopySpread.level.set(parsed.upgrades.canopySpreadLevel);
        if (parsed.upgrades.resinSecretionLevel !== undefined)
          this.upgradeService.resinSecretion.level.set(parsed.upgrades.resinSecretionLevel);
        if (parsed.upgrades.mycorrhizalNetworkLevel !== undefined)
          this.upgradeService.mycorrhizalNetwork.level.set(parsed.upgrades.mycorrhizalNetworkLevel);
      }

      if (parsed.storyline) {
        if (parsed.storyline.hasReachedLeafMilestone !== undefined)
          this.storylineService.hasReachedLeafMilestone.set(
            parsed.storyline.hasReachedLeafMilestone,
          );
        if (parsed.storyline.isMutationUnlocked !== undefined)
          this.storylineService.isMutationUnlocked.set(parsed.storyline.isMutationUnlocked);
      }

      if (parsed.mutations) {
        if (parsed.mutations.denseBranchingProgress !== undefined)
          this.mutationService.denseBranchingProgress.set(parsed.mutations.denseBranchingProgress);
        if (parsed.mutations.denseBranchingCompleted !== undefined)
          this.mutationService.denseBranchingCompleted.set(
            parsed.mutations.denseBranchingCompleted,
          );
      }
      if (parsed.logs) {
        this.logService.logs.set(parsed.logs);
      }
    } catch (e) {
      console.error('Save load error:', e);
    }
  }

  public hardReset(): void {
    localStorage.removeItem(this.SAVE_KEY);
    window.location.reload();
  }
}
