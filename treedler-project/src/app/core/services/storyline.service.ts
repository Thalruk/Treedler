import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';

@Injectable({ providedIn: 'root' })
export class StorylineService {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  private upgradeService = inject(UpgradeService);

  // ==========================================
  // 2. STATE (SIGNALS)
  // ==========================================

  public isMutationUnlocked = signal<boolean>(false);
  public hasReachedLeafMilestone = signal<boolean>(false);

  // ==========================================
  // 3. LOGIC
  // ==========================================

  public checkMilestones(): void {
    // Zmieniony limit z 10 na 30
    if (!this.hasReachedLeafMilestone() && this.upgradeService.leaf.level() >= 30) {
      this.hasReachedLeafMilestone.set(true);
      this.isMutationUnlocked.set(true);

      console.log(
        'Storyline unlocked: The excess energy is triggering spontaneous biological adaptations.',
      );
    }
  }
}
