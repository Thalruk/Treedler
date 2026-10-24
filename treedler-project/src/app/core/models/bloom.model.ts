import { ResourceId } from '../enums/resource.enum';

export interface BloomCost {
  resourceId: ResourceId;
  totalRequired: number;
  drainPerSecond: number;
}

export interface BloomStage {
  id: string;
  name: string;
  description: string;
  flavorText: string;
  costs: BloomCost[];
}
