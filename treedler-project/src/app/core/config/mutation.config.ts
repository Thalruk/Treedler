import { MutationDef } from '../models/mutation.model';

export const MUTATIONS_CONFIG: MutationDef[] = [
  {
    id: 'dense_branching',
    title: 'Dense Branching',
    description: 'Compact foliage structure allowing more leaves on a single branch.',
    effect: ['+5 Leaves per Branch'],
    totalEnergyCost: 200,
    drainPerSecond: 5,
  },
  {
    id: 'stomata_optimization',
    title: 'Stomata Optimization',
    description: 'Refined pores reduce transpiration, lowering water upkeep of leaves.',
    effect: ['-25% Leaf Water Upkeep'],
    totalEnergyCost: 350,
    drainPerSecond: 8,
  },
  {
    id: 'chloroplast_refinement',
    title: 'Chloroplast Refinement',
    description: 'Enhanced chlorophyll density improves energy conversion efficiency.',
    effect: ['+20% Base Leaf Energy'],
    totalEnergyCost: 500,
    drainPerSecond: 10,
  },
];
