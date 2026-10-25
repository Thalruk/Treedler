import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorylineService } from '../../../core/services/storyline.service';
import {
  STORYLINE_MILESTONES_CONFIG,
  MilestoneConfig,
} from '../../../core/config/storyline.config';

interface MilestoneView extends MilestoneConfig {
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

  public milestones = computed<MilestoneView[]>(() =>
    STORYLINE_MILESTONES_CONFIG.map((config) => ({
      ...config,
      isUnlocked: () => this.storylineService.isMilestoneUnlocked(config.id),
    })),
  );
}
