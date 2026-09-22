import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../../core/services/resource';
import { UpgradeService } from '../../../core/services/upgrade.service';
import { UpgradeButtonComponent } from '../../../shared/ui/upgrade-button';

@Component({
  selector: 'app-tree-tab',
  standalone: true,
  imports: [CommonModule, UpgradeButtonComponent],
  templateUrl: './tree-tab.html',
})
export class TreeTabComponent {
  public resourceService = inject(ResourceService);
  public upgradeService = inject(UpgradeService);
}
