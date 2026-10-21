import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource'; // Zaktualizuj ścieżki, jeśli potrzebne
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
        hasPermanentLeafDiscount: this.upgradeService.hasPermanentLeafDiscount(),
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
        rootVigorLevel: this.upgradeService.rootVigor.level(),
      },
      storyline: {
        hasReachedLeafMilestone: this.storylineService.hasReachedLeafMilestone(),
        isMutationUnlocked: this.storylineService.isMutationUnlocked(),
        hasReached10Branches: this.storylineService.hasReached10Branches(),
        hasReachedFirstGrowth: this.storylineService.hasReachedFirstGrowth(),
        hasReached10Leaves: this.storylineService.hasReached10Leaves(),
      },
      mutations: {
        progresses: this.mutationService.progresses(),
        completed: this.mutationService.completed(),
      },
      logsData: {
        logs: this.logService.logs(),
        loggedFirstGrowth: this.logService.loggedFirstGrowth(),
        logged10Leaves: this.logService.logged10Leaves(),
        logged25Leaves: this.logService.logged25Leaves(),
        logged10Branches: this.logService.logged10Branches(),
        loggedMutation: this.logService.loggedMutation(),
      },
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

      if (parsed.upgrades) this.loadSignals(parsed.upgrades, this.upgradeService);
      if (parsed.storyline) this.loadSignals(parsed.storyline, this.storylineService);
      if (parsed.logsData) this.loadSignals(parsed.logsData, this.logService);

      if (parsed.logs && !parsed.logsData) {
        this.logService.logs.set(parsed.logs);
      }

      if (parsed.mutations) {
        if (parsed.mutations.progresses)
          this.mutationService.progresses.set(parsed.mutations.progresses);
        if (parsed.mutations.completed)
          this.mutationService.completed.set(parsed.mutations.completed);
      }
    } catch (e) {
      console.error('Save load error:', e);
    }
  }

  public hardReset(): void {
    localStorage.removeItem(this.SAVE_KEY);
    window.location.reload();
  }

  // ==========================================
  // 3. HELPER METHODS
  // ==========================================
  private loadSignals(savedSection: any, targetService: any): void {
    for (const key of Object.keys(savedSection)) {
      if (savedSection[key] !== undefined) {
        if (key.endsWith('Level')) {
          const upgradeKey = key.replace('Level', '');
          if (
            targetService[upgradeKey] &&
            typeof targetService[upgradeKey].level?.set === 'function'
          ) {
            targetService[upgradeKey].level.set(savedSection[key]);
          }
        } else if (targetService[key] && typeof targetService[key].set === 'function') {
          targetService[key].set(savedSection[key]);
        }
      }
    }
  }
}
