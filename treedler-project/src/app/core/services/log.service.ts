import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';
import { LogCategory } from '../enums/log.enum';
import { RANDOM_FLAVOR_EVENTS } from '../config/random-events.config';

export interface LogEntry {
  id: string;
  text: string;
  category: LogCategory;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  private upgradeService = inject(UpgradeService);

  public logs = signal<LogEntry[]>([]);
  public hasUnreadLogs = signal<boolean>(false);

  public loggedFirstGrowth = signal<boolean>(false);
  public logged10Leaves = signal<boolean>(false);
  public logged25Leaves = signal<boolean>(false);
  public logged10Branches = signal<boolean>(false);
  public loggedMutation = signal<boolean>(false);

  public addLog(text: string, category: LogCategory = LogCategory.Random): void {
    this.logs.update((currentLogs) => [
      ...currentLogs,
      { id: Math.random().toString(36).substring(2, 9), text, category },
    ]);
    this.hasUnreadLogs.set(true);
  }

  public markAsRead(): void {
    if (this.hasUnreadLogs()) {
      this.hasUnreadLogs.set(false);
    }
  }

  private lastRandomEventIndex: number = -1;

  public triggerRandomFlavorEvent(): void {
    const events = RANDOM_FLAVOR_EVENTS;
    if (events.length === 0) return;

    let randomIndex = Math.floor(Math.random() * events.length);

    if (randomIndex === this.lastRandomEventIndex && events.length > 1) {
      randomIndex = (randomIndex + 1) % events.length;
    }

    this.lastRandomEventIndex = randomIndex;
    this.addLog(events[randomIndex], LogCategory.Random);
  }

  public checkStoryLogs(): void {
    const leaves = this.upgradeService.leaf.level();
    const branches = this.upgradeService.branch.level();

    if (
      !this.loggedFirstGrowth() &&
      this.upgradeService.hasFirstStem() &&
      this.upgradeService.hasFirstRoot()
    ) {
      this.loggedFirstGrowth.set(true);
      this.addLog(
        'The foundation is set. The sapling must now grow branches and sprout leaves to gather energy.',
        LogCategory.Progress,
      );
    }

    if (!this.logged10Leaves() && leaves >= 10) {
      this.logged10Leaves.set(true);
      this.addLog(
        "A small canopy begins to form. More leaves are required to harness the sun's full potential.",
        LogCategory.Progress,
      );
    }

    if (!this.logged25Leaves() && leaves >= 25) {
      this.logged25Leaves.set(true);
      this.addLog(
        "The tree's demand for energy grows. You must multiply the leaves to prepare for the first mutation.",
        LogCategory.Progress,
      );
    }

    if (!this.logged10Branches() && branches >= 10) {
      this.logged10Branches.set(true);
      this.addLog(
        'The framework strengthens. The tree reaches higher, demanding an even thicker canopy.',
        LogCategory.Progress,
      );
    }

    if (!this.loggedMutation() && leaves >= 100) {
      this.loggedMutation.set(true);
      this.addLog(
        'The excess energy is triggering spontaneous biological adaptations. A new path unfolds.',
        LogCategory.Story,
      );
    }
  }
}
