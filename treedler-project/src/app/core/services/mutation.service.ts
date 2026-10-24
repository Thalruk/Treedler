import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource.service';
import { ResourceId } from '../enums/resource.enum';
import { MutationDef } from '../models/mutation.model';
import { MUTATIONS_CONFIG } from '../config/mutation.config';

export type MutationProgress = Partial<Record<ResourceId, number>>;

@Injectable({ providedIn: 'root' })
export class MutationService {
  private resourceService = inject(ResourceService);

  // ==========================================
  // 1. STATE & CONFIG
  // ==========================================
  public activeMutationId = signal<string | null>(null);
  public progresses = signal<Record<string, MutationProgress>>({});
  public completed = signal<Record<string, boolean>>({});

  public readonly availableMutations: MutationDef[] = MUTATIONS_CONFIG;

  // ==========================================
  // 2. COMPUTED DRAINS
  // ==========================================
  private getDrain(resourceId: ResourceId): number {
    const active = this.activeMutationId();
    if (!active) return 0;

    const mutation = this.availableMutations.find((m) => m.id === active);
    if (!mutation || !mutation.costs) return 0;

    const cost = mutation.costs.find((c) => c.resourceId === resourceId);
    if (!cost) return 0;

    const currentProgress = this.progresses()[active] || {};
    const invested = currentProgress[resourceId] || 0;

    if (invested >= cost.totalRequired) return 0;

    return cost.drainPerSecond;
  }

  public energyDrain = computed(() => this.getDrain(ResourceId.Energy));
  public waterDrain = computed(() => this.getDrain(ResourceId.Water));
  public mineralsDrain = computed(() => this.getDrain(ResourceId.Minerals));

  // ==========================================
  // 3. ACTIONS & LOGIC
  // ==========================================
  public isCompleted(id: string): boolean {
    return this.completed()[id] || false;
  }

  public getProgress(id: string): number {
    const currentProgress = this.progresses()[id];
    if (!currentProgress) return 0;

    const mutation = this.availableMutations.find((m) => m.id === id);
    if (!mutation || !mutation.costs || mutation.costs.length === 0) return 0;

    let totalPercentage = 0;
    for (const cost of mutation.costs) {
      const invested = currentProgress[cost.resourceId] || 0;
      totalPercentage += Math.min(1, invested / cost.totalRequired);
    }

    return totalPercentage / mutation.costs.length;
  }

  public toggleMutation(id: string): void {
    this.activeMutationId.set(this.activeMutationId() === id ? null : id);
  }

  private completeMutation(id: string): void {
    this.completed.update((c) => ({ ...c, [id]: true }));
    this.activeMutationId.set(null);
  }

  public tick(deltaTime: number): void {
    const active = this.activeMutationId();
    if (!active) return;

    const mutation = this.availableMutations.find((m) => m.id === active);
    if (!mutation || this.isCompleted(active) || !mutation.costs || mutation.costs.length === 0) {
      this.activeMutationId.set(null);
      return;
    }

    const allProgresses = this.progresses();
    const currentInvested: MutationProgress = { ...(allProgresses[active] || {}) };

    let tickFraction = 1.0;
    let allCompleted = true;

    for (const cost of mutation.costs) {
      const invested = currentInvested[cost.resourceId] || 0;
      const remaining = cost.totalRequired - invested;

      if (remaining > 0) {
        allCompleted = false;
        const maxDrain = Math.min(cost.drainPerSecond * deltaTime, remaining);

        let available = 0;
        if (cost.resourceId === ResourceId.Energy) available = this.resourceService.energy().amount;
        else if (cost.resourceId === ResourceId.Water)
          available = this.resourceService.water().amount;
        else if (cost.resourceId === ResourceId.Minerals)
          available = this.resourceService.minerals().amount;

        if (available < maxDrain) {
          tickFraction = Math.min(tickFraction, available / maxDrain);
        }
      }
    }

    if (allCompleted) {
      this.completeMutation(active);
      return;
    }

    if (tickFraction > 0) {
      let updated = false;
      let fullyPaid = true;

      for (const cost of mutation.costs) {
        const invested = currentInvested[cost.resourceId] || 0;
        const remaining = cost.totalRequired - invested;

        if (remaining > 0) {
          const actualDrain = Math.min(cost.drainPerSecond * deltaTime, remaining) * tickFraction;

          if (actualDrain > 0) {
            this.resourceService.consume(cost.resourceId, actualDrain);
            currentInvested[cost.resourceId] = invested + actualDrain;
            updated = true;
          }

          if ((currentInvested[cost.resourceId] || 0) < cost.totalRequired) {
            fullyPaid = false;
          }
        }
      }

      if (updated) {
        this.progresses.update((p) => ({ ...p, [active]: currentInvested }));

        if (fullyPaid) {
          this.completeMutation(active);
        }
      }
    }
  }
}
