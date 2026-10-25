import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveService } from '../../../core/services/save.service';
import { AudioService } from '../../../core/services/audio.service';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-tab.html',
})
export class SettingsTabComponent {
  private saveService = inject(SaveService);
  public audioService = inject(AudioService);

  public onSfxVolumeChange(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.audioService.setSfxVolume(val);
    this.saveService.saveGame();
  }

  public onMusicVolumeChange(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.audioService.setMusicVolume(val);
    this.saveService.saveGame();
  }

  public toggleSfx(): void {
    this.audioService.toggleSfxMute();
    this.saveService.saveGame();
  }

  public toggleMusic(): void {
    this.audioService.toggleMusicMute();
    this.saveService.saveGame();
  }

  public wipeSave(): void {
    const isConfirmed = window.confirm(
      'Are you sure you want to wipe all progress? This action cannot be undone.',
    );

    if (isConfirmed) {
      this.saveService.hardReset();
    }
  }
}
