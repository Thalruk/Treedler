import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MutationService } from '../../../core/services/mutation.service';
import { StorylineService } from '../../../core/services/storyline.service';
import { ResourceName } from '../../../core/enums/resource.enum';

@Component({
  selector: 'app-mutation-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mutation-tab.html',
})
export class MutationTabComponent {
  public mutationService = inject(MutationService);
  public storylineService = inject(StorylineService);
  public ResourceName = ResourceName;
}
