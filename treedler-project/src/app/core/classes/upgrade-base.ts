import { signal, computed, WritableSignal, Signal } from '@angular/core';
import { ResourceId } from '../enums/resource.enum';

export interface CostConfig {
  resourceId: ResourceId;
  baseCost: number;
  multiplier: number;
}

export interface CalculatedCost {
  resourceId: ResourceId;
  amount: number;
}

export class UpgradeBase {
  public level: WritableSignal<number> = signal(0);

  public costs: Signal<CalculatedCost[]> = computed(() => {
    return this.costConfigs.map((config) => ({
      resourceId: config.resourceId,
      amount: Math.floor(config.baseCost * Math.pow(config.multiplier, this.level())),
    }));
  });

  constructor(
    public id: string,
    private costConfigs: CostConfig[],
  ) {}
}
