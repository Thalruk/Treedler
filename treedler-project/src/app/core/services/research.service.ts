import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId } from '../enums/resource.enum';

@Injectable({ providedIn: 'root' })
export class ResearchService {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  private resourceService = inject(ResourceService);

  // ==========================================
  // 2. STATE (SIGNALS) & CONSTANTS
  // ==========================================

  public activeResearchId = signal<string | null>(null);

  public branchExpansionProgress = signal<number>(0);
  public branchExpansionCompleted = signal<boolean>(false);

  public readonly branchExpansionTotal = 150;
  public readonly branchExpansionDrain = 3;

  // ==========================================
  // 3. COMPUTED (DRAINS)
  // ==========================================

  public waterDrain = computed(() => {
    let drain = 0;
    return drain;
  });

  public mineralsDrain = computed(() => {
    let drain = 0;
    return drain;
  });

  public energyDrain = computed(() => {
    let drain = 0;
    if (this.activeResearchId() === 'branch_expansion' && !this.branchExpansionCompleted()) {
      drain += this.branchExpansionDrain;
    }
    return drain;
  });

  // ==========================================
  // 4. ACTIONS & LOGIC
  // ==========================================

  public toggleResearch(id: string): void {
    if (this.activeResearchId() === id) {
      this.activeResearchId.set(null);
    } else {
      this.activeResearchId.set(id);
    }
  }

  public tick(deltaTime: number): void {
    const active = this.activeResearchId();
    if (!active) return;

    if (active === 'branch_expansion' && !this.branchExpansionCompleted()) {
      const remaining = this.branchExpansionTotal - this.branchExpansionProgress();
      const maxDrain = this.branchExpansionDrain * deltaTime;
      const availableEnergy = this.resourceService.energy().amount;

      const actualDrain = Math.min(maxDrain, remaining, availableEnergy);

      if (actualDrain > 0) {
        this.resourceService.consume(ResourceId.Energy, actualDrain);
        this.branchExpansionProgress.update((p) => p + actualDrain);
      }

      if (this.branchExpansionProgress() >= this.branchExpansionTotal) {
        this.branchExpansionCompleted.set(true);
        this.activeResearchId.set(null);
      }
    }
  }
}
