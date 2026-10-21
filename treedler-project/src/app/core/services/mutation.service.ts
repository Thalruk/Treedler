import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId } from '../enums/resource.enum';
import { MutationDef } from '../models/mutation.model';
import { MUTATIONS_CONFIG } from '../config/mutation.config';

@Injectable({ providedIn: 'root' })
export class MutationService {
  private resourceService = inject(ResourceService);

  // ==========================================
  // 1. STATE & CONFIG
  // ==========================================

  public activeMutationId = signal<string | null>(null);
  public progresses = signal<Record<string, number>>({});
  public completed = signal<Record<string, boolean>>({});

  public readonly availableMutations: MutationDef[] = MUTATIONS_CONFIG;

  // ==========================================
  // 2. COMPUTED DRAINS
  // ==========================================

  public energyDrain = computed(() => {
    const active = this.activeMutationId();
    if (!active) return 0;
    const mutation = this.availableMutations.find((m) => m.id === active);
    return mutation ? mutation.drainPerSecond : 0;
  });

  public waterDrain = computed(() => 0);
  public mineralsDrain = computed(() => 0);

  // ==========================================
  // 3. ACTIONS & LOGIC
  // ==========================================

  public isCompleted(id: string): boolean {
    return this.completed()[id] || false;
  }

  public getProgress(id: string): number {
    return this.progresses()[id] || 0;
  }

  public toggleMutation(id: string): void {
    this.activeMutationId.set(this.activeMutationId() === id ? null : id);
  }

  public tick(deltaTime: number): void {
    const active = this.activeMutationId();
    if (!active) return;

    const mutation = this.availableMutations.find((m) => m.id === active);
    if (!mutation || this.isCompleted(active)) {
      this.activeMutationId.set(null);
      return;
    }

    const currentProgress = this.getProgress(active);
    const remaining = mutation.totalEnergyCost - currentProgress;
    const maxDrain = mutation.drainPerSecond * deltaTime;
    const availableEnergy = this.resourceService.energy().amount;

    const actualDrain = Math.min(maxDrain, remaining, availableEnergy);

    if (actualDrain > 0) {
      this.resourceService.consume(ResourceId.Energy, actualDrain);
      this.progresses.update((p) => ({ ...p, [active]: (p[active] || 0) + actualDrain }));
    }

    if (currentProgress + actualDrain >= mutation.totalEnergyCost) {
      this.completed.update((c) => ({ ...c, [active]: true }));
      this.activeMutationId.set(null);
    }
  }
}
