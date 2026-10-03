import { Injectable, signal, inject, computed } from '@angular/core';
import { ResourceService } from './resource';
import { ResourceId } from '../enums/resource.enum';

export interface MutationDef {
  id: string;
  title: string;
  description: string;
  effect: string[];
  totalEnergyCost: number;
  drainPerSecond: number;
}

@Injectable({ providedIn: 'root' })
export class MutationService {
  private resourceService = inject(ResourceService);

  public activeMutationId = signal<string | null>(null);
  public progresses = signal<Record<string, number>>({});
  public completed = signal<Record<string, boolean>>({});

  public readonly availableMutations: MutationDef[] = [
    {
      id: 'dense_branching',
      title: 'Dense Branching',
      description: 'Compact foliage structure allowing more leaves on a single branch.',
      effect: ['+5 Leaves per Branch'],
      totalEnergyCost: 200,
      drainPerSecond: 5,
    },
    {
      id: 'stomata_optimization',
      title: 'Stomata Optimization',
      description: 'Refined pores reduce transpiration, lowering water upkeep of leaves.',
      effect: ['-25% Leaf Water Upkeep'],
      totalEnergyCost: 350,
      drainPerSecond: 8,
    },
    {
      id: 'chloroplast_refinement',
      title: 'Chloroplast Refinement',
      description: 'Enhanced chlorophyll density improves energy conversion efficiency.',
      effect: ['+20% Base Leaf Energy'],
      totalEnergyCost: 500,
      drainPerSecond: 10,
    },
  ];

  public isCompleted(id: string): boolean {
    return this.completed()[id] || false;
  }

  public getProgress(id: string): number {
    return this.progresses()[id] || 0;
  }

  public toggleMutation(id: string): void {
    this.activeMutationId.set(this.activeMutationId() === id ? null : id);
  }

  public energyDrain = computed(() => {
    const active = this.activeMutationId();
    if (!active) return 0;
    const mutation = this.availableMutations.find((m) => m.id === active);
    return mutation ? mutation.drainPerSecond : 0;
  });

  public waterDrain = computed(() => 0);
  public mineralsDrain = computed(() => 0);

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
