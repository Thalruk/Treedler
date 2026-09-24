import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../core/services/resource';
import { UpgradeService } from '../../core/services/upgrade.service';
import { ResearchService } from '../../core/services/research.service';
import { ResourceBarComponent, ResourceBreakdownItem } from '../../shared/ui/resource-bar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ResourceBarComponent],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  public resourceService = inject(ResourceService);
  public upgradeService = inject(UpgradeService);
  public researchService = inject(ResearchService);

  // ==========================================
  // 2. NET GENERATION (COMPUTED)
  // ==========================================

  public netWaterGeneration = computed(
    () => this.resourceService.water().generationPerSecond - this.researchService.waterDrain(),
  );

  public netMineralsGeneration = computed(
    () =>
      this.resourceService.minerals().generationPerSecond - this.researchService.mineralsDrain(),
  );

  public netEnergyGeneration = computed(
    () => this.resourceService.energy().generationPerSecond - this.researchService.energyDrain(),
  );

  // ==========================================
  // 3. TOOLTIP BREAKDOWNS (COMPUTED)
  // ==========================================

  public waterBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.waterBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.roots > 0) items.push({ label: 'Roots', amount: breakdown.roots });
    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const drain = this.researchService.waterDrain();
    if (drain > 0) items.push({ label: 'Research', amount: -drain, isNegative: true });

    return items;
  });

  public mineralsBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.mineralsBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.roots > 0) items.push({ label: 'Roots', amount: breakdown.roots });
    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const drain = this.researchService.mineralsDrain();
    if (drain > 0) items.push({ label: 'Research', amount: -drain, isNegative: true });

    return items;
  });

  public energyBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.energyBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.leaves > 0) items.push({ label: 'Leaves', amount: breakdown.leaves });

    const drain = this.researchService.energyDrain();
    if (drain > 0) items.push({ label: 'Research', amount: -drain, isNegative: true });

    return items;
  });

  public globalCapacityBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.capacityBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.bark > 0) items.push({ label: 'Bark', amount: breakdown.bark });

    return items;
  });
}
