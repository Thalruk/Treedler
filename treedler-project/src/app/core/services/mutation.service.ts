import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId } from '../enums/resource.enum';

@Injectable({ providedIn: 'root' })
export class MutationService {
  private resourceService = inject(ResourceService);

  public activeMutationId = signal<string | null>(null);

  public denseBranchingProgress = signal<number>(0);
  public denseBranchingCompleted = signal<boolean>(false);

  public readonly denseBranchingTotal = 150;
  public readonly denseBranchingDrain = 3;

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
    if (this.activeMutationId() === 'dense_branching' && !this.denseBranchingCompleted()) {
      drain += this.denseBranchingDrain;
    }
    return drain;
  });

  public toggleMutation(id: string): void {
    if (this.activeMutationId() === id) {
      this.activeMutationId.set(null);
    } else {
      this.activeMutationId.set(id);
    }
  }

  public tick(deltaTime: number): void {
    const active = this.activeMutationId();
    if (!active) return;

    if (active === 'dense_branching' && !this.denseBranchingCompleted()) {
      const remaining = this.denseBranchingTotal - this.denseBranchingProgress();
      const maxDrain = this.denseBranchingDrain * deltaTime;
      const availableEnergy = this.resourceService.energy().amount;

      const actualDrain = Math.min(maxDrain, remaining, availableEnergy);

      if (actualDrain > 0) {
        this.resourceService.consume(ResourceId.Energy, actualDrain);
        this.denseBranchingProgress.update((p) => p + actualDrain);
      }

      if (this.denseBranchingProgress() >= this.denseBranchingTotal) {
        this.denseBranchingCompleted.set(true);
        this.activeMutationId.set(null);
      }
    }
  }
}
