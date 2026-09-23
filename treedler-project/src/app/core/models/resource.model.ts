import { ResourceId } from '../enums/resource.enum';

export interface Resource {
  id: ResourceId;
  name: string;
  amount: number;
  maxAmount: number;
  generationPerSecond: number;
  isUnlocked: boolean;
}
