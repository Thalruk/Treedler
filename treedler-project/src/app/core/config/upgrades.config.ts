import { ResourceId } from '../enums/resource.enum';
import { CostConfig } from '../classes/upgrade-base';

export const UPGRADES_CONFIG: Record<string, CostConfig[]> = {
  // --- CROWN ---
  branch: [
    { resourceId: ResourceId.Energy, baseCost: 25, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 20, multiplier: 1.3 },
    { resourceId: ResourceId.Minerals, baseCost: 20, multiplier: 1.3 },
  ],
  leaf: [
    { resourceId: ResourceId.Energy, baseCost: 1, multiplier: 1.05 },
    { resourceId: ResourceId.Water, baseCost: 1, multiplier: 1.05 },
    { resourceId: ResourceId.Minerals, baseCost: 1, multiplier: 1.05 },
  ],
  sunwardReach: [{ resourceId: ResourceId.Energy, baseCost: 60, multiplier: 1.4 }],
  canopySpread: [
    { resourceId: ResourceId.Energy, baseCost: 100, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 80, multiplier: 1.3 },
  ],

  // --- BARK ---
  barkThickness: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.25 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.25 },
  ],
  vascularTissues: [
    { resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 35, multiplier: 1.3 },
  ],
  resinSecretion: [
    { resourceId: ResourceId.Water, baseCost: 100, multiplier: 1.3 },
    { resourceId: ResourceId.Minerals, baseCost: 100, multiplier: 1.3 },
  ],

  // --- ROOTS ---
  rootWidth: [
    { resourceId: ResourceId.Energy, baseCost: 20, multiplier: 1.3 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.3 },
  ],
  rootDepth: [
    { resourceId: ResourceId.Energy, baseCost: 20, multiplier: 1.3 },
    { resourceId: ResourceId.Water, baseCost: 15, multiplier: 1.3 },
  ],
  rootHairs: [
    { resourceId: ResourceId.Energy, baseCost: 35, multiplier: 1.2 },
    { resourceId: ResourceId.Minerals, baseCost: 50, multiplier: 1.2 },
  ],
  mycorrhizalNetwork: [{ resourceId: ResourceId.Energy, baseCost: 150, multiplier: 1.3 }],
  rootVigor: [
    { resourceId: ResourceId.Energy, baseCost: 120, multiplier: 1.35 },
    { resourceId: ResourceId.Minerals, baseCost: 100, multiplier: 1.35 },
  ],
};
