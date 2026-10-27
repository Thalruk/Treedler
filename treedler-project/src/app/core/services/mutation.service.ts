import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource.service';
import { ResourceId } from '../enums/resource.enum';
import { MutationId } from '../enums/mutation.enum';
import { UpgradeId } from '../enums/upgrade.enum';
import { MutationDef } from '../models/mutation.model';
import { MUTATIONS_CONFIG } from '../config/mutation.config';

export type MutationProgress = Partial<Record<ResourceId, number>>;

@Injectable({ providedIn: 'root' })
export class MutationService {
  private resourceService = inject(ResourceService);

  // Funkcja pomocnicza rejestrowana przez UpgradeService (unika Circular Dependency)
  private upgradeLevelLookup: ((id: UpgradeId) => number) | null = null;

  public registerUpgradeLevelLookup(fn: (id: UpgradeId) => number): void {
    this.upgradeLevelLookup = fn;
  }

  // ==========================================
  // 1. STATE & CONFIG
  // ==========================================
  public activeMutationId = signal<MutationId | null>(null);
  public progresses = signal<Partial<Record<MutationId, MutationProgress>>>({});
  public completed = signal<Partial<Record<MutationId, boolean>>>({});

  public isOverMutationEnabled = signal<boolean>(false);
  public readonly OVER_MUTATION_BONUS_PER_MULTIPLE = 0.05; // +5% speed per extra multiple

  public readonly availableMutations: MutationDef[] = MUTATIONS_CONFIG;

  // ==========================================
  // 2. REQUIREMENTS & VISIBILITY
  // ==========================================

  public getUpgradeLevel(id: UpgradeId): number {
    return this.upgradeLevelLookup ? this.upgradeLevelLookup(id) : 0;
  }

  public areUpgradeRequirementsMet(id: MutationId): boolean {
    const mutation = this.availableMutations.find((m) => m.id === id);
    if (!mutation || !mutation.requiredUpgrades || mutation.requiredUpgrades.length === 0) {
      return true;
    }
    return mutation.requiredUpgrades.every(
      (req) => this.getUpgradeLevel(req.upgradeId) >= req.level,
    );
  }

  public getUpgradeRequirementsStatus(
    id: MutationId,
  ): { label: string; current: number; required: number; met: boolean }[] {
    const mutation = this.availableMutations.find((m) => m.id === id);
    if (!mutation || !mutation.requiredUpgrades) return [];

    return mutation.requiredUpgrades.map((req) => {
      const current = this.getUpgradeLevel(req.upgradeId);
      return {
        label: req.label,
        current,
        required: req.level,
        met: current >= req.level,
      };
    });
  }

  public visibleMutations = computed(() => {
    const completedMap = this.completed();
    return this.availableMutations.filter((mut) => {
      if (completedMap[mut.id]) return true;
      if (!mut.requiredMutations || mut.requiredMutations.length === 0) return true;
      return mut.requiredMutations.every((reqId) => !!completedMap[reqId]);
    });
  });

  // ==========================================
  // 3. OVER-MUTATION & COMPUTED DRAINS
  // ==========================================

  private getResourceGeneration(id: ResourceId): number {
    if (id === ResourceId.Energy) return this.resourceService.energy().generationPerSecond;
    if (id === ResourceId.Water) return this.resourceService.water().generationPerSecond;
    if (id === ResourceId.Minerals) return this.resourceService.minerals().generationPerSecond;
    return 0;
  }

