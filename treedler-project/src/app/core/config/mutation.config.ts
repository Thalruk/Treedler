import { MutationDef } from '../models/mutation.model';
import { ResourceId } from '../enums/resource.enum';

export const MUTATIONS_CONFIG: MutationDef[] = [
  {
    id: 'dense_branching',
    title: 'Dense Branching',
    description: 'Compact foliage structure allowing more leaves on a single branch.',
    effect: ['+5 Leaves per Branch'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 600, drainPerSecond: 6 },
      { resourceId: ResourceId.Water, totalRequired: 400, drainPerSecond: 4 },
      { resourceId: ResourceId.Minerals, totalRequired: 200, drainPerSecond: 2 },
    ],
  },
  {
    id: 'stomata_optimization',
    title: 'Stomata Optimization',
    description: 'Refined microscopic pores reduce transpiration and mineral loss.',
    effect: ['-35% Leaf Water & Mineral Upkeep'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 1200, drainPerSecond: 10 },
      { resourceId: ResourceId.Water, totalRequired: 1000, drainPerSecond: 8 },
      { resourceId: ResourceId.Minerals, totalRequired: 500, drainPerSecond: 4 },
    ],
  },
  {
    id: 'chloroplast_refinement',
    title: 'Chloroplast Refinement',
    description: 'Enhanced chlorophyll density drastically amplifies solar conversion.',
    effect: ['x1.4 Total Leaf Energy Output'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 2500, drainPerSecond: 15 },
      { resourceId: ResourceId.Water, totalRequired: 1500, drainPerSecond: 10 },
      { resourceId: ResourceId.Minerals, totalRequired: 1000, drainPerSecond: 6 },
    ],
  },
  {
    id: 'heartwood_formation',
    title: 'Heartwood Formation',
    description: 'Compress the inner core into dense, hollow-resistant timber for vast storage.',
    effect: ['x1.5 Global Max Capacity'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 4000, drainPerSecond: 20 },
      { resourceId: ResourceId.Water, totalRequired: 3000, drainPerSecond: 15 },
      { resourceId: ResourceId.Minerals, totalRequired: 3000, drainPerSecond: 15 },
    ],
  },
  {
    id: 'symbiotic_mycelium',
    title: 'Symbiotic Mycelium',
    description:
      'Fuse fungal threads directly into root cells for bi-directional nutrient synthesis.',
    effect: ['Mycorrhiza grants +2 Water/s & +2 Energy/s per Lvl'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 8000, drainPerSecond: 30 },
      { resourceId: ResourceId.Water, totalRequired: 6000, drainPerSecond: 22 },
      { resourceId: ResourceId.Minerals, totalRequired: 6000, drainPerSecond: 22 },
    ],
  },
  {
    id: 'fractal_canopy',
    title: 'Fractal Canopy',
    description: 'Self-repeating geometric sub-branches maximize exposure to the sky.',
    effect: ['+10 Leaves per Branch'],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 15000, drainPerSecond: 45 },
      { resourceId: ResourceId.Water, totalRequired: 10000, drainPerSecond: 30 },
      { resourceId: ResourceId.Minerals, totalRequired: 8000, drainPerSecond: 25 },
    ],
  },
];
