import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../../core/services/resource.service';
import { UpgradeService } from '../../../core/services/upgrade.service';
import { MutationService } from '../../../core/services/mutation.service';
import { BloomService } from '../../../core/services/bloom.service';
import {
  ResourceBarComponent,
  ResourceBreakdownItem,
} from '../../../shared/ui/resource-bar/resource-bar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ResourceBarComponent],
  templateUrl: './resource-sidebar.html',
})
export class SidebarComponent {
  // ==========================================
  // 1. INJECTIONS
  // ==========================================

  public resourceService = inject(ResourceService);
  public upgradeService = inject(UpgradeService);
  public mutationService = inject(MutationService);
  public bloomService = inject(BloomService);

  // ==========================================
  // 2. NET GENERATION (COMPUTED)
  // ==========================================

  public netWaterGeneration = computed(
    () =>
      this.resourceService.water().generationPerSecond -
      this.mutationService.waterDrain() -
      this.bloomService.waterDrain(),
  );

  public netMineralsGeneration = computed(
    () =>
      this.resourceService.minerals().generationPerSecond -
      this.mutationService.mineralsDrain() -
      this.bloomService.mineralsDrain(),
  );

  public netEnergyGeneration = computed(
    () =>
      this.resourceService.energy().generationPerSecond -
      this.mutationService.energyDrain() -
      this.bloomService.energyDrain(),
  );

  // ==========================================
  // 3. TOOLTIP BREAKDOWNS (COMPUTED)
  // ==========================================

  public waterBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.waterBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });

    const rootSubs: { label: string; amountText: string }[] = [];
    if (breakdown.rootWidth > 0)
      rootSubs.push({ label: 'Expand Roots', amountText: `+${breakdown.rootWidth}` });
    if (breakdown.rootHairs > 0)
      rootSubs.push({ label: 'Root Hairs', amountText: `+${breakdown.rootHairs}` });
    if (breakdown.myceliumWater > 0)
      rootSubs.push({ label: 'Symbiotic Mycelium', amountText: `+${breakdown.myceliumWater}` });

    if (breakdown.rootVigorPercent > 0) {
      const multiplier = 1 + breakdown.rootVigorPercent / 100;
      rootSubs.push({ label: 'Root Vigor', amountText: `x${multiplier.toFixed(1)}` });
    }

    if (breakdown.subtotalRoots > 0) {
      items.push({
        label: 'Roots',
        amount: breakdown.subtotalRoots,
        subItems: rootSubs.length > 0 ? rootSubs : undefined,
      });
    }

    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const mutDrain = this.mutationService.waterDrain();
    if (mutDrain > 0) items.push({ label: 'Mutation', amount: -mutDrain, isNegative: true });

    const bloomDrain = this.bloomService.waterDrain();
    if (bloomDrain > 0) items.push({ label: 'Life Cycle', amount: -bloomDrain, isNegative: true });

    return items;
  });

  public energyBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.energyBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.leaves > 0) items.push({ label: 'Leaves', amount: breakdown.leaves });
    if (breakdown.vascularTissues > 0)
      items.push({ label: 'Vascular Tissues', amount: breakdown.vascularTissues });
    if (breakdown.symbioticMycelium > 0)
      items.push({ label: 'Symbiotic Mycelium', amount: breakdown.symbioticMycelium });

    const mutDrain = this.mutationService.energyDrain();
    if (mutDrain > 0) items.push({ label: 'Mutation', amount: -mutDrain, isNegative: true });

    const bloomDrain = this.bloomService.energyDrain();
    if (bloomDrain > 0) items.push({ label: 'Life Cycle', amount: -bloomDrain, isNegative: true });

    return items;
  });

  public mineralsBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.mineralsBreakdown();

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });

    const mineralSubs: { label: string; amountText: string }[] = [];
    if (breakdown.rootDepth > 0)
      mineralSubs.push({ label: 'Deepen Roots', amountText: `+${breakdown.rootDepth}` });

    if (breakdown.mycorrhizalNetwork > 0)
      mineralSubs.push({
        label: 'Mycorrhizal Network',
        amountText: `+${breakdown.mycorrhizalNetwork}`,
      });

    if (breakdown.rootVigorPercent > 0) {
      const multiplier = 1 + breakdown.rootVigorPercent / 100;
      mineralSubs.push({ label: 'Root Vigor', amountText: `x${multiplier.toFixed(1)}` });
    }

    if (breakdown.subtotalRoots > 0) {
      items.push({
        label: 'Roots',
        amount: breakdown.subtotalRoots,
        subItems: mineralSubs.length > 0 ? mineralSubs : undefined,
      });
    }

    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const mutDrain = this.mutationService.mineralsDrain();
    if (mutDrain > 0) items.push({ label: 'Mutation', amount: -mutDrain, isNegative: true });

    const bloomDrain = this.bloomService.mineralsDrain();
    if (bloomDrain > 0) items.push({ label: 'Life Cycle', amount: -bloomDrain, isNegative: true });

    return items;
  });

  public globalCapacityBreakdown = computed(() => {
    const items: ResourceBreakdownItem[] = [];
    const breakdown = this.upgradeService.capacityBreakdown();

    const multiplierSubs: { label: string; amountText: string }[] = [];
    if (breakdown.resinPercent > 0) {
      const mult = 1 + breakdown.resinPercent / 100;
      multiplierSubs.push({ label: 'Resin Bonus', amountText: `x${mult.toFixed(1)}` });
    }
    if (breakdown.hasHeartwood) {
      multiplierSubs.push({ label: 'Heartwood', amountText: 'x1.5' });
    }

    if (breakdown.base > 0) items.push({ label: 'Base', amount: breakdown.base });
    if (breakdown.bark > 0) items.push({ label: 'Bark', amount: breakdown.bark });
    if (breakdown.vascularTissues > 0)
      items.push({ label: 'Vascular Tissues', amount: breakdown.vascularTissues });
    if (breakdown.canopySpread > 0)
      items.push({ label: 'Canopy Spread', amount: breakdown.canopySpread });
    if (breakdown.resinSecretion > 0)
      items.push({ label: 'Resin Secretion', amount: breakdown.resinSecretion });

    if (multiplierSubs.length > 0 && items.length > 0) {
      items[items.length - 1].subItems = multiplierSubs;
    }

    return items;
  });
}
