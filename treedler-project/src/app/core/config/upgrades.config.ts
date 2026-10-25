import { ResourceId } from '../enums/resource.enum';
import { UpgradeId } from '../enums/upgrade.enum';
import { CostConfig } from '../classes/upgrade-base';

export const UPGRADES_CONFIG: Record<UpgradeId, CostConfig[]> = {
  // --- CROWN ---
  [UpgradeId.Branch]: [
    { resourceId: ResourceId.Energy, baseCost: 20, multiplier: 1.22 },
    { resourceId: ResourceId.Water, baseCost: 15, multiplier: 1.22 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.22 },
  ],
  [UpgradeId.Leaf]: [
    { resourceId: ResourceId.Energy, baseCost: 2, multiplier: 1.015 },
    { resourceId: ResourceId.Water, baseCost: 2, multiplier: 1.015 },
    { resourceId: ResourceId.Minerals, baseCost: 1, multiplier: 1.015 },
  ],
  [UpgradeId.SunwardReach]: [{ resourceId: ResourceId.Energy, baseCost: 45, multiplier: 1.25 }],
  [UpgradeId.CanopySpread]: [
    { resourceId: ResourceId.Energy, baseCost: 100, multiplier: 1.18 },
    { resourceId: ResourceId.Water, baseCost: 80, multiplier: 1.18 },
  ],

  // --- BARK ---
  [UpgradeId.BarkThickness]: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.16 },
    { resourceId: ResourceId.Minerals, baseCost: 15, multiplier: 1.16 },
  ],
  [UpgradeId.VascularTissues]: [
    { resourceId: ResourceId.Energy, baseCost: 40, multiplier: 1.16 },
    { resourceId: ResourceId.Water, baseCost: 35, multiplier: 1.16 },
  ],
  [UpgradeId.ResinSecretion]: [
    { resourceId: ResourceId.Water, baseCost: 140, multiplier: 1.2 },
    { resourceId: ResourceId.Minerals, baseCost: 140, multiplier: 1.2 },
  ],

  // --- ROOTS ---
  [UpgradeId.RootWidth]: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.2 },
    { resourceId: ResourceId.Minerals, baseCost: 12, multiplier: 1.2 },
  ],
  [UpgradeId.RootDepth]: [
    { resourceId: ResourceId.Energy, baseCost: 15, multiplier: 1.2 },
    { resourceId: ResourceId.Water, baseCost: 12, multiplier: 1.2 },
  ],
  [UpgradeId.RootHairs]: [
    { resourceId: ResourceId.Energy, baseCost: 40, multiplier: 1.16 },
    { resourceId: ResourceId.Minerals, baseCost: 50, multiplier: 1.16 },
  ],
  [UpgradeId.MycorrhizalNetwork]: [
    { resourceId: ResourceId.Energy, baseCost: 130, multiplier: 1.2 },
  ],
  [UpgradeId.RootVigor]: [
    { resourceId: ResourceId.Energy, baseCost: 110, multiplier: 1.24 },
    { resourceId: ResourceId.Minerals, baseCost: 90, multiplier: 1.24 },
  ],
};
