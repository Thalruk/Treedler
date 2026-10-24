import { BloomStage } from '../models/bloom.model';
import { ResourceId } from '../enums/resource.enum';

export const BLOOM_STAGES: BloomStage[] = [
  {
    id: 'stage_budding',
    name: 'Budding',
    description: 'Create dense, energy-rich buds across your canopy.',
    flavorText: 'Tiny green nodes appear at the tips of your branches, brimming with potential.',
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 1500, drainPerSecond: 25 },
      { resourceId: ResourceId.Water, totalRequired: 800, drainPerSecond: 15 },
    ],
  },
  {
    id: 'stage_flowering',
    name: 'Flowering',
    description: 'Unfurl vibrant petals to attract the attention of the world.',
    flavorText: 'The forest pauses as your canopy erupts in a sea of breathtaking color.',
    costs: [
      { resourceId: ResourceId.Water, totalRequired: 2000, drainPerSecond: 30 },
      { resourceId: ResourceId.Minerals, totalRequired: 800, drainPerSecond: 10 },
    ],
  },
  {
    id: 'stage_fruiting',
    name: 'Fruiting',
    description: 'Harden the flowers into heavy, nutrient-dense fruits.',
    flavorText: 'The petals fall, replaced by swelling fruits pulling heavily on your branches.',
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 3500, drainPerSecond: 50 },
      { resourceId: ResourceId.Water, totalRequired: 2500, drainPerSecond: 40 },
      { resourceId: ResourceId.Minerals, totalRequired: 1500, drainPerSecond: 20 },
    ],
  },
  {
    id: 'stage_seeding',
    name: 'Primeval Seed',
    description: 'Concentrate your entire essence into a single, perfect seed.',
    flavorText: 'This is what you were made for. The culmination of your existence.',
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 10000, drainPerSecond: 100 },
      { resourceId: ResourceId.Water, totalRequired: 10000, drainPerSecond: 100 },
      { resourceId: ResourceId.Minerals, totalRequired: 10000, drainPerSecond: 100 },
    ],
  },
];
