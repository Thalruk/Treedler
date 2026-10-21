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
      reward: 'Permanent -10% Leaf Cost.',
      isUnlocked: () => this.storylineService.hasReached10Branches(),
    },
    {
      id: 'mutation_unlocked',
      title: 'Biological Adaptation',
      description:
        'The excess energy is triggering spontaneous biological adaptations. A new path unfolds.',
      reward: 'Unlocks the Mutation System.',
      isUnlocked: () => this.storylineService.hasReachedLeafMilestone(),
    },
  ]);
}
