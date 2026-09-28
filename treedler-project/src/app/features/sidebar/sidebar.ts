import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../core/services/resource';
import { UpgradeService } from '../../core/services/upgrade.service';
import { MutationService } from '../../core/services/mutation.service';
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
  public mutationService = inject(MutationService);

  // ==========================================
  // 2. NET GENERATION (COMPUTED)
  // ==========================================

  public netWaterGeneration = computed(
    () => this.resourceService.water().generationPerSecond - this.mutationService.waterDrain(),
  );

  public netMineralsGeneration = computed(
    () =>
      this.resourceService.minerals().generationPerSecond - this.mutationService.mineralsDrain(),
  );

  public netEnergyGeneration = computed(
    () => this.resourceService.energy().generationPerSecond - this.mutationService.energyDrain(),
  );

  // ==========================================
  // 3. TOOLTIP BREAKDOWNS (COMPUTED)
  // ==========================================

  public waterBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.waterBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.roots > 0) items.push({ label: 'Roots', amount: breakdown.roots });
    if (breakdown.rootHairs > 0) items.push({ label: 'Root Hairs', amount: breakdown.rootHairs });
    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const drain = this.mutationService.waterDrain();
    if (drain > 0) items.push({ label: 'Mutation', amount: -drain, isNegative: true });

    return items;
  });

  public energyBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.energyBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.leaves > 0) items.push({ label: 'Leaves', amount: breakdown.leaves });
    if (breakdown.vascularTissues > 0)
      items.push({ label: 'Vascular Tissues', amount: breakdown.vascularTissues });

    const drain = this.mutationService.energyDrain();
    if (drain > 0) items.push({ label: 'Mutation', amount: -drain, isNegative: true });

    return items;
  });
  public mineralsBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.mineralsBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.roots > 0) items.push({ label: 'Roots', amount: breakdown.roots });
    if (breakdown.mycorrhizalNetwork > 0)
      items.push({ label: 'Mycorrhizal Network', amount: breakdown.mycorrhizalNetwork });
    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const drain = this.mutationService.mineralsDrain();
    if (drain > 0) items.push({ label: 'Mutation', amount: -drain, isNegative: true });

    return items;
  });

  public globalCapacityBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.capacityBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.bark > 0) items.push({ label: 'Bark', amount: breakdown.bark });
    if (breakdown.vascularTissues > 0)
      items.push({ label: 'Vascular Tissues', amount: breakdown.vascularTissues });
    if (breakdown.canopySpread > 0)
      items.push({ label: 'Canopy Spread', amount: breakdown.canopySpread });
    if (breakdown.resinSecretion > 0)
      items.push({ label: 'Resin Secretion', amount: breakdown.resinSecretion });

    return items;
  });
}
