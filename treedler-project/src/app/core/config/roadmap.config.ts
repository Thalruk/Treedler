export interface RoadmapVersion {
  title: string;
  colorClass: string;
  items: string[];
}

export interface RoadmapConfig {
  requiredCompletedMutations: number;
  requiredBranchLevel: number;

  currentVersion: RoadmapVersion;
  upcomingVersion: RoadmapVersion;
}

export const ROADMAP_CONFIG: RoadmapConfig = {
  requiredCompletedMutations: 12,
  requiredBranchLevel: 20,

  currentVersion: {
    title: '✅ Version 0.1 (Current Build)',
    colorClass: 'text-green-400',
    items: [
      'Core resource loop (Water, Minerals, Energy) & Leaf upkeep pressure.',
      'Dynamic multi-tier capacity specialization (Bark, Canopy, Roots).',
      '12-node gradual mutation tree & Metabolic Overdrive (Over-Mutation).',
      'Procedural Web Audio API soundscape & full tooltips telemetry.',
    ],
  },

  upcomingVersion: {
    title: '🚀 Version 0.2 (Upcoming)',
    colorClass: 'text-amber-400',
    items: [
      'The Great Rebirth (Prestige System): Channel your ultimate life cycle into permanent DNA seeds and epigenetic traits.',
      'Hold-to-Buy & Advanced Quality of Life settings.',
    ],
  },
};