  public overMutationMultiples = computed(() => {
    if (!this.isOverMutationEnabled()) return 0;
    const active = this.activeMutationId();
    if (!active) return 0;

    const mutation = this.availableMutations.find((m) => m.id === active);
    if (!mutation || !mutation.costs || mutation.costs.length === 0) return 0;

    const currentProgress = this.progresses()[active] || {};
    let minExtraMultiples = Infinity;

    for (const cost of mutation.costs) {
      const invested = currentProgress[cost.resourceId] || 0;
      if (invested >= cost.totalRequired) continue;

      const gen = this.getResourceGeneration(cost.resourceId);
      if (gen <= cost.drainPerSecond) {
        return 0;
      }
      const extra = Math.floor((gen - cost.drainPerSecond) / cost.drainPerSecond);
      minExtraMultiples = Math.min(minExtraMultiples, extra);
    }

    return minExtraMultiples === Infinity ? 0 : Math.max(0, minExtraMultiples);
  });

  public completedCount = computed(
    () => this.availableMutations.filter((m) => !!this.completed()[m.id]).length,
  );

  public drainMultiplier = computed(() => 1 + this.overMutationMultiples());

  public overMutationSpeedMultiplier = computed(
    () => 1 + this.overMutationMultiples() * this.OVER_MUTATION_BONUS_PER_MULTIPLE,
  );

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

    return cost.drainPerSecond * this.drainMultiplier();
  }

  public energyDrain = computed(() => this.getDrain(ResourceId.Energy));
  public waterDrain = computed(() => this.getDrain(ResourceId.Water));
  public mineralsDrain = computed(() => this.getDrain(ResourceId.Minerals));

  // ==========================================
  // 4. ACTIONS & LOGIC
  // ==========================================
  public toggleOverMutation(): void {
    this.isOverMutationEnabled.update((v) => !v);
  }

  public isCompleted(id: MutationId): boolean {
    return this.completed()[id] || false;
  }

  public getProgress(id: MutationId): number {
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

  public toggleMutation(id: MutationId): void {
    if (this.activeMutationId() === id) {
      this.activeMutationId.set(null);
      return;
    }
    // Blokada uruchomienia mutacji, jeśli warunki strukturalne drzewa nie są spełnione
    if (!this.areUpgradeRequirementsMet(id)) {
      return;
    }
    this.activeMutationId.set(id);
  }

  private completeMutation(id: MutationId): void {
    this.completed.update((c) => ({ ...c, [id]: true }));
    this.activeMutationId.set(null);
  }

  public tick(deltaTime: number): void {
    const active = this.activeMutationId();
    if (!active) return;

    const mutation = this.availableMutations.find((m) => m.id === active);
    if (
      !mutation ||
      this.isCompleted(active) ||
      !this.areUpgradeRequirementsMet(active) ||
      !mutation.costs ||
      mutation.costs.length === 0
    ) {
      this.activeMutationId.set(null);
      return;
    }

    const allProgresses = this.progresses();
    const currentInvested: MutationProgress = { ...(allProgresses[active] || {}) };

    const drainMult = this.drainMultiplier();
    const progressMult = this.overMutationSpeedMultiplier();

    let tickFraction = 1.0;
    let allCompleted = true;

    for (const cost of mutation.costs) {
      const invested = currentInvested[cost.resourceId] || 0;
      const remaining = cost.totalRequired - invested;

      if (remaining > 0) {
        allCompleted = false;
        const maxResourceDrain = cost.drainPerSecond * drainMult * deltaTime;

        let available = 0;
        if (cost.resourceId === ResourceId.Energy) available = this.resourceService.energy().amount;
        else if (cost.resourceId === ResourceId.Water)
          available = this.resourceService.water().amount;
        else if (cost.resourceId === ResourceId.Minerals)
          available = this.resourceService.minerals().amount;

        if (available < maxResourceDrain && maxResourceDrain > 0) {
          tickFraction = Math.min(tickFraction, available / maxResourceDrain);
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
          const resourceDrained = cost.drainPerSecond * drainMult * deltaTime * tickFraction;
          const progressAdded = Math.min(
            remaining,
            cost.drainPerSecond * progressMult * deltaTime * tickFraction,
          );

          if (resourceDrained > 0) {
            this.resourceService.consume(cost.resourceId, resourceDrained);
            currentInvested[cost.resourceId] = invested + progressAdded;
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
