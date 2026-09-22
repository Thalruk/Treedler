import { Injectable, signal, WritableSignal } from '@angular/core';
import { Resource } from '../models/resource.model';
import { ResourceId, ResourceName } from '../models/resource.enum';

@Injectable({ providedIn: 'root' })
export class ResourceService {
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

  public tick(deltaTime: number): void {
    this.updateResource(this.water, deltaTime);
    this.updateResource(this.minerals, deltaTime);
    this.updateResource(this.energy, deltaTime);
  }

  private updateResource(res: WritableSignal<Resource>, deltaTime: number): void {
    res.update((current) => {
      if (current.generationPerSecond === 0) return current;

      let newAmount = current.amount + current.generationPerSecond * deltaTime;
      return { ...current, amount: Math.min(newAmount, current.maxAmount) };
    });
  }
}
