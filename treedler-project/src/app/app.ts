import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLoopService } from './core/services/game-loop';
import { StorylineService } from './core/services/storyline.service';
import { SidebarComponent } from './features/sidebar/resource-sidebar/resource-sidebar';
import { TreeTabComponent } from './features/tabs/tree-tab/tree-tab';
import { TabId } from './core/enums/tab.enum';
import { SettingsTabComponent } from './features/tabs/settings-tab/settings-tab';
import { MutationTabComponent } from './features/tabs/mutation-tab/mutation-tab';
import { LogSidebarComponent } from './features/sidebar/log-sidebar/log-sidebar';
import { StorylineTabComponent } from './features/tabs/storyline-tab/storyline-tab';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TreeTabComponent,
    SettingsTabComponent,
    MutationTabComponent,
    LogSidebarComponent,
    StorylineTabComponent,
  ],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  private gameLoop = inject(GameLoopService);
  public storylineService = inject(StorylineService);
  public activeTab = signal<TabId>(TabId.Tree);
  public Tab = TabId;

  ngOnInit(): void {
    this.gameLoop.start();
  }

  public switchTab(tab: TabId): void {
    this.activeTab.set(tab);
  }
}
