import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';
import { LogService } from './log.service';
import { LogCategory } from '../enums/log.enum';

@Injectable({ providedIn: 'root' })
export class StorylineService {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  private upgradeService = inject(UpgradeService);
  private logService = inject(LogService);
  // ==========================================
  // 2. STATE (SIGNALS)
  // ==========================================

  public isMutationUnlocked = signal<boolean>(false);
  public hasReachedLeafMilestone = signal<boolean>(false);

  // ==========================================
  // 3. LOGIC
  // ==========================================

  public checkMilestones(): void {
    if (!this.hasReachedLeafMilestone() && this.upgradeService.leaf.level() >= 30) {
      this.hasReachedLeafMilestone.set(true);
      this.isMutationUnlocked.set(true);

      this.logService.addLog(
        'The excess energy is triggering spontaneous biological adaptations. A new path unfolds.',
        LogCategory.Story,
      );
    }
  }
}
