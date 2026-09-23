import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveService } from '../../../core/services/save.service';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-tab.html',
})
export class SettingsTabComponent {
  private saveService = inject(SaveService);

  public wipeSave(): void {
    const isConfirmed = window.confirm(
      'Czy na pewno chcesz usunąć cały postęp? Tej operacji nie można cofnąć.',
    );

    if (isConfirmed) {
      this.saveService.hardReset();
    }
  }
}
