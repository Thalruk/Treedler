import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource';
import { SaveService } from './save.service';
import { UpgradeService } from './upgrade.service';
import { MutationService } from './mutation.service';
import { StorylineService } from './storyline.service';
import { LogService } from './log.service';

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
    const dt = deltaTime;

    // ----------------------------------------
    // FAST TICK (10x per second)
    // ----------------------------------------
    const generations = {
      water: this.upgradeService.waterGeneration(),
      minerals: this.upgradeService.mineralsGeneration(),
      energy: this.upgradeService.energyGeneration(),
    };

    this.resourceService.tick(dt, generations);
    this.mutationService.tick(dt);

    // ----------------------------------------
    // SLOW TICK (1x per second)
    // ----------------------------------------
    this.timeSinceLastSlowTick += dt;

    this.timeSinceLastSlowTick += dt;

    if (this.timeSinceLastSlowTick >= 1.0) {
      this.storylineService.checkMilestones();
      this.logService.checkStoryLogs();

      // Szansa 1.5% na każdą sekundę (średnio jedno wydarzenie na ~66 sekund)
      if (Math.random() < 0.005) {
        this.logService.triggerRandomFlavorEvent();
      }

      this.timeSinceLastSlowTick -= 1.0;
    }
  }
}
