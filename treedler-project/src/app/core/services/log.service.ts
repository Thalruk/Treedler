import { Injectable, signal, WritableSignal, inject, OnDestroy } from '@angular/core';
import { UpgradeService } from './upgrade.service';
import { MutationService } from './mutation.service';
import { BloomService } from './bloom.service';
import { LogCategory } from '../enums/log.enum';
import { MutationId } from '../enums/mutation.enum';
import { RANDOM_FLAVOR_EVENTS } from '../config/random-events.config';
import { MUTATIONS_CONFIG } from '../config/mutation.config';
import { StoryLogKey, STORY_LOGS_CONFIG, RESEARCH_LOG_TEMPLATES } from '../config/logs.config';
import { AudioService } from './audio.service';

export interface LogEntry {
  id: string;
  text: string;
  category: LogCategory;
}

@Injectable({ providedIn: 'root' })
export class LogService implements OnDestroy {
  private upgradeService = inject(UpgradeService);
  private mutationService = inject(MutationService);
  private bloomService = inject(BloomService);
  private audioService = inject(AudioService);

  public logs = signal<LogEntry[]>([]);
  public hasUnreadLogs = signal<boolean>(false);

  // PROGRESS & STORY FLAGS
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

  // RESEARCH FLAGS (MUTATIONS & BLOOM STAGES)
  public loggedCompletedMutations = signal<Partial<Record<MutationId, boolean>>>({});
  public loggedBloomStageIndex = signal<number>(0);
  public loggedBloomComplete = signal<boolean>(false);

  // RANDOM EVENT TIMER & VISIBILITY API STATE
  private readonly minRandomIntervalMs = 45_000; // 45 sekund
  private readonly maxRandomIntervalMs = 120_000; // 120 sekund
  private remainingTimeMs = 0;
  private lastStartTimestamp = 0;
  private randomTimerId: ReturnType<typeof setTimeout> | null = null;
  private lastRandomEventIndex: number = -1;

  private readonly visibilityHandler = () => this.handleVisibilityChange();

  constructor() {
    document.addEventListener('visibilitychange', this.visibilityHandler);
    this.scheduleNextRandomEvent();
  }

