import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource';
import { SaveService } from './save.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private resourceService = inject(ResourceService);
  private saveService = inject(SaveService);

  private lastTickTime: number = 0;
  private lastSaveTime: number = 0;
  private isRunning: boolean = false;
  private tickInterval: any;

  private ticksPerSecond: number = 10;
  private saveIntervalSeconds: number = 30;

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

  private updateGame(deltaTime: number): void {
    this.resourceService.tick(deltaTime);
  }
}
