import { Injectable, signal, WritableSignal } from '@angular/core';
import { Resource } from '../models/resource.model';
import { ResourceId, ResourceName } from '../enums/resource.enum';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  public water = signal<Resource>(this.createResource(ResourceId.Water, 10, true));
  public minerals = signal<Resource>(this.createResource(ResourceId.Minerals, 0, false));
  public energy = signal<Resource>(this.createResource(ResourceId.Energy, 0, false));

  public get(resourceId: ResourceId): Resource {
    return this.getSignal(resourceId)();
  }

  public consume(resourceId: ResourceId, amount: number): void {
    this.getSignal(resourceId).update((resource) => ({
      ...resource,
      amount: Math.max(0, resource.amount - amount),
    }));
  }

  public unlock(resourceId: ResourceId): void {
    this.getSignal(resourceId).update((resource) => ({ ...resource, isUnlocked: true }));
  }

  public tick(
    deltaTime: number,
    generations: { water: number; minerals: number; energy: number },
    maxCapacities: { water: number; minerals: number; energy: number },
  ): void {
    this.updateResource(this.water, deltaTime, generations.water, maxCapacities.water);
    this.updateResource(this.minerals, deltaTime, generations.minerals, maxCapacities.minerals);
    this.updateResource(this.energy, deltaTime, generations.energy, maxCapacities.energy);
  }

  private createResource(id: ResourceId, amount: number, isUnlocked: boolean): Resource {
    return {
      id,
      name: ResourceName[id],
      amount,
      maxAmount: 10,
      generationPerSecond: 0,
      isUnlocked,
    };
  }

  private getSignal(resourceId: ResourceId): WritableSignal<Resource> {
    switch (resourceId) {
      case ResourceId.Water:
        return this.water;
      case ResourceId.Minerals:
        return this.minerals;
      case ResourceId.Energy:
        return this.energy;
    }
  }

  private updateResource(
    res: WritableSignal<Resource>,
    deltaTime: number,
    genPerSec: number,
    maxCapacity: number,
  ): void {
    res.update((current) => {
      const nextAmount = current.amount + genPerSec * deltaTime;
      return {
        ...current,
        generationPerSecond: genPerSec,
        maxAmount: maxCapacity,
        amount: Math.max(0, Math.min(nextAmount, maxCapacity)),
      };
    });
  }
}
