import { LogCategory } from '../enums/log.enum';

export enum StoryLogKey {
  FirstGrowth = 'first_growth',
  FirstBark = 'first_bark',
  Leaves10 = 'leaves_10',
  Leaves25 = 'leaves_25',
  Leaves50 = 'leaves_50',
  Branches10 = 'branches_10',
  MutationUnlocked = 'mutation_unlocked',
  DeepAnchorage = 'deep_anchorage',
  AncientTimber = 'ancient_timber',
  BloomUnlocked = 'bloom_unlocked',
  ApexFlora = 'apex_flora',
  BloomComplete = 'bloom_complete',
}

export interface StoryLogConfig {
  text: string;
  category: LogCategory;
}

export const STORY_LOGS_CONFIG: Record<StoryLogKey, StoryLogConfig> = {
  [StoryLogKey.FirstGrowth]: {
    text: 'The foundation is set. The sapling must now grow branches and sprout leaves to gather energy.',
    category: LogCategory.Progress,
  },
  [StoryLogKey.FirstBark]: {
    text: 'The outer layer hardens. The tree prepares to store greater reserves of energy and water.',
    category: LogCategory.Progress,
  },
  [StoryLogKey.Leaves10]: {
    text: "A small canopy begins to form. More leaves are required to harness the sun's full potential.",
    category: LogCategory.Progress,
  },
  [StoryLogKey.Leaves25]: {
    text: "The tree's demand for energy grows. Multiply your branches and leaves to prepare for biological adaptations.",
    category: LogCategory.Progress,
  },
  [StoryLogKey.Leaves50]: {
    text: 'Fifty leaves rustle in the wind, casting a permanent, cooling shadow over the soil below.',
    category: LogCategory.Progress,
  },
  [StoryLogKey.Branches10]: {
    text: 'The framework strengthens. Each new branch now makes sprouting future leaves slightly easier.',
    category: LogCategory.Story,
  },
  [StoryLogKey.MutationUnlocked]: {
    text: 'The excess energy is triggering spontaneous biological adaptations. The Mutations tab is now unlocked.',
    category: LogCategory.Research,
  },
  [StoryLogKey.DeepAnchorage]: {
    text: 'Your roots breach deep subterranean aquifers. Water and mineral extraction permanently surged.',
    category: LogCategory.Story,
  },
  [StoryLogKey.AncientTimber]: {
    text: 'Mutated tissues and thick bark fuse into Ancient Timber, vastly expanding your internal storage.',
    category: LogCategory.Story,
  },
  [StoryLogKey.BloomUnlocked]: {
    text: 'Three hundred leaves drink the light. A profound shift in your sap unlocks the Life Cycle tab.',
    category: LogCategory.Story,
  },
  [StoryLogKey.ApexFlora]: {
    text: 'Five hundred leaves and a perfected genome. You have become Apex Flora—energy flows like a river of light.',
    category: LogCategory.Story,
  },
  [StoryLogKey.BloomComplete]: {
    text: 'The Primeval Seed has been formed. The genetic memory of this cycle is complete.',
    category: LogCategory.Story,
  },
};

export const RESEARCH_LOG_TEMPLATES = {
  mutationComplete: (title: string, effects: string[]) =>
    `Adaptation complete: ${title}. Evolutionary limits expanded (${effects.join(', ')}).`,
  bloomStageComplete: (stageName: string) => `Life Cycle phase completed: ${stageName}.`,
};
