import { MutationId } from '../enums/mutation.enum';
import { ResourceId } from '../enums/resource.enum';
import { UpgradeId } from '../enums/upgrade.enum';

export interface MutationCost {
  resourceId: ResourceId;
  totalRequired: number;
  drainPerSecond: number;
}

export interface MutationUpgradeReq {
  upgradeId: UpgradeId;
  level: number;
  label: string;
}

export interface MutationDef {
  id: MutationId;
  title: string;
  description: string;
  costs: MutationCost[];
  effect: string[];
  requiredMutations?: MutationId[];
  requiredUpgrades?: MutationUpgradeReq[];
}
