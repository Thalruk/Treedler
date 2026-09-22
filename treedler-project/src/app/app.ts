import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLoopService } from './core/services/game-loop';
import { SidebarComponent } from './features/sidebar/sidebar';
import { TreeTabComponent } from './features/tabs/tree-tab/tree-tab';

// Definiujemy dostępne zakładki
type Tab = 'tree' | 'research' | 'mana';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TreeTabComponent],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  private gameLoop = inject(GameLoopService);

  public activeTab = signal<Tab>('tree');

  ngOnInit(): void {
    this.gameLoop.start();
  }

  public switchTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}
