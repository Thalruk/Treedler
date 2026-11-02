import { Resource } from './resource.model';
import { MutationId } from '../enums/mutation.enum';
import { ResourceId } from '../enums/resource.enum';

export interface SaveState {
  resources?: {
    water?: Resource;
    minerals?: Resource;
    energy?: Resource;
  };
  upgrades?: Record<string, unknown>;
  storyline?: Record<string, unknown>;
  mutations?: {
    progresses?: Partial<Record<MutationId, Partial<Record<ResourceId, number>>>>;
    completed?: Partial<Record<MutationId, boolean>>;
    isOverMutationEnabled?: boolean;
  };
  bloom?: {
    currentStageIndex?: number;
    isActive?: boolean;
    invested?: Partial<Record<ResourceId, number>>;
    isFullyComplete?: boolean;
  };
  logsData?: Record<string, unknown>;
  audio?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}
