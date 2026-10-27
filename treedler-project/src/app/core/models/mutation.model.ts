import { MutationId } from '../enums/mutation.enum';
import { ResourceId } from '../enums/resource.enum';

export interface MutationCost {
  resourceId: ResourceId;
  totalRequired: number;
  drainPerSecond: number;
}

export interface MutationDef {
  id: MutationId;
  title: string;
  description: string;
  costs: MutationCost[];
  effect: string[];
  requiredMutations?: MutationId[];
}
