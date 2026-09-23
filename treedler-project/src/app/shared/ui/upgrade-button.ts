import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UpgradeCost {
  amount: number;
  resourceName: string;
}

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrade-button.html',
})
export class UpgradeButtonComponent {
  @Input({ required: true }) title!: string;
  @Input() description: string = '';
  @Input({ required: true }) costs!: UpgradeCost[];
  @Input({ required: true }) effect!: string;
  @Input({ required: true }) canAfford!: boolean;

  @Input() customClasses: string =
    'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 border-gray-600 disabled:border-gray-800';

  @Output() buy = new EventEmitter<void>();

  public isHovered = signal<boolean>(false);
  public position = signal<'top' | 'bottom'>('bottom');

  public onMouseEnter(event: MouseEvent): void {
    const buttonElement = event.currentTarget as HTMLElement;
    const rect = buttonElement.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow < 150) {
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