  public ngOnDestroy(): void {
    this.clearRandomTimer();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  // ----------------------------------------
  // SMART RANDOM EVENT SCHEDULER (RNG + VISIBILITY)
  // ----------------------------------------
  private scheduleNextRandomEvent(): void {
    this.remainingTimeMs = this.getRandomDuration(
      this.minRandomIntervalMs,
      this.maxRandomIntervalMs,
    );

    if (!document.hidden) {
      this.startRandomTimer();
    }
  }

  private startRandomTimer(): void {
    this.clearRandomTimer();
    this.lastStartTimestamp = performance.now();

    this.randomTimerId = setTimeout(() => {
      // Odpalamy losowy event tylko, gdy gracz zaczął już rosnąć (ma pierwszy pęd i korzeń)
      if (this.upgradeService.hasFirstStem() && this.upgradeService.hasFirstRoot()) {
        this.triggerRandomFlavorEvent();
      }
      this.scheduleNextRandomEvent();
    }, this.remainingTimeMs);
  }

  private pauseRandomTimer(): void {
    if (this.randomTimerId !== null) {
      clearTimeout(this.randomTimerId);
      this.randomTimerId = null;

      const elapsed = performance.now() - this.lastStartTimestamp;
      this.remainingTimeMs = Math.max(0, this.remainingTimeMs - elapsed);
    }
  }

  private clearRandomTimer(): void {
    if (this.randomTimerId !== null) {
      clearTimeout(this.randomTimerId);
      this.randomTimerId = null;
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.pauseRandomTimer();
    } else {
      this.startRandomTimer();
    }
  }

  private getRandomDuration(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ----------------------------------------
  // CORE LOGGING METHODS
  // ----------------------------------------
  public addLog(text: string, category: LogCategory = LogCategory.Random): void {
    this.logs.update((currentLogs) => [
      ...currentLogs,
      { id: Math.random().toString(36).substring(2, 9), text, category },
    ]);
    if (category === LogCategory.Story || category === LogCategory.Research) {
      this.audioService.playUnlock();
    }
    this.hasUnreadLogs.set(true);
  }

  private triggerStoryLog(key: StoryLogKey, flag: WritableSignal<boolean>): void {
    if (!flag()) {
      flag.set(true);
      const config = STORY_LOGS_CONFIG[key];
      this.addLog(config.text, config.category);
    }
  }

  public markAsRead(): void {
    if (this.hasUnreadLogs()) {
      this.hasUnreadLogs.set(false);
    }
  }

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
    const completedMap = this.mutationService.completed();
    const completedMutationsCount = Object.values(completedMap).filter(Boolean).length;

    // ----------------------------------------
    // 1. PROGRESS & STORY LOGS
    // ----------------------------------------
    if (this.upgradeService.hasFirstStem() && this.upgradeService.hasFirstRoot()) {
      this.triggerStoryLog(StoryLogKey.FirstGrowth, this.loggedFirstGrowth);
    }
    if (bark >= 1) this.triggerStoryLog(StoryLogKey.FirstBark, this.loggedFirstBark);
    if (leaves >= 10) this.triggerStoryLog(StoryLogKey.Leaves10, this.logged10Leaves);
    if (leaves >= 25) this.triggerStoryLog(StoryLogKey.Leaves25, this.logged25Leaves);
    if (leaves >= 50) this.triggerStoryLog(StoryLogKey.Leaves50, this.logged50Leaves);
    if (branches >= 10) this.triggerStoryLog(StoryLogKey.Branches10, this.logged10Branches);
    if (leaves >= 100) this.triggerStoryLog(StoryLogKey.MutationUnlocked, this.loggedMutation);
    if (rootW >= 10 && rootD >= 10) {
      this.triggerStoryLog(StoryLogKey.DeepAnchorage, this.loggedDeepAnchorage);
    }
    if (bark >= 10 && completedMutationsCount >= 3) {
      this.triggerStoryLog(StoryLogKey.AncientTimber, this.loggedAncientTimber);
    }
    if (leaves >= 300) this.triggerStoryLog(StoryLogKey.BloomUnlocked, this.loggedBloomUnlocked);
    if (leaves >= 500 && completedMutationsCount >= 6) {
      this.triggerStoryLog(StoryLogKey.ApexFlora, this.loggedApexFlora);
    }

    // ----------------------------------------
    // 2. RESEARCH LOGS (MUTATIONS & BLOOM)
    // ----------------------------------------
    const alreadyLoggedMuts = this.loggedCompletedMutations();
    for (const mut of MUTATIONS_CONFIG) {
      if (completedMap[mut.id] && !alreadyLoggedMuts[mut.id]) {
        this.loggedCompletedMutations.update((prev) => ({ ...prev, [mut.id]: true }));
        this.addLog(
          RESEARCH_LOG_TEMPLATES.mutationComplete(mut.title, mut.effect),
          LogCategory.Research,
        );
      }
    }

    const currentBloomIdx = this.bloomService.currentStageIndex();
    if (currentBloomIdx > this.loggedBloomStageIndex()) {
      const completedStage = this.bloomService.stages[this.loggedBloomStageIndex()];
      this.loggedBloomStageIndex.set(currentBloomIdx);
      if (completedStage) {
        this.addLog(
          RESEARCH_LOG_TEMPLATES.bloomStageComplete(completedStage.name),
          LogCategory.Research,
        );
      }
    }

    if (this.bloomService.isFullyComplete()) {
      this.triggerStoryLog(StoryLogKey.BloomComplete, this.loggedBloomComplete);
    }
  }
}
