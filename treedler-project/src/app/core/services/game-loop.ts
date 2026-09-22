import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource';

@Injectable({
    providedIn: 'root'
})
export class GameLoopService {
    private resourceService = inject(ResourceService);

    private lastTickTime: number = 0;
    private isRunning: boolean = false;
    private tickInterval: any;

    private ticksPerSecond: number = 10;

    public start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTickTime = Date.now();

        const intervalMs = 1000 / this.ticksPerSecond;

        this.tickInterval = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - this.lastTickTime) / 1000;

            this.lastTickTime = currentTime;
            this.updateGame(deltaTime);
        }, intervalMs);
    }

    public stop(): void {
        this.isRunning = false;
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
        }
    }

    private updateGame(deltaTime: number): void {
        this.resourceService.tick(deltaTime);
    }
}