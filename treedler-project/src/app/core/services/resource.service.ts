import { Injectable, signal, WritableSignal } from '@angular/core';
import { Resource } from '../models/resource.model';
import { ResourceId, ResourceName } from '../enums/resource.enum';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  // ==========================================
  // 1. STATE (SIGNALS)
  // ==========================================

  public water = signal<Resource>({
    id: ResourceId.Water,
    name: ResourceName[ResourceId.Water],
    amount: 10,
    maxAmount: 10,
    generationPerSecond: 0,
    isUnlocked: true,
  });

  public minerals = signal<Resource>({
    id: ResourceId.Minerals,
    name: ResourceName[ResourceId.Minerals],
    amount: 0,
    maxAmount: 10,
    generationPerSecond: 0,
    isUnlocked: false,
  });

  public energy = signal<Resource>({
    id: ResourceId.Energy,
    name: ResourceName[ResourceId.Energy],
    amount: 0,
    maxAmount: 10,
    generationPerSecond: 0,
    isUnlocked: false,
  });

  // ==========================================
  // 2. ACTIONS
  // ==========================================

  public consume(resourceId: ResourceId, amount: number): void {
    if (resourceId === ResourceId.Water)
      this.water.update((r) => ({ ...r, amount: Math.max(0, r.amount - amount) }));
    if (resourceId === ResourceId.Minerals)
      this.minerals.update((r) => ({ ...r, amount: Math.max(0, r.amount - amount) }));
    if (resourceId === ResourceId.Energy)
      this.energy.update((r) => ({ ...r, amount: Math.max(0, r.amount - amount) }));
  }

  public unlock(resourceId: ResourceId): void {
    if (resourceId === ResourceId.Water) this.water.update((r) => ({ ...r, isUnlocked: true }));
    if (resourceId === ResourceId.Minerals)
      this.minerals.update((r) => ({ ...r, isUnlocked: true }));
    if (resourceId === ResourceId.Energy) this.energy.update((r) => ({ ...r, isUnlocked: true }));
  }

  // ==========================================
  // 3. GAME LOOP LOGIC
  // ==========================================

  public tick(
    deltaTime: number,
    generations: { water: number; minerals: number; energy: number },
    maxCapacities: { water: number; minerals: number; energy: number },
  ): void {
    this.updateResource(this.water, deltaTime, generations.water, maxCapacities.water);
    this.updateResource(this.minerals, deltaTime, generations.minerals, maxCapacities.minerals);
    this.updateResource(this.energy, deltaTime, generations.energy, maxCapacities.energy);
  }

  private updateResource(
    res: WritableSignal<Resource>,
    deltaTime: number,
    genPerSec: number,
    maxCapacity: number,
  ): void {
    res.update((current) => {
      const updated = {
        ...current,
        generationPerSecond: genPerSec,
        maxAmount: maxCapacity,
      };

      let newAmount = updated.amount + genPerSec * deltaTime;
      newAmount = Math.max(0, Math.min(newAmount, updated.maxAmount));

      return { ...updated, amount: newAmount };
    });
  }
}
