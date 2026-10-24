import { ResourceId } from '../enums/resource.enum';

export interface MutationCost {
  resourceId: ResourceId;
  totalRequired: number;
  drainPerSecond: number;
}

export interface MutationDef {
  id: string;
  title: string;
  description: string;
  effect: string[];
  costs: MutationCost[];
}
