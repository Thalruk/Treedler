import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource.service';
import { SaveService } from './save.service';
import { UpgradeService } from './upgrade.service';
import { MutationService } from './mutation.service';
import { StorylineService } from './storyline.service';
import { LogService } from './log.service';
import { BloomService } from './bloom.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================
  private resourceService = inject(ResourceService);
  private saveService = inject(SaveService);
  private upgradeService = inject(UpgradeService);
  private mutationService = inject(MutationService);
  private storylineService = inject(StorylineService);
  private logService = inject(LogService);
  private bloomService = inject(BloomService);

  // ==========================================
  // 2. STATE & CONFIG
  // ==========================================
  private lastTickTime: number = 0;
  private lastSaveTime: number = 0;
  private isRunning: boolean = false;
  private tickInterval: any;

  private ticksPerSecond: number = 10;
  private saveIntervalSeconds: number = 30;
  private timeSinceLastSlowTick: number = 0;

  // ==========================================
  // 3. LIFECYCLE
  // ==========================================
  public start(): void {
    if (this.isRunning) return;

    this.saveService.loadGame();

    this.isRunning = true;
    this.lastTickTime = Date.now();
    this.lastSaveTime = this.lastTickTime;
    this.timeSinceLastSlowTick = 0;

    const intervalMs = 1000 / this.ticksPerSecond;

    this.tickInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastTickTime) / 1000;

      this.lastTickTime = currentTime;
      this.updateGame(deltaTime);

      if ((currentTime - this.lastSaveTime) / 1000 >= this.saveIntervalSeconds) {
        this.saveService.saveGame();
        this.lastSaveTime = currentTime;
      }
    }, intervalMs);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    this.saveService.saveGame();
  }

  // ==========================================
  // 4. CORE LOGIC
  // ==========================================
  private updateGame(deltaTime: number): void {
    // ----------------------------------------
    // FAST TICK (10x per second)
    // ----------------------------------------
    const generations = {
      water: this.upgradeService.waterGeneration(),
      minerals: this.upgradeService.mineralsGeneration(),
      energy: this.upgradeService.energyGeneration(),
    };

    const maxCapacity = this.upgradeService.totalMaxCapacity();

    this.resourceService.tick(deltaTime, generations, maxCapacity);
    this.mutationService.tick(deltaTime);
    this.bloomService.tick(deltaTime);

    // ----------------------------------------
    // SLOW TICK (1x per second)
    // ----------------------------------------
    this.timeSinceLastSlowTick += deltaTime;

    if (this.timeSinceLastSlowTick >= 1.0) {
      this.storylineService.checkMilestones();
      this.logService.checkStoryLogs();

      if (Math.random() < 0.005) {
        this.logService.triggerRandomFlavorEvent();
      }

      this.timeSinceLastSlowTick -= 1.0;
    }
  }
}
