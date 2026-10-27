import { MutationDef } from '../models/mutation.model';
import { MutationId } from '../enums/mutation.enum';
import { ResourceId } from '../enums/resource.enum';
import { UpgradeId } from '../enums/upgrade.enum';

export const MUTATIONS_CONFIG: MutationDef[] = [
  // ==========================================
  // TIER 1: STARTER ADAPTATIONS
  // ==========================================
  {
    id: MutationId.CuticleWaxing,
    title: 'Waxy Cuticle',
    description: 'Coat emerging leaves in a thin lipid film to curb excessive water evaporation.',
    requiredUpgrades: [
      { upgradeId: UpgradeId.Leaf, level: 100, label: '100 Leaves' },
      { upgradeId: UpgradeId.SunwardReach, level: 2, label: 'Sunward Reach Lv. 2' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 180, drainPerSecond: 3 },
      { resourceId: ResourceId.Water, totalRequired: 120, drainPerSecond: 2 },
    ],
    effect: [
      'Leaf Upkeep: 0.08 -> 0.065/s',
      '+5 Max Bark Thickness Level',
      '+2 Max Sunward Reach Level',
    ],
  },
  {
    id: MutationId.FibrousRootlets,
    title: 'Fibrous Rootlets',
    description:
      'Split primary roots into dense mats of fine feeder threads that cling to soil particles.',
    requiredUpgrades: [
      { upgradeId: UpgradeId.RootWidth, level: 8, label: 'Expand Roots Lv. 8' },
      { upgradeId: UpgradeId.RootDepth, level: 8, label: 'Deepen Roots Lv. 8' },
      { upgradeId: UpgradeId.RootHairs, level: 3, label: 'Root Hairs Lv. 3' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 200, drainPerSecond: 3 },
      { resourceId: ResourceId.Minerals, totalRequired: 160, drainPerSecond: 2.5 },
    ],
    effect: ['x1.15 Root Production', '+3 Max Root Hairs Level', '+2 Max Root Vigor Level'],
  },

  // ==========================================
  // TIER 2: STRUCTURAL & VASCULAR EXPANSION
  // ==========================================
  {
    id: MutationId.DenseBranching,
    title: 'Dense Branching',
    description: 'Alter nodal growth angles to pack more foliage onto every bough.',
    requiredMutations: [MutationId.CuticleWaxing],
    requiredUpgrades: [
      { upgradeId: UpgradeId.Branch, level: 12, label: '12 Branches' },
      { upgradeId: UpgradeId.CanopySpread, level: 3, label: 'Canopy Spread Lv. 3' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 350, drainPerSecond: 5 },
      { resourceId: ResourceId.Water, totalRequired: 250, drainPerSecond: 3.5 },
      { resourceId: ResourceId.Minerals, totalRequired: 250, drainPerSecond: 3.5 },
    ],
    effect: ['+3 Leaves per Branch', '+3 Max Canopy Spread Level', '+3 Max Root Hairs Level'],
  },
  {
    id: MutationId.StomataOptimization,
    title: 'Stomata Optimization',
    description:
      'Synchronize microscopic pore openings with ambient humidity to minimize transpiration loss.',
    requiredMutations: [MutationId.CuticleWaxing],
    requiredUpgrades: [
      { upgradeId: UpgradeId.Leaf, level: 150, label: '150 Leaves' },
      { upgradeId: UpgradeId.VascularTissues, level: 4, label: 'Vascular Tissues Lv. 4' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 420, drainPerSecond: 6 },
      { resourceId: ResourceId.Water, totalRequired: 320, drainPerSecond: 4.5 },
    ],
    effect: [
      'Leaf Upkeep: 0.065 -> 0.05/s',
      '+4 Max Vascular Tissues Level',
      '+3 Max Sap Pressure Level',
    ],
  },
  {
    id: MutationId.LigninSynthesis,
    title: 'Lignin Synthesis',
    description:
      'Reinforce cellular walls with complex polymers, significantly expanding internal storage.',
    requiredMutations: [MutationId.FibrousRootlets],
    requiredUpgrades: [
      { upgradeId: UpgradeId.BarkThickness, level: 10, label: 'Thicken Bark Lv. 10' },
      { upgradeId: UpgradeId.ResinSecretion, level: 2, label: 'Resin Secretion Lv. 2' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 450, drainPerSecond: 6 },
      { resourceId: ResourceId.Minerals, totalRequired: 380, drainPerSecond: 5 },
    ],
    effect: [
      'x1.25 Total Max Capacity',
      '+5 Max Bark Thickness Level',
      '+3 Max Resin Secretion Level',
    ],
  },

  // ==========================================
  // TIER 3: METABOLIC SPECIALIZATION
  // ==========================================
  {
    id: MutationId.ChloroplastRefinement,
    title: 'Chloroplast Refinement',
    description: 'Pack thylakoid membranes tighter to capture a broader spectrum of sunlight.',
    requiredMutations: [MutationId.DenseBranching],
    requiredUpgrades: [
      { upgradeId: UpgradeId.Leaf, level: 220, label: '220 Leaves' },
      { upgradeId: UpgradeId.SunwardReach, level: 5, label: 'Sunward Reach Lv. 5' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 750, drainPerSecond: 9 },
      { resourceId: ResourceId.Water, totalRequired: 500, drainPerSecond: 6 },
      { resourceId: ResourceId.Minerals, totalRequired: 500, drainPerSecond: 6 },
    ],
    effect: ['x1.30 Leaf Energy Output', '+4 Max Sunward Reach Level'],
  },
  {
    id: MutationId.XylemConduits,
    title: 'Wide Xylem Conduits',
    description:
      'Widen internal sap vessels, doubling the passive flow generated by hydrostatic pressure.',
    requiredMutations: [MutationId.StomataOptimization],
    requiredUpgrades: [
      { upgradeId: UpgradeId.VascularTissues, level: 7, label: 'Vascular Tissues Lv. 7' },
      { upgradeId: UpgradeId.SapPressure, level: 4, label: 'Sap Pressure Lv. 4' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 850, drainPerSecond: 10 },
      { resourceId: ResourceId.Water, totalRequired: 700, drainPerSecond: 8 },
    ],
    effect: [
      'Doubles Sap Pressure Output (0.12% Cap/Lvl)',
      '+5 Max Vascular Tissues Level',
      '+4 Max Sap Pressure Level',
    ],
  },
  {
    id: MutationId.SymbioticMycelium,
    title: 'Symbiotic Mycelium',
    description:
      'Fuse fungal hyphae directly into root cortex cells for bidirectional nutrient exchange.',
    requiredMutations: [MutationId.FibrousRootlets, MutationId.LigninSynthesis],
    requiredUpgrades: [
      { upgradeId: UpgradeId.MycorrhizalNetwork, level: 3, label: 'Mycorrhizal Network Lv. 3' },
      { upgradeId: UpgradeId.RootHairs, level: 6, label: 'Root Hairs Lv. 6' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 950, drainPerSecond: 11 },
      { resourceId: ResourceId.Water, totalRequired: 650, drainPerSecond: 7.5 },
      { resourceId: ResourceId.Minerals, totalRequired: 800, drainPerSecond: 9 },
    ],
    effect: [
      'Mycorrhiza grants +2.0 Water & +2.0 Energy/s',
      '+5 Max Mycorrhizal Network Level',
      '+4 Max Root Hairs Level',
    ],
  },

  // ==========================================
  // TIER 4: ADVANCED EVOLUTION
  // ==========================================
  {
    id: MutationId.DeepTaproot,
    title: 'Subterranean Taproot',
    description:
      'Drive a massive central root through bedrock fractures into pressurized mineral seams.',
    requiredMutations: [MutationId.SymbioticMycelium],
    requiredUpgrades: [
      { upgradeId: UpgradeId.RootDepth, level: 18, label: 'Deepen Roots Lv. 18' },
      { upgradeId: UpgradeId.RootVigor, level: 5, label: 'Root Vigor Lv. 5' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 1400, drainPerSecond: 15 },
      { resourceId: ResourceId.Minerals, totalRequired: 1400, drainPerSecond: 15 },
    ],
    effect: [
      'x1.30 Root Production',
      '+5 Max Root Vigor Level',
      '+3 Max Mycorrhizal Network Level',
    ],
  },
  {
    id: MutationId.HeartwoodFormation,
    title: 'Heartwood Formation',
    description:
      'Compress the inner trunk into dense, resin-infused pillars capable of holding vast reserves.',
    requiredMutations: [MutationId.LigninSynthesis, MutationId.XylemConduits],
    requiredUpgrades: [
      { upgradeId: UpgradeId.BarkThickness, level: 18, label: 'Thicken Bark Lv. 18' },
      { upgradeId: UpgradeId.ResinSecretion, level: 5, label: 'Resin Secretion Lv. 5' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 1600, drainPerSecond: 16 },
      { resourceId: ResourceId.Water, totalRequired: 1200, drainPerSecond: 12 },
      { resourceId: ResourceId.Minerals, totalRequired: 1400, drainPerSecond: 14 },
    ],
    effect: [
      'x1.40 Total Max Capacity',
      '+10 Max Bark Thickness Level',
      '+5 Max Resin Secretion Level',
      '+5 Max Sap Pressure Level',
    ],
  },
  {
    id: MutationId.PhotosyntheticCascade,
    title: 'Photosynthetic Cascade',
    description:
      'Establish secondary light-harvesting complexes that recycle photorespiratory byproducts.',
    requiredMutations: [MutationId.ChloroplastRefinement, MutationId.XylemConduits],
    requiredUpgrades: [
      { upgradeId: UpgradeId.Leaf, level: 320, label: '320 Leaves' },
      { upgradeId: UpgradeId.SunwardReach, level: 8, label: 'Sunward Reach Lv. 8' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 1900, drainPerSecond: 19 },
      { resourceId: ResourceId.Water, totalRequired: 1500, drainPerSecond: 15 },
    ],
    effect: [
      'Leaf Upkeep: 0.05 -> 0.035/s',
      'x1.30 Leaf Energy Output',
      '+5 Max Sunward Reach Level',
    ],
  },

  // ==========================================
  // TIER 5: APEX CAPSTONE
  // ==========================================
  {
    id: MutationId.FractalCanopy,
    title: 'Fractal Canopy',
    description:
      'Self-similar geometric branching eliminates self-shading across the entire crown.',
    requiredMutations: [MutationId.HeartwoodFormation, MutationId.PhotosyntheticCascade],
    requiredUpgrades: [
      { upgradeId: UpgradeId.Branch, level: 25, label: '25 Branches' },
      { upgradeId: UpgradeId.CanopySpread, level: 7, label: 'Canopy Spread Lv. 7' },
    ],
    costs: [
      { resourceId: ResourceId.Energy, totalRequired: 2800, drainPerSecond: 25 },
      { resourceId: ResourceId.Water, totalRequired: 2400, drainPerSecond: 22 },
      { resourceId: ResourceId.Minerals, totalRequired: 2400, drainPerSecond: 22 },
    ],
    effect: ['+6 Leaves per Branch', '+7 Max Canopy Spread Level', '+5 Max Resin Secretion Level'],
  },
];
