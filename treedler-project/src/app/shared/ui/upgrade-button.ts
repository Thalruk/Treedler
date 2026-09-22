import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input({ required: true }) costs!: UpgradeCost[];
  @Input({ required: true }) effect!: string;
  @Input({ required: true }) canAfford!: boolean;

  @Input() customClasses: string =
    'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 border-gray-500 disabled:border-gray-700';
  @Input() costTextClass: string = 'text-blue-400 group-disabled:text-gray-600';

  @Output() buy = new EventEmitter<void>();
}
