import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio.service';

export interface UpgradeCost {
  amount: number;
  resourceName: string;
}

export interface UpgradeBreakdownRow {
  label: string;
  value: string;
  tone?: 'neutral' | 'bonus' | 'total' | 'negative';
}

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrade-button.html',
  host: {
    class: 'block h-full',
  },
})
export class UpgradeButtonComponent {
  private audioService = inject(AudioService);

  // ==========================================
  // 1. INPUTS & OUTPUTS
  // ==========================================

  @Input({ required: true }) title!: string;
  @Input() description: string = '';
  @Input({ required: true }) costs!: UpgradeCost[];
  @Input({ required: true }) effect!: string[];
  @Input() breakdown: UpgradeBreakdownRow[] = [];
  @Input({ required: true }) canAfford!: boolean;
  @Input() isReachable: boolean = true;
  @Input() isMaxed: boolean = false;

  @Output() buy = new EventEmitter<void>();

  // ==========================================
  // 2. STATE (SIGNALS)
  // ==========================================

  public isHovered = signal<boolean>(false);
  public position = signal<'top' | 'bottom'>('bottom');

  // ==========================================
  // 3. UI EVENTS
  // ==========================================

  public onButtonClick(): void {
    if (this.canAfford && !this.isMaxed) {
      this.audioService.playClick();
      this.buy.emit();
    }
  }

  public onMouseEnter(event: MouseEvent): void {
    const buttonElement = event.currentTarget as HTMLElement;
    const rect = buttonElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow < 220) {
      this.position.set('top');
    } else {
      this.position.set('bottom');
    }

    this.isHovered.set(true);
  }

  public onMouseLeave(): void {
    this.isHovered.set(false);
  }
}
