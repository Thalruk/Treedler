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

  public isResearchUnlocked = signal<boolean>(false);
  public hasReachedTenLeaves = signal<boolean>(false);

  // ==========================================
  // 3. LOGIC
  // ==========================================

  public checkMilestones(): void {
    if (!this.hasReachedTenLeaves() && this.upgradeService.leafLevel() >= 10) {
      this.hasReachedTenLeaves.set(true);
      this.isResearchUnlocked.set(true);

      console.log(
        'Storyline unlocked: You realized there is more to growing than just drinking water.',
      );
    }
  }
}
