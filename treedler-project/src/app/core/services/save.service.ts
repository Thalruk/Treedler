import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource';
import { UpgradeService } from './upgrade.service';

@Injectable({ providedIn: 'root' })
export class SaveService {
  // ==========================================
  // 1. INJECTIONS & CONSTANTS
  // ==========================================

  private resourceService = inject(ResourceService);
  private upgradeService = inject(UpgradeService);

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
        rootWidthLevel: this.upgradeService.rootWidthLevel(),
        rootDepthLevel: this.upgradeService.rootDepthLevel(),
        barkThicknessLevel: this.upgradeService.barkThicknessLevel(),
        leafLevel: this.upgradeService.leafLevel(),
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

      if (parsed.upgrades) {
        if (parsed.upgrades.hasFirstRoot !== undefined)
          this.upgradeService.hasFirstRoot.set(parsed.upgrades.hasFirstRoot);
        if (parsed.upgrades.hasFirstStem !== undefined)
          this.upgradeService.hasFirstStem.set(parsed.upgrades.hasFirstStem);
        if (parsed.upgrades.rootWidthLevel !== undefined)
          this.upgradeService.rootWidthLevel.set(parsed.upgrades.rootWidthLevel);
        if (parsed.upgrades.rootDepthLevel !== undefined)
          this.upgradeService.rootDepthLevel.set(parsed.upgrades.rootDepthLevel);
        if (parsed.upgrades.barkThicknessLevel !== undefined)
          this.upgradeService.barkThicknessLevel.set(parsed.upgrades.barkThicknessLevel);
        if (parsed.upgrades.leafLevel !== undefined)
          this.upgradeService.leafLevel.set(parsed.upgrades.leafLevel);
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
