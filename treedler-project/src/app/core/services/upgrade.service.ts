import { Injectable, signal, computed, inject } from '@angular/core';
import { ResourceService } from './resource.service';
import { ResourceId, ResourceName } from '../enums/resource.enum';
import { MutationService } from './mutation.service';
import { UpgradeBase } from '../classes/upgrade-base';
import { ShortcutService } from './shortcut.service';
import { UPGRADES_CONFIG } from '../config/upgrades.config';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  private resourceService = inject(ResourceService);
  private mutationService = inject(MutationService);
  private shortcutService = inject(ShortcutService);

  // ==========================================
  // 1. MILESTONES & BASE COSTS
  // ==========================================

  public hasFirstRoot = signal<boolean>(false);
  public hasFirstStem = signal<boolean>(false);

  // STORYLINE PERMANENT REWARDS
  public hasPermanentLeafDiscount = signal<boolean>(false);
  public hasDeepAnchorageBonus = signal<boolean>(false);
  public hasAncientTimberBonus = signal<boolean>(false);
  public hasApexFloraBonus = signal<boolean>(false);

  public readonly firstRootCost = 5;
  public readonly firstStemCost = 5;

  // ==========================================
  // 2. UPGRADES REGISTRY
  // ==========================================

  // --- CROWN ---
  public branch = new UpgradeBase('branch', UPGRADES_CONFIG['branch']);
  public leaf = new UpgradeBase('leaf', UPGRADES_CONFIG['leaf']);
  public sunwardReach = new UpgradeBase('sunwardReach', UPGRADES_CONFIG['sunwardReach']);
  public canopySpread = new UpgradeBase('canopySpread', UPGRADES_CONFIG['canopySpread']);

  // --- BARK ---
  public barkThickness = new UpgradeBase('barkThickness', UPGRADES_CONFIG['barkThickness']);
  public vascularTissues = new UpgradeBase('vascularTissues', UPGRADES_CONFIG['vascularTissues']);
  public resinSecretion = new UpgradeBase('resinSecretion', UPGRADES_CONFIG['resinSecretion']);

  // --- ROOTS ---
  public rootWidth = new UpgradeBase('rootWidth', UPGRADES_CONFIG['rootWidth']);
  public rootDepth = new UpgradeBase('rootDepth', UPGRADES_CONFIG['rootDepth']);
  public rootHairs = new UpgradeBase('rootHairs', UPGRADES_CONFIG['rootHairs']);
  public mycorrhizalNetwork = new UpgradeBase(
    'mycorrhizalNetwork',
    UPGRADES_CONFIG['mycorrhizalNetwork'],
  );
  public rootVigor = new UpgradeBase('rootVigor', UPGRADES_CONFIG['rootVigor']);

  // ==========================================
  // 3. LIMITS & CONSTRAINTS (DYNAMIC CAPS)
  // ==========================================

  public leavesPerBranch = computed(() => {
    let base = 10;
    if (this.mutationService.isCompleted('dense_branching')) base += 5;
    if (this.mutationService.isCompleted('fractal_canopy')) base += 10;
    return base;
  });

  public maxLeaves = computed(() => this.branch.level() * this.leavesPerBranch());

  public maxSunwardReach = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted('chloroplast_refinement')) cap += 5; // 8
    if (this.mutationService.isCompleted('fractal_canopy')) cap += 7; // 15
    return cap;
  });

  public maxCanopySpread = computed(() => {
    let cap = 5;
    if (this.mutationService.isCompleted('dense_branching')) cap += 5; // 10
    if (this.mutationService.isCompleted('fractal_canopy')) cap += 10; // 20
    return cap;
  });

  public maxVascularTissues = computed(() => {
    let cap = 5;
    if (this.mutationService.isCompleted('stomata_optimization')) cap += 7; // 12
    if (this.mutationService.isCompleted('heartwood_formation')) cap += 8; // 20
    return cap;
  });

  public maxResinSecretion = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted('heartwood_formation')) cap += 5; // 8
    if (this.mutationService.isCompleted('fractal_canopy')) cap += 7; // 15
    return cap;
  });

  public maxRootHairs = computed(() => {
    let cap = 5;
    if (this.mutationService.isCompleted('dense_branching')) cap += 5; // 10
    if (this.mutationService.isCompleted('symbiotic_mycelium')) cap += 10; // 20
    return cap;
  });

  public maxMycorrhizalNetwork = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted('symbiotic_mycelium')) cap += 7; // 10
    return cap;
  });

  public maxRootVigor = computed(() => {
    let cap = 3;
    if (this.mutationService.isCompleted('symbiotic_mycelium')) cap += 7; // 10
    return cap;
  });

  public isMaxed(upgrade: UpgradeBase, limit?: number): boolean {
    return limit !== undefined && upgrade.level() >= limit;
  }

  // ==========================================
  // 4. RESOURCE GENERATION & BREAKDOWNS
  // ==========================================

  public leafResourceUpkeep = computed(() =>
    this.mutationService.isCompleted('stomata_optimization') ? 0.013 : 0.02,
  );

  public leafEnergyBase = computed(() => 0.1);

  public leafEnergyMultiplier = computed(() => {
    let mult = 1.0;
    if (this.mutationService.isCompleted('chloroplast_refinement')) mult *= 1.4;
    if (this.hasApexFloraBonus()) mult *= 1.5;
    return mult;
  });

  public singleLeafEnergy = computed(
    () => (this.leafEnergyBase() + this.sunwardReach.level() * 0.03) * this.leafEnergyMultiplier(),
  );

  public rootMultiplier = computed(() => {
    const vigorMult = 1 + this.rootVigor.level() * 0.1;
    const anchorageMult = this.hasDeepAnchorageBonus() ? 1.25 : 1.0;
    return vigorMult * anchorageMult;
  });

  public waterGeneration = computed(() => {
    const base = this.hasFirstRoot() ? 1 : 0;
    const myceliumBonus = this.mutationService.isCompleted('symbiotic_mycelium')
      ? this.mycorrhizalNetwork.level() * 2
      : 0;
    const fromRoots =
      (this.rootWidth.level() * 1 + this.rootHairs.level() * 2.5 + myceliumBonus) *
      this.rootMultiplier();
    const leafUpkeep = this.leaf.level() * this.leafResourceUpkeep();
    return base + fromRoots - leafUpkeep;
  });

  public waterBreakdown = computed(() => {
    const myceliumBonus = this.mutationService.isCompleted('symbiotic_mycelium')
      ? this.mycorrhizalNetwork.level() * 2
      : 0;
    return {
      base: this.hasFirstRoot() ? 1 : 0,
      rootWidth: this.rootWidth.level() * 1,
      rootHairs: this.rootHairs.level() * 2.5,
      myceliumWater: myceliumBonus,
      rootVigorPercent: this.rootVigor.level() * 10,
      subtotalRoots:
        (this.rootWidth.level() * 1 + this.rootHairs.level() * 2.5 + myceliumBonus) *
        this.rootMultiplier(),
      leaves: -(this.leaf.level() * this.leafResourceUpkeep()),
    };
  });

  public mineralsGeneration = computed(() => {
    const base = this.hasFirstRoot() ? 1 : 0;
    const fromRoots =
      (this.rootDepth.level() * 1 + this.mycorrhizalNetwork.level() * 3.5) * this.rootMultiplier();
    const leafUpkeep = this.leaf.level() * this.leafResourceUpkeep();
    return base + fromRoots - leafUpkeep;
  });

  public mineralsBreakdown = computed(() => ({
    base: this.hasFirstRoot() ? 1 : 0,
    rootDepth: this.rootDepth.level() * 1,
    mycorrhizalNetwork: this.mycorrhizalNetwork.level() * 3.5,
    rootVigorPercent: this.rootVigor.level() * 10,
    subtotalRoots:
      (this.rootDepth.level() * 1 + this.mycorrhizalNetwork.level() * 3.5) * this.rootMultiplier(),
    leaves: -(this.leaf.level() * this.leafResourceUpkeep()),
  }));

  public energyGeneration = computed(() => {
    const apexMult = this.hasApexFloraBonus() ? 1.5 : 1.0;
    const base = (this.hasFirstStem() ? 1 : 0) * apexMult;
    const fromLeaves = this.leaf.level() * this.singleLeafEnergy();
    const fromVascular = this.vascularTissues.level() * 1.5 * apexMult;
    const fromMycelium =
      (this.mutationService.isCompleted('symbiotic_mycelium')
        ? this.mycorrhizalNetwork.level() * 2
        : 0) * apexMult;
    return base + fromLeaves + fromVascular + fromMycelium;
  });

  public energyBreakdown = computed(() => {
    const apexMult = this.hasApexFloraBonus() ? 1.5 : 1.0;
    return {
      base: (this.hasFirstStem() ? 1 : 0) * apexMult,
      leaves: this.leaf.level() * this.singleLeafEnergy(),
      vascularTissues: this.vascularTissues.level() * 1.5 * apexMult,
      symbioticMycelium:
        (this.mutationService.isCompleted('symbiotic_mycelium')
          ? this.mycorrhizalNetwork.level() * 2
          : 0) * apexMult,
    };
  });

  // ==========================================
  // 5. CAPACITY CALCULATION & BREAKDOWN
  // ==========================================

  public capacityBreakdown = computed(() => {
    const base = this.hasFirstStem() ? 30 : 10;
    const bark = this.barkThickness.level() * 25;
    const vascularTissues = this.vascularTissues.level() * 20;
    const canopySpread = this.canopySpread.level() * 75;
    const resinSecretion = this.resinSecretion.level() * 100;

    const flatTotal = base + bark + vascularTissues + canopySpread + resinSecretion;
    const resinMultiplier = 1 + this.resinSecretion.level() * 0.1;
    const heartwoodMultiplier = this.mutationService.isCompleted('heartwood_formation') ? 1.5 : 1.0;
    const timberMultiplier = this.hasAncientTimberBonus() ? 1.25 : 1.0;

    const total = Math.floor(flatTotal * resinMultiplier * heartwoodMultiplier * timberMultiplier);

    return {
      base,
      bark,
      vascularTissues,
      canopySpread,
      resinSecretion,
      resinPercent: this.resinSecretion.level() * 10,
      hasHeartwood: this.mutationService.isCompleted('heartwood_formation'),
      hasAncientTimber: this.hasAncientTimberBonus(),
      total,
    };
  });

  public totalMaxCapacity = computed(() => this.capacityBreakdown().total);

  // ==========================================
  // 6. HELPER METHODS FOR UI & MULTIPLIERS
  // ==========================================

  private getResourceAmount(id: ResourceId): number {
    if (id === ResourceId.Water) return this.resourceService.water().amount;
    if (id === ResourceId.Minerals) return this.resourceService.minerals().amount;
    if (id === ResourceId.Energy) return this.resourceService.energy().amount;
    return 0;
  }

  private getResourceMaxAmount(id: ResourceId): number {
    if (id === ResourceId.Water) return this.resourceService.water().maxAmount;
    if (id === ResourceId.Minerals) return this.resourceService.minerals().maxAmount;
    if (id === ResourceId.Energy) return this.resourceService.energy().maxAmount;
    return 0;
  }

  public getAffordableQuantity(
    upgrade: UpgradeBase,
    requestedQuantity: number,
    limit?: number,
  ): number {
    const maxAllowed = limit !== undefined ? limit - upgrade.level() : Infinity;
    if (maxAllowed <= 0) return 0;

    const cap = Math.min(requestedQuantity, maxAllowed);
    let affordableQty = 0;

    for (let i = 1; i <= cap; i++) {
      const costs = this.getCostsForQuantity(upgrade, i);
      const canAfford = costs.every((c) => this.getResourceAmount(c.resourceId) >= c.amount);

      if (canAfford) {
        affordableQty = i;
      } else {
        break;
      }
    }
    return affordableQty;
  }

  public getTargetQuantity(
    upgrade: UpgradeBase,
    requestedQuantity: number,
    limit?: number,
  ): number {
    return Math.max(1, this.getAffordableQuantity(upgrade, requestedQuantity, limit));
  }

  private getCostsForQuantity(
    upgrade: UpgradeBase,
    quantity: number,
  ): { resourceId: ResourceId; amount: number }[] {
    return upgrade.costConfigs.map((config) => {
      let total = 0;
      let discount = 1.0;

      // ==========================================
      // STORYLINE MILESTONES & DYNAMIC DISCOUNTS
      // ==========================================
      if (upgrade.id === 'leaf' && this.hasPermanentLeafDiscount()) {
        const branchCount = this.branch.level();
        const discountPercentage = branchCount * 0.01;
        discount = Math.max(0.2, 1.0 - discountPercentage);
      }

      for (let i = 0; i < quantity; i++) {
        total += Math.floor(
          config.baseCost * Math.pow(config.multiplier, upgrade.level() + i) * discount,
        );
      }
      return { resourceId: config.resourceId, amount: total };
    });
  }

  public getFormattedCosts(
    upgrade: UpgradeBase,
    limit?: number,
  ): { amount: number; resourceName: string }[] {
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    return this.getCostsForQuantity(upgrade, qty)
      .sort((a, b) => a.resourceId - b.resourceId)
      .map((c) => ({
        amount: c.amount,
        resourceName: ResourceName[c.resourceId],
      }));
  }

  public canAfford(upgrade: UpgradeBase, limit?: number): boolean {
    if (this.isMaxed(upgrade, limit)) return false;
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    const costs = this.getCostsForQuantity(upgrade, qty);
    return costs.every((c) => this.getResourceAmount(c.resourceId) >= c.amount);
  }

  public isReachable(upgrade: UpgradeBase, limit?: number): boolean {
    if (this.isMaxed(upgrade, limit)) return true;
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    const costs = this.getCostsForQuantity(upgrade, qty);
    return costs.every((c) => this.getResourceMaxAmount(c.resourceId) >= c.amount);
  }

  // ==========================================
  // 7. ACTIONS (METHODS)
  // ==========================================

  public buyFirstRoot(): void {
    if (!this.hasFirstRoot() && this.resourceService.water().amount >= this.firstRootCost) {
      this.resourceService.consume(ResourceId.Water, this.firstRootCost);
      this.resourceService.unlock(ResourceId.Water);
      this.resourceService.unlock(ResourceId.Minerals);
      this.hasFirstRoot.set(true);
    }
  }

  public buyFirstStem(): void {
    if (!this.hasFirstStem() && this.resourceService.water().amount >= this.firstStemCost) {
      this.resourceService.consume(ResourceId.Water, this.firstStemCost);
      this.resourceService.unlock(ResourceId.Energy);
      this.hasFirstStem.set(true);
    }
  }

  public buyUpgrade(upgrade: UpgradeBase, limit?: number): void {
    if (this.isMaxed(upgrade, limit)) return;
    const qty = this.getTargetQuantity(upgrade, this.shortcutService.multiplier(), limit);
    if (limit !== undefined && upgrade.level() + qty > limit) return;

    if (this.canAfford(upgrade, limit)) {
      const costs = this.getCostsForQuantity(upgrade, qty);
      costs.forEach((cost) => {
        this.resourceService.consume(cost.resourceId, cost.amount);
      });

      upgrade.level.update((l) => l + qty);
    }
  }
}
