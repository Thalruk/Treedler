import { ResourceId } from '../enums/resource.enum';
import { UpgradeId } from '../enums/upgrade.enum';
import { CostConfig } from '../classes/upgrade-base';

export const UPGRADES_CONFIG: Record<UpgradeId, CostConfig[]> = {
  // --- CROWN ---
  [UpgradeId.Branch]: [
    { resourceId: ResourceId.Energy, baseCost: 20, multiplier: 1.16 },
    { resourceId: ResourceId.Water, baseCost: 15, multiplier: 1.16 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.16 },
  ],
  [UpgradeId.Leaf]: [
    { resourceId: ResourceId.Energy, baseCost: 2, multiplier: 1.012 },
    { resourceId: ResourceId.Water, baseCost: 2, multiplier: 1.012 },
    { resourceId: ResourceId.Minerals, baseCost: 1, multiplier: 1.012 },
  ],
  [UpgradeId.SunwardReach]: [{ resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.19 }],
  [UpgradeId.CanopySpread]: [
    { resourceId: ResourceId.Energy, baseCost: 100, multiplier: 1.17 },
    { resourceId: ResourceId.Water, baseCost: 85, multiplier: 1.17 },
  ],

  // --- BARK ---
  [UpgradeId.BarkThickness]: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.15 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.15 },
  ],
  [UpgradeId.VascularTissues]: [
    { resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.16 },
    { resourceId: ResourceId.Water, baseCost: 40, multiplier: 1.16 },
  ],
  [UpgradeId.SapPressure]: [
    { resourceId: ResourceId.Energy, baseCost: 90, multiplier: 1.18 },
    { resourceId: ResourceId.Water, baseCost: 90, multiplier: 1.18 },
    { resourceId: ResourceId.Minerals, baseCost: 60, multiplier: 1.18 },
  ],
  [UpgradeId.ResinSecretion]: [
    { resourceId: ResourceId.Water, baseCost: 150, multiplier: 1.19 },
    { resourceId: ResourceId.Minerals, baseCost: 150, multiplier: 1.19 },
  ],

  // --- ROOTS ---
  [UpgradeId.RootWidth]: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.14 },
    { resourceId: ResourceId.Minerals, baseCost: 12, multiplier: 1.14 },
  ],
  [UpgradeId.RootDepth]: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.14 },
    { resourceId: ResourceId.Water, baseCost: 12, multiplier: 1.14 },
  ],
  [UpgradeId.RootHairs]: [
    { resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.15 },
    { resourceId: ResourceId.Minerals, baseCost: 55, multiplier: 1.15 },
  ],
  [UpgradeId.MycorrhizalNetwork]: [
    { resourceId: ResourceId.Energy, baseCost: 130, multiplier: 1.17 },
  ],
  [UpgradeId.RootVigor]: [
    { resourceId: ResourceId.Energy, baseCost: 115, multiplier: 1.19 },
    { resourceId: ResourceId.Minerals, baseCost: 95, multiplier: 1.19 },
  ],
};
