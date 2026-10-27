import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLoopService } from './core/services/game-loop';
import { SaveService } from './core/services/save.service';
import { StorylineService } from './core/services/storyline.service';
import { AudioService } from './core/services/audio.service';
import { SidebarComponent } from './features/sidebar/resource-sidebar/resource-sidebar';
import { TreeTabComponent } from './features/tabs/tree-tab/tree-tab';
import { TabId } from './core/enums/tab.enum';
import { SettingsTabComponent } from './features/tabs/settings-tab/settings-tab';
import { MutationTabComponent } from './features/tabs/mutation-tab/mutation-tab';
import { LogSidebarComponent } from './features/sidebar/log-sidebar/log-sidebar';
import { StorylineTabComponent } from './features/tabs/storyline-tab/storyline-tab';
import { BloomTabComponent } from './features/tabs/bloom-tab/bloom-tab';
import { RoadmapModalComponent } from './shared/ui/roadmap-modal/roadmap-modal';
import { RoadmapService } from './core/services/roadmap.service';

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
    BloomTabComponent,
    RoadmapModalComponent,
  ],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  private gameLoop = inject(GameLoopService);
  private saveService = inject(SaveService);
  private audioService = inject(AudioService);
  public storylineService = inject(StorylineService);
  public activeTab = signal<TabId>(TabId.Tree);
  public Tab = TabId;
  public roadmapService = inject(RoadmapService);
  ngOnInit(): void {
    this.saveService.loadGame();
    this.gameLoop.start();
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardShortcuts(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    switch (event.key) {
      case '1':
        this.switchTab(TabId.Tree);
        break;
      case '2':
        if (this.storylineService.isMutationUnlocked()) {
          this.switchTab(TabId.Mutation);
        }
        break;
      case '3':
        if (this.storylineService.isBloomUnlocked()) {
          this.switchTab(TabId.Bloom);
        }
        break;
      case '9':
        this.switchTab(TabId.Storyline);
        break;
      case '0':
        this.switchTab(TabId.Settings);
        break;
    }
  }

  public switchTab(tab: TabId): void {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      this.audioService.playTabSwitch();
    }
  }
}
