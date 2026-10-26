import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  public hideMaxedUpgrades = signal<boolean>(false);

  public toggleHideMaxed(): void {
    this.hideMaxedUpgrades.update((v) => !v);
  }
}
