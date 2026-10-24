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
      this.water.update((r) => ({ ...r, amount: r.amount - amount }));
    if (resourceId === ResourceId.Minerals)
      this.minerals.update((r) => ({ ...r, amount: r.amount - amount }));
    if (resourceId === ResourceId.Energy)
      this.energy.update((r) => ({ ...r, amount: r.amount - amount }));
  }

  public unlock(resourceId: ResourceId): void {
    if (resourceId === ResourceId.Water) this.water.update((r) => ({ ...r, isUnlocked: true }));
    if (resourceId === ResourceId.Minerals)
      this.minerals.update((r) => ({ ...r, isUnlocked: true }));
    if (resourceId === ResourceId.Energy) this.energy.update((r) => ({ ...r, isUnlocked: true }));
  }

  public increaseMaxAmount(amount: number): void {
    this.water.update((r) => ({ ...r, maxAmount: r.maxAmount + amount }));
    this.minerals.update((r) => ({ ...r, maxAmount: r.maxAmount + amount }));
    this.energy.update((r) => ({ ...r, maxAmount: r.maxAmount + amount }));
  }

  // ==========================================
  // 3. GAME LOOP LOGIC
  // ==========================================

  public tick(
    deltaTime: number,
    generations: { water: number; minerals: number; energy: number },
  ): void {
    this.updateResource(this.water, deltaTime, generations.water);
    this.updateResource(this.minerals, deltaTime, generations.minerals);
    this.updateResource(this.energy, deltaTime, generations.energy);
  }

  private updateResource(
    res: WritableSignal<Resource>,
    deltaTime: number,
    genPerSec: number,
  ): void {
    res.update((current) => {
      const updated = { ...current, generationPerSecond: genPerSec };
      if (genPerSec === 0) return updated;

      let newAmount = updated.amount + genPerSec * deltaTime;
      newAmount = Math.max(0, Math.min(newAmount, updated.maxAmount));

      return { ...updated, amount: newAmount };
    });
  }
}
