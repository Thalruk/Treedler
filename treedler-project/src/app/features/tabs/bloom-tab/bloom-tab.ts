import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BloomService } from '../../../core/services/bloom.service';
import { ResourceId, ResourceName } from '../../../core/enums/resource.enum';

@Component({
  selector: 'app-bloom-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bloom-tab.html',
})
export class BloomTabComponent {
  public bloomService = inject(BloomService);
  public ResourceName = ResourceName;

  public getInvested(resourceId: ResourceId): number {
    const invested = this.bloomService.invested();
    return invested[resourceId] || 0;
  }
}
