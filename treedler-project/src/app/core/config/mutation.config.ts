import { MutationDef } from '../models/mutation.model';
import { ResourceId } from '../enums/resource.enum';

export const MUTATIONS_CONFIG: MutationDef[] = [
  {
    id: 'dense_branching',
    title: 'Dense Branching',
    description: 'Compact foliage structure allowing more leaves on a single branch.',
    effect: ['+5 Leaves per Branch'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 200, drainPerSecond: 5 },
      { resourceId: ResourceId.Water, totalRequired: 100, drainPerSecond: 2.5 },
      { resourceId: ResourceId.Minerals, totalRequired: 40, drainPerSecond: 1 },
    ],
  },
  {
    id: 'stomata_optimization',
    title: 'Stomata Optimization',
    description: 'Refined pores reduce transpiration, lowering water upkeep of leaves.',
    effect: ['-25% Leaf Water Upkeep'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 350, drainPerSecond: 8 },
      { resourceId: ResourceId.Water, totalRequired: 200, drainPerSecond: 4.5 },
      { resourceId: ResourceId.Minerals, totalRequired: 80, drainPerSecond: 1.8 },
    ],
  },
  {
    id: 'chloroplast_refinement',
    title: 'Chloroplast Refinement',
    description: 'Enhanced chlorophyll density improves energy conversion efficiency.',
    effect: ['+20% Base Leaf Energy'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 500, drainPerSecond: 10 },
      { resourceId: ResourceId.Water, totalRequired: 250, drainPerSecond: 5 },
      { resourceId: ResourceId.Minerals, totalRequired: 150, drainPerSecond: 3 },
    ],
  },
];
