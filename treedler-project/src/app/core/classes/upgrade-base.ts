import { signal, WritableSignal } from '@angular/core';
import { ResourceId } from '../enums/resource.enum';
import { UpgradeId } from '../enums/upgrade.enum';

export interface CostConfig {
  resourceId: ResourceId;
  baseCost: number;
  multiplier: number;
}

export class UpgradeBase {
  public level: WritableSignal<number> = signal(0);

  constructor(
    public id: UpgradeId,
    public costConfigs: CostConfig[],
  ) {}
}
