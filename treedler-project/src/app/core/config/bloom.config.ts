import { BloomStage } from '../models/bloom.model';
import { ResourceId } from '../enums/resource.enum';

export const BLOOM_STAGES: BloomStage[] = [
  {
    id: 'stage_budding',
    name: 'Budding',
    description: 'Create dense, energy-rich buds across your canopy.',
    flavorText: 'Tiny green nodes appear at the tips of your branches, brimming with potential.',
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 15000, drainPerSecond: 50 },
      { resourceId: ResourceId.Water, totalRequired: 10000, drainPerSecond: 35 },
    ],
  },
  {
    id: 'stage_flowering',
    name: 'Flowering',
    description: 'Unfurl vibrant petals to attract the attention of the world.',
    flavorText: 'The forest pauses as your canopy erupts in a sea of breathtaking color.',
    costs: [
      { resourceId: ResourceId.Water, totalRequired: 35000, drainPerSecond: 75 },
      { resourceId: ResourceId.Minerals, totalRequired: 25000, drainPerSecond: 50 },
    ],
  },
  {
    id: 'stage_fruiting',
    name: 'Fruiting',
    description: 'Harden the flowers into heavy, nutrient-dense fruits.',
    flavorText: 'The petals fall, replaced by swelling fruits pulling heavily on your branches.',
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 80000, drainPerSecond: 120 },
      { resourceId: ResourceId.Water, totalRequired: 60000, drainPerSecond: 90 },
      { resourceId: ResourceId.Minerals, totalRequired: 50000, drainPerSecond: 75 },
    ],
  },
  {
    id: 'stage_seeding',
    name: 'Primeval Seed',
    description: 'Concentrate your entire essence into a single, perfect seed.',
    flavorText: 'This is what you were made for. The culmination of your existence.',
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 250000, drainPerSecond: 250 },
      { resourceId: ResourceId.Water, totalRequired: 200000, drainPerSecond: 200 },
      { resourceId: ResourceId.Minerals, totalRequired: 200000, drainPerSecond: 200 },
    ],
  },
];
