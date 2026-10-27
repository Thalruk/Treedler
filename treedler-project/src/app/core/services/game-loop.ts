import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource.service';
import { UpgradeService } from './upgrade.service';
import { SaveService } from './save.service';
import { LogService } from './log.service';
import { StorylineService } from './storyline.service';
import { MutationService } from './mutation.service';
import { BloomService } from './bloom.service';

@Injectable({ providedIn: 'root' })
export class GameLoopService {
  private resourceService = inject(ResourceService);
  private upgradeService = inject(UpgradeService);
  private saveService = inject(SaveService);
  private logService = inject(LogService);
  private storylineService = inject(StorylineService);
  private mutationService = inject(MutationService);
  private bloomService = inject(BloomService);

  private fastIntervalId: ReturnType<typeof setInterval> | null = null;
  private slowIntervalId: ReturnType<typeof setInterval> | null = null;

  private readonly FAST_TICK_RATE = 100; // 10x per second
  private readonly SLOW_TICK_RATE = 1000; // 1x per second

  private secondsCounter = 0;

  public start(): void {
    if (this.fastIntervalId) return;

    this.fastIntervalId = setInterval(() => {
      this.fastTick();
    }, this.FAST_TICK_RATE);

    this.slowIntervalId = setInterval(() => {
      this.slowTick();
    }, this.SLOW_TICK_RATE);
  }

  public stop(): void {
    if (this.fastIntervalId) {
      clearInterval(this.fastIntervalId);
      this.fastIntervalId = null;
    }
    if (this.slowIntervalId) {
      clearInterval(this.slowIntervalId);
      this.slowIntervalId = null;
    }
  }

  private fastTick(): void {
    const deltaTime = this.FAST_TICK_RATE / 1000;

    // 1. Drain resources for active mutations & bloom FIRST
    this.mutationService.tick(deltaTime);
    this.bloomService.tick(deltaTime);

    // 2. Produce resources & update maxCapacity SECOND so full storage clamps cleanly without jitter
    this.resourceService.tick(
      deltaTime,
      {
        water: this.upgradeService.waterGeneration(),
        minerals: this.upgradeService.mineralsGeneration(),
        energy: this.upgradeService.energyGeneration(),
      },
      {
        water: this.upgradeService.waterMaxCapacity(),
        minerals: this.upgradeService.mineralsMaxCapacity(),
        energy: this.upgradeService.energyMaxCapacity(),
      },
    );
  }

  private slowTick(): void {
    this.secondsCounter++;

    this.storylineService.checkMilestones();
    this.logService.checkStoryLogs();

    if (this.secondsCounter % 30 === 0) {
      this.saveService.saveGame();
    }

    if (this.secondsCounter % 60 === 0) {
      if (Math.random() < 0.25) {
        this.logService.triggerRandomFlavorEvent();
      }
    }
  }
}
