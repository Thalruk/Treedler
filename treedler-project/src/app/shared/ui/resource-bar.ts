import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ResourceBreakdownItem {
  label: string;
  amount: number;
  isNegative?: boolean;
}

@Component({
  selector: 'app-resource-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-bar.html',
})
export class ResourceBarComponent {
  // ==========================================
  // 1. DATA INPUTS
  // ==========================================

  @Input({ required: true }) name!: string;
  @Input({ required: true }) amount!: number;
  @Input({ required: true }) maxAmount!: number;
  @Input({ required: true }) netGeneration!: number;

  @Input({ required: true }) breakdown!: ResourceBreakdownItem[];
  @Input({ required: true }) capacityBreakdown!: ResourceBreakdownItem[];

  // ==========================================
  // 2. STYLING INPUTS
  // ==========================================

  @Input() colorClass: string = 'text-gray-200';
  @Input() bgDarkClass: string = 'bg-gray-700';
  @Input() bgLightClass: string = 'bg-gray-400';
}
