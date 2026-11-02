export interface RoadmapVersion {
  title: string;
  colorClass: string;
  items: string[];
}

export interface RoadmapConfig {
  requiredCompletedMutations: number;
  currentVersion: RoadmapVersion;
  upcomingVersion: RoadmapVersion;
}

export const ROADMAP_CONFIG: RoadmapConfig = {
  requiredCompletedMutations: 12,

  currentVersion: {
    title: 'Version 0.1 (Current Build)',
    colorClass: 'text-green-400',
    items: [
      'Core resource loop (Water, Minerals, Energy) and leaf upkeep pressure.',
      'Dynamic multi-tier capacity specialization (Bark, Canopy, Roots).',
      '12-node mutation tree and Metabolic Overdrive (Over-Mutation).',
      'Hold-to-buy, buy multipliers, and Web Audio ambience.',
    ],
  },

  upcomingVersion: {
    title: 'Version 0.2 (Upcoming)',
    colorClass: 'text-amber-400',
    items: [
      'The Great Rebirth (Prestige): channel the life cycle into permanent DNA seeds and traits.',
    ],
  },
};
