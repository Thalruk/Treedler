export enum MilestoneId {
  FirstGrowth = 'first_growth',
  Leaves10 = 'leaves_10',
  Branches10 = 'branches_10',
  MutationUnlocked = 'mutation_unlocked',
  DeepAnchorage = 'deep_anchorage',
  MetabolicOverdrive = 'metabolic_overdrive',
  AncientTimber = 'ancient_timber',
  BloomUnlocked = 'bloom_unlocked',
  ApexFlora = 'apex_flora',
}

export interface MilestoneConfig {
  id: MilestoneId;
  title: string;
  description: string;
  reward: string;
}

export const STORYLINE_MILESTONES_CONFIG: MilestoneConfig[] = [
  {
    id: MilestoneId.FirstGrowth,
    title: 'First Growth',
    description:
      'The foundation is set. The sapling must now grow branches and sprout leaves to gather energy.',
    reward: 'Unlocks Crown and Roots upgrades.',
  },
  {
    id: MilestoneId.Leaves10,
    title: 'Small Canopy',
    description:
      "A small canopy begins to form. More leaves are required to harness the sun's full potential.",
    reward: 'Unlocks deeper lore.',
  },
  {
    id: MilestoneId.Branches10,
    title: 'Sturdy Framework',
    description:
      'The framework strengthens. The tree reaches higher, demanding an even thicker canopy.',
    reward: 'Permanent -1% Leaf Cost per Branch (up to 80%).',
  },
  {
    id: MilestoneId.MutationUnlocked,
    title: 'Biological Adaptation',
    description:
      'The excess energy is triggering spontaneous biological adaptations. A new path unfolds.',
    reward: 'Unlocks the Mutation System (100 Leaves).',
  },
  {
    id: MilestoneId.DeepAnchorage,
    title: 'Deep Anchorage',
    description:
      'Your roots pierce through the shifting topsoil into ancient subterranean aquifers and mineral veins.',
    reward: 'x1.25 Root Water & Mineral Production (Width 10 & Depth 10).',
  },
  {
    id: MilestoneId.AncientTimber,
    title: 'Ancient Timber',
    description:
      'Mutated cells and hardened rings of bark fuse into an unyielding, colossal trunk.',
    reward: 'x1.25 Global Max Capacity (Bark 10 & 3 Mutations).',
  },
  {
    id: MilestoneId.BloomUnlocked,
    title: 'The Awakening',
    description:
      'A profound shift ripples through your sap. Survival is no longer enough—it is time to create new life.',
    reward: 'Unlocks the Life Cycle Tab (300 Leaves).',
  },
  {
    id: MilestoneId.ApexFlora,
    title: 'Apex Flora',
    description:
      'Towering above the world with a fully mutated genome, your canopy drinks the sun like a living star.',
    reward: 'x1.5 Total Energy Generation (500 Leaves & 6 Mutations).',
  },
  {
    id: MilestoneId.MetabolicOverdrive,
    title: 'Metabolic Overdrive',
    description:
      'Your vascular system can now funnel massive surpluses of raw sap directly into genetic restructuring.',
    reward: 'Unlocks Over-Mutation toggle (+5% mutation speed per extra multiple of base drain).',
  },
];
