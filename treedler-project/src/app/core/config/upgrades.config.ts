import { ResourceId } from '../enums/resource.enum';
import { CostConfig } from '../classes/upgrade-base';

export const UPGRADES_CONFIG: Record<string, CostConfig[]> = {
  // --- CROWN ---
  branch: [
    { resourceId: ResourceId.Energy, baseCost: 20, multiplier: 1.22 },
    { resourceId: ResourceId.Water, baseCost: 15, multiplier: 1.22 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.22 },
  ],
  leaf: [
    { resourceId: ResourceId.Energy, baseCost: 2, multiplier: 1.015 },
    { resourceId: ResourceId.Water, baseCost: 2, multiplier: 1.015 },
    { resourceId: ResourceId.Minerals, baseCost: 1, multiplier: 1.015 },
  ],
  sunwardReach: [{ resourceId: ResourceId.Energy, baseCost: 50, multiplier: 1.3 }],
  canopySpread: [
    { resourceId: ResourceId.Energy, baseCost: 120, multiplier: 1.2 },
    { resourceId: ResourceId.Water, baseCost: 100, multiplier: 1.2 },
  ],

  // --- BARK ---
  barkThickness: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.16 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.16 },
  ],
  vascularTissues: [
    { resourceId: ResourceId.Energy, baseCost: 40, multiplier: 1.18 },
    { resourceId: ResourceId.Water, baseCost: 35, multiplier: 1.18 },
  ],
  resinSecretion: [
    { resourceId: ResourceId.Water, baseCost: 150, multiplier: 1.22 },
    { resourceId: ResourceId.Minerals, baseCost: 150, multiplier: 1.22 },
  ],

  // --- ROOTS ---
  rootWidth: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.2 },
    { resourceId: ResourceId.Minerals, baseCost: 12, multiplier: 1.2 },
  ],
  rootDepth: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.2 },
    { resourceId: ResourceId.Water, baseCost: 12, multiplier: 1.2 },
  ],
  rootHairs: [
    { resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.18 },
    { resourceId: ResourceId.Minerals, baseCost: 60, multiplier: 1.18 },
  ],
  mycorrhizalNetwork: [{ resourceId: ResourceId.Energy, baseCost: 150, multiplier: 1.22 }],
  rootVigor: [
    { resourceId: ResourceId.Energy, baseCost: 120, multiplier: 1.28 },
    { resourceId: ResourceId.Minerals, baseCost: 100, multiplier: 1.28 },
  ],
};
