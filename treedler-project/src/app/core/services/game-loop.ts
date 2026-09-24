import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource';
import { SaveService } from './save.service';
import { UpgradeService } from './upgrade.service';
import { ResearchService } from './research.service';
import { StorylineService } from './storyline.service';

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
  private researchService = inject(ResearchService);
  private storylineService = inject(StorylineService);

  // ==========================================
  // 2. STATE & CONFIG
  // ==========================================

  private lastTickTime: number = 0;
  private lastSaveTime: number = 0;
  private isRunning: boolean = false;
  private tickInterval: any;

  private ticksPerSecond: number = 10;
  private saveIntervalSeconds: number = 30;

  // ==========================================
  // 3. LIFECYCLE
  // ==========================================

  public start(): void {
    if (this.isRunning) return;

    this.saveService.loadGame();

    this.isRunning = true;
    this.lastTickTime = Date.now();
    this.lastSaveTime = this.lastTickTime;

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

    const generations = {
      water: this.upgradeService.waterGeneration(),
      minerals: this.upgradeService.mineralsGeneration(),
      energy: this.upgradeService.energyGeneration(),
    };

    this.resourceService.tick(dt, generations);
    this.researchService.tick(dt);
    this.storylineService.checkMilestones();
  }
}
