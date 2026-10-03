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
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  private saveService = inject(SaveService);

  // ==========================================
  // 2. ACTIONS
  // ==========================================

  public wipeSave(): void {
    const isConfirmed = window.confirm(
      'Are you sure you want to wipe all progress? This action cannot be undone.',
    );

    if (isConfirmed) {
      this.saveService.hardReset();
    }
  }
}
