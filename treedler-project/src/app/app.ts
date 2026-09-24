import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLoopService } from './core/services/game-loop';
import { StorylineService } from './core/services/storyline.service';
import { SidebarComponent } from './features/sidebar/sidebar';
import { TreeTabComponent } from './features/tabs/tree-tab/tree-tab';
import { TabId } from './core/enums/tab.enum';
import { SettingsTabComponent } from './features/tabs/settings-tab/settings-tab';
import { ResearchTabComponent } from './features/tabs/research-tab/research-tab';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TreeTabComponent,
    SettingsTabComponent,
    ResearchTabComponent,
  ],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  private gameLoop = inject(GameLoopService);
  public storylineService = inject(StorylineService);

  // ==========================================
  // 2. STATE & CONSTANTS
  // ==========================================

  public activeTab = signal<TabId>(TabId.Tree);
  public Tab = TabId;

  // ==========================================
  // 3. LIFECYCLE & ROUTING
  // ==========================================

  ngOnInit(): void {
    this.gameLoop.start();
  }

  public switchTab(tab: TabId): void {
    this.activeTab.set(tab);
  }
}
