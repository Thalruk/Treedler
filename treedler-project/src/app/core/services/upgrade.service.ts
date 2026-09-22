import { Injectable, signal, inject } from '@angular/core';
import { Upgrade } from '../models/upgrade.model';
import { ResourceService } from './resource';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  private resourceService = inject(ResourceService);

  public hasFirstRoot = signal<boolean>(false);
  public readonly firstRootCost = 5;

  public hasFirstStem = signal<boolean>(false);
  public readonly firstStemCost = 5;

  public buyFirstRoot(): void {
    if (!this.hasFirstRoot() && this.resourceService.water().amount >= this.firstRootCost) {
      this.resourceService.water.update((w) => ({
        ...w,
        amount: w.amount - this.firstRootCost,
        isUnlocked: true,
        generationPerSecond: 1,
      }));
      this.resourceService.minerals.update((m) => ({
        ...m,
        isUnlocked: true,
        generationPerSecond: 1,
      }));

      this.hasFirstRoot.set(true);
    }
  }

  public buyFirstStem(): void {
    if (!this.hasFirstStem() && this.resourceService.water().amount >= this.firstStemCost) {
      this.resourceService.water.update((w) => ({ ...w, amount: w.amount - this.firstStemCost }));
      this.resourceService.energy.update((e) => ({
        ...e,
        isUnlocked: true,
        generationPerSecond: 1,
      }));

      this.hasFirstStem.set(true);
    }
  }
}
