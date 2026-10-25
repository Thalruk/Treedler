import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorylineService } from '../../../core/services/storyline.service';

interface MilestoneDef {
  id: string;
  title: string;
  description: string;
  reward: string;
  isUnlocked: () => boolean;
}

@Component({
  selector: 'app-storyline-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storyline-tab.html',
})
export class StorylineTabComponent {
  public storylineService = inject(StorylineService);

  public milestones = computed<MilestoneDef[]>(() => [
    {
      id: 'first_growth',
      title: 'First Growth',
      description:
        'The foundation is set. The sapling must now grow branches and sprout leaves to gather energy.',
      reward: 'Unlocks Crown and Roots upgrades.',
      isUnlocked: () => this.storylineService.hasReachedFirstGrowth(),
    },
    {
      id: 'leaves_10',
      title: 'Small Canopy',
      description:
        "A small canopy begins to form. More leaves are required to harness the sun's full potential.",
      reward: 'Unlocks deeper lore.',
      isUnlocked: () => this.storylineService.hasReached10Leaves(),
    },
    {
      id: 'branches_10',
      title: 'Sturdy Framework',
      description:
        'The framework strengthens. The tree reaches higher, demanding an even thicker canopy.',
      reward: 'Permanent -1% Leaf Cost per Branch (up to 80%).',
      isUnlocked: () => this.storylineService.hasReached10Branches(),
    },
    {
      id: 'mutation_unlocked',
      title: 'Biological Adaptation',
      description:
        'The excess energy is triggering spontaneous biological adaptations. A new path unfolds.',
      reward: 'Unlocks the Mutation System (100 Leaves).',
      isUnlocked: () => this.storylineService.hasReachedLeafMilestone(),
    },
    {
      id: 'deep_anchorage',
      title: 'Deep Anchorage',
      description:
        'Your roots pierce through the shifting topsoil into ancient subterranean aquifers and mineral veins.',
      reward: 'x1.25 Root Water & Mineral Production (Width 10 & Depth 10).',
      isUnlocked: () => this.storylineService.hasReachedDeepAnchorage(),
    },
    {
      id: 'ancient_timber',
      title: 'Ancient Timber',
      description:
        'Mutated cells and hardened rings of bark fuse into an unyielding, colossal trunk.',
      reward: 'x1.25 Global Max Capacity (Bark 10 & 3 Mutations).',
      isUnlocked: () => this.storylineService.hasReachedAncientTimber(),
    },
    {
      id: 'bloom_unlocked',
      title: 'The Awakening',
      description:
        'A profound shift ripples through your sap. Survival is no longer enough—it is time to create new life.',
      reward: 'Unlocks the Life Cycle Tab (300 Leaves).',
      isUnlocked: () => this.storylineService.hasReachedBloomMilestone(),
    },
    {
      id: 'apex_flora',
      title: 'Apex Flora',
      description:
        'Towering above the world with a fully mutated genome, your canopy drinks the sun like a living star.',
      reward: 'x1.5 Total Energy Generation (500 Leaves & 6 Mutations).',
      isUnlocked: () => this.storylineService.hasReachedApexFlora(),
    },
  ]);
}
