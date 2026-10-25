import { Injectable, signal, inject } from '@angular/core';
import { UpgradeService } from './upgrade.service';
import { MutationService } from './mutation.service';
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
  private mutationService = inject(MutationService);

  public logs = signal<LogEntry[]>([]);
  public hasUnreadLogs = signal<boolean>(false);

  public loggedFirstGrowth = signal<boolean>(false);
  public loggedFirstBark = signal<boolean>(false);
  public logged10Leaves = signal<boolean>(false);
  public logged25Leaves = signal<boolean>(false);
  public logged50Leaves = signal<boolean>(false);
  public logged10Branches = signal<boolean>(false);
  public loggedMutation = signal<boolean>(false);
  public loggedDeepAnchorage = signal<boolean>(false);
  public loggedAncientTimber = signal<boolean>(false);
  public loggedBloomUnlocked = signal<boolean>(false);
  public loggedApexFlora = signal<boolean>(false);

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
    const bark = this.upgradeService.barkThickness.level();
    const rootW = this.upgradeService.rootWidth.level();
    const rootD = this.upgradeService.rootDepth.level();
    const completedMutationsCount = Object.values(this.mutationService.completed()).filter(
      Boolean,
    ).length;

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

    if (!this.loggedFirstBark() && bark >= 1) {
      this.loggedFirstBark.set(true);
      this.addLog(
        'The outer layer hardens. The tree prepares to store greater reserves of energy and water.',
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
        "The tree's demand for energy grows. Multiply your branches and leaves to prepare for biological adaptations.",
        LogCategory.Progress,
      );
    }

    if (!this.logged50Leaves() && leaves >= 50) {
      this.logged50Leaves.set(true);
      this.addLog(
        'Fifty leaves rustle in the wind, casting a permanent, cooling shadow over the soil below.',
        LogCategory.Progress,
      );
    }

    if (!this.logged10Branches() && branches >= 10) {
      this.logged10Branches.set(true);
      this.addLog(
        'The framework strengthens. Each new branch now makes sprouting future leaves slightly easier.',
        LogCategory.Story,
      );
    }

    if (!this.loggedMutation() && leaves >= 100) {
      this.loggedMutation.set(true);
      this.addLog(
        'The excess energy is triggering spontaneous biological adaptations. The Mutations tab is now unlocked.',
        LogCategory.Story,
      );
    }

    if (!this.loggedDeepAnchorage() && rootW >= 10 && rootD >= 10) {
      this.loggedDeepAnchorage.set(true);
      this.addLog(
        'Your roots breach deep subterranean aquifers. Water and mineral extraction permanently surged.',
        LogCategory.Story,
      );
    }

    if (!this.loggedAncientTimber() && bark >= 10 && completedMutationsCount >= 3) {
      this.loggedAncientTimber.set(true);
      this.addLog(
        'Mutated tissues and thick bark fuse into Ancient Timber, vastly expanding your internal storage.',
        LogCategory.Story,
      );
    }

    if (!this.loggedBloomUnlocked() && leaves >= 300) {
      this.loggedBloomUnlocked.set(true);
      this.addLog(
        'Three hundred leaves drink the light. A profound shift in your sap unlocks the Life Cycle tab.',
        LogCategory.Story,
      );
    }

    if (!this.loggedApexFlora() && leaves >= 500 && completedMutationsCount >= 6) {
      this.loggedApexFlora.set(true);
      this.addLog(
        'Five hundred leaves and a perfected genome. You have become Apex Flora—energy flows like a river of light.',
        LogCategory.Story,
      );
    }
  }
}
