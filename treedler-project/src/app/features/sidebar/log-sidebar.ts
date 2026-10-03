import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../core/services/log.service';
import { LogCategory } from '../../core/enums/log.enum';

@Component({
  selector: 'app-log-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-sidebar.html',
})
export class LogSidebarComponent {
  public logService = inject(LogService);

  public LogCategory = LogCategory;
  public activeFilter = signal<LogCategory | 'All'>('All');

  public filteredLogs = computed(() => {
    const logs = this.logService.logs();
    const filter = this.activeFilter();

    if (filter === 'All') {
      return logs;
    }
    return logs.filter((log) => log.category === filter);
  });

  public setFilter(filter: LogCategory | 'All'): void {
    this.activeFilter.set(filter);
  }

  public getCategoryColor(category: LogCategory): string {
    switch (category) {
      case LogCategory.Story:
        return 'text-amber-400';
      case LogCategory.Progress:
        return 'text-green-400';
      case LogCategory.Random:
        return 'text-purple-400';
      default:
        return 'text-gray-300';
    }
  }
}
