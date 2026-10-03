import { Injectable, signal } from '@angular/core';
import { LogCategory } from '../enums/log.enum';

export interface LogMessage {
  id: string;
  timestamp: number;
  text: string;
  category: LogCategory;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  public logs = signal<LogMessage[]>([]);
  private readonly MAX_LOGS = 200;

  public addLog(text: string, category: LogCategory): void {
    const newLog: LogMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      text,
      category,
    };

    this.logs.update((currentLogs) => {
      const updated = [newLog, ...currentLogs];
      return updated.length > this.MAX_LOGS ? updated.slice(0, this.MAX_LOGS) : updated;
    });
  }

  public clearLogs(): void {
    this.logs.set([]);
  }
}
