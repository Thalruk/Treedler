import { ResourceId } from '../enums/resource.enum';
import { MutationId } from '../enums/mutation.enum';

export interface MutationCost {
  resourceId: ResourceId;
  totalRequired: number;
  drainPerSecond: number;
}

export interface MutationDef {
  id: MutationId;
  title: string;
  description: string;
  effect: string[];
  costs: MutationCost[];
}
