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

    const rootSubs: { label: string; amountText: string; isMultiplier?: boolean }[] = [];
    if (breakdown.rootWidth > 0)
      rootSubs.push({ label: 'Expand Roots', amountText: `+${breakdown.rootWidth}` });
    if (breakdown.rootHairs > 0)
      rootSubs.push({ label: 'Root Hairs', amountText: `+${breakdown.rootHairs}` });
    if (breakdown.myceliumWater > 0)
      rootSubs.push({ label: 'Symbiotic Mycelium', amountText: `+${breakdown.myceliumWater}` });

    if (breakdown.rootVigorPercent > 0) {
      const multiplier = 1 + breakdown.rootVigorPercent / 100;
      rootSubs.push({
        label: 'Root Vigor',
        amountText: `x${multiplier.toFixed(2)}`,
        isMultiplier: true,
      });
    }

    if (breakdown.hasFibrousRootlets) {
      rootSubs.push({
        label: 'Fibrous Rootlets',
        amountText: 'x1.15',
        isMultiplier: true,
      });
    }
    if (breakdown.hasDeepTaproot) {
      rootSubs.push({
        label: 'Taproot Mut.',
        amountText: 'x1.25',
        isMultiplier: true,
      });
    }
    if (breakdown.hasDeepAnchorage) {
      rootSubs.push({
        label: 'Deep Anchorage',
        amountText: 'x1.25',
        isMultiplier: true,
      });
    }

    if (breakdown.subtotalRoots > 0) {
      items.push({
        label: 'Roots',
        amount: breakdown.subtotalRoots,
        subItems: rootSubs.length > 0 ? rootSubs : undefined,
      });
    }

    if (breakdown.sapPressure > 0)
      items.push({ label: 'Sap Pressure', amount: breakdown.sapPressure });

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

    if (breakdown.leaves > 0) {
      const leafSubs: { label: string; amountText: string; isMultiplier?: boolean }[] = [];
      if (breakdown.leafBaseTotal > 0) {
        leafSubs.push({
          label: 'Base Leaves',
          amountText: `+${breakdown.leafBaseTotal.toFixed(1)}`,
        });
      }
      if (breakdown.sunwardReachTotal > 0) {
        leafSubs.push({
          label: 'Sunward Reach',
          amountText: `+${breakdown.sunwardReachTotal.toFixed(1)}`,
        });
      }
      if (breakdown.hasChloroplast) {
        leafSubs.push({
          label: 'Chloroplast Mut.',
          amountText: 'x1.40',
          isMultiplier: true,
        });
      }

      if (breakdown.hasChloroplast) {
        leafSubs.push({
          label: 'Chloroplast Mut.',
          amountText: 'x1.25',
          isMultiplier: true,
        });
      }
      if (breakdown.hasCascade) {
        leafSubs.push({
          label: 'Photo. Cascade',
          amountText: 'x1.25',
          isMultiplier: true,
        });
      }

      if (breakdown.hasApexFlora) {
        leafSubs.push({
          label: 'Apex Flora',
          amountText: 'x1.50',
          isMultiplier: true,
        });
      }

      items.push({
        label: 'Leaves',
        amount: breakdown.leaves,
        subItems: leafSubs.length > 0 ? leafSubs : undefined,
      });
    }

    if (breakdown.vascularTissues > 0)
      items.push({ label: 'Vascular Tissues', amount: breakdown.vascularTissues });
    if (breakdown.symbioticMycelium > 0)
      items.push({ label: 'Symbiotic Mycelium', amount: breakdown.symbioticMycelium });
    if (breakdown.sapPressure > 0)
      items.push({ label: 'Sap Pressure', amount: breakdown.sapPressure });

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

    const mineralSubs: { label: string; amountText: string; isMultiplier?: boolean }[] = [];
    if (breakdown.rootDepth > 0)
      mineralSubs.push({ label: 'Deepen Roots', amountText: `+${breakdown.rootDepth}` });

    if (breakdown.mycorrhizalNetwork > 0)
      mineralSubs.push({
        label: 'Mycorrhizal Network',
        amountText: `+${breakdown.mycorrhizalNetwork}`,
      });

    if (breakdown.rootVigorPercent > 0) {
      const multiplier = 1 + breakdown.rootVigorPercent / 100;
      mineralSubs.push({
        label: 'Root Vigor',
        amountText: `x${multiplier.toFixed(2)}`,
        isMultiplier: true,
      });
    }
    if (breakdown.hasFibrousRootlets) {
      mineralSubs.push({
        label: 'Fibrous Rootlets',
        amountText: 'x1.15',
        isMultiplier: true,
      });
    }
    if (breakdown.hasDeepTaproot) {
      mineralSubs.push({
        label: 'Taproot Mut.',
        amountText: 'x1.25',
        isMultiplier: true,
      });
    }

    if (breakdown.hasDeepAnchorage) {
      mineralSubs.push({
        label: 'Deep Anchorage',
        amountText: 'x1.25',
        isMultiplier: true,
      });
    }

    if (breakdown.subtotalRoots > 0) {
      items.push({
        label: 'Roots',
        amount: breakdown.subtotalRoots,
        subItems: mineralSubs.length > 0 ? mineralSubs : undefined,
      });
    }

    if (breakdown.sapPressure > 0)
      items.push({ label: 'Sap Pressure', amount: breakdown.sapPressure });

    if (breakdown.leaves < 0)
      items.push({ label: 'Leaves Upkeep', amount: breakdown.leaves, isNegative: true });

    const mutDrain = this.mutationService.mineralsDrain();
    if (mutDrain > 0) items.push({ label: 'Mutation', amount: -mutDrain, isNegative: true });

    const bloomDrain = this.bloomService.mineralsDrain();
    if (bloomDrain > 0) items.push({ label: 'Life Cycle', amount: -bloomDrain, isNegative: true });

    return items;
  });

  private buildMultiplierItems(breakdown: {
    resinPercent: number;
    hasLignin: boolean;
    hasHeartwood: boolean;
    hasAncientTimber: boolean;
  }): ResourceBreakdownItem[] {
    const items: ResourceBreakdownItem[] = [];
    if (breakdown.resinPercent > 0) {
      const mult = 1 + breakdown.resinPercent / 100;
      items.push({ label: 'Resin Bonus', amountText: `x${mult.toFixed(2)}`, isMultiplier: true });
    }
    if (breakdown.hasLignin) {
      items.push({ label: 'Lignin Synthesis', amountText: 'x1.20', isMultiplier: true });
    }
    if (breakdown.hasHeartwood) {
      items.push({ label: 'Heartwood', amountText: 'x1.35', isMultiplier: true });
    }
    if (breakdown.hasAncientTimber) {
      items.push({ label: 'Ancient Timber', amountText: 'x1.25', isMultiplier: true });
    }
    return items;
  }

  public waterCapacityBreakdown = computed(() => {
    const b = this.upgradeService.waterCapacityBreakdown();
    const items: ResourceBreakdownItem[] = [];
    if (b.base > 0) items.push({ label: 'Base', amount: b.base });
    if (b.bark > 0) items.push({ label: 'Bark', amount: b.bark });
    if (b.rootWidthCap > 0) items.push({ label: 'Expand Roots', amount: b.rootWidthCap });
    if (b.vascularTissues > 0) items.push({ label: 'Vascular Tissues', amount: b.vascularTissues });
    if (b.canopySpread > 0) items.push({ label: 'Canopy Spread', amount: b.canopySpread });
    return [...items, ...this.buildMultiplierItems(b)];
  });

  public mineralsCapacityBreakdown = computed(() => {
    const b = this.upgradeService.mineralsCapacityBreakdown();
    const items: ResourceBreakdownItem[] = [];
    if (b.base > 0) items.push({ label: 'Base', amount: b.base });
    if (b.bark > 0) items.push({ label: 'Bark', amount: b.bark });
    if (b.rootDepthCap > 0) items.push({ label: 'Deepen Roots', amount: b.rootDepthCap });
    if (b.resinSecretion > 0) items.push({ label: 'Resin Secretion', amount: b.resinSecretion });
    return [...items, ...this.buildMultiplierItems(b)];
  });

  public energyCapacityBreakdown = computed(() => {
    const b = this.upgradeService.energyCapacityBreakdown();
    const items: ResourceBreakdownItem[] = [];
    if (b.base > 0) items.push({ label: 'Base', amount: b.base });
    if (b.bark > 0) items.push({ label: 'Bark', amount: b.bark });
    if (b.canopySpread > 0) items.push({ label: 'Canopy Spread', amount: b.canopySpread });
    if (b.resinSecretion > 0) items.push({ label: 'Resin Secretion', amount: b.resinSecretion });
    return [...items, ...this.buildMultiplierItems(b)];
  });
}
