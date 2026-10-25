import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource.service';
import { ResourceId } from '../enums/resource.enum';
import { BLOOM_STAGES } from '../config/bloom.config';

export type BloomProgress = Partial<Record<ResourceId, number>>;

@Injectable({ providedIn: 'root' })
export class BloomService {
  private resourceService = inject(ResourceService);

  // ==========================================
  // 1. STATE
  // ==========================================
  public currentStageIndex = signal<number>(0);
  public isActive = signal<boolean>(false);
  public invested = signal<BloomProgress>({});
  public isFullyComplete = signal<boolean>(false);

  public readonly stages = BLOOM_STAGES;

  public currentStage = computed(() => {
    const index = this.currentStageIndex();
    return index < this.stages.length ? this.stages[index] : null;
  });

  public stageProgress = computed(() => {
    const stage = this.currentStage();
    if (!stage) return 0;

    const currentInvested = this.invested();
    let totalPercentage = 0;

    for (const cost of stage.costs) {
      const amount = currentInvested[cost.resourceId] || 0;
      totalPercentage += Math.min(1, amount / cost.totalRequired);
    }

    return totalPercentage / stage.costs.length;
  });

  // ==========================================
  // 2. COMPUTED DRAINS
  // ==========================================
  private getDrain(resourceId: ResourceId): number {
    if (!this.isActive() || this.isFullyComplete()) return 0;

    const stage = this.currentStage();
    if (!stage) return 0;

    const cost = stage.costs.find((c) => c.resourceId === resourceId);
    if (!cost) return 0;

    const currentInvested = this.invested()[resourceId] || 0;
    if (currentInvested >= cost.totalRequired) return 0;

    return cost.drainPerSecond;
  }

  public energyDrain = computed(() => this.getDrain(ResourceId.Energy));
  public waterDrain = computed(() => this.getDrain(ResourceId.Water));
  public mineralsDrain = computed(() => this.getDrain(ResourceId.Minerals));

  // ==========================================
  // 3. ACTIONS
  // ==========================================
  public toggleActive(): void {
    if (!this.isFullyComplete()) {
      this.isActive.set(!this.isActive());
    }
  }

  private completeCurrentStage(): void {
    this.isActive.set(false);
    this.invested.set({});

    const nextIndex = this.currentStageIndex() + 1;
    if (nextIndex >= this.stages.length) {
      this.isFullyComplete.set(true);
    } else {
      this.currentStageIndex.set(nextIndex);
    }
  }

  // ==========================================
  // 4. GAME LOOP
  // ==========================================
  public tick(deltaTime: number): void {
    if (!this.isActive() || this.isFullyComplete()) return;

    const stage = this.currentStage();
    if (!stage) return;

    const currentInvested: BloomProgress = { ...this.invested() };
    let tickFraction = 1.0;
    let allCompleted = true;

    for (const cost of stage.costs) {
      const amount = currentInvested[cost.resourceId] || 0;
      const remaining = cost.totalRequired - amount;

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
      this.completeCurrentStage();
      return;
    }

    if (tickFraction > 0) {
      let updated = false;
      let fullyPaid = true;

      for (const cost of stage.costs) {
        const amount = currentInvested[cost.resourceId] || 0;
        const remaining = cost.totalRequired - amount;

        if (remaining > 0) {
          const actualDrain = Math.min(cost.drainPerSecond * deltaTime, remaining) * tickFraction;

          if (actualDrain > 0) {
            this.resourceService.consume(cost.resourceId, actualDrain);
            currentInvested[cost.resourceId] = amount + actualDrain;
            updated = true;
          }

          if ((currentInvested[cost.resourceId] || 0) < cost.totalRequired) {
            fullyPaid = false;
          }
        }
      }

      if (updated) {
        this.invested.set(currentInvested);

        if (fullyPaid) {
          this.completeCurrentStage();
        }
      }
    }
  }
}
